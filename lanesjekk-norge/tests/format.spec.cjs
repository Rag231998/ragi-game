'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function browserModule(file,exportName){
 const context={
  window:{},
  document:{addEventListener(){}},
  Intl,Number,Math,HTMLInputElement:class {}
 };
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
 return context.window[exportName];
}
const format=browserModule('numbers.js','LANENUMBERS');
const repayment=browserModule('repayment.js','LANEREPAYMENT');

test('Norwegian thousands grouping is shown for 3 109 049 kroner',()=>{
 assert.equal(format.displayMoney('3109049'),'3 109 049');
 assert.equal(format.parseMoney('3 109 049'),3109049);
 assert.equal(format.parseMoney('3\u00a0109\u202f049'),3109049);
 assert.equal(format.displayMoney('123456789'),'123 456 789');
 assert.equal(format.displayMoney('0'),'0');
});
test('numeric punctuation from Norwegian users is parsed correctly',()=>{
 assert.equal(format.parseMoney('3.109.049'),3109049);
 assert.equal(format.parseMoney('3 109 049,50'),3109049.5);
 assert.equal(format.displayMoney('3109049,50'),'3 109 049,50');
 assert.equal(format.parseDecimal('5,25'),5.25);
 assert.equal(format.parseDecimal('5.25'),5.25);
 assert.equal(format.displayDecimal('5.25'),'5,25');
 assert.ok(Number.isNaN(format.parseDecimal('')));
 assert.ok(Number.isNaN(format.parseMoney('')));
});
test('rejects invalid currency and interest inputs',()=>{
 for(const value of ['abc','--5','5,2,4','3 10x'])assert.ok(Number.isNaN(format.parseMoney(value)));
 assert.ok(Number.isNaN(format.parseDecimal('5,2,3')));
});
test('annuity amortization ends at zero for full maturity',()=>{
 const rows=repayment.schedule(3109049,25,5.25);
 assert.equal(rows.length,25);
 assert.equal(rows[0].year,1);
 assert.ok(rows[0].principal>0);
 assert.ok(rows[0].interest>0);
 assert.ok(rows[0].balance<3109049);
 assert.equal(rows[24].balance,0);
 assert.ok(rows.every((year,i)=>i===0||year.balance<=rows[i-1].balance));
});
test('zero interest amortization repays principal and no interest',()=>{
 const rows=repayment.schedule(120000,10,0);
 assert.equal(rows.length,10);
 assert.equal(rows[0].principal,12000);
 assert.equal(rows[0].interest,0);
 assert.equal(rows.at(-1).balance,0);
});
test('invalid amortization inputs cannot create a schedule',()=>{
 assert.equal(repayment.schedule(0,25,5),null);
 assert.equal(repayment.schedule(2000000,25.5,5),null);
 assert.equal(repayment.schedule(2000000,25,Infinity),null);
});
