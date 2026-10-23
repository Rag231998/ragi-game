'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
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
  // A production URL can temporarily serve the previous release while Vercel
  // assigns its new alias. Require the exact new homepage before continuing.
  let site;
  const expectedTitle=/<title>Lånesjekk Norge \| Budsjett, sparing, billån og banksammenligning/i;
  for(let attempt=0;attempt<12;attempt++){
    site=await request('/');
    if(site.response.status===200&&expectedTitle.test(site.body)&&site.body.includes('id="sparing" data-portal-view="savings"')&&site.body.includes('id="bankoversikt"')&&site.body.includes('id="guider" data-portal-view="guides"'))break;
    if(attempt<11)await new Promise(resolve=>setTimeout(resolve,5000));
  }
  assert.equal(site.response.status,200,'Website must be publicly reachable: '+site.url+' status '+site.response.status);
  assert.ok(expectedTitle.test(site.body),'Expected new portal title; got '+(site.body.match(/<title>[^<]*<\/title>/i)||['no title'])[0]);
  assert.match(site.body,/id="bank-query"/);
  for(const marker of ['id="sparing"','id="sparing-kalkulator"','id="offisielle-renter"','id="guider"','id="artikler"','id="sjekk"']){
    assert.ok(site.body.includes(marker),'Missing unified homepage area: '+marker);
  }
  assert.ok(site.body.includes('href="#sparing"'),'Savings navigation should be a same-page anchor');
  assert.ok(site.body.includes('href="#guider"'),'Guide navigation should be a same-page anchor');
  assert.ok(!site.body.includes('href="./sparing.html"'),'Homepage must not send users to old savings page');
  assert.ok(!site.body.includes('href="./guider.html"'),'Homepage must not send users to old guides page');
  assert.equal((site.body.match(/<details class="long-guide"/g)||[]).length,9);
  const onePage=await request('/single-page.js');
  assert.equal(onePage.response.status,200);
  assert.match(onePage.body,/lanesjekkPortal/);
  assert.match(onePage.body,/history\.pushState/);
  assert.match(site.body,/data-portal-view="savings" hidden/);
  assert.match(site.body,/data-portal-view="banks" hidden/);
  assert.match(site.body,/data-portal-view="guides" hidden/);
  assert.match(site.body,/id="portal-viewbar" hidden/);
  console.log('OK distinct in-page views for mortgages, savings, banks and 9 guides');
  console.log('OK website accessible at '+site.url);
  const banks=await request('/banker.js');
  assert.equal(banks.response.status,200);
  assert.match(banks.body,/LANEBANKER/);
  assert.match(banks.body,/officialNames/);
  const isolated={window:{}};
  vm.runInNewContext(banks.body,isolated,{timeout:1000});
  const entries=isolated.window.LANEBANKER;
  assert.equal(entries.length,97,'Expected expanded bank directory');
  assert.ok(entries.find(bank=>bank.name==='SpareBank 1 SMN'));
  assert.ok(entries.find(bank=>bank.name==='Rørosbanken Røros Sparebank'));
  console.log('OK '+entries.length+' sourced bank entries delivered');
  const search=await request('/bank-search.js');
  assert.equal(search.response.status,200);
  assert.match(search.body,/lanesjekkBankSearchTests/);
  console.log('OK bank-search script served');
  const savingsPage=await request('/sparing.html');
  assert.equal(savingsPage.response.status,200,'Savings comparison page must be public');
  assert.match(savingsPage.body,/id="save-amount"/);
  assert.match(savingsPage.body,/iframe\/innskudd/);
  const savingsData=await request('/savings-data.js');
  assert.equal(savingsData.response.status,200);
  assert.match(savingsData.body,/historical_official_bank_page_snapshot_not_live/);
  const savingsScript=await request('/savings.js');
  assert.equal(savingsScript.response.status,200);
  assert.match(savingsScript.body,/applicableRate/);
  const portalCss=await request('/portal.css');
  assert.equal(portalCss.response.status,200);
  assert.match(portalCss.body,/savings-workspace/);
  const guides=await request('/guider.html');
  assert.equal(guides.response.status,200);
  assert.match(guides.body,/innskuddsgaranti/);
  console.log('OK independently served savings, 9 guides and dated rate source disclosures');
  const numbers=await request('/numbers.js');
  assert.equal(numbers.response.status,200);
  assert.match(numbers.body,/parseMoney/);
  const repayment=await request('/repayment.js');
  assert.equal(repayment.response.status,200);
  assert.match(repayment.body,/LANEREPAYMENT/);
  const robots=await request('/robots.txt');
  assert.equal(robots.response.status,200);
  assert.match(robots.body,/Sitemap:/);
  const sitemap=await request('/sitemap.xml');
  assert.equal(sitemap.response.status,200);
  assert.match(sitemap.body,/<urlset/);
  console.log('OK numeric formatting, repayment, SEO resources served');
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
  const regional={...payload,offers:[{bankId:'nb-sparebank-1-smn',rate:5.0,monthlyFee:20,startupFee:1000}]};
  const regionalRes=await request('/api/calculate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(regional)});
  assert.equal(regionalRes.response.status,200,'Live API must accept the extended bank directory: '+regionalRes.body.slice(0,250));
  assert.equal(JSON.parse(regionalRes.body).comparisons[0].name,'SpareBank 1 SMN');
  console.log('OK live API recognizes a new verified-source bank name');
  const get=await request('/api/calculate');
  assert.equal(get.response.status,405,'API GET should be disallowed');
  console.log('OK API rejects invalid HTTP methods');
}
run().catch(error=>{console.error('PRODUCTION SMOKE TEST FAILED:',error);process.exitCode=1});
