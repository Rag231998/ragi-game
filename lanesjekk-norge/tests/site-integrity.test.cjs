'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),file=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=file('index.html');
test('Valutakompass has its own view, navigation and assets',()=>{
 assert.match(html,/id="valutakompass"[^>]*data-portal-view="currency"/);
 assert.match(html,/href="#valutakompass"/);
 for(const id of ['vc-from','vc-to','vc-amount','vc-fee','vc-swap','vc-result','vc-chart','vc-status'])assert.match(html,new RegExp('id="'+id+'"'));
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
 for(const ref of ['valutakompass.js','site-search.js','single-page.js','homepage-showcase.js','site-cms.js','api/currency.js','api/currency-history.js']){
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
 assert.match(file('valutakompass.js'),/if\(!latest\)/);
});
