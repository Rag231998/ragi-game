/* PrisKart Norge – data provenance first.
 * Fuel stations/prices: Drivstoffpriser's open 12-hour export (timestamps preserved).
 * Chargers: OSM Overpass visible-area discovery; nationwide NOBIL requires API credentials.
 * User price reports: published only to deployed same-origin API with Turnstile + D1.
 */
(()=>{
'use strict';
const $=id=>document.getElementById(id),fuelUrl='https://drivstoffpriser.github.io/Drivstoffpriser-App/data/';
const cities={Oslo:[10.7522,59.9139],Bergen:[5.3221,60.393],Trondheim:[10.3951,63.4305],Tromsø:[18.9553,69.6496],Stavanger:[5.7331,58.969],Bodø:[14.4049,67.2804],Jessheim:[11.171,60.143],Lillestrøm:[11.049,59.956],Kristiansand:[8.003,58.147],Ålesund:[6.154,62.472],Fredrikstad:[10.939,59.219],Hamar:[11.067,60.794]};
const labels={petrol95:'Bensin 95',petrol98:'Bensin 98',diesel:'Diesel',electric:'Elbillading'};
const SUPABASE_URL='https://pryrgwfjniggjlrizenh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const productToDB={petrol95:'95',petrol98:'98',diesel:'diesel',electric:'ccs'};
const productFromDB={'95':'petrol95','98':'petrol98','diesel':'diesel',ccs:'electric',type2:'electric',chademo:'electric'};

const state={client:null,user:null,map:null,lib:null,stations:new Map(),fuelPrices:new Map(),reports:new Map(),selected:null,mode:'all',fuel:'petrol95',sort:'near',recent:false,priced:false,feedAt:null,chargersError:null,loadingChargers:false,chargersLoaded:false,backend:false,siteKey:null,token:null,turnstileWidget:null,chargerRequestCache:new Set(),search:'',origin:'feed',searchId:0,loadedFuel:false,debounce:null,chargePower:0,chargePlug:'all'};
const fmtCurrency=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2});
const formatDate=d=>{const ms=Date.parse(d||'');return Number.isFinite(ms)?new Intl.DateTimeFormat('nb-NO',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Oslo'}).format(ms):'Ukjent tidspunkt'};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const parseTimestamp=s=>{if(!s)return NaN;const str=String(s);return Date.parse(/Z$|[+\-]\d\d:\d\d$/.test(str)?str:str+'Z')};
const km=(a,b)=>{const r=Math.PI/180,dlat=(b[1]-a[1])*r,dlon=(b[0]-a[0])*r;return 6371*2*Math.asin(Math.sqrt(Math.sin(dlat/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dlon/2)**2))};
const ageCategory=price=>{if(!price)return 'missing';const t=parseTimestamp(price.updatedAt);const hours=(Date.now()-t)/36e5;return hours<=72&&hours>=0?'recent':hours<=720&&hours>=0?'old':'historic'};
function apiOrDirect(route,url){
 return fetch(route,{cache:'no-store'}).then(r=>{if(!r.ok||!(r.headers.get('content-type')||'').includes('json'))throw Error('Backend ikke tilkoblet');return r.json()}).catch(()=>fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Datakilden HTTP '+r.status);return r.json()}));
}
function fuelStation(raw){
 const lat=+raw.latitude,lon=+raw.longitude;
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<57.5||lat>72||lon<3.5||lon>32.5)return null;
 const id=String(raw.id||'');
 if(!id||id.length>100)return null;
 const name=raw.name||raw.brand||'Stasjon uten navn';
 // Some input sources include charging-only sites. Do not mislabel them as petrol stations.
 if(/(^|\s)(lader|ladestasjon|charging|bilvask|vaskehall)(\s|$)/i.test(name))return null;
 return {id:'fuel:'+id,sourceId:id,name,brand:String(raw.brand||''),address:String(raw.address||''),city:String(raw.city||''),lat,lon,type:'fuel',kw:null,connectors:[],origin:'Drivstoffpriser / OpenStreetMap'};
}
function chargerStation(raw){
 const t=raw.tags||{},p=raw.center||raw,lat=Number(p.lat),lon=Number(p.lon);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<57.5||lat>72||lon<3.5||lon>32.5)return null;
 const type=String(raw.type||'node'),id=String(raw.id||'');
 if(!/^(node|way|relation)$/.test(type)||!/^\d+$/.test(id))return null;
 const plugs=Object.keys(t).filter(k=>k.startsWith('socket:')&&!k.includes(':output')&&!['no','0','false'].includes(String(t[k]).trim().toLowerCase())).map(k=>k.split(':').slice(1).join(':'));
 const power=Object.entries(t).filter(([k])=>k.includes('output')&&k.startsWith('socket:')).map(([,v])=>Number(String(v).replace(',','.').match(/[\d.]+/)?.[0])).filter(Number.isFinite);
 return {id:'charge:osm:'+type+':'+id,name:String(t.name||t.operator||'Offentlig ladepunkt'),brand:String(t.operator||t.brand||''),city:String(t['addr:city']||''),address:String(t['addr:street']||''),lat,lon,type:'charge',kw:power.length?Math.max(...power):null,connectors:plugs,origin:'OpenStreetMap (kan være ufullstendig)'};
}
function currentPrice(s){
 const found=[...(state.fuelPrices.get(s.id)||[]),...(state.reports.get(s.id)||[])];
 const selectedType=s.type==='charge'?'electric':state.fuel;
 const matches=found.filter(x=>x.fuelType===selectedType&&Number.isFinite(+x.price));
 matches.sort((a,b)=>parseTimestamp(b.updatedAt)-parseTimestamp(a.updatedAt));
 return matches[0]||null;
}
function pricesFor(s){
 const arr=[...(state.fuelPrices.get(s.id)||[]),...(state.reports.get(s.id)||[])];
 const top=new Map();
 for(const p of arr){const old=top.get(p.fuelType);if(!old||parseTimestamp(p.updatedAt)>parseTimestamp(old.updatedAt))top.set(p.fuelType,p)}
 return [...top.values()].sort((a,b)=>['petrol95','diesel','petrol98','electric'].indexOf(a.fuelType)-['petrol95','diesel','petrol98','electric'].indexOf(b.fuelType));
}
function status(message){$('map-message').textContent=message}
function updateNote(){
 const fuel=[...state.stations.values()].filter(x=>x.type==='fuel').length;
 const charge=[...state.stations.values()].filter(x=>x.type==='charge').length;
 $('source-note').textContent='⛽ '+fuel.toLocaleString('nb-NO')+' bensinstasjoner fra Drivstoffpriser. ⚡ '+charge.toLocaleString('nb-NO')+' ladestasjoner – NOBIL-basert datasett distribuert av Stavanger kommune (NLOD, oktober 2026). Prisene er brukerrapporterte og må kontrolleres hos operatøren.';
}
async function loadFuel(){
 try{
  if(!state.client)throw Error('Databasen er ikke tilgjengelig');
  const all=[];
  for(let offset=0;offset<30000;offset+=800){
    const {data,error}=await state.client.from('stations').select('id,name,kind,operator,lat,lon,address,connectors,power_kw,source,status').eq('status','active').order('id').range(offset,offset+799);
    if(error)throw error;
    all.push(...data);
    if(data.length<800)break;
  }
  if(!all.length)throw Error('Stasjonsdatabasen er tom');
  state.stations.clear();
  for(const item of all){
    const type=item.kind==='charge'?'charge':'fuel';
    state.stations.set(item.id,{
      id:item.id,sourceId:item.id,name:item.name,brand:item.operator||'',address:item.address||'',
      city:'',lat:+item.lat,lon:+item.lon,type,kw:item.power_kw?+item.power_kw:null,
      connectors:Array.isArray(item.connectors)?item.connectors:[],
      origin:item.source||'PrisKart'
    });
  }
  state.loadedFuel=true;
  await loadReports();
  updateNote();updateSources();refresh();if(state.map){restoreComparison();openRequestedStation()}
  status('⛽ '+all.filter(x=>x.kind==='fuel').length+' bensinstasjoner · ⚡ '+all.filter(x=>x.kind==='charge').length+' registrerte ladepunkter. Ladestasjonene kommer fra en landsdekkende NOBIL-basert katalog.');
 }catch(err){
  console.warn('Database utilgjengelig; viser åpen reserveeksport',err);
  try{
    const [sta,pri]=await Promise.all([apiOrDirect('/api/fuel/stations',fuelUrl+'stations.json'),apiOrDirect('/api/fuel/prices',fuelUrl+'prices.json')]);
    for(const raw of sta.stations||[]){const v=fuelStation(raw);if(v)state.stations.set(v.id,v)}
    for(const raw of pri.prices||[]){const id='fuel:'+raw.stationId,p=+raw.price;if(!Number.isFinite(p)||!labels[raw.fuelType])continue;
      const list=state.fuelPrices.get(id)||[];list.push({fuelType:raw.fuelType,price:p,updatedAt:raw.updatedAt,source:'Drivstoffpriser – historisk'});state.fuelPrices.set(id,list)
    }
    state.feedAt=sta.exportedAt;state.loadedFuel=true;updateNote();updateSources();refresh();
    status('⚠️ Databasen kunne ikke lastes. Viser historisk åpen eksport; nye brukerpriser kan være utilgjengelige.');
  }catch(e){
    $('summary').textContent='Kunne ikke hente stasjoner';
    $('results').textContent='Datakildene svarer ikke akkurat nå. Prøv å laste siden på nytt.';
    status('Kartet er tilgjengelig, men stasjonsdata er ikke lastet.');
  }
 }
}
function matchesFilters(s){
 if(state.mode!=='all'&&s.type!==state.mode)return false;
 if(s.type==='charge'&&(state.chargePower>0||state.chargePlug!=='all')){
  if(state.chargePower>0&&!(Number.isFinite(s.kw)&&s.kw>=state.chargePower))return false;
  if(state.chargePlug!=='all'&&!s.connectors.some(x=>x.replace(/[^a-z0-9]/gi,'').toLowerCase().includes(state.chargePlug.replace(/[^a-z0-9]/gi,''))))return false;
 }
 const query=norm(state.search.trim());
 if(query&&!norm([s.name,s.brand,s.city,s.address].join(' ')).includes(query))return false;
 const price=currentPrice(s);
 if(state.priced&&!price)return false;
 if(state.recent&&ageCategory(price)!=='recent')return false;
 return true;
}
function updateSources(){
 const m=state.map;if(!m)return;
 const fuel=[],charge=[];
 for(const s of state.stations.values()){
  if(!matchesFilters(s))continue;
  const obj={type:'Feature',geometry:{type:'Point',coordinates:[s.lon,s.lat]},properties:{id:s.id}};
  (s.type==='fuel'?fuel:charge).push(obj);
 }
 if(m.getSource('fuel-stations'))m.getSource('fuel-stations').setData({type:'FeatureCollection',features:fuel});
 if(m.getSource('charging-stations'))m.getSource('charging-stations').setData({type:'FeatureCollection',features:charge});
 $('map-counter').textContent=state.stations.size.toLocaleString('nb-NO')+' registrerte punkter';
}
function createMapLayers(){
 const m=state.map;
 for(const [id,color,stroke] of [['fuel-stations','#2b85b8','#e9faff'],['charging-stations','#0f9670','#d9fdf1']]){
  m.addSource(id,{type:'geojson',data:{type:'FeatureCollection',features:[]},cluster:true,clusterRadius:45,clusterMaxZoom:12});
  m.addLayer({id:id+'-clusters',source:id,type:'circle',filter:['has','point_count'],paint:{'circle-color':color,'circle-opacity':.94,'circle-stroke-color':stroke,'circle-stroke-width':3,'circle-radius':['step',['get','point_count'],16,20,20,100,25]}});
  m.addLayer({id:id+'-count',source:id,type:'symbol',filter:['has','point_count'],layout:{'text-field':['get','point_count_abbreviated'],'text-size':11},paint:{'text-color':'#fff'}});
  m.addLayer({id:id+'-points',source:id,type:'circle',filter:['!', ['has','point_count']],paint:{'circle-color':color,'circle-stroke-color':stroke,'circle-stroke-width':3,'circle-radius':['interpolate',['linear'],['zoom'],4,5,9,8,15,11]}});
  m.on('click',id+'-clusters',e=>{
   const f=e.features?.[0];if(!f)return;const source=m.getSource(id);
   source.getClusterExpansionZoom(f.properties.cluster_id).then(z=>m.easeTo({center:f.geometry.coordinates,zoom:z,duration:450})).catch(()=>{});
  });
  m.on('click',id+'-points',e=>{
   const key=e.features?.[0]?.properties?.id;if(key&&state.stations.has(key))selectStation(state.stations.get(key));
  });
  m.on('mouseenter',id+'-points',()=>m.getCanvas().style.cursor='pointer');
  m.on('mouseleave',id+'-points',()=>m.getCanvas().style.cursor='');
 }
}
function filterLayer(){
 const m=state.map;if(!m)return;
 for(const [id,on] of [['fuel-stations',state.mode!=='charge'],['charging-stations',state.mode!=='fuel']]){
  for(const extra of ['-clusters','-count','-points'])if(m.getLayer(id+extra))m.setLayoutProperty(id+extra,'visibility',on?'visible':'none');
 }
}
function cleanPrice(p){
 return p?fmtCurrency.format(+p.price)+' kr'+(p.fuelType==='electric'?'/kWh':'/l'):'Ukjent';
}
function filtered(){
 const query=norm(state.search.trim()),center=state.map.getCenter(),bounds=state.map.getBounds();
 const n=Array.from(state.stations.values()).filter(s=>{
  if(!matchesFilters(s))return false;
  return query?true:bounds.contains([s.lon,s.lat]);
 });
 const distance=s=>km([center.lng,center.lat],[s.lon,s.lat]);
 n.sort((a,b)=>{
  const x=currentPrice(a),y=currentPrice(b);
  if(state.sort==='cheap')return (x?.price??9999)-(y?.price??9999)||distance(a)-distance(b);
  if(state.sort==='recent')return (parseTimestamp(y?.updatedAt)||0)-(parseTimestamp(x?.updatedAt)||0)||distance(a)-distance(b);
  if(state.sort==='name')return a.name.localeCompare(b.name,'nb');
  return distance(a)-distance(b);
 });
 return n;
}
function refresh(){
 $('charger-filters').hidden=state.mode!=='charge';
 if(!state.map)return;filterLayer();updateSources();
 const list=$('results');const arr=filtered();list.replaceChildren();
 $('summary').textContent=arr.length.toLocaleString('nb-NO')+' treff'+(state.search?' for søket':' i kartet');
 $('result-title').textContent=state.mode==='charge'?'Ladestasjoner':state.mode==='fuel'?'Bensinstasjoner':'Stasjoner i området';
 const searchedCity=state.search&&Object.keys(cities).find(city=>norm(city)===norm(state.search.trim()));
 if(searchedCity){
  const nav=document.createElement('button');nav.className='result city-result';nav.type='button';
  nav.style.cssText='display:flex;align-items:center;min-height:50px;background:#e6f7ef;border:1px solid #a7dcc9;margin:4px 0 10px;gap:11px';
  const ico=document.createElement('span');ico.className='symbol';ico.textContent='📍';
  const label=document.createElement('span');label.style.cssText='font-size:12px;font-weight:800';label.textContent='Vis '+searchedCity+' på kartet';
  nav.append(ico,label);nav.addEventListener('click',()=>moveCity(searchedCity));list.append(nav);
 }
 if(!arr.length){
  let message=state.recent?'Ingen priser fra de siste 72 timene finnes med disse filtrene. Mange prisobservasjoner i kilden er gamle.':
     state.priced?'Ingen registrerte priser for dette valget. Prøv å vise alle stasjoner.':
     state.mode==='charge'&&state.map.getZoom()<9?'Zoom inn til en by for å laste ladepunkter.':
     state.chargersError?'Ladedata kunne ikke hentes: '+state.chargersError:
     'Ingen stasjoner samsvarer med søk og filtre.';
  list.append(Object.assign(document.createElement('p'),{className:'empty',textContent:message}));
  const reset=document.createElement('button');reset.type='button';reset.className='secondary';reset.style.cssText='width:100%;margin:4px 0 12px';reset.textContent='Nullstill søk og filtre';
  reset.addEventListener('click',()=>{state.search='';$('search').value='';state.recent=false;state.priced=false;state.sort='near';state.mode='all';state.fuel='petrol95';state.chargePower=0;state.chargePlug='all';$('charge-power').value='all';$('charge-plug').value='all';$('recent-only').checked=false;$('priced-only').checked=false;$('sort-by').value='near';$('fuel-type').value='petrol95';document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='all'));refresh()});
  list.append(reset);return;
 }
 for(const s of arr.slice(0,65)){
  const p=currentPrice(s),b=document.createElement('button');
  b.className='station'+(state.selected?.id===s.id?' selected':'');b.setAttribute('aria-label','Vis '+s.name);
  const age=ageCategory(p);
  b.innerHTML='<div class="station-icon '+(s.type==='fuel'?'fuel':'')+'">'+(s.type==='fuel'?'⛽':'⚡')+'</div><div class="station-main"><div class="station-name">'+esc(s.name)+'</div><div class="station-sub">'+esc([s.city,s.address].filter(Boolean).join(' · ')||'Lokasjon på kartet')+'</div><div class="statbits"><span class="tiny">'+(s.type==='fuel'?'Bensinstasjon':'Ladestasjon')+'</span>'+(p?'<span class="tiny '+(age==='recent'?'recent':'old')+'">'+(age==='recent'?'Ny pris':'Eldre pris')+'</span>':'<span class="tiny">Pris mangler</span>')+'</div></div><div class="station-price">'+(p?fmtCurrency.format(p.price):'—')+'<small>'+(p?(p.fuelType==='electric'?'kr/kWh':'kr/l'):'ukjent')+'</small></div>';
  b.addEventListener('click',()=>selectStation(s));
  list.append(b);
 }
 if(arr.length>65){const more=document.createElement('p');more.className='empty';more.textContent='Viser de første 65. Zoom inn eller søk for å begrense listen.';list.append(more)}
}
function makeMetaRow(label,value){
 const r=document.createElement('div');r.className='price-row';
 const left=document.createElement('span');left.textContent=label;const right=document.createElement('strong');right.textContent=value;
 r.append(left,right);return r;
}
function showDetails(s){
 const p=currentPrice(s),age=ageCategory(p);
 $('details').hidden=false;
 $('d-category').textContent=s.type==='charge'?'⚡ Ladestasjon':'⛽ Bensinstasjon';
 $('d-name').textContent=s.name;$('d-address').textContent=[s.address,s.city].filter(Boolean).join(', ')||'Norge';
 $('d-primary-label').textContent=labels[state.fuel]||'Rapportert pris';
 $('d-primary').textContent=cleanPrice(p);showComparisonButton();$('d-age').textContent=!p?'Ingen pris':age==='recent'?'Siste 72 timer':'Eldre observasjon';
 $('d-description').textContent=!p?'Ingen pris er registrert for dette produktet. Meld inn en pris hvis du har sett den på stasjonen.':
  'Siste observasjon '+formatDate(p.updatedAt)+'. Kilde: '+p.source+'. Dette er en brukerrapport og kan ha endret seg.';
 const container=$('d-prices');container.replaceChildren();
 const pp=pricesFor(s);
 for(const entry of pp){container.append(makeMetaRow(labels[entry.fuelType]||entry.fuelType,cleanPrice(entry)));const n=document.createElement('p');n.className='helper';n.style.cssText='font-size:10px;color:#6f8994;margin:0 0 8px';n.textContent=formatDate(entry.updatedAt)+' · '+entry.source;container.append(n)}
 if(!pp.length)container.append(makeMetaRow('Prisdata','Ingen rapportert pris'));
 const meta=$('d-meta');meta.replaceChildren();
 meta.append(makeMetaRow('Kilde',s.origin));
 if(s.brand)meta.append(makeMetaRow('Operatør',s.brand));
 if(s.kw)meta.append(makeMetaRow('Effekt registrert',s.kw+' kW'));
 if(s.connectors?.length)meta.append(makeMetaRow('Ladekontakter',s.connectors.join(', ').slice(0,90)));
 if(s.type==='charge'&&!s.kw)meta.append(makeMetaRow('Ladeeffekt','Ikke registrert'));
 if(s.type==='charge')meta.append(makeMetaRow('Ladepris','Kun brukerinnmeldte priser – se dato'));
 meta.append(makeMetaRow('Koordinater',s.lat.toFixed(4)+', '+s.lon.toFixed(4)));
 $('d-navigate').href='https://www.google.com/maps/dir/?api=1&destination='+s.lat+','+s.lon;
 const m=state.map;m.flyTo({center:[s.lon,s.lat],zoom:Math.max(m.getZoom(),13),duration:850});
}
function selectStation(s){
 state.selected=s;showDetails(s);refresh();
 // Keep the search and filters discoverable when a station card is closed.
 if(window.innerWidth<=760){$('sidebar').classList.remove('collapsed');$('mobile-toggle').setAttribute('aria-expanded','true');$('mobile-toggle').textContent='Vis kart ↓'}
}
async function loadChargers(){
 // Nationwide NOBIL-based catalog is imported into Supabase. Do not query
 // unstable public Overpass endpoints from every user's mobile browser.
 return;
}
async function loadReports(){
 if(!state.client)return;
 try{
   const [external,reported]=await Promise.all([
      state.client.from('external_prices').select('station_id,product_code,price,observed_at,source').limit(2000),
      state.client.from('price_reports').select('id,station_id,product_code,price,created_at,status').eq('status','approved').order('created_at',{ascending:false}).limit(1500)
   ]);
   if(external.error)throw external.error;
   if(reported.error)throw reported.error;
   state.fuelPrices.clear();state.reports.clear();
   for(const p of external.data||[]){
     const k=productFromDB[p.product_code];if(!k)continue;
     if(!state.fuelPrices.has(p.station_id))state.fuelPrices.set(p.station_id,[]);
     state.fuelPrices.get(p.station_id).push({fuelType:k,price:+p.price,updatedAt:p.observed_at,source:p.source||'Historisk import',verified:false});
   }
   for(const p of reported.data||[]){
     const k=productFromDB[p.product_code];if(!k)continue;
     if(!state.reports.has(p.station_id))state.reports.set(p.station_id,[]);
     state.reports.get(p.station_id).push({id:p.id,fuelType:k,price:+p.price,updatedAt:p.created_at,source:'PrisKart – brukerinnmeldt pris (ikke kontrollert)',verified:false});
   }
   refresh();if(state.selected)showDetails(state.selected);
 }catch(err){console.warn('Kunne ikke oppdatere live-priser',err.message)}
}
function moveCity(name){
 const xy=cities[name];if(!xy)return;
 if(!state.map){status('Kartet lastes. Prøv igjen straks.');return;}
 state.map.flyTo({center:xy,zoom:11.4,duration:1100});
 state.search='';$('search').value='';$('search').blur();
 if(window.innerWidth<=760){$('sidebar').classList.remove('collapsed');$('mobile-toggle').setAttribute('aria-expanded','true');$('mobile-toggle').textContent='Vis kart ↓'}
}
async function config(){
 state.backend=!!state.client;
 $('d-report').textContent=state.backend?'＋ Meld inn pris':'＋ Rapporter priser (utilgjengelig)';
 if(!state.client)return;
 const {data}=await state.client.auth.getUser();
 state.user=data?.user||null;
 updateAuthUI();
 state.client.auth.onAuthStateChange((event,session)=>{
  state.user=session?.user||null;
  updateAuthUI();
  if(event==='SIGNED_IN')loadReports();
 });
 state.client.channel('priskart_live_reports')
 .on('postgres_changes',{event:'INSERT',schema:'public',table:'price_reports'},()=>loadReports())
 .on('postgres_changes',{event:'UPDATE',schema:'public',table:'price_reports'},()=>loadReports()).subscribe();
}
function updateAuthUI(){
 const auth=$('auth-info'),user=state.user;
 if(!auth)return;
 auth.textContent=user?'Innlogget: '+(user.email||'bruker')+'. Du kan melde inn pris som andre vil se.':'Logg inn for å publisere priser i hele Norge.';
 $('logout-btn').hidden=!user;
 $('login-send').disabled=!!user;
 $('login-password-btn').disabled=!!user;
 $('login-email').disabled=!!user;
 $('login-password').disabled=!!user;
 if(state.selected&&$('report-modal').hidden===false)$('report-submit').disabled=!user;
}

