'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Homepage has featured tools with functional reveal control and maintained slide showcase',()=>{
 const html=read('index.html'),css=read('economy-pulse-home.css'),js=read('economy-pulse-home.js');
 for(const id of ['home-tools-toggle','economy-pulse-home','economy-pulse-cards','economy-pulse-status','loan-showcase'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.match(css,/nth-child\(n\+5\)/);assert.match(js,/classList\.toggle\('show-all-tools'\)/);
 assert.match(html,/sc-slides/);assert.match(html,/Økonomiakademiet/);
 new vm.Script(js,{filename:'economy-pulse-home.js'});
});
test('Global economy endpoint validates HTTP method and formats only sourced observations',async()=>{
 const handler=require('../api/economy-pulse.js');const res={setHeader(){},status(c){this.statusCode=c;return this},json(payload){return {code:this.statusCode||200,payload}}};
 assert.equal((await handler({method:'POST'},res)).code,405);
 const js=read('api/economy-pulse.js');new vm.Script(js,{filename:'economy-pulse.js'});
 assert.match(js,/NY\.GDP\.MKTP\.KD\.ZG/);assert.match(js,/FP\.CPI\.TOTL\.ZG/);
 assert.match(js,/row\.date/);assert.match(js,/503/);assert.match(read('index.html'),/siste tilgjengelige årsdata/);
});
