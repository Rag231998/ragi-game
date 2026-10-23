'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const data=require('../savings-data.js');
const {applicableRate,compare,project}=require('../savings.js');
test('savings rates have individual official bank sources and date, not fabricated live status',()=>{
 assert.equal(data.asOf,'2026-10-23');
 assert.match(data.status,/not_live/);
 assert.ok(data.products.length>=8);
 for(const p of data.products){
  assert.ok(p.bank&&p.account&&p.id);
  assert.ok(p.source.startsWith('https://'));
  assert.ok(p.rateTiers.every(t=>Number.isFinite(t.min)&&Number.isFinite(t.rate)));
  assert.ok(p.notes);
 }
});
test('bank interest tiers change at the exact balance thresholds',()=>{
 const find=id=>data.products.find(p=>p.id===id);
 assert.equal(applicableRate(find('dnb-pluss'),99999),2.45);
 assert.equal(applicableRate(find('dnb-pluss'),100000),3.65);
 assert.equal(applicableRate(find('dnb-pluss'),500000),4.10);
 assert.equal(applicableRate(find('storebrand-hoy'),499999),3.75);
 assert.equal(applicableRate(find('storebrand-hoy'),500000),4.40);
 assert.equal(applicableRate(find('landkreditt-plus'),1000000),4.60);
 assert.equal(applicableRate(find('klp-hoy'),99999),3.40);
 assert.equal(applicableRate(find('klp-hoy'),100000),3.95);
});
test('results rank by gross annual income for chosen balance and chosen eligibility',()=>{
 const result=compare(100000,'all',false);
 assert.ok(result.length>=5);
 assert.ok(result.every(p=>!p.member));
 assert.ok(result.every((p,i)=>i===0||p.profit<=result[i-1].profit));
 assert.equal(result.find(p=>p.id==='klp-31').profit,4200);
 assert.equal(result.find(p=>p.id==='dnb-vanlig').profit,2450);
 assert.ok(!result.some(p=>p.id==='obos-lang'));
 const members=compare(100000,'all',true);
 assert.ok(members.some(p=>p.id==='obos-lang'));
 assert.equal(members[0].id,'obos-lang');
});
test('filtering and query constraints work without returning unqualified products',()=>{
 assert.ok(compare(100000,'fri',false).every(p=>p.type==='fri'));
 assert.ok(compare(100000,'varsel',false).every(p=>p.type==='varsel'));
 assert.deepEqual(compare(100000,'all',false,'ukjent konto'),[]);
 assert.equal(compare(0).length,0);
 assert.equal(compare(5000000).length,0);
});
test('money forecast uses monthly deposits and monthly interest; zero rate has no gains',()=>{
 const x=project(100000,2000,0,10);
 assert.equal(x.deposit,340000);
 assert.equal(x.value,340000);
 assert.equal(x.profit,0);
 const y=project(100000,2000,4,10);
 assert.ok(y.value>y.deposit);
 assert.equal(y.years.length,10);
 assert.ok(y.years.every((row,i)=>i===0||row.value>y.years[i-1].value));
 assert.equal(project(NaN,2000,4,10),null);
 assert.equal(project(100000,2000,-1,10),null);
 assert.equal(project(100000,2000,4,31),null);
});
