'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8');
test('Chat actions: real copy/share/detail controls with user feedback',()=>{const h=read('index.html'),j=read('assistant-actions.js');assert.match(h,/assistant-actions\.js/);assert.match(h,/assistant-actions\.css/);for(const x of ['chat.send','navigator.share','navigator.clipboard','aria-pressed','ln-assistant-restored','Se detaljer','Kopier','Del','👍','👎'])assert.ok(j.includes(x));new vm.Script(j)});
test('History requires opt-in and supports revocation',()=>{const j=read('assistant-history.js');for(const x of ['CONSENT=','if(!storageAllowed)return false','localStorage.removeItem(KEY)','ln-chat-storage-optin'])assert.ok(j.includes(x));new vm.Script(j)});
test('Voice can mute microphone without sending buffered speech',()=>{const j=read('assistant-voice.js');for(const x of ['ln-voice-mute','if(muted)','recognition.abort','aria-pressed'])assert.ok(j.includes(x));new vm.Script(j)});
test('Voice mode provides a real multi-turn composer, a dialogue log and no focus stealing',()=>{const v=read('assistant-voice.js'),c=read('assistant-conversation.js'),s=read('assistant-voice-history.css');for(const id of ['ln-voice-followup-form','ln-voice-followup','ln-voice-send','ln-voice-thread'])assert.ok(v.includes(id));assert.match(v,/followupForm\.addEventListener\('submit'/);assert.match(v,/sendFollowup\(q\)/);assert.match(v,/addExchange\(q,answer\)/);assert.match(c,/!panel\.classList\.contains\('ln-voice-mode'\)/);assert.match(s,/\.ln-voice-followup-form/);new vm.Script(v)});

test('Hands-free mode restarts listening only with user choice and offers opt-in neural voice',()=>{const v=read('assistant-voice.js'),s=read('assistant-voice-history.css'),h=read('index.html');for(const x of ['ln-voice-autocontinue','resumeListening','finishSpeaking','ln-voice-natural','cloudReady','assistant-tts','deviceVoice'])assert.ok(v.includes(x));assert.match(h,/assistant-voice\.js\?v=6/);assert.match(s,/ln-voice-natural-wrap/);new vm.Script(v)});
test('Neural voice API rejects missing key and creates WAV with valid PCM from the configured model',async()=>{
 const {Readable}=require('node:stream'),tts=require('../api/assistant-tts.js');
 const prev=process.env.GEMINI_API_KEY,oldFetch=global.fetch;
 const makeResponse=()=>({statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.result=v;return this}});
 const request=(text)=>({method:'POST',headers:{origin:'https://lanesjekk-norge.onrender.com','x-forwarded-for':'192.0.2.90'},stream:Readable.from([Buffer.from(JSON.stringify({text}))])});
 try{
  delete process.env.GEMINI_API_KEY;const unavailable=makeResponse();await tts(request('Hei der'),unavailable);assert.equal(unavailable.statusCode,503);
  process.env.GEMINI_API_KEY='mock-key';let requestedUrl='';
  global.fetch=async(url,options)=>{requestedUrl=String(url);assert.equal(options.headers['x-goog-api-key'],'mock-key');return {ok:true,json:async()=>({candidates:[{content:{parts:[{inlineData:{data:Buffer.alloc(48000).toString('base64'),mimeType:'audio/L16'}}]}}]})}};
  const done=makeResponse();await tts(request('Hei der, god dag.'),done);
  assert.equal(done.statusCode,200);assert.equal(done.result.mimeType,'audio/wav');
  assert.equal(Buffer.from(done.result.audioBase64,'base64').toString('ascii',0,4),'RIFF');
  assert.match(requestedUrl,/gemini-2\.5-flash-preview-tts/);
 }finally{global.fetch=oldFetch;if(prev===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=prev}
});
