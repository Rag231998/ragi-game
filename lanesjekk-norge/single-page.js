/* Lånesjekk Norge one-page anchor routing.
   All tools load on the homepage, not through navigation or iframes.
   Official Finansportalen comparison remains opt-in and embedded separately. */
(function(){
 'use strict';
 function openTarget(){
   const id=decodeURIComponent(window.location.hash.slice(1));
   if(!id)return;
   const target=document.getElementById(id);
   if(!target)return;
   // A link directly to an article opens it inline without a page transition.
   if(target.matches('details.long-guide'))target.open=true;
   const parent=target.closest('details.long-guide');
   if(parent)parent.open=true;
 }
 function closeMenu(){
   document.querySelectorAll('.mobile-menu[open]').forEach(menu=>menu.open=false);
 }
 function init(){
   document.querySelectorAll('a[href^="#"]').forEach(link=>{
     link.addEventListener('click',()=>{
       closeMenu();
       const targetId=link.getAttribute('href').slice(1);
       if(targetId) {
         const target=document.getElementById(targetId);
         if(target?.matches('details.long-guide'))target.open=true;
       }
     });
   });
   window.addEventListener('hashchange',openTarget);
   openTarget();
 }
 document.addEventListener('DOMContentLoaded',init);
})();
