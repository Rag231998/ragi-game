/* Lånesjekk Daily Studio v1.
 * Privacy-first enhancement: reads only live form fields in this browser;
 * no network requests, no extra local storage, no paid services or tracking.
 * Print reports are built with safe DOM methods (textContent, not user HTML).
 */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const nok=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
const pFmt=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:1});
const money=n=>Number.isFinite(n)?nok.format(Math.round(n)):'–';
const parseMoney=raw=>{
 if(window.LANENUMBERS?.parseMoney)return window.LANENUMBERS.parseMoney(String(raw??''));
 const clean=String(raw??'').replace(/\s|\u00a0/g,'').replace(',','.');
 const n=Number(clean);return Number.isFinite(n)?n:NaN;
};
const node=(tag,content,cls)=>{
 const n=document.createElement(tag);
 if(content!==undefined)n.textContent=String(content);
 if(cls)n.className=cls;
 return n;
};
const categoryPalette=['#0f8879','#48a9b8','#71b7eb','#8279c6','#efb35b','#c7a86b','#bb8d9f','#728c9d'];
const toMonthly=(amount,period)=>{
 if(window.LANEFINANCE?.monthly)return window.LANEFINANCE.monthly(amount,period);
 const multipliers={month:1,year:1/12,quarter:1/3,week:52/12};
 return Number.isFinite(amount)&&amount>=0?amount*(multipliers[period]??NaN):NaN;
};
function budgetSnapshot(){
 const rows=$('budget-rows')?.querySelectorAll('tr')||[];
 const lines=[];
 for(const r of rows){
  const get=f=>r.querySelector('[data-field="'+f+'"]')?.value||'';
  const kind=r.querySelector('.line-kind.income')?'income':'expense';
  const amount=parseMoney(get('amount')),period=get('period'),monthly=toMonthly(amount,period);
  lines.push({kind,category:get('category')||'Annet',description:get('description').trim()||'Uten beskrivelse',amount,period,monthly,valid:Number.isFinite(monthly)});
 }
 const valid=lines.filter(x=>x.valid),income=valid.filter(x=>x.kind==='income').reduce((s,x)=>s+x.monthly,0);
 const expense=valid.filter(x=>x.kind==='expense').reduce((s,x)=>s+x.monthly,0);
 const categories=new Map();
 for(const l of valid.filter(x=>x.kind==='expense'))categories.set(l.category,(categories.get(l.category)||0)+l.monthly);
 return {lines,valid,income,expense,balance:income-expense,invalid:lines.length-valid.length,categories:[...categories].sort((a,b)=>b[1]-a[1])};
}
function budgetHealth(){
 const b=budgetSnapshot(),pane=document.querySelector('.budget-health');
 if(!pane)return;
 const ratio=b.income>0?b.balance/b.income:null;
 pane.classList.toggle('is-negative',b.balance<0);
 const bar=$('budget-health-fill');bar.style.width=(ratio===null?0:Math.min(100,Math.max(0,ratio*100))).toFixed(2)+'%';
 $('budget-health-ratio').textContent=ratio===null?'–':pFmt.format(ratio*100)+' % til overs';
 $('budget-health-title').textContent=b.invalid?'Rett feltene med ugyldige beløp':b.balance<0?'Budsjettet går i minus':b.income===0?'Begynn med inntekten din':'Slik ser økonomien din ut';
 $('budget-health-description').textContent=b.invalid?b.invalid+' rad(er) inneholder feil beløp. Kontroller dem før utskrift.':
  b.income===0?'Legg til netto månedslønn eller annen inntekt for å komme i gang.':
  b.balance<0?'Utgiftene er større enn inntektene. Se på kategorioversikten under for mulige justeringer.':
  'Etter registrerte månedskostnader har du '+money(b.balance)+' igjen per måned. Dette inkluderer bare postene du har lagt inn.';
}
function addPrintRow(tbody,description,amount,period,monthly){
 const tr=document.createElement('tr');
 for(const val of [description,money(amount),period,money(monthly)])tr.append(node('td',val));
 tbody.append(tr);
}
const PERIODS={month:'Måned',week:'Uke',quarter:'Kvartal',year:'År'};
function buildReport(){
 const b=budgetSnapshot();
 if(!b.lines.length){alert('Legg inn minst én budsjettpost før du skriver ut.');return false}
 if(b.invalid){$('budget-storage-status').textContent='Rett '+b.invalid+' ugyldige budsjettposter før rapporten kan skrives ut.';return false}
 let report=$('budget-print-sheet');
 if(!report){report=document.createElement('section');report.id='budget-print-sheet';document.body.append(report)}
 report.replaceChildren();
 const brand=node('div',undefined,'print-brand'),logo=node('span','◈','print-logo');
 logo.setAttribute('aria-hidden','true');
 const brandText=node('div'),brandName=node('strong','LÅNESJEKK NORGE');
 brandText.append(brandName,node('small','Uavhengig personlig økonomioversikt'));
 brand.append(logo,brandText);
 report.append(brand);
 const title=node('div',undefined,'print-title');
 title.append(node('h1','Min personlige budsjettrapport'));
 title.append(node('p','Utskriftsdato: '+new Intl.DateTimeFormat('nb-NO',{dateStyle:'long'}).format(new Date())+' · Alle beløp omregnet til måned'));
 report.append(title);
 const kpis=node('div',undefined,'print-kpis');
 for(const [name,value] of [['Netto inntekt',b.income],['Månedlige utgifter',b.expense],['Til overs per måned',b.balance]]){
  const cell=node('div');cell.append(node('small',name),node('strong',money(value)));kpis.append(cell);
 }
 report.append(kpis);
 const note=node('p', 'Rapporten viser budsjett, ikke faktisk kontoutskrift. Årlig overskudd ved uendrede tall: '+money(b.balance*12)+'. Kontroller at alle faste og variable kostnader er inkludert.','print-note');
 report.append(note);
 function block(heading,items){
  report.append(node('h2',heading,'print-report-subtitle'));
  const table=node('table',undefined,'print-table');
  const head=document.createElement('thead'),header=document.createElement('tr');
  for(const label of ['Kategori · Beskrivelse','Oppgitt beløp','Periode','Per måned'])header.append(node('th',label));
  head.append(header);
  const body=document.createElement('tbody');
  for(const line of items){
   addPrintRow(body,line.category+' · '+line.description,line.amount,PERIODS[line.period]||line.period,line.monthly);
  }
  table.append(head,body);report.append(table);
 }
 block('01 · Inntekter',b.valid.filter(x=>x.kind==='income'));
 block('02 · Utgifter',b.valid.filter(x=>x.kind==='expense'));
 report.append(node('h2','03 · Utgifter per kategori','print-report-subtitle'));
 const legend=node('div',undefined,'print-breakdown');
 const bar=node('div',undefined,'print-bar');
 if(b.expense>0)for(const [i,[cat,amount]] of b.categories.entries()){
  const span=node('span');span.style.width=(100*amount/b.expense).toFixed(2)+'%';
  span.style.background=categoryPalette[i%categoryPalette.length];bar.append(span);
  const label=node('div',cat+' · '+money(amount)+' / mnd','print-note');
  label.style.margin='2px 0';legend.append(label);
 }
 report.append(bar,legend);
 const foot=node('div',undefined,'print-foot');
 foot.append(node('div','LÅNESJEKK NORGE  ·  www.lanesjekk-norge.vercel.app'));
 foot.append(node('p','Denne rapporten ble generert lokalt i nettleseren. Data er oppgitt av brukeren, ikke verifisert av bank eller Lånesjekk Norge. Dersom du brukte eksempelbudsjettet, er tallene fiktive.'));
 foot.append(node('p','Metode: månedsverdier = oppgitt beløp × periodefaktor; uker omregnes med 52/12. Kilder til videre budsjettering: SIFO/OsloMet. Ingen personlige beløp sendes til Lånesjekks server ved utskrift.'));
 foot.querySelectorAll('p').forEach(x=>x.style.margin='5px 0');
 report.append(foot);
 return true;
}
function printBudget(){
 if(!buildReport())return;
 document.body.classList.add('print-budget');
 // print() opens system dialog: choose Save as PDF / Lagre som PDF on desktop/mobile.
 // Neither a remote conversion service nor downloadable private file is used.
 requestAnimationFrame(()=>window.print());
}
function projected(start,monthly,years,grossPct,feePct){
 if(![start,monthly,years,grossPct,feePct].every(Number.isFinite)||start<0||monthly<0||years<1||years>40||feePct<0||feePct>5||grossPct< -100||grossPct>100)return NaN;
 const annualGross=1+grossPct/100;
 if(annualGross<0)return NaN;
 const mFactor=Math.pow(annualGross,1/12)*Math.pow(1-feePct/100,1/12);
 let capital=start;
 for(let i=0;i<years*12;i++)capital=capital*mFactor+monthly;
 return capital;
}
function investingInsights(){
 if(!$('fund-low-fee'))return;
 const start=Number($('invest-start')?.value),monthly=Number($('invest-monthly')?.value),
 years=Number($('invest-years')?.value),gross=Number($('invest-return')?.value);
 const low=Number($('fund-low-fee').value),high=Number($('fund-high-fee').value);
 const valid=Number.isFinite(low)&&Number.isFinite(high)&&low>=0&&high>=0&&low<=5&&high<=5&&high>=low;
 const a=valid?projected(start,monthly,years,gross,low):NaN;
 const b=valid?projected(start,monthly,years,gross,high):NaN;
 $('fund-low-value').textContent=money(a);
 $('fund-high-value').textContent=money(b);
 $('fund-fee-difference').textContent=money(a-b);
 $('fund-fee-status').textContent=!valid?'Kontroller gebyrene. Høyere gebyr må være minst like stort som lavere gebyr.':
  'Beregnet med '+pFmt.format(gross)+' % tenkt årlig bruttoavkastning og '+years+' år. Ingen skatt eller inflasjon; reell utvikling vil variere.';
 const fall=Number($('invest-drawdown').value),capital=projected(start,monthly,years,gross,Number($('invest-fee').value));
 $('invest-drawdown-label').textContent='−'+fall+' %';
 $('invest-after-fall').textContent=money(capital*(1-fall/100));
 $('invest-fall-amount').textContent=money(capital*fall/100);
 $('invest-recover-pct').textContent=fall===0?'0 %':pFmt.format(100*fall/(100-fall))+' %';
 const shares=Number($('invest-share-stock').value);
 $('invest-share-stock-value').textContent=shares+' %';
 $('invest-allocation-stock').style.width=shares+'%';
 $('invest-allocation-bond').style.width=(100-shares)+'%';
 $('invest-stock-part').textContent=shares+' % aksjefond';
 $('invest-bond-part').textContent=(100-shares)+' % rentefond';
 $('invest-allocation-copy').textContent=shares===0?'Kun rentefond innebærer fortsatt rente- og kredittrisiko.':
 shares===100?'Bare aksjefond kan gi store verdisvingninger og passer ikke alle tidshorisonter.':
 'Dette er en illustrert fordeling, ikke en anbefaling. Undersøk risiko, tidshorisont og tilgjengelig kapital før du velger.';
 const target=Number($('invest-goal').value),goalYears=Number($('invest-goal-years').value);
 const needed=Number.isFinite(target)&&target>0&&Number.isInteger(goalYears)&&goalYears>=1&&goalYears<=40?Math.max(0,target-start)/(goalYears*12):NaN;
 $('invest-goal-monthly').textContent=money(needed);
 $('invest-goal-note').textContent=Number.isFinite(needed)?
  'Med '+money(start)+' i startbeløp blir enkel månedlig sparing uten avkastning '+money(needed)+'. Gebyrer, skatt og prisstigning er ikke beregnet.':
  'Skriv et gyldig målbeløp og antall år (1–40).';
}
function boot(){
 if(!$('budget-rows')||!$('investering'))return;
 for(const [quick,existing] of [
 ['budget-quick-income','budget-add-income'],
 ['budget-quick-expense','budget-add-expense'],
 ['budget-quick-sample','budget-demo'],
 ['budget-quick-csv','budget-export']
 ]){
  $(quick)?.addEventListener('click',()=>$(existing)?.click());
 }
 $('budget-print')?.addEventListener('click',printBudget);
 window.addEventListener('afterprint',()=>document.body.classList.remove('print-budget'));
 $('budget-rows').addEventListener('input',()=>requestAnimationFrame(budgetHealth));
 $('budget-rows').addEventListener('change',()=>requestAnimationFrame(budgetHealth));
 // The existing finance engine creates/removes/reorders rows, so observe additions.
 const watch=new MutationObserver(()=>requestAnimationFrame(budgetHealth));
 watch.observe($('budget-rows'),{childList:true});
 for(const id of ['budget-demo','budget-reset','budget-undo','budget-salary-use'])$(id)?.addEventListener('click',()=>requestAnimationFrame(budgetHealth));
 for(const id of ['fund-low-fee','fund-high-fee','invest-drawdown','invest-share-stock','invest-goal','invest-goal-years','invest-start','invest-monthly','invest-years','invest-return','invest-fee']){
  $(id)?.addEventListener('input',investingInsights);
 }
 $('invest-reset')?.addEventListener('click',()=>requestAnimationFrame(investingInsights));
 budgetHealth();investingInsights();
 window.lanesjekkDailyStudio={budgetSnapshot,projected,buildReport};
}
document.addEventListener('DOMContentLoaded',boot);
})();