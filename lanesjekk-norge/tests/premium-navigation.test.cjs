'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('Both desktop and mobile nav group features by understandable Norwegian categories',()=>{
 const html=read('index.html'),css=read('navigation-premium-menu.css');
 for(const label of ['Lån og bank','Budsjett og forbruk','Sparing og investering','Eiendom','Læring og spill'])assert.ok(html.includes(label),label+' missing');
 for(const id of ['#sjekk','#billan','#forbrukslan','#banker','#budsjett','#kvitteringer','#sparing','#investering','#valutakompass','#boligverdi','#utleieanalyse','#akademi','#guider'])assert.ok(html.includes('href="'+id+'"'),id+' missing');
 assert.match(html,/<details class="mobile-menu">/);
 assert.match(html,/<details class="mobile-menu-category">/);
 assert.match(css,/\.mobile-menu-category\[open\]/);
 assert.match(css,/focus-visible/);
});
