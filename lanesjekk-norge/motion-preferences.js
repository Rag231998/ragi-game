(()=>{'use strict';
const CLASS='motion-stopped';
function boot(){
 const button=document.getElementById('motion-toggle');if(!button)return;
 let stored=false;try{stored=localStorage.getItem('lanesjekk-reduce-motion')==='yes'}catch{}
 const preferred=window.matchMedia('(prefers-reduced-motion: reduce)');
 let disabled=stored||preferred.matches;
 function apply(){document.documentElement.classList.toggle(CLASS,disabled);button.textContent=disabled?'Tillat animasjoner':'Slå av animasjoner';button.setAttribute('aria-pressed',String(disabled));window.dispatchEvent(new CustomEvent('lanesjekk-motion-change',{detail:{disabled}}))}
 button.addEventListener('click',()=>{disabled=!disabled;try{localStorage.setItem('lanesjekk-reduce-motion',disabled?'yes':'no')}catch{}apply()});
 preferred.addEventListener?.('change',e=>{if(e.matches){disabled=true;apply()}});
 apply()
}
document.addEventListener('DOMContentLoaded',boot)
})();