(()=>{'use strict';
const menu=document.querySelector('.site-header .mobile-menu');
if(!menu)return;
const trigger=menu.querySelector(':scope > summary');
const panel=menu.querySelector(':scope > .mobile-menu-panel');
if(!trigger||!panel)return;
const groups=[...panel.querySelectorAll('.mobile-menu-category')];
function place(){const rect=trigger.getBoundingClientRect();const narrow=window.innerWidth<=600;panel.style.position='fixed';panel.style.top=Math.round(rect.bottom+10)+'px';panel.style.right=Math.max(12,Math.round(window.innerWidth-rect.right))+'px';panel.style.left=narrow?'12px':'auto';panel.style.width=narrow?'calc(100vw - 24px)':'min(410px, calc(100vw - 24px))';panel.style.maxHeight=Math.max(180,Math.floor(window.innerHeight-rect.bottom-25))+'px';}
function setOpen(open){menu.open=Boolean(open);trigger.setAttribute('aria-expanded',String(Boolean(open)));if(open)place();}
trigger.setAttribute('aria-expanded',String(menu.open));
trigger.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setOpen(!menu.open)});
groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.forEach(other=>{if(other!==group)other.open=false})}));
document.addEventListener('pointerdown',event=>{if(menu.open&&!menu.contains(event.target))setOpen(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){setOpen(false);trigger.focus()}});
panel.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
window.addEventListener('resize',()=>{if(menu.open)place()});
window.addEventListener('scroll',()=>{if(menu.open)place()},{passive:true});
})();