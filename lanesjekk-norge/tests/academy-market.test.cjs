'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Academy economic games are reachable and have complete accessible interactive elements',()=>{
 const html=read('index.html'),script=read('academy-game-lab.js');
 for(const id of ['academy-game-lab','academy-game-select','academy-game-next','academy-game-options','academy-game-feedback','academy-live-zone','academy-live-refresh','academy-live-status']){
 assert.ok(html.includes('id="'+id+'"'),'missing '+id);
 }
 for(const topic of ['budget','loan','saving','tax'])assert.match(script,new RegExp(topic+':\\['));
 assert.match(html,/academy-game-lab\.js/);assert.match(html,/academy-game-lab\.css/);
 assert.match(script,/addEventListener\('change'/);assert.match(html,/aria-live="polite"/);
});
test('Economic feed validates input and does not invent live prices',async()=>{
 const handler=require('../api/market-feed.js');
 const invoke=async(zone,method='GET')=>{let code=200,headers={};const res={setHeader:(k,v)=>headers[k]=v,status(v){code=v;return this},json(v){return{code,body:v}}};return handler({method,query:{zone}},res)};
 const bad=await invoke('INVALID');assert.equal(bad.code,400);
 const denied=await invoke('NO1','POST');assert.equal(denied.code,405);
 assert.match(read('api/market-feed.js'),/response\.ok/);
 assert.match(read('api/market-feed.js'),/503/);
 assert.match(read('index.html'),/Spotpris er ikke total strømregning/);
});
test('Both sites use the same premium layer and accessible theme icon',()=>{
 const site=read('index.html'),studio=read('studio-admin.html');
 for(const html of [site,studio])assert.match(html,/premium-unified\.css\?v=/);
 assert.match(site,/id="site-theme-icon"/);assert.match(studio,/id="admin-theme-quick"/);
});
