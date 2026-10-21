/* PrisKart admin: Supabase RLS enforces all admin operations server side.
 * Browser only has a public publishable key; never a service_role key. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const URL='https://pryrgwfjniggjlrizenh.supabase.co',KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
let db=null,user=null,isAdmin=false,operatorNames=[],stationOffset=0,stationCount=0,searchTimer=0,activeEditor=null,busy=false;
const pageSize=50;
const note=(message,error=false,target='admin-message')=>{const el=$(target);if(!el)return;el.textContent=message;el.classList.toggle('error',error)};
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=String(text);if(cls)x.className=cls;return x};
const nf=new Intl.NumberFormat('nb-NO');
const time=x=>x?new Intl.DateTimeFormat('nb-NO',{dateStyle:'short',timeStyle:'short'}).format(new Date(x)):'Ukjent tid';
function showTab(tab){
 document.querySelectorAll('button[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 for(const n of ['stations','reports','operators','appearance','faq','sources'])$('panel-'+n).hidden=n!==tab;
 if(tab==='reports')loadReports();
 if(tab==='operators')loadOperators();
 if(tab==='appearance')loadAppearance();
 if(tab==='faq')loadFaqAdmin();
}
function logoutUI(){
 $('admin-app').hidden=true;$('auth-section').hidden=false;
}
async function checkAuth(){
 if(!db){note('Supabase-koden kunne ikke lastes. Kontroller nettleserens skriptblokkering.',true,'auth-message');return}
 const {data,error}=await db.auth.getUser();
 if(error||!data.user){user=null;logoutUI();note('Logg inn med administratorkontoen.',false,'auth-message');return}
 user=data.user;
 const result=await db.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(result.error||!result.data){isAdmin=false;logoutUI();note('Du er innlogget, men denne kontoen er ikke oppført som administrator. Kontakt prosjektets eier.',true,'auth-message');return}
 isAdmin=true;
 $('admin-app').hidden=false;$('auth-section').hidden=true;
 $('admin-account').textContent='Innlogget som '+(user.email||'administrator');
 await Promise.all([loadStats(),loadStations(true),loadOperators()]);
}
async function login(){
 const email=$('admin-email').value.trim(),password=$('admin-password').value;
 if(!email||!password){note('Oppgi e-post og passord, eller velg «Send lenke».',true,'auth-message');return}
 $('admin-login').disabled=true;
 const {error}=await db.auth.signInWithPassword({email,password});
 $('admin-login').disabled=false;
 if(error){note('Kunne ikke logge inn: '+error.message,true,'auth-message');return}
 await checkAuth();
}
let adminEmailNextAllowedAt=0;
async function loginLink(){
 if(Date.now()<adminEmailNextAllowedAt){note('Vent litt før du bestiller en ny e-post. Bruk passord hvis du allerede har det.',true,'auth-message');return;}
 adminEmailNextAllowedAt=Date.now()+120000;
 const email=$('admin-email').value.trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){note('Skriv en gyldig e-postadresse.',true,'auth-message');return}
 $('admin-email-link').disabled=true;
 const {error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:'https://priskart-admin-live.vercel.app/',shouldCreateUser:false}});
 $('admin-email-link').disabled=false;
 note(error?(/rate limit|too many/i.test(error.message||'')?'Supabase stopper flere e-poster. Egen SMTP må kobles til før e-postinnlogging fungerer stabilt.':'Kunne ikke sende e-post: '+error.message):'Én innloggingslenke er sendt. Bruk den nyeste lenken før den utløper.',!!error,'auth-message');
}
async function loadStats(){
 if(!isAdmin)return;
 const opts={count:'exact',head:true};
 const [all,fuel,charge,rep]=await Promise.all([
  db.from('stations').select('id',opts),
  db.from('stations').select('id',opts).eq('kind','fuel'),
  db.from('stations').select('id',opts).eq('kind','charge'),
  db.from('price_reports').select('id',opts)
 ]);
 for(const [id,data] of [['st-total',all],['st-fuel',fuel],['st-charge',charge],['st-reports',rep]])
  $(id).textContent=typeof data.count==='number'?nf.format(data.count):'–';
}
async function loadStations(reset=false){
 if(!isAdmin)return;
 if(reset)stationOffset=0;
 const kind=$('station-kind').value,q=$('station-search').value.trim().replace(/[(),%]/g,' ').slice(0,65);
 let req=db.from('stations').select('id,name,kind,operator,lat,lon,address,power_kw,connectors,status,source',{count:'exact'});
 if(kind==='fuel'||kind==='charge')req=req.eq('kind',kind);
 if(kind==='hidden')req=req.eq('status','hidden');
 if(q)req=req.or('name.ilike.%'+q+'%,operator.ilike.%'+q+'%');
 const {data,error,count}=await req.order('name',{ascending:true}).range(stationOffset,stationOffset+pageSize-1);
 if(error){note('Stasjonssøk feilet: '+error.message,true);return}
 stationCount=count??0;
 const root=$('station-list');if(reset)root.replaceChildren();
 for(const station of data||[]){
  const card=el('div',undefined,'item'),left=el('div'),buttons=el('div',undefined,'btns');
  left.append(el('strong',(station.kind==='charge'?'⚡ ':'⛽ ')+station.name),
    el('p',(station.operator||'Andre')+' · '+(station.address||'Ukjent adresse')+' · '+(station.status==='hidden'?'SKJULT':'Synlig')+' · '+(station.source||'admin')));
  const edit=el('button','Rediger');
  edit.addEventListener('click',()=>openEditor(station));
  const toggle=el('button',station.status==='hidden'?'Vis på kart':'Skjul','danger');
  toggle.addEventListener('click',async()=>{
   if(!isAdmin)return;
   const next=station.status==='hidden'?'active':'hidden';
   const {error}=await db.from('stations').update({status:next,updated_at:new Date().toISOString()}).eq('id',station.id);
   note(error?'Endringen mislyktes: '+error.message:'Stasjonen er nå '+(next==='active'?'synlig':'skjult')+'.',!!error);
   if(!error){loadStations(true);loadStats()}
  });
  buttons.append(edit,toggle);card.append(left,buttons);root.append(card);
 }
 if(reset&&!data?.length)root.append(el('p','Ingen stasjoner funnet. Prøv en annen søketekst.','note'));
 stationOffset+=data?.length||0;
 $('station-next').disabled=stationOffset>=stationCount;
 $('station-page').textContent=nf.format(Math.min(stationOffset,stationCount))+' av '+nf.format(stationCount)+' stasjoner';
 $('station-info').textContent='Velg Rediger for å oppdatere stasjonsinformasjonen.';
}
function openEditor(item){
 $('station-editor').hidden=false;activeEditor=item||null;
 $('editor-heading').textContent=item?'Rediger stasjon':'Legg til stasjon';
 $('edit-id').value=item?.id||'';
 $('edit-name').value=item?.name||'';
 $('edit-kind').value=item?.kind||'fuel';
 $('edit-kind').disabled=!!item;
 $('edit-operator').value=item?.operator||'';
 $('edit-lat').value=item?.lat??'';
 $('edit-lon').value=item?.lon??'';
 $('edit-address').value=item?.address||'';
 $('edit-power').value=item?.power_kw??'';
 $('edit-connectors').value=Array.isArray(item?.connectors)?item.connectors.join(', '):'';
 $('edit-status').value=item?.status||'active';
 $('station-editor').scrollIntoView({behavior:'smooth',block:'start'});
}
async function saveStation(event){
 event.preventDefault();
 if(busy||!isAdmin)return;
 const type=$('edit-kind').value,name=$('edit-name').value.trim(),lat=Number($('edit-lat').value),lon=Number($('edit-lon').value),kw=$('edit-power').value?Number($('edit-power').value):null;
 if(name.length<2||!Number.isFinite(lat)||!Number.isFinite(lon)||lat<57||lat>72||lon<4||lon>32){
  note('Kontroller stasjonsnavn og geografiske koordinater.',true);return
 }
 if(kw!==null&&(!Number.isFinite(kw)||kw<=0||kw>1500)){note('Ladeeffekten må være positiv og maksimalt 1500 kW.',true);return}
 const connectors=$('edit-connectors').value.split(',').map(v=>v.trim()).filter(Boolean).slice(0,20);
 const patch={name,kind:type,operator:$('edit-operator').value.trim()||'Andre',
 lat,lon,address:$('edit-address').value.trim(),connectors,power_kw:type==='charge'?kw:null,
 status:$('edit-status').value,updated_at:new Date().toISOString()};
 busy=true;$('save-station').disabled=true;
 let error;
 if(activeEditor){
  const result=await db.from('stations').update(patch).eq('id',activeEditor.id);error=result.error;
 }else{
  patch.id='admin:'+crypto.randomUUID();patch.source='admin';
  const result=await db.from('stations').insert(patch);error=result.error;
 }
 busy=false;$('save-station').disabled=false;
 if(error){note('Kunne ikke lagre: '+error.message,true);return}
 $('station-editor').hidden=true;note('Stasjonen er lagret. Endringen vises på det offentlige kartet ved neste oppdatering.');
 await Promise.all([loadStations(true),loadStats()]);
}
async function loadReports(){
 if(!isAdmin)return;
 const root=$('report-list');root.textContent='Henter prisrapporter …';
 const {data,error}=await db.from('price_reports').select('id,station_id,product_code,price,note,status,created_at,stations(name,kind)').order('created_at',{ascending:false}).limit(80);
 root.replaceChildren();
 if(error){note('Prisrapportene kan ikke hentes: '+error.message,true);return}
 for(const p of data||[]){
  const box=el('div',undefined,'item'),left=el('div'),buttons=el('div',undefined,'btns');
  const name=p.stations?.name||p.station_id;
  left.append(el('strong',(p.stations?.kind==='charge'?'⚡ ':'⛽ ')+name),
    el('div',Number(p.price).toLocaleString('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2})+' kr '+(p.stations?.kind==='charge'?'/kWh':'/liter'),'reportprice'),
    el('p',(p.product_code||'').toUpperCase()+' · '+time(p.created_at)+' · Status: '+p.status));
  if(p.note)left.append(el('p',p.note));
  const btn=el('button',p.status==='approved'?'Avvis pris':'Godkjenn pris',p.status==='approved'?'danger':'');
  btn.addEventListener('click',async()=>{
   const next=p.status==='approved'?'rejected':'approved';
   const {error}=await db.from('price_reports').update({status:next}).eq('id',p.id);
   note(error?'Endringen feilet: '+error.message:'Prisen er '+(next==='approved'?'godkjent':'avvist')+'.',!!error);
   if(!error){loadReports();loadStats()}
  });
  buttons.append(btn);box.append(left,buttons);root.append(box);
 }
 if(!data?.length)root.append(el('div','Det finnes ingen innmeldte priser ennå.','note'));
}
async function loadOperators(){
 if(!isAdmin)return;
 const {data,error}=await db.from('operators').select('id,name,kind,active').order('name');
 if(error){note('Operatører kunne ikke lastes: '+error.message,true);return}
 operatorNames=data||[];
 const options=$('operator-options');options.replaceChildren();
 for(const p of operatorNames){const opt=el('option');opt.value=p.name;options.append(opt)}
 const root=$('operator-list');root.replaceChildren();
 for(const p of operatorNames){
  const row=el('div',undefined,'item'),left=el('div'),buttons=el('div',undefined,'btns');
  left.append(el('strong',p.name),el('p',(p.kind==='both'?'Bensin og lading':p.kind==='charge'?'Lading':'Drivstoff')+' · '+(p.active?'Aktiv':'Skjult')));
  const b=el('button',p.active?'Deaktiver':'Aktiver',p.active?'danger':'');
  b.onclick=async()=>{
   const {error}=await db.from('operators').update({active:!p.active}).eq('id',p.id);
   note(error?error.message:'Leverandøren er oppdatert.',!!error);if(!error)loadOperators();
  };
  buttons.append(b);row.append(left,buttons);root.append(row);
 }
}
async function addOperator(){
 const name=$('new-operator').value.trim(),kind=$('operator-kind').value;
 if(name.length<2||name.length>100){note('Skriv et leverandørnavn på 2–100 tegn.',true);return}
 const {error}=await db.from('operators').insert({name,kind,active:true});
 note(error?'Kunne ikke legge til: '+error.message:'Operatøren er lagt til.',!!error);
 if(!error){$('new-operator').value='';await loadOperators()}
}

const settingMap={
 'site-name':'brand_name','site-tagline':'tagline','site-title':'hero_title','site-description':'hero_description',
 'site-color':'accent_color','site-sidebar':'desktop_sidebar','site-density':'desktop_density',
 'site-notice':'public_notice','site-operator':'operator_name','site-org':'organization_number','site-contact':'contact_email'
};
const checkMap={
 'site-show-fuel':'show_fuel','site-show-charging':'show_charging','site-show-near':'show_near_me',
 'site-show-cities':'show_city_shortcuts','site-show-faq':'show_faq','site-show-intro':'show_intro','site-show-notice':'show_notice'
};
let currentSite=null;
async function loadAppearance(){
 if(!isAdmin)return;
 const {data,error}=await db.from('site_settings').select('*').eq('id',1).maybeSingle();
 if(error){note('Kan ikke laste nettstedinnstillinger: '+error.message,true);return}
 currentSite=data||null;
 if(!data){note('Nettstedinnstillinger mangler i databasen.',true);return}
 for(const [id,key] of Object.entries(settingMap))$(id).value=data[key]??'';
 for(const [id,key] of Object.entries(checkMap))$(id).checked=Boolean(data[key]);
 $('site-logo-preview').hidden=!data.logo_url;
 if(data.logo_url)$('site-logo-preview').src=data.logo_url;
}
async function uploadSiteLogo(){
 const input=$('site-logo'),file=input.files?.[0];
 if(!file)return currentSite?.logo_url||'';
 const types=['image/jpeg','image/png','image/webp'];
 if(!types.includes(file.type)||file.size>2097152)throw Error('Logo må være PNG, JPEG eller WebP og maks 2 MB');
 const extension=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const name='logo-'+crypto.randomUUID()+'.'+extension;
 const {error}=await db.storage.from('site-assets').upload(name,file,{upsert:false,cacheControl:'3600',contentType:file.type});
 if(error)throw error;
 return db.storage.from('site-assets').getPublicUrl(name).data.publicUrl;
}
async function saveAppearance(e){
 e.preventDefault();if(!isAdmin)return;
 const patch={id:1};
 for(const [id,key] of Object.entries(settingMap))patch[key]=$(id).value.trim();
 for(const [id,key] of Object.entries(checkMap))patch[key]=$(id).checked;
 const org=patch.organization_number.replace(/\s/g,'');
 if(org&&!/^\d{9}$/.test(org)){note('Organisasjonsnummer må ha 9 siffer, eller stå tomt.',true);return}
 patch.organization_number=org;
 if(!patch.show_fuel&&!patch.show_charging){note('Minst én kategori (drivstoff eller lading) må være synlig.',true);return}
 const btn=$('save-appearance');btn.disabled=true;note('Lagrer nettstedinnstillinger …');
 try{
  patch.logo_url=await uploadSiteLogo();
  patch.updated_at=new Date().toISOString();
  const {error}=await db.from('site_settings').upsert(patch,{onConflict:'id'});
  if(error)throw error;
  currentSite={...patch};note('Endringene er lagret. Last inn kartet på nytt for å se oppdatert logo, farger og layout.');
  $('site-logo').value='';
  $('site-logo-preview').hidden=!patch.logo_url;
  if(patch.logo_url)$('site-logo-preview').src=patch.logo_url;
 }catch(error){note('Kunne ikke lagre designendringer: '+error.message,true)}
 finally{btn.disabled=false}
}
function resetFaq(){
 $('faq-id').value='';$('faq-question').value='';$('faq-answer').value='';
 $('faq-order').value='100';$('faq-published').checked=true;
}
async function loadFaqAdmin(){
 if(!isAdmin)return;
 const {data,error}=await db.from('site_faq').select('*').order('sort_order').order('question');
 const root=$('faq-admin-list');root.replaceChildren();
 if(error){note('FAQ-feil: '+error.message,true);return}
 for(const q of data||[]){
  const card=el('div',undefined,'item'),left=el('div'),btns=el('div',undefined,'btns');
  left.append(el('strong',(q.published?'':'(Skjult) ')+q.question),el('p',q.answer.slice(0,230)),el('p','Rekkefølge: '+q.sort_order));
  const edit=el('button','Rediger');
  edit.addEventListener('click',()=>{
   $('faq-id').value=q.id;$('faq-question').value=q.question;$('faq-answer').value=q.answer;
   $('faq-order').value=q.sort_order;$('faq-published').checked=q.published;
   $('faq-form').scrollIntoView({behavior:'smooth',block:'start'});
  });
  const del=el('button','Slett','danger');
  del.addEventListener('click',async()=>{
   if(!confirm('Vil du slette spørsmålet "'+q.question+'"?'))return;
   const {error}=await db.from('site_faq').delete().eq('id',q.id);
   note(error?'FAQ ble ikke slettet: '+error.message:'FAQ-spørsmålet er slettet.',!!error);
   if(!error){resetFaq();loadFaqAdmin()}
  });
  btns.append(edit,del);card.append(left,btns);root.append(card);
 }
 if(!data?.length)root.append(el('p','Ingen spørsmål registrert.','note'));
}
async function saveFaq(e){
 e.preventDefault();if(!isAdmin)return;
 const data={
  question:$('faq-question').value.trim(),answer:$('faq-answer').value.trim(),
  sort_order:Number($('faq-order').value)||100,published:$('faq-published').checked,updated_at:new Date().toISOString()
 };
 const id=$('faq-id').value;
 const result=id?await db.from('site_faq').update(data).eq('id',id):await db.from('site_faq').insert(data);
 note(result.error?'Kunne ikke lagre FAQ: '+result.error.message:'FAQ er lagret og publisert.',!!result.error);
 if(!result.error){resetFaq();loadFaqAdmin()}
}

function events(){
 $('admin-login').addEventListener('click',login);
 $('admin-email-link').addEventListener('click',loginLink);
 $('admin-password').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
 $('admin-logout').addEventListener('click',async()=>{await db.auth.signOut();user=null;isAdmin=false;logoutUI()});
 document.querySelectorAll('button[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
 $('station-search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>loadStations(true),350)});
 $('station-kind').addEventListener('change',()=>loadStations(true));
 $('station-next').addEventListener('click',()=>loadStations(false));
 $('add-station').addEventListener('click',()=>openEditor(null));
 $('cancel-edit').addEventListener('click',()=>{$('station-editor').hidden=true});
 $('station-form').addEventListener('submit',saveStation);
 $('report-reload').addEventListener('click',loadReports);
 $('add-operator').addEventListener('click',addOperator);
 $('appearance-form').addEventListener('submit',saveAppearance);
 $('faq-form').addEventListener('submit',saveFaq);
 $('faq-reset').addEventListener('click',resetFaq);
}
async function init(){
 if(!window.supabase){note('Innloggingsbiblioteket kunne ikke lastes. Prøv å deaktivere innholdsblokkering for denne siden.',true,'auth-message');return}
 db=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 events();
 db.auth.onAuthStateChange(()=>{setTimeout(checkAuth,0)});
 await checkAuth();
}
init();
})();