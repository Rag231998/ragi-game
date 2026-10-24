'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),file=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=file('index.html');
test('Valutakompass has its own view, navigation and assets',()=>{
 assert.match(html,/id="valutakompass"[^>]*data-portal-view="currency"/);
 assert.match(html,/href="#valutakompass"/);
 for(const id of ['vc-from','vc-to','vc-amount','vc-converted','vc-swap','vc-chart','vc-status','vc-popular'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/valutakompass\.js/);assert.match(html,/valutakompass\.css/);
 assert.match(file('single-page.js'),/currency:'Valutakompass'/);
 assert.match(file('site-search.js'),/\['Valutakompass'/);
});
test('One homepage banner, six educational scenes',()=>{
 assert.equal((html.match(/id="loan-showcase"/g)||[]).length,1);
 assert.equal((html.match(/class="sc-slide sc-/g)||[]).length,6);
 assert.equal((html.match(/data-sc-goto="/g)||[]).length,6);
 assert.ok(!html.includes('home-explainer.js'),'duplicate second banner must stay removed');
 assert.match(file('homepage-showcase.js'),/scenes.length!==6/);
 assert.match(file('site-cms.js'),/'currency'/);
});
test('All referenced local JavaScript and stylesheets are present',()=>{
 const refs=[...html.matchAll(/(?:src|href)="\.\/([^"]+\.(?:js|css))(?:\?[^"]*)?"/g)].map(m=>m[1]);
 assert.ok(refs.length>10);
 for(const ref of refs)assert.ok(fs.existsSync(path.join(root,ref)),ref+' missing');
});
test('All local JavaScript entrypoints compile',()=>{
 for(const ref of ['auth-recovery-redirect.js','admin-studio.js','valutakompass.js','property-market-model.js','property-trends.js','site-media.js','site-search.js','single-page.js','homepage-showcase.js','site-cms.js','api/currency.js','api/currency-history.js']){
  assert.doesNotThrow(()=>new vm.Script(file(ref),{filename:ref}),ref);
 }
});
test('Homepage currency slide links to real tool and does not claim live rates',()=>{
 assert.match(html,/sc-currency[\s\S]*?href="#valutakompass"/);
 assert.match(html,/ikke sanntidskurser|ingen fiktive sanntidstall/i);
});
test('Property BRA is integer-only and currency monetary numbers are not faked',()=>{
 assert.match(html,/id="pv-area"[^>]*step="1"/);
 assert.match(file('property-value.js'),/Number.isInteger\(area\)/);
 assert.match(file('valutakompass.js'),/if\(!quote\)return;/);
 assert.doesNotMatch(html,/id="vc-fee"/);
});


test('Currency conversion endpoint validates a verified reference quote',async()=>{
 const endpoint=require('../api/currency.js');
 const previous=global.fetch;let requestUrl='';
 global.fetch=async url=>{requestUrl=String(url);return {ok:true,json:async()=>[{base:'USD',quote:'NOK',date:'2026-10-23',rate:10.43}]}};
 const out={code:200,setHeader(){return this},status(n){this.code=n;return this},json(value){this.body=value;return this}};
 try{
  await endpoint({method:'GET',query:{from:'USD',to:'NOK'}},out);
  assert.equal(out.code,200);assert.equal(out.body.rate,10.43);
  assert.equal(out.body.date,'2026-10-23');assert.match(requestUrl,/quotes=NOK/);
 }finally{global.fetch=previous}
});
test('Historical currency endpoint validates and orders quoted dates',async()=>{
 const endpoint=require('../api/currency-history.js');
 const previous=global.fetch;
 global.fetch=async url=>({ok:true,json:async()=>[{base:'USD',quote:'NOK',date:'2026-10-23',rate:10.4},{base:'USD',quote:'NOK',date:'2026-10-22',rate:10.3},{base:'EUR',quote:'NOK',date:'2026-10-23',rate:11.1}]});
 const out={code:200,setHeader(){return this},status(n){this.code=n;return this},json(value){this.body=value;return this}};
 try{
  await endpoint({method:'GET',query:{from:'USD',to:'NOK',days:'30'}},out);
  assert.equal(out.code,200);assert.equal(out.body.points.length,2);
  assert.equal(out.body.points[0].rate,10.3);assert.equal(out.body.points[1].rate,10.4);
 }finally{global.fetch=previous}
});


test('SSB four-quarter basis uses real observed sales as weights, not an invented ±15% band',()=>{
 const {basis}=require('../property-market-model.js');
 const r=basis([
  {period:'2025K4',value:50000,sales:10},
  {period:'2026K1',value:60000,sales:30},
  {period:'2026K2',value:70000,sales:20},
  {period:'2026K3',value:80000,sales:40}
 ]);
 assert.equal(r.pricePerSqm,69000);assert.equal(r.sales,100);
 assert.equal(r.lowestSqm,50000);assert.equal(r.highestSqm,80000);
 assert.equal(r.quarters,4);assert.equal(r.weighted,true);
 const single=basis([{period:'2026K3',value:70000,sales:3}]);
 assert.equal(single.singleQuarter,true);
 assert.equal(single.pricePerSqm,70000);
 assert.equal(basis([]),null);
});
test('SSB 14310 municipality lookup selects declared labels and validates real JSON-stat cells',async()=>{
 const previous=global.fetch;
 const metadata={id:['Region','Boligtype','ContentsCode','Tid'],
  dimension:{
   Region:{category:{index:{'03':0},label:{'03':'Akershus'}}},
   Boligtype:{category:{index:{'BLOKK':0,'SMÅ':1},label:{'BLOKK':'Blokkleiligheter','SMÅ':'Småhus'}}},
   ContentsCode:{category:{index:{'KvPris':0,'Salg':1},label:{'KvPris':'Gjennomsnittlig kvadratmeterpris','Salg':'Antall omsetninger'}}},
   Tid:{category:{index:{'2026K2':0,'2026K3':1},label:{'2026K2':'2026K2','2026K3':'2026K3'}}}
  }};
 const data={id:['Region','Boligtype','ContentsCode','Tid'],size:[1,1,2,2],
  dimension:{...metadata.dimension,Region:{category:{index:{'K-3209':0},label:{'K-3209':'Ullensaker'}}},
  Boligtype:{category:{index:{'BLOKK':0},label:{'BLOKK':'Blokkleiligheter'}}}},
  value:[65000,70000,25,30]};
 const requested=[];
 global.fetch=async url=>{requested.push(String(url));return {ok:true,json:async()=>String(url).includes('/metadata')?metadata:data}};
 const out={code:200,headers:{},setHeader(k,v){this.headers[k]=v;return this},status(n){this.code=n;return this},json(value){this.body=value;return this}};
 try{
  await require('../api/property-market.js')({method:'GET',query:{municipality:'3209',type:'block'}},out);
  assert.equal(out.code,200);assert.equal(out.body.rows.length,2);
  assert.equal(out.body.rows[0].sqm,65000);assert.equal(out.body.rows[1].sales,30);
  assert.equal(out.body.regionLabel,'Ullensaker');
  assert.ok(requested.some(u=>decodeURIComponent(u).includes('valueCodes[Region]=K-3209')));
  assert.ok(requested.some(u=>decodeURIComponent(u).includes('codeList[Region]=vs_Kommun')));
 }finally{global.fetch=previous}
});


test('Password reset redirects from the public homepage to the admin form, retaining recovery tokens',()=>{
 const redirect=file('auth-recovery-redirect.js');
 function visit(link){
  const url=new URL(link);
  const env={location:{
   pathname:url.pathname,hash:url.hash,search:url.search,origin:url.origin,
   href:url.href,replace(to){this.next=to}
  },URL,URLSearchParams};
  vm.runInNewContext(redirect,env);
  return env.location.next||null;
 }
 assert.equal(visit('https://lanesjekk-norge.onrender.com/'),null);
 assert.equal(visit('https://lanesjekk-norge.onrender.com/#sparing'),null);
 const secret='https://lanesjekk-norge.onrender.com/#access_token=fake-test-token&type=recovery&refresh_token=fake-test-refresh';
 assert.equal(visit(secret),'https://lanesjekk-norge.onrender.com/studio-admin.html#access_token=fake-test-token&type=recovery&refresh_token=fake-test-refresh');
 const pkce=visit('https://lanesjekk-norge.onrender.com/?code=test-callback-code-12345678');
 assert.ok(pkce.endsWith('/studio-admin.html?code=test-callback-code-12345678'));
 const expired=visit('https://lanesjekk-norge.onrender.com/#error=access_denied&error_code=otp_expired');
 assert.ok(expired.endsWith('/studio-admin.html#error=access_denied&error_code=otp_expired'));
 assert.equal(visit('https://lanesjekk-norge.onrender.com/other.html#access_token=x&type=recovery'),null);
 assert.ok(file('index.html').includes('auth-recovery-redirect.js'));
 assert.ok(file('admin-studio.js').includes("redirectTo=new URL('/studio-admin.html'"));
});