/* Client-side theme and share functions. All shared URLs intentionally omit GPS position. */
const AUTH_REDIRECT_ROOT='https://priskart-norge-live.vercel.app/';
let linkSending=false,linkCooldownUntil=0,currentTheme='light';
function setTheme(mode,persist=false){
  currentTheme=mode==='dark'?'dark':'light';
  document.body.classList.toggle('dark-theme',currentTheme==='dark');
  document.documentElement.style.colorScheme=currentTheme;
  const toggle=$('theme-toggle');if(toggle){toggle.textContent=currentTheme==='dark'?'☀️':'🌙';toggle.title=currentTheme==='dark'?'Bytt til lys modus':'Bytt til mørk modus'}
  if(persist)try{
    if(localStorage.getItem(CONSENT_KEY)==='preferences')localStorage.setItem('priskart_theme',currentTheme);
  }catch(e){}
}
function initTheme(){
  let stored=null;
  try{if(localStorage.getItem(CONSENT_KEY)==='preferences')stored=localStorage.getItem('priskart_theme')}catch(e){}
  const dark=stored?stored==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(dark?'dark':'light');
  $('theme-toggle').addEventListener('click',()=>setTheme(currentTheme==='dark'?'light':'dark',true));
}
function shareLink(url,text){
  const share={url,title:'PrisKart Norge',text};
  if(navigator.share){navigator.share(share).catch(err=>{if(err?.name!=='AbortError')copyShare(url)});return}
  copyShare(url);
}
function copyShare(url){
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(url).then(()=>status('Lenken er kopiert. Nå kan du sende den til venner eller en gruppe.')).catch(()=>window.prompt('Kopier delingslenken:',url));
  }else window.prompt('Kopier delingslenken:',url);
}
function stationShareUrl(s){
  const url=new URL(AUTH_REDIRECT_ROOT);
  url.searchParams.set('stasjon',s.id);
  return url.toString();
}

