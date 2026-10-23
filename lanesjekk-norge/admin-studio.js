/* Lånesjekk Studio. Supabase RLS and triggers enforce admin writes server-side.
 * No privileged keys in browser. Draft edits never stored until Publish.
 */
(()=>{'use strict';
const BASE='https://pryrgwfjniggjlrizenh.supabase.co',KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const $=id=>document.getElementById(id);
const DEFAULT_IDS=['quick','hero','stats','workbook','insights'];
const SECTION_NAMES={quick:'Månedsplan + handlingsknapper',hero:'Budsjettets overskrift',stats:'Resultat og nøkkeltall',workbook:'Redigerbart regneark',insights:'Grafer og økonomiske analyser'};
const CARD_IDS=['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti'];
const CARD_NAMES={kvitteringer:'Kvitteringsstudio',utleie:'Utleieanalyse',budsjett:'Personlig budsjett',billan:'Billån',forbrukslan:'Forbrukslån',akademi:'Læringsplattform',sparing:'Sparing',sjekk:'Boliglån',banker:'Bankoversikt','offisielle-renter':'Offisielle renter',bsu:'BSU',ask:'ASK',ips:'IPS',innskuddsgaranti:'Innskuddsgaranti'};
const CARDS_DEFAULT=['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti'];
let db=null,authUser=null,published=null,draft=null,revision=0,ready=false,busy=false;
const create=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);if(cls)n.className=cls;return n};
const msg=(value,error=false,target='admin-message')=>{const n=$(target);n.textContent=value;n.classList.toggle('error',error)};
const clamp=(str,max)=>String(str??'').trim().slice(0,max);
function clone(data){return JSON.parse(JSON.stringify(data))}
function normalize(data){
 const src=data&&typeof data==='object'?data:{},budget=src.budget||{},brand=src.brand||{},cards=src.cards||{};
 const order=[...new Set([...(Array.isArray(budget.order)?budget.order.filter(x=>DEFAULT_IDS.includes(x)):[]),...DEFAULT_IDS])];
 const cardOrder=[...new Set([...(Array.isArray(cards.order)?cards.order.filter(x=>CARD_IDS.includes(x)):[]),...CARDS_DEFAULT])];
 return {
 brand:{name:clamp(brand.name||'LÅNESJEKK NORGE',70),tagline:clamp(brand.tagline||'Mer oversikt. Bedre valg.',130),accent:/^#[0-9A-Fa-f]{6}$/.test(brand.accent)?brand.accent:'#0c8878',logoUrl:clamp(brand.logoUrl,500),heroVisual:brand.heroVisual!==false,heroMotion:brand.heroMotion!==false},
 budget:{order,visible:Object.fromEntries(DEFAULT_IDS.map(id=>[id,id==='workbook'?true:budget.visible?.[id]!==false])),
 title:clamp(budget.title||'Ditt budsjett.',90),subtitle:clamp(budget.subtitle||'Din økonomiske kontroll.',120),
 quickTitle:clamp(budget.quickTitle||'Tre steg til økonomisk oversikt',100)},
 investing:{title:clamp(src.investing?.title||'Fond og aksjer – forstå risiko og muligheter',110)},
 cards:{order:cardOrder,appearance:Object.fromEntries(CARD_IDS.map(id=>{
 const appearance=cards.appearance?.[id]||{};
 return [id,{title:clamp(appearance.title,85),description:clamp(appearance.description,200),
 icon:clamp(appearance.icon,12),tone:['mint','blue','violet','peach'].includes(appearance.tone)?appearance.tone:'mint',
 visible:appearance.visible!==false,imageUrl:clamp(appearance.imageUrl,500)}];
 }))}
 };
}
async function isAuthorized(){
 const {data,error}=await db.auth.getUser();
 if(error||!data?.user)return false;
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
 if(ok&&!ready)await loadPublished();
}
async function login(e){
 e.preventDefault();
 const submit=$('admin-login');submit.disabled=true;msg('Kontrollerer innlogging …',false,'auth-status');
 const {error}=await db.auth.signInWithPassword({email:$('admin-email').value.trim(),password:$('admin-password').value});
 submit.disabled=false;
 if(error){msg('Innlogging feilet: '+error.message+'. Hvis e-postadressen ikke er bekreftet, må den bekreftes under Supabase Authentication.',true,'auth-status');return}
 if(!(await isAuthorized())){await db.auth.signOut();msg('Kontoen har ikke administratorrettigheter i databasen.',true,'auth-status');return}
 await check();
}
async function loadPublished(){
 const r=await db.from('lanesjekk_site_config').select('config,revision,updated_at').eq('id',1).maybeSingle();
 if(r.error||!r.data){msg('Kunne ikke hente nettstedinnstillinger: '+(r.error?.message||'Ingen data'),true);return}
 published=normalize(r.data.config);draft=clone(published);revision=r.data.revision||1;ready=true;
 $('admin-revision').textContent='Publisert versjon '+revision;
 render();await loadRevisions();
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
 actions.append(up,down);
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
  check.type='checkbox';check.checked=type==='budget'?draft.budget.visible[id]:appearance.visible;
  if(type==='budget'&&id==='workbook'){check.disabled=true;check.title='Budsjettarket må være tilgjengelig'}
  check.onchange=()=>{if(type==='budget')draft.budget.visible[id]=check.checked;else appearance.visible=check.checked};
  toggle.append(check,create('span','Vis på nettsiden'));main.append(toggle);
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
function render(){
 $('site-name').value=draft.brand.name;
 $('site-tagline').value=draft.brand.tagline;
 $('site-color').value=draft.brand.accent;
 $('site-hero-visual').checked=draft.brand.heroVisual!==false;
 $('site-hero-motion').checked=draft.brand.heroMotion!==false;
 $('budget-title').value=draft.budget.title;
 $('budget-subtitle').value=draft.budget.subtitle;
 $('budget-quick-title').value=draft.budget.quickTitle;
 $('invest-title').value=draft.investing.title;
 $('site-logo-preview').hidden=!draft.brand.logoUrl;
 if(draft.brand.logoUrl)$('site-logo-preview').src=draft.brand.logoUrl;
 renderSort('budget');renderSort('cards');
}
function gather(){
 draft.brand.name=clamp($('site-name').value,70)||'LÅNESJEKK NORGE';
 draft.brand.tagline=clamp($('site-tagline').value,130);
 draft.brand.accent=$('site-color').value;
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
 busy=on;$('admin-publish').disabled=on;$('admin-preview').disabled=on;
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
 if(busy||!authUser)return;
 const config=gather();statusDisabled(true);msg('Publiserer nettsiden …');
 try{
  const logo=$('site-logo').files?.[0];if(logo)config.brand.logoUrl=await upload(logo);
  for(const node of document.querySelectorAll('[data-upload-card]')){
   const file=node.files?.[0];if(file)config.cards.appearance[node.dataset.uploadCard].imageUrl=await upload(file);
  }
  const {data,error}=await db.from('lanesjekk_site_config')
   .update({config}).eq('id',1).eq('revision',revision)
   .select('revision').maybeSingle();
  if(error)throw error;
  if(!data)throw Error('En annen administrator publiserte endringer i mellomtiden. Oppdater redigeringspanelet og prøv igjen.');
  published=normalize(config);draft=clone(published);revision=data.revision;
  $('site-logo').value='';$('admin-revision').textContent='Publisert versjon '+revision;
  render();await loadRevisions();
  $('admin-frame').src='./index.html#topp';
  msg('Publisert! Alle besøkende ser endringen når de laster nettsiden på nytt. Revisjon '+revision+'.');
 }catch(e){msg('Kunne ikke publisere: '+(e?.message||String(e)),true)}
 finally{statusDisabled(false)}
}
async function loadRevisions(){
 const root=$('admin-history');root.replaceChildren();
 const r=await db.from('lanesjekk_site_revisions').select('id,revision,snapshot,changed_at').order('revision',{ascending:false}).limit(15);
 if(r.error){root.append(create('p','Historikk kunne ikke lastes: '+r.error.message));return}
 if(!r.data?.length){root.append(create('p','Ingen tidligere publiseringer.'));return}
 for(const revision of r.data){
  const row=create('div',undefined,'admin-history-row');
  const label=create('span','Revisjon '+revision.revision+' · '+new Intl.DateTimeFormat('nb-NO',{dateStyle:'short',timeStyle:'short'}).format(new Date(revision.changed_at)));
  const button=create('button','Hent som utkast','admin-secondary');button.type='button';button.onclick=()=>{
   draft=normalize(revision.snapshot);render();showPreview();msg('Tidligere revisjon er hentet som et utkast. Velg «Publiser permanent» for å gjenopprette den for alle.');
  };row.append(label,button);root.append(row);
 }
}
function boot(){
 if(!window.supabase){msg('Supabase-biblioteket kunne ikke lastes. Kontroller innholdsblokkering.',true,'auth-status');return}
 db=window.supabase.createClient(BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 $('admin-login-form').addEventListener('submit',login);
 $('admin-signout').addEventListener('click',async()=>{
  await db.auth.signOut();authUser=null;ready=false;published=null;draft=null;await check();
 });
 $('admin-preview').addEventListener('click',showPreview);
 $('admin-publish').addEventListener('click',publish);
 $('admin-restore').addEventListener('click',()=>{if(published){draft=clone(published);render();$('admin-frame').src='./index.html#topp';msg('Utkastet er nullstilt til sist publiserte versjon.')}} );
 $('preview-mobile').addEventListener('click',()=>$('preview-viewport').classList.add('mobile'));
 $('preview-desktop').addEventListener('click',()=>$('preview-viewport').classList.remove('mobile'));
 $('preview-refresh').addEventListener('click',()=>{$('admin-frame').src='./index.html#topp';msg('Forhåndsvisningen er oppdatert – bare publisert design vises.');});
 $('site-logo-reset').addEventListener('click',()=>{draft.brand.logoUrl='';$('site-logo').value='';$('site-logo-preview').hidden=true;msg('Standardlogo er valgt i utkastet.')});
 $('site-logo').addEventListener('change',e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>2097152||!file.type.startsWith('image/')){msg('Velg en PNG-, JPEG- eller WebP-fil på maks 2 MB.',true);return}
  const url=URL.createObjectURL(file);$('site-logo-preview').src=url;$('site-logo-preview').hidden=false;
  $('site-logo-preview').onload=()=>URL.revokeObjectURL(url);
 });
 db.auth.onAuthStateChange(()=>{setTimeout(check,0)});
 check();
}
document.addEventListener('DOMContentLoaded',boot);
})();