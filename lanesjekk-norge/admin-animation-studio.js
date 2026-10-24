/* Animation Studio admin media library. Uses authenticated browser client and RLS.
   No service role key; uploaded media are staged until global "Publiser permanent". */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const SLOT_NAMES={home:'Forsiden / kampanje',loans:'Boliglån',budget:'Budsjett',
 receipts:'Kvitteringsstudio',valuation:'Boligverdi',rental:'Utleieanalyse',
 savings:'Sparing',investing:'Fond og aksjer',carloan:'Billån',academy:'Læringsplattform'};
const VIDEO=['video/mp4','video/webm'],POSTER=['image/jpeg','image/png','image/webp'];
const MAX_VIDEO=40*1024*1024,MAX_POSTER=4*1024*1024;
let db,source,notify,bucket,active='home',objects=[],previewUrl='';
function fields(){return source()?.slots?.[active]}
function text(message,error=false){$('media-status').textContent=message;$('media-status').dataset.error=error?'true':'false';if(error)notify(message,true)}
function mediaUrl(path){return db.storage.from(bucket).getPublicUrl(path).data.publicUrl}
function verifyFile(file,types,limit,description){
 if(!file)return;
 if(!types.includes(file.type)||file.size>limit||file.size===0)throw Error(description);
}
function drawPreview(){
 const item=fields();if(!item)return;
 const player=$('media-preview'),image=$('media-preview-poster'),fallback=$('media-preview-empty');
 const local=$('media-video').files?.[0];
 const localPoster=$('media-poster').files?.[0];
 if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=''}
 const video=local?(previewUrl=URL.createObjectURL(local)):item.videoUrl;
 const poster=localPoster?URL.createObjectURL(localPoster):item.posterUrl;
 player.pause();player.removeAttribute('src');player.removeAttribute('poster');
 if(video){
  player.src=video;
  if(poster)player.poster=poster;
  player.hidden=false;fallback.hidden=true;player.load();
 }else{player.hidden=true;fallback.hidden=false}
 image.hidden=!poster;
 if(poster)image.src=poster;
 if(localPoster)image.onload=()=>URL.revokeObjectURL(poster);
}
function render(){
 const item=fields();if(!item)return;
 $('media-target').value=active;
 $('media-enabled').checked=item.enabled!==false;
 $('media-loop').checked=item.loop!==false;
 $('media-fit').value=item.fit||'cover';
 $('media-title').value=item.title||'';
 $('media-description').value=item.description||'';
 $('media-video').value='';$('media-poster').value='';
 const grid=$('media-module-grid');grid.replaceChildren();
 for(const [id,name] of Object.entries(SLOT_NAMES)){
  const m=source().slots[id];
  const button=document.createElement('button');button.type='button';button.className='media-module-choice';
  button.dataset.active=String(id===active);
  const icon=document.createElement('span');icon.className='media-module-dot';icon.textContent=m.videoUrl?'▶':'◌';
  const title=document.createElement('strong');title.textContent=name;
  const info=document.createElement('small');info.textContent=m.videoUrl?(m.enabled?'Video klar':'Deaktivert'):'Standardanimasjon';
  button.append(icon,title,info);
  button.addEventListener('click',()=>changeSlot(id));grid.append(button)
 }
 $('media-selected-name').textContent=SLOT_NAMES[active];
 $('media-file-status').textContent=item.videoUrl?'Video valgt · '+item.videoUrl.split('/').at(-1):'Ingen video valgt. Eksisterende animasjon beholdes.';
 drawPreview()
}
function changeSlot(id){if(!Object.hasOwn(SLOT_NAMES,id))return;active=id;render();text('Redigerer '+SLOT_NAMES[id]+'. Endringer vises offentlig først etter publisering.')}
async function uploadFile(file,folder){
 const ext=file.type==='video/mp4'?'mp4':file.type==='video/webm'?'webm':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=folder+'/media-'+crypto.randomUUID()+'.'+ext;
 const {error}=await db.storage.from(bucket).upload(path,file,{upsert:false,cacheControl:'3600',contentType:file.type});
 if(error)throw Error(error.message||'Supabase avviste opplastingen.');
 return mediaUrl(path)
}
async function uploadSelection(){
 const video=$('media-video').files?.[0],poster=$('media-poster').files?.[0],btn=$('media-upload');
 if(!video&&!poster){text('Velg en video eller et forsidebilde først.',true);return}
 try{
  verifyFile(video,VIDEO,MAX_VIDEO,'Video må være MP4 eller WebM, maks 40 MB.');
  verifyFile(poster,POSTER,MAX_POSTER,'Forsidebilde må være PNG/JPEG/WebP, maks 4 MB.');
  btn.disabled=true;text('Laster opp filer til sikkert mediearkiv … Ikke lukk fanen.');
  const uploadedVideo=video?await uploadFile(video,'video'):null;
  const uploadedPoster=poster?await uploadFile(poster,'poster'):null;
  const item=fields();
  if(uploadedVideo)item.videoUrl=uploadedVideo;
  if(uploadedPoster)item.posterUrl=uploadedPoster;
  $('media-video').value='';$('media-poster').value='';
  render();
  text('Ferdig opplastet! '+SLOT_NAMES[active]+' er oppdatert i utkastet. Trykk «Se midlertidig», deretter «Publiser permanent» for alle besøkende.');
  await refreshLibrary();
 }catch(e){text('Opplasting feilet: '+(e.message||e),true)}
 finally{btn.disabled=false}
}
async function refreshLibrary(){
 if(!db||!source())return;
 const root=$('media-library');root.replaceChildren();
 const status=document.createElement('p');status.className='admin-hint';status.textContent='Henter opplastede filer …';root.append(status);
 const lists=await Promise.all(['video','poster'].map(async folder=>{
  const {data,error}=await db.storage.from(bucket).list(folder,{limit:100,sortBy:{column:'created_at',order:'desc'}});
  return{folder,files:data||[],error}
 }));
 root.replaceChildren();
 if(lists.some(x=>x.error)){const p=document.createElement('p');p.className='admin-hint';p.textContent='Mediearkivet kunne ikke leses. Kontroller tilgangen til Supabase Storage.';root.append(p);return}
 let count=0;
 for(const {folder,files} of lists){
  for(const file of files){
   if(!file.name||file.name==='.emptyFolderPlaceholder')continue;
   const path=folder+'/'+file.name,link=mediaUrl(path),isVideo=folder==='video';
   const row=document.createElement('div');row.className='media-library-row';
   const icon=document.createElement('span');icon.className='media-library-icon';icon.textContent=isVideo?'▶':'▧';
   const main=document.createElement('span');main.className='media-library-name';
   const strong=document.createElement('strong');strong.textContent=isVideo?'Video':'Forsidebilde';
   const small=document.createElement('small');small.textContent=file.name+' · '+Math.round((file.metadata?.size||0)/1024)+' KB';
   main.append(strong,small);
   const button=document.createElement('button');button.type='button';button.textContent='Bruk';button.className='admin-secondary';
   button.addEventListener('click',()=>{const item=fields();if(isVideo)item.videoUrl=link;else item.posterUrl=link;render();text('Valgt fil er lagt til i '+SLOT_NAMES[active]+' (utkast). Publiser for å lagre.')});
   row.append(icon,main,button);root.append(row);count++;
  }
 }
 if(!count){const p=document.createElement('p');p.className='admin-hint';p.textContent='Mediebiblioteket er tomt. Last opp den første videoen.';root.append(p)}
}
function init(options){
 db=options.db;source=()=>options.getDraft()?.media;notify=options.notify;bucket=options.bucket;
 const select=$('media-target');select.replaceChildren();
 for(const [id,label] of Object.entries(SLOT_NAMES)){const option=document.createElement('option');option.value=id;option.textContent=label;select.append(option)}
 select.addEventListener('change',()=>changeSlot(select.value));
 for(const [id,key,type] of [['media-enabled','enabled','checked'],['media-loop','loop','checked'],['media-fit','fit','value'],['media-title','title','value'],['media-description','description','value']]){
  $(id).addEventListener(type==='checked'?'change':'input',()=>{
   if(!fields())return;fields()[key]=$(id)[type];if(id==='media-enabled')render()
  })
 }
 $('media-video').addEventListener('change',drawPreview);
 $('media-poster').addEventListener('change',drawPreview);
 $('media-upload').addEventListener('click',uploadSelection);
 $('media-reset').addEventListener('click',()=>{if(!fields())return;fields().videoUrl='';fields().posterUrl='';render();text('Videoen er fjernet fra utkastet. Standardanimasjonen brukes etter publisering.')});
 $('media-refresh').addEventListener('click',refreshLibrary);
}
window.lanesjekkAnimationStudio={init,render,refreshLibrary};
})();
