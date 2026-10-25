'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'site-cms.js'),'utf8');

function harness(){
 let revision=1,mode='light',readCount=0,connected='',onUpdate,checkAgain,renderedNews=[],messages=[];
 const listeners={};
 const fakeClass={toggle(){},contains(){return false}};
 const html={dataset:{},classList:fakeClass,style:{setProperty(){}}};
 const status={dataset:{},textContent:'',title:''};
 const document={
  documentElement:html,hidden:false,
  getElementById:id=>id==='site-live-status'?status:null,
  querySelector:s=>s==='meta[name="theme-color"]'?{setAttribute(){}}:null,
  querySelectorAll:()=>[],
  addEventListener:(name,fn)=>{listeners[name]=fn}
 };
 const db={
  from(table){assert.equal(table,'lanesjekk_site_config');return{
   select(fields){assert.equal(fields,'config,revision');return this},
   eq(key,val){assert.equal(key,'id');assert.equal(val,1);return this},
   async maybeSingle(){readCount++;return{data:{revision,config:{brand:{theme:mode},catalog:{headline:'Oppdag funksjoner',news:revision===1?[]:[{id:'release-r2',title:'Nytt verktøy',summary:'Forklarer hvordan det brukes',route:'budsjett',date:'2026-10-25'}]}}},error:null}}
  }},
  channel(name){assert.equal(name,'lanesjekk-public-config-updates');return{
   on(type,filter,fn){assert.equal(type,'postgres_changes');assert.equal(filter.event,'UPDATE');assert.equal(filter.table,'lanesjekk_site_config');onUpdate=fn;return this},
   subscribe(fn){connected='SUBSCRIBED';fn('SUBSCRIBED');return this}
  }}
 };
 const window={supabase:{createClient:()=>db},matchMedia:()=>({matches:false,addEventListener(){}}),
  localStorage:{getItem:()=>null},addEventListener(){},dispatchEvent(evt){messages.push(evt.type)},
  lanesjekkCatalog:{setNews:value=>renderedNews.push(value)}};
 window.parent=window;
 const context={document,window,location:{origin:'https://test.invalid'},
  setInterval(fn,ms){assert.equal(ms,60000);checkAgain=fn},
  CustomEvent:class{constructor(type,opt){this.type=type;this.detail=opt?.detail}},
  console:{warn(){}}};
 vm.runInNewContext(src,context,{filename:'site-cms.js'});
 return{
  listeners,status,html,get readCount(){return readCount},get connected(){return connected},
  get eventCount(){return messages.filter(x=>x==='lanesjekk-published-updated').length},
  get news(){return renderedNews.at(-1)},
  update(next,theme='dark'){revision=next;mode=theme;onUpdate()},
  fallback(){checkAgain()},async settle(){await new Promise(resolve=>setImmediate(resolve))}
 };
}

test('Real-time subscription fetches only approved published revisions and applies the update',async()=>{
 const h=harness();await h.listeners.DOMContentLoaded();
 assert.equal(h.connected,'SUBSCRIBED');assert.equal(h.readCount,1);
 assert.equal(h.status.dataset.state,'connected');assert.equal(h.html.dataset.activeTheme,'light');
 h.update(2);await h.settle();
 assert.equal(h.readCount,2);assert.equal(h.html.dataset.activeTheme,'dark');
 assert.equal(h.eventCount,2);
 assert.equal(h.news.news[0].title,'Nytt verktøy');
});
test('Poll fallback does not rerender unchanged revisions',async()=>{
 const h=harness();await h.listeners.DOMContentLoaded();
 const rendered=h.eventCount;
 h.fallback();await h.settle();
 assert.equal(h.readCount,2);assert.equal(h.eventCount,rendered);
 h.update(2);await h.settle();assert.equal(h.eventCount,rendered+1);
});
