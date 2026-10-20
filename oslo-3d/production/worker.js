/* Oslo Atlas edge backend – Cloudflare Workers + Durable Objects.
   Runs only on your deployed Workers domain. No API keys exposed to browsers.
   DO stores anonymous tab tokens for ~90 seconds, no IP or identity. */
const E='https://api.entur.io', CLIENT='osloatlas-transport';
const NVDB='https://nvdbapiles.atlas.vegvesen.no';
const SHARDS=16, SESSION_TTL=95000;
function json(data,status=200,ttl=0){
  return new Response(JSON.stringify(data),{status,headers:{
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':ttl?'public, max-age='+ttl:'no-store',
    'X-Content-Type-Options':'nosniff'}});
}
function checkId(id){return /^NSR:StopPlace:[A-Za-z0-9-]{1,40}$/.test(id||'')}
function nearestDistance(lat,lon,lines){
  const rad=Math.PI/180, scale=Math.cos(lat*rad), m=111195;
  let best=Infinity;
  for(const line of lines){
    for(let i=1;i<line.length;i++){
      const [lng1,lat1]=line[i-1],[lng2,lat2]=line[i];
      const x=(lon-lng1)*scale*m,y=(lat-lat1)*m;
      const dx=(lng2-lng1)*scale*m,dy=(lat2-lat1)*m;
      const proj=Math.max(0,Math.min(1,(x*dx+y*dy)/(dx*dx+dy*dy||1)));
      best=Math.min(best,Math.hypot(x-dx*proj,y-dy*proj));
    }
  }
  return best;
}
function parseWkt(wkt){
  if(typeof wkt!=='string'||!/^MULTILINESTRING|^LINESTRING/i.test(wkt))return [];
  const lines=[];
  // Supports simple LINESTRING and MULTILINESTRING, ignores the optional Z ordinate.
  const groups=wkt.match(/\([^()]+\)/g)||[];
  for(const group of groups){
    const points=group.replace(/[()]/g,'').split(',').map(piece=>{
      const a=piece.trim().split(/\s+/).map(Number);return [a[0],a[1]];
    }).filter(p=>p.length===2&&p.every(Number.isFinite));
    if(points.length>1)lines.push(points);
  }
  return lines;
}
function getSpeedProperty(obj){
  for(const property of obj?.egenskaper||[]){
    if(/fartsgrense|fartsgrenseverdi/i.test(property?.navn||'')){
      const k=Number(property.verdi??property.innhold?.verdi);
      if(Number.isInteger(k)&&k>=5&&k<=130)return k;
    }
  }
  return null;
}
async function cached(ctx,key,ttl,loader){
  const req=new Request('https://atlas-cache.internal/'+encodeURIComponent(key));
  const cache=caches.default;
  const cachedResp=await cache.match(req);if(cachedResp)return cachedResp;
  const value=await loader();
  const response=json(value,200,ttl);
  ctx.waitUntil(cache.put(req,response.clone()));
  return response;
}
async function upstream(url,init={},timeout=9500){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeout);
  try{
    const r=await fetch(url,{...init,signal:ctl.signal});
    if(!r.ok)throw Error('Kilde svarte HTTP '+r.status);
    const contentType=r.headers.get('content-type')||'';
    if(!contentType.includes('json'))throw Error('Kilde svarte uten JSON');
    return await r.json();
  }finally{clearTimeout(timer)}
}
const EH={'ET-Client-Name':CLIENT,'Content-Type':'application/json'};
async function gql(query,variables={}){
  const data=await upstream(E+'/journey-planner/v3/graphql',{method:'POST',headers:EH,body:JSON.stringify({query,variables})});
  if(data.errors?.length)throw Error('Entur: '+data.errors[0].message);
  return data;
}
async function vehicles(){
  const query='query { vehicles(boundingBox:{minLat:59.66,minLon:9.86,maxLat:60.57,maxLon:11.8},maxDataAge:"PT5M"){vehicleId mode lastUpdated destinationName location{latitude longitude} operator{name} codespace{codespaceId} line{publicCode lineName}} }';
  const data=await upstream(E+'/realtime/v2/vehicles/graphql',{method:'POST',headers:EH,body:JSON.stringify({query})});
  if(data.errors?.length)throw Error('Entur GPS: '+data.errors[0].message);
  return data;
}
async function stopSearch(url){
  const q=String(url.searchParams.get('q')||'').trim().replace(/\s+(?:T|T-bane)$/i,'');
  if(q.length<2||q.length>80)throw Error('Skriv 2–80 tegn for stoppested');
  const search=new URL(E+'/geocoder/v3/autocomplete');
  search.searchParams.set('q',q);search.searchParams.set('layers','stopPlace');
  search.searchParams.set('lang','no');search.searchParams.set('limit','30');
  search.searchParams.set('lat','59.99');search.searchParams.set('lon','10.95');
  return upstream(search,{headers:{'ET-Client-Name':CLIENT}});
}
async function boardFor(url){
  const id=url.searchParams.get('id')||'';
  if(!checkId(id))throw Error('Ugyldig NSR-stoppested');
  return gql('query($id:String!){stopPlace(id:$id){name estimatedCalls(numberOfDepartures:40,timeRange:7200){realtime cancellation aimedDepartureTime expectedDepartureTime destinationDisplay{frontText} serviceJourney{line{publicCode transportMode}}}}}',{id});
}
async function predictedBoards(req){
  const input=await req.json().catch(()=>({}));
  const ids=input?.ids||[];
  if(!Array.isArray(ids)||ids.length>25||!ids.every(checkId))throw Error('For mange eller ugyldige stoppesteder');
  const start=new Date(Date.now()-15*60000).toISOString();
  const fields=ids.map((id,i)=>'s'+i+':stopPlace(id:'+JSON.stringify(id)+'){estimatedCalls(startTime:$start,timeRange:5100,numberOfDepartures:80){cancellation aimedDepartureTime expectedDepartureTime serviceJourney{id line{publicCode transportMode}}}}').join(' ');
  return gql('query($start:DateTime!){'+fields+'}',{start});
}
async function speedLimit(url){
  const lat=Number(url.searchParams.get('lat')),lon=Number(url.searchParams.get('lon'));
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<59.6||lat>60.58||lon<9.8||lon>11.9)throw Error('Velg et punkt i Oslo og Romerike');
  // A small WGS84 bounding box. No guess is made when no accurate NVDB match exists.
  const dy=.00045,dx=.00085;
  const b=[lon-dx,lat-dy,lon+dx,lat+dy].map(n=>n.toFixed(6)).join(',');
  const u=new URL(NVDB+'/vegobjekter/api/v4/vegobjekter/105');
  u.searchParams.set('kartutsnitt',b);u.searchParams.set('srid','4326');u.searchParams.set('antall','60');
  u.searchParams.set('inkluder','egenskaper,geometri,metadata');u.searchParams.set('inkluderAntall','false');
  const data=await upstream(u,{headers:{'Accept':'application/json'}},12500);
  const candidates=[];
  for(const o of data.objekter||[]){
    const kmh=getSpeedProperty(o);
    const lines=parseWkt(o.geometri?.wkt||o.lokasjon?.geometri?.wkt);
    if(kmh===null||!lines.length)continue;
    const meters=nearestDistance(lat,lon,lines);
    if(meters<=25)candidates.push({kmh,meters,id:o.id});
  }
  candidates.sort((a,b)=>a.meters-b.meters);
  const best=candidates[0]||null;
  return {source:'NVDB',verified:false,kmh:best?.kmh??null,distanceMeters:best?Math.round(best.meters):null,recordId:best?.id??null,disclaimer:'Kartoppslag, ikke juridisk vegskiltkontroll. Nærmeste vegløp kan avvike.',timestamp:new Date().toISOString()};
}
const CAMERA_IMAGES={
  furuset:'0329004_1',
  hjortnes:'0329002_1'
};
async function cameraImage(id){
  if(!(id in CAMERA_IMAGES))return new Response('Ukjent kamera',{status:404});
  const res=await fetch('https://kamera.atlas.vegvesen.no/api/images/'+CAMERA_IMAGES[id],{headers:{Accept:'image/jpeg'}});
  if(!res.ok)throw Error('Kamera utilgjengelig: HTTP '+res.status);
  const type=res.headers.get('content-type')||'';
  if(!type.startsWith('image/'))throw Error('Kamera ga ikke bilde');
  return new Response(res.body,{headers:{'Content-Type':type,'Cache-Control':'public,max-age=40','X-Content-Type-Options':'nosniff'}});
}
function shard(id){
  let x=2166136261;for(const ch of id)x=Math.imul(x^ch.charCodeAt(0),16777619);
  return (x>>>0)%SHARDS;
}
function presenceObject(env,i){
  return env.PRESENCE.get(env.PRESENCE.idFromName('shard-'+i));
}
async function online(env,ctx){
  return cached(ctx,'online-count',10,async()=>{
    const results=await Promise.all(Array.from({length:SHARDS},(_,i)=>presenceObject(env,i).fetch('https://presence.internal/count').then(r=>r.json())));
    return {online:results.reduce((n,r)=>n+(Number(r.count)||0),0),windowSeconds:95,approximate:true};
  });
}
export class Presence {
  constructor(ctx,env){this.ctx=ctx;this.entries=new Map()}
  prune(){const t=Date.now();for(const [k,last] of this.entries)if(t-last>SESSION_TTL)this.entries.delete(k)}
  async fetch(req){
    const url=new URL(req.url);this.prune();
    if(url.pathname==='/touch'){
      const {id}=await req.json().catch(()=>({}));
      if(typeof id!=='string'||!/^[a-f0-9-]{20,40}$/i.test(id))return json({error:'Ugyldig besøksnøkkel'},400);
      this.entries.set(id,Date.now());return json({ok:true,windowSeconds:95});
    }
    if(url.pathname==='/count')return json({count:this.entries.size});
    return json({error:'Not found'},404);
  }
}
export default {
  async fetch(req,env,ctx){
    const url=new URL(req.url),path=url.pathname;
    if(!path.startsWith('/api/'))return env.ASSETS.fetch(req);
    try{
      if(path==='/api/health')return json({ok:true,service:'Oslo Atlas API',serverTime:new Date().toISOString()});
      if(path==='/api/stops')return cached(ctx,'stop:'+String(url.searchParams.get('q')).slice(0,80).toLowerCase(),65,()=>stopSearch(url));
      if(path==='/api/departures')return cached(ctx,'board:'+url.searchParams.get('id'),18,()=>boardFor(url));
      if(path==='/api/vehicles')return cached(ctx,'vehicles:oslo-romerike',17,vehicles);
      if(path==='/api/predicted'){
        if(req.method!=='POST')return json({error:'POST kreves'},405);
        const body=await req.text();if(body.length>2100)throw Error('For lang forespørsel');
        const ids=JSON.parse(body).ids;
        if(!Array.isArray(ids)||ids.length>25||!ids.every(checkId))throw Error('Ugyldige stoppesteder');
        return cached(ctx,'predicted:'+ids.join('|'),32,()=>predictedBoards(new Request(req.url,{method:'POST',body,headers:{'Content-Type':'application/json'}})));
      }
      if(path==='/api/speed')return cached(ctx,'speed:'+Number(url.searchParams.get('lat')).toFixed(4)+':'+Number(url.searchParams.get('lon')).toFixed(4),300,()=>speedLimit(url));
      if(path==='/api/camera'&&req.method==='GET')return cameraImage(url.searchParams.get('id')||'');
      if(path==='/api/presence'&&req.method==='POST'){
        const body=await req.json().catch(()=>({})),id=body?.id||'';
        if(typeof id!=='string'||!/^[a-f0-9-]{20,40}$/i.test(id))return json({error:'Ugyldig besøksnøkkel'},400);
        return presenceObject(env,shard(id)).fetch('https://presence.internal/touch',{method:'POST',body:JSON.stringify({id})});
      }
      if(path==='/api/presence'&&req.method==='GET')return online(env,ctx);
      return json({error:'Ukjent API-rute'},404);
    }catch(e){
      console.error('API',path,e?.message);
      const bad=/Ugyldig|stoppested|For mange|Skriv 2/.test(String(e.message));
      return json({error:bad?String(e.message):'Datakilden er midlertidig utilgjengelig',details:bad?undefined:String(e.message).slice(0,180)},bad?400:503);
    }
  }
};