let comparisonIds=[];
function restoreComparison(){
 const text=new URLSearchParams(location.search).get('liste')||'';
 if(text.length>1000)return;
 comparisonIds=[...new Set(text.split(',').map(x=>x.trim()).filter(x=>x.length>=4&&x.length<150&&state.stations.has(x)))].slice(0,8);
 showComparisonButton();
 if(comparisonIds.length)renderComparison();
}
function showComparisonButton(){
 const button=$('compare-open');
 if(button)button.textContent='Sammenlign stasjoner ('+comparisonIds.length+')';
 const add=$('compare-add');
 if(add&&state.selected)add.textContent=comparisonIds.includes(state.selected.id)?'✓ Fjern fra listen':'＋ Sammenlign';
}
function toggleComparisonStation(){
 const s=state.selected;
 if(!s)return;
 if(comparisonIds.includes(s.id))comparisonIds=comparisonIds.filter(x=>x!==s.id);
 else{
  if(comparisonIds.length>=8){status('Sammenligningslisten kan ha opptil åtte stasjoner. Fjern en før du legger til flere.');return}
  comparisonIds.push(s.id);
  status('Stasjonen er lagt til i sammenligningen. Åpne Meny → Sammenlign stasjoner for å dele.');
 }
 showComparisonButton();renderComparison();
}
function renderComparison(){
 const root=$('compare-list');
 if(!root)return;
 root.replaceChildren();
 for(const id of comparisonIds){
  const station=state.stations.get(id);if(!station)continue;
  const row=document.createElement('div');row.className='compare-row';
  const icon=document.createElement('span');icon.textContent=station.type==='charge'?'⚡':'⛽';
  const text=document.createElement('div');
  const name=document.createElement('strong');name.textContent=station.name;
  const price=document.createElement('small');price.textContent=cleanPrice(currentPrice(station))+' · '+(currentPrice(station)?'Brukerrapportert pris – se dato':'Ingen pris');
  text.append(name,price);
  const remove=document.createElement('button');remove.type='button';remove.textContent='Fjern';remove.setAttribute('aria-label','Fjern '+station.name+' fra listen');
  remove.addEventListener('click',()=>{comparisonIds=comparisonIds.filter(x=>x!==id);renderComparison();showComparisonButton()});
  row.append(icon,text,remove);root.append(row);
 }
 if(!comparisonIds.length){const p=document.createElement('p');p.textContent='Ingen stasjoner valgt ennå. Velg en stasjon på kartet og trykk «Sammenlign».';root.append(p)}
 $('compare-share').disabled=!comparisonIds.length;
}
function shareComparison(){
 if(!comparisonIds.length)return;
 const url=new URL(AUTH_REDIRECT_ROOT);
 url.searchParams.set('liste',comparisonIds.join(','));
 shareLink(url.toString(),'Her er stasjonene vi kan sammenligne før vi fyller eller lader.');
}
function initComparison(){
 $('compare-open').addEventListener('click',()=>{$('main-menu').open=false;renderComparison();$('compare-modal').hidden=false});
 $('compare-close').addEventListener('click',()=>{$('compare-modal').hidden=true});
 $('compare-modal').addEventListener('click',e=>{if(e.target===$('compare-modal'))$('compare-modal').hidden=true});
 $('compare-add').addEventListener('click',toggleComparisonStation);
 $('compare-clear').addEventListener('click',()=>{comparisonIds=[];showComparisonButton();renderComparison()});
 $('compare-share').addEventListener('click',shareComparison);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')$('compare-modal').hidden=true});
}

