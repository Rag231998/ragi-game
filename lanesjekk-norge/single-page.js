/* Lånesjekk Norge: distinct views inside one website.
 * Navigate between home, loans, savings, banks and guides without new tabs
 * or reloading a form. Deep links and browser Back/Forward are supported. */
(()=>{
 'use strict';
 const LABELS=Object.freeze({home:'Forside',loans:'Boliglån',savings:'Sparing',banks:'Bankoversikt',guides:'Guider og artikler'});
 const SELECTORS='[data-portal-view]';
 function closeMenu(){
  document.querySelectorAll('.mobile-menu[open]').forEach(menu=>{menu.open=false});
 }
 function resolve(id){
  if(!id||id==='topp'||id==='forside')return {view:'home',target:document.getElementById('topp')};
  const target=document.getElementById(id);
  if(!target)return {view:'home',target:document.getElementById('topp')};
  const panel=target.closest(SELECTORS);
  return {view:panel?.dataset.portalView||'home',target};
 }
 function readHash(){
  try{return decodeURIComponent(window.location.hash.slice(1))}catch{return 'topp'}
 }
 function syncMenus(view){
  document.querySelectorAll('.portal-nav a,.mobile-menu a,.viewbar-shortcuts a').forEach(link=>{
   const hash=link.getAttribute('href')?.replace(/^#/,'')||'topp';
   const active=resolve(hash).view===view;
   if(active)link.setAttribute('aria-current','page');
   else link.removeAttribute('aria-current');
  });
  const bar=document.getElementById('portal-viewbar');
  if(bar)bar.hidden=view==='home';
  const name=document.getElementById('viewbar-title');
  if(name)name.textContent=LABELS[view]||'Forside';
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
  syncMenus(view);
  openArticle(target);
  closeMenu();
  if(scroll){
   // Ensure the newly visible target has been laid out before scrolling.
   window.requestAnimationFrame(()=>{
    const destination=id==='topp'||!target?document.getElementById('topp'):target;
    destination?.scrollIntoView({block:'start',behavior:'instant'});
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
   if(!document.getElementById(id)&&id!=='topp')return;
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
