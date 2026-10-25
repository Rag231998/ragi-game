/* Public Animation Studio player: CMS-controlled, security-validated sources only. */
(()=>{'use strict';
const MODULES={
 home:{root:'#loan-showcase',caption:'Forside',position:'after'},
 loans:{root:'#sjekk',caption:'Boliglån'},budget:{root:'#budsjett',caption:'Budsjett'},
 receipts:{root:'#kvitteringer',fallback:'.receipt-tour',caption:'Kvitteringsstudio'},
 valuation:{root:'#utleie',fallback:'#pv-valuation-guide',caption:'Boligverdi'},
 rental:{root:'#utleie',fallback:'#pv-rental-guide',caption:'Utleieanalyse'},
 savings:{root:'#sparing',caption:'Sparing'},
 investing:{root:'#investering',caption:'Fond og aksjer'},
 carloan:{root:'#billan',caption:'Billån'},currency:{root:'#valutakompass',caption:'Valutakompass'},
 academy:{root:'#akademi',caption:'Læringsplattform'}
};
const BASE='https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/';
function valid(url,type){
 if(typeof url!=='string'||!url.startsWith(BASE))return false;
 const path=url.slice(BASE.length);
 return type==='video'?/^video\/[a-z0-9_-]+\.(mp4|webm)$/i.test(path):/^poster\/[a-z0-9_-]+\.(png|jpe?g|webp)$/i.test(path);
}
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const stopped=()=>document.documentElement.classList.contains('motion-stopped')||document.documentElement.classList.contains('cms-stop-demo-motion');
let elements=new Map(),auto=true,observer;
function safePlay(video){
 if(!video.isConnected||!video.closest('[data-portal-view]:not([hidden])')&&video.closest('[data-portal-view]'))return;
 if(stopped()||reduced()||document.hidden||!auto){video.pause();return}
 const attempt=video.play();if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{});
}
function playback(){
 for(const entry of elements.values()){
  const video=entry.video;if(!video)continue;
  if(stopped()||reduced()||document.hidden||!auto)video.pause();
  else if(entry.visible!==false)safePlay(video);
 }
}
function ensureObserver(){
 if(observer||!('IntersectionObserver' in window))return;
 observer=new IntersectionObserver(items=>{for(const e of items){const entry=[...elements.values()].find(x=>x.video===e.target);if(!entry)continue;entry.visible=e.isIntersecting;if(!e.isIntersecting)e.target.pause();else safePlay(e.target)}},{threshold:.2});
}
function build(name,slot){
 const config=MODULES[name],root=document.querySelector(config.root);if(!root||!valid(slot.videoUrl,'video'))return null;
 const section=document.createElement('div');section.className='studio-video-showcase';section.dataset.mediaSlot=name;
 if(name==='home')section.dataset.portalView='home';
 section.setAttribute('aria-label','Produktvideo: '+(slot.title||config.caption));
 const display=document.createElement('div');display.className='studio-video-frame';
 const video=document.createElement('video');video.className='studio-video-player';video.muted=true;video.defaultMuted=true;
 video.autoplay=true;video.loop=slot.loop!==false;video.playsInline=true;video.preload='none';video.disablePictureInPicture=true;
 video.setAttribute('aria-label',slot.title||config.caption);
 if(valid(slot.posterUrl,'poster'))video.poster=slot.posterUrl;
 video.style.objectFit=slot.fit==='contain'?'contain':'cover';
 const source=document.createElement('source');source.src=slot.videoUrl;source.type=slot.videoUrl.endsWith('.webm')?'video/webm':'video/mp4';
 video.append(source);display.append(video);
 // Browsers only allow automatic playback without audio. A visible user-activated
 // audio control is needed for AI presenter speech; it never auto-unmutes.
 const sound=document.createElement('button');sound.type='button';sound.className='studio-video-sound';
 sound.textContent='◖ Slå på lyd';sound.setAttribute('aria-label','Slå på lyd på produktvideo');
 sound.setAttribute('aria-pressed','false');
 sound.addEventListener('click',()=>{
  video.muted=!video.muted;
  sound.textContent=video.muted?'◖ Slå på lyd':'◖ Slå av lyd';
  sound.setAttribute('aria-label',video.muted?'Slå på lyd på produktvideo':'Slå av lyd på produktvideo');
  sound.setAttribute('aria-pressed',String(!video.muted));
  if(!video.muted){const playing=video.play();if(playing?.catch)playing.catch(()=>{})}
 });
 display.append(sound);
 const copy=document.createElement('div');copy.className='studio-video-copy';
 const eyebrow=document.createElement('span');eyebrow.textContent='LÅNESJEKK NORGE · PRODUKTDEMO';
 const title=document.createElement('h2');title.textContent=slot.title||('Oppdag '+config.caption);
 copy.append(eyebrow,title);
 if(slot.description){const p=document.createElement('p');p.textContent=slot.description;copy.append(p)}
 section.append(display,copy);
 if(config.position==='after')root.insertAdjacentElement('afterend',section);
 else if(config.fallback){const item=document.querySelector(config.fallback);if(item)item.insertAdjacentElement('afterend',section);else root.prepend(section)}
 else{const header=root.querySelector(':scope > .tool-hero, :scope > .budget-hero, :scope > .receipt-hero');if(header)header.insertAdjacentElement('afterend',section);else root.prepend(section)}
 return {element:section,video,visible:false};
}
function apply(media,animations){
 auto=animations?.autoplay!==false;
 // Restore native demos first. A previous CMS version may have replaced them with video.
 for(const [name,definition] of Object.entries(MODULES)){
  if(!definition.fallback)continue;
  const native=document.querySelector(definition.fallback);
  if(native)native.hidden=animations?.[name]===false;
 }
 for(const [key,old] of elements){observer?.unobserve(old.video);old.video.pause();old.element.remove();elements.delete(key)}
 for(const [key,slot] of Object.entries(media?.slots||{})){
  if(!Object.hasOwn(MODULES,key)||slot?.enabled===false||!valid(slot?.videoUrl,'video'))continue;
  const entry=build(key,slot);if(!entry)continue;elements.set(key,entry);
  if(MODULES[key].fallback){const old=document.querySelector(MODULES[key].fallback);if(old)old.hidden=true}
 }
 ensureObserver();
 for(const entry of elements.values()){
  if(observer)observer.observe(entry.video);else{entry.visible=true;safePlay(entry.video)}
 }
 playback();
}
document.addEventListener('visibilitychange',playback);
window.addEventListener('lanesjekk-motion-change',playback);
window.addEventListener('pageshow',playback);
window.lanesjekkSiteMedia={apply,valid};
})();