function shareCurrentMap(){
  const url=new URL(AUTH_REDIRECT_ROOT);
  url.searchParams.set('type',state.mode==='all'?'fuel':state.mode);
  // Deling fra "Nær meg" skal ikke legge GPS-koordinater i lenken.
  const typed=Object.keys(cities).find(x=>norm(state.search.trim())===norm(x));
  if(typed)url.searchParams.set('sted',typed);
  shareLink(url.toString(),'Finn bensin- og ladepriser på samme kart.');
}
function openRequestedStation(){
  const id=new URLSearchParams(location.search).get('stasjon');
  if(!id||!state.stations.has(id))return;
  selectStation(state.stations.get(id));
}
function loginErrorText(error){
 const raw=(error?.message||'').toLowerCase();
 if(raw.includes('rate limit')||raw.includes('too many')){
  linkCooldownUntil=Date.now()+2*60*1000;
  return 'Supabase har nådd grensen for e-postutsendelser. Ikke trykk flere ganger. Tjenesten trenger egen SMTP-leverandør før denne innloggingen fungerer stabilt.';
 }
 if(raw.includes('expired'))return 'Innloggingslenken er utløpt eller allerede brukt. Når e-posttjenesten fungerer, be om én ny lenke.';
 return 'E-post kunne ikke sendes: '+(error?.message||'ukjent feil');
}

