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
const state={map:null,lib:null,stations:new Map(),fuelPrices:new Map(),reports:new Map(),selected:null,mode:'all',fuel:'petrol95',sort:'near',recent:false,priced:false,feedAt:null,chargersError:null,loadingChargers:false,chargersLoaded:false,backend:false,siteKey:null,token:null,turnstileWidget:null,chargerRequestCache:new Set(),search:'',origin:'feed',searchId:0,loadedFuel:false,debounce:null,chargePower:0,chargePlug:'all'};
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
 const stamp=state.feedAt?formatDate(state.feedAt):'Ukjent tidspunkt';
 $('source-note').textContent='⛽ Drivstoffpriser – eksportert '+stamp+'. Priser er brukerobservasjoner, ikke garanterte sanntidspriser. ⚡ Ladere fra OpenStreetMap i valgt kartutsnitt (ikke komplett NOBIL).';
}
async function loadFuel(){
 try{
  const [sta,pri]=await Promise.all([apiOrDirect('/api/fuel/stations',fuelUrl+'stations.json'),apiOrDirect('/api/fuel/prices',fuelUrl+'prices.json')]);
  const st=sta.stations||[],pr=pri.prices||[];
  for(const raw of st){const v=fuelStation(raw);if(v)state.stations.set(v.id,v)}
  for(const raw of pr){const id='fuel:'+raw.stationId,p=+raw.price;
    if(!raw.stationId||!Number.isFinite(p)||p<=0||p>90||!labels[raw.fuelType])continue;
    const list=state.fuelPrices.get(id)||[];list.push({fuelType:raw.fuelType,price:p,updatedAt:raw.updatedAt,reportCount:raw.reportCount,source:'Drivstoffpriser – brukerrapport',verified:false});state.fuelPrices.set(id,list);
  }
  state.feedAt=sta.exportedAt||pri.exportedAt;
  state.loadedFuel=true;updateNote();updateSources();refresh();
  status('⛽ '+state.stations.size.toLocaleString('nb-NO')+' kartpunkter. Rapporter viser dato – prisene er ikke garantert sanntid.');
 }catch(err){
  state.loadedFuel=false;updateNote();status('⛽ Kunne ikke laste stasjonslisten: '+err.message+'. Kartet kan fortsatt brukes til å søke etter ladere.');
  $('summary').textContent='Datakilde utilgjengelig';
  $('results').innerHTML='<p class="empty">Stasjonslisten kunne ikke lastes. Sjekk nettverk/innholdsblokkering, eller prøv igjen senere.</p>';
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
 if(!state.map)return;filterLayer();updateSources();
 $('charger-filters').hidden=state.mode!=='charge';
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
 $('d-primary').textContent=cleanPrice(p);$('d-age').textContent=!p?'Ingen pris':age==='recent'?'Siste 72 timer':'Eldre observasjon';
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
 const m=state.map;if(!m||state.loadingChargers||state.mode==='fuel'||m.getZoom()<9)return;
 const b=m.getBounds();
 const x1=Math.max(4,b.getWest()),x2=Math.min(32,b.getEast()),y1=Math.max(57.5,b.getSouth()),y2=Math.min(72,b.getNorth());
 if(x2<=x1||y2<=y1||x2-x1>1.5||y2-y1>1)return;
 const box=[y1,x1,y2,x2].map(x=>x.toFixed(3));
 const key=box.map(x=>Math.round(x*10)/10).join(',');
 if(state.chargerRequestCache.has(key))return;
 state.loadingChargers=true;state.chargersError=null;
 const query='[out:json][timeout:20];(node["amenity"="charging_station"]('+box.join(',')+');way["amenity"="charging_station"]('+box.join(',')+'););out center tags;';
 try{
  const service='/api/chargers?bbox='+encodeURIComponent(box.join(','));
  let obj;
  try{const r=await fetch(service);if(!r.ok||!(r.headers.get('content-type')||'').includes('json'))throw Error('Server ikke tilkoblet');obj=await r.json()}
  catch(e){
   const r=await fetch('https://overpass.kumi.systems/api/interpreter?data='+encodeURIComponent(query),{cache:'default'});
   if(!r.ok)throw Error('OpenStreetMap API HTTP '+r.status);obj=await r.json();
  }
  let cnt=0;
  for(const o of obj.elements||[]){const s=chargerStation(o);if(s){state.stations.set(s.id,s);cnt++}}
  state.chargerRequestCache.add(key);state.chargersLoaded=true;updateSources();refresh();
  if(cnt)status('⚡ '+cnt+' ladepunkter lastet fra OpenStreetMap i kartutsnittet. Zoom til et nytt område for å se flere.');
 }catch(err){state.chargersError=err.message;status('⚡ Ladesøk utilgjengelig akkurat nå: '+err.message+' · NOBIL skal bli hovedkilde når API-tilgang er på plass.');refresh()}
 finally{state.loadingChargers=false}
}
async function loadReports(){
 if(!state.backend||!state.map)return;
 const b=state.map.getBounds();
 const bbox=[b.getWest(),b.getSouth(),b.getEast(),b.getNorth()].map(x=>x.toFixed(4)).join(',');
 try{
  const r=await fetch('/api/reports?bbox='+encodeURIComponent(bbox));
  if(!r.ok)throw Error('HTTP '+r.status);
  const obj=await r.json();
  for(const p of obj.reports||[]){
   if(!state.reports.has(p.stationId))state.reports.set(p.stationId,[]);
   const arr=state.reports.get(p.stationId);
   if(!arr.some(x=>x.id===p.id))arr.push({id:p.id,fuelType:p.fuelType,price:p.price,updatedAt:p.updatedAt,source:'PrisKart – brukerrapport',verified:false});
  }
  refresh();
 }catch(e){console.warn('Kunne ikke laste nye prisrapporter',e.message)}
}
function moveCity(name){
 const xy=cities[name];if(!xy)return;
 state.map.flyTo({center:xy,zoom:11.4,duration:1100});
 state.search='';$('search').value='';$('search').blur();
 if(window.innerWidth<=760){$('sidebar').classList.remove('collapsed');$('mobile-toggle').setAttribute('aria-expanded','true');$('mobile-toggle').textContent='Vis kart ↓'}
}
async function config(){
 try{
  const r=await fetch('/api/config',{cache:'no-store'});if(!r.ok)throw Error('Not hosted');
  const j=await r.json();state.backend=!!j.reportingEnabled;state.siteKey=j.turnstileSiteKey||null;
  $('d-report').textContent=state.backend?'＋ Meld inn pris':'＋ Prisrapportering (snart)';
  if(state.backend)loadReports();
 }catch(e){state.backend=false;state.siteKey=null;$('d-report').textContent='＋ Prisrapportering (snart)'}
}
function startReport(){
 if(!state.selected)return;
 $('report-modal').hidden=false;$('report-station').textContent=state.selected.name;
 $('report-status').classList.remove('visible');$('report-status').textContent='';
 const type=state.selected.type==='charge'?'electric':(state.fuel==='electric'?'petrol95':state.fuel);
 $('report-type').value=type;
 $('report-type').querySelectorAll('option').forEach(x=>x.disabled=state.selected.type==='charge'?(x.value!=='electric'):(x.value==='electric'));
 $('report-price').value='';
 const box=$('turnstile');box.replaceChildren();state.token=null;
 if(!state.backend){
  const msg=document.createElement('p');msg.className='warn';msg.textContent='Deling med andre er ikke aktiv i denne forhåndsvisningen. Publisering krever en oppsatt database og bot-beskyttelse på nettsidens server.';box.append(msg);
  $('report-submit').disabled=true;return;
 }
 $('report-submit').disabled=false;
 if(!state.siteKey){box.textContent='Bot-beskyttelse mangler; rapportering er midlertidig stengt.';$('report-submit').disabled=true;return}
 function renderTurnstile(){
  if(!window.turnstile){box.textContent='Sikkerhetskontroll kunne ikke lastes';$('report-submit').disabled=true;return}
  state.turnstileWidget=window.turnstile.render(box,{sitekey:state.siteKey,callback:t=>state.token=t,'expired-callback':()=>state.token=null});
 }
 if(window.turnstile)renderTurnstile();
 else{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.onload=renderTurnstile;script.onerror=()=>{box.textContent='Sikkerhetskontrollen kunne ikke lastes';$('report-submit').disabled=true};document.head.append(script);
 }
}
async function submitReport(e){
 e.preventDefault();
 if(!state.backend||!state.selected){return}
 const price=Number($('report-price').value.trim().replace(',','.'));const type=$('report-type').value;
 const max=type==='electric'?30:45,min=type==='electric'?.1:10;
 const msg=$('report-status');msg.className='report-status visible';
 if(!Number.isFinite(price)||price<min||price>max){msg.textContent='Kontroller pris. Tillatt intervall: '+min+'–'+max+' kr.';return}
 if(!state.token){msg.textContent='Fullfør sikkerhetskontrollen før du sender.';return}
 $('report-submit').disabled=true;msg.textContent='Sender prisrapport …';
 try{
  const s=state.selected;
  const r=await fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stationId:s.id,stationName:s.name,latitude:s.lat,longitude:s.lon,fuelType:type,price,token:state.token})});
  const j=await r.json();if(!r.ok)throw Error(j.error||'Kunne ikke lagre pris');
  msg.textContent='Takk! Prisen er publisert som brukerrapport. Andre kan se den når kartet oppdateres.';
  if(!state.reports.has(s.id))state.reports.set(s.id,[]);
  state.reports.get(s.id).push({id:j.id,fuelType:type,price,updatedAt:j.updatedAt,source:'PrisKart – brukerrapport',verified:false});
  state.fuel=type;$('fuel-type').value=type;showDetails(s);refresh();
  state.token=null;setTimeout(()=>{$('report-modal').hidden=true},2200);
 }catch(err){msg.textContent='Kunne ikke publisere: '+err.message}
 finally{$('report-submit').disabled=false}
}
function infoDialog(){
 const dialog=$('report-modal');
 $('report-station').textContent='Hvor kommer prisene fra?';
 $('report-title').textContent='Om PrisKart Norge';
 $('report-form').querySelectorAll('label,input,select,#turnstile,.submitrow').forEach(el=>el.style.display='none');
 const m=$('report-status');m.className='report-status visible';
 m.textContent='⛽ Bensinstasjoner og historiske observasjoner: Drivstoffpriser sitt åpne datasett. ⚡ Ladere i kartutsnittet: OpenStreetMap. Komplette og oppdaterte laderdata krever NOBIL API. Brukerinnmeldte priser publiseres først når PrisKart sin database og sikkerhet er satt opp. Tjenesten er uoffisiell og prisene må bekreftes på stasjonen.';
 dialog.hidden=false;
}
function closeDialog(){
 $('report-modal').hidden=true;$('report-title').textContent='Meld inn pris';
 $('report-form').querySelectorAll('label,input,select,#turnstile,.submitrow').forEach(el=>el.style.display='');
}
function controls(){
 $('city-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-city]');if(b)moveCity(b.dataset.city)});
 $('near-me').addEventListener('click',()=>{
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
   if(city)moveCity(city);else{const first=filtered()[0];if(first)selectStation(first)}
   $('search').blur();
  }
 });
 $('category').addEventListener('click',e=>{
  const btn=e.target.closest('[data-mode]');if(!btn)return;state.mode=btn.dataset.mode;
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b===btn));
  if(state.mode==='charge'&&state.fuel!=='electric'){$('fuel-type').value='electric';state.fuel='electric'}
  if(state.mode==='charge'&&state.map.getZoom()<9){const c=state.map.getCenter();state.map.flyTo({center:[c.lng,c.lat],zoom:10.6,duration:800});}
  if(state.mode==='fuel'&&state.fuel==='electric'){$('fuel-type').value='petrol95';state.fuel='petrol95'}
  refresh();loadChargers();
 });
 $('charge-power').addEventListener('change',e=>{state.chargePower=Number(e.target.value)||0;refresh()});
 $('charge-plug').addEventListener('change',e=>{state.chargePlug=e.target.value;refresh()});
 $('fuel-type').addEventListener('change',e=>{
  state.fuel=e.target.value;
  if(state.fuel==='electric'){state.mode='charge';if(state.map.getZoom()<9){const c=state.map.getCenter();state.map.flyTo({center:[c.lng,c.lat],zoom:10.6,duration:800})}}
  if(state.fuel!=='electric'&&state.mode==='charge')state.mode='fuel';
  document.querySelectorAll('#category button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  refresh();loadChargers();if(state.selected)showDetails(state.selected);
 });
 $('sort-by').addEventListener('change',e=>{state.sort=e.target.value;refresh()});
 $('recent-only').addEventListener('change',e=>{state.recent=e.target.checked;refresh()});
 $('priced-only').addEventListener('change',e=>{state.priced=e.target.checked;refresh()});
 $('details-close').addEventListener('click',()=>{state.selected=null;$('details').hidden=true;refresh()});
 $('d-report').addEventListener('click',startReport);
 $('report-form').addEventListener('submit',submitReport);
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
function init(){
 if(!window.priskartMap)return;
 state.map=window.priskartMap.map;state.lib=window.priskartMap.lib;
 controls();createMapLayers();updateSources();loadFuel();config();refresh();
 if(window.innerWidth<=760){$('sidebar').classList.remove('collapsed');$('mobile-toggle').textContent='Vis kart ↓';$('mobile-toggle').setAttribute('aria-expanded','true')}
 state.map.on('moveend',()=>{
  clearTimeout(state.debounce);
  state.debounce=setTimeout(()=>{refresh();loadChargers();loadReports()},420);
 });
 state.map.on('click',()=>{});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.backend)loadReports()});
 setInterval(()=>{if(document.visibilityState==='visible'&&state.backend)loadReports()},65000);
}
window.addEventListener('priskart-map-ready',init,{once:true});
if(window.priskartMap)init();
})();