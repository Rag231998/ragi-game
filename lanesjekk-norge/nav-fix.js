/* Only one accessible dropdown open at a time. Close on outside click and Escape. */
(()=>{document.addEventListener('DOMContentLoaded',()=>{
 const groups=[...document.querySelectorAll('.site-header .portal-nav > details.nav-group')];
 for(const group of groups){group.addEventListener('toggle',()=>{if(group.open)for(const other of groups)if(other!==group)other.open=false});
  group.querySelectorAll('.nav-drop a').forEach(a=>a.addEventListener('click',()=>{group.open=false}));
 }
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.site-header .portal-nav'))for(const g of groups)g.open=false});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const g of groups)g.open=false});
});})();