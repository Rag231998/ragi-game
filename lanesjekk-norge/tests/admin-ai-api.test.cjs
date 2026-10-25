'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {Readable}=require('node:stream');
const video=require('../api/admin-video.js');
const root=path.join(__dirname,'..'),file=p=>fs.readFileSync(path.join(root,p),'utf8');
const ID='11111111-1111-4111-a111-111111111111';
const FREE='bytedance/seedance-2.0-fast:free';
const PAY='bytedance/seedance-2.0';
const JOB='job-free-video-2026',SECRET='sk-or-free-only-test';
const freeEntry={id:FREE,supported_durations:[5,10,15],supported_aspect_ratios:['16:9'],supported_resolutions:['720p'],pricing_skus:{generate:'0'}};
const videoData={module:'budget',style:'everyday',duration:10,topic:'Personlig budsjett',description:'Voksen person regner ut budsjettet ved kjøkkenbordet'};
function req(action='ready',body={},token='fake-admin-token'){
 const method=['create','import'].includes(action)?'POST':'GET';
 return {method,query:{action,...(action==='status'?body:{})},headers:{
  authorization:token?'Bearer '+token:'',
  host:'lanesjekk-norge.onrender.com',
  ...(method==='POST'?{'content-type':'application/json',origin:'https://lanesjekk-norge.onrender.com'}:{})
 },stream:method==='POST'?Readable.from([Buffer.from(JSON.stringify(body))]):undefined};
}
const response=()=>({code:200,result:null,status(code){this.code=code;return this},json(body){this.result=body;return this}});
function mockFetch(fn){
 const previous=global.fetch;
 global.fetch=async(url,options={})=>{
  const u=String(url);
  if(u.endsWith('/auth/v1/user'))return {ok:true,json:async()=>({id:ID})};
  if(u.includes('/rest/v1/admins'))return {ok:true,json:async()=>([{user_id:ID}])};
  return fn(u,options);
 };
 return()=>global.fetch=previous;
}
function json(data,ok=true){return {ok,status:ok?200:429,json:async()=>data}}
function setSecret(key){const previous=process.env.OPENROUTER_API_KEY;if(key)process.env.OPENROUTER_API_KEY=key;else delete process.env.OPENROUTER_API_KEY;return()=>previous===undefined?delete process.env.OPENROUTER_API_KEY:process.env.OPENROUTER_API_KEY=previous}
test('Anonymous callers cannot discover provider settings or generate a video',async()=>{
 const before=global.fetch;try{
 global.fetch=async()=>{throw Error('Network must not be used')};
 const r=response();await video(req('ready',{},''),r);assert.equal(r.code,403);
 }finally{global.fetch=before}
});
test('Free-only model policy rejects paid, missing, unknown and negative pricing',()=>{
 for(const item of [
  {...freeEntry,id:PAY},{...freeEntry,pricing_skus:{generate:'0.004'}},
  {...freeEntry,pricing_skus:{}},{...freeEntry,pricing_skus:{generate:'0',audio:'0.1'}},
  {...freeEntry,pricing_skus:{generate:null}}
 ])assert.equal(video.pricingIsFree(item),false);
 assert.equal(video.pricingIsFree(freeEntry),true);
 assert.ok(video.FREE_MODELS.every(x=>x.endsWith(':free')));
});
test('Missing free API key displays setup requirement and forbids generation',async()=>{
 const restore=setSecret();const reset=mockFetch(()=>{throw Error('Unexpected provider request')});
 try{
  const ready=response();await video(req(),ready);
  assert.equal(ready.code,200);assert.equal(ready.result.configured,false);assert.equal(ready.result.freeOnly,true);
  const create=response();await video(req('create',videoData),create);
  assert.equal(create.code,503);assert.match(create.result.error,/OPENROUTER_API_KEY/);
 }finally{reset();restore()}
});
test('Provider pricing changes to paid: hard block, never send a chargeable generation request',async()=>{
 const restore=setSecret(SECRET);let creations=0;
 const reset=mockFetch((u,options)=>{
  if(u.endsWith('/videos/models'))return json({data:[{...freeEntry,pricing_skus:{generate:'0.02'}}]});
  if(options.method==='POST'){creations++;throw Error('Paid request attempted')}
  throw Error('Unexpected '+u);
 });
 try{
  const ready=response();await video(req(),ready);
  assert.equal(ready.result.configured,false);
  const out=response();await video(req('create',videoData),out);
  assert.equal(out.code,503);assert.equal(creations,0);
 }finally{reset();restore()}
});
test('When a zero-cost model is verified, only its :free ID is submitted',async()=>{
 const restore=setSecret(SECRET),payloads=[];
 const reset=mockFetch((u,options)=>{
  if(u.endsWith('/videos/models'))return json({data:[freeEntry,{...freeEntry,id:PAY,pricing_skus:{generate:'99'}}]});
  if(u.endsWith('/videos')&&options.method==='POST'){payloads.push(JSON.parse(options.body));return json({id:JOB,status:'pending'})}
  throw Error('Unexpected '+u);
 });
 try{
  const ready=response();await video(req(),ready);
  assert.equal(ready.result.configured,true);assert.deepEqual(ready.result.durations,[5,10,15]);
  const invalid=response();await video(req('create',{...videoData,module:'../private'}),invalid);assert.equal(invalid.code,400);
  const out=response();await video(req('create',videoData),out);
  assert.equal(out.code,202);assert.equal(out.result.costNok,0);assert.match(out.result.signature,/^[0-9a-f]{64}$/);
  assert.equal(payloads.length,1);assert.equal(payloads[0].model,FREE);assert.equal(payloads[0].generate_audio,false);
  assert.equal(payloads[0].resolution,'720p');
 }finally{reset();restore()}
});
test('Completed free video provides provider preview and authenticated zero-charge download',async()=>{
 const restore=setSecret(SECRET),requests=[];
 const reset=mockFetch((u,options)=>{
  requests.push(u);
  if(u.endsWith('/videos/models'))return json({data:[freeEntry]});
  if(u.endsWith('/videos')&&options.method==='POST')return json({id:JOB,status:'pending'});
  if(u.endsWith('/videos/'+JOB))return json({id:JOB,status:'completed',unsigned_urls:['https://cdn.example.com/sample.mp4'],usage:{cost:0}});
  if(u.endsWith('/videos/'+JOB+'/content'))return {
   ok:true,headers:{get:()=>String(2048)},
   body:Readable.from([Buffer.alloc(2048)]),
   json:async()=>({})
  };
  if(u.includes('/storage/v1/object/animation-assets/video/'))return json({Key:'video/ai-test.mp4'});
  throw Error('Unexpected '+u);
 });
 try{
  const created=response();await video(req('create',videoData),created);
  assert.equal(created.code,202);
  const job={videoId:created.result.videoId,signature:created.result.signature};
  const status=response();await video(req('status',job),status);
  assert.equal(status.result.status,'completed');assert.equal(status.result.videoUrl,'https://cdn.example.com/sample.mp4');
  const saved=response();await video(req('import',job),saved);
  assert.equal(saved.code,200);assert.match(saved.result.videoUrl,/\/animation-assets\/video\/ai-[0-9a-f-]+\.mp4$/);
  assert.ok(requests.some(x=>x.endsWith('/videos/'+JOB+'/content')));
  assert.ok(!requests.includes('https://cdn.example.com/sample.mp4'),'Server must not fetch external preview URL');
 }finally{reset();restore()}
});
test('Video prompts contain realistic fictional adults without financial promises',()=>{
 const p=video.promptFor(videoData);
 assert.match(p,/photorealistic/);assert.match(p,/Norwegian Bokmål/);
 assert.match(p,/fictional adult/);assert.match(p,/No logos/);
 assert.match(p,/investment promises/);
});
test('Studio UI contains video placement controls, but never exposes a secret key',()=>{
 const html=file('studio-admin.html'),script=file('admin-ai-direct.js'),media=file('admin-animation-studio.js');
 for(const id of ['studio-ai-generate','studio-ai-duration','studio-ai-apply','studio-ai-result-video','media-placement'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(script,/request\('create'/);assert.match(script,/request\('status'/);assert.match(script,/request\('import'/);
 assert.match(media,/useGeneratedVideo/);
 assert.ok(!html.includes('id="studio-ai-api-key"'));
 assert.ok(!html.includes('HEYGEN_API_KEY'));
 for(const js of [script,media,file('studio-control-center.js'),file('admin-studio.js')])assert.doesNotThrow(()=>new vm.Script(js));
});
test('HTTP endpoint requires administrator authorization',async()=>{
 const server=require('../server.js');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const root='http://127.0.0.1:'+server.address().port;
  assert.equal((await fetch(root+'/health')).status,200);
  assert.equal((await fetch(root+'/api/admin-video?action=ready')).status,403);
  assert.equal((await fetch(root+'/api/admin-video?action=invalid')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
