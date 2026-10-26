(()=>{'use strict';
const $=id=>document.getElementById(id),panel=$('ln-assistant-panel'),form=$('ln-assistant-form'),input=$('ln-assistant-input'),messages=$('ln-assistant-messages');
if(!panel||!form||!input||!messages)return;
const brain=window.LNConversationBrain;
const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
const routes={'#budsjett':'Budsjett','#sjekk':'Boliglånskalkulator','#investering':'Fond og aksjer','#kvitteringer':'Kvitteringer'};
const history=[];let busy=false,aiMode='guide',aiReady=false,localSession=null;
messages.replaceChildren();panel.querySelector('.ln-assistant-head small').textContent='Spør helt vanlig · Jeg følger opp spørsmålene dine';
const quick=document.createElement('div');quick.className='ln-chat-suggestions';quick.setAttribute('aria-label','Forslag til spørsmål');
const phrases=['Se på budsjettet mitt','Hvor kan jeg spare mer?','Hva koster et lån?','Hvordan deler jeg rapport?'];
function promptOptions(options){quick.replaceChildren();for(const text of (options||[]).slice(0,3)){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>ask(text));quick.append(b)}quick.hidden=quick.childElementCount===0}
promptOptions(phrases);form.before(quick);
const ai=document.createElement('label');ai.className='ln-chat-ai-consent';ai.hidden=true;ai.innerHTML='<input id="ln-chat-ai-optin" type="checkbox"><span>Bruk generativ AI <small>Spørsmålene sendes til Google når du aktiverer dette. Ikke oppgi sensitive opplysninger.</small></span>';form.before(ai);
const status=document.createElement('p');status.className='ln-chat-capability';status.textContent='Personlig veiviser · bruker tallene i det åpne budsjettet lokalt';form.before(status);
function scroll(){messages.scrollTop=messages.scrollHeight}
function bubble(message,side='assistant'){const item=document.createElement('div');item.className='ln-chat-bubble ln-chat-'+side;const p=document.createElement('p');p.textContent=message;item.append(p);messages.append(item);scroll();return{item,p}}
function dots(){const b=bubble('','assistant');b.item.classList.add('ln-chat-processing');b.p.innerHTML='<span class="ln-chat-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">Forbereder svar</span>';return b}
function typeOut(el,text){return new Promise(resolve=>{if(reduced||document.hidden){el.textContent=text;resolve();return}let i=0;const chars=String(text).length;function frame(){i=Math.min(chars,i+Math.max(4,Math.ceil(chars/90)));el.textContent=text.slice(0,i);scroll();if(i<chars)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})}
function follow(item,response){if(response.href){const a=document.createElement('a');a.href=response.href;a.className='ln-chat-open-tool';a.textContent='Åpne '+(routes[response.href]||'verktøyet')+' ↗';a.addEventListener('click',()=>{$('ln-assistant-close')?.click()});item.append(a)}}
async function ask(raw){const q=String(raw||'').trim().slice(0,700);if(!q||busy)return;busy=true;input.value='';input.disabled=true;const send=form.querySelector('button[type="submit"]');if(send)send.disabled=true;quick.hidden=true;bubble(q,'user');const loader=dots();
// Allow the browser to paint the real processing state before calculations or network work begins.
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
let answer;
try{if(aiReady&&$('ln-chat-ai-optin')?.checked){if(aiMode==='local'){if(!localSession)localSession=await window.LanguageModel.create({initialPrompts:[{role:'system',content:'Du er Lånesjekk Assistent, en norsk veileder for privatøkonomi. Svar naturlig og hjelpsomt, spør oppfølgingsspørsmål ved behov. Ikke finn opp renter eller tall. Budsjett og deling ligger i budsjettverktøyet. Gi generell informasjon, ikke personlige finansråd.'}]});answer={text:String(await localSession.prompt(q)).slice(0,2900)}}else{const res=await fetch('/api/assistant-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history:history.slice(-6)})});const data=await res.json();if(!res.ok||!data.answer)throw Error(data.error||'AI svarte ikke');answer={text:String(data.answer).slice(0,2900)}}}else answer=brain?.response(q)||{text:'Hva ønsker du å vite om økonomien din?'};}catch(e){answer=brain?.response(q)||{text:'Prøv på nytt.'};answer.text='Generativ AI er utilgjengelig akkurat nå. Jeg bruker den lokale veiviseren i stedet. '+answer.text}
loader.item.classList.remove('ln-chat-processing');loader.p.replaceChildren();await typeOut(loader.p,answer.text);follow(loader.item,answer);
history.push({role:'user',text:q},{role:'model',text:answer.text});if(history.length>10)history.splice(0,history.length-10);
promptOptions(answer.follow||[]);busy=false;input.disabled=false;if(send)send.disabled=false;input.focus({preventScroll:true});scroll()
}
form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();ask(input.value)},true);
fetch('/api/assistant-status',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(async v=>{if(v?.enabled){aiReady=true;aiMode='remote';ai.hidden=false;status.textContent='Generativ AI tilgjengelig · frivillig og med tydelig personverngodkjenning';return}
 const local=window.LanguageModel;if(!local?.create)return;try{const available=await local.availability?.();if(available==='unavailable')return;aiReady=true;aiMode='local';ai.hidden=false;ai.querySelector('small').textContent='Modellen behandler spørsmål på enheten når nettleseren støtter dette.';status.textContent='Lokal AI tilgjengelig · valgfritt'}catch{}}).catch(()=>{});
bubble('Hei! 👋 Jeg kan forklare tallene i budsjettet ditt, regne på lån og hjelpe deg med rapporter. Hva har du lyst til å se på først?');
})();