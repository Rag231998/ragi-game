(()=>{'use strict';const $=id=>document.getElementById(id),M=n=>new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0}).format(n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const addressApi='/api/address-search';
let prices=[],lastEstimate=null,req=0,reqEstimate=0,estimates=[],seq=0,searchTimer=0,searchAbort=null,activeChoice=-1,selectedAddress=null;
async function get(url){const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
function notice(s){$('pv-status').textContent=s}
function catIndex(dim,key){const arr=Object.entries(dim.category.index||{});return arr.find(([code])=>code===key)?.[1]}
function chart(rows){const svg=$('pv-chart');svg.replaceChildren();if(!rows.length)return;const ns='http://www.w3.org/2000/svg';const v=rows.map(x=>x.value),lo=Math.min(...v)*.9,hi=Math.max(...v)*1.1;const point=(a,i)=>[45+i*510/Math.max(1,rows.length-1),155-(a-lo)*115/Math.max(1,hi-lo)];const path=rows.map((r,i)=>{const [x,y]=point(r.value,i);return(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' ');const el=(name,attr)=>{const n=document.createElementNS(ns,name);for(const[k,v]of Object.entries(attr))n.setAttribute(k,v);svg.append(n);return n};for(let i=0;i<4;i++)el('line',{x1:45,x2:556,y1:40+i*38,y2:40+i*38,stroke:'#dce7eb'});el('path',{d:path,fill:'none',stroke:'#0e927a','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'});rows.forEach((r,i)=>{const[x,y]=point(r.value,i);if(i===rows.length-1||i===0)el('circle',{cx:x,cy:y,r:5,fill:'#0d8e75'})});const mk=(val,x,y)=>{const t=el('text',{x,y,'font-size':11,fill:'#516f7c'});t.textContent=val};mk(rows[0].period,45,177);mk(rows.at(-1).period,490,177);$('pv-chart-legend').textContent='Kvadratmeterpriser fra SSB · '+rows.length+' rapporterte perioder.'}
function display(){if(!prices.length)return;const area=Number($('pv-area').value);if(!(area>=15&&area<=1500))return;const latest=prices.at(-1),val=latest.value*area;lastEstimate=val;$('pv-value').textContent=M(val);$('pv-low').textContent=M(val*.85);$('pv-high').textContent=M(val*1.15);$('pv-sqm').textContent=M(latest.value);$('pv-quarter').textContent=latest.period;$('pv-period').textContent='SSB '+latest.period+' · '+$('pv-municipality').value+' · '+area+' m²';$('pv-growth').textContent=prices.length>1?((latest.value/prices[0].value-1)*100).toFixed(1).replace('.',',')+' %':'Ikke tilgjengelig';chart(prices);renderComparison()}
function decode(raw,region,type){const d=raw.dimension||{},ids=raw.id||Object.keys(d),size=raw.size||ids.map(k=>Object.keys(d[k].category.index).length);const idxs=ids.map((id,i)=>Object.entries(d[id].category.index||{}).sort((a,b)=>a[1]-b[1]).map(([code])=>code));const dimRegion=ids.find(x=>/region/i.test(x)),dimType=ids.find(x=>/bolig|type/i.test(x)),dimContent=ids.find(x=>/contents/i.test(x)),dimTime=ids.find(x=>/tid|time/i.test(x));if(!dimTime)throw Error('SSB mangler tidsdimensjon');const lines=[];const values=Array.isArray(raw.value)?raw.value:[];for(let n=0;n<values.length;n++){let k=n,code={};for(let i=ids.length-1;i>=0;i--){code[ids[i]]=idxs[i][k%size[i]];k=Math.floor(k/size[i])}if(code[dimRegion]!==region||code[dimType]!==type||!Number.isFinite(values[n])||values[n]<=0)continue;const text=(d[dimContent]?.category?.label||{})[code[dimContent]]||'';if(!/kvadratmeter|square metre/i.test(text))continue;lines.push({period:code[dimTime],value:values[n]})}return lines.sort((a,b)=>a.period.localeCompare(b.period)).slice(-12)}
async function estimate(){
 const myRequest=++reqEstimate;
 const municipality=$('pv-municipality').value.trim(),kind=$('pv-type').value,area=Number($('pv-area').value);
 if(!selectedAddress||!/^\d{4}$/.test(municipality)||!Number.isFinite(area)||area<15||area>1500){notice('Velg en adresse fra forslagene, og oppgi boligens BRA-i (15–1500 m²) for å beregne et statistisk anslag.');$('pv-area').focus();return}
 const btn=$('pv-estimate');btn.disabled=true;btn.setAttribute('aria-busy','true');prices=[];lastEstimate=null;notice('Henter de nyeste publiserte prisene fra SSB …');$('pv-badge').textContent='Henter tall';
 try{
  const url='/api/property-market?municipality='+encodeURIComponent(municipality)+'&type='+encodeURIComponent(kind);
  const response=await fetch(url,{headers:{Accept:'application/json'},cache:'no-store'});
  const data=await response.json();
  if(myRequest!==reqEstimate)return;
  if(!response.ok)throw Error(data.error||'Kunne ikke hente prisstatistikk (HTTP '+response.status+').');
  prices=(data.rows||[]).filter(r=>Number.isFinite(r.sqm)&&r.sqm>0).map(r=>({period:r.period,value:r.sqm,sales:r.sales}));
  if(!prices.length)throw Error('Ingen gyldige prisobservasjoner.');
  display();
  const last=prices.at(-1),sales=last.sales;
  $('pv-sales').textContent=Number.isFinite(sales)?sales.toLocaleString('nb-NO')+' registrerte omsetninger':'Antall salg ikke oppgitt';
  $('pv-confidence').textContent=!Number.isFinite(sales)?'Ikke vurdert':sales<10?'Lite datagrunnlag':sales<30?'Begrenset utvalg':'Offentlig omsetningsstatistikk';
  $('pv-market-location').textContent=data.regionLabel||municipality;
  notice('SSB tabell 14310 · '+(data.regionLabel||municipality)+' · '+(data.propertyTypeLabel||'Bolig')+'. Merk: Kommunegjennomsnitt, ikke adressespesifikk takst.');
  $('pv-badge').textContent='✓ SSB-verdi';
  document.dispatchEvent(new CustomEvent('property:market',{detail:{municipality,type:kind}}));
 }catch(e){
  if(myRequest!==reqEstimate)return;
  notice('Ingen verifisert pris kunne hentes: '+e.message+' Sjekk boligtype og prøv igjen. Vi viser ikke oppdiktede markedsverdier.');
  $('pv-badge').textContent='Ingen SSB-data';
  ['pv-value','pv-low','pv-high','pv-sqm','pv-quarter','pv-growth'].forEach(id=>$(id).textContent='—');
  $('pv-chart-legend').textContent='Ingen dokumentert prisserie.';
  $('pv-chart').replaceChildren();
  $('pv-sales').textContent='Ingen dokumentert omsetning';
  $('pv-confidence').textContent='Ikke vurdert';
  $('pv-market-location').textContent='Ingen bekreftet statistikk';
  $('pv-period').textContent='SSB-data mangler for dette utvalget';
 }finally{if(myRequest===reqEstimate){btn.disabled=false;btn.removeAttribute('aria-busy');renderComparison()}}
}
function clearAddressResults(){
 const results=$('pv-address-results');results.replaceChildren();results.hidden=true;$('pv-address').setAttribute('aria-expanded','false');activeChoice=-1;
}
function chooseAddress(a){
 selectedAddress=a;$('pv-address').value=a.text+', '+(a.postal?a.postal+' ':'')+(a.place||a.municipality);
 $('pv-postal').value=a.postal||'';
 $('pv-municipality').value=a.municipalityCode||'';
 $('pv-municipality').readOnly=false;
 $('pv-municipality').setAttribute('aria-label','Kommunenummer fra valgt adresse, kan korrigeres');
 $('pv-location').textContent='✓ '+a.text+' · '+a.postal+' '+a.place+' · '+a.municipality+' kommune. Adresse kontrollert hos Kartverket.';
 $('pv-address-verified').hidden=false;
 $('pv-selected-address').textContent=a.text+', '+a.postal+' '+a.place;
 const number=$('pv-unit');number.placeholder='F.eks. H0201 (oppgis manuelt)';
 clearAddressResults();
 if(Number($('pv-area').value)>=15)estimate();
 else{$('pv-area').focus();notice('Adresse funnet. Fyll inn BRA-i fra salgsoppgave eller matrikkel for å beregne boligverdi.');}
}
function showResults(data){
 const panel=$('pv-address-results');panel.replaceChildren();panel.hidden=false;$('pv-address').setAttribute('aria-expanded','true');
 const list=Array.isArray(data.suggestions)?data.suggestions:[];
 const heading=document.createElement('div');heading.className='pv-suggest-heading';
 heading.textContent=list.length?'Adresseforslag fra Kartverket':'Ingen adresseforslag for dette søket';
 panel.append(heading);
 if(data.streets?.length){
  const note=document.createElement('div');note.className='pv-suggest-streets';
  const caption=document.createElement('span');caption.textContent='Mente du:';note.append(caption);
  data.streets.slice(0,5).forEach(street=>{
   const chip=document.createElement('button');chip.type='button';chip.className='pv-street-chip';chip.textContent=street;
   chip.addEventListener('click',()=>{$('pv-address').value=street;triggerSearch(street,true)});note.append(chip);
  });panel.append(note);
 }
 if(!list.length){
  const empty=document.createElement('p');empty.className='pv-empty-search';
  empty.textContent='Prøv bare gatenavnet eller kontroller skrivemåten. Kartverket gir kun registrerte adresser.';panel.append(empty);return
 }
 const box=document.createElement('div');box.className='pv-suggestion-list';box.setAttribute('role','listbox');box.id='pv-address-options';
 list.forEach((a,i)=>{
  const button=document.createElement('button');button.type='button';button.className='pv-address-choice';button.setAttribute('role','option');button.id='pv-option-'+i;
  button.setAttribute('aria-selected','false');
  const title=document.createElement('strong');title.textContent=a.text;
  const meta=document.createElement('span');meta.textContent=[a.postal,a.place||a.municipality].filter(Boolean).join(' · ');
  button.append(title,meta);button.addEventListener('click',()=>chooseAddress(a));box.append(button)
 });panel.append(box);
 const total=document.createElement('small');total.className='pv-suggest-caption';
 total.textContent='Viser '+list.length+' forslag. Søk videre for et bestemt husnummer.';panel.append(total);
}
async function triggerSearch(query,now=false){
 clearTimeout(searchTimer);if(searchAbort)searchAbort.abort();
 if(query.trim().length<2){clearAddressResults();return}
 const token=++req;const doSearch=async()=>{
  $('pv-address-results').hidden=false;$('pv-address-results').textContent='Søker etter adresser i hele Norge …';
  $('pv-address').setAttribute('aria-expanded','true');
  searchAbort=new AbortController();
  try{
   const url=addressApi+'?q='+encodeURIComponent(query.trim());const response=await fetch(url,{signal:searchAbort.signal});
   const data=await response.json();
   if(token!==req)return;
   if(!response.ok)throw Error(data.error||'Adressetjenesten svarte ikke');
   showResults(data);
  }catch(error){
   if(error.name==='AbortError'||token!==req)return;
   $('pv-address-results').textContent='Adresseoppslaget svarte ikke. Prøv igjen, eller skriv inn kommunenummeret nedenfor.';
   $('pv-address-results').hidden=false
  }
 };
 if(now)await doSearch();else searchTimer=setTimeout(doSearch,230)
}
function navigateOptions(e){
 const choices=[...$('pv-address-results').querySelectorAll('.pv-address-choice')];
 if(e.key==='Escape'){clearAddressResults();return}
 if(!choices.length){if(e.key==='Enter'){e.preventDefault();triggerSearch($('pv-address').value,true)}return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  e.preventDefault();activeChoice=(activeChoice+(e.key==='ArrowDown'?1:-1)+choices.length)%choices.length;
  choices.forEach((c,i)=>{c.classList.toggle('is-keyboard-active',i===activeChoice);c.setAttribute('aria-selected',String(i===activeChoice))});
  choices[activeChoice].scrollIntoView({block:'nearest'});return
 }
 if(e.key==='Enter'){e.preventDefault();(choices[activeChoice>=0?activeChoice:0]).click()}
}
function setupMode(){
 const root=$('utleie'),buttons=[ $('pv-mode-valuation'),$('pv-mode-rental') ];
 function switchTo(rental){
  root.classList.toggle('pv-mode-rental',rental);
  buttons[0].setAttribute('aria-pressed',String(!rental));buttons[1].setAttribute('aria-pressed',String(rental));
  buttons[0].classList.toggle('is-selected',!rental);buttons[1].classList.toggle('is-selected',rental)
 }
 buttons[0].addEventListener('click',()=>switchTo(false));
 buttons[1].addEventListener('click',()=>switchTo(true));
 return switchTo
}
function median(numbers){const x=numbers.filter(n=>Number.isFinite(n)&&n>0).sort((a,b)=>a-b);if(!x.length)return null;const k=Math.floor(x.length/2);return x.length%2?x[k]:(x[k-1]+x[k])/2}
function addBrokerEstimate(){
 const provider=$('pv-provider').value;const amount=Number($('pv-broker-value').value);
 const date=$('pv-broker-date').value;
 if(!provider||!Number.isFinite(amount)||amount<100000||amount>250000000){$('pv-broker-message').textContent='Velg kilde og oppgi en vurdering mellom 100 000 og 250 millioner kroner.';return}
 if(estimates.length>=16){$('pv-broker-message').textContent='Du kan sammenligne opptil 16 vurderinger.';return}
 estimates.push({id:++seq,provider,amount,date});
 $('pv-broker-value').value='';$('pv-broker-message').textContent='Vurderingen er lagt til lokalt i denne visningen. Den er ikke verifisert av oss.';
 renderComparison();
}
function renderComparison(){
 if(!$('pv-comparison-list'))return;
 const box=$('pv-comparison-list');box.replaceChildren();
 const records=[];
 if(Number.isFinite(lastEstimate)&&lastEstimate>0)records.push({provider:'SSB · statistisk anslag',amount:lastEstimate,kind:'official'});
 for(const r of estimates)records.push({...r,kind:'manual'});
 const max=Math.max(1,...records.map(x=>x.amount));const brokerMedian=median(estimates.map(x=>x.amount));
 $('pv-broker-count').textContent=estimates.length+' registrerte vurderinger';
 $('pv-median').textContent=brokerMedian?M(brokerMedian):'—';
 $('pv-compare-delta').textContent=brokerMedian&&lastEstimate?((brokerMedian/lastEstimate-1)*100).toFixed(1).replace('.',',')+' %':'—';
 const empty=$('pv-comparison-empty');empty.hidden=records.length>0;
 records.forEach(r=>{
  const line=document.createElement('div');line.className='pv-compare-row';
  const top=document.createElement('div');top.className='pv-compare-top';
  const name=document.createElement('strong');name.textContent=r.provider;
  const amount=document.createElement('b');amount.textContent=M(r.amount);top.append(name,amount);
  const track=document.createElement('div');track.className='pv-compare-track';
  const bar=document.createElement('span');bar.className=r.kind==='official'?'pv-bar-public':'pv-bar-broker';bar.style.width=Math.min(100,r.amount/max*100)+'%';track.append(bar);
  const bottom=document.createElement('div');bottom.className='pv-compare-bottom';bottom.textContent=r.kind==='official'?'Statistisk anslag basert på SSB · ikke meglerverdivurdering':'Brukerregistrert vurdering'+(r.date?' · '+r.date:'')+' · ikke verifisert';
  line.append(top,track,bottom);
  if(r.kind==='manual'){const button=document.createElement('button');button.type='button';button.textContent='Fjern';button.className='pv-remove';button.setAttribute('aria-label','Fjern vurdering fra '+r.provider);button.addEventListener('click',()=>{estimates=estimates.filter(x=>x.id!==r.id);renderComparison()});line.append(button)}
  box.append(line);
 });
}
function exportOverview(){
 const rows=[['Kilde','Vurdering NOK','Datoperiode','Type']];
 if(lastEstimate&&prices.length)rows.push(['SSB offentlig statistikk',Math.round(lastEstimate),prices.at(-1).period,'Statistisk anslag']);
 for(const x of estimates)rows.push([x.provider,x.amount,x.date,'Brukerregistrert']);
 if(rows.length===1){$('pv-broker-message').textContent='Ingen tall å eksportere.';return}
 const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='lanesjekk-eiendomsvurderinger.csv';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),500);
}
function boot(){if(!$('pv-estimate'))return;
 $('pv-broker-date').value=new Date().toISOString().slice(0,10);
 $('pv-municipality').readOnly=false;
 $('pv-municipality').placeholder='F.eks. 3209';
 $('pv-broker-add').addEventListener('click',addBrokerEstimate);
 $('pv-broker-export').addEventListener('click',exportOverview);
 $('pv-broker-clear').addEventListener('click',()=>{estimates=[];renderComparison();$('pv-broker-message').textContent='Alle brukerregistrerte vurderinger er fjernet.'});
 renderComparison();
 const switchTo=setupMode();
 $('pv-search').addEventListener('click',()=>triggerSearch($('pv-address').value,true));
 $('pv-address').addEventListener('input',()=>{
  if(selectedAddress){
   ++reqEstimate;
   $('pv-estimate').disabled=false;
   $('pv-estimate').removeAttribute('aria-busy');
   prices=[];lastEstimate=null;estimates=[];renderComparison();
   ['pv-value','pv-low','pv-high','pv-sqm','pv-quarter','pv-growth'].forEach(id=>$(id).textContent='—');
   $('pv-sales').textContent='Ingen omsetningstall';$('pv-chart-legend').textContent='';
   $('pv-badge').textContent='Venter på bolig';
   const chart=$('pv-chart');chart.replaceChildren();
   $('pv-market-location').textContent='Kommune';
   notice('Velg en ny adresse og fyll inn BRA-i. Gamle prisanslag er nullstilt.');
  }
  selectedAddress=null;$('pv-address-verified').hidden=true;$('pv-municipality').value='';$('pv-postal').value='';
  triggerSearch($('pv-address').value);
 });
 $('pv-address').addEventListener('keydown',navigateOptions);
 document.addEventListener('pointerdown',event=>{if(!event.target.closest('.pv-search-wrap'))clearAddressResults()});
 $('pv-estimate').addEventListener('click',estimate);
 $('pv-municipality').addEventListener('input',()=>{++reqEstimate;prices=[];lastEstimate=null;$('pv-value').textContent='—';$('pv-low').textContent='—';$('pv-high').textContent='—';$('pv-badge').textContent='Ny beregning kreves';notice('Kommunenummeret er endret manuelt. Kontroller kommunenummeret mot Kartverket før du beregner på nytt.');});
 $('pv-postal').addEventListener('input',()=>{const val=$('pv-postal').value.trim();if(val&&!/^\\d{4}$/.test(val)){$('pv-postal').setCustomValidity('Oppgi et norsk postnummer med fire sifre.')}else $('pv-postal').setCustomValidity('');});
 $('pv-type').addEventListener('change',()=>{if(prices.length)estimate()});
 $('pv-area').addEventListener('input',display);
 $('pv-to-rental').addEventListener('click',()=>{
  if(!lastEstimate){notice('Hent et offentlig prisanslag først.');return}
  const field=$('rental-price');
  if(field){field.value=Math.round(lastEstimate/1000)*1000;field.dispatchEvent(new Event('input',{bubbles:true}))}
  switchTo(true);$('rental-price')?.scrollIntoView({behavior:'smooth',block:'center'});
 });}
document.addEventListener('DOMContentLoaded',boot);
})();