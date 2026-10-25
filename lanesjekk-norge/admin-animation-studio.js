/* Animation Studio admin media library. Uses authenticated browser client and RLS.
   No service role key; uploaded media are staged until global "Publiser permanent". */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const SLOT_NAMES={home:'Forsiden / kampanje',loans:'Boliglån',budget:'Budsjett',
 receipts:'Kvitteringsstudio',valuation:'Boligverdi',rental:'Utleieanalyse',
 savings:'Sparing',investing:'Fond og aksjer',carloan:'Billån',academy:'Læringsplattform',currency:'Valutakompass'};
const VIDEO=['video/mp4','video/webm'],POSTER=['image/jpeg','image/png','image/webp'];
const MAX_VIDEO=40*1024*1024,MAX_POSTER=4*1024*1024;
let db,source,notify,bucket,getPublished,active='home',previewUrl='',posterPreviewUrl='',uploading=false,libraryItems=[],libraryFilter='all',libraryQuery='';
function fields(){return source()?.slots?.[active]}
function dirty(){window.dispatchEvent(new Event('lanesjekk-studio-media-dirty'))}
function setDisabledUploads(value){
 uploading=value;
 for(const id of ['media-upload','media-target','media-video','media-poster','media-reset']){
  const node=$(id);if(node)node.disabled=value;
 }
 document.querySelectorAll('#media-module-grid button').forEach(node=>node.disabled=value);
}
function readableSize(bytes){return bytes>=1048576?(bytes/1048576).toFixed(1)+' MB':Math.max(1,Math.round(bytes/1024))+' KB'}
function text(message,error=false){
 const status=$('media-status');if(status){status.textContent=message;status.dataset.error=error?'true':'false'}
 if(error&&typeof notify==='function')notify(message,true);
}
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
 if($('media-staged-status')){
  $('media-staged-status').textContent=local?'Lokal fil · ikke lastet opp':
   item.videoUrl?'Valgt som utkast · publiseres først etter godkjenning':'Bruker standardanimasjon';
 }
}
function render(){
 const item=fields();if(!item)return;
 $('media-target').value=active;
 $('media-enabled').checked=item.enabled!==false;
 $('media-loop').checked=item.loop!==false;
 $('media-fit').value=item.fit||'cover';
 $('media-placement').value=item.placement||'after-intro';
 $('media-title').value=item.title||'';
 $('media-description').value=item.description||'';
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
 drawPreview();
 // Keep archive actions, selected-module labels and deletion protection in sync
 // as soon as a clip is staged, switched or removed from the draft.
 if(libraryItems.length)drawLibrary();
}
function changeSlot(id){
 if(uploading||!Object.hasOwn(SLOT_NAMES,id))return;
 if(( $('media-video').files?.length || $('media-poster').files?.length ) &&
  !window.confirm('Du har valgt filer som ennå ikke er lastet opp. Bytte modul og forkaste filvalget?')){
  $('media-target').value=active;return
 }
 $('media-video').value='';$('media-poster').value='';
 active=id;render();
 window.dispatchEvent(new CustomEvent('lanesjekk-studio-media-target',{detail:{module:id}}));
 text('Valgt modul: '+SLOT_NAMES[id]+'. Endringer lagres først ved publisering.')
}
async function uploadFile(file,folder){
 const ext=file.type==='video/mp4'?'mp4':file.type==='video/webm'?'webm':file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=folder+'/media-'+crypto.randomUUID()+'.'+ext;
 const progress=$('media-progress');
 progress.hidden=false;progress.removeAttribute('value');
 text('Sender '+file.name+' ('+readableSize(file.size)+') til mediearkivet …');
 const standard=async()=>{
  text('Lagrer '+file.name+' i mediearkivet …');
  const {error}=await db.storage.from(bucket).upload(path,file,{upsert:false,cacheControl:'3600',contentType:file.type});
  if(error)throw Error(error.message||'Supabase avviste opplastingen.');
  progress.value=100;
 };
 // TUS gives true progress for large videos. If the third-party library was blocked,
 // fall back to the official Storage SDK rather than making the entire uploader unusable.
 if(file.size>6*1024*1024&&window.tus?.Upload){
  const {data:{session},error:sessionError}=await db.auth.getSession();
  if(sessionError||!session?.access_token)throw Error('Økten har utløpt. Logg inn igjen før du laster opp.');
  let uploaded=0;
  const job=new window.tus.Upload(file,{
   endpoint:'https://pryrgwfjniggjlrizenh.storage.supabase.co/storage/v1/upload/resumable',
   retryDelays:[0,3000,5000,10000,20000],chunkSize:6*1024*1024,
   headers:{authorization:'Bearer '+session.access_token,apikey:'sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9'},
   uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,
   metadata:{bucketName:bucket,objectName:path,contentType:file.type,cacheControl:'3600'},
   onProgress:(done,total)=>{
    uploaded=done;
    progress.value=Math.min(100,Math.round(done/total*100));
    text('Laster opp '+file.name+' · '+progress.value+' %. Ikke lukk fanen.');
   }
  });
  try{
   await new Promise((resolve,reject)=>{job.options.onError=error=>reject(Error(error?.message||'Opplastingen ble avbrutt.'));job.options.onSuccess=resolve;job.start()});
  }catch(error){
   if(uploaded>0)throw error; // Do not create a second upload after partial transmission.
   text('Fortsetter opplasting gjennom Supabase Storage …');
   await standard();
  }
 }else await standard();
 return mediaUrl(path)
}
async function uploadSelection(){
 const video=$('media-video').files?.[0],poster=$('media-poster').files?.[0],btn=$('media-upload'),target=active;
 $('media-progress').value=0;$('media-progress').hidden=true;
 if(uploading)return;
 if(!video&&!poster){text('Velg en video eller et forsidebilde først.',true);return}
 try{
  verifyFile(video,VIDEO,MAX_VIDEO,'Video må være MP4 eller WebM, maks 40 MB.');
  verifyFile(poster,POSTER,MAX_POSTER,'Forsidebilde må være PNG/JPEG/WebP, maks 4 MB.');
  setDisabledUploads(true);text('Laster opp filer til mediearkiv … Ikke lukk fanen.');
  const uploadedVideo=video?await uploadFile(video,'video'):null;
  const uploadedPoster=poster?await uploadFile(poster,'poster'):null;
  const item=source()?.slots?.[target];
  if(!item)throw Error('Valgt videomodul finnes ikke lenger.');
  if(uploadedVideo)item.videoUrl=uploadedVideo;
  if(uploadedPoster)item.posterUrl=uploadedPoster;
  $('media-video').value='';$('media-poster').value='';
  render();dirty();
  text('Opplastet til '+SLOT_NAMES[target]+' og lagt i utkastet. Se hele nettsiden før du publiserer.');
  await refreshLibrary();
 }catch(e){text('Opplasting feilet: '+(e.message||e),true)}
 finally{setDisabledUploads(false);$('media-progress').hidden=true;if(libraryItems.length)drawLibrary()}
}
const loadState={video:0,poster:0};
let loadingLibrary=false,moreLibrary=false;
function usedInPublished(url){
 return Object.values(getPublished?.()?.media?.slots||{}).some(item=>item?.videoUrl===url||item?.posterUrl===url);
}
function usedInDraft(url){
 return Object.values(source()?.slots||{}).some(item=>item?.videoUrl===url||item?.posterUrl===url);
}
function libraryAlert(message){
 const el=$('media-library-status');if(el){el.textContent=message;el.dataset.error='false'}
}
function showLibraryPreview(url,isVideo){
 const dialog=$('media-library-dialog');
 const video=$('media-library-video'),image=$('media-library-image');
 if(!dialog||!video||!image)return;
 video.pause();video.removeAttribute('src');image.removeAttribute('src');
 video.hidden=!isVideo;image.hidden=isVideo;
 if(isVideo){video.src=url;video.load()}else image.src=url;
 if(!dialog.open)dialog.showModal();
}
function drawLibrary(){
 const root=$('media-library');if(!root)return;
 root.replaceChildren();
 const needle=libraryQuery.toLocaleLowerCase('nb-NO');
 const filtered=libraryItems.filter(item=>
  (libraryFilter==='all'||libraryFilter===item.folder)&&
  (!needle||item.name.toLocaleLowerCase('nb-NO').includes(needle)));
 $('media-library-count').textContent=filtered.length+' filer'+(libraryFilter==='all'?' totalt':' i valgt kategori');
 if(!filtered.length){
  const empty=document.createElement('p');empty.className='media-library-empty';
  empty.textContent=libraryItems.length?'Ingen filer samsvarer med søket.':
   'Videoarkivet er tomt. Velg en modul, og last opp en MP4/WebM-video eller et forsidebilde over. Filen vises her straks opplastingen er ferdig.';
  root.append(empty);
 }
 for(const item of filtered){
  const url=mediaUrl(item.folder+'/'+item.name),isVideo=item.folder==='video';
  const row=document.createElement('article');row.className='media-library-row';row.dataset.kind=item.folder;
  const thumb=document.createElement(isVideo?'video':'img');thumb.className='media-library-thumb';
  if(isVideo){thumb.muted=true;thumb.preload='none';thumb.playsInline=true;thumb.src=url}
  else{thumb.loading='lazy';thumb.src=url;thumb.alt='Forhåndsvisning av '+item.name}
  const main=document.createElement('div');main.className='media-library-name';
  const strong=document.createElement('strong');strong.textContent=item.name;
  const size=Number(item.metadata?.size)||0;
  const small=document.createElement('small');
  small.textContent=(isVideo?'Video':'Bilde')+(size?' · '+readableSize(size):'')+
    (usedInPublished(url)?' · Publisert':usedInDraft(url)?' · I utkast':'');
  main.append(strong,small);
  const actions=document.createElement('div');actions.className='media-library-actions';
  const preview=document.createElement('button');preview.type='button';preview.textContent='Se';preview.className='admin-secondary';
  preview.addEventListener('click',()=>showLibraryPreview(url,isVideo));
  const use=document.createElement('button');use.type='button';use.textContent='Bruk i '+SLOT_NAMES[active];use.className='admin-primary';
  use.addEventListener('click',()=>{
   if(uploading)return;
   const current=fields();if(!current){text('Velg en modul først.',true);return}
   if(isVideo){current.videoUrl=url;current.enabled=true}
   else current.posterUrl=url;
   render();dirty();
   text('«'+item.name+'» er valgt for '+SLOT_NAMES[active]+'. Dette er et utkast; kontroller forhåndsvisning og publiser når du er fornøyd.');
  });
  const remove=document.createElement('button');remove.type='button';remove.className='admin-secondary media-delete';
  remove.textContent='Slett';remove.disabled=usedInPublished(url)||usedInDraft(url)||uploading;
  remove.title=remove.disabled?'Filen er i bruk eller opplasting pågår. Fjern den fra alle moduler og publiser endringen før sletting.':'Slett denne ubrukte filen permanent fra arkivet';
  remove.addEventListener('click',async()=>{
   if(remove.disabled||usedInPublished(url)||usedInDraft(url))return;
   if(!window.confirm('Vil du slette «'+item.name+'» permanent fra arkivet? Dette kan ikke angres.'))return;
   remove.disabled=true;
   const {error}=await db.storage.from(bucket).remove([item.folder+'/'+item.name]);
   if(error){remove.disabled=false;text('Sletting feilet: '+error.message,true);return}
   libraryItems=libraryItems.filter(x=>!(x.folder===item.folder&&x.name===item.name));
   drawLibrary();libraryAlert('Filen «'+item.name+'» er slettet fra arkivet.');
  });
  actions.append(preview,use,remove);row.append(thumb,main,actions);root.append(row);
 }
 const loadMore=$('media-library-more');if(loadMore)loadMore.hidden=!moreLibrary;
}
async function refreshLibrary(more=false){
 if(!db||!source()||loadingLibrary)return;
 loadingLibrary=true;
 const button=$('media-refresh');if(button)button.disabled=true;
 libraryAlert('Henter filer fra mediearkivet …');
 if(!more){libraryItems=[];loadState.video=0;loadState.poster=0;moreLibrary=false}
 try{
  const results=await Promise.all(['video','poster'].map(async folder=>{
   if(more&&loadState[folder]===-1)return{folder,files:[],hasMore:false};
   const {data,error}=await db.storage.from(bucket).list(folder,{
    limit:100,offset:loadState[folder],sortBy:{column:'created_at',order:'desc'}
   });
   if(error)throw new Error('Supabase Storage: '+error.message+' ('+folder+')');
   const files=(data||[]).filter(item=>item.name&&item.name!=='.emptyFolderPlaceholder');
   return{folder,files,hasMore:(data||[]).length===100}
  }));
  for(const result of results){
   for(const item of result.files){
    if(!libraryItems.some(x=>x.folder===result.folder&&x.name===item.name))
     libraryItems.push({...item,folder:result.folder});
   }
   loadState[result.folder]=result.hasMore?loadState[result.folder]+100:-1;
  }
  moreLibrary=results.some(x=>x.hasMore);
  libraryAlert(libraryItems.length?'Mediearkivet er oppdatert. Velg «Se» eller «Bruk» ved en fil.':
   'Mediearkivet er klart, men inneholder ingen filer ennå.');
  drawLibrary();
 }catch(error){
  libraryAlert('Kunne ikke hente filer: '+(error.message||error));
  $('media-library').replaceChildren();
  const message=document.createElement('p');message.className='media-library-error';
  message.textContent='Mediearkivet kunne ikke lastes. Kontroller at du er innlogget, og prøv «Oppdater arkivet» igjen.';
  $('media-library').append(message);
  text('Mediearkivet kunne ikke leses: '+(error.message||error),true);
 }finally{loadingLibrary=false;if(button)button.disabled=false}
}
function init(options){
 db=options.db;source=()=>options.getDraft()?.media;getPublished=options.getPublished;notify=options.notify;bucket=options.bucket;
 const select=$('media-target');select.replaceChildren();
 for(const [id,label] of Object.entries(SLOT_NAMES)){const option=document.createElement('option');option.value=id;option.textContent=label;select.append(option)}
 select.addEventListener('change',()=>changeSlot(select.value));
 for(const [id,key,type] of [['media-enabled','enabled','checked'],['media-loop','loop','checked'],['media-fit','fit','value'],['media-placement','placement','value'],['media-title','title','value'],['media-description','description','value']]){
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
 $('media-reset').addEventListener('click',()=>{if(!fields())return;fields().videoUrl='';fields().posterUrl='';render();dirty();text('Videoen er fjernet fra utkastet. Standardanimasjonen brukes etter publisering.')});
 $('media-refresh').addEventListener('click',()=>{void refreshLibrary()});
 $('media-library-more')?.addEventListener('click',()=>{void refreshLibrary(true)});
 $('media-library-search')?.addEventListener('input',event=>{libraryQuery=event.target.value;drawLibrary()});
 $('media-library-filter')?.addEventListener('change',event=>{libraryFilter=event.target.value;drawLibrary()});
 $('media-library-close')?.addEventListener('click',()=>{
  const dialog=$('media-library-dialog');$('media-library-video')?.pause();dialog?.close();
 });
 $('media-library-dialog')?.addEventListener('close',()=>{
  const video=$('media-library-video');video.pause();video.removeAttribute('src');
 });
}
function useGeneratedVideo(module,url){
 if(!Object.hasOwn(SLOT_NAMES,module))throw Error('Ukjent modul.');
 if(typeof url!=='string'||!/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/animation-assets\/video\/[a-z0-9_-]+\.mp4$/i.test(url))throw Error('Ugyldig medieadresse.');
 if(!source()?.slots?.[module])throw Error('Last inn Studio før du velger en video.');
 source().slots[module].videoUrl=url;
 source().slots[module].enabled=true;
 active=module;render();dirty();
 text('AI-video er lagt inn som utkast på «'+SLOT_NAMES[module]+'». Forhåndsvis og publiser når du er fornøyd.');
 return true;
}
window.lanesjekkAnimationStudio={init,render,refreshLibrary,useGeneratedVideo,changeSlot,slotNames:SLOT_NAMES};
})();
