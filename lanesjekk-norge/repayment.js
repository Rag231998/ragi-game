/* Simple monthly-annuity amortization, shown as transparent estimates.
 * No banking data is transmitted and no effective APR is claimed. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const money=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
 const format=n=>money.format(Math.round(n));
 function schedule(balance,years,nominal){
  if(!Number.isFinite(balance)||balance<10000||balance>100000000||
     !Number.isInteger(years)||years<1||years>40||
     !Number.isFinite(nominal)||nominal<0||nominal>35)return null;
  const months=years*12,r=nominal/1200;
  const monthly=r===0?balance/months:balance*r/(1-Math.pow(1+r,-months));
  const rows=[];let debt=balance;
  for(let year=1;year<=years;year++){
   let interestYear=0,principalYear=0;
   for(let month=1;month<=12;month++){
    const interest=debt*r;
    const principal=Math.max(0,Math.min(debt,monthly-interest));
    debt=Math.max(0,debt-principal);
    interestYear+=interest;principalYear+=principal;
   }
   if(year===years)debt=0;
   rows.push({year,interest:interestYear,principal:principalYear,balance:debt});
  }
  return rows;
 }
 function render(){
  const balance=window.LANENUMBERS.parseMoney($('balance').value);
  const years=Number($('years').value);
  const rate=window.LANENUMBERS.parseDecimal($('rate').value);
  const result=schedule(balance,years,rate);
  const tbody=$('repayment-rows');tbody.replaceChildren();
  if(!result){
   for(const id of ['repayment-year-principal','repayment-year-interest','repayment-five-years'])$(id).textContent='–';
   return;
  }
  $('repayment-year-principal').textContent=format(result[0].principal);
  $('repayment-year-interest').textContent=format(result[0].interest);
  $('repayment-five-years').textContent=format(result[Math.min(4,years-1)].balance);
  const frag=document.createDocumentFragment();
  for(const item of result){
   const tr=document.createElement('tr');
   const yearCell=document.createElement('td');yearCell.textContent='År '+item.year;
   const principal=document.createElement('td');principal.textContent=format(item.principal);
   const interest=document.createElement('td');interest.textContent=format(item.interest);
   const balanceCell=document.createElement('td');balanceCell.textContent=format(item.balance);
   const bar=document.createElement('span');bar.className='repayment-bar';
   bar.style.width=Math.min(100,100*item.balance/balance).toFixed(2)+'%';
   balanceCell.append(bar);
   tr.append(yearCell,principal,interest,balanceCell);frag.append(tr);
  }
  tbody.append(frag);
 }
 function boot(){
  if(!$('repayment-rows')||!$('loan-form'))return;
  $('loan-form').addEventListener('input',render);
  render();
 }
 document.addEventListener('DOMContentLoaded',boot);
 window.LANEREPAYMENT={schedule};
})();