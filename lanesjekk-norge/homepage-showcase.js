/* Premium campaign carousel — no network, no audio, respects admin & OS motion settings. */
(()=>{'use strict';
function init(){
 const root=document.getElementById('loan-showcase');if(!root)return;
 let scenes=[...root.querySelectorAll('.sc-slide')];const chapters=[...root.querySelectorAll('.sc-chapter')];
 const previous=root.querySelector('.sc-previous'),next=root.querySelector('.sc-next'),announcer=root.querySelector('.sc-announcer');
 if(scenes.length!==5||chapters.length!==5||!previous||!next)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,visible=true,timeout=null;
 const blocked=()=>reduced.matches||document.documentElement.classList.contains('cms-pause-hero-motion')||document.documentElement.classList.contains('cms-hide-hero-visual')||document.documentElement.classList.contains('motion-stopped');
 function clear(){if(timeout!==null){clearTimeout(timeout);timeout=null}}
 function stopCondition(){return blocked()||document.hidden||!visible||root.hidden||document.body.dataset.activeView!=='home'}
 function sync(){root.classList.toggle('sc-paused',blocked())}
 function display(index,announce=true){
  if(!scenes.length)return;
  current=(index+scenes.length)%scenes.length;
  scenes.forEach((s,i)=>{const active=i===current;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active;const a=s.querySelector('.sc-action');if(a)a.tabIndex=active?0:-1});
  chapters.forEach((b,i)=>{const active=Number(b.dataset.scGoto)===Number(scenes[current].dataset.scIndex);b.classList.toggle('is-active',active);b.setAttribute('aria-current',active?'true':'false')});
  if(announce)announcer.textContent='Viser scene '+(current+1)+' av 5: '+scenes[current].querySelector('.sc-eyebrow').textContent.trim();
 }
 function schedule(){clear();sync();if(scenes.length&&!stopCondition())timeout=setTimeout(()=>{display(current+1,false);schedule()},8300)}
 previous.addEventListener('click',()=>{display(current-1);schedule()});
 next.addEventListener('click',()=>{display(current+1);schedule()});
 chapters.forEach(b=>b.addEventListener('click',()=>{const ix=scenes.findIndex(s=>s.dataset.scIndex===b.dataset.scGoto);if(ix>=0)display(ix);schedule()}));

 document.addEventListener('visibilitychange',schedule);
 const obs=new MutationObserver(schedule);obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 if('IntersectionObserver' in window){const io=new IntersectionObserver(x=>{visible=x[0].isIntersecting;schedule()},{threshold:.08});io.observe(root);window.addEventListener('pagehide',()=>io.disconnect(),{once:true})}
 window.addEventListener('lanesjekk-slides-config',()=>{const enabled=[...root.querySelectorAll('.sc-slide')].filter(x=>x.dataset.cmsEnabled!=='false');chapters.forEach(b=>{b.hidden=!enabled.some(s=>s.dataset.scIndex===b.dataset.scGoto)});if(enabled.length){scenes=enabled;current=0;display(0,false)}else{scenes=[];clear()}schedule()});
 window.addEventListener('hashchange',schedule);
 window.addEventListener('pageshow',schedule);
 window.addEventListener('pagehide',clear,{once:true});
 display(0,false);schedule();
}
document.addEventListener('DOMContentLoaded',init);
})();
