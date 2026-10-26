'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');test('Assistant and sharing are accessible and wired into homepage',()=>{const h=read('index.html'),js=read('assistant-share.js');for(const id of ['ln-assistant-open','ln-assistant-panel','ln-assistant-close','ln-assistant-messages','ln-assistant-form','ln-assistant-input','ln-share-current'])assert.ok(h.includes('id="'+id+'"'));assert.match(h,/assistant-share\.css/);assert.match(h,/assistant-share\.js/);new vm.Script(js)});test('Sharing uses route only and never serializes financial inputs',()=>{const js=read('assistant-share.js');assert.match(js,/location\.origin\+location\.pathname\+route/);assert.match(js,/navigator\.share/);assert.match(js,/navigator\.clipboard/);assert.doesNotMatch(js,/localStorage|JSON\.stringify|querySelectorAll\('input'/);});
test('Assistant has a single conversational view and optional collapsible account',()=>{const html=read('index.html'),css=read('assistant-conversation.css'),brain=read('assistant-conversation.js');assert.doesNotMatch(html,/data-ln-tab="share"/);assert.doesNotMatch(html,/assistant-premium-tabs\.js\?v/);assert.match(html,/class="ln-assistant-account"/);assert.match(html,/assistant-conversation\.js/);assert.match(css,/ln-chat-suggestions/);assert.match(brain,/\/api\/assistant-status/);assert.match(brain,/ln-chat-ai-optin/);new vm.Script(brain)});

test('Opt-in AI never silently replaces free guide',()=>{const ai=read('assistant-local-ai.js');assert.match(ai,/LanguageModel/);assert.match(ai,/availability/);assert.match(ai,/checked=false/);assert.match(ai,/session\.prompt/);assert.match(ai,/addEventListener\('submit'/);new (require('node:vm').Script)(ai)});

test('Gemini integration uses only server-side key and applies limits',()=>{const api=read('api/assistant-ai.js'),client=read('assistant-local-ai.js');assert.match(api,/process\.env\.GEMINI_API_KEY/);assert.match(api,/gemini-2\.5-flash-lite/);assert.match(api,/usage\.n>12/);assert.match(client,/\/api\/assistant-ai/);assert.doesNotMatch(client,/GEMINI_API_KEY|AIza[A-Za-z0-9_-]{20}/);new (require('node:vm').Script)(client)});

test('Budget account lives in the budget overview, not inside the assistant',()=>{const h=read('index.html');const i=h.indexOf('id="ln-budget-private-tools"'),a=h.indexOf('id="ln-assistant-panel"');assert.ok(i>0&&a>i);assert.ok(h.slice(i,a).includes('id="ln-vault-login"'));assert.ok(!h.slice(a).includes('id="ln-vault-login"'));assert.match(h,/budget-private-tools\.css/);});
test('Conversational guidance remembers mortgage amounts and uses current budget numbers',()=>{
 const js=read('assistant-brain.js'),frontend=read('assistant-conversation.js');const window={};
 const values={'budget-income':'55 000 kr','budget-expenses':'32 000 kr','budget-balance':'23 000 kr'};
 const document={getElementById:id=>values[id]?{textContent:values[id]}:null,querySelectorAll:()=>[]};
 vm.runInNewContext(js,{window,document,Intl,Number,Math});
 const brain=window.LNConversationBrain;
 assert.match(brain.response('Hva koster et lån?').text,/Hvor stort lån/);
 assert.match(brain.response('3 millioner kr').text,/3.000.000|3\s?000\s?000/);
 assert.match(brain.response('5,2 %').text,/nedbetalingstid/);
 assert.match(brain.response('25 år').text,/terminbeløp/);
 assert.match(brain.response('Hva om renten øker 1 %?').text,/6.2 %/);
 assert.match(brain.response('Hvor kan jeg spare mer i budsjettet?').text,/55\s?000/);
 assert.match(brain.response('Hva hvis jeg sparer 1 000 kr?').text,/12\s?000/);
 assert.match(frontend,/ln-chat-dots/);assert.match(frontend,/requestAnimationFrame/);
 assert.match(frontend,/SpeechRecognition/);assert.match(frontend,/speechSynthesis/);
});
