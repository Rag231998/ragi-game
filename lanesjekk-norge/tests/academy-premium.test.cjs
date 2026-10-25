'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');const read=n=>fs.readFileSync(path.join(root,n),'utf8');
test('Premium Academy loads all controls for challenges and simulation',()=>{
 const html=read('index.html'),js=read('academy-premium.js');
 for(const id of ['academy-premium-experience','academy-challenge-grid','academy-question-dialog','academy-question-feedback','academy-level','academy-xp','academy-progress-reset','academy-sim-type','academy-sim-budget','academy-sim-mortgage','academy-sim-savings','academy-sim-main'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 for(const id of ['sim-income','sim-fixed','sim-variable','sim-loan','sim-interest','sim-years','sim-start','sim-deposit','sim-save-years','sim-return'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.match(html,/academy-premium\.css/);assert.match(html,/academy-premium\.js/);assert.match(js,/localStorage\.setItem/);
});
test('Academy premium scripts have valid JavaScript syntax and no missing source dependencies',()=>{
 for(const name of ['academy-premium.js','academy-game-lab.js','api/market-feed.js'])new vm.Script(read(name),{filename:name});
 const script=read('academy-premium.js');assert.match(script,/function calculate\(/);assert.match(script,/function renderProgress\(/);
 assert.match(script,/if\(progress\.completed\.includes\(id\)\)return/);
});
