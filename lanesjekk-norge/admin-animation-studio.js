/* Animation Studio admin media library. Uses authenticated browser client and RLS.
   No service role key; uploaded media are staged until global "Publiser permanent". */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const SLOT_NAMES={home:'Forsiden / kampanje',loans:'Boliglån',budget:'Budsjett',
 receipts:'Kvitteringsstudio',valuation:'Boligverdi',rental:'Utleieanalyse',
 savings:'Sparing',investing:'Fond og aksjer',carloan:'Billån',academy:'Læringsplattform',currency:'Valutakompass'};
const VIDEO=['video/mp4','video/webm'],POSTER=['image/jpeg','image/png','image/webp'];
const MAX_VIDEO=40*1024*1024,MAX_POSTER=4*1024*1024;
let db,source,notify,bucket,active='home',objects=[],previewUrl='',posterPreviewUrl='';
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
 if(posterPreviewUrl){URL.revokeObjectURL(posterPreviewUrl);posterPreviewUrl=''}
 const video=local?(previewUrl=URL.createObjectURL(local)):item.videoUrl;
 const poster=localPoster?(posterPreviewUrl=URL.createObjectURL(localPoster)):item.posterUrl;
 player.pause();player.removeAttribute('src');player.removeAttribute('poster');
 if(video){
  player.src=video;
  if(poster)player.poster=poster;
  player.hidden=false;fallback.hidden=true;player.load();
 }else{player.hidden=true;fallback.hidden=false}
 image.hidden=!poster;
 if(poster)image.src=poster;
 player.style.objectFit=item.fit==='contain'?'contain':'cover';player.loop=item.loop!==false;
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
function changeSlot(id){if(!Object.hasOwn(SLOT_NAMES,id))return;active=id;render();window.dispatchEvent(new CustomEvent('lanesjekk-studio-media-target',{detail:{module:id}}));text('Redigerer '+SLOT_NAMES[id]+'. Endringer vises offentlig først etter publisering.')}
async function uploadFile(file,folder){
 const ext=file.type==='video/mp4'?'mp4':file.type==='video/webm'?'webm':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=folder+'/media-'+crypto.randomUUID()+'.'+ext;
 const progress=$('media-progress');
 if(file.size>6*1024*1024){
  if(!window.tus?.Upload)throw Error('Store videoer krever TUS-biblioteket. Tillat biblioteker fra cdn.jsdelivr.net og prøv på nytt.');
  const {data:{session},error:sessionError}=await db.auth.getSession();
  if(sessionError||!session?.access_token)throw Error('Økten har utløpt. Logg inn igjen før du laster opp.');
  await new Promise((resolve,reject)=>{
   const upload=new window.tus.Upload(file,{
    endpoint:'https://pryrgwfjniggjlrizenh.storage.supabase.co/storage/v1/upload/resumable',
    retryDelays:[0,3000,5000,10000,20000],chunkSize:6*1024*1024,
    headers:{authorization:'Bearer '+session.access_token,apikey:'sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9'},
    uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,
    metadata:{bucketName:bucket,objectName:path,contentType:file.type,cacheControl:'3600'},
    onError:error=>reject(Error(error?.message||'Videoopplasting ble avbrutt.')),
    onProgress:(done,total)=>{
     const percent=Math.min(100,Math.round(done/total*100));
     progress.hidden=false;progress.value=percent;
     text('Laster opp «'+file.name+'» · '+percent+' %. Ikke lukk fanen.');
    },
    onSuccess:resolve
   });
   upload.start();
  });
 }else{
  const {error}=await db.storage.from(bucket).upload(path,file,{upsert:false,cacheControl:'3600',contentType:file.type});
  if(error)throw Error(error.message||'Supabase avviste opplastingen.');
 }
 return mediaUrl(path)
}
async function uploadSelection(){
 const video=$('media-video').files?.[0],poster=$('media-poster').files?.[0],btn=$('media-upload'),target=active;
 $('media-progress').value=0;$('media-progress').hidden=true;
 if(!video&&!poster){text('Velg en video eller et forsidebilde først.',true);return}
 try{
  verifyFile(video,VIDEO,MAX_VIDEO,'Video må være MP4 eller WebM, maks 40 MB.');
  verifyFile(poster,POSTER,MAX_POSTER,'Forsidebilde må være PNG/JPEG/WebP, maks 4 MB.');
  btn.disabled=true;text('Laster opp filer til sikkert mediearkiv … Ikke lukk fanen.');
  const uploadedVideo=video?await uploadFile(video,'video'):null;
  const uploadedPoster=poster?await uploadFile(poster,'poster'):null;
  const item=source()?.slots?.[target];
  if(!item)throw Error('Valgt videomodul finnes ikke lenger.');
  if(uploadedVideo)item.videoUrl=uploadedVideo;
  if(uploadedPoster)item.posterUrl=uploadedPoster;
  $('media-video').value='';$('media-poster').value='';
  render();
  text('Opplastet til '+SLOT_NAMES[target]+' og lagt i utkastet. Se hele nettsiden før du publiserer.');
  await refreshLibrary();
 }catch(e){text('Opplasting feilet: '+(e.message||e),true)}
 finally{btn.disabled=false;$('media-progress').hidden=true}
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
   if(!fields())return;
   fields()[key]=$(id)[type];
   if(id==='media-enabled'){
    const current=[...$('media-module-grid').querySelectorAll('button')].find(el=>el.dataset.active==='true');
    if(current){const info=current.querySelector('small');if(info)info.textContent=fields().videoUrl?(fields().enabled?'Video klar':'Deaktivert'):'Standardanimasjon'}
   }
   if(id==='media-fit')$('media-preview').style.objectFit=fields().fit;
   if(id==='media-loop')$('media-preview').loop=fields().loop;
  })
 }
 for(const id of ['media-video','media-poster'])$(id).addEventListener('change',()=>{
  const file=$(id).files?.[0];
  if(file){
   const max=id==='media-video'?MAX_VIDEO:MAX_POSTER;
   const types=id==='media-video'?VIDEO:POSTER;
   if(!types.includes(file.type)||file.size>max||file.size===0){
    $(id).value='';text('Ugyldig fil. Kontroller format og størrelse før opplasting.',true);
   }else text('«'+file.name+'» ('+(file.size/1024/1024).toFixed(1)+' MB) er valgt for '+SLOT_NAMES[active]+' i utkastet.');
  }
  drawPreview();
 });
 $('media-preview').addEventListener('error',()=>{
  if(!$('media-preview').hidden)text('Videoen kan ikke spilles av. Bruk MP4 med H.264 eller WebM med VP8/VP9.',true);
 });
 $('media-upload').addEventListener('click',uploadSelection);
 $('media-reset').addEventListener('click',()=>{if(!fields())return;fields().videoUrl='';fields().posterUrl='';render();text('Videoen er fjernet fra utkastet. Standardanimasjonen brukes etter publisering.')});
 $('media-refresh').addEventListener('click',refreshLibrary);
}
function useGeneratedVideo(module,url){
 if(!Object.hasOwn(SLOT_NAMES,module))throw Error('Ukjent modul.');
 if(typeof url!=='string'||!/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/animation-assets\/video\/[a-z0-9_-]+\.mp4$/i.test(url))throw Error('Ugyldig medieadresse.');
 if(!source()?.slots?.[module])throw Error('Last inn Studio før du velger en video.');
 source().slots[module].videoUrl=url;
 source().slots[module].enabled=true;
 active=module;render();
 text('AI-video er lagt inn som utkast på «'+SLOT_NAMES[module]+'». Forhåndsvis og publiser når du er fornøyd.');
 return true;
}
window.lanesjekkAnimationStudio={init,render,refreshLibrary,useGeneratedVideo,changeSlot,slotNames:SLOT_NAMES};
})();
