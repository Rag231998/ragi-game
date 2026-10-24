/* Valutakompass — real reference-rate UI, no hardcoded invented exchange rates. */
(()=>{'use strict';
const $=id=>document.getElementById(id),codeSet=['NOK','EUR','USD','GBP','SEK','DKK','CHF','JPY','THB','TRY','AUD','CAD','PLN','SGD','HKD','INR','LKR'];
const fmt=(x,dec=2)=>new Intl.NumberFormat('nb-NO',{minimumFractionDigits:dec,maximumFractionDigits:dec}).format(x);
const num=s=>{const v=String(s??'').trim().replace(/[\s\u00a0\u202f]/g,'').replace(',','.');return /^\d+(\.\d{0,2})?$/.test(v)?Number(v):NaN};
const clean=s=>String(s??'').trim().replace(/[^0-9\s,.]/g,'');
let latest=null,history=[],request=0,historyReq=0,period=30;
function status(t,error=false){const el=$('vc-status');if(el){el.textContent=t;el.classList.toggle('vc-error',error)}}
function setText(id,text){const el=$(id);if(el)el.textContent=text}
function current(){return {from:$('vc-from').value,to:$('vc-to').value,amount:num($('vc-amount').value),fee:num($('vc-fee').value)}}
function render(){
 const {from,to,amount,fee}=current();
 const valid=Number.isFinite(amount)&&amount>=0&&amount<=1e10&&Number.isFinite(fee)&&fee>=0&&fee<=20;
 if(!valid){setText('vc-result','—');setText('vc-after-fee','—');setText('vc-fee-cost','—');status('Kontroller beløp og kortgebyr (0–20 %).',true);return}
 if(!latest){setText('vc-result','—');setText('vc-after-fee','—');setText('vc-fee-cost','—');return}
 const gross=amount*latest.rate;
 // For a purchase in target currency, a fee reduces the target amount purchasable for the same budget.
 const feeAmount=gross*fee/100;
 setText('vc-result',fmt(gross)+' '+to);
 setText('vc-after-fee',fmt(gross-feeAmount)+' '+to);
 setText('vc-fee-cost',fmt(feeAmount)+' '+to);
 setText('vc-amount-caption',fmt(amount)+' '+from+' × '+fmt(latest.rate,Math.abs(latest.rate)<1?6:4));
 setText('vc-rate','1 '+from+' = '+fmt(latest.rate,Math.abs(latest.rate)<1?6:4)+' '+to);
 setText('vc-date',latest.date);
 setText('vc-source',latest.source||'Frankfurter');
 if(latest.stale)status('Vi viser siste lagrede kurs fordi oppdateringen ikke svarte.',true);
 else status('Kurs publisert '+latest.date+'. Referansekurs, ikke bankens vekslingskurs.');
}
async function fetchRate(){
 const token=++request,{from,to}=current();latest=null;setText('vc-result','—');setText('vc-after-fee','—');setText('vc-rate','Henter kurs …');status('Henter siste offentlig tilgjengelige referansekurs …');
 if(!codeSet.includes(from)||!codeSet.includes(to))return;
 if(from===to){latest={rate:1,date:'—',source:'Samme valuta'};render();setText('vc-rate','1 '+from+' = 1 '+to);status('Du har valgt samme valuta.');return}
 try{
  const response=await fetch('/api/currency?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to),{headers:{Accept:'application/json'}});
  const data=await response.json();
  if(token!==request)return;
  if(!response.ok||!Number.isFinite(data.rate)||data.rate<=0)throw Error(data.error||'Manglende kurs');
  latest=data;render();
 }catch(e){if(token!==request)return;setText('vc-rate','Kurs utilgjengelig');setText('vc-date','—');setText('vc-source','Frankfurter');status('Kunne ikke hente verifisert kurs. Ingen beløp er beregnet. Prøv igjen.',true);}
}
function drawHistory(){
 const svg=$('vc-chart'),hint=$('vc-chart-hint');if(!svg)return;
 while(svg.firstChild)svg.removeChild(svg.firstChild);
 const NS='http://www.w3.org/2000/svg', make=(name,attrs={},text)=>{const n=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text)n.textContent=text;svg.append(n);return n;};
 if(history.length<2){make('text',{x:20,y:125,fill:'#618087','font-size':15},'Ingen dokumentert kursserie tilgjengelig');if(hint)hint.textContent='Historiske kurser mangler eller er utilgjengelige.';return}
 const values=history.map(x=>x.rate),minimum=Math.min(...values),maximum=Math.max(...values),spread=Math.max(0.0000001,maximum-minimum);
 for(let i=0;i<=3;i++){let y=25+i*55;make('line',{x1:65,y1:y,x2:740,y2:y,stroke:'#d9e7ee'});make('text',{x:4,y:y+4,fill:'#637783','font-size':13},fmt(maximum-i*spread/3,maximum<1?4:2))}
 const points=history.map((p,i)=>[65+i*675/(history.length-1),190-(p.rate-minimum)/spread*165]);
 const line=points.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 make('path',{d:line,fill:'none',stroke:'#098d79','stroke-width':3.5,'stroke-linecap':'round','stroke-linejoin':'round'});
 const last=points.at(-1);make('circle',{cx:last[0],cy:last[1],r:6,fill:'#0aaf87',stroke:'#ffffff','stroke-width':2});
 make('text',{x:66,y:215,fill:'#637783','font-size':13},history[0].date);
 make('text',{x:740,y:215,fill:'#637783','font-size':13,'text-anchor':'end'},history.at(-1).date);
 if(hint)hint.textContent='Fra '+history[0].date+' til '+history.at(-1).date+' · '+history.length+' observasjoner · Frankfurter.';
}
async function loadHistory(){
 const token=++historyReq,{from,to}=current();
 history=[];drawHistory();
 if(from===to)return;
 try{
  const response=await fetch('/api/currency-history?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to)+'&days='+period,{headers:{Accept:'application/json'}});
  const data=await response.json();if(token!==historyReq)return;
  if(!response.ok||!Array.isArray(data.points))throw Error(data.error||'Ingen historikk');
  history=data.points.filter(x=>Number.isFinite(x.rate)&&x.rate>0&&/^\d{4}-\d{2}-\d{2}$/.test(x.date));
  drawHistory();
 }catch(e){if(token!==historyReq)return;history=[];drawHistory()}
}
function recalculate(){render()}
function init(){
 if(!$('vc-from'))return;
 const from=$('vc-from'),to=$('vc-to'),amount=$('vc-amount'),fee=$('vc-fee');
 for(const select of [from,to])select.addEventListener('change',()=>{fetchRate();loadHistory()});
 $('vc-swap').addEventListener('click',()=>{const tmp=from.value;from.value=to.value;to.value=tmp;fetchRate();loadHistory()});
 for(const input of [amount,fee]){input.addEventListener('input',()=>{input.value=clean(input.value);recalculate()});input.addEventListener('blur',()=>{const n=num(input.value);if(Number.isFinite(n))input.value=fmt(n);recalculate()})}
 $('vc-retry').addEventListener('click',()=>{fetchRate();loadHistory()});
 document.querySelectorAll('[data-vc-days]').forEach(button=>button.addEventListener('click',()=>{period=Number(button.dataset.vcDays);document.querySelectorAll('[data-vc-days]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));loadHistory()}));
 $('vc-quick-trip').addEventListener('click',()=>{amount.value='15 000';fee.value='2,00';recalculate();amount.focus()});
 fetchRate();loadHistory();
}
document.addEventListener('DOMContentLoaded',init);
})();