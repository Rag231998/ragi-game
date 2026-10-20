/* OSLO ATLAS 2.0 · Informasjon fra Entur, offentlige kameraer og ADS-B.
   Ekte rapporterte posisjoner; ingen oppdiktede live-kjøretøy. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const JP='https://api.entur.io/journey-planner/v3/graphql';
const GEOCODER='https://api.entur.io/geocoder/v3/autocomplete';
const VEHICLES='https://api.entur.io/realtime/v2/vehicles/graphql';
const HEADERS={'ET-Client-Name':'osloatlas-public-map'};
const GH={...HEADERS,'Content-Type':'application/json'};
const REGION={s:59.66,n:60.57,w:9.86,e:11.8};
const CAMERAS=[
 {id:'h-raadhus',name:'Rådhuskaia',subtitle:'Oslo Havn · oppdatert stillbilde',lng:10.7316,lat:59.9087,site:'https://www.oslohavn.no/no/meny/webkamera/',img:'https://www.oslohavn.no/webcam/raadhusintranett.jpg',kind:'havn'},
 {id:'h-kavr',name:'Kavringen',subtitle:'Oslo Havn · oppdatert stillbilde',lng:10.7173,lat:59.9093,site:'https://www.oslohavn.no/no/meny/webkamera/',img:'https://www.oslohavn.no/webcam/kavringen.jpg',kind:'havn'},
 {id:'h-vippet',name:'Vippetangen',subtitle:'Oslo Havn · oppdatert stillbilde',lng:10.748,lat:59.9036,site:'https://www.oslohavn.no/no/meny/webkamera/',img:'https://www.oslohavn.no/webcam/vippetangen.jpg',kind:'havn'},
 {id:'v-furuset',name:'Furuset (E6)',subtitle:'Statens vegvesen · veitrafikkamera',lng:10.869,lat:59.943,site:'https://www.vegvesen.no/trafikk/vaerveikamera/0329004',kind:'veg'},
 {id:'v-hjortnes',name:'Hjortnes (E18)',subtitle:'Statens vegvesen · veitrafikkamera',lng:10.706,lat:59.9097,site:'https://www.vegvesen.no/trafikk/vaerveikamera/0329002',kind:'veg'}
];
let map,lib,tab='avganger',filter='all',currentStop=null,board=[],boardRequest=0,searchRequest=0;
let state={stops:new Map(),transit:new Map(),aircraft:new Map(),camera:new Map(),flightSource:'',lastAir:0,lastVehicle:0,flyBusy:false,vehicleBusy:false,stopsBusy:false,boardBusy:false};
let searchTimer=0,lastSearch='',stopKey='',flightFallback=0;
const clock=d=>{const x=new Date(d);return Number.isFinite(+x)?x.toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Oslo'}):'–'};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const fmtKm=h=>typeof h==='number'&&Number.isFinite(h)?Math.round(h*.3048).toLocaleString('nb-NO')+' m':h==='ground'?'På bakken':'Ukjent';
const fmtSpeed=s=>Number.isFinite(Number(s))?Math.round(Number(s)*1.852)+' km/t':'Ukjent';
const within=p=>p.lng>=REGION.w&&p.lng<=REGION.e&&p.lat>=REGION.s&&p.lat<=REGION.n;
const element=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
function showMessage(id,text,error=false){const e=$(id);if(!e)return;e.textContent=text;e.classList.toggle('error',error)}
function setStatus(msg){$('map-status').textContent=msg}
function showTab(name){
  tab=name;
  ['avganger','trafikk','kamera'].forEach(key=>{
    const active=key===name;const b=$('tab-'+key),p=$('panel-'+key);
    b.setAttribute('aria-selected',String(active));p.classList.toggle('active',active);
  });
  if(name==='kamera')drawCameraMarkers();
  if(name==='trafikk')renderVehicleList();
}
function makePin(kind,emoji){const e=element('div','custom-pin '+kind,emoji);e.setAttribute('role','button');e.setAttribute('tabindex','0');e.addEventListener('keydown',x=>{if(x.key==='Enter'||x.key===' '){x.preventDefault();e.click()}});return e}
function popup(coords,title,description,more){
  const body=element('div');body.append(element('div','popup-name',title),element('div','popup-text',description));
  if(more)body.append(more);
  new lib.Popup({offset:21,maxWidth:'320px'}).setLngLat(coords).setDOMContent(body).addTo(map);
}
function focusPoint(lng,lat,zoom=13.8){map.flyTo({center:[lng,lat],zoom,pitch:43,bearing:-12,duration:1200,essential:true})}
function toggleMapButtons(){
  const b3=$('map-3d'),bs=$('map-satellite');
  b3.classList.toggle('active',map.getPitch()>15);
  bs.classList.toggle('active',!!map.getLayer('atlas-aerial')&&map.getLayoutProperty('atlas-aerial','visibility')==='visible');
}
function setupBase(){
 try {
  const style=map.getStyle();const anchor=style.layers.find(l=>l.type==='symbol')?.id;
  map.addSource('atlas-elevation',{type:'raster-dem',tiles:['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],tileSize:256,maxzoom:13,encoding:'terrarium'});
  try{map.setTerrain({source:'atlas-elevation',exaggeration:1.16})}catch(e){console.warn('Høyder kan ikke aktiveres',e)}
  map.addSource('atlas-sat',{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,maxzoom:19});
  map.addLayer({id:'atlas-aerial',type:'raster',source:'atlas-sat',layout:{visibility:'none'}},anchor);
  map.addSource('atlas-buildings',{type:'vector',url:'https://tiles.openfreemap.org/planet'});
  map.addLayer({id:'atlas-3d-buildings',type:'fill-extrusion',source:'atlas-buildings','source-layer':'building',minzoom:13.4,paint:{
    'fill-extrusion-color':'#a6c8d8',
    'fill-extrusion-height':['max',4,['coalesce',['to-number',['get','render_height']],['*',3,['to-number',['get','building:levels'],3]],9]],
    'fill-extrusion-base':['coalesce',['to-number',['get','render_min_height']],0],
    'fill-extrusion-opacity':0.9
  }},anchor);
 } catch(e){console.warn('Valgfrie 3D-kartlag kunne ikke lastes',e)}
}
function placeType(p){
 const modes=(p.transportModes||[]).map(x=>String(x?.mode||'').toLowerCase());
 if(modes.includes('metro'))return 'metro';
 if(modes.includes('rail'))return 'rail';
 if(modes.includes('tram'))return 'tram';
 if(modes.includes('bus')||modes.includes('coach'))return 'bus';
 return 'other';
}
const typeIcon=t=>({metro:'🚇',rail:'🚆',tram:'🚋',bus:'🚌',other:'📍'}[t]||'📍');
function parseStop(f){
 const p=f.properties||{},co=f.geometry?.coordinates||[];
 return {id:p.id,name:p.names?.default||p.names?.display||'Stoppested',lng:Number(co[0]),lat:Number(co[1]),type:placeType(p)};
}
function stopSource(){
 if(map.getSource('atlas-stops'))return;
 map.addSource('atlas-stops',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
 map.addLayer({id:'atlas-stops-markers',type:'circle',source:'atlas-stops',minzoom:10,paint:{
  'circle-radius':['interpolate',['linear'],['zoom'],11,3,14,6,18,10],
  'circle-color':['match',['get','type'],'metro','#318df2','rail','#4fda91','tram','#ffc15e','bus','#ac7af0','#aac4d1'],
  'circle-stroke-color':'#0a1a27','circle-stroke-width':2
 }});
 map.on('click','atlas-stops-markers',e=>{const id=e.features?.[0]?.properties?.id;if(id&&state.stops.has(id))selectStop(state.stops.get(id))});
 map.on('mouseenter','atlas-stops-markers',()=>map.getCanvas().style.cursor='pointer');
 map.on('mouseleave','atlas-stops-markers',()=>map.getCanvas().style.cursor='');
}
function drawStops(){
 const features=[...state.stops.values()].slice(-900).map(s=>({
   type:'Feature',geometry:{type:'Point',coordinates:[s.lng,s.lat]},properties:{id:s.id,type:s.type}
 }));
 map.getSource('atlas-stops')?.setData({type:'FeatureCollection',features});
}
async function queryStops(text,bbox){
 const u=new URL(GEOCODER);
 u.searchParams.set('layers','stopPlace');u.searchParams.set('lang','no');
 u.searchParams.set('limit',bbox?'175':'40');u.searchParams.set('multimodal','parent');
 if(text)u.searchParams.set('q',text);
 if(bbox)u.searchParams.set('bbox',bbox);
 else{u.searchParams.set('lat','59.97');u.searchParams.set('lon','10.94');u.searchParams.set('radius','110')}
 const res=await fetch(u,{headers:HEADERS});
 if(!res.ok)throw Error('Entur stoppestedsøk: HTTP '+res.status);
 const json=await res.json();
 return (json.features||[]).filter(f=>f.properties?.layer==='stopPlace').map(parseStop)
   .filter(s=>typeof s.id==='string'&&s.id.startsWith('NSR:StopPlace:')&&within(s));
}
function saveStops(stops){for(const s of stops)state.stops.set(s.id,s);drawStops()}
function renderSearch(items){
 const box=$('search-results');box.replaceChildren();
 for(const s of items.slice(0,20)){
   const row=element('button','result'+(currentStop?.id===s.id?' selected':''));row.type='button';
   row.setAttribute('role','option');row.setAttribute('aria-selected',String(currentStop?.id===s.id));
   const sym=element('span','symbol',typeIcon(s.type)),text=element('span');
   text.append(element('strong',null,s.name),element('small',null,({metro:'T-bane',tram:'Trikk',bus:'Buss',rail:'Tog'}[s.type]||'Holdeplass')+' · Oslo / Akershus'));
   row.append(sym,text);row.addEventListener('click',()=>selectStop(s));box.append(row);
 }
 if(!items.length)box.append(element('p','helper','Ingen holdeplasser funnet. Prøv «Grorud», «Lillestrøm» eller «Jessheim».'));
}
function score(s,q){
 const a=norm(s.name),b=norm(q.replace(/\s+(t|tbane|tbanen|t.bane)$/i,''));
 const bonus=/\s+t$/i.test(q)&&s.type==='metro'?200:0;
 return (a===b?1000:a.startsWith(b)?600:a.includes(b)?200:0)+bonus;
}
async function searchStops(q){
 lastSearch=q;const number=++searchRequest;
 if(!q||q.trim().length<2){renderSearch([]);$('search-hint').textContent='Søk etter et sted og velg én holdeplass for å se avganger.';return}
 showMessage('search-hint','Søker …');
 try{
   const clean=q.trim().replace(/\s+(t|tbane|tbanen|t.bane)$/i,'').trim();
   const qs=[...new Set([clean,q.trim()].filter(Boolean))];
   const fetched=await Promise.allSettled(qs.map(x=>queryStops(x)));
   if(number!==searchRequest)return;
   const results=new Map();
   for(const r of fetched)if(r.status==='fulfilled')for(const s of r.value)results.set(s.id,s);
   if(fetched.every(r=>r.status==='rejected'))throw fetched[0].reason;
   const matches=[...results.values()].sort((a,b)=>score(b,q)-score(a,q));
   saveStops(matches);renderSearch(matches);
   showMessage('search-hint',matches.length+' treff. Velg en holdeplass for å se avganger.');
 }catch(e){if(number===searchRequest)showMessage('search-hint','Søket feilet: '+e.message,true)}
}
async function nearbyStops(){
 if(state.stopsBusy||map.getZoom()<9.9)return;
 const b=map.getBounds(),c=map.getCenter(),key=[Math.round(c.lng*5),Math.round(c.lat*5),Math.floor(map.getZoom()/2)].join(',');
 if(key===stopKey)return;stopKey=key;state.stopsBusy=true;
 const box=[Math.max(REGION.w,b.getWest()-.04),Math.max(REGION.s,b.getSouth()-.04),Math.min(REGION.e,b.getEast()+.04),Math.min(REGION.n,b.getNorth()+.04)];
 if(box[0]>=box[2]||box[1]>=box[3]){state.stopsBusy=false;return}
 try{saveStops(await queryStops('',box.map(x=>x.toFixed(4)).join(',')))}
 catch(e){stopKey='';console.warn('Stoppesteder i kartet',e)}
 finally{state.stopsBusy=false}
}
async function selectStop(s){
 currentStop=s;const number=++boardRequest;board=[];showTab('avganger');
 $('board').hidden=false;
 $('board-name').textContent=s.name;
 showMessage('board-updated','Henter avganger fra Entur …');
 $('board-rows').replaceChildren();
 renderSearch([s]);
 focusPoint(s.lng,s.lat,15.6);
 await loadBoard(number);
}
async function loadBoard(requestNumber){
 if(!currentStop)return;
 const s=currentStop,id=s.id;
 const query='query($id:String!){stopPlace(id:$id){name estimatedCalls(numberOfDepartures:35,timeRange:7200){realtime cancellation aimedDepartureTime expectedDepartureTime destinationDisplay{frontText} serviceJourney{line{publicCode transportMode}}}}}';
 try {
  const r=await fetch(JP,{method:'POST',headers:GH,body:JSON.stringify({query,variables:{id}})});
  if(!r.ok)throw Error('HTTP '+r.status);
  const j=await r.json();if(j.errors?.length)throw Error(j.errors[0].message);
  if(currentStop?.id!==id||(requestNumber&&requestNumber!==boardRequest))return;
  board=j.data?.stopPlace?.estimatedCalls||[];
  showMessage('board-updated','Oppdatert '+clock(new Date())+' · '+board.length+' avganger');
  renderBoard();
 }catch(e){if(currentStop?.id===id)showMessage('board-updated','Entur-avganger ikke tilgjengelige: '+e.message,true)}
}
function renderBoard(){
 const div=$('board-rows');div.replaceChildren();let count=0;
 const a=[...board].sort((x,y)=>new Date(x.expectedDepartureTime||x.aimedDepartureTime)-new Date(y.expectedDepartureTime||y.aimedDepartureTime));
 for(const c of a){
  const d=new Date(c.expectedDepartureTime||c.aimedDepartureTime);if(!Number.isFinite(+d)||d.getTime()<Date.now()-60000)continue;
  if(count++>=16)break;
  const line=c.serviceJourney?.line||{},mode=String(line.transportMode||'').toLowerCase();
  const row=element('div','board-row'),code=element('span','route-number '+mode,line.publicCode||'–');
  const mid=element('div'),dest=element('div','route-destination',c.destinationDisplay?.frontText||'Ukjent destinasjon');
  mid.append(dest,element('div','route-detail',c.cancellation?'Innstilt':c.realtime?'● Sanntid':'○ Rutetid'));
  const mins=Math.ceil((d.getTime()-Date.now())/60000),eta=element('span','time'+(c.cancellation?' cancelled':''),mins<=0?'Nå':mins<25?mins+' min':clock(d));
  row.append(code,mid,eta);div.append(row);
 }
 if(!count)div.append(element('p','helper','Ingen avganger de neste to timene fra dette stoppestedet.'));
}
function makeTransitMarker(v){
 const kind=v.type==='rail'?'train':'bus',el=makePin(kind,v.type==='rail'?'🚆':'🚌');
 const marker=new lib.Marker({element:el}).setLngLat([v.lng,v.lat]).addTo(map);
 const item={marker,el,data:v};
 el.addEventListener('click',()=>{
  const p=item.data;
  const description=(p.operator||'Entur')+' · linje '+(p.line||'ukjent')+(p.dest?' mot '+p.dest:'')
    +'. Sist rapportert GPS kl. '+clock(p.time)+'.';
  popup([p.lng,p.lat],p.type==='rail'?'🚆 Tog':'🚌 '+(p.isFlybus?'Flybuss':'Buss'),description);
 });
 return item;
}
function allowed(type){return filter==='all'||filter===type||(filter==='bus'&&type==='bus')}
function filterMarkers(){
 for(const m of state.transit.values())m.el.style.display=allowed(m.data.type)?'grid':'none';
 for(const m of state.aircraft.values())m.el.style.display=allowed('flight')?'grid':'none';
}
async function loadVehicles(){
 if(state.vehicleBusy)return;state.vehicleBusy=true;
 const bb='{minLat:59.66,minLon:9.86,maxLat:60.57,maxLon:11.8}';
 const q='query{vehicles(boundingBox:'+bb+',maxDataAge:"PT5M"){vehicleId mode lastUpdated destinationName location{latitude longitude} operator{name} codespace{codespaceId} line{publicCode lineName}}}';
 try{
  const r=await fetch(VEHICLES,{method:'POST',headers:GH,body:JSON.stringify({query:q})});
  if(!r.ok)throw Error('HTTP '+r.status);
  const j=await r.json();if(j.errors?.length)throw Error(j.errors[0].message);
  const vehicles=(j.data?.vehicles||[]).map((a,i)=>{
    const type=String(a.mode||'').toLowerCase(),lat=Number(a.location?.latitude),lng=Number(a.location?.longitude),time=a.lastUpdated;
    const id=(a.codespace?.codespaceId||'Entur')+':'+(a.vehicleId||i);
    const operator=a.operator?.name||a.codespace?.codespaceId||'';
    return{id,lat,lng,time,type:type==='rail'?'rail':type==='bus'||type==='coach'?'bus':'other',line:a.line?.publicCode||a.line?.lineName,dest:a.destinationName,operator,isFlybus:/flybuss/i.test(operator)||a.codespace?.codespaceId==='NBU'};
  }).filter(v=>['rail','bus'].includes(v.type)&&within(v)&&Date.now()-Date.parse(v.time)<300000&&Number.isFinite(Date.parse(v.time)));
  const ids=new Set();
  for(const v of vehicles){
    ids.add(v.id);
    let item=state.transit.get(v.id);
    if(!item){item=makeTransitMarker(v);state.transit.set(v.id,item)}
    else{item.data=v;item.marker.setLngLat([v.lng,v.lat])}
  }
  for(const [id,item] of state.transit)if(!ids.has(id)){item.marker.remove();state.transit.delete(id)}
  $('vehicle-count').textContent=vehicles.length+' GPS';
  showMessage('traffic-status','Entur '+clock(new Date())+': '+vehicles.filter(v=>v.type==='rail').length+' tog, '+vehicles.filter(v=>v.type==='bus').length+' busser med rapportert GPS. Fly oppdateres separat.');
  renderVehicleList();filterMarkers();
 }catch(e){showMessage('traffic-status','Entur GPS-posisjoner ikke tilgjengelige: '+e.message,true)}
 finally{state.vehicleBusy=false}
}
function renderVehicleList(){
 const div=$('vehicle-list');div.replaceChildren();
 const vs=[...state.transit.values()].map(x=>x.data).sort((a,b)=>(b.isFlybus?1:0)-(a.isFlybus?1:0)).slice(0,22);
 for(const v of vs){
  const b=element('button','item'),left=element('span');
  left.append(element('strong',null,(v.type==='rail'?'🚆 ':v.isFlybus?'🚌 Flybuss ':'🚌 ')+(v.line||'–')+(v.dest?' mot '+v.dest:'')),element('small',null,(v.operator||'Entur')+' · '+clock(v.time)));
  b.append(left,element('span','arrow','›'));b.addEventListener('click',()=>{showTab('trafikk');focusPoint(v.lng,v.lat,13.4);state.transit.get(v.id)?.el.click()});
  div.append(b);
 }
 if(!vs.length)div.append(element('p','helper','Ingen rapporterte kjøretøyposisjoner tilgjengelige akkurat nå.'));
}
function planeName(a){return String(a.flight||a.r||a.hex||'Ukjent fly').trim()}
function makePlane(a,id){
 const el=makePin('flight','✈'),marker=new lib.Marker({element:el}).setLngLat([+a.lon,+a.lat]).addTo(map);
 const item={marker,el,data:a};
 el.addEventListener('click',()=>{
  const f=item.data,h=f.alt_geom??f.alt_baro;
  popup([Number(f.lon),Number(f.lat)],'✈ '+planeName(f),'Registrering: '+(f.r||'ukjent')+' · Høyde: '+fmtKm(h)+' · Fart: '+fmtSpeed(f.gs)+'. Siste posisjonsrapport: '+(f.seen_pos??'?')+' sek siden. Kilde: '+state.flightSource+'.');
 });
 return item;
}
async function requestJson(url,timeout=11000){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{
  const r=await fetch(url,{signal:controller.signal,cache:'no-store'});
  if(!r.ok)throw Error('HTTP '+r.status);
  const d=await r.json();
  if(!Array.isArray(d.ac))throw Error('Flylisten mangler i API-svaret');
  return d.ac;
 } finally {clearTimeout(timer)}
}
async function loadFlights(force=false){
 if(state.flyBusy)return;
 if(!force&&Date.now()-state.lastAir<175000)return;
 state.flyBusy=true;
 const targets=[
  {source:'Airplanes.live',url:'https://api.airplanes.live/v2/point/60.19/11.1/180'},
  {source:'ADSB.fi',url:'https://opendata.adsb.fi/api/v3/lat/60.19/lon/11.1/dist/180'}
 ];
 try{
  let raw=null,errors=[];
  for(const t of targets){
    try{raw=await requestJson(t.url);state.flightSource=t.source;break}
    catch(e){errors.push(t.source+': '+e.message)}
  }
  if(!raw)throw Error(errors.join(' / '));
  const fresh=new Map();
  for(const f of raw){
    const lat=Number(f.lat),lng=Number(f.lon),age=Number(f.seen_pos);
    if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat<58.5||lat>62.1||lng<7.4||lng>14.3)continue;
    if(!Number.isFinite(age)||age>150)continue;
    const id=String(f.hex||f.flight||lat+','+lng).toLowerCase();
    if(!fresh.has(id)||Number(fresh.get(id).seen_pos)>age)fresh.set(id,f);
  }
  const liveIds=new Set();
  for(const [id,f] of fresh){
    liveIds.add(id);
    let item=state.aircraft.get(id);
    if(!item){item=makePlane(f,id);state.aircraft.set(id,item)}
    else{item.data=f;item.marker.setLngLat([Number(f.lon),Number(f.lat)])}
  }
  for(const [id,item] of state.aircraft)if(!liveIds.has(id)){item.marker.remove();state.aircraft.delete(id)}
  $('flight-count').textContent=fresh.size+' fly';
  showMessage('flight-error','');
  setStatus(fresh.size+' fly · '+state.flightSource+' · '+clock(new Date()));
  renderFlightList();filterMarkers();
  state.lastAir=Date.now();
  if(!fresh.size)showMessage('flight-error','Datakilden svarte, men fant ingen ferske flyposisjoner i området. Sjekk eksternt flykart for sammenligning.',true);
 }catch(e){
  $('flight-count').textContent='Ingen data';
  setStatus('✈️ Flydatakilden er utilgjengelig');
  showMessage('flight-error','Flyposisjoner kunne ikke lastes: '+e.message+'. Datakilden kan blokkere nettleseren (CORS) eller ha nådd grensen sin. Ingen fiktive fly vises.',true);
  state.lastAir=Date.now();
 }finally{state.flyBusy=false}
}
function renderFlightList(){
 const div=$('flight-list');div.replaceChildren();
 const list=[...state.aircraft.values()].map(x=>x.data).sort((a,b)=>{
  const x=Math.hypot(+a.lat-60.1939,(+a.lon-11.1)*.5),y=Math.hypot(+b.lat-60.1939,(+b.lon-11.1)*.5);return x-y;
 }).slice(0,22);
 for(const f of list){
  const id=String(f.hex||f.flight||f.lat+','+f.lon).toLowerCase();
  const b=element('button','item'),l=element('span'),name=planeName(f);
  l.append(element('strong',null,'✈ '+name),element('small',null,'Høyde '+fmtKm(f.alt_geom??f.alt_baro)+' · '+fmtSpeed(f.gs)));
  b.append(l,element('span','arrow','›'));
  b.addEventListener('click',()=>{showTab('trafikk');filter='flight';setFilter();focusPoint(+f.lon,+f.lat,11);state.aircraft.get(id)?.el.click()});
  div.append(b);
 }
 if(!list.length)div.append(element('p','helper','Ingen fly med tilgjengelig GPS akkurat nå. Prøv å oppdatere om litt.'));
}
function addCamera(c){
 const el=makePin('camera','📷'),marker=new lib.Marker({element:el}).setLngLat([c.lng,c.lat]).addTo(map);
 el.addEventListener('click',()=>{showTab('kamera');selectCamera(c);focusPoint(c.lng,c.lat,12)});
 state.camera.set(c.id,{marker,el});
}
function drawCameraMarkers(){for(const c of CAMERAS)if(!state.camera.has(c.id))addCamera(c)}
function selectCamera(c){
 const div=$('camera-preview');div.hidden=false;div.replaceChildren();
 div.append(element('strong',null,'📷 '+c.name),element('p','helper',c.subtitle+'. Omtrentlig plassering på kartet.'));
 if(c.img){
  const image=element('img');image.alt='Oppdatert kamerabilde fra '+c.name;image.loading='lazy';
  image.src=c.img+'?atlas='+Math.floor(Date.now()/60000);
  image.onerror=()=>{image.replaceWith(element('p','message','Kamerabildet kan ikke vises direkte. Åpne den offentlige kilden nedenfor.'))};
  div.append(image,element('p','helper','Kilden oppdaterer stillbildet med varierende frekvens. Dette er ikke en videostrøm.'));
 }else div.append(element('p','helper','Statens vegvesen viser det oppdaterte bildet på sin egen nettside. Visningen er ikke innebygd her.'));
 const link=element('a',null,'Åpne kamera hos '+(c.kind==='veg'?'Statens vegvesen':'Oslo Havn')+' ↗');
 link.href=c.site;link.target='_blank';link.rel='noopener noreferrer';div.append(link);
 // Scroll to camera preview and show its position.
 div.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function drawCameras(){
 const list=$('camera-list');list.replaceChildren();
 for(const c of CAMERAS){
  const b=element('button','camera-card'),icon=element('div','camera-icon','📷'),right=element('span');
  right.append(element('strong',null,c.name),element('small',null,c.subtitle));
  b.append(icon,right);b.addEventListener('click',()=>{selectCamera(c);focusPoint(c.lng,c.lat,12)});
  list.append(b);
 }
}
function setFilter(){
 $('traffic-filters').querySelectorAll('button[data-layer]').forEach(b=>b.classList.toggle('active',b.dataset.layer===filter));
 filterMarkers();
}
function setTabsEvents(){
 for(const key of ['avganger','trafikk','kamera'])$('tab-'+key).addEventListener('click',()=>showTab(key));
 $('stop-search').addEventListener('input',e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchStops(e.target.value.trim()),320)});
 $('stop-search').addEventListener('keydown',e=>{if(e.key==='Escape'){$('stop-search').value='';searchStops('')}});
 $('board-refresh').addEventListener('click',()=>loadBoard());
 $('traffic-filters').addEventListener('click',e=>{
  const b=e.target.closest('[data-layer]');if(!b)return;
  filter=b.dataset.layer;setFilter();
  if(filter==='flight')focusPoint(11.1,60.1939,9.9);
 });
 $('traffic-refresh').addEventListener('click',()=>{loadVehicles();loadFlights(true)});
 $('go-airport').addEventListener('click',()=>{showTab('trafikk');filter='flight';setFilter();focusPoint(11.1,60.1939,10)});
 $('go-oslo').addEventListener('click',()=>{showTab('trafikk');focusPoint(10.752,59.914,12)});
 $('map-home').addEventListener('click',()=>map.flyTo({center:[10.93,60.025],zoom:10.2,pitch:44,bearing:-12,duration:1200}));
 $('map-3d').addEventListener('click',()=>{map.easeTo({pitch:map.getPitch()>20?0:65,duration:700});setTimeout(toggleMapButtons,750)});
 $('map-satellite').addEventListener('click',()=>{
   if(map.getLayer('atlas-aerial'))map.setLayoutProperty('atlas-aerial','visibility',map.getLayoutProperty('atlas-aerial','visibility')==='visible'?'none':'visible');
   toggleMapButtons();
 });
 $('mobile-toggle').addEventListener('click',()=>{
   const w=$('workspace');w.classList.toggle('compact');
   const show=!w.classList.contains('compact');$('mobile-toggle').textContent=show?'Skjul −':'Vis panel +';
   $('mobile-toggle').setAttribute('aria-expanded',String(show));
 });
}
async function initial(){
 // Do not falsely show hard-coded sample departures.
 $('stop-search').value='Grorud T';
 searchStops('Grorud T');
 nearbyStops();
 loadVehicles();loadFlights();
 setInterval(()=>{if(document.visibilityState==='visible'){if(currentStop)loadBoard();loadVehicles()}},45000);
 setInterval(()=>{if(document.visibilityState==='visible')loadFlights()},180000);
 map.on('moveend',()=>{
   nearbyStops();
 });
 if(window.innerWidth<=640)$('workspace').classList.add('compact');
}
window.atlasInit=function(mapRef,libRef){
 map=mapRef;lib=libRef;setupBase();stopSource();drawCameraMarkers();drawCameras();setTabsEvents();showTab('avganger');initial();
};
if(window.osloAtlas)window.atlasInit(window.osloAtlas.map,window.osloAtlas.lib);
})();