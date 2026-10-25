/* Lånesjekk Norge — command-palette-style site search, no indexing service */
(()=>{'use strict';
const items=[
 ['Forside','Oversikt og verktøy','topp','home','hjem start oversikt'],
 ['Boliglån','Lån','sjekk','loans','boliglån rente terminbeløp avdrag nedbetaling'],
 ['Billån','Lån','billan','financing','billån bil finansiering leasing'],
 ['Forbrukslån','Lån','forbrukslan','financing','forbrukslån kreditt'],
 ['Norske banker','Lån','banker','banks','banker sammenlign bank'],
 ['Budsjett','Budsjett og forbruk','budsjett','budget','månedsplan utgifter inntekter'],
 ['Kvitteringsstudio','Budsjett og forbruk','kvitteringer','receipts','kvitteringer skanne bilde varer handleliste'],
 ['Sparekonto og renteberegning','Sparing','sparing','savings','sparing høyrentekonto rentekalkulator'],
 ['Fond og aksjer','Investering','investering','investing','fond aksjer indeksfond avkastning'],
 ['Valutakompass','Sparing og investering','valutakompass','currency','valuta kalkulator omregning kurs euro dollar svenske kroner reise kortgebyr'],
 ['Boligverdi','Eiendom','boligverdi','property','estimat estimert verdi adresse prisindeks kartverket ssb'],
 ['Utleieanalyse','Eiendom','utleieanalyse','property','utleie kontantstrøm eiendom leieinntekt avkastning'],
 ['Økonomiakademiet','Læring','akademi','academy','læring kurs økonomi'],
 ['Artikler og guider','Læring','guider','guides','tips fagartikler']
];
const fold=s=>s.toLocaleLowerCase('nb').normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
const $=id=>document.getElementById(id);
let active=-1,last=[],open=false,previousFocus=null;
function score(row,q){
 const terms=fold(q).split(/\s+/).filter(Boolean);
 if(!terms.length)return 1;
 const title=fold(row[0]),cat=fold(row[1]),keywords=fold(row[4]);
 const text=title+' '+cat+' '+keywords;
 if(!terms.every(term=>text.includes(term)))return -1;
 return terms.reduce((v,term)=>v+(title===term?100:title.startsWith(term)?32:title.includes(term)?15:cat.includes(term)?8:3),0);
}
function matches(text){return items.map(item=>({item,score:score(item,text)})).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score||a.item[0].localeCompare(b.item[0],'nb')).slice(0,13).map(x=>x.item)}
function draw(){
 const q=$('site-search-input')?.value||'',container=$('site-search-results');if(!container)return;
 last=matches(q);active=last.length?0:-1;container.replaceChildren();
 const field=$('site-search-input');if(field){if(active>=0)field.setAttribute('aria-activedescendant','site-search-option-0');else field.removeAttribute('aria-activedescendant');}
 if(!last.length){const p=document.createElement('p');p.className='site-search-empty';p.textContent='Ingen treff. Prøv «boligverdi», «sparing» eller «billån».';container.append(p);return}
 last.forEach((item,i)=>{
  const b=document.createElement('button');b.type='button';b.className='site-search-result';b.id='site-search-option-'+i;
  b.setAttribute('role','option');b.setAttribute('aria-selected',String(i===active));
  const icon=document.createElement('span');icon.className='site-search-result-icon';icon.textContent={home:'⌂',loans:'▤',financing:'▥',banks:'▦',budget:'▦',receipts:'▧',savings:'◈',investing:'↗',property:'⌂',academy:'✦',guides:'☷',currency:'⇄'}[item[3]]||'◈';
  const name=document.createElement('strong');name.textContent=item[0];
  const cat=document.createElement('small');cat.textContent=item[1];
  const arrow=document.createElement('span');arrow.className='site-search-result-arrow';arrow.textContent='↗';
  b.append(icon,name,cat,arrow);b.addEventListener('click',()=>go(item));container.append(b)
 });
}
function select(n){
 active=Math.max(0,Math.min(last.length-1,n));$('site-search-results').querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===active));button.classList.toggle('is-active',i===active)});
 const field=$('site-search-input');if(active>=0)field?.setAttribute('aria-activedescendant','site-search-option-'+active);else field?.removeAttribute('aria-activedescendant');
 $('site-search-option-'+active)?.scrollIntoView({block:'nearest'});
}
function go(item){close();if(typeof window.lanesjekkNavigate==='function')window.lanesjekkNavigate(item[2]);else location.hash=item[2]}
function show(){const box=$('site-search');if(!box)return;previousFocus=document.activeElement;document.querySelectorAll('.site-header details.nav-group[open]').forEach(el=>el.open=false);box.hidden=false;open=true;const field=$('site-search-input');if(field)field.value='';draw();field?.focus();document.body.classList.add('search-open')}
function close(){const box=$('site-search');if(!box||!open)return;box.hidden=true;open=false;document.body.classList.remove('search-open');if(previousFocus?.isConnected)previousFocus.focus();previousFocus=null}
function init(){
 const btn=$('site-search-open');if(!btn)return;
 btn.addEventListener('click',show);$('viewbar-switch')?.addEventListener('click',show);$('site-search-close').addEventListener('click',close);
 $('site-search-input').addEventListener('input',draw);
 $('site-search-input').addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(last.length)select((active+(event.key==='ArrowDown'?1:-1)+last.length)%last.length)}
  else if(event.key==='Enter'&&last[active]){event.preventDefault();go(last[active])}
 });
 $('site-search').addEventListener('pointerdown',event=>{if(event.target===$('site-search'))close()});
 document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open?close():show()}
  else if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!document.activeElement?.isContentEditable){event.preventDefault();show()}
  else if(event.key==='Escape'&&open){event.preventDefault();close()}
  else if(event.key==='Tab'&&open){const box=$('site-search');const focusable=[...box.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);if(!focusable.length)return;const first=focusable[0],lastItem=focusable[focusable.length-1];if(event.shiftKey&&(document.activeElement===first||!box.contains(document.activeElement))){event.preventDefault();lastItem.focus()}else if(!event.shiftKey&&(document.activeElement===lastItem||!box.contains(document.activeElement))){event.preventDefault();first.focus()}}
 });
}
document.addEventListener('DOMContentLoaded',init);
})();