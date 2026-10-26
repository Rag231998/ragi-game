(()=>{'use strict';
const panel=document.getElementById('ln-assistant-panel'),conversation=window.LNAssistantConversation;
if(!panel||!conversation)return;
const KEY='lanesjekk-chat-history-v1',CUR='lanesjekk-chat-current-v1',CONSENT='lanesjekk-chat-storage-consent-v1',KEEP=15,AGE=60*86400000;
let storageAllowed=false;try{storageAllowed=localStorage.getItem(CONSENT)==='yes'}catch{}
const uuid=()=>('chat-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
function load(){try{const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(parsed))return[];return parsed.filter(x=>x&&typeof x.id==='string'&&Array.isArray(x.turns)&&Number(x.updated)>Date.now()-AGE).slice(0,KEEP)}catch{return[]}}
let entries=storageAllowed?load():[],currentId=(()=>{if(!storageAllowed)return uuid();try{return localStorage.getItem(CUR)||uuid()}catch{return uuid()}})(),suspend=false;
const toolbar=document.createElement('div');toolbar.className='ln-chat-toolbar';
toolbar.innerHTML='<button type="button" id="ln-chat-new" title="Arkiver denne og start en ny samtale"><span aria-hidden="true">＋</span> Ny chat</button><button type="button" id="ln-chat-list" aria-expanded="false" aria-controls="ln-chat-history"><span aria-hidden="true">☷</span> Samtaler</button>';
panel.querySelector('.ln-assistant-head')?.after(toolbar);
const drawer=document.createElement('section');drawer.id='ln-chat-history';drawer.className='ln-chat-history';drawer.hidden=true;
drawer.innerHTML='<div class="ln-chat-history-head"><strong>Tidligere samtaler</strong><button type="button" id="ln-chat-history-close" aria-label="Lukk samtalehistorikken">Lukk</button></div><p><strong>Ny chat bevarer tidligere samtaler når du har valgt lagring.</strong> Historikken blir da liggende i denne nettleseren, ikke i kontoen. Bruk sikkerhetskopi før du bytter telefon, sletter nettleserdata eller reinstalllerer.</p><div id="ln-chat-history-items"></div><button type="button" id="ln-chat-delete-all" class="ln-chat-delete-all">Slett alle samtaler</button>';
toolbar.after(drawer);
const backups=document.createElement('div');backups.className='ln-chat-backups';
backups.innerHTML='<button id="ln-chat-export" type="button">↓ Sikkerhetskopi av samtaler</button><button id="ln-chat-import" type="button">↑ Gjenopprett sikkerhetskopi</button><input id="ln-chat-import-file" type="file" accept=".json,application/json" hidden><p>Ny chat sletter ikke tidligere samtaler. De lagres på denne enheten, og kan eksporteres som en JSON-fil. Filen inneholder samtaletekst og bør oppbevares privat.</p>';
drawer.querySelector('#ln-chat-delete-all')?.before(backups);
function exportHistory(){saveCurrent();if(!entries.length){announce('Ingen samtaler å sikkerhetskopiere ennå.');return}
 const backup={format:'lanesjekk-assistant-backup',version:1,exported:new Date().toISOString(),conversations:entries};
 const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='lanesjekk-samtaler-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();announce('Sikkerhetskopien er klar som fil. Oppbevar den privat.');setTimeout(()=>URL.revokeObjectURL(url),1200)
}
backups.querySelector('#ln-chat-export').addEventListener('click',exportHistory);
const backupStatus=document.createElement('p');backupStatus.className='ln-chat-backup-status';backupStatus.setAttribute('role','status');backups.append(backupStatus);const announce=(message)=>{backupStatus.textContent=message};
const fileInput=backups.querySelector('#ln-chat-import-file');
backups.querySelector('#ln-chat-import').addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',async()=>{
 const file=fileInput.files?.[0];fileInput.value='';if(!file)return;
 if(!storageAllowed){announce('Aktiver lokal lagring før gjenoppretting.');return}
 if(file.size>450000){announce('Filen er for stor. Velg en sikkerhetskopi laget fra Lånesjekk Assistent.');return}
 try{
  const data=JSON.parse(await file.text());if(data?.format!=='lanesjekk-assistant-backup'||data.version!==1||!Array.isArray(data.conversations))throw Error('invalid format');
  const imported=data.conversations.slice(0,KEEP).filter(item=>item&&typeof item.id==='string'&&Array.isArray(item.turns)).map(item=>({
   id:uuid(),title:String(item.title||'Gjenopprettet samtale').slice(0,56),updated:Date.now(),
   turns:item.turns.slice(-35).filter(t=>t&&typeof t.q==='string'&&typeof t.a==='string').map(t=>({
    q:t.q.slice(0,700),a:t.a.slice(0,3500),href:typeof t.href==='string'&&/^#[a-z0-9-]+$/.test(t.href)?t.href:null,
    follow:Array.isArray(t.follow)?t.follow.filter(x=>typeof x==='string').slice(0,3):[],at:Number.isFinite(t.at)?t.at:Date.now()
   }))
  })).filter(item=>item.turns.length);
  if(!imported.length)throw Error('no conversations');
  saveCurrent();entries=[...imported,...entries].slice(0,KEEP);
  if(!persist())throw Error('storage full');
  draw();announce(imported.length+' samtale(r) gjenopprettet på denne enheten.')
 }catch{announce('Kunne ikke gjenopprette filen. Bruk en gyldig sikkerhetskopi fra Lånesjekk Assistent.')}
});
const permission=document.createElement('label');permission.className='ln-chat-storage-consent';
permission.innerHTML='<input type="checkbox" id="ln-chat-storage-optin"><span><strong>Lagre samtaler på denne enheten</strong><small>Frivillig: bare i denne nettleseren, ikke i kontoen eller Supabase. Når du slår av, slettes lagret samtalehistorikk.</small></span>';
drawer.querySelector('#ln-chat-history-items').before(permission);
const storageToggle=permission.querySelector('input');storageToggle.checked=storageAllowed;
storageToggle.addEventListener('change',()=>{
 if(storageToggle.checked){
  storageAllowed=true;
  try{localStorage.setItem(CONSENT,'yes')}catch{storageAllowed=false;storageToggle.checked=false;announce('Nettleseren blokkerer lagring.');return}
  const previous=load();entries=[...entries,...previous.filter(e=>!entries.some(x=>x.id===e.id))].slice(0,KEEP);
  saveCurrent();persist();draw();announce('Samtaler lagres nå lokalt på denne enheten.');
 }else{
  storageAllowed=false;entries=[];
  try{localStorage.removeItem(CONSENT);localStorage.removeItem(KEY);localStorage.removeItem(CUR)}catch{}
  draw();announce('Lagret historikk er slettet fra denne nettleseren.');
 }
});
const newButton=toolbar.querySelector('#ln-chat-new'),listButton=toolbar.querySelector('#ln-chat-list'),items=drawer.querySelector('#ln-chat-history-items');
function persist(){if(!storageAllowed)return false;try{localStorage.setItem(KEY,JSON.stringify(entries));localStorage.setItem(CUR,currentId);return true}catch{return false}}
function saveCurrent(){if(suspend)return;const turns=conversation.turns();if(!turns.length)return;const first=turns[0]?.q||'Ny samtale',i=entries.findIndex(x=>x.id===currentId);
 const rec={id:currentId,title:first.slice(0,56),turns:turns.slice(-35).map(x=>({q:String(x.q).slice(0,700),a:String(x.a).slice(0,3500),href:x.href,follow:x.follow||[],at:x.at})),updated:Date.now()};
 if(i>=0)entries.splice(i,1);entries.unshift(rec);entries=entries.slice(0,KEEP);persist();
}
function draw(){items.replaceChildren();if(!entries.length){const p=document.createElement('p');p.className='ln-chat-no-history';p.textContent='Ingen lagrede samtaler ennå. Når du starter en ny chat, blir tidligere spørsmål værende her.';items.append(p)}
 for(const rec of entries){const row=document.createElement('div');row.className='ln-chat-history-row';const open=document.createElement('button');open.type='button';open.className='ln-chat-history-select';open.textContent=(rec.id===currentId?'● ':'')+rec.title;const date=document.createElement('small');date.textContent=new Date(rec.updated).toLocaleString('nb-NO',{dateStyle:'short',timeStyle:'short'});open.append(date);open.addEventListener('click',()=>{saveCurrent();suspend=true;currentId=rec.id;conversation.restore(rec.turns);suspend=false;persist();document.dispatchEvent(new Event('ln-assistant-restored'));show(false)});
 const del=document.createElement('button');del.type='button';del.className='ln-chat-history-remove';del.setAttribute('aria-label','Slett samtalen '+rec.title);del.textContent='Slett';del.addEventListener('click',()=>{entries=entries.filter(x=>x.id!==rec.id);if(rec.id===currentId){suspend=true;conversation.reset();currentId=uuid();suspend=false}persist();draw()});row.append(open,del);items.append(row)}
}
function show(open){drawer.hidden=!open;panel.classList.toggle('ln-chat-history-open',open);listButton.setAttribute('aria-expanded',String(open));if(open){draw();drawer.querySelector('#ln-chat-history-close')?.focus()}else{listButton.focus({preventScroll:true})}}
listButton.addEventListener('click',()=>show(drawer.hidden));
drawer.querySelector('#ln-chat-history-close').addEventListener('click',()=>show(false));
newButton.addEventListener('click',()=>{if(conversation.isBusy()){return}if(!storageAllowed&&conversation.turns().length&&!confirm('Uten lagring forsvinner samtalen når du starter en ny. Vil du fortsette?'))return;saveCurrent();suspend=true;const ok=conversation.reset();if(ok)currentId=uuid();suspend=false;persist();show(false)});
drawer.querySelector('#ln-chat-delete-all').addEventListener('click',()=>{if(!confirm('Vil du slette all samtalehistorikk lagret på denne enheten?'))return;entries=[];suspend=true;conversation.reset();currentId=uuid();suspend=false;persist();show(false)});
document.addEventListener('ln-assistant-turn',saveCurrent);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden){e.stopPropagation();show(false)}},true);
const existing=storageAllowed?entries.find(x=>x.id===currentId):null;
if(existing?.turns?.length){suspend=true;conversation.restore(existing.turns);suspend=false;document.dispatchEvent(new Event('ln-assistant-restored'))}
else persist();
})();