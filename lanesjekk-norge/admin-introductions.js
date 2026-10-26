/* Studio controls for published feature activation, previews and acknowledgement content. */
(()=>{'use strict';
const schema=window.LNIntroConfig,byId=id=>document.getElementById(id);
if(!schema)return;
let app=null,chosen='history';
const el={
 select:()=>byId('admin-intro-target'),history:()=>byId('admin-intro-history'),
 enabled:()=>byId('admin-intro-enabled'),highlight:()=>byId('admin-intro-highlight'),
 ack:()=>byId('admin-intro-ack'),title:()=>byId('admin-intro-title'),
 body:()=>byId('admin-intro-body'),version:()=>byId('admin-intro-version'),
 preview:()=>byId('admin-intro-preview-dialog')
};
const draft=()=>app?.getDraft?.()?.introductions;
function render(values){
 if(!values||!el.select())return;
 const item=values.items[chosen]||values.items.history;
 el.history().checked=values.historyEnabled;
 el.select().value=chosen;
 el.enabled().checked=item.enabled;
 el.highlight().checked=item.highlight;
 el.ack().checked=item.requireAck;
 el.title().value=item.title;el.body().value=item.body;el.version().value=item.version;
 byId('admin-intro-history-state').textContent=values.historyEnabled?'Samtaler er synlig på nettsiden.':'Samtaler er skjult for besøkende.';
}
function edit(key,value){
 const record=draft();if(!record||!record.items[chosen])return;
 if(key==='historyEnabled')record.historyEnabled=value;
 else record.items[chosen][key]=value;
 render(record);app.changed?.();
}
function fillPreview(){
 const settings=draft(),item=settings?.items[chosen];if(!item)return;
 byId('admin-intro-preview-title').textContent=item.title;
 byId('admin-intro-preview-text').textContent=item.body;
 byId('admin-intro-preview-action').textContent=item.requireAck?'Jeg har lest informasjonen':'OK, forstått';
 byId('admin-intro-preview-tag').hidden=!item.highlight;
 const dialog=el.preview();
 if(!dialog.open)dialog.showModal();
}
function init(options){
 app=options;
 const select=el.select();if(!select)return;
 select.replaceChildren(...schema.definitions.map(info=>{const o=document.createElement('option');o.value=info.id;o.textContent=info.name;return o}));
 select.addEventListener('change',()=>{chosen=select.value;render(draft())});
 el.history().addEventListener('change',()=>edit('historyEnabled',el.history().checked));
 for(const [key,getter]of[['enabled',el.enabled],['highlight',el.highlight],['requireAck',el.ack]])
  getter().addEventListener('change',()=>edit(key,getter().checked));
 el.title().addEventListener('input',()=>edit('title',el.title().value.slice(0,110)));
 el.body().addEventListener('input',()=>edit('body',el.body().value.slice(0,650)));
 el.version().addEventListener('change',()=>edit('version',Math.max(1,Math.min(9999,Number(el.version().value)||1))));
 byId('admin-intro-next-version').addEventListener('click',()=>edit('version',Math.min(9999,(draft()?.items[chosen]?.version||1)+1)));
 byId('admin-intro-preview').addEventListener('click',fillPreview);
 byId('admin-intro-preview-close').addEventListener('click',()=>el.preview().close());
 byId('admin-intro-preview-action').addEventListener('click',()=>el.preview().close());
}
window.lanesjekkIntroAdmin={init,render};
})();