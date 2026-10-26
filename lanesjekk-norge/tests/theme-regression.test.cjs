'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const file=name=>fs.readFileSync(path.join(root,name),'utf8');
const classes=()=>{const entries=new Set();return{toggle(name,on){if(on)entries.add(name);else entries.delete(name)},contains:name=>entries.has(name)}};
function publicTheme(initial='site',systemDark=false,embedded=false){
 const store=new Map(initial==='site'?[]:[['lanesjekk.public.theme.v1',initial]]);
 const listeners={},html={dataset:{},classList:classes(),style:{setProperty(){}}};
 const meta={setAttribute(name,val){this[name]=val}};
 const document={
  documentElement:html,
  getElementById(){return null},
  querySelector(sel){return sel==='meta[name="theme-color"]'?meta:null},
  querySelectorAll(){return[]},
  addEventListener(name,callback){listeners['document_'+name]=callback}
 };
 const media={matches:systemDark,addEventListener(name,callback){listeners['media_'+name]=callback}};
 const window={
  localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  matchMedia:()=>media,addEventListener(name,callback){listeners['window_'+name]=callback},
  dispatchEvent(){},supabase:null
 };
 window.parent=embedded?{}:window;
 const scope={window,document,location:{origin:'https://test.invalid'},CustomEvent:class {},console:{warn(){}}};
 vm.runInNewContext(file('feature-introductions-data.js'),scope);
 vm.runInNewContext(file('site-cms.js'),scope);
 const setSite=theme=>window.lanesjekkCms.apply({brand:{theme}});
 return {window,document,meta,media,store,listeners,setSite};
}
test('Published light and dark are applied to actual root class',()=>{
 const t=publicTheme();t.setSite('dark');
 assert.equal(t.window.lanesjekkTheme.active(),'dark');
 assert.equal(t.document.documentElement.classList.contains('cms-dark'),true);
 assert.equal(t.meta.content,'#101e2d');
 t.setSite('light');
 assert.equal(t.window.lanesjekkTheme.active(),'light');
 assert.equal(t.document.documentElement.classList.contains('cms-dark'),false);
});
test('Visitor preferences override published theme, persist and can be cleared',()=>{
 const t=publicTheme();t.setSite('dark');t.window.lanesjekkTheme.setChoice('light');
 assert.equal(t.window.lanesjekkTheme.active(),'light');
 assert.equal(t.store.get('lanesjekk.public.theme.v1'),'light');
 t.window.lanesjekkTheme.setChoice('dark');t.setSite('light');
 assert.equal(t.window.lanesjekkTheme.active(),'dark');
 t.window.lanesjekkTheme.setChoice('site');
 assert.equal(t.window.lanesjekkTheme.active(),'light');
 assert.equal(t.store.has('lanesjekk.public.theme.v1'),false);
});
test('Automatic site theme reacts to operating system preferences',()=>{
 const t=publicTheme('site',true);
 t.setSite('auto');assert.equal(t.window.lanesjekkTheme.active(),'dark');
 t.media.matches=false;t.listeners.media_change();
 assert.equal(t.window.lanesjekkTheme.active(),'light');
});
test('Studio preview uses draft theme even when local visitor preference is light',()=>{
 const t=publicTheme('light',false,true);
 t.listeners.document_DOMContentLoaded();
 t.listeners.window_message({origin:'https://test.invalid',source:t.window.parent,
  data:{type:'lanesjekk-cms-preview',config:{brand:{theme:'dark'}}}});
 assert.equal(t.window.lanesjekkTheme.active(),'dark');
});
test('Public and private theme controls are independent and CSS is present',()=>{
 const index=file('index.html'),admin=file('studio-admin.html');
 assert.match(index,/id="site-theme-quick"/);
 assert.doesNotMatch(index,/id="site-theme-picker"/);
 assert.match(index,/role="switch"/);
 assert.match(index,/dark-mode-complete\.css/);
 assert.match(admin,/id="admin-ui-theme"/);
 assert.match(admin,/admin-theme\.js/);
 assert.match(admin,/admin-dark-mode\.css/);
 const darkCSS=file('dark-mode-complete.css'),adminCSS=file('admin-dark-mode.css');
 for(const area of ['budget','receipt','rental','pv-','investment','academy','vc-','bank','site-search'])assert.ok(darkCSS.includes(area),'missing public theme: '+area);
 assert.match(adminCSS,/html\.studio-dark/);
 for(const mode of ['auto','light','dark'])assert.ok(file('admin-theme.js').includes(mode));
});

test('Studio and password page use the same persisted appearance choice',()=>{
 const html=file('studio-admin.html'),reset=file('admin-password.html');
 for(const text of [html,reset]){
  assert.match(text,/id="admin-ui-theme"/);
  assert.match(text,/admin-theme\.js/);
  assert.match(text,/admin-dark-mode\.css/);
 }
 const store=new Map([['lanesjekk.studio.theme.v1','dark']]);
 const callbacks={};
 const media={matches:false,addEventListener(name,cb){callbacks['media_'+name]=cb}};
 const select={value:'',addEventListener(name,cb){callbacks['select_'+name]=cb}};
 const htmlClasses=classes(),htmlRoot={classList:htmlClasses,dataset:{},style:{colorScheme:''}};
 const doc={getElementById:id=>id==='admin-ui-theme'?select:null,
  documentElement:htmlRoot,querySelector:()=>({setAttribute(){}})};
 const window={matchMedia:()=>media,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};
 vm.runInNewContext(file('admin-theme.js'),{document:doc,window});
 assert.equal(select.value,'dark');
 assert.equal(htmlClasses.contains('studio-dark'),true);
 select.value='light';callbacks.select_change();
 assert.equal(htmlClasses.contains('studio-dark'),false);
 assert.equal(store.get('lanesjekk.studio.theme.v1'),'light');
 media.matches=true;select.value='auto';callbacks.select_change();
 assert.equal(htmlClasses.contains('studio-dark'),true);
 media.matches=false;callbacks.media_change();
 assert.equal(htmlClasses.contains('studio-dark'),false);
});
