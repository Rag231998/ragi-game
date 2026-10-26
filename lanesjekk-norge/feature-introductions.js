/* Public read acknowledgements: per-device, per-feature, per-version. No financial data collected. */
(()=>{'use strict';
const meta=window.LNIntroConfig;if(!meta)return;
const STORE='lanesjekk-feature-read-confirmations-v1',dom={};let config=meta.normalize(),preview=false,active=null,returnFocus=null;
function seen(key,version){
 if(preview)return false;
 try{const data=JSON.parse(localStorage.getItem(STORE)||'{}');return Number(data[key])>=version}catch{return false}
}
function save(key,version){
 if(preview)return;
 try{const data=JSON.parse(localStorage.getItem(STORE)||'{}');data[key]=version;localStorage.setItem(STORE,JSON.stringify(data))}catch{}
}
function dialog(){
 let el=document.getElementById('ln-intro-dialog');if(el)return el;
 el=document.createElement('dialog');el.id='ln-intro-dialog';el.className='ln-intro-dialog';el.setAttribute('aria-labelledby','ln-intro-title');
 el.innerHTML='<div class="ln-intro-panel"><span class="ln-intro-kicker">NYTT I LÅNESJEKK NORGE</span><h2 id="ln-intro-title"></h2><p id="ln-intro-body"></p><label id="ln-intro-ack-row"><input id="ln-intro-ack" type="checkbox"><span>Jeg har lest informasjonen om denne funksjonen.</span></label><div class="ln-intro-actions"><button class="ln-intro-cancel" type="button" id="ln-intro-dismiss">Ikke nå</button><button class="ln-intro-accept" type="button" id="ln-intro-confirm">Bekreft og fortsett</button></div><small>Bekreftelsen huskes på denne enheten. Du kan åpne informasjonen igjen via ⓘ.</small></div>';
 document.body.append(el);
 const ack=el.querySelector('#ln-intro-ack'),accept=el.querySelector('#ln-intro-confirm');
 ack.addEventListener('change',()=>{accept.disabled=active?.requireAck&&!ack.checked});
 el.querySelector('#ln-intro-dismiss').addEventListener('click',()=>el.close());
 accept.addEventListener('click',()=>{
  if(active?.requireAck&&!ack.checked)return;
  if(active){save(active.id,active.version);active=null}el.close();update();
 });
 el.addEventListener('close',()=>{active=null;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})});
 return el;
}
function open(id){
 const item=config.items[id];if(!item||!item.enabled)return;
 if(id==='history'&&!config.historyEnabled)return;
 const el=dialog();active={id,version:item.version,requireAck:item.requireAck};returnFocus=document.activeElement;
 el.querySelector('#ln-intro-title').textContent=item.title;
 el.querySelector('#ln-intro-body').textContent=item.body;
 el.querySelector('#ln-intro-ack').checked=false;
 el.querySelector('#ln-intro-ack-row').hidden=!item.requireAck;
 el.querySelector('#ln-intro-confirm').disabled=item.requireAck;
 el.querySelector('#ln-intro-confirm').textContent=item.requireAck?'Jeg har lest – fortsett':'Forstått – fortsett';
 if(!el.open)el.showModal();
}
function update(){
 const list=document.getElementById('ln-chat-list'),drawer=document.getElementById('ln-chat-history');
 if(list){list.hidden=!config.historyEnabled;if(!config.historyEnabled&&drawer){drawer.hidden=true;document.getElementById('ln-assistant-panel')?.classList.remove('ln-chat-history-open');list.setAttribute('aria-expanded','false')}}
 for(const def of meta.definitions){
  const item=config.items[def.id],enabled=item?.enabled&&(def.id!=='history'||config.historyEnabled);
  const target=document.querySelector(def.target),old=dom[def.id];
  if(old?.target!==target){old?.target?.classList.remove('ln-intro-new');old?.help?.remove();delete dom[def.id]}
  if(!target)continue;
  if(!dom[def.id]){const help=document.createElement('button');help.type='button';help.className='ln-intro-help';help.textContent='ⓘ';help.title='Les om '+def.name;help.setAttribute('aria-label','Les om '+def.name);
   help.addEventListener('click',()=>open(def.id));target.insertAdjacentElement('afterend',help);dom[def.id]={target,help}}
  const read=seen(def.id,item.version);
  target.classList.toggle('ln-intro-new',!!enabled&&item.highlight&&!read);
  target.dataset.lnIntroId=enabled?def.id:'';
  dom[def.id].help.hidden=!enabled||!read;
 }
}
document.addEventListener('click',e=>{
 const trigger=e.target.closest?.('.ln-intro-new[data-ln-intro-id]');
 if(!trigger||!config.items[trigger.dataset.lnIntroId])return;
 const id=trigger.dataset.lnIntroId,item=config.items[id];
 if(!item.enabled||seen(id,item.version))return;
 e.preventDefault();e.stopImmediatePropagation();open(id);
},true);
window.addEventListener('lanesjekk-intro-config',e=>{preview=!!e.detail?.preview;config=meta.normalize(e.detail);update()});
document.addEventListener('DOMContentLoaded',()=>{dialog();update()});
window.lanesjekkFeatureIntros={apply(value){config=meta.normalize(value);update()},open,seen};
})();