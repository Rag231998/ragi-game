'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Official Norges Bank rate source is used, no misleading CSV observations',()=>{
 const h=read('index.html'),j=read('policy-rate-feature.js'),api=read('api/policy-rate.js');
 for(const id of ['policy-rate-value','policy-rate-date','policy-rate-status'])assert.ok(h.includes('id="'+id+'"'));
 assert.match(api,/www\.norges-bank\.no\/tema\/pengepolitikk\/styringsrenten/);
 assert.match(api,/Ingen rente vises/);assert.match(j,/policy-rate/);
});
test('Official publication rate and publication date can be parsed',()=>{
 const parse=require('../api/policy-rate.js')._test.parseOfficial;
 assert.deepEqual(parse('<h1>Styringsrenten</h1><div><strong>4,5%</strong><span>Publisert 24.09.2026</span></div>'),{rate:4.5,date:'2026-09-24'});
 assert.throws(()=>parse('<h1>Styringsrenten</h1> Ingen nye tall'));
});