(()=>{'use strict';
const panel=document.getElementById('ln-assistant-panel'),form=document.getElementById('ln-assistant-form'),conversation=window.LNAssistantConversation;
if(!panel||!form||!conversation)return;
const Speech=window.SpeechRecognition||window.webkitSpeechRecognition,hasAudio=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
const tools=document.createElement('div');tools.className='ln-voice-tools';tools.setAttribute('aria-label','Taleverktøy');
const mic=document.createElement('button');mic.type='button';mic.id='ln-voice-start';mic.innerHTML='<span aria-hidden="true">🎙</span> Snakk / dikter';mic.title='Åpne talemodus. Bruk iPhones diktering når talegjenkjenning ikke støttes.';tools.append(mic)
if(hasAudio){const speak=document.createElement('button');speak.type='button';speak.id='ln-voice-read';speak.innerHTML='<span aria-hidden="true">🔊</span> Les opp svar';speak.title='Les opp det siste svaret';tools.append(speak)}
form.before(tools);
const readButton=tools.querySelector('#ln-voice-read');if(readButton){readButton.disabled=!conversation.latestAnswer();readButton.setAttribute('aria-label','Les opp det siste svaret fra assistenten')}
let recognition=null,spoken=null,voiceOpen=false,listening=false,pending=false,cancelled=false,muted=false,transcript='';
const modal=document.createElement('section');modal.className='ln-voice-modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Talemodus');
modal.innerHTML='<div class="ln-voice-shell"><div class="ln-voice-top"><span><span class="ln-voice-live"></span> TALEASSISTENT</span><button type="button" id="ln-voice-close" aria-label="Lukk talemodus">✕</button></div><div class="ln-voice-center"><div class="ln-voice-orb" aria-hidden="true"><span class="ln-voice-wave">●</span><i></i><i></i><i></i></div><h3 id="ln-voice-heading">Klar til å lytte</h3><p id="ln-voice-caption">Snakk naturlig, eller skriv nedenfor.</p><p id="ln-voice-transcript" aria-live="polite"></p><div id="ln-voice-thread" class="ln-voice-thread" role="log" aria-label="Siste meldinger i samtalen" aria-live="polite"></div></div><div class="ln-voice-bottom"><form id="ln-voice-followup-form" class="ln-voice-followup-form"><label class="sr-only" for="ln-voice-followup">Skriv et nytt spørsmål eller svar</label><input id="ln-voice-followup" type="text" maxlength="400" autocomplete="off" enterkeyhint="send" placeholder="Skriv svar eller et nytt spørsmål …"><button type="submit" id="ln-voice-send">Send</button></form><div class="ln-voice-buttons"><button type="button" id="ln-voice-again">🎙 Snakk nå</button><button type="button" id="ln-voice-mute" aria-pressed="false">🔇 Mikrofon av</button><button type="button" id="ln-voice-done">Ferdig</button></div><div class="ln-voice-preferences"><label class="ln-voice-speak-toggle"><input type="checkbox" id="ln-voice-speak-toggle" checked> Les opp svaret</label><button id="ln-voice-play" type="button" hidden>🔊 Hør svaret igjen</button><button id="ln-voice-keyboard" type="button">Åpne chatten</button></div><p class="ln-voice-privacy">Du kan alltid svare skriftlig. Nettleserens taletjeneste kan behandle det du sier.</p></div></div>';
panel.append(modal);
const heading=modal.querySelector('#ln-voice-heading'),caption=modal.querySelector('#ln-voice-caption'),text=modal.querySelector('#ln-voice-transcript'),again=modal.querySelector('#ln-voice-again');
const play=modal.querySelector('#ln-voice-play'),keyboard=modal.querySelector('#ln-voice-keyboard'),muteButton=modal.querySelector('#ln-voice-mute');let latestVoiceAnswer='';
const followupForm=modal.querySelector('#ln-voice-followup-form'),followupInput=modal.querySelector('#ln-voice-followup'),sendButton=modal.querySelector('#ln-voice-send'),thread=modal.querySelector('#ln-voice-thread');
function addExchange(question,answer){
 const q=document.createElement('p');q.className='ln-voice-question';q.textContent=String(question||'');
 const a=document.createElement('p');a.className='ln-voice-answer';a.textContent=String(answer||'');
 thread.append(q,a);while(thread.children.length>8)thread.firstElementChild.remove();
 thread.scrollTop=thread.scrollHeight;
}
function phase(name,title,subtitle){modal.dataset.phase=name;heading.textContent=title;caption.textContent=subtitle}
function updateMute(){muteButton.setAttribute('aria-pressed',String(muted));muteButton.textContent=muted?'🎙 Slå på mikrofon':'🔇 Slå av mikrofon'}
function stopSpeaking(){try{window.speechSynthesis?.cancel()}catch{}spoken=null;if(play)play.textContent='🔊 Les opp svaret'}
function close(){cancelled=true;pending=false;muted=false;updateMute();voiceOpen=false;modal.hidden=true;panel.classList.remove('ln-voice-mode');try{recognition?.abort()}catch{}recognition=null;stopSpeaking();text.textContent='';followupInput.value='';sendButton.disabled=false;again.disabled=false;const trigger=tools.querySelector('#ln-voice-start');trigger?.focus({preventScroll:true})}
function read(textToSay,returnToVoice=false){
 if(!hasAudio)return false;const answer=String(textToSay||'').trim();if(!answer){return false}
 stopSpeaking();
 const u=new SpeechSynthesisUtterance(answer.slice(0,2600));u.lang='nb-NO';u.rate=0.98;u.pitch=1;
 const voices=window.speechSynthesis.getVoices();const preferred=voices.find(v=>/^nb[-_]/i.test(v.lang))||voices.find(v=>/^no[-_]/i.test(v.lang));
 if(preferred)u.voice=preferred;
 spoken=u;u.onstart=()=>{if(play)play.textContent='■ Stopp opplesning';if(returnToVoice)phase('speaking','Jeg svarer deg','Du kan avbryte eller stille et nytt spørsmål.')};
 u.onend=()=>{spoken=null;if(play)play.textContent='🔊 Les opp svaret';if(returnToVoice&&voiceOpen){phase('ready','Hva mer lurer du på?','Trykk «Snakk nå», eller svar i skrivefeltet.')}};
 u.onerror=()=>{spoken=null;if(play)play.textContent='🔊 Les opp svaret';if(returnToVoice&&voiceOpen){phase('ready','Svaret er klart','Denne enheten kunne ikke lese opp svaret. Du kan lese det i chatten.')}};
 try{window.speechSynthesis.speak(u);return true}catch{return false}
}
function fallback(reason){phase('unavailable','Snakk eller skriv videre',reason||'Direkte talegjenkjenning støttes ikke her. Skriv i feltet nedenfor, eller bruk mikrofonen på iPhone-tastaturet til å diktere.');again.textContent='⌨ Skriv i chatten';again.disabled=false;}
function sendFollowup(raw){
 const q=String(raw||'').trim();if(!q)return false;
 if(pending||conversation.isBusy?.()){phase('processing','Et øyeblikk …','Jeg gjør ferdig det forrige svaret.');return false}
 stopSpeaking();
 if(recognition){try{recognition.abort()}catch{}recognition=null}
 listening=false;transcript=q;text.textContent='Du spurte: '+q;followupInput.value='';
 pending=true;sendButton.disabled=true;again.disabled=true;
 phase('processing','Tenker på spørsmålet …','Du kan følge samtalen her.');
 try{conversation.send(q)}catch{pending=false;sendButton.disabled=false;again.disabled=false;phase('error','Spørsmålet ble ikke sendt','Prøv igjen.');return false}
 return true;
}
function start(){
 if(!Speech){fallback();return}
 cancelled=false;muted=false;updateMute();stopSpeaking();if(recognition){try{recognition.abort()}catch{}recognition=null}
 transcript='';text.textContent='';listening=false;
 try{const r=new Speech();recognition=r;r.lang='nb-NO';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
  r.onstart=()=>{if(cancelled||!voiceOpen)return;listening=true;phase('listening','Jeg lytter …','Snakk naturlig. Du ser ordene mens du snakker.');again.textContent='Stopp opptak'};
  r.onresult=e=>{if(cancelled||!voiceOpen||recognition!==r)return;let draft='',finalText='';for(let i=0;i<e.results.length;i++){const part=e.results[i][0].transcript;draft+=part+' ';if(e.results[i].isFinal)finalText+=part+' '}transcript=finalText.trim();text.textContent=draft.trim()};
  r.onerror=e=>{if(cancelled||!voiceOpen||muted)return;listening=false;if(e.error==='aborted')return;fallback(e.error==='not-allowed'?'Mikrofonen er ikke tillatt. Bruk tastaturmikrofonen, eller gi nettstedet mikrofontilgang i Safari.':'Direkte tale fungerer ikke i denne nettleseren. Bruk diktering via iPhone-tastaturet.');};
  r.onend=()=>{if(cancelled||!voiceOpen||recognition!==r)return;listening=false;recognition=null;if(muted){phase('muted','Mikrofonen er av','Trykk «Slå på mikrofon» for å fortsette.');return}again.textContent='🎙 Snakk nå';const q=(transcript||text.textContent).trim();if(q&&!pending){sendFollowup(q)}else if(!q&&!['error','unavailable'].includes(modal.dataset.phase)){phase('ready','Jeg hørte ikke spørsmålet','Trykk «Snakk nå» og prøv igjen.')}}
  phase('starting','Klargjør mikrofon …','Gi tillatelse dersom nettleseren spør.');
  r.start();
 }catch(e){phase('error','Mikrofonen kunne ikke startes','Bruk skrivefeltet i stedet, eller kontroller tillatelsene.');again.textContent='🎙 Prøv igjen'}
}
function open(){
 voiceOpen=true;cancelled=false;pending=false;muted=false;updateMute();modal.hidden=false;panel.classList.add('ln-voice-mode');
 thread.replaceChildren();for(const t of (conversation.turns?.()||[]).slice(-3))addExchange(t.q,t.a);
 play.hidden=true;latestVoiceAnswer='';followupInput.value='';sendButton.disabled=false;again.disabled=false;
 again.textContent=Speech?'Stopp opptak':'⌨ Skriv i chatten';start();
}
tools.querySelector('#ln-voice-start')?.addEventListener('click',open);
tools.querySelector('#ln-voice-read')?.addEventListener('click',()=>{const answer=conversation.latestAnswer();if(!answer){const btn=tools.querySelector('#ln-voice-read');btn.title='Still et spørsmål før du bruker opplesning';return}if(window.speechSynthesis.speaking){stopSpeaking();return}read(answer,false)});
modal.querySelector('#ln-voice-close').addEventListener('click',close);
modal.querySelector('#ln-voice-done').addEventListener('click',close);
followupForm.addEventListener('submit',e=>{e.preventDefault();sendFollowup(followupInput.value)});
muteButton.addEventListener('click',()=>{if(muted){muted=false;updateMute();if(!pending&&voiceOpen)start();return}muted=true;updateMute();if(recognition){try{recognition.abort()}catch{}recognition=null}listening=false;phase('muted','Mikrofonen er av','Trykk «Slå på mikrofon» for å fortsette.');again.textContent='🎙 Snakk nå'});
again.addEventListener('click',()=>{if(muted){muted=false;updateMute()}if(!Speech||modal.dataset.phase==='unavailable'){followupInput.focus({preventScroll:true});return}if(listening){try{recognition?.stop()}catch{}return}if(pending)return;start()});
keyboard.addEventListener('click',()=>{close();form.querySelector('input')?.focus({preventScroll:true})});
play.addEventListener('click',()=>{if(spoken){stopSpeaking();return}if(latestVoiceAnswer)read(latestVoiceAnswer,true)});
document.addEventListener('ln-assistant-turn',e=>{
 if(readButton)readButton.disabled=false;
 if(!voiceOpen||!pending)return;
 pending=false;sendButton.disabled=false;again.disabled=false;
 const answer=String(e.detail?.answer||'');
 const q=String(e.detail?.question||transcript||'');
 latestVoiceAnswer=answer;addExchange(q,answer);text.textContent='Du spurte: '+q;
 again.textContent='🎙 Snakk igjen';play.hidden=!hasAudio;
 if(modal.querySelector('#ln-voice-speak-toggle').checked&&hasAudio){
  if(!read(answer,true))phase('ready','Hva mer lurer du på?','Skriv et svar, eller trykk «Snakk igjen».');
 }else phase('ready','Hva mer lurer du på?','Skriv et svar, eller trykk «Snakk igjen».');
});
document.addEventListener('ln-assistant-reset',()=>{stopSpeaking();thread.replaceChildren();if(readButton)readButton.disabled=true});
document.getElementById('ln-assistant-close')?.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&voiceOpen){e.stopPropagation();close()}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&voiceOpen)close()});
})();