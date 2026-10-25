'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Property result identifies its actual SSB observations and source',()=>{
 const html=read('index.html'),client=read('property-value.js');
 for(const id of ['pv-provenance','pv-source-region','pv-source-type','pv-source-period','pv-source-sample','pv-source-fetched'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.match(client,/provenance\.region/);assert.match(client,/provenance\.sales/);assert.match(html,/om-boligdataene\.html/);
 new vm.Script(client,{filename:'property-value.js'});
});
test('Source disclosure refuses to claim sales-data, personal valuation or e-takst',()=>{
 const html=read('index.html'),method=read('om-boligdataene.html');
 assert.match(html,/ikke et oppslag i grunnboken/);
 assert.match(method,/vi har ikke koblet opp et register med tinglyste kjøpesummer/i);
 assert.match(method,/SSB.*14310/);
});
