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
modal.innerHTML='<div class="ln-voice-shell"><div class="ln-voice-top"><span><span class="ln-voice-live"></span> TALEASSISTENT</span><button type="button" id="ln-voice-close" aria-label="Lukk talemodus">✕</button></div><div class="ln-voice-center"><div class="ln-voice-orb" aria-hidden="true"><span class="ln-voice-wave">●</span><i></i><i></i><i></i></div><h3 id="ln-voice-heading">Klar til å lytte</h3><p id="ln-voice-caption">Snakk naturlig, eller skriv nedenfor.</p><p id="ln-voice-transcript" aria-live="polite"></p><div id="ln-voice-thread" class="ln-voice-thread" role="log" aria-label="Siste meldinger i samtalen" aria-live="polite"></div></div><div class="ln-voice-bottom"><form id="ln-voice-followup-form" class="ln-voice-followup-form"><label class="sr-only" for="ln-voice-followup">Skriv et nytt spørsmål eller svar</label><input id="ln-voice-followup" type="text" maxlength="400" autocomplete="off" enterkeyhint="send" placeholder="Skriv svar eller et nytt spørsmål …"><button type="submit" id="ln-voice-send">Send</button></form><div class="ln-voice-buttons"><button type="button" id="ln-voice-again">🎙 Snakk nå</button><button type="button" id="ln-voice-mute" aria-pressed="false">🔇 Mikrofon av</button><button type="button" id="ln-voice-done">Ferdig</button></div><label class="ln-voice-auto-toggle"><input type="checkbox" id="ln-voice-autocontinue" checked> Lytt automatisk etter svaret</label><label id="ln-voice-natural-wrap" class="ln-voice-natural-wrap" hidden><input type="checkbox" id="ln-voice-natural"> Naturlig norsk AI-stemme <small>(sender svartekst til Google)</small></label><div class="ln-voice-preferences"><label class="ln-voice-speak-toggle"><input type="checkbox" id="ln-voice-speak-toggle" checked> Les opp svaret</label><button id="ln-voice-play" type="button" hidden>🔊 Hør svaret igjen</button><button id="ln-voice-keyboard" type="button">Åpne chatten</button></div><p class="ln-voice-privacy">Du kan alltid svare skriftlig. Nettleserens taletjeneste kan behandle det du sier.</p></div></div>';
panel.append(modal);
const heading=modal.querySelector('#ln-voice-heading'),caption=modal.querySelector('#ln-voice-caption'),text=modal.querySelector('#ln-voice-transcript'),again=modal.querySelector('#ln-voice-again');
const play=modal.querySelector('#ln-voice-play'),keyboard=modal.querySelector('#ln-voice-keyboard'),muteButton=modal.querySelector('#ln-voice-mute');let latestVoiceAnswer='';
const followupForm=modal.querySelector('#ln-voice-followup-form'),followupInput=modal.querySelector('#ln-voice-followup'),sendButton=modal.querySelector('#ln-voice-send'),thread=modal.querySelector('#ln-voice-thread');
const autoToggle=modal.querySelector('#ln-voice-autocontinue'),naturalWrap=modal.querySelector('#ln-voice-natural-wrap'),naturalToggle=modal.querySelector('#ln-voice-natural');
let cloudReady=false,cloudAudio=null,cloudObjectURL='',playbackSerial=0,relistenSerial=0;
fetch('/api/assistant-status',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(s=>{cloudReady=!!s?.voiceAvailable;naturalWrap.hidden=!cloudReady;naturalToggle.disabled=!cloudReady}).catch(()=>{cloudReady=false;naturalWrap.hidden=true;naturalToggle.disabled=true});

function addExchange(question,answer){
 const q=document.createElement('p');q.className='ln-voice-question';q.textContent=String(question||'');
 const a=document.createElement('p');a.className='ln-voice-answer';a.textContent=String(answer||'');
 thread.append(q,a);while(thread.children.length>8)thread.firstElementChild.remove();
 thread.scrollTop=thread.scrollHeight;
}
function phase(name,title,subtitle){modal.dataset.phase=name;heading.textContent=title;caption.textContent=subtitle}
function updateMute(){muteButton.setAttribute('aria-pressed',String(muted));muteButton.textContent=muted?'🎙 Slå på mikrofon':'🔇 Slå av mikrofon'}
function stopSpeaking(){
 playbackSerial++;relistenSerial++;
 try{window.speechSynthesis?.cancel()}catch{}
 try{if(cloudAudio){cloudAudio.pause();cloudAudio.onended=null;cloudAudio.onerror=null;cloudAudio.src=''}}catch{}
 cloudAudio=null;if(cloudObjectURL){URL.revokeObjectURL(cloudObjectURL);cloudObjectURL=''}
 spoken=null;if(play)play.textContent='🔊 Les opp svaret';
}
function resumeListening(){
 const current=++relistenSerial;
 if(!voiceOpen||cancelled||muted||pending||!autoToggle.checked)return;
 if(!Speech){phase('unavailable','Bruk iPhone-diktering','Skriv i feltet eller bruk mikrofonen på iPhone-tastaturet.');return}
 phase('starting','Lytter igjen snart …','Du kan stille neste spørsmål uten å lukke vinduet.');
 setTimeout(()=>{
  if(current!==relistenSerial||!voiceOpen||cancelled||pending||muted||!autoToggle.checked||document.hidden)return;
  start();
 },500);
}
function finishSpeaking(token){
 if(token!==playbackSerial||!voiceOpen)return;
 spoken=null;cloudAudio=null;if(cloudObjectURL){URL.revokeObjectURL(cloudObjectURL);cloudObjectURL=''}
 if(play)play.textContent='🔊 Les opp svaret';
 phase('ready','Hva mer lurer du på?','Du kan snakke videre eller bruke skrivefeltet.');
 resumeListening();
}
function deviceVoice(){
 const choices=window.speechSynthesis?.getVoices?.()||[];
 const norwegian=choices.filter(x=>/^(nb|no|nn)([-_]|$)/i.test(x.lang||''));
 norwegian.sort((a,b)=>Number(/premium|enhanced|natural|siri|neural/i.test(b.name))-Number(/premium|enhanced|natural|siri|neural/i.test(a.name)));
 return norwegian[0]||null;
}

function close(){cancelled=true;pending=false;muted=false;updateMute();voiceOpen=false;modal.hidden=true;panel.classList.remove('ln-voice-mode');try{recognition?.abort()}catch{}recognition=null;stopSpeaking();text.textContent='';followupInput.value='';sendButton.disabled=false;again.disabled=false;const trigger=tools.querySelector('#ln-voice-start');trigger?.focus({preventScroll:true})}
function read(textToSay,returnToVoice=false){
 if(!hasAudio&&!cloudReady)return false;
 const answer=String(textToSay||'').trim().slice(0,1250);if(!answer)return false;
 stopSpeaking();const token=playbackSerial;
 const native=()=>{
  if(!hasAudio||token!==playbackSerial)return false;
  const u=new SpeechSynthesisUtterance(answer);u.lang='nb-NO';u.rate=1;u.pitch=1;
  const preferred=deviceVoice();if(preferred)u.voice=preferred;
  spoken=u;
  u.onstart=()=>{if(token!==playbackSerial)return;if(play)play.textContent='■ Stopp opplesning';if(returnToVoice)phase('speaking','Jeg svarer …','Du kan avbryte opplesningen når som helst.')};
  u.onend=()=>{if(token===playbackSerial){if(returnToVoice)finishSpeaking(token);else{spoken=null;if(play)play.textContent='🔊 Les opp svaret'}}};
  u.onerror=()=>{if(token!==playbackSerial)return;if(returnToVoice)finishSpeaking(token);else{spoken=null;if(play)play.textContent='🔊 Les opp svaret'}};
  try{window.speechSynthesis.speak(u);return true}catch{return false}
 };
 if(cloudReady&&naturalToggle.checked){
  if(returnToVoice)phase('processing','Forbereder naturlig stemme …','Svaret blir lest opp med norsk AI-stemme.');
  (async()=>{
   try{
    const response=await fetch('/api/assistant-tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:answer})});
    const result=await response.json();
    if(!response.ok||!result.audioBase64||result.mimeType!=='audio/wav')throw Error('unavailable');
    if(token!==playbackSerial||(!voiceOpen&&returnToVoice))return;
    const raw=atob(result.audioBase64),buffer=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)buffer[i]=raw.charCodeAt(i);
    cloudObjectURL=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));
    const audio=new Audio(cloudObjectURL);cloudAudio=audio;
    audio.onplay=()=>{if(token===playbackSerial){if(play)play.textContent='■ Stopp opplesning';if(returnToVoice)phase('speaking','Jeg svarer …','Naturlig norsk AI-stemme spiller.')}};
    audio.onended=()=>{if(token===playbackSerial){if(returnToVoice)finishSpeaking(token);else stopSpeaking()}};
    audio.onerror=()=>{if(token===playbackSerial){if(!native()&&returnToVoice)finishSpeaking(token)}};
    await audio.play();
   }catch{
    if(token!==playbackSerial)return;
    if(returnToVoice)phase('ready','AI-stemmen kunne ikke spilles','Prøver opplesning på telefonen i stedet.');
    if(!native()&&returnToVoice)finishSpeaking(token);
   }
  })();
  return true;
 }
 return native();
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
 voiceOpen=true;cancelled=false;pending=false;muted=false;updateMute();relistenSerial++;modal.hidden=false;panel.classList.add('ln-voice-mode');
 thread.replaceChildren();for(const t of (conversation.turns?.()||[]).slice(-3))addExchange(t.q,t.a);
 play.hidden=true;latestVoiceAnswer='';followupInput.value='';sendButton.disabled=false;again.disabled=false;
 again.textContent=Speech?'Stopp opptak':'⌨ Skriv i chatten';start();
}
tools.querySelector('#ln-voice-start')?.addEventListener('click',open);
tools.querySelector('#ln-voice-read')?.addEventListener('click',()=>{const answer=conversation.latestAnswer();if(!answer){const btn=tools.querySelector('#ln-voice-read');btn.title='Still et spørsmål før du bruker opplesning';return}if(window.speechSynthesis.speaking){stopSpeaking();return}read(answer,false)});
modal.querySelector('#ln-voice-close').addEventListener('click',close);
modal.querySelector('#ln-voice-done').addEventListener('click',close);
followupForm.addEventListener('submit',e=>{e.preventDefault();sendFollowup(followupInput.value)});
autoToggle.addEventListener('change',()=>{if(!autoToggle.checked)relistenSerial++;else if(voiceOpen&&!listening&&!pending&&!spoken&&!cloudAudio)resumeListening()});
modal.querySelector('#ln-voice-speak-toggle').addEventListener('change',e=>{if(!e.target.checked){stopSpeaking();phase('ready','Skriv eller snakk videre','Automatisk opplesning er slått av.');resumeListening()}});
muteButton.addEventListener('click',()=>{if(muted){muted=false;updateMute();if(!pending&&voiceOpen)start();return}muted=true;updateMute();if(recognition){try{recognition.abort()}catch{}recognition=null}listening=false;phase('muted','Mikrofonen er av','Trykk «Slå på mikrofon» for å fortsette.');again.textContent='🎙 Snakk nå'});
again.addEventListener('click',()=>{if(muted){muted=false;updateMute()}if(!Speech||modal.dataset.phase==='unavailable'){followupInput.focus({preventScroll:true});return}if(listening){try{recognition?.stop()}catch{}return}if(pending)return;start()});
keyboard.addEventListener('click',()=>{close();form.querySelector('input')?.focus({preventScroll:true})});
play.addEventListener('click',()=>{if(spoken||cloudAudio){stopSpeaking();phase('ready','Opplesningen er stoppet','Trykk «Snakk igjen», eller skriv et spørsmål.');return}if(latestVoiceAnswer)read(latestVoiceAnswer,true)});
document.addEventListener('ln-assistant-turn',e=>{
 if(readButton)readButton.disabled=false;
 if(!voiceOpen||!pending)return;
 pending=false;sendButton.disabled=false;again.disabled=false;
 const answer=String(e.detail?.answer||'');
 const q=String(e.detail?.question||transcript||'');
 latestVoiceAnswer=answer;addExchange(q,answer);text.textContent='Du spurte: '+q;
 again.textContent='🎙 Snakk igjen';play.hidden=!hasAudio;
 if(modal.querySelector('#ln-voice-speak-toggle').checked&&(hasAudio||cloudReady)){
  if(!read(answer,true)){phase('ready','Hva mer lurer du på?','Du kan svare med stemmen eller skrive.');resumeListening()}
 }else{phase('ready','Hva mer lurer du på?','Du kan svare med stemmen eller skrive.');resumeListening()}
});
document.addEventListener('ln-assistant-reset',()=>{stopSpeaking();thread.replaceChildren();if(readButton)readButton.disabled=true});
document.getElementById('ln-assistant-close')?.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&voiceOpen){e.stopPropagation();close()}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&voiceOpen)close()});
})();