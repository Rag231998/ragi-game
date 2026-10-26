(()=>{'use strict';
const panel=document.getElementById('ln-assistant-panel'),conversation=window.LNAssistantConversation;
if(!panel||!conversation)return;
const KEY='lanesjekk-chat-history-v1',CUR='lanesjekk-chat-current-v1',KEEP=15,AGE=60*86400000;
const uuid=()=>('chat-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
function load(){try{const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(parsed))return[];return parsed.filter(x=>x&&typeof x.id==='string'&&Array.isArray(x.turns)&&Number(x.updated)>Date.now()-AGE).slice(0,KEEP)}catch{return[]}}
let entries=load(),currentId=(()=>{try{return localStorage.getItem(CUR)||uuid()}catch{return uuid()}})(),suspend=false;
const toolbar=document.createElement('div');toolbar.className='ln-chat-toolbar';
toolbar.innerHTML='<button type="button" id="ln-chat-new" title="Arkiver denne og start en ny samtale"><span aria-hidden="true">＋</span> Ny chat</button><button type="button" id="ln-chat-list" aria-expanded="false" aria-controls="ln-chat-history"><span aria-hidden="true">☷</span> Samtaler</button>';
panel.querySelector('.ln-assistant-head')?.after(toolbar);
const drawer=document.createElement('section');drawer.id='ln-chat-history';drawer.className='ln-chat-history';drawer.hidden=true;
drawer.innerHTML='<div class="ln-chat-history-head"><strong>Tidligere samtaler</strong><button type="button" id="ln-chat-history-close" aria-label="Lukk samtalehistorikken">Lukk</button></div><p>Lagres bare i denne nettleseren på denne enheten, ikke i en konto eller på serveren. Unngå sensitive opplysninger på delte enheter.</p><div id="ln-chat-history-items"></div><button type="button" id="ln-chat-delete-all" class="ln-chat-delete-all">Slett alle samtaler</button>';
toolbar.after(drawer);
const newButton=toolbar.querySelector('#ln-chat-new'),listButton=toolbar.querySelector('#ln-chat-list'),items=drawer.querySelector('#ln-chat-history-items');
function persist(){try{localStorage.setItem(KEY,JSON.stringify(entries));localStorage.setItem(CUR,currentId);return true}catch{return false}}
function saveCurrent(){if(suspend)return;const turns=conversation.turns();if(!turns.length)return;const first=turns[0]?.q||'Ny samtale',i=entries.findIndex(x=>x.id===currentId);
 const rec={id:currentId,title:first.slice(0,56),turns:turns.slice(-35).map(x=>({q:String(x.q).slice(0,700),a:String(x.a).slice(0,3500),href:x.href,follow:x.follow||[],at:x.at})),updated:Date.now()};
 if(i>=0)entries.splice(i,1);entries.unshift(rec);entries=entries.slice(0,KEEP);persist();
}
function draw(){items.replaceChildren();if(!entries.length){const p=document.createElement('p');p.className='ln-chat-no-history';p.textContent='Ingen lagrede samtaler ennå. Når du starter en ny chat, blir tidligere spørsmål værende her.';items.append(p)}
 for(const rec of entries){const row=document.createElement('div');row.className='ln-chat-history-row';const open=document.createElement('button');open.type='button';open.className='ln-chat-history-select';open.textContent=(rec.id===currentId?'● ':'')+rec.title;const date=document.createElement('small');date.textContent=new Date(rec.updated).toLocaleString('nb-NO',{dateStyle:'short',timeStyle:'short'});open.append(date);open.addEventListener('click',()=>{saveCurrent();suspend=true;currentId=rec.id;conversation.restore(rec.turns);suspend=false;persist();show(false)});
 const del=document.createElement('button');del.type='button';del.className='ln-chat-history-remove';del.setAttribute('aria-label','Slett samtalen '+rec.title);del.textContent='Slett';del.addEventListener('click',()=>{entries=entries.filter(x=>x.id!==rec.id);if(rec.id===currentId){suspend=true;conversation.reset();currentId=uuid();suspend=false}persist();draw()});row.append(open,del);items.append(row)}
}
function show(open){drawer.hidden=!open;panel.classList.toggle('ln-chat-history-open',open);listButton.setAttribute('aria-expanded',String(open));if(open){draw();drawer.querySelector('#ln-chat-history-close')?.focus()}else{listButton.focus({preventScroll:true})}}
listButton.addEventListener('click',()=>show(drawer.hidden));
drawer.querySelector('#ln-chat-history-close').addEventListener('click',()=>show(false));
newButton.addEventListener('click',()=>{if(conversation.isBusy()){return}saveCurrent();suspend=true;const ok=conversation.reset();if(ok)currentId=uuid();suspend=false;persist();show(false)});
drawer.querySelector('#ln-chat-delete-all').addEventListener('click',()=>{if(!confirm('Vil du slette all samtalehistorikk lagret på denne enheten?'))return;entries=[];suspend=true;conversation.reset();currentId=uuid();suspend=false;persist();show(false)});
document.addEventListener('ln-assistant-turn',saveCurrent);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden){e.stopPropagation();show(false)}},true);
const existing=entries.find(x=>x.id===currentId);
if(existing?.turns?.length){suspend=true;conversation.restore(existing.turns);suspend=false}
else persist();
})();