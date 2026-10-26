(()=>{'use strict';
const button=document.getElementById('ln-assistant-open');
if(!button)return;
const key='ln-assistant-floating-position-v2',gap=12,threshold=9;
button.setAttribute('title','Trykk for hjelp. Hold og dra for å flytte knappen.');
button.setAttribute('aria-label','Åpne assistenten. Knappen kan flyttes med fingeren.');
const clamp=(n,min,max)=>Math.min(Math.max(n,min),Math.max(min,max));
function bounds(){
 const v=window.visualViewport;
 const left=v?.offsetLeft||0,top=v?.offsetTop||0,w=v?.width||innerWidth,h=v?.height||innerHeight;
 return {left:left+gap,top:top+gap,right:left+w-gap-button.offsetWidth,bottom:top+h-gap-button.offsetHeight};
}
function position(x,y){const b=bounds();button.style.position='fixed';button.style.left=clamp(x,b.left,b.right)+'px';button.style.top=clamp(y,b.top,b.bottom)+'px';button.style.right='auto';button.style.bottom='auto'}
function persist(){try{const b=bounds(),r=button.getBoundingClientRect();localStorage.setItem(key,JSON.stringify({x:(r.left-b.left)/Math.max(1,b.right-b.left),y:(r.top-b.top)/Math.max(1,b.bottom-b.top)}))}catch{}}
function restore(){try{const p=JSON.parse(localStorage.getItem(key)||'null');if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;const b=bounds();position(b.left+clamp(p.x,0,1)*(b.right-b.left),b.top+clamp(p.y,0,1)*(b.bottom-b.top))}catch{}}
let down=null,suppressUntil=0;
button.addEventListener('pointerdown',e=>{
 if(e.button!==0&&e.pointerType!=='touch')return;
 const r=button.getBoundingClientRect();down={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top,drag:false};
 try{button.setPointerCapture(e.pointerId)}catch{}
});
button.addEventListener('pointermove',e=>{
 if(!down||e.pointerId!==down.id)return;
 const dx=e.clientX-down.x,dy=e.clientY-down.y;
 if(!down.drag&&Math.hypot(dx,dy)>threshold){down.drag=true;button.classList.add('ln-dragging')}
 if(!down.drag)return;
 e.preventDefault();position(down.left+dx,down.top+dy)
});
function stop(e){if(!down||e.pointerId!==down.id)return;
 if(down.drag){suppressUntil=performance.now()+450;persist();button.classList.remove('ln-dragging')}
 down=null;
 try{button.releasePointerCapture(e.pointerId)}catch{}
}
button.addEventListener('pointerup',stop);
button.addEventListener('pointercancel',stop);
button.addEventListener('click',e=>{if(performance.now()>suppressUntil)return;e.preventDefault();e.stopImmediatePropagation();suppressUntil=0},true);
button.addEventListener('keydown',e=>{
 if(!e.altKey||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;
 e.preventDefault();const r=button.getBoundingClientRect();position(r.left+(e.key==='ArrowLeft'?-24:e.key==='ArrowRight'?24:0),r.top+(e.key==='ArrowUp'?-24:e.key==='ArrowDown'?24:0));persist()
});
window.addEventListener('resize',()=>{const r=button.getBoundingClientRect();position(r.left,r.top)},{passive:true});
window.visualViewport?.addEventListener('resize',()=>{const r=button.getBoundingClientRect();position(r.left,r.top)},{passive:true});
restore();
})();
