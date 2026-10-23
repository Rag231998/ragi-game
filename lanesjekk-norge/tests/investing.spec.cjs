'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const f=require('../investing.js');
test('zero return and costs give exact contributions',()=>{
 const x=f.project(10000,1000,2,0,0);
 assert.equal(x.paid,34000);assert.equal(x.final,34000);assert.equal(x.gain,0);
 assert.equal(x.series.length,3);
});
test('costs decrease result and negative returns can lose money',()=>{
 const x=f.project(50000,2500,15,6,.3);
 assert.ok(x.final>x.paid);assert.ok(x.feeImpact>0);
 assert.ok(x.withoutFees>x.final);
 const falling=f.project(100000,0,3,-10,0);
 assert.ok(falling.final<100000);assert.ok(falling.gain<0);
});
test('rejects nonsensical or nonfinite parameters',()=>{
 assert.equal(f.project(-1,100,5,5,1),null);
 assert.equal(f.project(0,0,41,5,0),null);
 assert.equal(f.project(0,100,5,NaN,0),null);
});
