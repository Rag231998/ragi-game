'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Menu is compact, highlights hover, and closes on outside/Escape',()=>{
 const html=read('index.html'),css=read('navigation-premium-menu.css'),js=read('navigation-menu-behavior.js');
 assert.match(css,/width:min\(410px/);assert.match(css,/\.mobile-menu-category>summary:hover/);
 assert.match(js,/pointerdown/);assert.match(js,/Escape/);assert.match(js,/other\.open=false/);
 assert.match(html,/navigation-menu-behavior\.js/);new vm.Script(js);
});
test('Educational coins are non-purchasable and capped at one award per challenge',()=>{
 const html=read('index.html'),js=read('academy-playground.js');
 assert.match(html,/id="academy-play-coins"/);assert.match(js,/if\(!rewarded\[chosen\.id\]\)/);
 assert.match(js,/Math\.min\(5000,coins\+10\)/);
 assert.match(js,/ingen pengeverdi/);assert.doesNotMatch(js,/Math\.random\(/);new vm.Script(js);
});
