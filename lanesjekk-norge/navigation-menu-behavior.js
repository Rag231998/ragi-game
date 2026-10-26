(()=>{'use strict';
const menu=document.querySelector('.site-header .mobile-menu');
if(!menu)return;
const trigger=menu.querySelector(':scope > summary');
const panel=menu.querySelector(':scope > .mobile-menu-panel');
if(!trigger||!panel)return;
panel.id='global-menu-panel';document.body.appendChild(panel);
const groups=[...panel.querySelectorAll('.mobile-menu-category')];
let isOpen=false;
function position(){const rect=trigger.getBoundingClientRect();const narrow=innerWidth<640;panel.style.top=Math.max(8,Math.round(rect.bottom+8))+'px';panel.style.left=narrow?'12px':'auto';panel.style.right=narrow?'12px':Math.max(12,Math.round(innerWidth-rect.right))+'px';panel.style.width=narrow?'auto':'min(410px, calc(100vw - 24px))';panel.style.maxHeight=Math.max(160,Math.floor(innerHeight-rect.bottom-24))+'px'}
function setOpen(next){isOpen=!!next;menu.open=false;trigger.setAttribute('aria-expanded',String(isOpen));panel.hidden=!isOpen;if(isOpen)position()}
panel.hidden=true;trigger.setAttribute('aria-controls','global-menu-panel');trigger.setAttribute('aria-expanded','false');
trigger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setOpen(!isOpen)});
groups.forEach(g=>g.addEventListener('toggle',()=>{if(g.open)groups.forEach(other=>{if(other!==g)other.open=false})}));
document.addEventListener('pointerdown',e=>{if(isOpen&&!panel.contains(e.target)&&!trigger.contains(e.target))setOpen(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen){setOpen(false);trigger.focus()}});
panel.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
addEventListener('resize',()=>{if(isOpen)position()});addEventListener('scroll',()=>{if(isOpen)position()},{passive:true});
})();