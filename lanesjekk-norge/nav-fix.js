/* Accessible, predictable desktop and mobile navigation. */
(()=>{
 'use strict';
 document.addEventListener('DOMContentLoaded',()=>{
  const groups=[...document.querySelectorAll('.site-header .portal-nav > details.nav-group')];
  const mobile=document.querySelector('.site-header .mobile-menu');
  const mobileTrigger=mobile?.querySelector(':scope > summary');
  const closeGroups=()=>groups.forEach(group=>{group.open=false});
  const closeMobile=()=>{if(mobile)mobile.open=false};
  const syncMobile=()=>{
   if(!mobile||!mobileTrigger)return;
   document.body.classList.toggle('mobile-nav-open',mobile.open);
   mobileTrigger.setAttribute('aria-expanded',String(mobile.open));
   mobileTrigger.setAttribute('aria-label',mobile.open?'Lukk hovedmeny':'Åpne hovedmeny');
  };
  groups.forEach(group=>{
   const trigger=group.querySelector('summary');
   group.addEventListener('toggle',()=>{
    trigger?.setAttribute('aria-expanded',String(group.open));
    if(group.open){
     groups.forEach(other=>{if(other!==group)other.open=false});
     closeMobile();
    }
   });
   trigger?.setAttribute('aria-expanded',String(group.open));
   trigger?.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'){
     event.preventDefault();group.open=true;
     requestAnimationFrame(()=>group.querySelector('.nav-drop a')?.focus());
    }
   });
   group.querySelectorAll('.nav-drop a').forEach(link=>link.addEventListener('click',()=>{group.open=false}));
  });
  mobile?.addEventListener('toggle',()=>{
   if(mobile.open)closeGroups();
   syncMobile();
  });
  mobile?.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',closeMobile));
  document.addEventListener('pointerdown',event=>{
   if(!event.target.closest('.site-header .portal-nav'))closeGroups();
   if(mobile?.open&&!event.target.closest('.site-header .mobile-menu'))closeMobile();
  });
  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const group=groups.find(g=>g.open);
   if(group){
    closeGroups();
    group.querySelector('summary')?.focus();
   }
   if(mobile?.open){
    closeMobile();
    mobileTrigger?.focus();
   }
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>1140)closeMobile()});
  syncMobile();
 });
})();
