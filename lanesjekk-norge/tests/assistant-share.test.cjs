'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');test('Assistant and sharing are accessible and wired into homepage',()=>{const h=read('index.html'),js=read('assistant-share.js');for(const id of ['ln-assistant-open','ln-assistant-panel','ln-assistant-close','ln-assistant-messages','ln-assistant-form','ln-assistant-input','ln-share-current'])assert.ok(h.includes('id="'+id+'"'));assert.match(h,/assistant-share\.css/);assert.match(h,/assistant-share\.js/);new vm.Script(js)});test('Sharing uses route only and never serializes financial inputs',()=>{const js=read('assistant-share.js');assert.match(js,/location\.origin\+location\.pathname\+route/);assert.match(js,/navigator\.share/);assert.match(js,/navigator\.clipboard/);assert.doesNotMatch(js,/localStorage|JSON\.stringify|querySelectorAll\('input'/);});
test('Assistant has a single conversational view and optional collapsible account',()=>{const html=read('index.html'),css=read('assistant-conversation.css'),brain=read('assistant-conversation.js');assert.doesNotMatch(html,/data-ln-tab="share"/);assert.doesNotMatch(html,/assistant-premium-tabs\.js\?v/);assert.match(html,/class="ln-assistant-account"/);assert.match(html,/assistant-conversation\.js/);assert.match(css,/ln-chat-suggestions/);assert.match(brain,/\/api\/assistant-status/);assert.match(brain,/ln-chat-ai-optin/);new vm.Script(brain)});

test('Opt-in AI never silently replaces free guide',()=>{const ai=read('assistant-local-ai.js');assert.match(ai,/LanguageModel/);assert.match(ai,/availability/);assert.match(ai,/checked=false/);assert.match(ai,/session\.prompt/);assert.match(ai,/addEventListener\('submit'/);new (require('node:vm').Script)(ai)});

test('Gemini integration uses only server-side key and applies limits',()=>{const api=read('api/assistant-ai.js'),client=read('assistant-local-ai.js');assert.match(api,/process\.env\.GEMINI_API_KEY/);assert.match(api,/gemini-2\.5-flash-lite/);assert.match(api,/usage\.n>30/);assert.match(client,/\/api\/assistant-ai/);assert.doesNotMatch(client,/GEMINI_API_KEY|AIza[A-Za-z0-9_-]{20}/);new (require('node:vm').Script)(client)});

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
 brain.reset();assert.match(brain.response('Hva koster et lån?').text,/Hvor stort lån/);assert.match(brain.response('3.000.000').text,/3\s?000\s?000/);assert.match(brain.response('5,2').text,/nedbetalingstid/);assert.match(brain.response('25').text,/terminbeløp/);
 assert.match(brain.response('Hvor kan jeg spare mer i budsjettet?').text,/55\s?000/);
 assert.match(brain.response('Hva hvis jeg sparer 1 000 kr?').text,/12\s?000/);
 assert.match(frontend,/ln-chat-dots/);assert.match(frontend,/requestAnimationFrame/);
 assert.doesNotMatch(frontend,/SpeechRecognition|speechSynthesis|ln-chat-icon-button/);
});

test('iOS chat has a single clear message input and does not display unusable voice buttons',()=>{
 const client=read('assistant-conversation.js');
 const html=read('index.html');
 assert.doesNotMatch(client,/🎙|🔈|🔊|recognitionClass|readAloud/);
 assert.doesNotMatch(client,/Mikrofonen er ikke tilgjengelig/);
 assert.match(html,/id="ln-assistant-input"/);
 assert.match(html,/id="ln-assistant-form"/);
 new vm.Script(client);
});

test('Conversation history supports new chat, resuming archived conversations and deletion',()=>{
 const html=read('index.html'),api=read('assistant-conversation.js'),history=read('assistant-history.js'),css=read('assistant-voice-history.css');
 assert.match(html,/assistant-history\.js/);
 assert.match(html,/assistant-voice-history\.css/);
 assert.match(history,/localStorage\.setItem/);
 assert.match(history,/conversation\.restore/);
 assert.match(history,/conversation\.reset/);
 assert.match(history,/Slett alle samtaler/);
 assert.match(history,/Ny chat/);
 assert.match(api,/ln-assistant-turn/);
 assert.match(api,/latestAnswer/);
 assert.match(css,/ln-chat-history/);
 new vm.Script(history);
});
test('Voice controls have explicit labels, consent notice and an animated dialog only when speech is supported',()=>{
 const html=read('index.html'),voice=read('assistant-voice.js'),css=read('assistant-voice-history.css');
 assert.match(html,/assistant-voice\.js/);
 for(const word of ['Snakk','Les opp svar','Lytter','Send','Talegjenkjenning kan bruke'])assert.ok(voice.includes(word),word);
 assert.match(voice,/SpeechRecognition\|\|window\.webkitSpeechRecognition/);
 assert.match(voice,/interimResults=true/);
 assert.match(voice,/aria-modal/);
 assert.match(css,/ln-voice-ring/);
 assert.match(css,/prefers-reduced-motion/);
 new vm.Script(voice);
});

