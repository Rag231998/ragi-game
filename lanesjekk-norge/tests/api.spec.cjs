'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const handler=require('../api/calculate.js');

function request(body,method='POST',headers={}){
  const res={
    statusCode:200,headers:{},payload:undefined,ended:false,
    setHeader(name,value){this.headers[name]=value;},
    status(code){this.statusCode=code;return this;},
    json(value){this.payload=value;this.ended=true;return this;},
    end(){this.ended=true;return this;}
  };
  handler({method,body,headers},res);
  return res;
}
const base=()=>({
  principal:3000000,propertyValue:4500000,years:25,
  current:{rate:5.5,monthlyFee:65},offers:[{bankId:'dnb',rate:5,monthlyFee:65,startupFee:5000}]
});
test('API calculates bank comparisons using only user-supplied prices',()=>{
  const response=request(base());
  assert.equal(response.statusCode,200);
  assert.equal(response.payload.source,'user_supplied_rates_only');
  assert.equal(response.payload.comparisons[0].bankId,'dnb');
  assert.equal(response.payload.comparisons[0].name,'DNB');
  assert.ok(response.payload.comparisons[0].totalSavings>0);
  assert.ok(response.payload.comparisons[0].monthlyDifference>0);
  assert.equal(response.payload.loan.ltvPercent,66.67);
  assert.equal(response.headers['Cache-Control'],'no-store');
});
test('zero-rate annuity is calculated without division by zero',()=>{
  const q=base();q.current.rate=0;q.current.monthlyFee=0;q.offers=[];
  const response=request(q);
  assert.equal(response.statusCode,200);
  assert.equal(response.payload.current.monthlyPayment,10000);
  assert.equal(response.payload.current.totalInterest,0);
});
test('unknown bank ID and injected bank names are not trusted',()=>{
  const invalid=base();invalid.offers[0].bankId='unregistered-bank';
  assert.equal(request(invalid).statusCode,400);
  const altered=base();altered.offers[0].name='Fake cheapest Norwegian bank';
  assert.equal(request(altered).payload.comparisons[0].name,'DNB');
});
test('bank IDs in API match precisely the manually curated browser directory',()=>{
  const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../banker.js'),'utf8'),context);
  const browserIds=context.window.LANEBANKER.map(b=>b.id).sort();
  for(const bankId of browserIds){
    const q=base();q.offers=[{bankId,rate:4.5,monthlyFee:0,startupFee:0}];
    const r=request(q);
    assert.equal(r.statusCode,200,'Missing server-side bank: '+bankId);
  }
  assert.equal(browserIds.length,11);
  assert.equal(new Set(browserIds).size,11);
  for(const bank of context.window.LANEBANKER)assert.match(bank.register,/^https:\/\/www\.finanstilsynet\.no\//);
});
test('malformed numeric values, missing terms and too many offers are rejected',()=>{
  const cases=[
    {...base(),principal:0},
    {...base(),years:25.5},
    {...base(),current:{rate:'5.5',monthlyFee:65}},
    {...base(),current:{rate:5.5,monthlyFee:Infinity}},
    {...base(),offers:Array.from({length:9},()=>({bankId:'dnb',rate:5,monthlyFee:0,startupFee:0}))},
    {...base(),offers:[{bankId:'dnb',rate:-1,monthlyFee:0,startupFee:0}]},
    {...base(),offers:'not an array'},
    [],
    null
  ];
  for(const c of cases)assert.equal(request(c).statusCode,400);
});
test('HTTP method and payload limits are enforced',()=>{
  assert.equal(request({},'GET').statusCode,405);
  assert.equal(request({},'POST',{'content-length':'14000'}).statusCode,413);
  const options=request({},'OPTIONS');
  assert.equal(options.statusCode,204);
  assert.equal(options.ended,true);
});
