/* Independently calculated savings comparisons; NEVER present snapshot as live.
   Rates are the dated, sourced examples in savings-data.js.
   For current market rates, use the original Finansportalen iframe. */
(function(root){
 'use strict';
 const data=root.LANESAVINGS;
 if(!data)return;
 const $=id=>document.getElementById(id);
 const nok=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
 const fmt=n=>Number.isFinite(n)?nok.format(Math.round(n)):'–';
 const pct=n=>new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' %';
 const parseMoney=raw=>{
   if(root.LANENUMBERS)return root.LANENUMBERS.parseMoney(raw);
   const clean=String(raw??'').replace(/[ \u00a0\u202f]/g,'').replace(/\./g,'').replace(',','.');
   return clean&&/^\d+(?:\.\d{0,2})?$/.test(clean)?Number(clean):NaN;
 };
 const parseRate=raw=>{
   const clean=String(raw??'').trim().replace(/\s/g,'').replace(',','.');
   return /^\d+(?:\.\d+)?$/.test(clean)?Number(clean):NaN;
 };
 function applicableRate(product,amount){
   if(!Number.isFinite(amount)||amount<=0||amount>product.maxBalance)return null;
   const bracket=[...product.rateTiers].sort((a,b)=>b.min-a.min).find(x=>amount>=x.min);
   return bracket?bracket.rate:null;
 }
 function compare(amount,filter='all',showMember=false,query=''){
   if(!Number.isFinite(amount)||amount<1000||amount>2000000)return [];
   const needle=query.trim().toLocaleLowerCase('nb-NO');
   return data.products.filter(p=>
    (filter==='all'||p.type===filter)&&
    (showMember||!p.member)&&
    (!needle||(p.bank+' '+p.account).toLocaleLowerCase('nb-NO').includes(needle))
   ).map(p=>({...p,rate:applicableRate(p,amount),profit:amount*applicableRate(p,amount)/100}))
    .filter(p=>p.rate!==null).sort((a,b)=>b.profit-a.profit||a.bank.localeCompare(b.bank,'nb'));
 }
 function addText(parent,tag,value,cls){
   const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;parent.append(el);return el;
 }
 function renderRow(p,i){
   const row=document.createElement('article');row.className='saving-result';row.dataset.productId=p.id;
   addText(row,'span',String(i+1).padStart(2,'0'),'saving-rank');
   const logo=document.createElement('span');logo.className='saving-symbol';logo.style.setProperty('--bank-color',p.brand);logo.textContent=p.initials;row.append(logo);
   const center=document.createElement('div');center.className='saving-content';
   addText(center,'strong',p.bank,'saving-bank');addText(center,'span',p.account,'saving-account');
   const flags=document.createElement('div');flags.className='saving-flags';
   addText(flags,'span',p.freeWithdrawals==='Ubegrenset'?'Frie uttak':p.freeWithdrawals+' uttaksregler');
   if(p.member)addText(flags,'span','Medlemskap kreves');
   if(p.type==='varsel')addText(flags,'span','Uttaksvarsel');
   center.append(flags);row.append(center);
   const value=document.createElement('div');value.className='saving-amount';addText(value,'strong',fmt(p.profit));addText(value,'small',pct(p.rate)+' nominell');row.append(value);
   const linkLine=document.createElement('div');linkLine.className='saving-source';
   addText(linkLine,'span',p.notes,'saving-terms');
   const link=document.createElement('a');link.href=p.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Kontroller banken ↗';linkLine.append(link);
   row.append(linkLine);return row;
 }
 function showResult(){
   const amount=parseMoney($('save-amount').value),error=$('save-error');
   const ok=Number.isFinite(amount)&&amount>=1000&&amount<=2000000;
   error.hidden=ok;
   if(!ok)error.textContent='Skriv et beløp mellom 1 000 og 2 000 000 kroner for å sammenligne disse priseksemplene.';
   $('save-amount-title').textContent=ok?fmt(amount):'–';
   const rows=ok?compare(amount,$('save-filter').value,$('save-members').checked,$('save-search').value):[];
   $('save-result-count').textContent=rows.length+' tilgjengelige priseksempler · kildekontroll '+data.asOf.split('-').reverse().join('.');
   const rootEl=$('save-results');rootEl.replaceChildren();
   if(!rows.length){
     addText(rootEl,'div',ok?'Ingen produkter passer til filtrene. Prøv å endre søket eller vis medlemskontoer.':'Ingen sammenligning før beløpet er gyldig.','error-inline');
     $('winner-name').textContent='Ingen treff';$('winner-profit').textContent='–';
     $('winner-description').textContent='Endre beløpet eller filteret';
     return;
   }
   const best=rows[0];
   $('winner-name').textContent=best.bank+' · '+best.account;
   $('winner-profit').textContent=fmt(best.profit);
   $('winner-description').textContent=pct(best.rate)+' nominell · '+best.freeWithdrawals;
   const frag=document.createDocumentFragment();
   for(const [i,p] of rows.entries())frag.append(renderRow(p,i));
   rootEl.append(frag);
 }
 function project(start,monthly,annualRate,years){
   if(![start,monthly,annualRate,years].every(Number.isFinite)||
       start<0||start>2000000||monthly<0||monthly>100000||
       annualRate<0||annualRate>35||!Number.isInteger(years)||years<1||years>30)return null;
   let balance=start,totalPaid=start;const yearData=[];
   const r=annualRate/1200;
   for(let year=0;year<years;year++){
     for(let m=0;m<12;m++){balance=balance*(1+r)+monthly;totalPaid+=monthly}
     yearData.push({year:year+1,value:balance,paid:totalPaid,interest:Math.max(0,balance-totalPaid)});
   }
   return {value:balance,deposit:totalPaid,profit:balance-totalPaid,years:yearData};
 }
 function renderProjection(){
   const start=parseMoney($('save-amount').value),monthly=parseMoney($('projection-monthly').value),
    years=Number($('projection-years').value),annualRate=parseRate($('projection-rate').value);
   $('projection-years-label').textContent=years+' år';
   const calculation=project(start,monthly,annualRate,years);
   $('projection-total').textContent=calculation?fmt(calculation.value):'–';
   $('projection-deposit').textContent=calculation?fmt(calculation.deposit):'–';
   $('projection-interest').textContent=calculation?fmt(calculation.profit):'–';
   const chart=$('projection-chart');chart.replaceChildren();
   if(!calculation)return;
   const top=Math.max(1,calculation.value);const maxBars=20;
   const chosen=calculation.years.filter((x,i)=>years<=maxBars||i%Math.ceil(years/maxBars)===0||i===years-1);
   const fragment=document.createDocumentFragment();
   for(const x of chosen){
     const bar=document.createElement('div');bar.className='column';
     bar.title='År '+x.year+': '+fmt(x.value)+' (innbetalt '+fmt(x.paid)+')';
     const height=Math.max(1,100*x.value/top),outer=document.createElement('div');outer.style.height=height+'%';
     const interest=document.createElement('div');interest.className='profit';interest.style.height=Math.max(0,100*x.interest/x.value)+'%';
     const own=document.createElement('div');own.className='deposit';own.style.height=Math.min(100,100*x.paid/x.value)+'%';
     outer.append(interest,own);bar.append(outer);fragment.append(bar);
   }
   chart.append(fragment);
 }
 function render(){showResult();renderProjection()}
 function copySummary(){
   const amount=parseMoney($('save-amount').value);
   const products=compare(amount,$('save-filter').value,$('save-members').checked,$('save-search').value);
   if(!products.length)return;
   const message=['Lånesjekk Norge – sammenligning av sparekontoer','Innskudd: '+fmt(amount),
      'Kildekontroll: '+data.asOf+' – kun priseksempler, ikke sanntidsrenter',
      ...products.map((p,i)=>(i+1)+'. '+p.bank+' – '+p.account+': '+pct(p.rate)+', ca. '+fmt(p.profit)+' rente før skatt første år; '+p.source),
      'Kontroller alltid betingelser og dagens renter hos bankene eller Finansportalen.'].join('\n');
   if(!navigator.clipboard?.writeText)return;
   navigator.clipboard.writeText(message).then(()=>{
      $('save-share').textContent='✓ Kopiert';
   }).catch(()=>{$('save-share').textContent='Kopiering ikke tilgjengelig'});
 }
 function install(){
   for(const id of ['save-amount','save-search','save-filter','save-members','projection-monthly','projection-rate','projection-years'])
    $(id)?.addEventListener('input',()=>{
      if(id==='save-amount'){const a=parseMoney($('save-amount').value);if(Number.isFinite(a)&&a>=1000&&a<=2000000)$('save-slider').value=String(a)}
      render();
    });
   $('save-slider').addEventListener('input',()=>{
     $('save-amount').value=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:0}).format(Number($('save-slider').value));
     render();
   });
   $('save-reset').addEventListener('click',()=>{
     $('save-amount').value='100 000';$('save-slider').value='100000';
     $('save-search').value='';$('save-filter').value='all';$('save-members').checked=false;
     render();
   });
   $('save-share').addEventListener('click',copySummary);
   $('official-launch').addEventListener('click',()=>{
     const container=$('official-container');
     if(container.hidden){
       const frame=document.createElement('iframe');
       frame.src='https://www.forbrukerradet.no/finansportalen/bank/iframe/innskudd';
       frame.title='Finansportalen – offisiell sammenligning av innskudd';
       frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';
       container.append(frame);container.hidden=false;
       $('official-launch').textContent='Lukk offisiell sammenligning ↑';
     } else {
       container.replaceChildren();container.hidden=true;
       $('official-launch').textContent='Åpne offisiell sammenligning ↓';
     }
   });
   render();
 }
 if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',install);
 if(typeof module!=='undefined'&&module.exports)module.exports={applicableRate,compare,project};
})(typeof window==='undefined'?{LANESAVINGS:require('./savings-data.js')}:window);
