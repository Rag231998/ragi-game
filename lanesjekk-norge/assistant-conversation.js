(()=>{'use strict';
const $=id=>document.getElementById(id),panel=$('ln-assistant-panel'),form=$('ln-assistant-form'),input=$('ln-assistant-input'),messages=$('ln-assistant-messages');
if(!panel||!form||!input||!messages)return;
let busy=false,aiReady=false,history=[];
messages.replaceChildren();
const header=panel.querySelector('.ln-assistant-head small');
if(header)header.textContent='Spør om budsjett, lån, sparing og rapporter';
const tools=[['budsjett','Budsjett','#budsjett'],['boliglån','Boliglån','#sjekk'],['billån','Billån','#billan'],['fond','Fond og aksjer','#investering'],['spare','Sparing','#sparing'],['kvittering','Kvitteringer','#kvitteringer']];
const quick=document.createElement('div');quick.className='ln-chat-suggestions';quick.setAttribute('aria-label','Forslag til spørsmål');
for(const text of ['Hvordan kan jeg spare?','Forstå budsjettet mitt','Lag en budsjett­rapport','Hva koster et lån?']){const button=document.createElement('button');button.type='button';button.textContent=text;button.addEventListener('click',()=>ask(text.replace('budsjett­rapport','budsjettrapport')));quick.append(button)}
form.before(quick);
const consent=document.createElement('label');consent.className='ln-chat-ai-consent';consent.hidden=true;consent.innerHTML='<input type="checkbox" id="ln-chat-ai-optin"><span>Bruk generativ AI <small>Spørsmålet sendes til Google. Ikke oppgi sensitive opplysninger.</small></span>';
form.before(consent);
const cap=document.createElement('p');cap.className='ln-chat-capability';cap.textContent='Gratis veiviser · Ingen spørsmål sendes til en ekstern AI-tjeneste.';
form.before(cap);
fetch('/api/assistant-status',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(v=>{if(v?.enabled){aiReady=true;consent.hidden=false;cap.textContent='AI er tilgjengelig som et frivillig valg. Skriv gjerne spørsmål som i en vanlig samtale.'}}).catch(()=>{});
function bubble(text,kind='assistant',link){const el=document.createElement('div');el.className='ln-chat-bubble ln-chat-'+kind;const p=document.createElement('p');p.textContent=text;el.append(p);if(link){const a=document.createElement('a');a.href=link;a.textContent='Åpne '+(tools.find(t=>t[2]===link)?.[1]||'verktøyet')+' ↗';a.addEventListener('click',()=>{$('ln-assistant-close')?.click()});el.append(a)}messages.append(el);messages.scrollTop=messages.scrollHeight;return el}
function money(id){return $(id)?.textContent?.trim()||'ikke oppgitt'}
function localAnswer(q){const t=q.toLocaleLowerCase('nb-NO'),previous=history.at(-1)?.text?.toLocaleLowerCase('nb-NO')||'',topic=t.length<18?t+' '+previous:t;
 if(/(hvordan|kan jeg|hjelp).*(sende|dele)|e-?post|mail|rapport|pdf|facebook|instagram|dele/.test(topic))return{text:'Du kan lage rapporten direkte i Budsjett: velg «Lag PDF / del budsjettet», velg innhold, se forhåndsvisningen og trykk «Del». Der kan du laste ned PDF, bruke e-postappen eller kopiere en kryptert lenke. Hva vil du dele?',href:'#budsjett'};
 if(/budsjett|spare|sparing|forbruk|utgift|oversikt|analys/.test(topic)){const income=money('budget-income'),expenses=money('budget-expenses'),balance=money('budget-balance');if(income!=='0 kr'||expenses!=='0 kr')return{text:'Jeg kan hjelpe deg å forstå tallene du har lagt inn: Inntekter '+income+', utgifter '+expenses+' og til overs '+balance+' per måned. Begynn gjerne med de største utgiftskategoriene i oversikten. Vil du se på hvor du kan redusere utgiftene, eller hvordan du kan spare mer?',href:'#budsjett'};return{text:'Begynn med å legge inn månedlige inntekter og utgifter i budsjettet. Da får du oversikt over hva du bruker penger på, og hva som eventuelt er igjen til sparing. Vil du ha hjelp med inntektene eller utgiftene først?',href:'#budsjett'}}
 if(/rente|termin|lån|låne|boligfinansiering/.test(topic))return{text:'For å finne hva et lån koster trenger du lånebeløp, rente og nedbetalingstid. Boliglånskalkulatoren viser estimert terminbeløp og totale rentekostnader. Vil du beregne et bestemt lån eller sammenligne renter?',href:'#sjekk'};
 const match=tools.find(([key])=>topic.includes(key));if(match)return{text:'Vi kan bruke '+match[1]+'-verktøyet på Lånesjekk Norge. Vil du at jeg skal forklare hvordan du kommer i gang, eller hva resultatene betyr?',href:match[2]};
 return{text:'Jeg vil gjerne hjelpe deg videre. Gjelder spørsmålet budsjett, et lån, sparing eller en rapport? Du kan også fortelle litt mer om hva du vil finne ut, så tar vi det derfra.'}
}
async function ask(raw){const q=String(raw||'').trim().slice(0,400);if(!q||busy)return;busy=true;input.disabled=true;const send=form.querySelector('button[type="submit"]');if(send)send.disabled=true;input.value='';bubble(q,'user');quick.hidden=true;
 const placeholder=bubble('Ser på spørsmålet ditt …','assistant');let answer;
 try{if(aiReady&&$('ln-chat-ai-optin')?.checked){
  const resp=await fetch('/api/assistant-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history:history.slice(-6)})});
  const data=await resp.json();if(!resp.ok||!data.answer)throw Error(data.error||'AI-tjenesten svarte ikke');answer={text:String(data.answer).slice(0,2600)}
 }else answer=localAnswer(q);
 }catch(e){answer=localAnswer(q);answer.text='AI kunne ikke svare akkurat nå, så jeg bruker veiviseren. '+answer.text}
 placeholder.replaceWith(document.createElement('span')); // removed below without displaying an empty bubble
 const empty=messages.lastElementChild;if(empty?.tagName==='SPAN')empty.remove();
 bubble(answer.text,'assistant',answer.href);history.push({role:'user',text:q},{role:'model',text:answer.text});history=history.slice(-10);busy=false;input.disabled=false;if(send)send.disabled=false;input.focus({preventScroll:true})
}
form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();ask(input.value)},true);
bubble('Hei! 👋 Jeg hjelper deg med å forstå økonomien din og bruke verktøyene her. Hva vil du ha hjelp til i dag?');
})();
