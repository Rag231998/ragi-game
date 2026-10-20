/* Oslo Atlas enhancement: speed limit card, camera filter, server health and online count.
   No fake online count. No identifying data persisted. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
let inited=false, roadSeq=0, visitorToken=null;
function setText(id,value){const n=$(id);if(n)n.textContent=value}
async function getJson(url,opts={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12500);
  try{
    const res=await fetch(url,{...opts,signal:controller.signal,cache:'no-store'});
    if(!res.ok)throw Error('HTTP '+res.status);
    const type=res.headers.get('content-type')||'';
    if(!type.includes('json'))throw Error('API ikke tilgjengelig på denne nettadressen');
    return res.json();
  }finally{clearTimeout(timer)}
}
async function onlineStart(){
  let ok=false;
  try{
    const health=await getJson('/api/health');
    if(!health.ok)throw Error('API svarte ikke korrekt');
    setText('api-label','● API tilkoblet');ok=true;
  }catch(err){
    setText('api-label','● Kun kartvisning');
    setText('online-count','Online: krever server');
    console.warn('Oslo Atlas server er ikke aktiv på denne adressen',err.message);
  }
  if(!ok)return;
  visitorToken=crypto.randomUUID();
  async function heartbeat(){
    if(!visitorToken||document.visibilityState!=='visible')return;
    try{await getJson('/api/presence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:visitorToken})})}
    catch(e){console.warn('Online heartbeat',e.message)}
  }
  async function count(){
    try{
      const data=await getJson('/api/presence');
      if(!Number.isInteger(data.online)||data.online<0)throw Error('Ugyldig antall');
      const pill=$('online-count');
      pill.textContent='Aktive nå: '+data.online.toLocaleString('nb-NO')+'*';
      pill.title='Omtrentlig antall aktive faner med hjerteslag siste '+(data.windowSeconds||95)+' sekunder. Ikke unike mennesker.';
    }catch(e){setText('online-count','Online: utilgjengelig')}
  }
  await heartbeat();await count();
  setInterval(()=>{if(document.visibilityState==='visible'){heartbeat();count()}},45000);
}
function setupRoadInfo(map){
  const info=$('road-info'),details=$('road-details'),close=$('road-close');
  if(!info||!details)return;
  close.addEventListener('click',()=>{info.hidden=true});
  map.on('click',async e=>{
    const all=map.queryRenderedFeatures(e.point)||[];
    const road=all.find(f=>f.layer?.['source-layer']==='transportation'&&f.geometry?.type==='LineString');
    if(!road)return;
    const seq=++roadSeq;info.hidden=false;
    const label=road.properties?.name||road.properties?.ref||'Valgt punkt på vegnettet';
    details.textContent=label+' – undersøker fartsgrense hos NVDB …';
    try{
      const result=await getJson('/api/speed?lat='+e.lngLat.lat.toFixed(6)+'&lon='+e.lngLat.lng.toFixed(6));
      if(seq!==roadSeq)return;
      if(!Number.isInteger(result.kmh)){
        details.textContent=label+' · Fartsgrense er ikke dokumentert for dette punktet. Den blir ikke gjettet.';
      }else{
        details.textContent=label+' · '+result.kmh+' km/t (kandidat fra NVDB, nærmeste vegsegment ca. '+result.distanceMeters+' m unna). Kontroller vegløp og faktisk skilting.';
      }
    }catch(err){
      if(seq===roadSeq)details.textContent=label+' · Fartsgrense utilgjengelig: '+err.message+'. For offisiell informasjon, se vegvesen.no.';
    }
  });
}
function setupCameraFilter(){
  const toggle=$('camera-markers-toggle');
  if(!toggle)return;
  toggle.addEventListener('change',()=>{
    document.querySelectorAll('.custom-pin.camera').forEach(el=>{el.style.display=toggle.checked?'grid':'none'});
  });
}
function boot(map){
  if(inited)return;inited=true;
  setupCameraFilter();setupRoadInfo(map);onlineStart();
}
window.atlasEnhanceInit=(map)=>boot(map);
if(window.osloAtlas?.map)boot(window.osloAtlas.map);
})();