async function emailLogin(){
 if(linkSending||Date.now()<linkCooldownUntil){
  $('auth-info').textContent='Vent før du ber om en ny innloggingslenke. Gjentatte forsøk hjelper ikke når e-postgrensen er nådd.';
  return;
 }
 const email=$('login-email').value.trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){$('auth-info').textContent='Skriv en gyldig e-postadresse.';return}
 linkSending=true;$('login-send').disabled=true;
 try{
  const {error}=await state.client.auth.signInWithOtp({
   email,options:{emailRedirectTo:AUTH_REDIRECT_ROOT+'index.html',shouldCreateUser:true}
  });
  $('auth-info').textContent=error?loginErrorText(error):'Én e-post er sendt. Sjekk innboksen og spam. Lenken må åpnes før den utløper.';
  if(!error)linkCooldownUntil=Date.now()+90*1000;
 }catch(error){$('auth-info').textContent=loginErrorText(error)}
 finally{linkSending=false;$('login-send').disabled=!!state.user}
}
async function passwordLogin(){
 const email=$('login-email').value.trim(),password=$('login-password').value;
 if(!email||!password){$('auth-info').textContent='Skriv e-post og passord.';return}
 const {error}=await state.client.auth.signInWithPassword({email,password});
 $('auth-info').textContent=error?'Innlogging mislyktes: '+error.message:'Du er logget inn.';
 if(!error){state.user=(await state.client.auth.getUser()).data.user;updateAuthUI()}
}
function startReport(){
 if(!state.selected)return;
 $('report-modal').hidden=false;$('report-title').textContent='Meld inn pris';$('report-station').textContent=state.selected.name;
 $('report-status').classList.remove('visible');$('report-status').textContent='';
 const type=state.selected.type==='charge'?'electric':(state.fuel==='electric'?'petrol95':state.fuel);
 $('report-type').value=type;
 $('report-type').querySelectorAll('option').forEach(x=>x.disabled=state.selected.type==='charge'?(x.value!=='electric'):(x.value==='electric'));
 $('report-price').value='';updateAuthUI();
 $('report-submit').disabled=!state.user;
 if(!state.backend){$('auth-info').textContent='Databaseforbindelse utilgjengelig – kan ikke publisere rapporter.';$('report-submit').disabled=true}
}
async function submitReport(e){
 e.preventDefault();
 if(!state.selected||!state.client)return;
 const msg=$('report-status');msg.className='report-status visible';
 const {data:{user},error:sessionError}=await state.client.auth.getUser();
 if(sessionError||!user){msg.textContent='Logg inn først for å melde inn pris.';return}
 const raw=Number($('report-price').value.trim().replace(',','.')),type=$('report-type').value;
 const min=type==='electric'?0.1:10,max=type==='electric'?30:45;
 if(!Number.isFinite(raw)||raw<min||raw>max){msg.textContent='Pris må være mellom '+min+' og '+max+' kroner.';return}
 const product=type==='electric'?(state.selected.connectors.some(x=>/chademo/i.test(x))?'chademo':state.selected.connectors.some(x=>/type.?2/i.test(x))&&!state.selected.connectors.some(x=>/ccs/i.test(x))?'type2':'ccs'):productToDB[type];
 $('report-submit').disabled=true;msg.textContent='Lagrer pris i databasen …';
 try{
   const {error}=await state.client.from('price_reports').insert({
     station_id:state.selected.id,product_code:product,price:raw,reporter_id:user.id,status:'approved',note:''
   });
   if(error)throw error;
   msg.textContent='Prisen er lagret og blir synlig for andre brukere. Oppdaterer kartet …';
   await loadReports();
   setTimeout(()=>{if($('report-modal').hidden===false)closeDialog()},1700);
 }catch(err){msg.textContent='Prisrapporten kunne ikke lagres: '+err.message}
 finally{$('report-submit').disabled=!state.user}
}
function infoDialog(){
 const dialog=$('report-modal');
 $('report-station').textContent='Hvor kommer prisene fra?';
 $('report-title').textContent='Om PrisKart Norge';
 $('report-form').querySelectorAll('label,input,select,.auth-box,.submitrow').forEach(el=>el.style.display='none');
 const m=$('report-status');m.className='report-status visible';
 m.textContent='⛽ Bensinstasjoner og historiske drivstoffpriser: Drivstoffpriser sin åpne eksport. ⚡ Landsdekkende ladestasjoner: Stavanger kommunes NOBIL-baserte datasett (NLOD, eksport oktober 2026), med koordinater, operatør og effekt når tilgjengelig. Nye prisinnmeldinger lagres i PrisKart-databasen fra innloggede brukere og er ikke uavhengig verifisert. Automatisk livepris og live-status for hver lader er ikke tilgjengelig uten særskilt operatør-/NOBIL-integrasjon. Dette er en uoffisiell informasjonstjeneste.';
 dialog.hidden=false;
}
function closeDialog(){
 $('report-modal').hidden=true;$('report-title').textContent='Meld inn pris';
 $('report-form').querySelectorAll('label,input,select,.auth-box,.submitrow').forEach(el=>el.style.display='');
}

