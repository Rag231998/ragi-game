/* Valutakompass: straightforward FINN-style converter with verified rate dates. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const formatted=(v,dec=2)=>new Intl.NumberFormat('nb-NO',{minimumFractionDigits:dec,maximumFractionDigits:dec}).format(v);
const parse=raw=>{
 const s=String(raw??'').trim().replace(/[\s\u00a0\u202f]/g,'').replace(',','.');
 return /^\d+(?:\.\d{0,2})?$/.test(s)?Number(s):NaN;
};
const normalize=raw=>String(raw??'').replace(/[^0-9,\.\s]/g,'');
let quote=null,quoteToken=0,histToken=0,historyDays=30,history=[],lastEdited='from';
const set=(id,value)=>{const n=$(id);if(n)n.textContent=value};
function message(value,isError=false){const el=$('vc-status');if(!el)return;el.textContent=value;el.classList.toggle('vc-error',isError)}
function compute(){
 if(!quote)return;
 const field=lastEdited==='to'?$('vc-converted'):$('vc-amount'),other=lastEdited==='to'?$('vc-amount'):$('vc-converted');
 const n=parse(field.value);
 if(!Number.isFinite(n)||n>1e12){other.value='';message('Skriv et gyldig beløp med maksimalt to desimaler.',true);return}
 const value=lastEdited==='to'?n/quote.rate:n*quote.rate;
 other.value=formatted(value);
 message(quote.stale?'Viser siste lagrede kurs fordi kilden ikke svarte.':'Kursen gjelder '+quote.date+'. Referansekurs, ikke bankens vekslingskurs.',!!quote.stale);
}
async function getQuote(){
 const id=++quoteToken,from=$('vc-from').value,to=$('vc-to').value;
 quote=null;$('vc-converted').value='';set('vc-rate','Henter valutakurs …');set('vc-date','—');message('Henter siste tilgjengelige kurs …');
 if(from===to){
  quote={rate:1,date:'—',source:'Samme valuta'};
  set('vc-rate','1 '+from+' = 1 '+to);set('vc-source','Samme valuta');lastEdited='from';compute();message('Samme valuta er valgt.');return;
 }
 try{
  const response=await fetch('/api/currency?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to),{headers:{Accept:'application/json'}});
  const data=await response.json();
  if(id!==quoteToken)return;
  if(!response.ok||!Number.isFinite(data.rate)||data.rate<=0)throw Error(data.error||'Kurs mangler');
  quote=data;set('vc-rate','1 '+from+' = '+formatted(data.rate,Math.abs(data.rate)<1?6:4)+' '+to);
  set('vc-date',data.date);set('vc-source',data.source||'Frankfurter');
  lastEdited='from';compute();
 }catch(e){
  if(id!==quoteToken)return;
  set('vc-rate','Kurs utilgjengelig');$('vc-converted').value='';
  set('vc-source','Frankfurter');message('Kunne ikke hente valutakurs. Prøv «Oppdater kurs».',true)
 }
}
async function popular(){
 const target=$('vc-popular');if(!target)return;
 const list=[['EUR','Euro','🇪🇺'],['USD','US dollar','🇺🇸'],['GBP','Britiske pund','🇬🇧'],['SEK','Svenske kroner','🇸🇪'],['DKK','Danske kroner','🇩🇰']];
 const results=await Promise.allSettled(list.map(async ([code,name,flag])=>{
  const response=await fetch('/api/currency?from='+code+'&to=NOK',{headers:{Accept:'application/json'}});
  const data=await response.json();if(!response.ok||!Number.isFinite(data.rate)||data.rate<=0)throw Error('Ingen kurs');
  return {code,name,flag,rate:data.rate,date:data.date};
 }));
 target.replaceChildren();
 const valid=results.filter(x=>x.status==='fulfilled').map(x=>x.value);
 if(!valid.length){const p=document.createElement('p');p.className='vc-muted';p.textContent='Dagens kurser kunne ikke lastes. Trykk «Oppdater kurs» for å prøve igjen.';target.append(p);return}
 for(const item of valid){
  const line=document.createElement('div');line.className='vc-popular-item';
  const label=document.createElement('div');label.className='vc-popular-name';
  const flag=document.createElement('span');flag.textContent=item.flag;
  const info=document.createElement('span');
  const name=document.createElement('strong');name.textContent=item.code;
  const minor=document.createElement('small');minor.textContent=item.name;
  info.append(name,minor);label.append(flag,info);
  const rate=document.createElement('div');rate.className='vc-popular-rate';
  const value=document.createElement('strong');value.textContent=formatted(item.rate,4)+' kr';
  const date=document.createElement('small');date.textContent=item.date;
  rate.append(value,date);line.append(label,rate);target.append(line)
 }
 if(valid.length<list.length){const p=document.createElement('p');p.className='vc-muted';p.textContent='Noen kurser er midlertidig utilgjengelige.';target.append(p)}
}
function draw(){
 const svg=$('vc-chart');if(!svg)return;svg.replaceChildren();
 const ns='http://www.w3.org/2000/svg',el=(tag,attrs={},content)=>{const n=document.createElementNS(ns,tag);for(const [key,val] of Object.entries(attrs))n.setAttribute(key,String(val));if(content)n.textContent=content;svg.append(n);return n};
 if(history.length<2){el('text',{x:18,y:116,fill:'#617987','font-size':16},'Ingen historiske kurser tilgjengelig');set('vc-chart-hint','Ingen verifiserbar tidsserie for dette utvalget.');return}
 const rates=history.map(x=>x.rate),min=Math.min(...rates),max=Math.max(...rates),spread=Math.max((max-min)*1.05,.00000001);
 for(let i=0;i<4;i++){const y=20+i*57;el('line',{x1:60,y1:y,x2:746,y2:y,stroke:'#dfeaf0'});el('text',{x:5,y:y+5,fill:'#56717e','font-size':12},formatted(max-i*spread/3,max<1?4:2))}
 const values=history.map((point,i)=>[60+i*686/(history.length-1),191-(point.rate-min)/spread*171]);
 el('path',{d:values.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '),fill:'none',stroke:'#0a987b','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'});
 for(const [i,align] of [[0,'start'],[history.length-1,'end']])el('text',{x:values[i][0],y:218,fill:'#607482','font-size':13,'text-anchor':align},history[i].date);
 set('vc-chart-hint','Kursdato '+history[0].date+'–'+history.at(-1).date+' · '+history.length+' observasjoner. Kilde: Frankfurter.')
}
async function loadHistory(){
 const token=++histToken,from=$('vc-from').value,to=$('vc-to').value;history=[];
 if(from===to){draw();return}
 try{
  const response=await fetch('/api/currency-history?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to)+'&days='+historyDays,{headers:{Accept:'application/json'}});
  const data=await response.json();if(token!==histToken)return;
  if(!response.ok||!Array.isArray(data.points))throw Error('Ingen historikk');
  history=data.points.filter(x=>Number.isFinite(x.rate)&&x.rate>0&&/^\d{4}-\d{2}-\d{2}$/.test(x.date));draw()
 }catch{if(token!==histToken)return;history=[];draw()}
}
function init(){
 if(!$('vc-from'))return;
 for(const id of ['vc-from','vc-to'])$(id).addEventListener('change',()=>{getQuote();loadHistory()});
 $('vc-swap').addEventListener('click',()=>{const a=$('vc-from'),b=$('vc-to'),tmp=a.value;a.value=b.value;b.value=tmp;getQuote();loadHistory()});
 for(const [id,edited] of [['vc-amount','from'],['vc-converted','to']]){
  const input=$(id);
  input.addEventListener('input',()=>{lastEdited=edited;input.value=normalize(input.value);compute()});
  input.addEventListener('blur',()=>{const n=parse(input.value);if(Number.isFinite(n))input.value=formatted(n);compute()})
 }
 $('vc-retry').addEventListener('click',()=>{getQuote();popular();loadHistory()});
 document.querySelectorAll('[data-vc-days]').forEach(b=>b.addEventListener('click',()=>{
  historyDays=Number(b.dataset.vcDays);
  document.querySelectorAll('[data-vc-days]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  loadHistory()
 }));
 getQuote();popular();loadHistory()
}
document.addEventListener('DOMContentLoaded',init);
})();