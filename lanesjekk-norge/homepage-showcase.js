/* Premium campaign carousel — no network, no audio, respects admin & OS motion settings. */
(()=>{'use strict';
function init(){
 const root=document.getElementById('loan-showcase');if(!root)return;
 const scenes=[...root.querySelectorAll('.sc-slide')],chapters=[...root.querySelectorAll('.sc-chapter')];
 const previous=root.querySelector('.sc-previous'),next=root.querySelector('.sc-next'),pause=root.querySelector('.sc-pause'),announcer=root.querySelector('.sc-announcer');
 if(scenes.length!==5||chapters.length!==5||!previous||!next||!pause)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,manualPause=false,visible=true,timeout=null,focusInside=false,hovering=false;
 const blocked=()=>reduced.matches||document.documentElement.classList.contains('cms-pause-hero-motion')||document.documentElement.classList.contains('cms-hide-hero-visual');
 function clear(){if(timeout!==null){clearTimeout(timeout);timeout=null}}
 function stopCondition(){return manualPause||blocked()||document.hidden||!visible||focusInside||hovering||root.hidden||document.body.dataset.activeView!=='home'}
 function sync(){const paused=manualPause||blocked();root.classList.toggle('sc-paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Spill av scenene automatisk':'Pause automatisk avspilling');pause.innerHTML=paused?'▶ <span>Spill</span>':'Ⅱ <span>Pause</span>'}
 function display(index,announce=true){
  current=(index+scenes.length)%scenes.length;
  scenes.forEach((s,i)=>{const active=i===current;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active;const a=s.querySelector('.sc-action');if(a)a.tabIndex=active?0:-1});
  chapters.forEach((b,i)=>{b.classList.toggle('is-active',i===current);b.setAttribute('aria-current',i===current?'true':'false')});
  if(announce)announcer.textContent='Viser scene '+(current+1)+' av 5: '+scenes[current].querySelector('.sc-eyebrow').textContent.trim();
 }
 function schedule(){clear();sync();if(!stopCondition())timeout=setTimeout(()=>{display(current+1,false);schedule()},8300)}
 previous.addEventListener('click',()=>{display(current-1);schedule()});
 next.addEventListener('click',()=>{display(current+1);schedule()});
 chapters.forEach((b,i)=>b.addEventListener('click',()=>{display(i);schedule()}));
 pause.addEventListener('click',()=>{if(blocked())return;manualPause=!manualPause;schedule()});
 root.addEventListener('mouseenter',()=>{hovering=true;schedule()});
 root.addEventListener('mouseleave',()=>{hovering=false;schedule()});
 root.addEventListener('focusin',()=>{focusInside=true;schedule()});
 root.addEventListener('focusout',()=>{focusInside=root.contains(document.activeElement);schedule()});
 document.addEventListener('visibilitychange',schedule);
 const obs=new MutationObserver(schedule);obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 if('IntersectionObserver' in window){const io=new IntersectionObserver(x=>{visible=x[0].isIntersecting;schedule()},{threshold:.08});io.observe(root);window.addEventListener('pagehide',()=>io.disconnect(),{once:true})}
 window.addEventListener('hashchange',schedule);
 window.addEventListener('pageshow',schedule);
 window.addEventListener('pagehide',clear,{once:true});
 display(0,false);schedule();
}
document.addEventListener('DOMContentLoaded',init);
})();
