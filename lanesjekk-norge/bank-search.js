/* Lånesjekk Norge: fast bank discovery without transmitting the query.
 * Two interfaces: curated cards and searchable current-bank combobox.
 * Listing is NOT a live mortgage product quote or comprehensive license audit. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const banks=window.LANEBANKER||[];
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nb-NO').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 let query='',focusIndex=-1,visible=[],limit=8,filteredBanks=[];
 const sorted=(a,b)=>a.name.localeCompare(b.name,'nb');
 function rank(bank,q){
  const name=normalize(bank.name),legal=normalize(bank.legal),org=normalize(bank.org);
  if(!q)return bank.registryVerified?0:2;
  if(name===q||org===q)return 0;
  if(name.startsWith(q))return 1;
  if(name.split(' ').some(p=>p.startsWith(q)))return 2;
  if(legal.includes(q))return 3;
  return 4;
 }
 function filtered(q){
  const t=normalize(q);
  return banks.filter(b=>!t||[b.name,b.legal,b.org,b.region].some(x=>normalize(x).includes(t)))
   .sort((a,b)=>rank(a,t)-rank(b,t)||sorted(a,b));
 }
 function bankLogo(bank){
  const symbol=document.createElement('span');
  symbol.className='bank-symbol';
  symbol.style.setProperty('--bank-tint',bank.color||'#254965');
  const fallback=document.createElement('span');
  fallback.className='bank-initials';
  fallback.textContent=bank.initials||bank.name.slice(0,2).toUpperCase();
  symbol.append(fallback);
  const candidates=[];
  if(bank.logo)candidates.push(bank.logo);
  if(bank.domain)candidates.push('https://'+bank.domain+'/favicon.ico');
  if(!candidates.length)return symbol;
  const img=document.createElement('img');
  img.alt='';
  img.className='bank-official-logo';
  img.referrerPolicy='no-referrer';
  img.loading='lazy';
  img.decoding='async';
  img.hidden=true;
  let index=0;
  function tryNext(){
   if(index>=candidates.length){img.remove();fallback.hidden=false;return}
   img.src=candidates[index++];
  }
  img.addEventListener('load',()=>{
   if(img.naturalWidth>=16){fallback.hidden=true;img.hidden=false}
   else tryNext();
  });
  img.addEventListener('error',tryNext);
  symbol.append(img);
  tryNext();
  return symbol;
 }
 function link(text,url,css){
  const a=document.createElement('a');a.className=css;
  a.href=url;a.target='_blank';a.rel='noopener noreferrer';
  a.textContent=text;return a;
 }
 function bankCard(bank){
  const card=document.createElement('article');
  card.className='bank-card';card.dataset.bank=bank.id;card.setAttribute('role','listitem');
  const description=document.createElement('div');description.className='bank-desc';
  const name=document.createElement('strong');name.className='bank-name';name.textContent=bank.name;
  const sub=document.createElement('span');sub.className='bank-legal';
  sub.textContent=bank.registryVerified?bank.legal+' · '+bank.region:bank.legal;
  const status=document.createElement('div');status.className='bank-proof';
  status.textContent=bank.region.startsWith('Bankkonsept')?'Bankkonsept under registrert bank':
   bank.registryVerified?'Oppføring i Finanstilsynets register':
   'Oppført hos Norges Bank · ikke enkeltverifisert';
  description.append(name,sub,status);
  const actions=document.createElement('div');actions.className='bank-cta';
  const select=document.createElement('button');select.type='button';select.className='bank-select';
  select.textContent='Sammenlign bank';
  select.setAttribute('aria-label','Legg til '+bank.name+' for sammenligning');
  select.addEventListener('click',()=>{
    const success=window.lanesjekkAddBank?.(bank.id);
    if(success){$('bank-query').value='';query='';limit=8;render();$('sammenlign').scrollIntoView({behavior:'smooth',block:'start'})}
  });
  actions.append(select);
  actions.append(link(bank.registryVerified?'Se registrering ↗':'Søk i Finanstilsynet ↗',bank.register,'bank-register'));
  if(bank.site)actions.append(link('Bankens nettsted ↗',bank.site,'bank-website'));
  else actions.append(link('Kilde: Norges Bank ↗',bank.sourceUrl,'bank-website'));
  card.append(bankLogo(bank),description,actions);return card;
 }
 function render(){
  const root=$('bank-results');if(!root)return;
  filteredBanks=filtered(query);visible=filteredBanks.slice(0,limit);focusIndex=-1;
  root.replaceChildren();
  $('bank-count').textContent='Viser '+visible.length+' av '+filteredBanks.length+' treff · '+banks.length+' banker og bankkonsepter i listen';
  $('bank-clear').hidden=!query.trim();
  $('bank-more').hidden=filteredBanks.length<=visible.length;
  if(!filteredBanks.length){
    const e=document.createElement('div');e.className='bank-empty';
    const title=document.createElement('strong');title.textContent='Ingen treff i den oppførte banklisten';
    const p=document.createElement('p');p.textContent='Prøv et kortere banknavn eller organisasjonsnummer. Listen er utvidet, men ikke et fullstendig sanntidsregister.';
    const clear=document.createElement('button');clear.type='button';clear.className='light-button';clear.textContent='Nullstill søket';
    clear.addEventListener('click',()=>{query='';$('bank-query').value='';limit=8;render();$('bank-query').focus()});
    e.append(title,p,clear);root.append(e);
  }else for(const bank of visible)root.append(bankCard(bank));
  $('bank-help').textContent=query.trim()?'Søker i hele listen. Det er bare dine oppgitte renter som brukes i låneberegningen.':
    'Utvalgte banker vises først. Søk eller velg «Vis flere» for hele banklisten. Oppført bank betyr ikke at banken tilbyr boliglån.';
 }
 function moveFocus(e){
  if(e.key==='Escape'){query='';$('bank-query').value='';limit=8;render();return}
  if(e.key==='Enter'){
   e.preventDefault();
   if(visible.length===1)$('bank-results').querySelector('.bank-select')?.click();
   else if(focusIndex>=0)$('bank-results').querySelectorAll('.bank-select')[focusIndex]?.click();
  }
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   e.preventDefault();if(!visible.length)return;
   focusIndex=e.key==='ArrowDown'?Math.min(visible.length-1,focusIndex+1):Math.max(0,focusIndex-1);
   $('bank-results').querySelectorAll('.bank-card').forEach((c,i)=>c.classList.toggle('bank-card-focus',i===focusIndex));
   $('bank-results').querySelectorAll('.bank-card')[focusIndex]?.scrollIntoView({block:'nearest'});
  }
 }
 function currentBankPicker(){
  const input=$('currentbank'),popup=$('currentbank-results');if(!input||!popup)return;
  let idx=-1,choices=[];
  function close(){popup.hidden=true;popup.replaceChildren();input.setAttribute('aria-expanded','false');idx=-1}
  function choose(bank){
   input.value=bank.name;input.dataset.bankId=bank.id;close();
   input.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function show(){
   const q=input.value.trim();
   popup.replaceChildren();idx=-1;
   if(!q||input.dataset.bankId){close();return}
   choices=filtered(q).slice(0,8);
   if(!choices.length){
    const note=document.createElement('div');note.className='bank-autocomplete-empty';note.textContent='Ingen banktreff – prøv et annet navn';
    popup.append(note);
   }else for(const [i,bank] of choices.entries()){
    const choice=document.createElement('button');choice.type='button';
    choice.className='bank-autocomplete-option';choice.setAttribute('role','option');
    choice.setAttribute('aria-selected','false');
    const name=document.createElement('span');name.textContent=bank.name;
    const source=document.createElement('small');source.textContent=bank.registryVerified?'Finanstilsynet':'Norges Bank';
    choice.append(name,source);
    choice.addEventListener('pointerdown',event=>event.preventDefault());
    choice.addEventListener('click',()=>choose(bank));
    popup.append(choice);
   }
   popup.hidden=false;input.setAttribute('aria-expanded','true');
  }
  input.addEventListener('input',()=>{input.dataset.bankId='';show()});
  input.addEventListener('focus',show);
  input.addEventListener('keydown',event=>{
   if(event.key==='Escape'){close();return}
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    if(popup.hidden)show();
    if(!choices.length)return;
    event.preventDefault();
    idx=event.key==='ArrowDown'?Math.min(choices.length-1,idx+1):Math.max(0,idx-1);
    popup.querySelectorAll('[role=option]').forEach((el,i)=>{
      el.classList.toggle('is-active',i===idx);
      el.setAttribute('aria-selected',String(i===idx));
    });
   }
   if(event.key==='Enter'&&!popup.hidden){
    event.preventDefault();
    if(choices.length)choose(choices[Math.max(0,idx)]);
   }
  });
  input.addEventListener('blur',()=>{
   // Browser click follows pointerdown; the option prevents focus loss.
   window.setTimeout(()=>{close();if(input.value.trim()&&!input.dataset.bankId)input.value=''},120);
  });
 }
 function boot(){
  if(!$('bank-query')||!$('bank-results')||!$('bank-more'))return;
  const input=$('bank-query');
  input.addEventListener('input',()=>{query=input.value;limit=12;render()});
  input.addEventListener('keydown',moveFocus);
  $('bank-clear').addEventListener('click',()=>{input.value='';query='';limit=8;render();input.focus()});
  $('bank-more').addEventListener('click',()=>{limit+=12;render()});
  document.querySelectorAll('[data-bank-quick]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.bankQuick;query=input.value;limit=12;render();input.focus()}));
  currentBankPicker();render();
 }
 document.addEventListener('DOMContentLoaded',boot);
 window.lanesjekkBankSearchTests={normalize,filtered,rank};
})();