test('Natural multi-topic conversation recovers from unrelated questions and understands a second property purchase',()=>{
 const code=read('assistant-brain.js'),window={},document={getElementById:()=>null,querySelectorAll:()=>[]};
 vm.runInNewContext(code,{window,document,Intl,Number,Math});
 const brain=window.LNConversationBrain;
 const unrelated=brain.response('porno').text;assert.match(unrelated,/seksuelt innhold/);
 const orientation=brain.response('liker gutter som er homo?').text;assert.match(orientation,/homofil|skeiv/);
 const home=brain.response('Jeg ønsker å se mulighet for boligkjøp nr 2');
 assert.match(home.text,/bolig nummer to/);assert.match(home.text,/leies ut/);assert.match(home.text,/eksisterende boliglån/);
 assert.deepEqual(Array.from(home.follow),['Jeg vil leie den ut','Jeg skal bo der selv','Det er en fritidsbolig']);
 assert.match(brain.response('Jeg vil leie den ut').text,/utleie/);
 assert.match(brain.response('3 millioner kr').text,/300\s?000/);
 assert.match(brain.response('500 000 kr i egenkapital').text,/bruttoinntekt/);
 assert.match(brain.response('Årslønn 800 000 kr').text,/samlet gjeld|annen gjeld/);
 const estimate=brain.response('Restgjeld 1 000 000 kr').text;
 assert.match(estimate,/2\s?500\s?000/);
 assert.match(estimate,/forenklet vurdering/);
 brain.reset();
 assert.match(brain.response('Jeg vil kjøpe sekundærbolig').text,/bolig nummer to/);
 brain.reset();
 assert.match(brain.response('Kjøp av bolig nummer 2').text,/bolig nummer to/);
});

test('General purpose assistant uses a real language model for arbitrary questions when configured',()=>{
 const server=read('api/assistant-ai.js'),ui=read('assistant-conversation.js');
 for(const marker of ['responseMimeType','responseJsonSchema','systemInstruction','suggestions','page','history'])assert.ok(server.includes(marker),marker);
 assert.match(server,/GEMINI_API_KEY/);
 assert.match(server,/ikke finn opp|Ikke finn opp/);
 assert.match(server,/spørsmål|spørsmålet/);
 assert.match(ui,/page:\/\^#/);
 assert.match(ui,/data\.suggestions/);
 assert.match(ui,/data\.tool/);
 assert.doesNotMatch(ui,/GEMINI_API_KEY/);
 new vm.Script(ui);
});

test('Gemini backend handles arbitrary general questions with multi-turn context and safe suggestions',async()=>{
 const source=read('api/assistant-ai.js'),requests=[],mod={exports:{}};
 const fakeFetch=async(url,options)=>{
  requests.push({url,body:JSON.parse(options.body)});
  return{ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({answer:'Jeg kan svare på dette uten å sende deg tilbake til budsjettet.',suggestions:['Vil du ha et eksempel?','Kan du forklare mer?'],tool:''})}]}}]})};
 };
 const context={module:mod,process:{env:{GEMINI_API_KEY:'fake-key'}},fetch:fakeFetch,AbortController,AbortSignal,Buffer,Date,Map,setTimeout,clearTimeout};
 vm.runInNewContext(source,context);
 const payload={question:'Kan du forklare hva empati betyr?',page:'#budsjett',history:[{role:'user',text:'Først snakket vi om en ekstra bolig.'},{role:'model',text:'Ja, hvordan skal boligen brukes?'}]};
 const req={method:'POST',headers:{origin:'https://lanesjekk-norge.onrender.com'},stream:{async *[Symbol.asyncIterator](){yield Buffer.from(JSON.stringify(payload))}}};
 let http=0,result;
 const res={setHeader(){},status(code){http=code;return this},json(data){result=data;return this}};
 await mod.exports(req,res);
 assert.equal(http,200);
 assert.equal(result.ok,true);
 assert.match(result.answer,/empati|dette/);
 assert.deepEqual(Array.from(result.suggestions),['Vil du ha et eksempel?','Kan du forklare mer?']);
 assert.equal(result.tool,null);
 assert.equal(requests.length,1);
 assert.equal(requests[0].body.contents.length,3);
 assert.equal(requests[0].body.generationConfig.responseMimeType,'application/json');
 assert.match(requests[0].body.systemInstruction.parts[0].text,/privatøkonomi|hjelper med/);
 assert.match(requests[0].body.systemInstruction.parts[0].text,/utenfor økonomi|ufarlige tema/);
});
