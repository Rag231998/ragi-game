(()=>{'use strict';document.addEventListener('DOMContentLoaded',()=>{
 const hero=document.querySelector('.cinematic-hero'),motion=document.querySelector('.cinema-motion-toggle'),sound=document.querySelector('.cinema-sound-toggle');
 if(!hero||!motion||!sound)return;
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 let ctx=null,oscillators=[],master=null, soundOn=false;
 if(media.matches)hero.classList.add('cinema-paused');
 const isBlocked=()=>media.matches||document.documentElement.classList.contains('cms-pause-hero-motion')||document.documentElement.classList.contains('cms-hide-hero-visual');
 const stopSound=()=>{soundOn=false;for(const o of oscillators){try{o.stop()}catch(e){}}oscillators=[];if(ctx){ctx.close().catch(()=>{});ctx=null}master=null;syncSound()};
 const syncSound=()=>{sound.setAttribute('aria-pressed',String(soundOn));sound.setAttribute('aria-label',soundOn?'Slå av bakgrunnslyd':'Spill av rolig bakgrunnslyd');sound.textContent=soundOn?'♫ Lyd på':'♫ Slå på lyd'};
 const syncMotion=()=>{const paused=hero.classList.contains('cinema-paused')||isBlocked();motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Spill forsideanimasjonen':'Sett forsideanimasjonen på pause');motion.textContent=paused?'▶ Spill':'Ⅱ Pause';if(isBlocked()&&soundOn)stopSound()};
 motion.addEventListener('click',()=>{if(isBlocked())return;hero.classList.toggle('cinema-paused');syncMotion()});
 sound.addEventListener('click',async()=>{
   if(soundOn){stopSound();return}
   if(isBlocked())return;
   const AudioContext=window.AudioContext||window.webkitAudioContext;
   if(!AudioContext){sound.textContent='Lyd støttes ikke';return}
   try{
     ctx=new AudioContext();await ctx.resume();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
     const notes=[130.81,196,261.63,329.63];for(const [i,freq] of notes.entries()){
       const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';osc.frequency.value=freq;g.gain.value=i===0?.11:.028;
       osc.connect(g);g.connect(master);osc.start();oscillators.push(osc);
     }
     master.gain.setTargetAtTime(.25,ctx.currentTime,.8);soundOn=true;syncSound();
   }catch(e){stopSound();sound.textContent='Kunne ikke spille lyd'}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&soundOn)stopSound()});
 new MutationObserver(syncMotion).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 syncMotion();syncSound();
})})();