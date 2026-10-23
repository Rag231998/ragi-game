'use strict';
const assert=require('node:assert/strict');
const origin=process.env.LANESJEKK_URL||'https://lanesjekk-norge.vercel.app';
const base=new URL(origin);
if(base.protocol!=='https:'||base.username||base.password)throw Error('Production smoke tests require an HTTPS origin');
async function request(path,options={}){
  const url=new URL(path,base);
  const response=await fetch(url,{...options,redirect:'follow',signal:AbortSignal.timeout(15000)});
  const body=await response.text();
  return {response,body,url:String(url)};
}
async function run(){
  const site=await request('/');
  assert.equal(site.response.status,200,'Website must be publicly reachable: '+site.url+' status '+site.response.status);
  assert.match(site.body,/<title>Lånesjekk Norge/i);
  assert.match(site.body,/id="bank-query"/);
  console.log('OK website accessible at '+site.url);
  const banks=await request('/banker.js');
  assert.equal(banks.response.status,200);
  assert.match(banks.body,/LANEBANKER/);
  assert.equal((banks.body.match(/\{id:'/g)||[]).length,11);
  console.log('OK curated directory JavaScript served');
  const search=await request('/bank-search.js');
  assert.equal(search.response.status,200);
  assert.match(search.body,/lanesjekkBankSearchTests/);
  console.log('OK bank-search script served');
  const payload={principal:3000000,propertyValue:4500000,years:25,current:{rate:5.5,monthlyFee:65},offers:[{bankId:'dnb',rate:5,monthlyFee:65,startupFee:5000}]};
  const post=await request('/api/calculate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  assert.equal(post.response.status,200,'API POST must return HTTP 200: '+post.url+' status '+post.response.status+' body '+post.body.slice(0,350));
  assert.match(post.response.headers.get('content-type')||'',/application\/json/);
  const json=JSON.parse(post.body);
  assert.equal(json.source,'user_supplied_rates_only');
  assert.equal(json.comparisons.length,1);
  assert.equal(json.comparisons[0].name,'DNB');
  assert.ok(json.comparisons[0].totalSavings>0);
  console.log('OK live API returned calculated DNB comparison');
  const get=await request('/api/calculate');
  assert.equal(get.response.status,405,'API GET should be disallowed');
  console.log('OK API rejects invalid HTTP methods');
}
run().catch(error=>{console.error('PRODUCTION SMOKE TEST FAILED:',error);process.exitCode=1});
