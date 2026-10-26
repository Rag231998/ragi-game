'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Budget redesign retains the operational calculator and accessible actions',()=>{
 const html=read('index.html'),css=read('budget-workspace-premium.css');
 for(const id of ['budsjett','budget-income','budget-expenses','budget-balance','budget-ratio','budget-quick-income','budget-quick-expense','budget-quick-sample','budget-quick-csv','budget-print','budget-rows','budget-add-income','budget-add-expense','budget-donut','budget-timeline','budget-insights','budget-scenario-category','budget-scenario-percent'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.match(html,/budget-workspace-premium\.css\?v=1/);
 assert.match(css,/budget-insights-grid/);assert.match(css,/budget-table-wrap/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(html,/Budsjettet ditt/);
});
