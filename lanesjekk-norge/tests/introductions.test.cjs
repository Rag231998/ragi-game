'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const src=n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8');
test('Introduction controls are part of protected Studio draft and published CMS only',()=>{
 const html=src('studio-admin.html'),admin=src('admin-studio.js'),cms=src('site-cms.js');
 for(const id of ['admin-panel-introductions','admin-intro-history','admin-intro-enabled','admin-intro-title','admin-intro-body','admin-intro-version','admin-intro-preview'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(admin,/introductions:window\.LNIntroConfig\.normalize\(src\.introductions\)/);
 assert.match(cms,/introductions:window\.LNIntroConfig\.normalize\(a\.introductions\)/);
 assert.match(cms,/lanesjekk-intro-config/);assert.match(admin,/getDraft:\(\)=>draft/);
 for(const n of ['feature-introductions-data.js','feature-introductions.js','admin-introductions.js','site-cms.js','admin-studio.js'])assert.doesNotThrow(()=>new vm.Script(src(n)),n);
});
test('History hidden by default, public helper supports read-once versions and opt-in',()=>{
 const sandbox={window:{}},api=src('feature-introductions-data.js');vm.runInNewContext(api,sandbox);
 const settings=sandbox.window.LNIntroConfig.normalize();
 assert.equal(settings.historyEnabled,false);
 assert.equal(settings.items.history.enabled,true);
 assert.equal(settings.items.budget.enabled,false);
 assert.equal(sandbox.window.LNIntroConfig.normalize({historyEnabled:true,items:{history:{enabled:true,version:3}}}).items.history.version,3);
 const pub=src('feature-introductions.js');
 assert.match(pub,/STORE='lanesjekk-feature-read-confirmations-v1'/);
 assert.match(pub,/localStorage\.setItem/);assert.match(pub,/config\.historyEnabled/);
 assert.match(pub,/stopImmediatePropagation/);assert.match(pub,/requireAck/);
});
