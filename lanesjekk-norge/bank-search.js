/* Licensed-bank directory search UX: instant, client-side, no query transmission.
 * Vetted legal entities only, linked to Finanstilsynet's primary registry.
 * No recommendations, sponsorship, live rates, search telemetry or tracking. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),banks=window.LANEBANKER||[];
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nb-NO').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
let query='',focusIndex=-1,visible=[],renderTimer=0;
const bankLogo=(b)=>{
 const frame=document.createElement('span');frame.className='bank-symbol';frame.style.setProperty('--bank-tint',b.color);
 const fallback=document.createElement('span');fallback.className='bank-initials';fallback.textContent=b.initials;frame.append(fallback);
 // The website icon comes from the bank's official domain (not an image-search proxy).
 // Lazy loading limits outgoing requests to on-screen results. Optional images may fail.
 const img=document.createElement('img');img.alt='';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
 img.src='https://'+b.domain+'/favicon.ico';img.className='bank-favicon';img.hidden=true;
 img.addEventListener('load',()=>{if(img.naturalWidth>=16){img.hidden=false;fallback.hidden=true}});
 img.addEventListener('error',()=>{img.remove();fallback.hidden=false});
 frame.append(img);return frame;
};
function card(bank,i){
 const c=document.createElement('article');c.className='bank-card';c.dataset.bank=bank.id;c.setAttribute('role','listitem');
 const logo=bankLogo(bank);
 const text=document.createElement('div');text.className='bank-desc';
 const title=document.createElement('strong');title.textContent=bank.name;title.className='bank-name';
 const legal=document.createElement('span');legal.className='bank-legal';legal.textContent=bank.legal+' · '+bank.region;
 const status=document.createElement('div');status.className='bank-proof';status.textContent=bank.region.startsWith('Bankkonsept')?'✓ Merkevare under registrert bank':'✓ Foretak i Finanstilsynets register';
 text.append(title,legal,status);
 const btnArea=document.createElement('div');btnArea.className='bank-cta';
 const select=document.createElement('button');select.type='button';select.className='bank-select';
 select.textContent='Sammenlign +';select.setAttribute('aria-label','Legg til '+bank.name+' for sammenligning');
 select.addEventListener('click',()=>{
   const success=window.lanesjekkAddBank?.(bank.id);
   if(success){$('bank-query').value='';query='';render();$('sammenlign').scrollIntoView({behavior:'smooth',block:'start'})}
 });
 const ext=document.createElement('a');ext.href=bank.register;ext.target='_blank';ext.rel='noopener noreferrer';ext.textContent='Se banktillatelse ↗';ext.className='bank-register';
 const visit=document.createElement('a');visit.href=bank.site;visit.target='_blank';visit.rel='noopener noreferrer';visit.textContent='Bankens nettsted ↗';visit.className='bank-website';
 btnArea.append(select,ext,visit);c.append(logo,text,btnArea);return c;
}
function rank(b,q){
 const name=normalize(b.name),legal=normalize(b.legal),org=normalize(b.org);
 if(!q)return 5;
 if(name===q||org===q)return 0;
 if(name.startsWith(q))return 1;
 if(name.split(' ').some(s=>s.startsWith(q)))return 2;
 if(legal.includes(q))return 3;
 return 4;
}
function filtered(q){
 const t=normalize(q);
 return banks.filter(b=>!t||[b.name,b.legal,b.org,b.region].some(x=>normalize(x).includes(t)))
 .sort((a,b)=>rank(a,t)-rank(b,t)||a.name.localeCompare(b.name,'nb'));
}
function render(){
 const root=$('bank-results');if(!root)return;
 const q=normalize(query),rows=filtered(q);visible=rows;focusIndex=-1;root.replaceChildren();
 $('bank-count').textContent=rows.length+' av '+banks.length+' banker / bankkonsepter';
 $('bank-clear').hidden=!query.trim();
 if(rows.length===0){
  const e=document.createElement('div');e.className='bank-empty';
  const h=document.createElement('strong');h.textContent='Ingen treff i den kontrollerte banklisten';
  const p=document.createElement('p');p.textContent='Prøv bankens juridiske navn, et kortere søk eller organisasjonsnummer. Vi viser bare bankforetak og konsepter der ansvarlig bank er dokumentert.';
  const clear=document.createElement('button');clear.type='button';clear.className='light-button';clear.textContent='Vis alle banker';
  clear.onclick=()=>{$('bank-query').value='';query='';render();$('bank-query').focus()};
  e.append(h,p,clear);root.append(e);
 }else{
  for(const [i,b] of rows.entries())root.append(card(b,i));
 }
 $('bank-help').textContent=q?'Søket viser banker eller bankkonsepter under registrerte foretak. Tilbudsrenten må oppgis av deg.':'Velg en bank for å sammenligne et faktisk tilbud. Alfabetisk oversikt – ingen betalt plassering.';
}
function handleKey(e){
 if(e.key==='Escape'){$('bank-query').value='';query='';render();return}
 if(e.key==='Enter'){
  e.preventDefault();
  if(visible.length===1){window.lanesjekkAddBank?.(visible[0].id);$('sammenlign').scrollIntoView({behavior:'smooth',block:'start'})}
  else if(focusIndex>=0&&visible[focusIndex]){
   const target=$('bank-results').querySelectorAll('.bank-select')[focusIndex];target?.click();
  }
  return;
 }
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  e.preventDefault();if(!visible.length)return;
  focusIndex=e.key==='ArrowDown'?Math.min(visible.length-1,focusIndex+1):Math.max(0,focusIndex-1);
  const cards=$('bank-results').querySelectorAll('.bank-card');
  cards.forEach((c,i)=>c.classList.toggle('bank-card-focus',i===focusIndex));
  cards[focusIndex]?.scrollIntoView({block:'nearest'});
 }
}
function boot(){
 if(!$('bank-query')||!$('bank-results'))return;
 const input=$('bank-query');
 input.addEventListener('input',()=>{query=input.value;render()});
 input.addEventListener('keydown',handleKey);
 $('bank-clear').addEventListener('click',()=>{input.value='';query='';render();input.focus()});
 const chips=document.querySelectorAll('[data-bank-quick]');
 chips.forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.bankQuick;query=input.value;render();input.focus()}));
 render();
}
document.addEventListener('DOMContentLoaded',boot);
window.lanesjekkBankSearchTests={normalize,filtered,rank};
})();