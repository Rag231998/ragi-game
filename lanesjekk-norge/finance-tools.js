/* Personal finance calculations — deterministic, no external rate feed.
 * Values are supplied by the user; no banking account is accessed. */
(function(root){
'use strict';
const ROUND=x=>Math.round((x+Number.EPSILON)*100)/100;
function monthly(value,period){
 const scale={month:1,quarter:1/3,year:1/12,week:52/12};
 if(!Number.isFinite(value)||value<0||!(period in scale))return NaN;
 return value*scale[period];
}
function budget(lines){
 let income=0,expense=0,bankTotals={},categories={};
 for(const line of lines){
  const amount=monthly(Number(line.amount),line.period||'month');
  if(!Number.isFinite(amount)||amount<0)continue;
  if(line.kind==='income')income+=amount;
  else if(line.kind==='expense'){
   expense+=amount;
   const category=String(line.category||'Annet');
   categories[category]=(categories[category]||0)+amount;
   const bank=String(line.bank||'Ikke angitt').trim()||'Ikke angitt';
   bankTotals[bank]=(bankTotals[bank]||0)+amount;
  }
 }
 const balance=income-expense;
 return {income:ROUND(income),expense:ROUND(expense),balance:ROUND(balance),
  annualBalance:ROUND(balance*12),annualExpenses:ROUND(expense*12),
  savingRatio:income>0?balance/income:null,
  categories:Object.entries(categories).map(([name,amount])=>({name,amount:ROUND(amount)})).sort((a,b)=>b.amount-a.amount),
  banks:Object.entries(bankTotals).map(([name,amount])=>({name,amount:ROUND(amount)})).sort((a,b)=>b.amount-a.amount)};
}
function monthlyPayment(principal,annualRate,months,balloon=0){
 if(![principal,annualRate,months,balloon].every(Number.isFinite)||principal<=0||months<1||!Number.isInteger(months)||annualRate<0||annualRate>50||balloon<0||balloon>=principal)return NaN;
 const r=annualRate/1200;
 return r===0?(principal-balloon)/months:
 (principal-balloon/Math.pow(1+r,months))*r/(1-Math.pow(1+r,-months));
}
/* APR solves the present value equation by monotonic bisection.
 * Fee at signing reduces cash proceeds; nominal-rate interest accrues on principal.
 * Assumes monthly equal payments and residual due with last instalment.
 */
function effectiveAPR(principal,payment,months,monthlyFee=0,setup=0,balloon=0){
 const proceeds=principal-setup;
 if(!Number.isFinite(proceeds)||proceeds<=0)return null;
 const pv=r=>{
  let total=0;
  for(let m=1;m<=months;m++)total+=(payment+monthlyFee+(m===months?balloon:0))/Math.pow(1+r,m);
  return total;
 };
 if(pv(0)<proceeds-0.000001)return null;
 let low=0,high=1;
 for(let n=0;n<90;n++){
  const mid=(low+high)/2;
  if(pv(mid)>proceeds)low=mid;else high=mid;
 }
 return (Math.pow(1+(low+high)/2,12)-1)*100;
}
function amortize(principal,annualRate,months,balloon=0){
 const payment=monthlyPayment(principal,annualRate,months,balloon);
 if(!Number.isFinite(payment))return null;
 let debt=principal,interestTotal=0;
 const years=[];
 for(let i=1;i<=months;i++){
  const interest=debt*(annualRate/1200);
  let principalPaid=payment-interest;
  if(i===months)principalPaid=debt-balloon;
  debt=Math.max(balloon,debt-principalPaid);
  interestTotal+=interest;
  if(i%12===0||i===months)years.push({month:i,debt:ROUND(debt),interestSoFar:ROUND(interestTotal),principalPaid:ROUND(principal-debt)});
 }
 return {payment,years,interestTotal};
}
function loan(input){
 const {kind='car',amount,down=0,rate,years,setup=0,monthlyFee=0,balloon=0,operations=0}=input;
 if(!['car','consumer'].includes(kind))return null;
 if(![amount,down,rate,years,setup,monthlyFee,balloon,operations].every(Number.isFinite)||
  amount<1000||amount>30000000||down<0||down>=amount||rate<0||rate>50||
  years<1||years>30||!Number.isInteger(years)||setup<0||setup>100000||
  monthlyFee<0||monthlyFee>2000||balloon<0||operations<0||operations>50000)return null;
 if(kind==='consumer'&&(down!==0||balloon!==0||operations!==0))return null;
 const principal=amount-down,months=years*12;
 if(balloon>=principal||setup>=principal)return null;
 const a=amortize(principal,rate,months,balloon);
 if(!a)return null;
 const interest=a.interestTotal;
 const totalCredit=interest+setup+monthlyFee*months;
 const apr=effectiveAPR(principal,a.payment,months,monthlyFee,setup,balloon);
 const lowerRate=Math.max(0,rate-.5);
 const lower=monthlyPayment(principal,lowerRate,months,balloon);
 return {principal,months,payment:ROUND(a.payment),paymentExact:a.payment,
  monthlyWithFees:ROUND(a.payment+monthlyFee),
  totalCredit:ROUND(totalCredit),interest:ROUND(interest),
  totalToLender:ROUND(principal+totalCredit),
  totalCashOut:ROUND(principal+down+totalCredit+operations*months),
  apr:apr===null?null:ROUND(apr),
  firstYearInterest:ROUND(a.years[0]?.interestSoFar||0),
  savingHalfPoint:ROUND((a.payment-lower)*months),
  remaining:a.years,down,balloon,operations,
  monthlyAllIn:ROUND(a.payment+monthlyFee+operations)};
}
function budgetInsights(result,lines){
 if(result.income<=0)return ['Fyll inn nettoinntekt for å se overskudd og spareandel.'];
 const messages=[];
 if(result.balance<0)messages.push('Du budsjetterer med underskudd på '+Math.round(-result.balance).toLocaleString('nb-NO')+' kr per måned. Kontroller faste kostnader og vurder hvilke utgifter som kan reduseres.');
 else if(result.balance>0)messages.push('Mulig sparerom ut fra tallene du har lagt inn: '+Math.round(result.balance).toLocaleString('nb-NO')+' kr per måned før uforutsette utgifter.');
 const top=result.categories[0];
 if(top&&top.amount>0)messages.push('Største utgiftsgruppe er '+top.name+'. En hypotetisk reduksjon på 10 % i denne gruppen utgjør omtrent '+Math.round(top.amount*1.2).toLocaleString('nb-NO')+' kr per år.');
 const subs=result.categories.find(x=>x.name==='Abonnement');
 if(subs&&subs.amount>0)messages.push('Se over abonnementene: En reduksjon på 20 % tilsvarer omtrent '+Math.round(subs.amount*2.4).toLocaleString('nb-NO')+' kr per år.');
 messages.push('Sammenlign egne kostnader med SIFOs referansebudsjett, men husk at bolig og strøm ikke inngår i SIFOs vanlige referansetall.');
 return messages;
}
const api={monthly,budget,budgetInsights,monthlyPayment,effectiveAPR,amortize,loan};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(root)root.LANEFINANCE=api;
})(typeof window!=='undefined'?window:null);
