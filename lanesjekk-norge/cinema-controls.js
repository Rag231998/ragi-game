(()=>{'use strict';document.addEventListener('DOMContentLoaded',()=>{
 const hero=document.querySelector('.cinematic-hero'),toggle=document.querySelector('.cinema-motion-toggle');
 if(!hero||!toggle)return;
 const video=hero.querySelector('.cinema-human-video');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const blocked=()=>reduced.matches||document.documentElement.classList.contains('cms-pause-hero-motion')||document.documentElement.classList.contains('cms-hide-hero-visual');
 if(reduced.matches)hero.classList.add('cinema-paused');
 if(video){
   video.addEventListener('playing',()=>video.classList.add('is-ready'));
   video.addEventListener('error',()=>video.classList.remove('is-ready'));
   video.addEventListener('stalled',()=>video.classList.remove('is-ready'));
 }
 function update(){
   const paused=hero.classList.contains('cinema-paused')||blocked();
   toggle.setAttribute('aria-pressed',String(paused));
   toggle.setAttribute('aria-label',paused?'Spill forsideanimasjonen':'Sett forsideanimasjonen på pause');
   toggle.textContent=paused?'▶ Spill':'Ⅱ Pause';
   if(video){if(paused){video.pause();video.classList.remove('is-ready')}
    else video.play().catch(()=>video.classList.remove('is-ready'));}
 }
 toggle.addEventListener('click',()=>{if(blocked())return;hero.classList.toggle('cinema-paused');update()});
 document.addEventListener('visibilitychange',()=>{if(video){if(document.hidden)video.pause();else update()}});
 const watcher=new MutationObserver(update);
 watcher.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 update();
})})();