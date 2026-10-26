(()=>{'use strict';
const messages=document.getElementById('ln-assistant-messages'),chat=window.LNAssistantConversation;if(!messages||!chat)return;
function notice(bar,text){let el=bar.querySelector('.ln-chat-action-status');if(!el){el=document.createElement('span');el.className='ln-chat-action-status';el.setAttribute('role','status');bar.append(el)}el.textContent=text}
function attach(){for(const bubble of [...messages.querySelectorAll('.ln-chat-bubble.ln-chat-assistant')].slice(1)){
 if(bubble.dataset.actionsReady||bubble.classList.contains('ln-chat-processing'))continue;
 const p=bubble.querySelector('p');if(!p?.textContent.trim())continue;bubble.dataset.actionsReady='true';
 const bar=document.createElement('div');bar.className='ln-chat-answer-actions';bar.setAttribute('aria-label','Handlinger for dette svaret');
 function add(text,label,handler){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.addEventListener('click',()=>handler(b));bar.append(b);return b}
 add('Se detaljer','Få en grundigere forklaring',()=>{if(chat.isBusy())return notice(bar,'Assistenten jobber allerede.');chat.send('Forklar det forrige svaret grundigere, gjerne med et enkelt regneeksempel.')});
 add('Kopier','Kopier dette svaret',async()=>{try{await navigator.clipboard.writeText(p.textContent);notice(bar,'Svaret er kopiert.')}catch{notice(bar,'Kopiering ble blokkert. Marker og kopier teksten manuelt.')}});
 add('Del','Del dette svaret',async()=>{try{if(navigator.share){await navigator.share({title:'Lånesjekk Assistent',text:p.textContent});notice(bar,'Delingsmenyen ble lukket. Kontroller delingen i appen.')}else{await navigator.clipboard.writeText(p.textContent);notice(bar,'Deling er ikke tilgjengelig. Svaret er kopiert.')}}catch(e){if(e.name!=='AbortError')notice(bar,'Deling ble ikke gjennomført. Bruk Kopier.')}});
 let rating=0;const up=add('👍','Marker svaret som nyttig',()=>rate(rating===1?0:1)),down=add('👎','Marker svaret som lite nyttig',()=>rate(rating===-1?0:-1));
 function rate(value){rating=value;up.setAttribute('aria-pressed',String(rating===1));down.setAttribute('aria-pressed',String(rating===-1));notice(bar,rating?'Merket i denne samtalen. Ingen vurdering sendes til AI-leverandøren.':'Vurderingen er fjernet.')}
 up.setAttribute('aria-pressed','false');down.setAttribute('aria-pressed','false');bubble.append(bar);
}}
document.addEventListener('ln-assistant-turn',attach);document.addEventListener('ln-assistant-restored',attach);attach();
})();