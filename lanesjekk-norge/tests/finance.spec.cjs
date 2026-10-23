'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const f=require('../finance-tools.js');
test('period conversion is precise and predictable',()=>{
 assert.equal(f.monthly(12000,'year'),1000);
 assert.equal(f.monthly(3000,'quarter'),1000);
 assert.equal(f.monthly(1000,'week'),1000*52/12);
 assert.ok(Number.isNaN(f.monthly(-1,'month')));
 assert.ok(Number.isNaN(f.monthly(100,'unknown')));
});
test('budget aggregates incomes, expenses and bank/category totals',()=>{
 const r=f.budget([
  {kind:'income',amount:42000,period:'month',bank:'DNB'},
  {kind:'income',amount:12000,period:'year',bank:'DNB'},
  {kind:'expense',category:'Bolig',bank:'DNB',amount:15000,period:'month'},
  {kind:'expense',category:'Strøm',bank:'Nordea',amount:3000,period:'quarter'},
  {kind:'expense',category:'Abonnement',bank:'Nordea',amount:1200,period:'year'}
 ]);
 assert.equal(r.income,43000);assert.equal(r.expense,16100);
 assert.equal(r.balance,26900);assert.equal(r.annualBalance,322800);
 assert.equal(r.categories[0].name,'Bolig');
 assert.equal(r.banks.find(x=>x.name==='Nordea').amount,1100);
 assert.ok(r.savingRatio>0.6);
});
test('negative budget and zero-income budget handle edge cases without NaN',()=>{
 const r=f.budget([{kind:'expense',category:'Mat og drikke',amount:5000,period:'month'}]);
 assert.equal(r.balance,-5000);assert.equal(r.savingRatio,null);
 assert.ok(f.budgetInsights(r,[]).some(s=>s.includes('nettoinntekt')));
});
test('zero-rate annuity payment and fixed-rate mortgage loan cost',()=>{
 assert.equal(f.monthlyPayment(120000,0,120),1000);
 const a=f.loan({kind:'consumer',amount:120000,down:0,rate:0,years:10,setup:0,monthlyFee:0,balloon:0,operations:0});
 assert.equal(a.payment,1000);assert.equal(a.totalCredit,0);assert.equal(a.apr,0);
 assert.equal(a.remaining.at(-1).debt,0);
});
test('car loan includes downpayment, fees, balloon residual, and APR above nominal',()=>{
 const c=f.loan({kind:'car',amount:350000,down:75000,rate:6.9,years:5,setup:2000,monthlyFee:65,balloon:0,operations:1500});
 assert.equal(c.principal,275000);assert.equal(c.months,60);
 assert.ok(c.payment>4000&&c.payment<7000);
 assert.ok(c.apr>6.9);
 assert.ok(c.interest>0&&c.totalCredit>c.interest);
 assert.ok(c.totalToLender>275000);
 assert.equal(c.monthlyAllIn,c.monthlyWithFees+1500);
 assert.equal(c.remaining.at(-1).debt,0);
 const balloon=f.loan({kind:'car',amount:300000,down:0,rate:6,years:5,setup:500,monthlyFee:0,balloon:80000,operations:0});
 assert.equal(balloon.remaining.at(-1).debt,80000);
 assert.ok(balloon.payment<c.payment+1500);
});
test('paying monthly fees affects APR and invalid loan inputs fail closed',()=>{
 const noFee=f.loan({kind:'consumer',amount:100000,rate:10,years:3,setup:0,monthlyFee:0});
 const withFee=f.loan({kind:'consumer',amount:100000,rate:10,years:3,setup:2000,monthlyFee:50});
 assert.ok(withFee.apr>noFee.apr);
 assert.equal(f.loan({kind:'car',amount:100000,down:100000,rate:5,years:5}),null);
 assert.equal(f.loan({kind:'consumer',amount:100000,rate:-1,years:5}),null);
 assert.equal(f.loan({kind:'car',amount:100000,down:0,rate:6,years:5,balloon:100000}),null);
 assert.equal(f.loan({kind:'consumer',amount:100000,rate:6,years:5,down:1}),null);
});

test('invalid budget entries are reported rather than hidden in totals',()=>{
 const lines=[
  {kind:'income',amount:35000,period:'month'},
  {kind:'expense',amount:5000,period:'month',category:'Bolig'},
  {kind:'expense',amount:NaN,period:'month',category:'Transport'},
  {kind:'expense',amount:250,period:'invalid',category:'Annet'},
  {kind:'expense',amount:-50,period:'month'},
  {kind:'expense',amount:'2000',period:'month'}
 ];
 const result=f.budget(lines);
 assert.equal(result.income,35000);
 assert.equal(result.expense,5000);
 assert.equal(result.balance,30000);
 assert.equal(result.invalidLines,4);
 assert.ok(f.budgetInsights(result,lines)[0].includes('4 budsjettpost'));
});
