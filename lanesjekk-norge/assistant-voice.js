(()=>{'use strict';
const panel=document.getElementById('ln-assistant-panel'),form=document.getElementById('ln-assistant-form'),conversation=window.LNAssistantConversation;
if(!panel||!form||!conversation)return;
const Speech=window.SpeechRecognition||window.webkitSpeechRecognition,hasAudio=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
if(!Speech&&!hasAudio)return;
const tools=document.createElement('div');tools.className='ln-voice-tools';tools.setAttribute('aria-label','Taleverktøy');
if(Speech){const mic=document.createElement('button');mic.type='button';mic.id='ln-voice-start';mic.innerHTML='<span aria-hidden="true">🎙</span> Snakk';mic.title='Åpne talevinduet og still et spørsmål med stemmen';tools.append(mic)}
if(hasAudio){const speak=document.createElement('button');speak.type='button';speak.id='ln-voice-read';speak.innerHTML='<span aria-hidden="true">🔊</span> Les opp svar';speak.title='Les opp det siste svaret';tools.append(speak)}
form.before(tools);
let recognition=null,spoken=null,voiceOpen=false,listening=false,pending=false,cancelled=false,transcript='';
const modal=document.createElement('section');modal.className='ln-voice-modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Talemodus');
modal.innerHTML='<div class="ln-voice-shell"><div class="ln-voice-top"><span><span class="ln-voice-live"></span> TALEASSISTENT</span><button type="button" id="ln-voice-close" aria-label="Lukk talemodus">✕</button></div><div class="ln-voice-center"><div class="ln-voice-orb" aria-hidden="true"><span class="ln-voice-wave">●</span><i></i><i></i><i></i></div><h3 id="ln-voice-heading">Klar til å lytte</h3><p id="ln-voice-caption">Still spørsmålet med stemmen din.</p><p id="ln-voice-transcript" aria-live="polite"></p></div><div class="ln-voice-bottom"><label class="ln-voice-speak-toggle"><input type="checkbox" id="ln-voice-speak-toggle" checked> Les opp svaret automatisk</label><div class="ln-voice-buttons"><button type="button" id="ln-voice-again">🎙 Snakk nå</button><button type="button" id="ln-voice-done">Ferdig</button></div><p>Talegjenkjenning kan bruke en tjeneste fra nettleserleverandøren. Ikke oppgi sensitive opplysninger.</p></div></div>';
panel.append(modal);
const heading=modal.querySelector('#ln-voice-heading'),caption=modal.querySelector('#ln-voice-caption'),text=modal.querySelector('#ln-voice-transcript'),again=modal.querySelector('#ln-voice-again');
function phase(name,title,subtitle){modal.dataset.phase=name;heading.textContent=title;caption.textContent=subtitle}
function stopSpeaking(){try{window.speechSynthesis?.cancel()}catch{}spoken=null}
function close(){cancelled=true;pending=false;voiceOpen=false;modal.hidden=true;panel.classList.remove('ln-voice-mode');try{recognition?.abort()}catch{}recognition=null;stopSpeaking()}
function read(textToSay,returnToVoice=false){
 if(!hasAudio)return false;const answer=String(textToSay||'').trim();if(!answer){return false}
 stopSpeaking();
 const u=new SpeechSynthesisUtterance(answer.slice(0,2600));u.lang='nb-NO';u.rate=0.98;u.pitch=1;
 const voices=window.speechSynthesis.getVoices();const preferred=voices.find(v=>/^nb[-_]/i.test(v.lang))||voices.find(v=>/^no[-_]/i.test(v.lang));
 if(preferred)u.voice=preferred;
 spoken=u;u.onstart=()=>{if(returnToVoice)phase('speaking','Jeg svarer deg','Du kan avbryte eller stille et nytt spørsmål.')};
 u.onend=()=>{spoken=null;if(returnToVoice&&voiceOpen){phase('ready','Hva mer lurer du på?','Trykk «Snakk nå» når du vil fortsette.')}};
 u.onerror=()=>{spoken=null;if(returnToVoice&&voiceOpen){phase('ready','Svaret er klart','Denne enheten kunne ikke lese opp svaret. Du kan lese det i chatten.')}};
 try{window.speechSynthesis.speak(u);return true}catch{return false}
}
function start(){
 if(!Speech)return;
 cancelled=false;stopSpeaking();if(recognition){try{recognition.abort()}catch{}recognition=null}
 transcript='';text.textContent='';listening=false;
 try{const r=new Speech();recognition=r;r.lang='nb-NO';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
  r.onstart=()=>{if(cancelled||!voiceOpen)return;listening=true;phase('listening','Jeg lytter …','Snakk naturlig. Du ser ordene mens du snakker.');again.textContent='Stopp opptak'};
  r.onresult=e=>{if(cancelled||!voiceOpen)return;let draft='';for(let i=0;i<e.results.length;i++){draft+=e.results[i][0].transcript+' ';if(e.results[i].isFinal)transcript+=e.results[i][0].transcript+' '}text.textContent=draft.trim()};
  r.onerror=e=>{if(cancelled||!voiceOpen)return;listening=false;if(e.error==='aborted')return;phase('error','Kunne ikke bruke mikrofonen',e.error==='not-allowed'?'Tillat mikrofon i Safari-innstillingene eller skriv spørsmålet.':'Kontroller mikrofontilgang og prøv igjen.');again.textContent='🎙 Prøv igjen'};
  r.onend=()=>{if(cancelled||!voiceOpen)return;listening=false;recognition=null;again.textContent='🎙 Snakk nå';const q=(transcript||text.textContent).trim();if(q&&!pending){pending=true;phase('processing','Ser på spørsmålet ditt …','Jeg finner et svar.');conversation.send(q)}else if(!q&&modal.dataset.phase!=='error'){phase('ready','Jeg hørte ikke spørsmålet','Trykk «Snakk nå» og prøv igjen.')}}
  r.start();
  phase('starting','Klargjør mikrofon …','Gi tillatelse dersom nettleseren spør.');
 }catch(e){phase('error','Mikrofonen kunne ikke startes','Bruk skrivefeltet i stedet, eller kontroller tillatelsene.');again.textContent='🎙 Prøv igjen'}
}
function open(){if(!Speech)return;voiceOpen=true;modal.hidden=false;panel.classList.add('ln-voice-mode');again.textContent='Stopp opptak';start()}
tools.querySelector('#ln-voice-start')?.addEventListener('click',open);
tools.querySelector('#ln-voice-read')?.addEventListener('click',()=>{const answer=conversation.latestAnswer();if(!answer){const btn=tools.querySelector('#ln-voice-read');btn.title='Still et spørsmål før du bruker opplesning';return}if(window.speechSynthesis.speaking){stopSpeaking();return}read(answer,false)});
modal.querySelector('#ln-voice-close').addEventListener('click',close);
modal.querySelector('#ln-voice-done').addEventListener('click',close);
again.addEventListener('click',()=>{if(listening){try{recognition?.stop()}catch{}return}if(pending)return;start()});
document.addEventListener('ln-assistant-turn',e=>{if(!voiceOpen||!pending)return;pending=false;const answer=e.detail?.answer||'';text.textContent=answer;again.textContent='🎙 Still et nytt spørsmål';if(modal.querySelector('#ln-voice-speak-toggle').checked&&hasAudio){if(!read(answer,true))phase('ready','Svaret er klart','Du kan lese svaret i chatten.')}else phase('ready','Svaret er klart','Les svaret her eller still et nytt spørsmål.')});
document.getElementById('ln-assistant-close')?.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&voiceOpen){e.stopPropagation();close()}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&voiceOpen)close()});
})();