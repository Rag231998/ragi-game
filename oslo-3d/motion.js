/* Oslo Atlas Motion: modelling versus observed positions are visibly separate. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const ENTUR='https://api.entur.io/journey-planner/v3/graphql',GEO='https://api.entur.io/geocoder/v3/autocomplete';
const GH={'ET-Client-Name':'osloatlas-motion','Content-Type':'application/json'},H={'ET-Client-Name':'osloatlas-motion'};
const NAMES=['Grorud','Ammerud','Rødtvet','Kalbakken','Veitvet','Romsås','Stovner','Helsfyr','Brynseng','Økern','Sinsen','Majorstuen','Oslo S','Nationaltheatret','Lillestrøm','Strømmen','Kløfta','Jessheim','Eidsvoll','Aker brygge','Nesoddtangen','Vippetangen','Hovedøya'];
let map,lib,initialized=false,cars=[],projected=new Map(),stops=[],loadBusy=false,stationBusy=false,follow=null;
let carOn=true,estimatedOn=true,timer=0,roadRefresh=0,errorMsg='';
const normalized=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'');
const finite=x=>Number.isFinite(x);
function dist(a,b){return Math.hypot((a[0]-b[0])*111000*Math.cos((a[1]+b[1])/2*Math.PI/180),(a[1]-b[1])*111000)}
function pathPoint(line,p){
 const lengths=[];let sum=0;
 for(let i=1;i<line.length;i++){const v=dist(line[i],line[i-1]);lengths.push(v);sum+=v}
 let v=Math.max(0,Math.min(.99999,p))*sum;if(sum<1)return line[0];
 for(let i=1;i<line.length;i++){if(v<=lengths[i-1]){let q=lengths[i-1]?v/lengths[i-1]:0;return [line[i-1][0]+(line[i][0]-line[i-1][0])*q,line[i-1][1]+(line[i][1]-line[i-1][1])*q]}v-=lengths[i-1]}
 return line[line.length-1];
}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0)/4294967295}
function status(){
 const e=$('motion-status');if(!e)return;
 e.textContent='🚗 '+(carOn?cars.length:0)+' modellerte biler · 🚆 '+(estimatedOn?projected.size:0)+' rutetidsberegnede kjøretøy';
 if(errorMsg){const p=document.createElement('div');p.style.cssText='color:#ffcba4;font-size:10px;margin-top:5px';p.textContent=errorMsg;e.appendChild(p)}
}
function setupUi(){
 const st=document.createElement('style');
 st.textContent='.atlas-car{width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:#344e5d;border:1px solid #fff9;font-size:15px;cursor:pointer;box-shadow:0 3px 10px #0009}.atlas-predicted{width:32px;height:32px;display:grid;place-items:center;border:2px dashed #ffca70;border-radius:11px;background:#304b5b;cursor:pointer;font-size:18px;box-shadow:0 3px 11px #0009}#motion-controls{background:#132e3f;border:1px solid #4c6b7a;border-radius:12px;padding:12px;margin-bottom:15px}#motion-controls label{display:flex;align-items:center;gap:10px;font-size:11px;margin:7px 0;font-weight:700}#motion-controls input{accent-color:#72d4c7}#motion-controls p{font-size:10px;line-height:1.5;color:#c1d2da;margin:8px 0}';
 document.head.append(st);
 const el=document.createElement('div');el.id='motion-controls';
 const header=document.createElement('strong');header.textContent='Levende 3D-trafikk';el.append(header);
 for(const item of [['car','🚗 Modellerte biler langs veier'],['predicted','🚇 Beregnede kollektivkjøretøy']]){
  const label=document.createElement('label');const c=document.createElement('input');c.type='checkbox';c.checked=true;c.id='motion-'+item[0];
  label.append(c,document.createTextNode(item[1]));el.append(label);
  c.addEventListener('change',()=>{if(item[0]==='car'){carOn=c.checked;cars.forEach(x=>x.el.style.display=carOn?'grid':'none');if(carOn)makeCars()}else{estimatedOn=c.checked;for(const x of projected.values())x.el.style.display=estimatedOn?'grid':'none';if(estimatedOn)loadPredicted()}status()});
 }
 const note=document.createElement('p');note.textContent='GPS = rapportert posisjon. Beregnet = rutetid mellom stopp (foreløpig rett linje). Modellert = fiktive biler langs virkelige OSM-veier. Ingen bilikoner er ekte GPS.';el.append(note);
 const stat=document.createElement('div');stat.id='motion-status';stat.style.cssText='color:#8fdfd2;font-size:11px';el.append(stat);
 const target=$('panel-trafikk'),anchor=$('traffic-filters');if(target)target.insertBefore(el,anchor||target.firstChild);
 status();
}
function vectorSource(){
 for(const l of map.getStyle().layers)if(l['source-layer']==='transportation'&&l.source)return l.source;
 return map.getSource('atlas-buildings')?'atlas-buildings':'openmaptiles';
}
function roadLines(){
 let features=[];
 try{features=map.querySourceFeatures(vectorSource(),{sourceLayer:'transportation'})}
 catch(e){errorMsg='Veggeometrien i dette kartutsnittet er utilgjengelig';return []}
 const seen=new Set(),lines=[],b=map.getBounds();
 for(const f of features){
  if(f.geometry?.type!=='LineString')continue;
  const k=String(f.properties?.class||'');
  if(!['motorway','trunk','primary','secondary','tertiary','street','minor','street_limited'].includes(k))continue;
  if(f.properties?.brunnel==='tunnel')continue;
  const pts=f.geometry.coordinates;
  if(!Array.isArray(pts)||pts.length<2)continue;
  let length=0;
  for(let i=1;i<pts.length;i++)length+=dist(pts[i-1],pts[i]);
  if(length<100||length>5000)continue;
  const middle=pathPoint(pts,.5);
  if(middle[0]<b.getWest()||middle[0]>b.getEast()||middle[1]<b.getSouth()||middle[1]>b.getNorth())continue;
  const id=k+':'+middle.map(x=>x.toFixed(5)).join(':')+':'+Math.round(length);
  if(seen.has(id))continue;seen.add(id);
  lines.push({id,pts,length,k,score:hash(id)});
 }
 return lines.sort((a,b)=>a.score-b.score);
}
function makeCars(){
 if(!map||!carOn)return;
 if(map.getZoom()<9.9){for(const x of cars)x.marker.remove();cars=[];status();return}
 if(Date.now()-roadRefresh<1200&&cars.length)return;roadRefresh=Date.now();
 const lines=roadLines().slice(0,map.getZoom()>=15?75:map.getZoom()>=13?55:38);
 const previous=new Map(cars.map(x=>[x.id,x]));cars=[];
 for(const road of lines){
  let x=previous.get(road.id);
  if(x){previous.delete(road.id);x.road=road;cars.push(x);continue}
  const el=document.createElement('div');el.className='atlas-car';el.textContent='🚗';
  el.title='MODELLERT bil – ikke virkelig GPS';
  const progress=hash('p'+road.id);
  const marker=new lib.Marker({element:el,anchor:'center'}).setLngLat(pathPoint(road.pts,progress)).addTo(map);
  const speed=(road.k==='motorway'?74:road.k==='trunk'?59:road.k==='primary'?42:28)*(0.7+hash('speed'+road.id)*.45)/3.6;
  x={id:road.id,road,el,marker,progress,started:Date.now(),speed};
  el.addEventListener('click',()=>{
   follow=follow==='car:'+x.id?null:'car:'+x.id;
   const p=document.createElement('div'),h=document.createElement('strong'),d=document.createElement('p');
   h.textContent='🚗 MODELLERT biltrafikk';d.textContent='Fiktivt kjøretøy animert langs virkelig veggeometri fra OpenStreetMap. Ikke målt trafikk eller GPS. Klikk på bilen igjen for å slå kamerafølging av/på.';
   p.append(h,d);new lib.Popup({offset:16,maxWidth:'310px'}).setLngLat(x.marker.getLngLat()).setDOMContent(p).addTo(map);
  });
  cars.push(x);
 }
 for(const item of previous.values())item.marker.remove();
 if(!cars.length)errorMsg='Vegsegmenter ikke ferdig lastet i dette utsnittet. Zoom inn eller beveg kartet.';
 else errorMsg='';
 status();
}
async function resolveOne(name){
 const u=new URL(GEO);u.searchParams.set('q',name);u.searchParams.set('layers','stopPlace');u.searchParams.set('limit','12');u.searchParams.set('lang','no');u.searchParams.set('lat','59.98');u.searchParams.set('lon','10.96');
 const r=await fetch(u,{headers:H});if(!r.ok)throw Error('Geocoder '+r.status);
 const j=await r.json();const matches=(j.features||[]).filter(x=>x.properties?.layer==='stopPlace').map(f=>{
  const p=f.properties,c=f.geometry?.coordinates||[];
  return {id:p.id,name:p.names?.default||name,lon:+c[0],lat:+c[1]};
 }).filter(x=>x.id?.startsWith('NSR:StopPlace:')&&finite(x.lon)&&finite(x.lat)&&x.lon>9.9&&x.lon<11.9&&x.lat>59.6&&x.lat<60.58);
 matches.sort((a,b)=>Number(normalized(b.name)===normalized(name))-Number(normalized(a.name)===normalized(name)));
 return matches[0]||null;
}
async function loadStations(){
 if(stops.length||stationBusy)return;stationBusy=true;
 const all=[];
 for(let i=0;i<NAMES.length;i+=4){
  const results=await Promise.allSettled(NAMES.slice(i,i+4).map(resolveOne));
  for(const r of results)if(r.status==='fulfilled'&&r.value)all.push(r.value);
 }
 const dedup=new Map(all.map(x=>[x.id,x]));stops=[...dedup.values()];stationBusy=false;
 if(stops.length<4)errorMsg='Klarte ikke laste nok stoppesteder for rutetidsmodellen.';
 status();
}
async function fetchSegments(){
 const blocks=stops.map((s,i)=>'s'+i+':stopPlace(id:'+JSON.stringify(s.id)+'){estimatedCalls(startTime:$start,timeRange:5100,numberOfDepartures:80){cancellation aimedDepartureTime expectedDepartureTime serviceJourney{id line{publicCode transportMode}}}}').join(' ');
 const query='query($start:DateTime!){'+blocks+'}';
 const start=new Date(Date.now()-14*60000).toISOString();
 const r=await fetch(ENTUR,{method:'POST',headers:GH,body:JSON.stringify({query,variables:{start}})});
 if(!r.ok)throw Error('Entur HTTP '+r.status);
 const json=await r.json();if(json.errors?.length)throw Error(json.errors[0].message);
 const journeys=new Map();
 stops.forEach((s,i)=>{
  for(const c of json.data?.['s'+i]?.estimatedCalls||[]){
   if(c.cancellation||!c.serviceJourney?.id)continue;
   const kind=String(c.serviceJourney.line?.transportMode||'').toLowerCase();
   if(!['rail','metro','tram','bus','ferry'].includes(kind))continue;
   const t=Date.parse(c.expectedDepartureTime||c.aimedDepartureTime);
   if(!finite(t))continue;
   const id=c.serviceJourney.id;
   if(!journeys.has(id))journeys.set(id,new Map());
   journeys.get(id).set(s.id,{s,t,kind,id,line:c.serviceJourney.line?.publicCode||'–'});
  }
 });
 const matches=[],now=Date.now();
 for(const [id,entries] of journeys){
  const list=[...entries.values()].sort((a,b)=>a.t-b.t);
  for(let i=1;i<list.length;i++){
   const a=list[i-1],b=list[i],km=dist([a.s.lon,a.s.lat],[b.s.lon,b.s.lat]);
   const max=a.kind==='rail'?34000:a.kind==='metro'?5000:a.kind==='tram'?3300:a.kind==='ferry'?22000:7000;
   if(a.t<=now&&now<=b.t&&b.t-a.t<34*60000&&km>80&&km<max){
    matches.push({id,a,b});break;
   }
  }
 }
 return matches.slice(0,85);
}
function updateProjected(data){
 const live=new Set();
 for(const v of data){
  live.add(v.id);
  let p=projected.get(v.id);
  if(!p){
   const el=document.createElement('div');el.className='atlas-predicted';el.textContent={rail:'🚆',metro:'🚇',tram:'🚋',bus:'🚌',ferry:'⛴️'}[v.a.kind]||'🚍';
   el.title='BEREGNET posisjon (ikke GPS), rett linje mellom stopp';
   const marker=new lib.Marker({element:el,anchor:'center'}).setLngLat([v.a.s.lon,v.a.s.lat]).addTo(map);
   p={el,marker,value:v};projected.set(v.id,p);
   el.addEventListener('click',()=>{
    follow=follow==='pred:'+v.id?null:'pred:'+v.id;
    const x=p.value,root=document.createElement('div'),h=document.createElement('strong'),note=document.createElement('p');
    h.textContent='🟡 BEREGNET '+x.a.kind+' '+x.a.line;
    note.textContent=x.a.s.name+' → '+x.b.s.name+'. Entur-avgangstider brukes til interpolering. Ikke faktisk GPS; mellom stopp vises foreløpig en rett linje, ikke en verifisert skinne-/vegtrasé.';
    root.append(h,note);new lib.Popup({offset:15}).setLngLat(p.marker.getLngLat()).setDOMContent(root).addTo(map);
   });
  }else p.value=v;
  p.el.style.display=estimatedOn?'grid':'none';
 }
 for(const [id,p] of projected)if(!live.has(id)){p.marker.remove();projected.delete(id)}
 status();
}
async function loadPredicted(){
 if(loadBusy||!estimatedOn||document.visibilityState==='hidden')return;
 loadBusy=true;
 try{
  if(!stops.length)await loadStations();
  if(stops.length>=4){const segments=await fetchSegments();updateProjected(segments);
   if(!segments.length)errorMsg='Ingen beregnede kjøretøy mellom valgte stopp akkurat nå (GPS og avgangstavler kan fortsatt fungere).';
  }
 }catch(e){errorMsg='Beregnede avganger utilgjengelige: '+e.message;for(const v of projected.values())v.marker.remove();projected.clear()}
 finally{loadBusy=false;status()}
}
function frame(){
 if(map&&document.visibilityState==='visible'){
  const t=Date.now();
  for(const c of cars){
   if(!carOn||map.getZoom()<9.9)continue;
   const k=((t-c.started)/1000*c.speed/c.road.length+c.progress)%1;
   const pos=pathPoint(c.road.pts,k);c.marker.setLngLat(pos);
   if(follow==='car:'+c.id)map.jumpTo({center:pos});
  }
  for(const [id,p] of projected){
   if(!estimatedOn)continue;
   const v=p.value,ratio=(t-v.a.t)/(v.b.t-v.a.t);
   if(ratio<0||ratio>1){p.el.style.display='none';continue}
   p.el.style.display='grid';
   const pos=[v.a.s.lon+(v.b.s.lon-v.a.s.lon)*ratio,v.a.s.lat+(v.b.s.lat-v.a.s.lat)*ratio];
   p.marker.setLngLat(pos);
   if(follow==='pred:'+id)map.jumpTo({center:pos});
  }
 }
 requestAnimationFrame(frame);
}
function initialize(m,l){
 if(initialized)return;initialized=true;map=m;lib=l;setupUi();
 map.on('moveend',()=>{clearTimeout(timer);timer=setTimeout(makeCars,500)});
 map.on('idle',()=>{if(carOn&&!cars.length)makeCars()});
 map.on('dragstart',()=>{follow=null});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){makeCars();loadPredicted()}});
 setTimeout(makeCars,1300);requestAnimationFrame(frame);
 loadPredicted();window.atlasMotionRefresh=()=>{roadRefresh=0;makeCars();loadPredicted()};setInterval(()=>{if(document.visibilityState==='visible')loadPredicted()},130000);
}
window.atlasMotionInit=initialize;
if(window.osloAtlas)initialize(window.osloAtlas.map,window.osloAtlas.lib);
})();