/* No-code public site settings and optional preference storage. */
const CONSENT_KEY='priskart_consent_v1',PREFERENCES_KEY='priskart_filter_preferences_v1';
let siteSettings=null;
function consentChoice(choice){
 try{
  localStorage.setItem(CONSENT_KEY,choice);
  if(choice==='necessary')localStorage.removeItem(PREFERENCES_KEY);
 }catch(e){console.warn('Preference storage disabled',e)}
 $('privacy-prompt').hidden=true;
}
function initConsent(){
 const panel=$('privacy-prompt');
 // Opt-in only: no non-essential preference storage before the visitor chooses it.
 // Avoid a blocking banner over the mobile map or station-list controls.
 panel.hidden=!new URLSearchParams(location.search).has('cookievalg');
 $('privacy-necessary').addEventListener('click',()=>consentChoice('necessary'));
 $('privacy-preferences').addEventListener('click',()=>{consentChoice('preferences');savePreferences()});
 window.addEventListener('priskart-show-consent',()=>{panel.hidden=false});
 $('privacy-settings-menu').addEventListener('click',()=>{$('main-menu').open=false;panel.hidden=false});
 document.addEventListener('change',e=>{
  if(e.target?.closest?.('.filters'))setTimeout(savePreferences,0);
 });
 $('category').addEventListener('click',()=>setTimeout(savePreferences,0));
}
function savePreferences(){
 try{
  if(localStorage.getItem(CONSENT_KEY)!=='preferences')return;
  localStorage.setItem(PREFERENCES_KEY,JSON.stringify({
   mode:state.mode,fuel:state.fuel,sort:state.sort,
   recent:state.recent,priced:state.priced,power:state.chargePower,plug:state.chargePlug
  }));
 }catch(e){console.warn('Could not save optional preferences',e)}
}
function restorePreferences(){
 try{
  if(localStorage.getItem(CONSENT_KEY)!=='preferences')return;
  const p=JSON.parse(localStorage.getItem(PREFERENCES_KEY)||'{}');
  if(['all','fuel','charge'].includes(p.mode))state.mode=p.mode;
  if(['petrol95','petrol98','diesel','electric'].includes(p.fuel))state.fuel=p.fuel;
  if(['near','cheap','recent','name'].includes(p.sort))state.sort=p.sort;
  state.recent=p.recent===true;state.priced=p.priced===true;
  state.chargePower=[0,50,150].includes(p.power)?p.power:0;
  state.chargePlug=['all','ccs','type2','chademo'].includes(p.plug)?p.plug:'all';
  $('fuel-type').value=state.fuel;$('sort-by').value=state.sort;
  $('recent-only').checked=state.recent;$('priced-only').checked=state.priced;
  $('charge-power').value=String(state.chargePower||'all');
  $('charge-plug').value=state.chargePlug;
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
 }catch(e){console.warn('Invalid optional preferences',e)}
}
async function loadSiteSettings(){
 if(!state.client)return;
 try{
  const {data,error}=await state.client.from('site_settings').select('*').eq('id',1).maybeSingle();
  if(error||!data)return;
  siteSettings=data;
  const brand=document.querySelector('.brand strong'),tagline=document.querySelector('.brand small');
  if(brand)brand.textContent=data.brand_name||'PrisKart Norge';
  document.title=(data.brand_name||'PrisKart Norge')+' – finn drivstoff og lading';
  if(tagline)tagline.textContent=data.tagline||'Finn, sammenlign og oppdater';
  if(data.hero_title)document.querySelector('.intro h1').textContent=data.hero_title;
  if(data.hero_description)document.querySelector('.intro p').textContent=data.hero_description;
  document.querySelector('.intro h1').hidden=!data.show_intro;
  document.querySelector('.intro p').hidden=!data.show_intro;
  if(data.accent_color&&/^#[0-9a-fA-F]{6}$/.test(data.accent_color)){
   document.documentElement.style.setProperty('--green',data.accent_color);
   document.documentElement.style.setProperty('--brand-accent',data.accent_color);
   const style=document.createElement('style');
   style.textContent='.primary,.privacy-actions button:last-child{background:var(--brand-accent);border-color:var(--brand-accent)}.brandmark{background:var(--brand-accent)}';
   document.head.appendChild(style);
  }
  document.body.classList.toggle('site-panel-right',data.desktop_sidebar==='right');
  document.body.classList.toggle('site-compact',data.desktop_density==='compact');
  $('near-me').hidden=!data.show_near_me;
  document.querySelector('.city-wrap .cities').hidden=!data.show_city_shortcuts;
  for(const id of ['faq-menu','faq-footer']){const link=$(id);if(link)link.hidden=!data.show_faq}
  const fuels=document.querySelector('#category [data-mode="fuel"]');
  const chargers=document.querySelector('#category [data-mode="charge"]');
  fuels.hidden=!data.show_fuel;chargers.hidden=!data.show_charging;
  if(data.show_fuel===false&&state.mode==='fuel'){
   state.mode='charge';state.fuel='electric';$('fuel-type').value='electric';
  }else if(data.show_charging===false&&state.mode==='charge'){
   state.mode='fuel';state.fuel='petrol95';$('fuel-type').value='petrol95';
  }
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  if(data.logo_url&&/^https:\/\//i.test(data.logo_url)){
   const mark=document.querySelector('.brandmark');mark.replaceChildren();
   const image=document.createElement('img');image.src=data.logo_url;image.alt='';
   image.style.cssText='max-width:100%;max-height:100%;object-fit:contain;border-radius:9px';
   mark.append(image);
  }
  if(data.show_notice&&data.public_notice){
   const notice=document.createElement('div');notice.id='site-notice-banner';
   notice.textContent=data.public_notice;document.querySelector('.intro').append(notice);
  }
  filterLayer();refresh();
  if(state.map)setTimeout(()=>state.map.resize(),100);
 }catch(e){console.warn('Design settings unavailable',e)}
}

