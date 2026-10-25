'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Readable}=require('node:stream');
const video=require('../api/admin-video.js');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const ID='11111111-1111-4111-a111-111111111111';
const videoData={module:'budget',style:'everyday',duration:10,
 topic:'Personlig budsjett',description:'Voksen person regner ut budsjett ved kjøkkenbordet'};
function req(action='ready',body={},token='fake-administrator-jwt'){
 const out={method:action==='create'||action==='import'?'POST':'GET',query:{action,...(action==='status'?body:{})},
 headers:{authorization:'Bearer '+token,host:'lanesjekk-norge.onrender.com',
 ...(action==='create'||action==='import'?{'content-type':'application/json',origin:'https://lanesjekk-norge.onrender.com'}:{})}};
 if(action==='create'||action==='import')out.stream=Readable.from([Buffer.from(JSON.stringify(body))]);
 return out;
}
function response(){
 return{code:200,result:null,status(code){this.code=code;return this},
 json(data){this.result=data;return this}};
}
function mockFetch(endpoints){
 const original=global.fetch;
 global.fetch=async(url,options={})=>{
  const route=String(url);
  if(route.endsWith('/auth/v1/user'))return{ok:true,json:async()=>({id:ID})};
  if(route.includes('/rest/v1/admins'))return{ok:true,json:async()=>([{user_id:ID}])};
  if(route.includes('/v3/models/videos')&&endpoints)return endpoints(route,options);
  throw Error('Unexpected external request: '+route);
 };
 return()=>{global.fetch=original};
}
test('Video endpoint refuses unauthenticated access without checking provider configuration',async()=>{
 const res=response();const before=global.fetch;
 try{
  global.fetch=async()=>{throw Error('Should not be called')};
  await video(req('ready',{},''),res);
  assert.equal(res.code,403);assert.equal(res.result.ok,false);
 }finally{global.fetch=before}
});
test('Provider status reports safely when API key is not configured',async()=>{
 const before=process.env.HEYGEN_API_KEY;
 delete process.env.HEYGEN_API_KEY;
 const reset=mockFetch();
 try{
  const r=response();await video(req('ready'),r);
  assert.equal(r.code,200);assert.equal(r.result.configured,false);
  const create=response();await video(req('create',videoData),create);
  assert.equal(create.code,503);
 }finally{reset();if(before!==undefined)process.env.HEYGEN_API_KEY=before}
});
test('HeyGen creation validates the selected module before spending API credits',async()=>{
 const before=process.env.HEYGEN_API_KEY;process.env.HEYGEN_API_KEY='mock-production-secret';
 let requests=0;const reset=mockFetch((url,options)=>{requests++;return{ok:true,json:async()=>({video_id:'mock-video-2026'})}});
 try{
  const invalid=response();await video(req('create',{...videoData,module:'../../secret'}),invalid);
  assert.equal(invalid.code,400);
  assert.equal(requests,0);
  const ok=response();await video(req('create',videoData),ok);
  assert.equal(ok.code,202);
  assert.equal(ok.result.ok,true);
  assert.equal(ok.result.module,'budget');
  assert.match(ok.result.signature,/^[a-f0-9]{64}$/);
  assert.equal(requests,1);
 }finally{reset();if(before===undefined)delete process.env.HEYGEN_API_KEY;else process.env.HEYGEN_API_KEY=before}
});
test('Prompt is grounded in financial education, fictional adults and no fabricated savings',()=>{
 const p=video.promptFor(videoData);
 assert.match(p,/photorealistic/);
 assert.match(p,/Norwegian Bokmål/);
 assert.match(p,/fictional adult/);
 assert.match(p,/No logos/);
 assert.match(p,/no.*investment promises/i);
});
test('External video URLs are restricted to HeyGen CDN and HTTPS',()=>{
 assert.equal(video.safeSource('https://resource2.heygen.ai/media/a.mp4?token=x'),true);
 assert.equal(video.safeSource('https://evil.example.com/a.mp4'),false);
 assert.equal(video.safeSource('http://resource2.heygen.ai/a.mp4'),false);
 assert.equal(video.safeSource('https://resource2.heygen.ai.evil.example/a.mp4'),false);
});
test('Studio user interface is wired to authenticated API, draft-only placement and responsive control center',()=>{
 const html=file('studio-admin.html'),script=file('admin-ai-direct.js'),media=file('admin-animation-studio.js'),layout=file('studio-control-center.js');
 for(const id of ['studio-ai-create','studio-ai-generate','studio-ai-scene','studio-ai-style','studio-ai-duration','studio-ai-connection','studio-ai-apply','studio-ai-result-video']){
  assert.ok(html.includes('id="'+id+'"'),id+' is missing');
 }
 assert.match(html,/studio-control-center\.css/);
 assert.match(html,/admin-ai-direct\.js/);
 assert.match(script,/lanesjekkStudioVideoAuth/);
 assert.match(script,/request\('create'/);
 assert.match(script,/request\('status'/);
 assert.match(script,/request\('import'/);
 assert.match(script,/useGeneratedVideo/);
 assert.match(media,/source\(\)\.slots\[module\]\.videoUrl=url/);
 assert.match(layout,/admin-dashboard-grid/);
 assert.ok(!html.includes('id="studio-ai-api-key"'),'API key must not be entered in browser');
 for(const code of [script,media,layout,file('admin-studio.js'),file('site-media.js')])assert.doesNotThrow(()=>new vm.Script(code));
});

test('HTTP server exposes video API only to authenticated admin users',async()=>{
 const server=require('../server.js');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const url='http://127.0.0.1:'+server.address().port;
  const health=await fetch(url+'/health');assert.equal(health.status,200);
  const unauthorized=await fetch(url+'/api/admin-video?action=ready');
  assert.equal(unauthorized.status,403);
  const invalid=await fetch(url+'/api/admin-video?action=invalid');
  assert.equal(invalid.status,404);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
