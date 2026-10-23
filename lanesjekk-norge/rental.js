/* Lånesjekk property/rental lab. All calculations on-device; no FINN scraping.
   User may paste public ad description and verify suggested facts manually. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const currency=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
const percent=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:1,maximumFractionDigits:1});
const money=n=>Number.isFinite(n)?currency.format(Math.round(n)):'–';
const valid=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
function pmt(principal,annualPercent,months){
 if(principal<=0)return 0;
 const r=annualPercent/1200;
 return r===0?principal/months:principal*r/(1-Math.pow(1+r,-months));
}
function realEstate(values){
 const {price,sharedDebt,buyCosts,rent,equity,rate,years,common,running,maintenance,vacancy,tax}=values;
 if(![price,sharedDebt,buyCosts,rent,equity,rate,years,common,running,maintenance,vacancy].every(Number.isFinite)
  ||price<=0||price>100000000||rent<0||rent>500000||sharedDebt<0||buyCosts<0||equity<0
  ||rate<0||rate>30||years<1||years>40||common<0||running<0||maintenance<0||vacancy<0||vacancy>12)return null;
 // Price is the cash purchase price. Collective/shared debt stays in the association fees:
 // it is included in overall property value/yield but excluded from own loan principal
 // to avoid double-counting repayment already embedded in common costs.
 const investment=price+sharedDebt+buyCosts;
 const loan=Math.max(0,price+buyCosts-equity);
 if(equity>price+buyCosts)return null;
 const billedRent=rent*(12-vacancy),monthlyRent=billedRent/12;
 const operatingExpenses=(common+running+maintenance)*12;
 const netOperating=billedRent-operatingExpenses;
 const monthlyDebtService=pmt(loan,rate,years*12);
 const annualDebt=monthlyDebtService*12;
 const firstMonthInterest=loan*rate/1200;
 const firstYearInterest=(()=>{let balance=loan,total=0;for(let i=0;i<12;i++){
  const interest=balance*rate/1200;total+=interest;balance=Math.max(0,balance-(monthlyDebtService-interest));}return total})();
 const grossYield=investment>0?100*billedRent/investment:NaN;
 const netYield=investment>0?100*netOperating/investment:NaN;
 const pretaxCashFlow=netOperating-annualDebt;
 // Approximate ONLY: actual deductible costs in common charges differ with shared debt,
 // maintenance reserves cannot be claimed until work is performed.
 // To reduce falsely optimistic results assume running costs deductible, but do not
 // deduct maintenance reserves from tax until spent.
 const taxableProfit=billedRent-12*(common+running)-firstYearInterest;
 const estimatedTax=tax==='taxable'?Math.max(0,taxableProfit)*.22:null;
 const afterTaxCash=estimatedTax===null?null:pretaxCashFlow-estimatedTax;
 const breakevenRent=(operatingExpenses+annualDebt)/(12-vacancy);
 return {investment,loan,billedRent,monthlyRent,operatingExpenses,netOperating,monthlyDebtService,annualDebt,firstYearInterest,
  grossYield,netYield,pretaxCashFlow,estimatedTax,afterTaxCash,breakevenRent,taxableProfit,firstMonthInterest};
}
function collect(){
 const n=id=>Number($(id).value);
 return {
  price:n('rental-price'),sharedDebt:n('rental-shared-debt'),buyCosts:n('rental-buy-costs'),rent:n('rental-rent'),
  equity:n('rental-equity'),rate:n('rental-interest'),years:n('rental-years'),common:n('rental-common'),running:n('rental-running'),
  maintenance:n('rental-maintenance'),vacancy:n('rental-vacancy'),tax:$('rental-tax').value
 };
}
function update(){
 const raw=collect(),calc=realEstate(raw),status=$('rental-validation');
 const kpis=['rental-gross','rental-noi','rental-cash','rental-cash-after','rental-gross-yield','rental-net-yield'];
 if(!calc||!$('rental-price').value||!$('rental-rent').value||!$('rental-equity').value){
  status.textContent='Fyll inn kjøpesum, månedlig husleie og egenkapital. Kontroller også at alle kostnader er gyldige.';
  status.classList.remove('good');for(const id of kpis)$(id).textContent='–';
  $('rental-chart').replaceChildren();$('rental-bar-legend').replaceChildren();$('rental-stress').textContent='';
  $('rental-break-even').textContent='';return;
 }
 status.classList.add('good');status.textContent='Regnestykket oppdateres automatisk. Annonsedata og leieinntekter er oppgitt eller foreslått – ikke bekreftet av en dataleverandør eller bank.';
 $('rental-gross').textContent=money(calc.billedRent);
 $('rental-noi').textContent=money(calc.netOperating);
 $('rental-cash').textContent=money(calc.pretaxCashFlow/12);
 $('rental-cash-after').textContent=calc.afterTaxCash===null?'Ikke beregnet':money(calc.afterTaxCash/12);
 $('rental-gross-yield').textContent=percent.format(calc.grossYield)+' %';
 $('rental-net-yield').textContent=percent.format(calc.netYield)+' %';
 const positive=Math.max(0,calc.billedRent);
 const segments=[['Drift og vedlikeholdsreserve',calc.operatingExpenses,'#e3aa57'],
   ['Årlig betaling på eget lån',calc.annualDebt,'#538dae'],
   ['Kontantstrøm før skatt',Math.max(0,calc.pretaxCashFlow),'#119b80']];
 const base=Math.max(positive,segments.reduce((s,x)=>s+x[1],0),1);
 const bar=$('rental-chart'),legend=$('rental-bar-legend');bar.replaceChildren();legend.replaceChildren();
 for(const [name,value,color] of segments){
  const width=Math.min(100,Math.max(0,100*Math.max(0,value)/base));
  const segment=document.createElement('span');segment.style.width=width+'%';segment.style.background=color;
  segment.title=name+': '+money(value);bar.append(segment);
  const row=document.createElement('div'),dot=document.createElement('i');dot.style.background=color;
  const nameNode=document.createElement('span');nameNode.textContent=name;
  const val=document.createElement('strong');val.textContent=money(value);row.append(dot,nameNode,val);legend.append(row);
 }
 const cut=Number($('rental-rent-cut').value)||0;
 $('rental-rent-cut-value').textContent=cut+' %';
 const stressed=realEstate({...raw,rent:raw.rent*(1-cut/100)});
 $('rental-stress').textContent='Ved '+cut+' % lavere husleie blir månedlig kontantstrøm før skatt '+money(stressed.pretaxCashFlow/12)+'. Dette er et stress-scenario, ikke en prognose.';
 $('rental-break-even').textContent='Anslått husleie for å dekke driftskostnader og eget lån: '+money(calc.breakevenRent)+' per måned ved '+raw.vacancy+' måneder uten leietaker. Inkluderer ikke skattebetaling eller uforutsette utgifter.';
}
function adNumber(raw,label){
 const lines=String(raw).split(/\r?\n/),matched=lines.find(s=>label.test(s));
 if(!matched)return null;
 const cleaned=matched.replace(/(?:,\s*[-–])|(?:\bkr\b)/gi,' ').replace(/\u00a0/g,' ');
 const after=cleaned.split(/:|(?:pris(?:antydning)?)|(?:felles(?:kostnader|gjeld))|(?:omkostninger)/i).pop()||cleaned;
 const m=after.match(/\d[\d .]*(?:,\d{1,2})?/);
 if(!m)return null;
 const n=Number(m[0].replace(/[ .]/g,'').replace(',','.'));
 return valid(n,0,100000000)?n:null;
}
function parseAd(raw){
 const areaLine=String(raw).split(/\r?\n/).find(x=>/\b(?:BRA-i|bruksareal|primærrom|P-rom)\b/i.test(x));
 const areaMatch=areaLine?.match(/(?:BRA-i|bruksareal|primærrom|P-rom)\s*:?\s*(\d{1,4}(?:[,.]\d)?)\s*(?:m²|m2|kvm)?/i);
 const area=areaMatch?Number(areaMatch[1].replace(',','.')):null;
 return {
  price:adNumber(raw,/(?:prisantydning|kjøpesum|pris\s*inkl)/i),
  sharedDebt:adNumber(raw,/fellesgjeld/i),common:adNumber(raw,/felleskostnader/i),buyCosts:adNumber(raw,/omkostninger/i),
  area:valid(area,10,2000)?area:null
 };
}
const allowed=(value)=>{
 try{
  const url=new URL(value);
  return url.protocol==='https:'&&(['finn.no','www.finn.no','m.finn.no'].includes(url.hostname))?url:null;
 }catch(e){return null}
};
function fromAd(){
 const t=$('rental-ad-text').value,parsed=parseAd(t);
 const map={price:'rental-price',sharedDebt:'rental-shared-debt',common:'rental-common',buyCosts:'rental-buy-costs',area:'rental-area'};
 let changed=0;
 for(const [key,id] of Object.entries(map)){
  if(parsed[key]!==null){$(id).value=String(parsed[key]);changed++}
 }
 $('rental-url-note').textContent=changed?'Foreslo '+changed+' opplysninger fra teksten. Kontroller alle tall mot salgsoppgaven og fyll inn husleie manuelt.':
  'Fant ingen tydelige nøkkeltall. Fyll inn feltene manuelt. Ingenting er hentet automatisk fra eksterne kilder.';
 update();
}
function updateValuation(){
 const area=Number($('rental-area')?.value);
 const comps=['rental-comp-1','rental-comp-2','rental-comp-3'].map(id=>Number($(id)?.value)).filter((v,i)=>$('rental-comp-'+(i+1))?.value&&valid(v,1000,1000000));
 const value=$('rental-value'),range=$('rental-value-range'),diff=$('rental-value-diff'),future=$('rental-future-value');
 const annual=Number($('rental-growth')?.value)||0;$('rental-growth-label').textContent=percent.format(annual)+' %';
 if(!valid(area,10,2000)||comps.length<2){value.textContent='–';range.textContent='Registrer gyldig BRA-i og minst to sammenlignbare kvadratmeterpriser.';diff.textContent='';future.replaceChildren();$('rental-value-marker').style.left='50%';return}
 const avg=comps.reduce((a,b)=>a+b,0)/comps.length,estimate=avg*area;
 const low=Math.min(...comps)*area,high=Math.max(...comps)*area;
 value.textContent=money(estimate);range.textContent='Sammenligningsintervall: '+money(low)+' – '+money(high)+'. Grunnlag: '+comps.length+' innlagte boligpriser.';
 const offer=Number($('rental-price')?.value);
 diff.textContent=valid(offer,1,1e8)?'Forskjell fra oppgitt prisantydning: '+money(estimate-offer)+' ('+percent.format((estimate/offer-1)*100)+' %).':'Legg inn prisantydning ovenfor for å se forskjellen.';
 const position=high>low?Math.max(0,Math.min(100,(estimate-low)/(high-low)*100)):50;
 $('rental-value-marker').style.left=position+'%';
 future.replaceChildren();
 for(const years of [1,3,5,10]){
  const box=document.createElement('div'),lbl=document.createElement('small'),number=document.createElement('strong');
  lbl.textContent=years+' år';number.textContent=money(estimate*Math.pow(1+annual/100,years));box.append(lbl,number);future.append(box);
 }
}
function boot(){
 if(!$('rental-price'))return;
 document.querySelector('#utleie').addEventListener('input',update);
 document.querySelector('#utleie').addEventListener('change',update);
 document.querySelector('#utleie').addEventListener('input',updateValuation);
 document.querySelector('#utleie').addEventListener('change',updateValuation);
 $('rental-example').addEventListener('click',()=>{
  const values={price:3500000,sharedDebt:0,buyCosts:90000,rent:16500,equity:900000,rate:5.25,years:25,common:2200,running:900,maintenance:1200,vacancy:1};
  const mapping={price:'rental-price',sharedDebt:'rental-shared-debt',buyCosts:'rental-buy-costs',rent:'rental-rent',equity:'rental-equity',rate:'rental-interest',years:'rental-years',common:'rental-common',running:'rental-running',maintenance:'rental-maintenance',vacancy:'rental-vacancy'};
  for(const [key,id] of Object.entries(mapping))$(id).value=String(values[key]);
  $('rental-area').value='62';$('rental-comp-1').value='73000';$('rental-comp-2').value='78000';$('rental-comp-3').value='75000';
  $('rental-tax').value='taxable';$('rental-url-note').textContent='Fiktivt illustrasjonseksempel: tallene er ikke hentet fra en boligannonse eller et virkelig leiemarked.';
  update();
 });
 $('rental-reset').addEventListener('click',()=>{
  for(const id of ['rental-price','rental-rent','rental-equity','rental-shared-debt','rental-buy-costs','rental-common','rental-running','rental-maintenance'])$(id).value='';
  $('rental-years').value='25';$('rental-interest').value='5.25';$('rental-vacancy').value='1';
  for(const id of ['rental-area','rental-comp-1','rental-comp-2','rental-comp-3'])$(id).value='';$('rental-growth').value='2';
  $('rental-tax').value='taxable';$('rental-url-note').textContent='Fyll inn dine egne nøkkeltall for å starte analysen.';update();
 });
 update();updateValuation();window.lanesjekkRental={realEstate,parseAd,allowed};
}
document.addEventListener('DOMContentLoaded',boot);
})();