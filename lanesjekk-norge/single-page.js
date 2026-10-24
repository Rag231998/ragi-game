/* Lånesjekk Norge: distinct views inside one website.
 * Navigate between home, loans, savings, banks and guides without new tabs
 * or reloading a form. Deep links and browser Back/Forward are supported. */
(()=>{
 'use strict';
 const LABELS=Object.freeze({home:'Forside',loans:'Boliglån',savings:'Sparing',banks:'Bankoversikt',guides:'Guider og artikler',budget:'Budsjett',receipts:'Kvitteringer',property:'Eiendomsstudio',financing:'Billån og forbrukslån',academy:'Lånesjekk Akademi',investing:'Fond og aksjer'});
 const SELECTORS='[data-portal-view]';
 function closeMenu(){
  document.querySelectorAll('.mobile-menu[open],.nav-group[open]').forEach(menu=>{menu.open=false});
 }
 function resolve(id){
  if(!id||id==='topp'||id==='forside')return {view:'home',target:document.getElementById('topp')};
  const target=document.getElementById(id==='forbrukslan'?'billan':id);
  if(!target)return {view:'home',target:document.getElementById('topp')};
  const panel=target.closest(SELECTORS);
  return {view:panel?.dataset.portalView||'home',target};
 }
 function readHash(){
  try{return decodeURIComponent(window.location.hash.slice(1))}catch{return 'topp'}
 }
 function syncMenus(view,id){
  document.querySelectorAll('.portal-nav a,.mobile-menu a,.viewbar-shortcuts a,.mobile-bottom-tabs a').forEach(link=>{
   const hash=link.getAttribute('href')?.replace(/^#/,'')||'topp';
   // Car and consumer loans share one calculator but are separate user tabs.
   const isLoanShortcut=link.closest('.mobile-bottom-tabs')&&hash==='billan';
   const active=view==='financing'&&(hash==='billan'||hash==='forbrukslan')
    ? (isLoanShortcut||hash===(id==='forbrukslan'?'forbrukslan':'billan'))
    : resolve(hash).view===view;
   if(active)link.setAttribute('aria-current','page');
   else link.removeAttribute('aria-current');
  });
  const bar=document.getElementById('portal-viewbar');
  if(bar)bar.hidden=view==='home';
  const name=document.getElementById('viewbar-title');
  if(name)name.textContent=view==='financing'?(id==='forbrukslan'?'Forbrukslån':'Billån'):LABELS[view]||'Forside';
  // Keep the active shortcut in view on narrow screens without shifting the page.
  const strip=bar?.querySelector('.viewbar-shortcuts');
  const selected=strip?.querySelector('a[aria-current="page"]');
  if(strip&&selected&&strip.scrollWidth>strip.clientWidth){
   const left=selected.offsetLeft-strip.offsetLeft-(strip.clientWidth-selected.offsetWidth)/2;
   strip.scrollTo({left:Math.max(0,left),behavior:'auto'});
  }
 }
 function openArticle(target){
  if(!target)return;
  if(target.matches('details.long-guide'))target.open=true;
  const parent=target.closest('details.long-guide');
  if(parent)parent.open=true;
 }
 function show(id,{scroll=true}={}){
  const {view,target}=resolve(id);
  const panels=document.querySelectorAll(SELECTORS);
  for(const panel of panels){
   const active=panel.dataset.portalView===view;
   panel.hidden=!active;
   panel.setAttribute('aria-hidden',String(!active));
  }
  document.body.dataset.activeView=view;
  syncMenus(view,id);
  openArticle(target);
  if(view==='financing'&&typeof window.lanesjekkFinanceChooseMode==='function')window.lanesjekkFinanceChooseMode(id==='forbrukslan'?'consumer':'car');
  if(view==='property'){
   const rental=id==='utleieanalyse';
   const property=document.getElementById('utleie');
   property?.classList.toggle('pv-mode-rental',rental);
   const valuation=document.getElementById('pv-mode-valuation'),rentTab=document.getElementById('pv-mode-rental');
   valuation?.classList.toggle('is-selected',!rental);rentTab?.classList.toggle('is-selected',rental);
   valuation?.setAttribute('aria-pressed',String(!rental));rentTab?.setAttribute('aria-pressed',String(rental));
   const name=document.getElementById('viewbar-title');if(name)name.textContent=rental?'Utleieanalyse':'Boligverdi';
  }
  closeMenu();
  if(scroll){
   // Ensure the newly visible target has been laid out before scrolling.
   window.requestAnimationFrame(()=>{
    const destination=id==='topp'||!target?document.getElementById('topp'):target;
    destination?.scrollIntoView({block:'start',behavior:'auto'});
   });
  }
  return view;
 }
 function navigate(id,replace=false){
  const safeId=id?.replace(/^#/,'')||'topp';
  const fragment='#'+encodeURIComponent(safeId);
  if(window.location.hash!==fragment){
   if(replace)window.history.replaceState(null,'',fragment);
   else window.history.pushState(null,'',fragment);
  }
  return show(safeId);
 }
 function init(){
  // Links to sections and guides switch view, rather than stacking sections.
  document.addEventListener('click',event=>{
   const link=event.target.closest?.('a[href^="#"]');
   if(!link)return;
   const raw=link.getAttribute('href')||'#topp';
   if(raw==='#')return;
   const id=raw.slice(1);
   if(!document.getElementById(id)&&id!=='forbrukslan'&&id!=='topp')return;
   event.preventDefault();
   navigate(id);
  });
  window.addEventListener('popstate',()=>show(readHash()));
  window.addEventListener('hashchange',()=>show(readHash()));
  window.addEventListener('pageshow',event=>{if(event.persisted)show(readHash(),{scroll:false})});
  show(readHash(),{scroll:!!window.location.hash});
 }
 document.addEventListener('DOMContentLoaded',init);
 window.lanesjekkNavigate=navigate;
 window.lanesjekkPortal={show,resolve,navigate};
})();
