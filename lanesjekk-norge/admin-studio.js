/* Lånesjekk Studio. Supabase RLS and triggers enforce admin writes server-side.
 * No privileged keys in browser. Draft edits never stored until Publish.
 */
(()=>{'use strict';
const BASE='https://pryrgwfjniggjlrizenh.supabase.co',KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const $=id=>document.getElementById(id);
const DEFAULT_IDS=['quick','hero','stats','workbook','insights'];
const SECTION_NAMES={quick:'Månedsplan + handlingsknapper',hero:'Budsjettets overskrift',stats:'Resultat og nøkkeltall',workbook:'Redigerbart regneark',insights:'Grafer og økonomiske analyser'};
const MEDIA_IDS=['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy','currency'];
const SLIDE_IDS=['loan','budget','receipts','invest','property','currency'];
const CARD_IDS=['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti'];
const CARD_NAMES={kvitteringer:'Kvitteringsstudio',utleie:'Utleieanalyse',budsjett:'Personlig budsjett',billan:'Billån',forbrukslan:'Forbrukslån',akademi:'Læringsplattform',sparing:'Sparing',sjekk:'Boliglån',banker:'Bankoversikt','offisielle-renter':'Offisielle renter',bsu:'BSU',ask:'ASK',ips:'IPS',innskuddsgaranti:'Innskuddsgaranti'};
const CARDS_DEFAULT=['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti'];
const RELEASE_ROUTES=new Set(['topp','sjekk','billan','forbrukslan','banker','budsjett','kvitteringer','sparing','investering','valutakompass','boligverdi','utleieanalyse','akademi','guider']);
const catalogNewsDefaults={headline:'Oppdag alt du kan gjøre',news:[]};
const CARD_PREVIEW_ROUTES=Object.freeze({sjekk:'sjekk',budsjett:'budsjett',kvitteringer:'kvitteringer',sparing:'sparing',utleie:'utleieanalyse',billan:'billan',forbrukslan:'forbrukslan',akademi:'akademi',banker:'banker','offisielle-renter':'sparing',bsu:'guider',ask:'guider',ips:'guider',innskuddsgaranti:'guider'});
const previewRouteForCard=id=>CARD_PREVIEW_ROUTES[id]||'topp';
let db=null,authUser=null,published=null,draft=null,revision=0,ready=false,busy=false,lastPublishedAt='';
let previewWindow=null,previewWindowReady=false,lastPreviewFingerprint='',previewSection='topp',previewPayload=null,publishEvents=[],historyOffset=0,historyHasMore=false;
const fmtDate=stamp=>stamp?new Intl.DateTimeFormat('nb-NO',{dateStyle:'medium',timeStyle:'short'}).format(new Date(stamp)):'Ukjent tidspunkt';
const FIELD_LABELS={brand:'Profil og farger',budget:'Budsjett',cards:'Forsidekort og objekter',slides:'Forsidescener',media:'Animation Studio',animations:'Animasjoner',investing:'Fond og aksjer',catalog:'Funksjoner og nyheter'};
function changesBetween(a,b){
 const result=[];
 function walk(before,after,path='',depth=0){
  if(JSON.stringify(before)===JSON.stringify(after))return;
  const complex=x=>x!==null&&typeof x==='object';
  if(depth<5&&complex(before)&&complex(after)&&Array.isArray(before)===Array.isArray(after)){
   for(const key of new Set([...Object.keys(before),...Object.keys(after)]))walk(before[key],after[key],path?path+'.'+key:key,depth+1);
  }else result.push(path||'Innstillinger');
 }
 walk(a,b);return result;
}
function describePath(path){
 const parts=path.split('.');
 const section=FIELD_LABELS[parts[0]]||parts[0];
 const key=parts.slice(1).map(part=>CARD_NAMES[part]||SECTION_NAMES[part]||part).join(' · ');
 return section+(key?' · '+key:'');
}
function renderChangeDetails(root,paths,max=16){
 root.replaceChildren();
 if(!paths.length){root.append(create('p','Ingen endringer i de valgte innstillingene.','admin-hint'));return}
 for(const path of paths.slice(0,max)){
  const line=create('div',undefined,'admin-change-line');
  line.append(create('span','●','admin-change-dot'),create('span',describePath(path)));root.append(line);
 }
 if(paths.length>max)root.append(create('p','Og '+(paths.length-max)+' andre endringer.','admin-hint'));
}
function refreshDashboard(){
 if(!ready||!draft||!published||!$('admin-workspace')||$('admin-workspace').hidden)return;
 const config=gather(),changes=changesBetween(published,config),count=changes.length;
 $('admin-draft-status').textContent=count?count+' endringer':'Ingen endringer';
 $('admin-draft-status').dataset.dirty=String(count>0);
 $('admin-draft-count').textContent=count?'Utkast er ikke publisert':'Alt samsvarer med publisert nettside';
 $('admin-action-status').textContent=count?'Du har '+count+' upubliserte endringer. Se hele nettsiden før du publiserer.':'Nettsiden er oppdatert. Gjør en endring for å starte et nytt utkast.';
 $('admin-revision').textContent='Versjon '+revision;
 $('admin-last-published').textContent=lastPublishedAt?'Sist publisert '+fmtDate(lastPublishedAt):'Publiseringstid ikke registrert';
 $('admin-publish').disabled=busy||!count;
 if($('admin-preflight').open){
  const previewed=!!previewWindow&&!previewWindow.closed&&lastPreviewFingerprint===JSON.stringify(config);
  $('admin-preview-confirm').disabled=!previewed;
  if(!previewed)$('admin-preview-confirm').checked=false;
  $('admin-confirm-publish').disabled=busy||!previewed||!$('admin-preview-confirm').checked||!count;
 }
}
function collectChanges(){return changesBetween(published,gather())}
async function prepareAssets(){
 const logo=$('site-logo').files?.[0];
 if(logo){
  draft.brand.logoUrl=await upload(logo);$('site-logo').value='';
  $('site-logo-preview').src=draft.brand.logoUrl;$('site-logo-preview').hidden=false;
 }
 for(const node of document.querySelectorAll('[data-upload-card]')){
  const file=node.files?.[0];
  if(file){draft.cards.appearance[node.dataset.uploadCard].imageUrl=await upload(file);node.value=''}
 }
}
function deliverFullPreview(){
 if(!previewWindow||previewWindow.closed||!previewWindowReady||!ready)return;
 const data=previewPayload;
 const config=data?.config||gather();
 previewWindow.postMessage({type:'lanesjekk-studio-preview-data',config,section:data?.section||previewSection,
  version:data?.version||'Utkast til versjon '+(revision+1)},location.origin);
}
async function openFullPreview(section='topp',historyVersion=null){
 if(!ready||!authUser)return false;
 previewSection=section;
 // Viewing archived versions must never replace the administrator's current draft.
 const historical=historyVersion&&historyVersion.snapshot;
 previewPayload=historical?{section,config:normalize(historyVersion.snapshot),
  version:'Arkiv: versjon '+historyVersion.revision+' · skrivebeskyttet'}:null;
 // A history inspection is NOT approval of the current draft.
 if(historical)lastPreviewFingerprint='';
 // Popup must be opened synchronously from the click event.
 const win=window.open('./studio-preview.html','lanesjekk-studio-full-preview','width=1460,height=940');
 if(!win){msg('Tillat popup-vinduer fra Lånesjekk Studio for å åpne full forhåndsvisning.',true);return false}
 if(previewWindow!==win||win.closed)previewWindowReady=false;
 previewWindow=win;win.focus();
 try{
  if(!historical)await prepareAssets();
  if(!historical)lastPreviewFingerprint=JSON.stringify(gather());
  deliverFullPreview();
  msg(historical?'Arkivversjon '+historyVersion.revision+' vises i eget vindu. Nåværende utkast er ikke endret.':
   'Hele nettsiden er åpnet som et utkast i eget vindu. Kontroller menyene og sidene før du publiserer.');
  refreshDashboard();return true;
 }catch(e){
  lastPreviewFingerprint='';
  msg('Kunne ikke klargjøre forhåndsvisning: '+(e.message||e),true);return false;
 }
}
window.lanesjekkStudioPreviewRoute=route=>{if(ready&&authUser&&typeof route==='string')void openFullPreview(route)};
window.lanesjekkStudioVideoAuth=async()=>{
 if(!ready||!authUser||await enforceSessionTimeout())throw Error('Logg inn som administrator før du genererer video.');
 const result=await db.auth.getSession();
 if(result.error||!result.data?.session?.access_token)throw Error('Administratorøkten er utløpt. Logg inn på nytt.');
 return result.data.session.access_token;
};
function openPreflight(){
 if(busy||!ready)return;
 if(!validateCatalogDraft()){document.querySelector('[data-admin-jump="admin-panel-catalog"]')?.click();return}
 const paths=collectChanges();
 if(!paths.length){msg('Ingen endringer å publisere.');return}
 $('admin-preflight-count').textContent=paths.length+' endringer i utkastet';
 $('admin-preflight-version').textContent='Fra versjon '+revision+' til versjon '+(revision+1);
 renderChangeDetails($('admin-preflight-changes'),paths);
 $('admin-preview-confirm').checked=false;$('admin-preview-confirm').disabled=true;
 $('admin-confirm-publish').disabled=true;
 $('admin-preflight-status').textContent='Åpne full forhåndsvisning, og bekreft deretter publiseringen.';
 $('admin-preflight').showModal();
 refreshDashboard();
}
const create=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);if(cls)n.className=cls;return n};
const msg=(value,error=false,target='admin-message')=>{const n=$(target);n.textContent=value;n.classList.toggle('error',error)};
const clamp=(str,max)=>String(str??'').trim().slice(0,max);
function clone(data){return JSON.parse(JSON.stringify(data))}
function normalize(data){
 const src=data&&typeof data==='object'?data:{},budget=src.budget||{},brand=src.brand||{},cards=src.cards||{};
 const order=[...new Set([...(Array.isArray(budget.order)?budget.order.filter(x=>DEFAULT_IDS.includes(x)):[]),...DEFAULT_IDS])];
 const cardOrder=[...new Set([...(Array.isArray(cards.order)?cards.order.filter(x=>CARD_IDS.includes(x)):[]),...CARDS_DEFAULT])];
 return {
 media:{slots:Object.fromEntries(MEDIA_IDS.map(id=>{const x=src.media?.slots?.[id]||{};return [id,{enabled:x.enabled!==false,videoUrl:String(x.videoUrl||'').slice(0,500),posterUrl:String(x.posterUrl||'').slice(0,500),title:clamp(x.title,90),description:clamp(x.description,210),fit:x.fit==='contain'?'contain':'cover',loop:x.loop!==false,placement:['before','after-intro','bottom'].includes(x.placement)?x.placement:'after-intro'}]}))},
 animations:{autoplay:src.animations?.autoplay!==false,valuation:src.animations?.valuation!==false,rental:src.animations?.rental!==false,receipts:src.animations?.receipts!==false},
 slides:{visible:src.slides?.visible!==false,order:[...new Set([...(Array.isArray(src.slides?.order)?src.slides.order.filter(id=>SLIDE_IDS.includes(id)):[]),...SLIDE_IDS])],items:Object.fromEntries(SLIDE_IDS.map(id=>[id,{title:clamp(src.slides?.items?.[id]?.title,95),description:clamp(src.slides?.items?.[id]?.description,220),enabled:src.slides?.items?.[id]?.enabled!==false}]))},
 brand:{name:clamp(brand.name||'LÅNESJEKK NORGE',70),tagline:clamp(brand.tagline||'Mer oversikt. Bedre valg.',130),theme:['light','dark','auto'].includes(brand.theme)?brand.theme:'light',accent:/^#[0-9A-Fa-f]{6}$/.test(brand.accent)?brand.accent:'#0c8878',logoUrl:clamp(brand.logoUrl,500),heroVisual:brand.heroVisual!==false,heroMotion:brand.heroMotion!==false},
 budget:{order,visible:Object.fromEntries(DEFAULT_IDS.map(id=>[id,id==='workbook'?true:budget.visible?.[id]!==false])),
 title:clamp(budget.title||'Ditt budsjett.',90),subtitle:clamp(budget.subtitle||'Din økonomiske kontroll.',120),
 quickTitle:clamp(budget.quickTitle||'Tre steg til økonomisk oversikt',100)},
 investing:{title:clamp(src.investing?.title||'Fond og aksjer – forstå risiko og muligheter',110)},
 catalog:{
  headline:clamp(src.catalog?.headline||catalogNewsDefaults.headline,100),
  news:(Array.isArray(src.catalog?.news)?src.catalog.news:[]).filter(item=>item&&typeof item==='object').slice(0,12).map((x,i)=>({
   id:clamp(x.id,50)||'nyhet-'+i,title:clamp(x.title,110),summary:clamp(x.summary,500),
   route:RELEASE_ROUTES.has(x.route)?x.route:'topp',
   date:/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')?x.date:''
  })),
  tools:(Array.isArray(src.catalog?.tools)?src.catalog.tools:[]).filter(x=>x&&typeof x==='object').slice(0,18).map((x,i)=>({
   id:/^custom-[a-z0-9-]{5,43}$/i.test(String(x.id||''))?x.id:'custom-'+i,
   route:RELEASE_ROUTES.has(x.route)?x.route:'budsjett',
   cat:['Lån','Økonomi','Sparing','Eiendom','Læring'].includes(x.cat)?x.cat:'Økonomi',
   title:clamp(x.title,85),subtitle:clamp(x.subtitle,170),
   how:clamp(x.how,450),icon:clamp(x.icon,8)||'✦',enabled:x.enabled!==false
  }))
 },
 cards:{order:cardOrder,appearance:Object.fromEntries(CARD_IDS.map(id=>{
 const appearance=cards.appearance?.[id]||{};
 return [id,{title:clamp(appearance.title,85),description:clamp(appearance.description,200),
 icon:clamp(appearance.icon,12),tone:['mint','blue','violet','peach'].includes(appearance.tone)?appearance.tone:'mint',
 visible:appearance.visible!==false,imageUrl:clamp(appearance.imageUrl,500)}];
 }))}
 };
}
async function enforceSessionTimeout(){
 if(!window.lanesjekkStudioSession?.expired())return false;
 await db.auth.signOut().catch(()=>{});
 window.lanesjekkStudioSession.clear();
 authUser=null;ready=false;published=null;draft=null;
 if(previewWindow&&!previewWindow.closed)previewWindow.close();
 $('admin-workspace').hidden=true;$('admin-auth').hidden=false;$('admin-signout').hidden=true;
 msg('24 timer har gått. Logg inn igjen for å fortsette sikkert.',true,'auth-status');
 return true;
}
async function isAuthorized(){
 if(await enforceSessionTimeout())return false;
 const {data,error}=await db.auth.getUser();
 if(error||!data?.user){authUser=null;return false;}
 const user=data.user;
 const result=await db.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(result.error||!result.data)return false;
 authUser=user;return true;
}
async function check(){
 if(!db)return;
 const ok=await isAuthorized();
 $('admin-workspace').hidden=!ok;$('admin-auth').hidden=ok;
 $('admin-signout').hidden=!ok;
 $('admin-account-wrapper').hidden=!ok;
 $('admin-account-email').textContent=ok&&authUser?.email?authUser.email:'Innlogget';
 if(ok&&!ready)await loadPublished();
}
async function login(e){
 e.preventDefault();
 const submit=$('admin-login');submit.disabled=true;msg('Kontrollerer innlogging …',false,'auth-status');
 window.lanesjekkStudioSession.configure($('admin-remember').checked);
 const {error}=await db.auth.signInWithPassword({email:$('admin-email').value.trim(),password:$('admin-password').value});
 submit.disabled=false;
 if(error){window.lanesjekkStudioSession.clear();msg('Innlogging feilet: '+error.message+'. Hvis e-postadressen ikke er bekreftet, må den bekreftes under Supabase Authentication.',true,'auth-status');return}
 if(!(await isAuthorized())){await db.auth.signOut();window.lanesjekkStudioSession.clear();msg('Kontoen har ikke administratorrettigheter i databasen.',true,'auth-status');return}
 await check();
}
async function loadPublished(){
 const r=await db.from('lanesjekk_site_config').select('config,revision,updated_at').eq('id',1).maybeSingle();
 if(r.error||!r.data){msg('Kunne ikke hente nettstedinnstillinger: '+(r.error?.message||'Ingen data'),true);return}
 published=normalize(r.data.config);draft=clone(published);revision=r.data.revision||1;lastPublishedAt=r.data.updated_at||'';ready=true;lastPreviewFingerprint='';
 $('admin-revision').textContent='Publisert versjon '+revision;
 render();await loadRevisions(true);await window.lanesjekkAnimationStudio?.refreshLibrary();refreshDashboard();
 window.dispatchEvent(new CustomEvent('lanesjekk-studio-ready'));
 $('admin-frame').src='./index.html#topp';
 msg('Nettstedsoppsettet er hentet. Du kan endre og forhåndsvise før du publiserer.');
}
function rowEl(id,type,label){
 const container=create('div',undefined,'admin-item');container.dataset.id=id;container.draggable=true;
 const grip=create('span','⠿','admin-grab');grip.title='Dra og slipp for å endre rekkefølge';
 const main=create('div',undefined,'admin-item-main'),name=create('strong',label);main.append(name);
 const actions=create('div',undefined,'admin-item-controls');
 const up=create('button','↑'),down=create('button','↓');up.type=down.type='button';
 up.title='Flytt opp';down.title='Flytt ned';
 up.addEventListener('click',()=>move(type,id,-1));
 down.addEventListener('click',()=>move(type,id,1));
 const inspect=create('button','↗');inspect.type='button';inspect.title='Åpne objektet i full forhåndsvisning';inspect.setAttribute('aria-label','Forhåndsvis '+label);inspect.addEventListener('click',()=>{void openFullPreview(type==='budget'?'budsjett':previewRouteForCard(id))});actions.append(up,down,inspect);
 container.append(grip,main,actions);
 container.addEventListener('dragstart',e=>{container.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',type+':'+id)});
 container.addEventListener('dragend',()=>container.classList.remove('dragging'));
 container.addEventListener('dragover',e=>{e.preventDefault();container.classList.add('target')});
 container.addEventListener('dragleave',()=>container.classList.remove('target'));
 container.addEventListener('drop',e=>{
  e.preventDefault();container.classList.remove('target');
  const token=e.dataTransfer.getData('text/plain');
  if(!token.startsWith(type+':'))return;
  const source=token.slice(type.length+1),arr=type==='budget'?draft.budget.order:draft.cards.order;
  const a=arr.indexOf(source),b=arr.indexOf(id);
  if(a<0||b<0||a===b)return;
  arr.splice(a,1);arr.splice(b,0,source);renderSort(type);
 });
 return {container,main};
}
function move(type,id,delta){
 const arr=type==='budget'?draft.budget.order:draft.cards.order,i=arr.indexOf(id),j=i+delta;
 if(i<0||j<0||j>=arr.length)return;
 [arr[i],arr[j]]=[arr[j],arr[i]];renderSort(type);
}
function renderSort(type){
 const root=$(type==='budget'?'budget-sort':'card-sort');root.replaceChildren();
 const order=type==='budget'?draft.budget.order:draft.cards.order;
 for(const id of order){
  const {container,main}=rowEl(id,type,type==='budget'?SECTION_NAMES[id]:CARD_NAMES[id]);
  const appearance=draft.cards.appearance[id];
  const toggle=create('label',undefined,'admin-inline'),check=create('input');
  check.type='checkbox';check.setAttribute('role','switch');check.checked=type==='budget'?draft.budget.visible[id]:appearance.visible;
  if(type==='budget'&&id==='workbook'){check.disabled=true;check.title='Budsjettarket må være tilgjengelig'}
  check.onchange=()=>{if(type==='budget')draft.budget.visible[id]=check.checked;else appearance.visible=check.checked};
  toggle.classList.add('admin-switch');toggle.append(check,create('span','Vis på nettsiden'));
   toggle.append(create('small',type==='budget'?'På: denne budsjettseksjonen vises. Av: seksjonen skjules etter publisering.':'På: dette objektet vises. Av: kortet skjules etter publisering.','admin-toggle-hint'));main.append(toggle);
  if(type==='cards'){
   const title=create('input');title.type='text';title.maxLength=85;title.value=appearance.title;title.placeholder='Kortets tittel (tom = standard)';
   title.setAttribute('aria-label',CARD_NAMES[id]+' tittel');title.oninput=()=>appearance.title=title.value;
   const desc=create('textarea');desc.maxLength=200;desc.value=appearance.description;desc.placeholder='Kortbeskrivelse (tom = standard)';
   desc.setAttribute('aria-label',CARD_NAMES[id]+' beskrivelse');desc.oninput=()=>appearance.description=desc.value;
   const icon=create('input');icon.type='text';icon.maxLength=12;icon.value=appearance.icon;icon.placeholder='Ikon, f.eks. ◉ eller 🏡';
   icon.setAttribute('aria-label',CARD_NAMES[id]+' ikon');icon.oninput=()=>appearance.icon=icon.value;
   const tone=create('select');tone.setAttribute('aria-label',CARD_NAMES[id]+' farge');
   for(const [value,name] of [['mint','Grønn'],['blue','Blå'],['violet','Lilla'],['peach','Fersken']]){
    const opt=create('option',name);opt.value=value;tone.append(opt);
   }
   tone.value=appearance.tone;tone.onchange=()=>appearance.tone=tone.value;
   const upload=create('input');upload.type='file';upload.accept='image/png,image/jpeg,image/webp';upload.className='admin-mini-upload';
   upload.setAttribute('aria-label',CARD_NAMES[id]+' last opp ikonfil');
   upload.dataset.uploadCard=id;
   const clear=create('button','Fjern egendefinert bilde','admin-secondary');clear.type='button';clear.onclick=()=>{
    appearance.imageUrl='';upload.value='';msg('Bildet er fjernet fra utkastet. Publiser for å lagre.');
   };
   main.append(title,desc,icon,tone,upload,clear);
  }
  root.append(container);
 }
}
function renderSlides(){
 const wrap=$('slide-editor');if(!wrap)return;wrap.replaceChildren();
 $('slide-visible').checked=draft.slides.visible;
 const labels={loan:'Boliglån',budget:'Budsjett',receipts:'Kvitteringer',invest:'Sparing og investering',property:'Eiendom og utleie',currency:'Valuta'};
 for(const id of draft.slides.order){
  const item=draft.slides.items[id],outer=create('div',undefined,'admin-item'),body=create('div',undefined,'admin-item-main');
  const heading=create('strong',labels[id]),tools=create('div',undefined,'admin-item-controls');
  for(const [label,delta] of [['↑',-1],['↓',1]]){const b=create('button',label);b.type='button';b.onclick=()=>{const a=draft.slides.order,i=a.indexOf(id),n=i+delta;if(n<0||n>=a.length)return;[a[i],a[n]]=[a[n],a[i]];renderSlides()};tools.append(b)}
  const shown=create('input');shown.type='checkbox';shown.setAttribute('role','switch');shown.checked=item.enabled;shown.onchange=()=>item.enabled=shown.checked;
  const shownLabel=create('label',undefined,'admin-inline');shownLabel.classList.add('admin-switch');shownLabel.append(shown,create('span','Vis scene'));shownLabel.append(create('small','På: scenen vises på forsiden. Av: scenen skjules.','admin-toggle-hint'));
  const title=create('input');title.type='text';title.maxLength=95;title.value=item.title;title.placeholder='Overskrift – tom = standard';title.oninput=()=>item.title=title.value;title.setAttribute('aria-label',labels[id]+' overskrift');
  const desc=create('textarea');desc.maxLength=220;desc.value=item.description;desc.placeholder='Beskrivelse – tom = standard';desc.oninput=()=>item.description=desc.value;desc.setAttribute('aria-label',labels[id]+' beskrivelse');
  body.append(heading,shownLabel,title,desc);outer.append(body,tools);wrap.append(outer);
 }
}
const CATALOG_META={
 topp:{name:'Forsiden',cat:'Økonomi',icon:'◈',summary:'Se verktøyene som hjelper deg med privatøkonomi.',how:'Velg et verktøy fra forsiden for å starte.'},
 sjekk:{name:'Boliglån',cat:'Lån',icon:'⌂',summary:'Beregn terminbeløp, rente og samlet lånekostnad.',how:'Åpne boliglånskalkulatoren, fyll inn lånebeløp, rente og løpetid.'},
 billan:{name:'Billån',cat:'Lån',icon:'▣',summary:'Sammenlign kostnader ved bilfinansiering.',how:'Fyll inn bilpris, egenkapital og rente i billånsverktøyet.'},
 forbrukslan:{name:'Forbrukslån',cat:'Lån',icon:'▤',summary:'Se hva et lån uten sikkerhet kan koste.',how:'Angi beløp og rente, og undersøk totalkostnaden.'},
 banker:{name:'Bankoversikt',cat:'Lån',icon:'▥',summary:'Finn frem til banker og leverandørenes egne nettsteder.',how:'Finn en bank i oversikten og kontroller aktuelle priser hos banken.'},
 budsjett:{name:'Budsjett',cat:'Økonomi',icon:'▦',summary:'Få oversikt over inntekter og utgifter.',how:'Legg til inntekter og utgifter og undersøk månedsplan og grafer.'},
 kvitteringer:{name:'Kvitteringsstudio',cat:'Økonomi',icon:'▧',summary:'Analyser handlekurven, varer og kjøp.',how:'Registrer kvitteringsinnhold og sammenlign utgiftskategorier.'},
 sparing:{name:'Sparing',cat:'Sparing',icon:'◉',summary:'Se hvordan sparebeløp og renter påvirker saldoen.',how:'Angi startsaldo, månedlig sparing og periode, og sammenlign alternativer.'},
 investering:{name:'Fond og aksjer',cat:'Sparing',icon:'↗',summary:'Utforsk langsiktig sparing og investeringsrisiko.',how:'Se beregnede scenarier og les om risiko før du investerer.'},
 valutakompass:{name:'Valutakompass',cat:'Sparing',icon:'¤',summary:'Regn om beløp mellom valutaer.',how:'Velg valutaer, beløp og se dato for den oppgitte kursen.'},
 boligverdi:{name:'Boligverdi',cat:'Eiendom',icon:'⌂',summary:'Undersøk veiledende boligverdi.',how:'Søk etter adresse og vurder datagrunnlag og usikkerhet.'},
 utleieanalyse:{name:'Utleieanalyse',cat:'Eiendom',icon:'▤',summary:'Regn på leieinntekt, kostnader og netto.',how:'Registrer forventet leie og kostnader i utleieanalysen.'},
 akademi:{name:'Læringsplattform',cat:'Læring',icon:'✦',summary:'Lær om økonomi med forklaringer og oppgaver.',how:'Velg tema i Akademiet og gjennomfør øvelsene.'},
 guider:{name:'Guider og artikler',cat:'Læring',icon:'☷',summary:'Finn forklaringer og metoder om privatøkonomi.',how:'Åpne guider og les anbefalte kilder.'}
};
const toolRouteList=Object.keys(CATALOG_META).filter(id=>id!=='topp');
function catalogNote(message,error=false){
 const el=$('admin-catalog-status');
 if(el){el.textContent=message;el.dataset.error=String(error)}
 if(error)msg(message,true);
}
function catalogChanged(message){
 window.lanesjekkCatalog?.setNews(draft.catalog);
 window.dispatchEvent(new Event('lanesjekk-studio-catalog-changed'));
 refreshDashboard();
 if(message)catalogNote(message);
}
function catalogSelector(value,label,items,onChange){
 const field=create('label',undefined,'catalog-item-field');
 const text=create('span',label);const input=create('select');input.setAttribute('aria-label',label);
 for(const [key,title]of items){const option=create('option',title);option.value=key;input.append(option)}
 input.value=value;input.addEventListener('change',()=>onChange(input.value));
 field.append(text,input);return field;
}
function catalogField(label,type,value,max,onChange){
 const field=create('label',undefined,'catalog-item-field');
 const name=create('span',label),input=create(type==='multiline'?'textarea':'input');
 if(type!=='multiline')input.type=type==='date'?'date':'text';
 if(max)input.maxLength=max;
 if(type==='multiline')input.rows=3;
 input.value=value||'';input.setAttribute('aria-label',label);
 input.addEventListener('input',()=>onChange(input.value));
 if(type==='date')input.addEventListener('change',()=>onChange(input.value));
 field.append(name,input);
 return{field,input}
}
function fillCatalogRouteSelectors(){
 const routes=Object.entries(CATALOG_META);
 const tools=$('catalog-tool-route'),news=$('catalog-news-route');
 for(const sel of [tools,news]){
  if(!sel||sel.options.length)return;
  for(const [id,item]of routes){
   if(sel===tools&&id==='topp')continue;
   const option=create('option',item.name);option.value=id;sel.append(option);
  }
  sel.value='budsjett';
 }
}
function renderCatalog(focus){
 const toolsRoot=$('catalog-tool-editor'),newsRoot=$('catalog-news-editor');
 if(!toolsRoot||!newsRoot||!draft?.catalog)return;
 fillCatalogRouteSelectors();
 toolsRoot.replaceChildren();newsRoot.replaceChildren();
 const toolCount=draft.catalog.tools?.length||0,newsCount=draft.catalog.news.length;
 $('catalog-tools-count').textContent=toolCount+' ekstra funksjonskort';
 $('catalog-news-count').textContent=newsCount+' oppdateringer';
 if(!toolCount)toolsRoot.append(create('p','Ingen ekstra kort ennå. Velg et verktøy over og trykk «Legg til funksjonskort».','catalog-empty'));
 if(!newsCount)newsRoot.append(create('p','Ingen oppdateringer ennå. Velg funksjonen over og trykk «Legg til oppdatering».','catalog-empty'));
 for(const item of draft.catalog.tools||[]){
  const card=create('article',undefined,'catalog-editor-card');card.dataset.catalogId=item.id;
  const head=create('div',undefined,'catalog-editor-head');
  head.append(create('strong','Funksjonskort · '+(item.title||'Uten tittel')),create('span','Utkast · '+(item.enabled?'vises etter publisering':'skjult'),'catalog-draft-pill'));
  const grid=create('div',undefined,'catalog-editor-grid');
  const title=catalogField('Tittel på kortet','text',item.title,85,value=>{item.title=value;catalogChanged()});
  title.input.dataset.catalogFocus=item.id;
  const subtitle=catalogField('Kort beskrivelse','multiline',item.subtitle,170,value=>{item.subtitle=value;catalogChanged()});
  const how=catalogField('Slik brukes funksjonen','multiline',item.how,450,value=>{item.how=value;catalogChanged()});
  const symbol=catalogField('Ikon eller emoji','text',item.icon,8,value=>{item.icon=value;catalogChanged()});
  const route=catalogSelector(item.route,'Åpner eksisterende verktøy',toolRouteList.map(id=>[id,CATALOG_META[id].name]),value=>{
   const was=CATALOG_META[item.route],next=CATALOG_META[value];
   if(item.title===was.name)item.title=next.name;
   if(item.subtitle===was.summary)item.subtitle=next.summary;
   if(item.how===was.how)item.how=next.how;
   if(item.icon===was.icon)item.icon=next.icon;
   if(item.cat===was.cat)item.cat=next.cat;
   item.route=value;renderCatalog();catalogChanged('Funksjonskortet åpner nå '+next.name+'.');
  });
  const cat=catalogSelector(item.cat,'Kategori',['Lån','Økonomi','Sparing','Eiendom','Læring'].map(id=>[id,id]),value=>{item.cat=value;catalogChanged()});
  const visible=create('label',undefined,'catalog-visibility');
  const switcher=create('input');switcher.type='checkbox';switcher.setAttribute('role','switch');
  switcher.checked=item.enabled;switcher.addEventListener('change',()=>{item.enabled=switcher.checked;head.querySelector('.catalog-draft-pill').textContent=item.enabled?'Utkast · vises etter publisering':'Utkast · skjult';catalogChanged()});
  visible.append(switcher,create('span','Vis kortet på forsiden etter publisering'));
  grid.append(title.field,subtitle.field,how.field,route,cat,symbol.field,visible);
  const actions=create('div',undefined,'catalog-editor-actions');
  const preview=create('button','↗ Åpne funksjonen i full forhåndsvisning','admin-secondary');preview.type='button';
  preview.addEventListener('click',()=>{void openFullPreview(item.route)});
  const up=create('button','↑','admin-secondary');up.type='button';up.title='Flytt opp';up.setAttribute('aria-label','Flytt '+item.title+' opp');
  const down=create('button','↓','admin-secondary');down.type='button';down.title='Flytt ned';down.setAttribute('aria-label','Flytt '+item.title+' ned');
  const index=draft.catalog.tools.indexOf(item);up.disabled=index===0;down.disabled=index===toolCount-1;
  const shift=delta=>{const ix=draft.catalog.tools.indexOf(item),to=ix+delta;
   if(to<0||to>=draft.catalog.tools.length)return;
   draft.catalog.tools.splice(ix,1);draft.catalog.tools.splice(to,0,item);
   renderCatalog();catalogChanged('Rekkefølgen er oppdatert som utkast.');
  };
  up.onclick=()=>shift(-1);down.onclick=()=>shift(1);
  const remove=create('button','Slett kort','admin-secondary');remove.type='button';
  remove.addEventListener('click',()=>{draft.catalog.tools=draft.catalog.tools.filter(x=>x!==item);if($('catalog-next-step')?.dataset.catalogId===item.id)$('catalog-next-step').hidden=true;renderCatalog();catalogChanged('Funksjonskortet ble fjernet fra utkastet.')});
  actions.append(preview,up,down,remove);card.append(head,grid,actions);toolsRoot.append(card);
 }
 for(const item of draft.catalog.news){
  const card=create('article',undefined,'catalog-editor-card');card.dataset.catalogId=item.id;
  const head=create('div',undefined,'catalog-editor-head');
  head.append(create('strong','Oppdatering · '+(CATALOG_META[item.route]?.name||'Funksjon')),create('span','Utkast · '+(item.date||'dato ikke satt'),'catalog-draft-pill'));
  const grid=create('div',undefined,'catalog-editor-grid');
  const title=catalogField('Overskrift på oppdateringen','text',item.title,110,value=>{item.title=value;catalogChanged()});
  title.input.dataset.catalogFocus=item.id;
  const summary=catalogField('Hva er endret, og hva får brukeren ut av det?','multiline',item.summary,500,value=>{item.summary=value;catalogChanged()});
  const route=catalogSelector(item.route,'Åpner funksjon',Object.entries(CATALOG_META).map(([id,x])=>[id,x.name]),value=>{
   const old=CATALOG_META[item.route],next=CATALOG_META[value];
   if(item.title==='Nytt i '+old.name)item.title='Nytt i '+next.name;
   if(item.summary==='Utforsk '+old.name.toLocaleLowerCase('nb-NO')+': '+old.summary)item.summary='Utforsk '+next.name.toLocaleLowerCase('nb-NO')+': '+next.summary;
   item.route=value;renderCatalog();catalogChanged('Oppdateringen er koblet til '+next.name+'.');
  });
  const date=catalogField('Dato (fylles inn automatisk)','date',item.date,0,value=>{item.date=value;catalogChanged()});
  grid.append(title.field,summary.field,route,date.field);
  const actions=create('div',undefined,'catalog-editor-actions');
  const preview=create('button','↗ Vis oppdateringen i Studio','admin-secondary');preview.type='button';
  preview.addEventListener('click',()=>{window.lanesjekkCatalog?.setNews(gather().catalog);window.lanesjekkCatalog?.open('news')});
  const go=create('button','Åpne målverktøy i full forhåndsvisning','admin-secondary');go.type='button';go.onclick=()=>{void openFullPreview(item.route)};
  const remove=create('button','Slett oppdatering','admin-secondary');remove.type='button';
  remove.addEventListener('click',()=>{draft.catalog.news=draft.catalog.news.filter(entry=>entry!==item);renderCatalog();catalogChanged('Oppdateringen ble fjernet fra utkastet.')});
  actions.append(preview,go,remove);card.append(head,grid,actions);newsRoot.append(card);
 }
 if(focus){
  const target=document.querySelector('[data-catalog-focus="'+CSS.escape(focus)+'"]');
  if(target){
   target.closest('.catalog-editor-card')?.classList.add('catalog-just-created');
   target.scrollIntoView({behavior:'smooth',block:'center'});
   target.focus({preventScroll:true});target.select?.();
  }
 }
}
function validateCatalogDraft(){
 if(!draft?.catalog)return true;
 for(const item of draft.catalog.tools||[]){
  if(!item.title.trim()||!item.subtitle.trim()||!item.how.trim()||!RELEASE_ROUTES.has(item.route)){
   catalogNote('Fyll ut navn, beskrivelse, brukerveiledning og gyldig destinasjon for alle funksjonskort.',true);
   document.querySelector('[data-catalog-id="'+item.id+'"]')?.scrollIntoView({behavior:'smooth',block:'center'});
   return false;
  }
 }
 for(const item of draft.catalog.news){
  if(!item.title.trim()||!item.summary.trim()||!RELEASE_ROUTES.has(item.route)||!/\d{4}-\d{2}-\d{2}/.test(item.date)){
   catalogNote('Fyll ut tittel, beskrivelse, målverktøy og dato for alle oppdateringer.',true);
   document.querySelector('[data-catalog-id="'+item.id+'"]')?.scrollIntoView({behavior:'smooth',block:'center'});
   return false;
  }
 }
 return true;
}
function render(){
 for(const key of ['autoplay','valuation','rental','receipts'])$('motion-'+key).checked=draft.animations[key];
 $('site-name').value=draft.brand.name;
 $('site-tagline').value=draft.brand.tagline;
 $('site-color').value=draft.brand.accent;
 $('site-theme').value=draft.brand.theme;
 $('site-hero-visual').checked=draft.brand.heroVisual!==false;
 $('site-hero-motion').checked=draft.brand.heroMotion!==false;
 $('budget-title').value=draft.budget.title;
 $('budget-subtitle').value=draft.budget.subtitle;
 $('budget-quick-title').value=draft.budget.quickTitle;
 $('invest-title').value=draft.investing.title;
 $('site-logo-preview').hidden=!draft.brand.logoUrl;
 if(draft.brand.logoUrl)$('site-logo-preview').src=draft.brand.logoUrl;
 renderSort('budget');renderSort('cards');renderSlides();renderCatalog();if($('catalog-headline'))$('catalog-headline').value=draft.catalog.headline;window.lanesjekkCatalog?.setNews(draft.catalog);window.lanesjekkAnimationStudio?.render();
}
function gather(){
 for(const key of ['autoplay','valuation','rental','receipts'])draft.animations[key]=$('motion-'+key).checked;
 draft.slides.visible=$('slide-visible').checked;
 draft.brand.name=clamp($('site-name').value,70)||'LÅNESJEKK NORGE';
 draft.brand.tagline=clamp($('site-tagline').value,130);
 draft.brand.accent=$('site-color').value;
 draft.brand.theme=$('site-theme').value;
 if($('catalog-headline'))draft.catalog.headline=clamp($('catalog-headline').value,100)||catalogNewsDefaults.headline;
 draft.brand.heroVisual=$('site-hero-visual').checked;
 draft.brand.heroMotion=$('site-hero-motion').checked;
 draft.budget.title=clamp($('budget-title').value,90);
 draft.budget.subtitle=clamp($('budget-subtitle').value,120);
 draft.budget.quickTitle=clamp($('budget-quick-title').value,100);
 draft.investing.title=clamp($('invest-title').value,110);
 return normalize(draft);
}
function showPreview(){
 const frame=$('admin-frame'),doc=frame.contentWindow;
 if(!doc)return;
 const config=gather();
 doc.postMessage({type:'lanesjekk-cms-preview',config},location.origin);
 msg('Midlertidig layout er sendt til forhåndsvisningen. Oppdaterer du forhåndsvisningen, går den tilbake til publisert design.');
}
function statusDisabled(on){
 busy=on;$('admin-preview').disabled=on;$('admin-confirm-publish').disabled=on;refreshDashboard();
}
async function upload(file){
 if(!file)return null;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2097152)throw Error('Bildet må være PNG/JPEG/WebP og maks 2 MB.');
 const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const name='lanesjekk-'+crypto.randomUUID()+'.'+ext;
 const {error}=await db.storage.from('site-assets').upload(name,file,{cacheControl:'3600',contentType:file.type,upsert:false});
 if(error)throw error;
 return db.storage.from('site-assets').getPublicUrl(name).data.publicUrl;
}
async function publish(){
 if(busy||!authUser||!$('admin-preflight').open||!$('admin-preview-confirm').checked)return;
 if(!validateCatalogDraft())return;
 const config=gather();
 if(!previewWindow||previewWindow.closed||lastPreviewFingerprint!==JSON.stringify(config)||!collectChanges().length){
  msg('Utkastet er endret etter forhåndsvisningen. Kontroller nettsiden på nytt.',true);
  refreshDashboard();return;
 }
 statusDisabled(true);msg('Publiserer versjon '+(revision+1)+' …');
 $('admin-preflight-status').textContent='Lagrer den godkjente versjonen …';
 try{
  const {data,error}=await db.from('lanesjekk_site_config')
   .update({config}).eq('id',1).eq('revision',revision)
   .select('revision,updated_at').maybeSingle();
  if(error)throw error;
  if(!data)throw Error('Noen andre publiserte først. Last inn den siste versjonen og prøv igjen.');
  published=normalize(config);draft=clone(published);revision=data.revision;lastPublishedAt=data.updated_at||new Date().toISOString();
  lastPreviewFingerprint='';
  render();await loadRevisions(true);
  $('admin-frame').src='./index.html#topp';
  $('admin-preflight').close();
  msg('Publisert! Versjon '+revision+' er nå aktiv. Tidspunkt: '+fmtDate(lastPublishedAt)+'. Du finner den i publiseringsloggen.');
 }catch(e){
  msg('Publisering ble ikke fullført: '+(e?.message||String(e)),true);
  $('admin-preflight-status').textContent='Kunne ikke bekrefte publisering. Kontroller feilmeldingen.';
 }finally{statusDisabled(false);refreshDashboard()}
}
function renderPublishEvents(){
 const root=$('admin-history');root.replaceChildren();
 const term=$('admin-history-search').value.trim().toLocaleLowerCase('nb-NO');
 const filtered=publishEvents.filter((event,index)=>{
  const previous=publishEvents[index+1];
  const changed=previous?changesBetween(previous.snapshot,event.snapshot).map(describePath):[];
  return ('versjon '+event.revision+' '+fmtDate(event.published_at)+' '+changed.join(' ')).toLocaleLowerCase('nb-NO').includes(term);
 });
 if(!filtered.length){root.append(create('p',term?'Ingen versjoner passer søket.':'Ingen tidligere publiseringer funnet.','admin-hint'));return}
 for(const event of filtered){
  const index=publishEvents.indexOf(event),previous=publishEvents[index+1];
  const paths=previous?changesBetween(previous.snapshot,event.snapshot):null;
  const row=create('article',undefined,'admin-history-entry');
  const head=create('div',undefined,'admin-history-entry-head'),info=create('div');
  const title=create('strong','Versjon '+event.revision),date=create('time',fmtDate(event.published_at));
  if(event.published_at)date.dateTime=event.published_at;
  info.append(title,date);head.append(info);
  const tag=create('span',event.revision===revision?'PUBLISERT':'ARKIV','admin-history-tag');
  if(event.revision===revision)tag.dataset.current='true';
  head.append(tag);row.append(head);
  const summary=paths===null?'Eldre versjoner må lastes for sammenligning.':
   paths.length?paths.slice(0,3).map(describePath).join(' · ')+(paths.length>3?' · +'+(paths.length-3)+' flere':''):'Ingen endringer i CMS-innstillinger';
  row.append(create('p',summary,'admin-history-summary'));
  const actions=create('div',undefined,'admin-history-actions'),detailBox=create('div',undefined,'admin-history-detail');
  detailBox.hidden=true;
  if(paths)renderChangeDetails(detailBox,paths,50);
  else detailBox.append(create('p','Last eldre versjoner for å vise en fullstendig sammenligning.'));
  const detailsButton=create('button','Vis endringer','admin-secondary');detailsButton.type='button';
  detailsButton.onclick=()=>{
   detailBox.hidden=!detailBox.hidden;
   detailsButton.textContent=detailBox.hidden?'Vis endringer':'Skjul endringer';
   if(!detailBox.hidden){
    if(paths)renderChangeDetails(detailBox,paths,50);
    else detailBox.replaceChildren(create('p','Last eldre versjoner for å se endringer fra forrige publisering.'));
   }
  };
  const compareButton=create('button','Sammenlign med aktiv','admin-secondary');compareButton.type='button';
  compareButton.disabled=event.revision===revision;
  compareButton.title='Vis alle forskjeller mellom denne arkivversjonen og dagens publiserte versjon';
  compareButton.onclick=()=>{
   const difference=changesBetween(normalize(event.snapshot),published);
   renderChangeDetails(detailBox,difference,80);
   detailBox.hidden=false;
   detailsButton.textContent='Vis endringer';
  };
  const previewButton=create('button','Vis denne versjonen','admin-secondary');previewButton.type='button';
  previewButton.onclick=()=>{
   // Read-only history inspection. The separate restore action intentionally changes the draft.
   void openFullPreview('topp',event);
  };
  const restore=create('button','Gjenopprett som utkast','admin-secondary');restore.type='button';
  restore.disabled=event.revision===revision;
  restore.onclick=()=>{
   if(collectChanges().length&&!window.confirm('Erstatte upubliserte endringer med versjon '+event.revision+'?'))return;
   draft=normalize(event.snapshot);render();lastPreviewFingerprint='';refreshDashboard();
   document.getElementById('admin-workspace').scrollIntoView({behavior:'smooth'});
   msg('Gjenoppretting: versjon '+event.revision+' er lagt i utkastet. Bruk «Forhåndsvis hele nettsiden» og «Kontroller og publiser» for å gjøre den aktiv.');
  };
  actions.append(detailsButton,compareButton,previewButton,restore);
  row.append(actions,detailBox);root.append(row);
 }
}
async function loadRevisions(reset=false){
 if(!db||!authUser)return;
 if(reset){publishEvents=[];historyOffset=0;historyHasMore=false}
 const root=$('admin-history');
 $('admin-history-status').textContent='Henter publiseringshistorikk …';
 const {data,error}=await db.from('lanesjekk_publish_events')
  .select('revision,published_at,snapshot,previous_revision')
  .order('revision',{ascending:false}).range(historyOffset,historyOffset+49);
 if(error){
  $('admin-history-status').textContent='Logg kunne ikke leses: '+error.message;
  if(!publishEvents.length)root.replaceChildren(create('p','Kunne ikke hente historikken. Kontroller database- og admin-tilgangen.'));
  return;
 }
 for(const item of data||[])if(!publishEvents.some(x=>x.revision===item.revision))publishEvents.push(item);
 publishEvents.sort((a,b)=>b.revision-a.revision);
 historyOffset+=(data||[]).length;
 historyHasMore=(data||[]).length===50;
 $('admin-history-count').textContent=String(publishEvents.length);
 $('admin-history-status').textContent=publishEvents.length+' versjoner lastet'+(historyHasMore?' · flere er tilgjengelige':'');
 $('admin-history-more').hidden=!historyHasMore;
 renderPublishEvents();
}
function boot(){
 if(!window.supabase||!window.lanesjekkStudioSession){msg('Innloggingsbiblioteket kunne ikke lastes. Kontroller innholdsblokkering.',true,'auth-status');return}
 db=window.supabase.createClient(BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,
  storage:window.lanesjekkStudioSession.storage,storageKey:window.lanesjekkStudioSession.key}});
 $('admin-remember').checked=window.lanesjekkStudioSession.rememberEnabled();
 setInterval(()=>{void enforceSessionTimeout()},60000);
 window.addEventListener('focus',()=>{void enforceSessionTimeout()});
 window.lanesjekkAnimationStudio?.init({db,getDraft:()=>draft,getPublished:()=>published,notify:(text,isError=false)=>msg(text,isError),bucket:'animation-assets',storageBase:BASE});
 $('admin-login-form').addEventListener('submit',login);
 $('admin-signout').addEventListener('click',async()=>{
  await db.auth.signOut();window.lanesjekkStudioSession.clear();authUser=null;ready=false;published=null;draft=null;if(previewWindow&&!previewWindow.closed)previewWindow.close();await check();
 });
 $('admin-preview').addEventListener('click',()=>{void openFullPreview()});
 $('preview-fullscreen').addEventListener('click',()=>{void openFullPreview()});
 $('admin-open-features')?.addEventListener('click',event=>{
  if(!ready||!authUser){event.stopImmediatePropagation();return}
  window.lanesjekkCatalog?.setNews(gather().catalog);
 });
 $('catalog-add-news')?.addEventListener('click',()=>{
  if(!ready||!draft)return;
  if(draft.catalog.news.length>=12){catalogNote('Maks 12 oppdateringer per publisering. Rediger eller slett en eksisterende oppdatering først.',true);return}
  const route=$('catalog-news-route').value,meta=CATALOG_META[route]||CATALOG_META.budsjett;
  const item={id:'nyhet-'+crypto.randomUUID(),title:'Nytt i '+meta.name,
   summary:'Utforsk '+meta.name.toLocaleLowerCase('nb-NO')+': '+meta.summary,
   route:route in CATALOG_META?route:'budsjett',date:new Date().toISOString().slice(0,10)};
  draft.catalog.news.unshift(item);
  renderCatalog(item.id);
  if($('catalog-news-next'))$('catalog-news-next').hidden=false;
  showPreviewSection(item.route);
  catalogChanged('Oppdateringen er opprettet som utkast. Rediger tittelen under før du publiserer.');
  requestAnimationFrame(()=>document.querySelector('[data-catalog-focus="'+CSS.escape(item.id)+'"]')?.focus({preventScroll:true}));
 });
 $('catalog-next-edit')?.addEventListener('click',()=>{
  const id=$('catalog-next-step')?.dataset.catalogId;
  if(!id)return;
  const target=document.querySelector('[data-catalog-id="'+CSS.escape(id)+'"]');
  target?.scrollIntoView({behavior:'smooth',block:'center'});
  target?.querySelector('[data-catalog-focus]')?.focus({preventScroll:true});
 });
 $('catalog-next-preview')?.addEventListener('click',()=>{void openFullPreview('topp')});
 $('catalog-next-publish')?.addEventListener('click',()=>$('admin-publish')?.click());
  $('catalog-add-tool')?.addEventListener('click',()=>{
  if(!ready||!draft)return;
  if(draft.catalog.tools.length>=18){catalogNote('Maks 18 ekstra funksjonskort. Rediger eller slett et eksisterende kort.',true);return}
  const route=$('catalog-tool-route').value,meta=CATALOG_META[route]||CATALOG_META.budsjett;
  const item={id:'custom-'+crypto.randomUUID(),route:route in CATALOG_META&&route!=='topp'?route:'budsjett',
    cat:meta.cat,title:meta.name,subtitle:meta.summary,how:meta.how,icon:meta.icon,enabled:true};
  draft.catalog.tools.unshift(item);
  renderCatalog(item.id);
  const nextStep=$('catalog-next-step');
  if(nextStep){
   nextStep.hidden=false;
   $('catalog-next-title').textContent='«'+meta.name+'» er lagt til som utkast';
   $('catalog-next-description').textContent='Kortet er automatisk knyttet til '+meta.name+' i kategorien '+meta.cat+'. Rediger detaljene under, kontroller hvordan det vises på forsiden og godkjenn publisering.';
   nextStep.dataset.catalogId=item.id;
   nextStep.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  showPreviewSection('topp');
  catalogChanged('«'+meta.name+'» er opprettet. Neste steg: rediger kortet, kontroller forhåndsvisningen og publiser.');
  requestAnimationFrame(()=>{
   const input=document.querySelector('[data-catalog-focus="'+CSS.escape(item.id)+'"]');
   if(input){input.closest('.catalog-editor-card')?.classList.add('catalog-just-created');input.focus({preventScroll:true});input.select?.()}
  });
 });
 $('catalog-open-news-preview')?.addEventListener('click',()=>{
  if(!ready||!authUser)return;
  window.lanesjekkCatalog?.setNews(gather().catalog);
  window.lanesjekkCatalog?.open('news');
 });
 $('media-preview-page').addEventListener('click',()=>{
  const routes={home:'topp',loans:'sjekk',budget:'budsjett',receipts:'kvitteringer',valuation:'boligverdi',rental:'utleieanalyse',savings:'sparing',investing:'investering',carloan:'billan',academy:'akademi',currency:'valutakompass'};
  void openFullPreview(routes[$('media-target').value]||'topp');
 });
 $('admin-publish').addEventListener('click',()=>{
  openPreflight();
  if($('admin-preflight').open)void openFullPreview();
 });
 $('admin-preflight-preview').addEventListener('click',()=>{void openFullPreview()});
 $('admin-preflight-close').addEventListener('click',()=>$('admin-preflight').close());
 $('admin-preflight-cancel').addEventListener('click',()=>$('admin-preflight').close());
 $('admin-preview-confirm').addEventListener('change',refreshDashboard);
 $('admin-confirm-publish').addEventListener('click',publish);
 $('admin-preflight').addEventListener('close',refreshDashboard);
 $('admin-history-search').addEventListener('input',renderPublishEvents);
 $('admin-history-refresh').addEventListener('click',()=>{void loadRevisions(true)});
 $('admin-history-more').addEventListener('click',()=>{void loadRevisions(false)});
 const adminPanels=[...document.querySelectorAll('.admin-edit-panel > details.admin-panel')].filter(panel=>panel.id!=='admin-panel-history');
 const jumpButtons=[...document.querySelectorAll('[data-admin-jump]')];
 const labels={
 'admin-panel-brand':'Design, logo og farger','admin-panel-budget':'Budsjett og beregning','admin-panel-cards':'Objekter og forsidekort',
 'admin-panel-slides':'Forsidescener','admin-panel-motion':'Animasjoner','animation-studio-panel':'Animation Studio',
 'admin-panel-invest':'Fond og aksjer','admin-panel-catalog':'Funksjoner og nyheter'
 };
 const panelPreviews={'admin-panel-brand':'topp','admin-panel-budget':'budsjett','admin-panel-cards':'topp','admin-panel-slides':'topp','admin-panel-motion':'boligverdi','animation-studio-panel':'topp','admin-panel-invest':'investering','admin-panel-catalog':'topp'};
 const mediaRoutes={home:'topp',loans:'sjekk',budget:'budsjett',receipts:'kvitteringer',valuation:'boligverdi',rental:'utleieanalyse',savings:'sparing',investing:'investering',carloan:'billan',academy:'akademi',currency:'valutakompass'};
 const panelHelp={'admin-panel-brand':'Logo, farger og visningsmodus.','admin-panel-budget':'Flytt budsjettseksjoner og kontroller synlighet.','admin-panel-cards':'Rediger hvert kort og objekt, inkludert ikon, tekst og synlighet.','admin-panel-slides':'Tilpass rekkefølge og tekst på forsiden.','admin-panel-motion':'Velg hvilke animasjoner som vises.','animation-studio-panel':'Velg modul og videofiler, og forhåndsvis resultatet.','admin-panel-invest':'Investeringsoversikt og overskrift.','admin-panel-history':'Se tidspunkt, endringer og gjenopprett en eldre publisering.','admin-panel-catalog':'Opprett funksjonskort som åpner eksisterende verktøy, og skriv nyheter om forbedringene. Alt lagres som utkast.'};
 let panelTransition=false,previewSelection='topp';
 function showPreviewSection(section){
  const selector=$('preview-inline-section'),frame=$('admin-frame');
  if(!selector||![...selector.options].some(option=>option.value===section))return;
  previewSelection=section;selector.value=section;
  $('admin-preview-current').textContent='Viser '+selector.selectedOptions[0].textContent+' · utkast';
  if(ready&&frame?.contentWindow){
   const hash='#'+section;
   if(frame.contentWindow.location.hash!==hash)frame.contentWindow.location.hash=hash;
   frame.contentWindow.postMessage({type:'lanesjekk-cms-preview',config:gather()},location.origin);
  }
 }
 function activatePanel(id,scroll=true){
  const target=$(id);if(!target||!adminPanels.includes(target))return;
  panelTransition=true;
  try{window.sessionStorage.setItem('lanesjekk-studio-active-panel',id)}catch{}
  for(const panel of adminPanels)panel.open=panel===target;
  for(const btn of jumpButtons){
   if(btn.dataset.adminJump===id)btn.setAttribute('aria-current','page');
   else btn.removeAttribute('aria-current');
  }
  $('admin-navigation-tip').textContent=(labels[id]||'Valgt kategori')+' · '+(panelHelp[id]||'Endringer lagres som utkast.');
  panelTransition=false;
  showPreviewSection(id==='animation-studio-panel'?mediaRoutes[$('media-target').value]||'topp':panelPreviews[id]||'topp');
  if(scroll)target.scrollIntoView({behavior:'smooth',block:'start'});
 }
 jumpButtons.forEach(button=>button.addEventListener('click',()=>activatePanel(button.dataset.adminJump)));
 jumpButtons.forEach((button,index)=>button.addEventListener('keydown',event=>{
  const delta={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};
  if(!(event.key in delta)&&event.key!=='Home'&&event.key!=='End')return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?jumpButtons.length-1:
   (index+delta[event.key]+jumpButtons.length)%jumpButtons.length;
  jumpButtons[next].focus();activatePanel(jumpButtons[next].dataset.adminJump,false);
 }));
 adminPanels.forEach(panel=>panel.addEventListener('toggle',()=>{
  if(panel.open&&!panelTransition)activatePanel(panel.id,false);
 }));
 $('preview-inline-section').addEventListener('change',event=>showPreviewSection(event.target.value));
 $('media-target').addEventListener('change',event=>{
  if($('animation-studio-panel').open)showPreviewSection(mediaRoutes[event.target.value]||'topp');
 });
 let initialPanel='admin-panel-brand';
 try{initialPanel=window.sessionStorage.getItem('lanesjekk-studio-active-panel')||initialPanel}catch{}
 activatePanel(adminPanels.some(panel=>panel.id===initialPanel)?initialPanel:'admin-panel-brand',false);
 const queryInput=$('admin-object-search'),resultRoot=$('admin-object-results');
 const lookup=()=>{
  const items=adminPanels.map(panel=>({label:labels[panel.id]||panel.id,panel:panel.id}));
  for(const id of CARD_IDS)items.push({label:(CARD_NAMES[id]||id)+' · rediger objekt, ikon og synlighet',panel:'admin-panel-cards',object:id});
  for(const [id,label] of Object.entries({home:'Forside',loans:'Boliglån',budget:'Budsjett',receipts:'Kvitteringsstudio',valuation:'Boligverdi',rental:'Utleieanalyse',savings:'Sparing',investing:'Fond og aksjer',carloan:'Billån',academy:'Læringsplattform',currency:'Valutakompass'}))items.push({label:label+' · video / animasjon',panel:'animation-studio-panel',media:id});
  for(const [id,label] of Object.entries(SECTION_NAMES))items.push({label:label+' · budsjett',panel:'admin-panel-budget',object:id});
  // Index real Studio controls, including fields that are added later, rather than only top-level panels.
  for(const panel of adminPanels){
   for(const labelEl of panel.querySelectorAll('.admin-body label')){
    const field=labelEl.querySelector('input:not([type="file"]),select,textarea');
    if(!field||field.disabled)continue;
    const title=labelEl.textContent.replace(/\s+/g,' ').trim().slice(0,110);
    if(title.length<3)continue;
    items.push({label:(labels[panel.id]||'Innstilling')+' · '+title,panel:panel.id,field});
   }
  }
  return items;
 };
 function searchObjects(){
  const term=queryInput.value.trim().toLocaleLowerCase('nb-NO');
  resultRoot.replaceChildren();
  if(term.length<2){resultRoot.hidden=true;queryInput.setAttribute('aria-expanded','false');return}
  const matches=lookup().filter(item=>item.label.toLocaleLowerCase('nb-NO').includes(term)).slice(0,16);
  if(!matches.length)resultRoot.append(create('p','Ingen treff. Prøv en annen kategori eller funksjon.','admin-hint'));
  for(const item of matches){
   const result=create('button',item.label,'admin-search-result');result.type='button';
   result.addEventListener('click',()=>{
    activatePanel(item.panel,false);
    if(item.media){
     $('media-target').value=item.media;
     $('media-target').dispatchEvent(new Event('change',{bubbles:true}));
     showPreviewSection(mediaRoutes[item.media]||'topp');
     $('media-title').focus({preventScroll:true});
     $('animation-studio-panel').scrollIntoView({behavior:'smooth',block:'start'});
    }else if(item.object){
     const root=item.panel==='admin-panel-budget'?'budget-sort':'card-sort';
     const target=[...$(root).children].find(el=>el.dataset.id===item.object);
     if(target){
      showPreviewSection(item.panel==='admin-panel-budget'?'budsjett':previewRouteForCard(item.object));
      target.scrollIntoView({behavior:'smooth',block:'center'});
      target.querySelector('input[type="text"],textarea,input[type="checkbox"]')?.focus({preventScroll:true});
     }
    }else if(item.field){
     item.field.scrollIntoView({behavior:'smooth',block:'center'});
     item.field.focus({preventScroll:true});
    }else $(item.panel).scrollIntoView({behavior:'smooth',block:'start'});
    resultRoot.hidden=true;queryInput.value='';queryInput.setAttribute('aria-expanded','false');
   });
   resultRoot.append(result);
  }
  resultRoot.hidden=false;queryInput.setAttribute('aria-expanded','true');
 }
 queryInput.addEventListener('input',searchObjects);
 queryInput.addEventListener('keydown',event=>{
  if(event.key==='Escape'){queryInput.value='';searchObjects();return}
  if(event.key==='ArrowDown'&&!resultRoot.hidden){event.preventDefault();resultRoot.querySelector('button')?.focus();return}
  if(event.key==='Enter'&&!resultRoot.hidden){event.preventDefault();resultRoot.querySelector('button')?.click()}
 });
 resultRoot.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();queryInput.focus();resultRoot.hidden=true;return}
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();
   const items=[...resultRoot.querySelectorAll('button')],index=items.indexOf(document.activeElement);
   items[Math.max(0,Math.min(items.length-1,index+(event.key==='ArrowDown'?1:-1)))]?.focus();
  }
 });
 document.addEventListener('pointerdown',event=>{
  if(!event.target.closest('.admin-object-search-wrap')){resultRoot.hidden=true;queryInput.setAttribute('aria-expanded','false')}
 });
 const accountToggle=$('admin-account-menu-toggle'),accountMenu=$('admin-account-menu');
 accountToggle.addEventListener('click',()=>{
  accountMenu.hidden=!accountMenu.hidden;accountToggle.setAttribute('aria-expanded',String(!accountMenu.hidden));
 });
 $('admin-account-signout').addEventListener('click',()=>$('admin-signout').click());
 document.addEventListener('pointerdown',event=>{
  if(!event.target.closest('#admin-account-wrapper')){accountMenu.hidden=true;accountToggle.setAttribute('aria-expanded','false')}
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
   accountMenu.hidden=true;accountToggle.setAttribute('aria-expanded','false');
   resultRoot.hidden=true;
  }
 });
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||!previewWindow||event.source!==previewWindow)return;
  if(event.data?.type==='lanesjekk-studio-preview-ready'){
   previewWindowReady=true;deliverFullPreview();refreshDashboard();
  }
 });
 let previewRefreshTimer=null;
 function refreshMiniPreview(){
  if(!ready)return;
  const config=gather();
  if($('admin-frame').contentWindow)$('admin-frame').contentWindow.postMessage({type:'lanesjekk-cms-preview',config},location.origin);
  // Full preview also follows edits, unless the user is reviewing a read-only historical version.
  // Live updates never count as a fresh pre-publish sign-off.
  if(!previewPayload)deliverFullPreview();
 }
 const refreshSoon=()=>{
  requestAnimationFrame(refreshDashboard);
  if(previewRefreshTimer)clearTimeout(previewRefreshTimer);
  previewRefreshTimer=setTimeout(refreshMiniPreview,400);
 };
 $('admin-workspace').addEventListener('input',refreshSoon);
 $('admin-workspace').addEventListener('change',refreshSoon);
 $('admin-workspace').addEventListener('click',refreshSoon);
 $('admin-workspace').addEventListener('drop',refreshSoon);
 window.addEventListener('lanesjekk-studio-media-dirty',refreshSoon);
 window.addEventListener('lanesjekk-studio-catalog-changed',refreshSoon);
 $('admin-frame').addEventListener('load',()=>{
  if(ready){
   setTimeout(refreshMiniPreview,120);
   if(previewSelection!=='topp')setTimeout(()=>showPreviewSection(previewSelection),180);
  }
 });
 window.addEventListener('beforeunload',event=>{
  if(!ready||!published||!draft||!collectChanges().length)return;
  event.preventDefault();event.returnValue='';
 });
 $('admin-restore').addEventListener('click',()=>{if(published){draft=clone(published);render();lastPreviewFingerprint='';refreshDashboard();$('admin-frame').src='./index.html#topp';msg('Utkastet er nullstilt til sist publiserte versjon.')}} );
 const setPreviewDevice=mode=>{
  $('preview-viewport').classList.toggle('mobile',mode==='mobile');
  $('preview-viewport').classList.toggle('tablet',mode==='tablet');
  for(const [id,m] of [['preview-desktop','desktop'],['preview-tablet','tablet'],['preview-mobile','mobile']])$(id).setAttribute('aria-pressed',String(m===mode));
 };
 $('preview-mobile').addEventListener('click',()=>setPreviewDevice('mobile'));
 $('preview-tablet').addEventListener('click',()=>setPreviewDevice('tablet'));
 $('preview-desktop').addEventListener('click',()=>setPreviewDevice('desktop'));
 $('preview-refresh').addEventListener('click',()=>{
  const config=gather();
  const frame=$('admin-frame');
  frame.src='./index.html#'+previewSelection;
  frame.addEventListener('load',()=>frame.contentWindow?.postMessage({type:'lanesjekk-cms-preview',config},location.origin),{once:true});
  msg('Minivisningen viser nå det gjeldende utkastet. Ingenting er publisert.');
 });
 const inlineFullscreen=$('preview-inline-fullscreen');
 inlineFullscreen.addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await $('admin-preview-panel').requestFullscreen()}
  catch(e){msg('Fullskjerm er ikke tillatt her. Prøv «Åpne hele nettsiden i eget vindu».',true)}
 });
 document.addEventListener('fullscreenchange',()=>{
  const full=document.fullscreenElement===$('admin-preview-panel');
  inlineFullscreen.textContent=full?'⛶ Avslutt fullskjerm (Esc)':'⛶ Fullskjerm';
  inlineFullscreen.setAttribute('aria-pressed',String(full));
 });
 $('site-logo-reset').addEventListener('click',()=>{draft.brand.logoUrl='';$('site-logo').value='';$('site-logo-preview').hidden=true;msg('Standardlogo er valgt i utkastet.')});
 $('site-logo').addEventListener('change',e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>2097152||!file.type.startsWith('image/')){msg('Velg en PNG-, JPEG- eller WebP-fil på maks 2 MB.',true);return}
  const url=URL.createObjectURL(file);$('site-logo-preview').src=url;$('site-logo-preview').hidden=false;
  $('site-logo-preview').onload=()=>URL.revokeObjectURL(url);
 });
 const recovery=$('admin-password-recovery');let recoveryMode=false;
 const showRecovery=()=>{recoveryMode=true;recovery.hidden=false;$('admin-auth').hidden=true;$('admin-workspace').hidden=true;};
 const recoveryHash=new URLSearchParams(location.hash.slice(1));
 const recoveryQuery=new URLSearchParams(location.search);
 const linkError=recoveryHash.get('error_code')||recoveryQuery.get('error_code')||recoveryHash.get('error')||recoveryQuery.get('error');
 if(linkError){
  $('auth-status').textContent='Passordlenken er ugyldig eller utløpt. Trykk «Glemt passord?» og bestill en ny lenke.';
  history.replaceState(null,'',location.pathname);
 }
 db.auth.onAuthStateChange(event=>{
  if(event==='PASSWORD_RECOVERY'){showRecovery();return}
  if(!recoveryMode)setTimeout(check,0)
 });
 if(!linkError&&(recoveryHash.get('type')==='recovery'||recoveryQuery.get('type')==='recovery'||recoveryQuery.has('code')))showRecovery();
 const newPass=$('admin-new-password'),repeatPass=$('admin-repeat-password'),strength=$('admin-password-strength'),strengthBar=$('admin-password-strength-bar'),match=$('admin-password-match');
 const updatePasswordGuidance=()=>{
  const length=newPass.value.length,repeat=repeatPass.value;
  const met=length>=8;strengthBar.style.width=Math.min(100,length/12*100)+'%';
  strengthBar.dataset.valid=String(met);
  strength.textContent=length===0?'Minst 8 tegn – anbefalt 12 eller flere.':!met?'Legg til '+(8-length)+' tegn for å oppfylle minstekravet.':length<12?'Minstekravet på 8 tegn er oppfylt. 12 eller flere anbefales.':'Lengdeanbefalingen er oppfylt. Bruk et unikt passord.';
  match.textContent=!repeat?'Skriv inn det samme passordet på nytt.':repeat===newPass.value?'Passordene er like.':'Passordene er ikke like.';
  match.dataset.matches=String(!!repeat&&repeat===newPass.value);
 };
 newPass.addEventListener('input',updatePasswordGuidance);
 repeatPass.addEventListener('input',updatePasswordGuidance);
 recovery.querySelectorAll('[data-password-toggle]').forEach(button=>{
  button.addEventListener('click',()=>{
   const input=$(button.dataset.passwordToggle),revealed=input.type==='password';
   input.type=revealed?'text':'password';
   button.textContent=revealed?'Skjul':'Vis';
   button.setAttribute('aria-pressed',String(revealed));
   button.setAttribute('aria-label',(revealed?'Skjul':'Vis')+' '+(input===newPass?'nytt passord':'bekreftelse av passord'));
   input.focus({preventScroll:true});
  })
 });
 updatePasswordGuidance();
 $('admin-recovery-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const pass=newPass.value,again=repeatPass.value,out=$('admin-recovery-status');
  if(pass.length<8){out.textContent='Passordet må inneholde minst 8 tegn.';newPass.focus();return}
  if(pass!==again){out.textContent='Passordene er ikke like.';repeatPass.focus();return}
  const btn=$('admin-recovery-save');btn.disabled=true;
  try{
   const {data,error:sessionError}=await db.auth.getSession();
   if(sessionError||!data?.session){out.textContent='Passordlenken er ikke gyldig lenger. Åpne innloggingen og be om en ny lenke.';return}
   const {error}=await db.auth.updateUser({password:pass});
   if(error){out.textContent='Kunne ikke lagre passord: '+error.message;return}
   out.textContent='Passordet er oppdatert. Du kan nå logge inn med det nye passordet.';
   await db.auth.signOut();
   recoveryMode=false;recovery.hidden=true;$('admin-auth').hidden=false;
   newPass.value='';repeatPass.value='';newPass.type='password';repeatPass.type='password';
   recovery.querySelectorAll('[data-password-toggle]').forEach(button=>{button.textContent='Vis';button.setAttribute('aria-pressed','false')});
   updatePasswordGuidance();
   history.replaceState(null,'',location.pathname);$('admin-password').value='';
  }catch(e){out.textContent='Kunne ikke tilbakestille passordet. Be om en ny lenke.'}
  finally{btn.disabled=false}
 });
 if(!recoveryMode)check();
}
document.addEventListener('DOMContentLoaded',boot);
})();