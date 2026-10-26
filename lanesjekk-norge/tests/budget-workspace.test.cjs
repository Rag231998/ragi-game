'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Budget redesign retains the operational calculator and accessible actions',()=>{
 const html=read('index.html'),css=read('budget-workspace-premium.css');
 for(const id of ['budsjett','budget-income','budget-expenses','budget-balance','budget-ratio','budget-quick-sample','budget-quick-csv','budget-print','budget-rows','budget-add-income','budget-add-expense','budget-donut','budget-timeline','budget-insights','budget-scenario-category','budget-scenario-percent'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.match(html,/budget-workspace-premium\.css\?v=2/);
 assert.match(css,/budget-insights-grid/);assert.match(css,/budget-table-wrap/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(html,/Budsjettet ditt/);
});

test('Optional bank analysis is collapsed, but remains available to the budget engine',()=>{
 const html=read('index.html');
 assert.match(html,/<details class="budget-bank-analysis tool-pane">/);
 assert.match(html,/<div id="budget-bank-chart"/);
 assert.match(html,/STEG 2 · REGISTRER POSTER/);
 assert.match(html,/STEG 3 · FORSTÅ FORBRUKET/);
 assert.doesNotMatch(html,/id="budget-quick-income"/);
 assert.doesNotMatch(html,/id="budget-quick-expense"/);
});
