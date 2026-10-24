(()=>{'use strict';
const scenes=[
{num:'01',tag:'BOLIGLÅN',title:'Hva skjer når renten endres?',sub:'Lavere rente kan bety flere tusen kroner spart hvert år.',a:'4 000 000 kr',b:'5,25 %',c:'4,75 %',result:'Omtrent 13 500 kr mindre i rente første år',note:'Illustrasjon: 0,50 prosentpoeng lavere rente på 4 mill. i lån.'},
{num:'02',tag:'BUDSJETT',title:'Hvor blir pengene av?',sub:'Del inntekten opp i bolig, mat, transport og sparing.',a:'55 000 kr',b:'38 000 kr',c:'17 000 kr',result:'Se hva du kan sette av hver måned',note:'Eksempel før skatt og andre individuelle forhold.'},
{num:'03',tag:'SPARING',title:'Små beløp blir store over tid',sub:'Forstå hvordan faste sparebeløp og avkastning påvirker resultatet.',a:'2 000 kr',b:'12 mnd.',c:'24 000 kr',result:'Et helt års sparing – før eventuell avkastning',note:'Eksempel uten forutsetning om markedsavkastning.'},
{num:'04',tag:'VALUTAKOMPASS',title:'Hva koster ferien egentlig?',sub:'Fra norsk beløp til utenlandsk valuta – og tilbake til kortregningen.',a:'10 000 kr',b:'Referansekurs',c:'Kortgebyr',result:'Se forskjellen før du betaler',note:'Kurs og gebyr er ikke sanntidsverdier i demonstrasjonen.'}
];
function init(){
const hero=document.getElementById('loan-showcase');if(!hero)return;
if(document.getElementById('ln-explainer'))return;
const wrap=document.createElement('section');wrap.id='ln-explainer';wrap.dataset.portalView='home';wrap.className='ln-explainer';wrap.setAttribute('aria-label','Animerte forklaringer av økonomiverktøyene');
wrap.innerHTML='<div class="ln-explainer-top"><div><span class="ln-explainer-kicker">LÅNESJEKK NORGE · ANIMERTE FORKLARINGER</span><h2>Se hva tallene betyr. <em>På 40 sekunder.</em></h2><p>Fire korte animasjoner gjør økonomi lettere å forstå.</p></div><div class="ln-explainer-count" aria-live="off">01 / 04</div></div><div class="ln-explainer-screen"><div class="ln-scene-copy"><div class="ln-scene-tag">BOLIGLÅN</div><h3 class="ln-scene-title"></h3><p class="ln-scene-sub"></p><strong class="ln-scene-result"></strong><small class="ln-scene-note"></small></div><div class="ln-scene-motion" aria-hidden="true"><div class="ln-orbit"><span>kr</span></div><div class="ln-number ln-number-one"></div><div class="ln-number ln-number-two"></div><div class="ln-number ln-number-three"></div><div class="ln-motion-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="ln-motion-path"></div></div></div><div class="ln-explainer-bottom"><div class="ln-explainer-progress"><span></span></div><div class="ln-explainer-dots" aria-label="Velg animasjon"></div><a href="#sjekk" class="ln-explainer-cta">Prøv verktøyet →</a></div>';
hero.insertAdjacentElement('afterend',wrap);
let index=0,timer=null;const change=()=>{
 const scene=scenes[index];wrap.querySelector('.ln-explainer-count').textContent=scene.num+' / 04';
 for(const [sel,key] of [['.ln-scene-tag','tag'],['.ln-scene-title','title'],['.ln-scene-sub','sub'],['.ln-scene-result','result'],['.ln-scene-note','note']])wrap.querySelector(sel).textContent=scene[key];
 for(const [sel,key] of [['.ln-number-one','a'],['.ln-number-two','b'],['.ln-number-three','c']])wrap.querySelector(sel).textContent=scene[key];
 wrap.dataset.scene=scene.num;wrap.querySelector('.ln-explainer-cta').href=['#sjekk','#budsjett','#sparing','#sparing'][index];
 wrap.querySelectorAll('.ln-explainer-dots button').forEach((b,i)=>{b.setAttribute('aria-current',String(i===index));b.setAttribute('aria-label','Vis '+scenes[i].tag.toLowerCase())});
 wrap.classList.remove('ln-playing');void wrap.offsetWidth;wrap.classList.add('ln-playing');
 };
const dots=wrap.querySelector('.ln-explainer-dots');scenes.forEach((scene,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.addEventListener('click',()=>{index=i;change();restart()});dots.append(b)});
function restart(){clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{if(document.hidden||hero.hidden||document.body.dataset.activeView!=='home')return;index=(index+1)%scenes.length;change()},10000)}
change();restart();document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(timer);else restart()});
}
document.addEventListener('DOMContentLoaded',init);
})();
