'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Eight family-friendly educational games are wired into Academy',()=>{
 const html=read('index.html'),js=read('academy-playground.js');
 for(const id of ['academy-playground','academy-play-grid','academy-play-session','academy-play-title','academy-play-answers','academy-play-feedback','academy-play-next','academy-play-close'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 for(const game of ['sparejakt','investeringsreisen','budsjettbyen','butikkdetektiv','boligoppdraget','skattejakten','fondslabyrinten','pengemysteriet'])assert.ok(js.includes("id:'"+game+"'"),game+' missing');
 new vm.Script(js,{filename:'academy-playground.js'});assert.match(html,/academy-playground\.css/);assert.match(html,/academy-playground\.js/);
});
test('Games have no paid or randomized prize hooks',()=>{
 const js=read('academy-playground.js');assert.doesNotMatch(js,/Math\.random\(/);assert.doesNotMatch(js,/payment|purchase|checkout|stripe/i);
});
