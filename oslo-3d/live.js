/* Oslo Atlas LIVE – Entur, Entur Geocoder, ADS-B */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const JP = 'https://api.entur.io/journey-planner/v3/graphql';
  const GEO = 'https://api.entur.io/geocoder/v3/autocomplete';
  const VP = 'https://api.entur.io/realtime/v2/vehicles/graphql';
  const client = 'oslo-atlas-romerike-map';
  const REGION = {minLat:59.54,maxLat:60.56,minLon:9.95,maxLon:11.83};
  const headers = {'ET-Client-Name':client};
  const gqlHeaders = {...headers,'Content-Type':'application/json'};
  let map=null,lib=null,ready=false,stops=new Map(),displayed=[],chosen=null,category='all',vehicleMode='all';
  let currentCalls=[],lastSearchId=0,searchTimeout=0,viewTimeout=0,boardBusy=false,vehicleBusy=false,airBusy=false;
  let knownVehicles=[],vehicleMarkers=new Map(),flightMarkers=new Map(),lastStopRegion='',activeSearch='',lastFlightRefresh=0;
  const stamp = d => {
    const n=new Date(d);
    return Number.isFinite(+n) ? n.toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Oslo'}) : '–';
  };
  const norm = s => String(s||'').toLocaleLowerCase('nb-NO').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9æøå]+/g,' ').trim();
  const clean = s => String(s||'').replace(/\s+(?:t|tbane|t.bane|tbanen|t.banestasjon|stasjon)$/i,'').trim();
  const distance = (a,b) => Math.hypot((a.lng-b.lng)*0.51,a.lat-b.lat);
  function txt(id,value){if($(id))$(id).textContent=value;}
  function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function kind(list){const modes=(list||[]).map(i=>String(i?.mode||'').toLowerCase());return modes.includes('metro')?'metro':modes.includes('tram')?'tram':modes.includes('rail')?'rail':modes.includes('bus')||modes.includes('coach')?'bus':'other';}
  function icon(k){return {metro:'🚇',tram:'🚋',rail:'🚆',bus:'🚌',flybus:'🚌',air:'✈️'}[k]||'📍';}
  function initUI(){
    const css = [
      '#live-open{background:#136569!important;color:#fff!important;border-color:#64e3cf77!important}',
      '#live-ui{position:absolute;z-index:21;top:90px;right:18px;width:360px;max-height:calc(100vh - 168px);display:flex;flex-direction:column;color:#f3f9ff;background:rgba(6,23,37,.97);border:1px solid #72cfc655;border-radius:17px;box-shadow:0 18px 60px #0009;overflow:hidden;backdrop-filter:blur(20px)}',
      '#live-ui.live-closed{display:none}',
      '.live-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:15px;border-bottom:1px solid #ffffff23}',
      '.live-header strong{font-size:14px}.live-header button{background:#20384b;border:1px solid #547285;border-radius:8px;padding:5px 9px;color:white}',
      '.live-scroll{overflow-y:auto;padding:14px;scrollbar-width:thin}',
      '.live-explain{font-size:10px;color:#b2cbd3;line-height:1.5;margin:6px 0 11px}',
      '.live-input{width:100%;border:1px solid #54738a;background:#132f42;color:white;padding:12px;border-radius:10px;font-size:12px}',
      '.live-buttons{display:flex;gap:5px;flex-wrap:wrap;margin:10px 0}',
      '.live-buttons button{background:#223b4d;border:1px solid #3f6074;border-radius:7px;padding:8px 10px;color:#e7f4fc;font-weight:700;font-size:10px}',
      '.live-buttons button.active{background:#087d78;border-color:#90dfcf;color:#fff}',
      '.live-row{border-bottom:1px solid #ffffff1d;padding:9px 0;display:grid;grid-template-columns:38px 1fr auto;align-items:center;gap:8px;font-size:11px}',
      '.live-line{padding:7px 2px;border-radius:6px;background:#1e6392;text-align:center;font-weight:800}',
      '.live-line.metro{background:#117dbb}.live-line.tram{background:#ab7929}.live-line.rail{background:#14825d}.live-line.bus{background:#8b5299}',
      '.live-destination{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:192px}',
      '.live-arrival{font-weight:800;color:#ffdbab;text-align:right}.live-small{font-size:10px;color:#a9bdc9;margin:4px 0 10px;line-height:1.5}',
      '.live-tokens{display:flex;flex-wrap:wrap;gap:6px;max-height:124px;overflow-y:auto}',
      '.live-tokens button{border:1px solid #3d6178;border-radius:8px;background:#1a394d;color:#d7eafa;padding:8px;font-size:11px}',
      '.live-title{margin:12px 0 7px;font-size:15px}',
      '.live-layers{margin-top:12px;padding:10px 0;border-top:1px solid #ffffff24}',
      '.live-stat{font-size:10px;color:#9eddd5;line-height:1.6}',
      '.live-error{font-size:10px;color:#ffc6a0;line-height:1.45;margin-top:5px}',
      '.live-pin{cursor:pointer;display:grid;place-items:center;min-width:31px;height:31px;border:2px solid #fff6;border-radius:30px;background:#145a52;box-shadow:0 4px 16px #000a;color:white;font-weight:800;white-space:nowrap;font-size:16px;padding:0 4px}',
      '.live-pin.flybus{background:#80532c}.live-pin.rail{background:#077e62}.live-pin.air{background:#255d9d;border-color:#a8d9ff}',
      '.live-pin:hover{filter:brightness(1.25);transform:scale(1.12)}',
      '#live-map-search{position:absolute;z-index:20;left:374px;top:90px;width:min(350px,calc(100vw - 735px));background:#0b263b;color:#e8f8fa;padding:9px 12px;border:1px solid #4d8492;border-radius:10px;display:none;font-size:11px}',
      '@media(max-width:1100px){#live-ui{top:80px;max-height:calc(100vh - 163px);width:310px}#live-map-search{display:none!important}}',
      '@media(max-width:780px){#live-ui{top:auto;bottom:73px;left:9px;right:9px;width:auto;max-height:65vh}#live-open{font-size:10px!important;padding:9px!important}.live-scroll{padding:10px}}'
    ].join('\n');
    const style=node('style');style.textContent=css;document.head.appendChild(style);
    const hdr=document.querySelector('.header-right');
    const trigger=node('button','tiny-btn','🚇 LIVE trafikk');trigger.id='live-open';
    trigger.setAttribute('aria-expanded','false');hdr.prepend(trigger);
    const ui=node('section','live-closed');ui.id='live-ui';ui.setAttribute('aria-label','Sanntidstrafikk i Oslo og Romerike');
    ui.innerHTML = '<div class="live-header"><strong>🚇 Oslo + Romerike LIVE</strong><button id="live-close" aria-label="Lukk">×</button></div>'
      +'<div class="live-scroll"><div class="live-explain">Faktiske rapporterte GPS-posisjoner og avgangsprognoser. T-baner og trikker vises ved holdeplassene – ikke som oppdiktede bevegelige kjøretøy.</div>'
      +'<input id="live-search" class="live-input" placeholder="Søk: Grorud T, Jessheim, Oslo S …" autocomplete="off">'
      +'<div id="live-stop-filters" class="live-buttons"><button class="active" data-cat="all">Alle</button><button data-cat="metro">T-bane</button><button data-cat="tram">Trikk</button><button data-cat="rail">Tog</button><button data-cat="bus">Buss</button></div>'
      +'<div id="live-results" class="live-tokens"></div><p id="live-stop-count" class="live-small">Henter holdeplasser …</p>'
      +'<h3 id="live-station-title" class="live-title">Velg en holdeplass</h3><p id="live-station-status" class="live-small">Klikk en stasjon eller søk etter navn.</p><div id="live-board"></div>'
      +'<div class="live-layers"><strong style="font-size:12px">Live på kartet</strong>'
      +'<div id="live-vehicle-filters" class="live-buttons"><button class="active" data-kind="all">Alle GPS</button><button data-kind="rail">🚆 Tog</button><button data-kind="flybus">🚌 Flybuss</button><button data-kind="bus">🚌 Øvrige busser</button><button data-kind="air">✈️ Fly</button></div>'
      +'<p class="live-stat" id="live-vehicle-count">Søker etter kjøretøy …</p><p class="live-stat" id="live-flight-count">Henter fly i Oslo/Gardermoen …</p>'
      +'<p class="live-error" id="live-errors"></p><p class="live-small">Datakilder: Entur/NSR (holdeplasser, avganger, kjøretøy) · ADSB.lol (fly). Kjøretøy kan mangle når posisjonsdata ikke leveres. Posisjonene er ikke garantert sekundaktuelle.</p></div></div>';
    document.body.appendChild(ui);
    const note=node('div');note.id='live-map-search';document.body.appendChild(note);
    trigger.addEventListener('click',()=>show(ui.classList.contains('live-closed') ));
    $('live-close').addEventListener('click',()=>show(false));
    $('live-search').addEventListener('input',e=>searchDebounced(e.target.value));
    $('live-stop-filters').addEventListener('click',e=>{
      const b=e.target.closest('button[data-cat]');if(!b)return;
      category=b.dataset.cat;Array.from($('live-stop-filters').children).forEach(x=>x.classList.toggle('active',x===b));
      renderStops();drawStops();renderBoard();
    });
    $('live-vehicle-filters').addEventListener('click',e=>{
      const b=e.target.closest('button[data-kind]');if(!b)return;
      vehicleMode=b.dataset.kind;Array.from($('live-vehicle-filters').children).forEach(x=>x.classList.toggle('active',x===b));
      filterMarkers();
    });
    const main=$('search');
    if(main){
      main.placeholder='Søk alle holdeplasser: Grorud T, Jessheim …';
      main.addEventListener('input',e=>{
        e.stopImmediatePropagation();
        searchDebounced(e.target.value);
        if(String(e.target.value||'').trim().length>1)show(true);
      },true);
      main.addEventListener('keydown',e=>{if(e.key==='Enter'&&displayed.length)selectStop(displayed[0])});
    }
  }
  function show(open){$('live-ui').classList.toggle('live-closed',!open);$('live-open').setAttribute('aria-expanded',String(open))}
  function isInRegion(s){return Number.isFinite(s.lat)&&Number.isFinite(s.lng)&&s.lat>REGION.minLat&&s.lat<REGION.maxLat&&s.lng>REGION.minLon&&s.lng<REGION.maxLon}
  function parseStop(f){
    const p=f.properties||{},pt=f.geometry?.coordinates||[];
    return{id:p.id,name:p.names?.default||p.names?.display||'Holdeplass',lng:+pt[0],lat:+pt[1],kind:kind(p.transportModes),modes:p.transportModes||[]};
  }
  function remember(a){for(const s of a)if(s.id?.startsWith('NSR:StopPlace:')&&isInRegion(s))stops.set(s.id,s)}
  async function fetchStops(q,opts={}){
    const url=new URL(GEO);
    url.searchParams.set('layers','stopPlace');url.searchParams.set('multimodal','all');url.searchParams.set('lang','no');url.searchParams.set('limit',String(opts.limit||70));
    if(q)url.searchParams.set('q',q);
    if(opts.bbox)url.searchParams.set('bbox',opts.bbox);
    else{url.searchParams.set('lat','59.98');url.searchParams.set('lon','10.96');url.searchParams.set('radius','110')}
    const res=await fetch(url,{headers});if(!res.ok)throw Error('Entur Geocoder HTTP '+res.status);
    const j=await res.json();return(j.features||[]).filter(f=>f.properties?.layer==='stopPlace').map(parseStop).filter(isInRegion);
  }
  function relevance(s,q){
    const n=norm(s.name),query=norm(clean(q));
    const metroSuffix=/\s+(?:t|t-bane|tbane)$/i.test(q);
    const match=n===query?1200:n.startsWith(query)?600:n.includes(query)?200:0;
    const metroBonus=(metroSuffix&&s.kind==='metro')?700:0;
    const center={lng:10.96,lat:59.98};
    return match+metroBonus-distance(s,center)*8;
  }
  function searchDebounced(raw){
    clearTimeout(searchTimeout);const requestId=++lastSearchId;
    const q=String(raw||'').trim();
    if(q.length<2){displayed=[...stops.values()].sort((a,b)=>distance(a,{lng:10.76,lat:59.91})-distance(b,{lng:10.76,lat:59.91})).slice(0,25);renderStops();return}
    txt('live-stop-count','Søker etter «'+q+'» …');
    searchTimeout=setTimeout(async()=>{
      try{
        const phrases=[clean(q),q].filter((s,i,a)=>s&&a.indexOf(s)===i);
        const replies=await Promise.allSettled(phrases.map(x=>fetchStops(x,{limit:80})));
        if(requestId!==lastSearchId)return;
        const found=new Map();
        replies.forEach(r=>{if(r.status==='fulfilled')r.value.forEach(s=>found.set(s.id,s))});
        if(!found.size&&replies.every(r=>r.status==='rejected'))throw Error('Oppslag mislyktes, kontroller nettverk eller API-tilgang');
        displayed=[...found.values()].sort((a,b)=>relevance(b,q)-relevance(a,q));
        remember(displayed);renderStops();drawStops();txt('live-stop-count',displayed.length+' treff for «'+q+'»');
      }catch(err){if(requestId===lastSearchId){txt('live-stop-count','Søket feilet: '+err.message);txt('live-errors','Søket kan være blokkert av nettleseren eller API-et.')}}
    },300);
  }
  function renderStops(){
    const box=$('live-results');box.replaceChildren();
    const items=displayed.filter(s=>category==='all'||s.kind===category).slice(0,35);
    for(const s of items){const b=node('button',null,icon(s.kind)+' '+s.name);b.title='Vis avganger fra '+s.name;b.addEventListener('click',()=>selectStop(s));box.appendChild(b)}
    if(!items.length)box.appendChild(node('span','live-small','Ingen holdeplasser funnet. Prøv f.eks. «Grorud» eller «Jessheim».'));
  }
  function drawStops(){
    if(!map?.getSource('atlas-stop'))return;
    const all=[...stops.values()].filter(s=>category==='all'||s.kind===category).slice(-1500);
    map.getSource('atlas-stop').setData({type:'FeatureCollection',features:all.map(s=>({type:'Feature',geometry:{type:'Point',coordinates:[s.lng,s.lat]},properties:{id:s.id,kind:s.kind,name:s.name}}))});
  }
  function setupStopLayer(){
    if(map.getSource('atlas-stop'))return;
    map.addSource('atlas-stop',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
    map.addLayer({id:'atlas-stop-dots',type:'circle',source:'atlas-stop',minzoom:11,paint:{
      'circle-radius':['interpolate',['linear'],['zoom'],11,3,13,5,17,9],
      'circle-color':['match',['get','kind'],'metro','#238bea','tram','#ffa84f','rail','#65d7a0','bus','#b575d8','#99b6cc'],
      'circle-stroke-width':1.8,'circle-stroke-color':'#0b2438','circle-opacity':0.98}});
    map.on('click','atlas-stop-dots',e=>{const id=e.features?.[0]?.properties?.id;if(stops.has(id))selectStop(stops.get(id))});
    map.on('mouseenter','atlas-stop-dots',()=>map.getCanvas().style.cursor='pointer');
    map.on('mouseleave','atlas-stop-dots',()=>map.getCanvas().style.cursor='');
    map.on('moveend',()=>{clearTimeout(viewTimeout);viewTimeout=setTimeout(loadMapStops,700)});
  }
  async function loadMapStops(){
    if(!map||map.getZoom()<10)return;
    const b=map.getBounds(),center=map.getCenter();
    const key=(Math.floor(center.lng*5)/5)+','+(Math.floor(center.lat*5)/5)+','+Math.floor(map.getZoom()/2);
    if(lastStopRegion===key)return;lastStopRegion=key;
    const west=Math.max(REGION.minLon,b.getWest()-.06),east=Math.min(REGION.maxLon,b.getEast()+.06);
    const south=Math.max(REGION.minLat,b.getSouth()-.04),north=Math.min(REGION.maxLat,b.getNorth()+.04);
    if(west>=east||south>=north)return;
    try{
      const found=await fetchStops('',{bbox:[west,south,east,north].map(n=>n.toFixed(5)).join(','),limit:200});
      remember(found);drawStops();
      if(!activeSearch&&!displayed.length){displayed=found;renderStops()}
    }catch(e){lastStopRegion='';txt('live-errors','Stasjonspunkter i kartet: '+e.message)}
  }
  async function selectStop(s){
    chosen=s;txt('live-station-title',icon(s.kind)+' '+s.name);txt('live-station-status','Laster avgangstavle …');
    $('live-board').replaceChildren();show(true);
    if(map)map.flyTo({center:[s.lng,s.lat],zoom:15.6,pitch:64,duration:1100});
    await loadBoard();
  }
  async function loadBoard(){
    if(!chosen||boardBusy)return;boardBusy=true;const id=chosen.id;
    const query='query($id:String!){stopPlace(id:$id){name estimatedCalls(numberOfDepartures:55,timeRange:7200){realtime cancellation aimedDepartureTime expectedDepartureTime destinationDisplay{frontText} serviceJourney{line{publicCode transportMode}}}}}';
    try{
      const r=await fetch(JP,{method:'POST',headers:gqlHeaders,body:JSON.stringify({query,variables:{id}})});
      if(!r.ok)throw Error('HTTP '+r.status);
      const data=await r.json();if(data.errors?.length)throw Error(data.errors[0].message);
      if(!chosen||chosen.id!==id)return;
      currentCalls=data.data?.stopPlace?.estimatedCalls||[];
      txt('live-station-status','Oppdatert '+stamp(new Date())+' · '+currentCalls.length+' avganger de neste 2 timene');
      renderBoard();
    }catch(err){txt('live-station-status','Avganger utilgjengelige: '+err.message)}
    finally{boardBusy=false}
  }
  function renderBoard(){
    const box=$('live-board');box.replaceChildren();if(!chosen)return;
    const a=currentCalls.filter(c=>category==='all'||String(c.serviceJourney?.line?.transportMode||'').toLowerCase()===category);
    a.sort((x,y)=>new Date(x.expectedDepartureTime||x.aimedDepartureTime)-new Date(y.expectedDepartureTime||y.aimedDepartureTime));
    let shown=0;
    for(const c of a){
      const d=new Date(c.expectedDepartureTime||c.aimedDepartureTime);
      if(!Number.isFinite(+d)||d<Date.now()-60000)continue;if(shown++>=18)break;
      const line=c.serviceJourney?.line||{},k=String(line.transportMode||'').toLowerCase();
      const row=node('div','live-row'),code=node('span','live-line '+k,line.publicCode||'–');
      const middle=node('div'),dest=node('div','live-destination',c.destinationDisplay?.frontText||'Ukjent destinasjon');
      const detail=node('div','live-small',c.cancellation?'Innstilt':c.realtime?'● Sanntid':'○ Rutetid');
      detail.style.margin='2px 0 0';middle.append(dest,detail);
      const minutes=Math.ceil((d-Date.now())/60000);
      const eta=node('span','live-arrival',minutes<=0?'Nå':minutes<30?minutes+' min':stamp(d));
      if(c.cancellation)eta.style.textDecoration='line-through';
      row.append(code,middle,eta);box.appendChild(row);
    }
    if(!shown)box.appendChild(node('div','live-small','Ingen avganger i valgt kategori nå.'));
  }
  function markerLabel(v){return v.kind==='rail'?'🚆':v.kind==='flybus'?'🚌':v.kind==='bus'?'🚌':'📍'}
  function allowed(v){return vehicleMode==='all'||vehicleMode===v.kind}
  function vehicleName(v){
    const code=v.line?.publicCode||v.line?.lineName||'',dest=v.destinationName||'';
    return(v.kind==='rail'?'Tog':v.kind==='flybus'?'Flybuss':'Buss')+(code?' · '+code:'')+(dest?' mot '+dest:'');
  }
  function filterMarkers(){
    for(const [id,obj] of vehicleMarkers){obj.el.style.display=allowed(obj.data)?'grid':'none'}
    for(const [id,obj] of flightMarkers){obj.el.style.display=(vehicleMode==='all'||vehicleMode==='air')?'grid':'none'}
  }
  async function refreshVehicles(){
    if(vehicleBusy||!map)return;vehicleBusy=true;
    const bb='{minLat:59.54,minLon:9.95,maxLat:60.56,maxLon:11.83}';
    const query='query {vehicles(boundingBox:'+bb+',maxDataAge:"PT5M"){vehicleId mode lastUpdated destinationName bearing location{latitude longitude} codespace{codespaceId} operator{name} line{publicCode lineName}}}';
    try{
      const res=await fetch(VP,{method:'POST',headers:gqlHeaders,body:JSON.stringify({query})});
      if(!res.ok)throw Error('Entur Vehicle HTTP '+res.status);
      const data=await res.json();if(data.errors?.length)throw Error(data.errors[0].message);
      const values=(data.data?.vehicles||[]).map((v,i)=>{
        const codespace=String(v.codespace?.codespaceId||''),operator=String(v.operator?.name||'');
        const mode=String(v.mode||'').toUpperCase();
        const k=codespace==='NBU'||/flybuss/i.test(operator)?'flybus':mode==='RAIL'?'rail':mode==='BUS'||mode==='COACH'?'bus':'other';
        const lat=Number(v.location?.latitude),lng=Number(v.location?.longitude);
        return {...v,lat,lng,kind:k,source:codespace,id:codespace+':'+(v.vehicleId||v.line?.publicCode+':'+i)};
      }).filter(v=>['rail','flybus','bus'].includes(v.kind)&&isInRegion(v)&&Number.isFinite(Date.parse(v.lastUpdated))&&Date.now()-Date.parse(v.lastUpdated)<5*60*1000);
      knownVehicles=values;
      const ids=new Set();
      for(const v of values){
        ids.add(v.id);let item=vehicleMarkers.get(v.id);
        if(!item){
          const el=node('div','live-pin '+v.kind,markerLabel(v));
          el.title=vehicleName(v);
          const mk=new lib.Marker({element:el,anchor:'center'}).setLngLat([v.lng,v.lat]).addTo(map);
          el.addEventListener('click',()=>{
            const c=vehicleMarkers.get(v.id)?.data||v;
            const p=node('div');const title=node('strong',null,vehicleName(c));const info=node('p',null,'Rapportert GPS-posisjon '+stamp(c.lastUpdated)+' · '+(c.operator?.name||c.source||'Entur')+'.');p.append(title,info);
            new lib.Popup({offset:18,maxWidth:'290px'}).setLngLat([c.lng,c.lat]).setDOMContent(p).addTo(map);
          });
          item={el,mk,data:v,at:Date.now(),from:{lng:v.lng,lat:v.lat},to:{lng:v.lng,lat:v.lat}};
          vehicleMarkers.set(v.id,item);
        }else{
          const pos=item.mk.getLngLat();item.from={lng:pos.lng,lat:pos.lat};item.to={lng:v.lng,lat:v.lat};item.at=Date.now();item.data=v;
        }
      }
      for(const [id,item] of vehicleMarkers)if(!ids.has(id)){item.mk.remove();vehicleMarkers.delete(id)}
      filterMarkers();const tally=k=>values.filter(v=>v.kind===k).length;
      txt('live-vehicle-count','GPS-observasjoner: '+tally('rail')+' tog · '+tally('flybus')+' flybusser · '+tally('bus')+' andre busser · '+stamp(new Date()));
      txt('live-errors','');lastGPS=new Date();
    }catch(e){txt('live-errors','Entur GPS: '+e.message+' (viser ikke simulerte kjøretøy)')}
    finally{vehicleBusy=false}
  }
  function animatePositions(){
    const now=Date.now();
    for(const item of vehicleMarkers.values()){
      const t=Math.max(0,Math.min(1,(now-item.at)/24000));
      if(t<1){
        const smooth=t*t*(3-2*t);
        item.mk.setLngLat([item.from.lng+(item.to.lng-item.from.lng)*smooth,item.from.lat+(item.to.lat-item.from.lat)*smooth]);
      }
    }
    window.requestAnimationFrame(animatePositions);
  }
  function flightInfo(a){
    const flight=String(a.flight||'').trim();
    const reg=String(a.r||'').trim();
    return flight||reg||String(a.hex||'Ukjent fly');
  }
  function feetToM(a){return typeof a==='number'?Math.round(a*.3048)+' m':String(a||'Ukjent')}
  function knotsToKmh(a){return Number.isFinite(+a)?Math.round(+a*1.852)+' km/t':'Ukjent'}
  async function fetchFlightFeed(url){
    const r=await fetch(url);if(!r.ok)throw Error('ADS-B HTTP '+r.status);
    const data=await r.json();if(!Array.isArray(data.ac))throw Error('Flydatasvar mangler "ac"');
    return data.ac;
  }
  async function refreshFlights(){
    if(airBusy||!map)return;airBusy=true;
    let planes;
    try{
      // ADSB.lol – radius measured in nautical miles
      planes=await fetchFlightFeed('https://api.adsb.lol/v2/lat/60.05/lon/10.90/dist/105');
    }catch(e){
      try{planes=await fetchFlightFeed('https://api.airplanes.live/v2/point/60.05/10.90/105')}
      catch(backup){txt('live-flight-count','✈️ Flydata utilgjengelige: '+backup.message);airBusy=false;return}
    }
    const ids=new Set();let count=0;
    for(const a of planes){
      const lat=Number(a.lat),lng=Number(a.lon);if(!isInRegion({lat,lng}))continue;
      if(Number(a.seen_pos||0)>120)continue;
      const id=String(a.hex||a.flight||lat+','+lng);
      ids.add(id);count++;let entry=flightMarkers.get(id);
      if(!entry){
        const el=node('div','live-pin air','✈');
        const marker=new lib.Marker({element:el,anchor:'center'}).setLngLat([lng,lat]).addTo(map);
        el.addEventListener('click',()=>{
          const d=flightMarkers.get(id)?.data||a;
          const popup=node('div');
          popup.append(node('strong',null,'✈ '+flightInfo(d)),node('p',null,'Høyde: '+feetToM(d.alt_geom||d.alt_baro)+' · Fart: '+knotsToKmh(d.gs)),node('p',null,'Registrering: '+(d.r||'Ukjent')+' · Siste posisjon: '+(d.seen_pos??'?')+' sek siden'));
          new lib.Popup({offset:18,maxWidth:'290px'}).setLngLat([Number(d.lon),Number(d.lat)]).setDOMContent(popup).addTo(map);
        });
        entry={marker,el,data:a,from:{lat,lng},to:{lat,lng},at:Date.now()};
        flightMarkers.set(id,entry);
      }else{
        const p=entry.marker.getLngLat();entry.from={lat:p.lat,lng:p.lng};entry.to={lat,lng};entry.data=a;entry.at=Date.now();
      }
      entry.el.title='✈ '+flightInfo(a)+' · '+feetToM(a.alt_geom||a.alt_baro);
      // Keep marker orientation stable; heading is listed in details rather than rotating an emoji glyph.
    }
    for(const [id,o] of flightMarkers)if(!ids.has(id)){o.marker.remove();flightMarkers.delete(id)}
    filterMarkers();txt('live-flight-count','✈️ '+count+' rapporterte fly over Oslo/Romerike · '+stamp(new Date()));
    lastFlightRefresh=Date.now();airBusy=false;
  }
  function animateFlights(){
    const now=Date.now();
    for(const entry of flightMarkers.values()){
      const t=Math.max(0,Math.min(1,(now-entry.at)/44000));
      if(t<1){const s=t*t*(3-2*t);entry.marker.setLngLat([entry.from.lng+(entry.to.lng-entry.from.lng)*s,entry.from.lat+(entry.to.lat-entry.from.lat)*s])}
    }
    window.requestAnimationFrame(animateFlights);
  }
  async function startup(){
    const presets=['Grorud','Lillestrøm','Jessheim','Oslo S','Gardermoen'];
    for(const q of presets.slice(0,3)){
      try{remember(await fetchStops(q,{limit:30}))}catch(err){txt('live-errors','Entur Geocoder: '+err.message)}
    }
    displayed=[...stops.values()].sort((a,b)=>distance(a,{lat:59.95,lng:10.88})-distance(b,{lat:59.95,lng:10.88}));
    renderStops();drawStops();
    txt('live-stop-count',stops.size+' holdeplasser lastet – søk finner også andre i Oslo og Romerike.');
    loadMapStops();
    try{const results=await fetchStops('Oslo S',{limit:10});const first=results.find(s=>/oslo s/i.test(s.name));if(first){remember(results);chosen=first;txt('live-station-title',first.name);loadBoard()}}catch(e){}
  }
  function init(){
    if(ready||!window.osloAtlasMap||!window.osloAtlasLib)return;
    map=window.osloAtlasMap;lib=window.osloAtlasLib;ready=true;
    initUI();setupStopLayer();startup();refreshVehicles();refreshFlights();animatePositions();animateFlights();
    setInterval(loadBoard,45000);setInterval(refreshVehicles,30000);setInterval(refreshFlights,45000);
    if(window.innerWidth>780)show(true);
    const qs=new URLSearchParams(location.search);if(qs.has('sted'))searchDebounced(qs.get('sted'));
  }
  // Initialize after the base map is loaded; report inability to initialize instead of showing fake live data.
  window.addEventListener('oslo-atlas-loaded',init,{once:true});
  if(window.osloAtlasMap?.loaded())init();
})();