function controls(){
 $('city-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-city]');if(b)moveCity(b.dataset.city)});
 $('near-me').addEventListener('click',()=>{
  if(!state.map){status('Kartet lastes – prøv igjen straks.');return}
  if(!navigator.geolocation){status('Posisjonstjenester støttes ikke i denne nettleseren. Søk etter en by i stedet.');return}
  const btn=$('near-me');btn.disabled=true;btn.textContent='⌖ Finner …';
  navigator.geolocation.getCurrentPosition(pos=>{
   btn.disabled=false;btn.textContent='⌖ Nær meg';
   const lat=pos.coords.latitude,lon=pos.coords.longitude;
   if(lat<57.5||lat>72||lon<3.5||lon>32.5){status('Posisjonen er utenfor kartområdet. Velg en by.');return}
   state.search='';$('search').value='';$('search').blur();
   state.map.flyTo({center:[lon,lat],zoom:12.3,duration:1100});
   status('📍 Viser stasjoner rundt deg. Kartutsnittet brukes til å hente steder, men ingen presis posisjon lagres av PrisKart.');
  },error=>{
   btn.disabled=false;btn.textContent='⌖ Nær meg';
   status(error.code===1?'Posisjon ble ikke delt. Du kan søke etter en by.':'Fant ikke posisjonen. Søk etter et sted i stedet.');
  },{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
 });
 $('search').addEventListener('input',e=>{state.search=e.target.value;refresh()});
 $('search').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
   const q=norm(state.search);
   const city=Object.keys(cities).find(x=>norm(x)===q);
   if(city)moveCity(city);else if(state.map){const first=filtered()[0];if(first)selectStation(first)}
   $('search').blur();
  }
 });
 $('category').addEventListener('click',e=>{
  const btn=e.target.closest('[data-mode]');if(!btn)return;state.mode=btn.dataset.mode;
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b===btn));
  if(state.mode==='charge'&&state.fuel!=='electric'){$('fuel-type').value='electric';state.fuel='electric'}
  if(state.mode==='charge'&&state.map&&state.map.getZoom()<9){const c=state.map.getCenter();state.map.flyTo({center:[c.lng,c.lat],zoom:10.6,duration:800});}
  if(state.mode==='fuel'&&state.fuel==='electric'){$('fuel-type').value='petrol95';state.fuel='petrol95'}
  refresh();loadChargers();
 });
 $('charge-power').addEventListener('change',e=>{state.chargePower=Number(e.target.value)||0;refresh()});
 $('charge-plug').addEventListener('change',e=>{state.chargePlug=e.target.value;refresh()});
 $('fuel-type').addEventListener('change',e=>{
  state.fuel=e.target.value;
  if(state.fuel==='electric'){state.mode='charge';if(state.map&&state.map.getZoom()<9){const c=state.map.getCenter();state.map.flyTo({center:[c.lng,c.lat],zoom:10.6,duration:800})}}
  if(state.fuel!=='electric'&&state.mode==='charge')state.mode='fuel';
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  refresh();loadChargers();if(state.selected)showDetails(state.selected);
 });
 $('sort-by').addEventListener('change',e=>{state.sort=e.target.value;refresh()});
 $('recent-only').addEventListener('change',e=>{state.recent=e.target.checked;refresh()});
 $('priced-only').addEventListener('change',e=>{state.priced=e.target.checked;refresh()});
 $('details-close').addEventListener('click',()=>{state.selected=null;$('details').hidden=true;refresh()});
 $('d-report').addEventListener('click',startReport);
 initComparison();
 $('share-station').addEventListener('click',()=>{if(state.selected)shareLink(stationShareUrl(state.selected),'Se denne stasjonen i PrisKart Norge')});
 $('share-map').addEventListener('click',shareCurrentMap);
 $('report-form').addEventListener('submit',submitReport);
 $('login-send').addEventListener('click',emailLogin);
 $('login-password-btn').addEventListener('click',passwordLogin);
 $('logout-btn').addEventListener('click',async()=>{await state.client?.auth.signOut();state.user=null;updateAuthUI()});

 $('report-close').addEventListener('click',closeDialog);
 $('report-cancel').addEventListener('click',closeDialog);
 $('report-modal').addEventListener('click',e=>{if(e.target===$('report-modal'))closeDialog()});
 $('btn-about').addEventListener('click',infoDialog);
 $('mobile-toggle').addEventListener('click',()=>{
  $('search').blur();
  const side=$('sidebar'),expanded=side.classList.toggle('collapsed')===false;
  $('mobile-toggle').textContent=expanded?'Vis kart ↓':'Vis liste ↑';
  $('mobile-toggle').setAttribute('aria-expanded',String(expanded));
 });
 // The sheet can also be opened/closed with a short swipe on its title area.
 let sheetTouchY=null;
 const sheetIntro=$('sidebar').querySelector('.intro');
 sheetIntro.addEventListener('touchstart',e=>{
  if(e.target.closest('button,input,a,label,.city-wrap'))return;
  sheetTouchY=e.changedTouches?.[0]?.clientY??null;
 },{passive:true});
 sheetIntro.addEventListener('touchend',e=>{
  if(sheetTouchY===null)return;
  const distance=(e.changedTouches?.[0]?.clientY??sheetTouchY)-sheetTouchY;
  sheetTouchY=null;
  if(distance>60&&!$('sidebar').classList.contains('collapsed'))$('mobile-toggle').click();
  else if(distance< -60&&$('sidebar').classList.contains('collapsed'))$('mobile-toggle').click();
 },{passive:true});
}
let initializedMap=false;
function init(){
 if(!window.priskartMap||initializedMap)return;
 initializedMap=true;
 state.map=window.priskartMap.map;state.lib=window.priskartMap.lib;
 if(window.matchMedia('(min-width: 761px)').matches)state.map.scrollZoom.disable();
 createMapLayers();updateSources();refresh();
 if(state.loadedFuel){restoreComparison();openRequestedStation()}
 const place=new URLSearchParams(location.search).get('sted');
 if(place){const match=Object.keys(cities).find(c=>norm(c)===norm(place));if(match)state.map.jumpTo({center:cities[match],zoom:11.1})}
 if(window.innerWidth<=760){
  $('sidebar').classList.remove('collapsed');
  $('mobile-toggle').textContent='Vis kart ↓';$('mobile-toggle').setAttribute('aria-expanded','true');
 }
 state.map.on('moveend',()=>{
  clearTimeout(state.debounce);
  state.debounce=setTimeout(()=>{refresh();loadChargers();loadReports()},420);
 });
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.backend)loadReports()});
 setInterval(()=>{if(document.visibilityState==='visible'&&state.backend)loadReports()},65000);
}
function bootUI(){
 // Controls, dark mode and filters must work before map tiles finish loading.
 state.client=window.supabase?.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})||null;
 controls();initConsent();restorePreferences();initTheme();
 const link=new URLSearchParams(location.search);
 const startMode=link.get('type');
 if(startMode==='charge'||startMode==='fuel'){
  state.mode=startMode;state.fuel=startMode==='charge'?'electric':'petrol95';
  $('fuel-type').value=state.fuel;
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
 }
 refresh();
 config();loadSiteSettings();loadFuel();
 window.addEventListener('priskart-map-ready',init,{once:true});
 if(window.priskartMap)init();
}
bootUI();
})();