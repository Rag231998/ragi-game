/* Protected AI video creation: creator never sees API credentials.
   Backend verifies Supabase admin and imports approved clips under the user's RLS. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const KEY='lanesjekk.studio.ai-video-job.v1';
let task=null,checking=false,importing=false,configured=false,interval=null;
const getAuth=()=>window.lanesjekkStudioVideoAuth?.();
const modules={
 home:['Forsiden / kampanje','En voksen bruker får bedre økonomisk oversikt med Lånesjekk Norge.'],
 loans:['Boliglån','En voksen boligkjøper sammenligner boliglån og blir tryggere på tallene.'],
 budget:['Budsjett','En voksen bruker oppdager månedlige kostnader og planlegger et enklere budsjett.'],
 receipts:['Kvitteringsstudio','En voksen handler dagligvarer, sorterer kvitteringer og forstår hva pengene går til.'],
 valuation:['Boligverdi','En voksen huseier undersøker et usikkert, veiledende boligestimat.'],
 rental:['Utleieanalyse','En voksen utleier undersøker forventet leie, utgifter og nettoinntekt.'],
 savings:['Sparing','En voksen person bygger en sparerutine og følger saldoen over tid.'],
 investing:['Fond og aksjer','En voksen person lærer om aksjefond, tidshorisont og risiko uten avkastningsløfter.'],
 carloan:['Billån','En voksen bilkjøper sammenligner egenkapital, rente og månedskostnad.'],
 academy:['Læringsplattform','En student lærer privatøkonomi med enkle forklaringer og regneeksempler.'],
 currency:['Valutakompass','En voksen reisende regner om valuta og kontrollerer kursdatoen.']
};
const ui={
 status:()=>$('studio-ai-connection'),button:()=>$('studio-ai-generate'),progress:()=>$('studio-ai-progress'),result:()=>$('studio-ai-result')
};
function report(text,kind='normal'){
 const el=ui.status();if(!el)return;
 el.textContent=text;el.dataset.state=kind;
}
function setProgress(title,note){
 ui.progress().hidden=!title;
 if(title){$('studio-ai-progress-title').textContent=title;$('studio-ai-progress-note').textContent=note||''}
}
function updateDestination(){
 const slot=$('media-target')?.value||'home';
 $('studio-ai-selected-module').textContent='Plassering: '+(modules[slot]?.[0]||'Forsiden');
 const topic=$('studio-ai-topic');
 if(topic&&!topic.dataset.edited)topic.value=(modules[slot]||modules.home)[0]+' – økonomiforklaring';
 const scene=$('studio-ai-scene');
 if(scene&&!scene.dataset.edited)scene.value=(modules[slot]||modules.home)[1]+' Naturlig norsk tale fra en fiktiv voksen person.';
}
async function request(action,data,method='GET'){
 const auth=await getAuth();
 if(!auth)throw Error('Du må logge inn som administrator først.');
 const url='/api/admin-video?action='+encodeURIComponent(action)+(method==='GET'&&data?'&'+new URLSearchParams(data):'');
 const response=await fetch(url,{method,headers:{Authorization:'Bearer '+auth,...(method==='POST'?{'Content-Type':'application/json'}:{})},
  ...(method==='POST'?{body:JSON.stringify(data)}:{}),cache:'no-store'});
 const body=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(body.error||'Videotjenesten svarte med '+response.status);
 return body;
}
function persist(){try{if(task)sessionStorage.setItem(KEY,JSON.stringify(task));else sessionStorage.removeItem(KEY)}catch{}}
function saved(){
 try{
  const value=JSON.parse(sessionStorage.getItem(KEY)||'null');
  if(value&&typeof value.id==='string'&&typeof value.signature==='string'&&Object.hasOwn(modules,value.module)&&value.id.length<200)return value;
 }catch{}
 return null;
}
function renderResult(url){
 const video=$('studio-ai-result-video');video.src=url;video.load();
 ui.result().hidden=false;setProgress('','');
 $('studio-ai-apply').disabled=false;
 $('studio-ai-apply').textContent='Bruk video i '+modules[task.module][0];
 report('Video generert. Se den med lyd før du velger å legge den i utkastet.','success');
}
async function refreshStatus(){
 if(!task||checking||importing)return;
 checking=true;
 try{
  const data=await request('status',{videoId:task.id,signature:task.signature});
  const state=String(data.status||'pending');
  if(state==='completed'){
   if(!data.videoUrl){
    const copy=await request('import',{videoId:task.id,signature:task.signature},'POST');
    if(!copy.videoUrl)throw Error('Ingen gyldig videofil ble hentet.');
    task.videoUrl=copy.videoUrl;task.imported=true;
   }else task.videoUrl=data.videoUrl;
   task.state='completed';persist();
   renderResult(task.videoUrl);
   stopMonitoring();
  }else if(state==='failed'||state==='cancelled'){
   setProgress('','');
   report('Gratis AI-video kunne ikke genereres: '+(data.message||state),'error');
   task=null;persist();stopMonitoring();ui.button().disabled=!configured;
  }else{
   setProgress('Gratis AI-modell produserer videoen …','Videostatus: '+(state==='processing'?'behandles':'venter')+'. Gratis kvoter og køer kan påvirke ventetiden.');
   report('Videooppdraget kjører. Plassering: '+modules[task.module][0]+'.','pending');
  }
 }catch(e){
  report('Kunne ikke kontrollere video: '+(e.message||String(e)), 'error');
  $('studio-ai-status-check').hidden=false;
 }finally{checking=false}
}
function stopMonitoring(){if(interval){clearInterval(interval);interval=null}}
function startMonitoring(){
 stopMonitoring();$('studio-ai-status-check').hidden=false;
 void refreshStatus();
 interval=setInterval(()=>{if(!document.hidden)void refreshStatus()},12000);
}
async function updateReady(){
 if(!getAuth)return;
 try{
  const result=await request('ready');
  configured=Boolean(result.configured);
  const durations=Array.isArray(result.durations)?result.durations:[5,10,15];
  const selector=$('studio-ai-duration');
  if(selector){
   for(const option of selector.options)option.disabled=!durations.includes(Number(option.value));
   if(configured&&!durations.includes(Number(selector.value)))selector.value=String(durations.includes(10)?10:durations[0]);
  }
  if(!configured){
   report(result.setup||'Den gratis videomodellen er ikke tilgjengelig akkurat nå. Det blir aldri valgt en betalt modell.','warning');
  }else if(!task)report('Gratis AI-video er klar til bruk. Ingen betalte modeller eller automatisk oppgradering.','success');
  ui.button().disabled=!configured||Boolean(task)||importing;
  if(task){ui.button().disabled=true;if(task.state==='completed'&&task.videoUrl)renderResult(task.videoUrl);else startMonitoring();}
 }catch(e){
  configured=false;ui.button().disabled=true;
  report('Logg inn som administrator for å aktivere videogenerering.','normal');
 }
}
async function createVideo(){
 if(!configured||task)return;
 const slot=$('media-target').value,
  topic=$('studio-ai-topic').value.trim(),description=$('studio-ai-scene').value.trim(),
  style=$('studio-ai-style').value,duration=Number($('studio-ai-duration').value);
 if(!Object.hasOwn(modules,slot)||topic.length<3||description.length<12){
  report('Velg en modul og skriv minst 12 tegn om scenen du vil generere.','error');return;
 }
 // Submit ONLY a price-verified zero-cost model; provider refuses any nonfree fallback.
 const button=ui.button();button.disabled=true;ui.result().hidden=true;
 try{
  setProgress('Sender video til gratis AI-modell …','Kostnad: 0 kr. Gratis kvoter og køtid kan gjelde. Ingen publisering uten godkjenning.');
  const result=await request('create',{module:slot,topic,description,style,duration},'POST');
  task={id:result.videoId,signature:result.signature,module:slot,state:'pending',costNok:0,createdAt:Date.now()};
  persist();$('studio-ai-status-check').hidden=false;
  startMonitoring();
 }catch(e){
  setProgress('','');
  report('Gratis videogenerering kunne ikke starte: '+(e.message||e),'error');
  button.disabled=!configured;
 }
}
async function applyVideo(){
 if(!task||!task.videoUrl||importing)return;
 importing=true;
 const button=$('studio-ai-apply');button.disabled=true;button.textContent='Lagrer i mediearkivet …';
 try{
  const result=task.imported?{videoUrl:task.videoUrl}:await request('import',{videoId:task.id,signature:task.signature},'POST');
  window.lanesjekkAnimationStudio.useGeneratedVideo(task.module,result.videoUrl);
  report('Videoen ligger nå som upublisert utkast under «'+modules[task.module][0]+'». Åpne full forhåndsvisning og publiser når du er fornøyd.','success');
  $('studio-ai-result-message').textContent='Videoen er importert i valgt modul som utkast. Den vises ikke offentlig før du publiserer.';
  task=null;persist();stopMonitoring();setProgress('','');
  ui.button().disabled=!configured;
  button.textContent='✓ Lagt til i utkastet';
 }catch(e){
  report('Videoen er ferdig, men kunne ikke lagres: '+(e.message||e),'error');
  button.disabled=false;button.textContent='Prøv å lagre videoen igjen';
 }finally{importing=false}
}
function init(){
 if(!$('studio-ai-generate'))return;
 $('media-target')?.addEventListener('change',updateDestination);
 window.addEventListener('lanesjekk-studio-media-target',updateDestination);
 $('studio-ai-topic').addEventListener('input',()=>{$('studio-ai-topic').dataset.edited='true'});
 $('studio-ai-scene').addEventListener('input',()=>{$('studio-ai-scene').dataset.edited='true'});
 $('studio-ai-generate').addEventListener('click',()=>{void createVideo()});
 $('studio-ai-status-check').addEventListener('click',()=>{void refreshStatus()});
 $('studio-ai-apply').addEventListener('click',()=>{void applyVideo()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&task&&task.state!=='completed')void refreshStatus()});
 window.addEventListener('lanesjekk-studio-ready',()=>{updateDestination();void updateReady()});
 window.addEventListener('focus',()=>{if(!configured)void updateReady()});
 task=saved();updateDestination();
 if(!task){setProgress('','')}else{setProgress('Gjenoppretter videooppdrag …','Videoprosessen fortsetter selv om du bytter mellom Studio-kategorier.')}
 void updateReady();
}
document.addEventListener('DOMContentLoaded',init);
})();