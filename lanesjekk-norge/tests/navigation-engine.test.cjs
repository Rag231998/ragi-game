'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
function start(hash='#topp'){
 const panels=new Map(['home','loans','financing','budget','property','savings','banks','guides','receipts','investing','academy','currency'].map(view=>[view,{dataset:{portalView:view},hidden:false,setAttribute(){}}]));
 const classes=()=>({names:new Set(),toggle(name,on){if(on)this.names.add(name);else this.names.delete(name)},contains(name){return this.names.has(name)}});
 const rentalClasses=classes(),routes={topp:'home',sjekk:'loans',billan:'financing',budsjett:'budget',boligverdi:'property',utleieanalyse:'property',utleie:'property',sparing:'savings',banker:'banks',guider:'guides',kvitteringer:'receipts',investering:'investing',akademi:'academy',valutakompass:'currency'};
 const nodes={};
 for(const [id,view] of Object.entries(routes)){
  nodes[id]={id,closest(selector){return selector==='[data-portal-view]'?panels.get(view):null},matches(){return false},scrollIntoView(){},classList:id==='utleie'?rentalClasses:classes(),setAttribute(){}};
 }
 nodes['portal-viewbar']={hidden:false,querySelector(){return null},scrollIntoView(){}};
 nodes['viewbar-title']={textContent:''};
 nodes['pv-mode-rental']={classList:classes(),setAttribute(){}};
 nodes['pv-mode-valuation']={classList:classes(),setAttribute(){}};
 const links=['topp','sjekk','billan','forbrukslan','boligverdi','utleieanalyse','budsjett'].map(id=>{
  const attrs={href:'#'+id};
  return {getAttribute:key=>attrs[key],setAttribute(key,value){attrs[key]=value},removeAttribute(key){delete attrs[key]},closest(){return null},attrs};
 });
 const document={
  body:{dataset:{}},title:'',getElementById:id=>nodes[id]||null,
  querySelectorAll:selector=>selector==='[data-portal-view]'?[...panels.values()]:
   selector.startsWith('.portal-nav a,')?links:[],
  addEventListener(){}
 };
 const location={hash},history={pushState(_a,_b,h){location.hash=h},replaceState(_a,_b,h){location.hash=h}};
 let mode;
 const window={location,history,addEventListener(){},requestAnimationFrame:fn=>fn(),lanesjekkFinanceChooseMode:m=>{mode=m}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'single-page.js'),'utf8'),{document,window},{filename:'single-page.js'});
 return {window,document,nodes,links,rentalClasses,panels,get mode(){return mode}};
}

test('Rental shortcut always opens the rental calculator and a canonical deep link',()=>{
 const app=start();
 app.window.lanesjekkPortal.navigate('utleie');
 assert.equal(app.window.location.hash,'#utleieanalyse');
 assert.equal(app.document.body.dataset.activeView,'property');
 assert.equal(app.nodes['utleie'].classList.contains('pv-mode-rental'),true);
 assert.equal(app.nodes['viewbar-title'].textContent,'Utleieanalyse');
 assert.equal(app.panels.get('property').hidden,false);
 assert.equal(app.panels.get('budget').hidden,true);
});

test('Shared calculator keeps only one precise active menu item at a time',()=>{
 const app=start();
 app.window.lanesjekkPortal.navigate('forbrukslan');
 assert.equal(app.mode,'consumer');
 assert.equal(app.links.find(x=>x.attrs.href==='#forbrukslan').attrs['aria-current'],'page');
 assert.equal(app.links.find(x=>x.attrs.href==='#billan').attrs['aria-current'],undefined);
 app.window.lanesjekkPortal.navigate('billan');
 assert.equal(app.mode,'car');
 assert.equal(app.links.find(x=>x.attrs.href==='#billan').attrs['aria-current'],'page');
 assert.equal(app.links.find(x=>x.attrs.href==='#forbrukslan').attrs['aria-current'],undefined);
});

test('Property mode and active menu selection reset without reloading the app',()=>{
 const app=start();
 app.window.lanesjekkPortal.navigate('utleieanalyse');
 app.window.lanesjekkPortal.navigate('boligverdi');
 assert.equal(app.nodes['utleie'].classList.contains('pv-mode-rental'),false);
 assert.equal(app.links.find(x=>x.attrs.href==='#boligverdi').attrs['aria-current'],'page');
 assert.equal(app.links.find(x=>x.attrs.href==='#utleieanalyse').attrs['aria-current'],undefined);
 assert.equal(app.document.body.dataset.activeRoute,'boligverdi');
});

test('Switcher, mobile tab count and dark mode overrides are wired',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const css=fs.readFileSync(path.join(root,'navigation-ux.css'),'utf8');
 assert.match(html,/id="viewbar-switch"/);
 assert.match(html,/navigation-ux\.css/);
 assert.match(html,/href="#utleieanalyse"/);
 assert.equal((html.match(/class="mobile-bottom-tabs"/g)||[]).length,1);
 assert.match(css,/grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
 assert.match(css,/html\.cms-dark/);
});
