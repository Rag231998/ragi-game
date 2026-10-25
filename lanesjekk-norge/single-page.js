/* Lånesjekk Norge: distinct views inside one website.
 * Navigate between home, loans, savings, banks and guides without new tabs
 * or reloading a form. Deep links and browser Back/Forward are supported. */
(()=>{
 'use strict';
 const LABELS=Object.freeze({home:'Forside',loans:'Boliglån',savings:'Sparing',banks:'Bankoversikt',guides:'Guider og artikler',budget:'Budsjett',receipts:'Kvitteringer',property:'Eiendomsstudio',financing:'Billån og forbrukslån',academy:'Lånesjekk Akademi',investing:'Fond og aksjer',currency:'Valutakompass'});
 const SELECTORS='[data-portal-view]';
 // Legacy entry links should select the correct tool, not just its container.
 const ALIASES=Object.freeze({utleie:'utleieanalyse',forside:'topp'});
 const PRIMARY_ROUTES=new Set(['topp','sjekk','billan','forbrukslan','banker','budsjett','kvitteringer','sparing','investering','valutakompass','boligverdi','utleieanalyse','akademi','guider']);
 const canonical=id=>ALIASES[id]||id||'topp';
 const VIEW_ROOT=Object.freeze({home:'topp',loans:'sjekk',financing:'billan',banks:'banker',budget:'budsjett',receipts:'kvitteringer',savings:'sparing',investing:'investering',currency:'valutakompass',property:'boligverdi',academy:'akademi',guides:'guider'});
 function closeMenu(){
  document.querySelectorAll('.mobile-menu[open],.nav-group[open]').forEach(menu=>{menu.open=false});
 }
 function resolve(id){
  id=canonical(id);
  if(id==='topp')return {view:'home',target:document.getElementById('topp')};
  const target=document.getElementById(id==='forbrukslan'?'billan':id);
  if(!target)return {view:'home',target:document.getElementById('topp')};
  const panel=target.closest(SELECTORS);
  return {view:panel?.dataset.portalView||'home',target};
 }
 function readHash(){
  try{return decodeURIComponent(window.location.hash.slice(1))}catch{return 'topp'}
 }
 function syncMenus(view,id){
  const current=canonical(id),primary=VIEW_ROOT[view]||'topp';
  document.querySelectorAll('.portal-nav a,.mobile-menu a,.viewbar-shortcuts a,.mobile-bottom-tabs a').forEach(link=>{
   const hash=canonical((link.getAttribute('href')||'').replace(/^#/,''));
   const bottom=!!link.closest('.mobile-bottom-tabs');
   const matched=bottom
    ? (hash==='billan'?(view==='financing'||view==='loans'):resolve(hash).view===view)
    : (hash===current||(hash===primary&&!PRIMARY_ROUTES.has(current)));
   if(matched)link.setAttribute('aria-current','page');
   else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.site-header .nav-group').forEach(group=>{
   const isActive=!!group.querySelector('.nav-drop a[aria-current="page"]');
   group.classList.toggle('is-current-group',isActive);
   group.querySelector('summary')?.setAttribute('aria-label',(group.querySelector('summary')?.textContent||'Kategori').trim()+(isActive?' – aktiv kategori':''));
  });
  const bar=document.getElementById('portal-viewbar');
  if(bar)bar.hidden=view==='home';
  const name=document.getElementById('viewbar-title');
  const label=view==='financing'?(current==='forbrukslan'?'Forbrukslån':'Billån')
   :view==='property'?(current==='utleieanalyse'?'Utleieanalyse':'Boligverdi')
   :(LABELS[view]||'Forside');
  if(name)name.textContent=label;
  document.title=view==='home'?'Lånesjekk Norge | Budsjett, sparing, billån og banksammenligning':label+' | Lånesjekk Norge';
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
  id=canonical(id);
  const {view,target}=resolve(id);
  const panels=document.querySelectorAll(SELECTORS);
  for(const panel of panels){
   const active=panel.dataset.portalView===view;
   panel.hidden=!active;
   panel.setAttribute('aria-hidden',String(!active));
  }
  document.body.dataset.activeView=view;
  document.body.dataset.activeRoute=id;
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
    const destination=view!=='home'&&PRIMARY_ROUTES.has(id)
     ?(document.getElementById('portal-viewbar')||target):target;
    (destination||document.getElementById('topp'))?.scrollIntoView({block:'start',behavior:'auto'});
   });
  }
  return view;
 }
 function navigate(id,replace=false){
  const safeId=canonical(String(id||'topp').replace(/^#/,''));
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
   if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target==='_blank')return;
   const raw=link.getAttribute('href')||'#topp';
   if(raw==='#')return;
   const id=raw.slice(1);
   if(!document.getElementById(id)&&id!=='forbrukslan'&&id!=='topp'&&id!=='forside')return;
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
