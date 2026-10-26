(()=>{'use strict';
const menu=document.querySelector('.site-header .mobile-menu');
if(!menu)return;
const groups=[...menu.querySelectorAll('.mobile-menu-category')];
groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.forEach(other=>{if(other!==group)other.open=false})}));
document.addEventListener('pointerdown',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector(':scope > summary')?.focus()}});
menu.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{menu.open=false}));
})();