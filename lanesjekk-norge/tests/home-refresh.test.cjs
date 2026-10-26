'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Homepage uses compact featured cards across viewports',()=>{
 const html=read('index.html'),css=read('home-premium-refresh.css');
 assert.match(html,/home-premium-refresh\.css\?v=1/);
 assert.match(css,/min-height:295px!important/);
 assert.match(css,/min-height:240px!important/);
 assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(css,/home-tool:nth-child\(n\+5\)/);
});
test('Motion pause button is not visible or keyboard accessible',()=>{
 const html=read('index.html');assert.match(html,/<button[^>]*id="motion-toggle"[^>]*hidden[^>]*aria-hidden="true"[^>]*tabindex="-1"/);
 assert.match(read('motion-preferences.js'),/button\.hidden\?preferred\.matches/);
});
