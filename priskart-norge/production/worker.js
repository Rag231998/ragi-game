/* PrisKart Norge Cloudflare Worker, static assets + D1.
 * Public fuel source: Drivstoffpriser Open Data, exported intermittently.
 * EV chargers: Overpass OpenStreetMap within a bounded viewport. Upgrade to NOBIL before scale.
 * Community price submissions: Turnstile + HMAC hourly rate limit + input validation + D1.
 */
const FUELS='https://drivstoffpriser.github.io/Drivstoffpriser-App/data/';
const OVERPASS='https://overpass.kumi.systems/api/interpreter';
const TYPES=new Set(['petrol95','petrol98','diesel','electric']);
function json(obj,code=200,ttl=0){
 return new Response(JSON.stringify(obj),{status:code,headers:{
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':ttl?'public, s-maxage='+ttl+', max-age='+Math.min(ttl,60):'no-store',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin'
 }});
}
function fail(msg,status=400){return json({error:msg},status)}
function validCoordinates(lat,lon){
 return Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=57.5&&lat<=71.8&&lon>=4&&lon<=32;
}
function validStationId(id){
 return typeof id==='string'&&( /^fuel:[a-zA-Z0-9_.-]{1,110}$/.test(id)||/^charge:osm:(node|way|relation):\d{1,18}$/.test(id));
}
function validateReport(body){
 const {stationId,stationName,latitude,longitude,fuelType,price}=body||{};
 const lat=Number(latitude),lon=Number(longitude),value=Number(price);
 if(!validStationId(stationId)||typeof stationName!=='string'||stationName.trim().length<2||stationName.length>120)throw Error('Ugyldig stasjon');
 if(!validCoordinates(lat,lon))throw Error('Stasjonen må være i Norge');
 if(!TYPES.has(fuelType))throw Error('Ugyldig drivstofftype');
 if(fuelType==='electric'&&!stationId.startsWith('charge:'))throw Error('Velg riktig ladestasjon');
 if(fuelType!=='electric'&&!stationId.startsWith('fuel:'))throw Error('Velg riktig bensinstasjon');
 const min=fuelType==='electric'?.1:10,max=fuelType==='electric'?30:45;
 if(!Number.isFinite(value)||value<min||value>max||Math.abs(Math.round(value*100)-value*100)>0.011)throw Error('Prisen er utenfor gyldig intervall');
 return {stationId,stationName:stationName.trim(),lat,lon,fuelType,priceCents:Math.round(value*100)};
}
async function cacheGet(url,ttl,ctx,load){
 const req=new Request('https://cached.priskart.internal/'+url);
 const cache=caches.default;const got=await cache.match(req);if(got)return got;
 const payload=await load();const response=json(payload,200,ttl);
 ctx.waitUntil(cache.put(req,response.clone()));return response;
}
async function fetchJson(url,options={},limitMs=13000){
 const control=new AbortController(),timer=setTimeout(()=>control.abort(),limitMs);
 try{
  const res=await fetch(url,{...options,signal:control.signal});
  if(!res.ok)throw Error('Datakilden returnerte HTTP '+res.status);
  return await res.json();
 }finally{clearTimeout(timer)}
}
function bbox(url,limit=true,order='wsen'){
 const text=url.searchParams.get('bbox')||'';
 let a=text.split(',').map(Number);
 if(order==='swne'&&a.length===4)a=[a[1],a[0],a[3],a[2]];
 if(a.length!==4||a.some(x=>!Number.isFinite(x)))throw Error('Kartutsnitt mangler');
 const [w,s,e,n]=a;
 if(w<3.5||e>32.5||s<57.2||n>72.1||w>=e||s>=n)throw Error('Kartutsnitt utenfor Norge');
 if(limit&&(e-w>1.8||n-s>1.3))throw Error('Zoom inn for å hente ladespunkter');
 return {w,s,e,n};
}
async function chargerPoints(url,ctx){
 const {w,s,e,n}=bbox(url,true,'swne');
 // Round to coarse grid to minimize redundant Overpass requests.
 const r=x=>Math.round(x*20)/20;
 const box=[Math.max(57.2,r(s)-.06),Math.max(3.5,r(w)-.06),Math.min(72.1,r(n)+.06),Math.min(32.5,r(e)+.06)];
 const key='chargers:'+box.map(x=>x.toFixed(2)).join(':');
 return cacheGet(key,1800,ctx,async()=>{
  const q='[out:json][timeout:20];(node["amenity"="charging_station"]('+box.join(',')+');way["amenity"="charging_station"]('+box.join(',')+'););out center tags;';
  const body=new URLSearchParams({data:q});
  const data=await fetchJson(OVERPASS,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'PrisKartNorge/0.1 (OpenStreetMap chargers)'},body},28000);
  const elements=(data.elements||[]).filter(x=>x.tags&&['node','way'].includes(x.type)).slice(0,2200);
  return {elements,source:'OpenStreetMap / Overpass',coverage:'only_viewport',complete:false};
 });
}
async function fuelFeed(kind,ctx){
 if(kind!=='stations'&&kind!=='prices')throw Error('Ukjent datasett');
 return cacheGet('fuel-export:'+kind,3600,ctx,()=>fetchJson(FUELS+kind+'.json',{},18000));
}
async function visibleReports(db,url,ctx){
 const b=bbox(url,false);
 if((b.e-b.w)>12||(b.n-b.s)>10)throw Error('Zoom inn for å se rapporter');
 const key='reports:'+Object.values(b).map(x=>Math.round(x*20)/20).join(':');
 return cacheGet(key,25,ctx,async()=>{
  const stmt=db.prepare(
   "SELECT id, station_id, fuel_type, price_cents, latitude, longitude, created_at FROM reports WHERE flagged=0 AND latitude BETWEEN ?1 AND ?2 AND longitude BETWEEN ?3 AND ?4 AND created_at >= datetime('now','-90 days') ORDER BY created_at DESC LIMIT 2500"
  );
  const rows=(await stmt.bind(b.s,b.n,b.w,b.e).all()).results||[];
  return {reports:rows.map(x=>({id:x.id,stationId:x.station_id,fuelType:x.fuel_type,price:x.price_cents/100,updatedAt:x.created_at+'Z',latitude:x.latitude,longitude:x.longitude}))};
 });
}
async function verifyTurnstile(secret,token,ip){
 if(!secret||!token||typeof token!=='string'||token.length>2050)return false;
 const form=new FormData();form.set('secret',secret);form.set('response',token);
 if(ip)form.set('remoteip',ip);
 const res=await fetchJson('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
 return res.success===true;
}
async function hourlyKey(secret,ip){
 const hour=Math.floor(Date.now()/3600000);
 const bytes=new TextEncoder().encode(ip+':'+hour);
 const hmac=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signed=new Uint8Array(await crypto.subtle.sign('HMAC',hmac,bytes));
 return [...signed].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,48);
}
async function postReport(request,env){
 if(!env.DB||!env.TURNSTILE_SECRET||!env.TURNSTILE_SITE_KEY||!env.RATE_SECRET)return fail('Rapportering er ennå ikke aktivert på serveren',503);
 if((Number(request.headers.get('content-length'))||0)>4000)return fail('For stor forespørsel',413);
 const body=await request.json().catch(()=>null);
 if(!body)return fail('Ugyldig JSON');
 let v;
 try{v=validateReport(body)}catch(e){return fail(e.message)}
 const ip=request.headers.get('CF-Connecting-IP')||'';
 const verified=await verifyTurnstile(env.TURNSTILE_SECRET,body.token,ip);
 if(!verified)return fail('Sikkerhetskontrollen kunne ikke bekreftes',403);
 // Do not store IP address or persistent user identifier. HMAC hourly pseudonym rotates each hour.
 const fingerprint=await hourlyKey(env.RATE_SECRET,ip||crypto.randomUUID());
 const result=await env.DB.prepare(
  "INSERT INTO rate_limits (bucket, cnt, created_at) VALUES(?1,1,unixepoch()) ON CONFLICT(bucket) DO UPDATE SET cnt=cnt+1 RETURNING cnt"
 ).bind(fingerprint).first();
 if((result?.cnt||0)>10)return fail('For mange rapporter denne timen – prøv senere',429);
 const recent=await env.DB.prepare(
  "SELECT COUNT(*) AS c FROM reports WHERE station_id=?1 AND fuel_type=?2 AND created_at >= datetime('now','-90 seconds')"
 ).bind(v.stationId,v.fuelType).first();
 if((recent?.c||0)>3)return fail('Det er nettopp sendt flere rapporter for denne stasjonen. Prøv igjen om litt.',429);
 const id=crypto.randomUUID();
 await env.DB.prepare(
  'INSERT INTO reports (id,station_id,station_name,category,fuel_type,price_cents,latitude,longitude) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)'
 ).bind(id,v.stationId,v.stationName,v.fuelType==='electric'?'charge':'fuel',v.fuelType,v.priceCents,v.lat,v.lon).run();
 return json({ok:true,id,updatedAt:new Date().toISOString(),verified:false});
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url),path=url.pathname;
  if(!path.startsWith('/api/'))return env.ASSETS.fetch(request);
  try{
   if(path==='/api/health')return json({ok:true,time:new Date().toISOString()});
   if(path==='/api/config')return json({reportingEnabled:!!(env.DB&&env.TURNSTILE_SECRET&&env.TURNSTILE_SITE_KEY&&env.RATE_SECRET),turnstileSiteKey:env.TURNSTILE_SITE_KEY||null});
   if(request.method==='GET'&&path==='/api/fuel/stations')return fuelFeed('stations',ctx);
   if(request.method==='GET'&&path==='/api/fuel/prices')return fuelFeed('prices',ctx);
   if(request.method==='GET'&&path==='/api/chargers')return chargerPoints(url,ctx);
   if(request.method==='GET'&&path==='/api/reports'){
    if(!env.DB)return json({reports:[],reportingEnabled:false});
    return visibleReports(env.DB,url,ctx);
   }
   if(request.method==='POST'&&path==='/api/report')return postReport(request,env);
   return fail('Ukjent API-endepunkt',404);
  }catch(err){
   console.error('PrisKart endpoint',path,err?.message);
   const isClient=/Kartutsnitt|datasett|Zoom inn|mangler|Norge/.test(err?.message||'');
   return fail(isClient?err.message:'Datakilden er midlertidig utilgjengelig',isClient?400:503);
  }
 }
};