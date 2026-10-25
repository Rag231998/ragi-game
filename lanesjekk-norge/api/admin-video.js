'use strict';
// Strictly free Studio AI video generation. Never select a paid model.
// OpenRouter free models have limited availability; missing/free-quota failures do not trigger paid fallback.
// Video import uses the logged-in user's RLS permissions, never a service-role key.
const crypto=require('node:crypto');
const SUPABASE='https://pryrgwfjniggjlrizenh.supabase.co';
const PUBLIC_KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const PROVIDER='https://openrouter.ai/api/v1/videos';
const FREE_MODELS=Object.freeze(['bytedance/seedance-2.0-fast:free','bytedance/seedance-2.0:free','bytedance/seedance-1-5-pro:free']);
const MODEL=FREE_MODELS[0];
const FREE_COST=0;
const inventoryCache=new Map();
const SLOTS=new Set(['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy','currency']);
const rate=new Map();
const fail=(res,status,message)=>res.status(status).json({ok:false,error:message});
const bad=()=>Error('Ugyldig forespørsel.');
const readJson=async req=>{
 const parts=[];let size=0;
 for await(const part of req.stream||[]){
  size+=part.length;
  if(size>12000)throw bad();
  parts.push(part);
 }
 try{return JSON.parse(Buffer.concat(parts).toString('utf8'))}catch{throw bad()}
};
async function readApi(url,opts={}){
 const response=await fetch(url,{...opts,signal:AbortSignal.timeout(18000)});
 const body=await response.json().catch(()=>({}));
 return {response,body};
}
async function authorized(req){
 const token=(req.headers.authorization||'').match(/^Bearer ([a-zA-Z0-9._~-]+)$/)?.[1];
 if(!token||token.length>5000)return null;
 const headers={apikey:PUBLIC_KEY,authorization:'Bearer '+token};
 const me=await readApi(SUPABASE+'/auth/v1/user',{headers});
 const id=me.body?.id;
 if(!me.response.ok||!id||!/^[-0-9a-f]{36}$/i.test(id))return null;
 const r=await readApi(SUPABASE+'/rest/v1/admins?user_id=eq.'+encodeURIComponent(id)+'&select=user_id&limit=1',{headers:{...headers,Accept:'application/json'}});
 if(!r.response.ok||!Array.isArray(r.body)||r.body[0]?.user_id!==id)return null;
 return {id,token,headers};
}
const signature=(userId,videoId,key)=>crypto.createHmac('sha256',key).update(userId+'|'+videoId).digest('hex');
const isOwner=(id,videoId,sig,key)=>{
 if(typeof sig!=='string'||!/^[a-f0-9]{64}$/.test(sig))return false;
 const expected=signature(id,videoId,key);
 return crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(sig));
};
const cleanMessage=str=>typeof str==='string'?str.slice(0,230):'Videoleverandøren kunne ikke fullføre forespørselen.';
const videoID=id=>typeof id==='string'&&/^[\w-]{4,180}$/.test(id);
function promptFor({topic,description,style,duration}){
 const direction={
  professional:'Premium nordisk fintech-reklame; elegant miljø, mykt naturlig lys, rolig kameraføring, profesjonell voksen skuespiller.',
  everyday:'Troverdig nordisk hverdagsfilm fra kjøkken eller hjemmekontor med naturlige uttrykk og diskret kamerabevegelse.',
  teacher:'Pedagogisk forklaring fra en rolig voksen veileder; vis konseptet med enkle, lettfattelige visuelle grep.'
 }[style]||'Premium nordisk fintech-reklame';
 return [
  'Create a photorealistic, modern Norwegian financial education commercial of '+duration+' seconds, landscape 16:9.',
  'Use an original fictional adult human presenter with plausible natural movements and lifelike facial detail.',
  'Style: '+direction,
  'Topic: '+topic+'.',
  'Scenario: '+description,
  'Natural Norwegian Bokmål spoken narration, audible clean voice. Avoid unnatural hands, warped faces and garbled text.',
  'Do not show identifiable real people or imitate a bank brand. No logos, invented interface screenshots, fabricated savings amounts or investment promises.',
  'Voiceover call to action: Utforsk '+topic+' hos Lånesjekk Norge.',
  'No baked-in on-screen letters or numbers. The website may add captions afterwards.'
 ].join(' ');
}
const safeSource=url=>{
 try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&
    u.hostname!=='localhost'&&!u.hostname.endsWith('.localhost')&&!u.hostname.endsWith('.local')&&
    !/^(?:\d+\.){3}\d+$/.test(u.hostname)&&u.hostname.includes('.')&&u.port==='' }
 catch{return false}
};
const pricingIsFree=entry=>{
 if(!entry||!FREE_MODELS.includes(entry.id)||!entry.id.endsWith(':free'))return false;
 const skus=entry.pricing_skus;
 if(!skus||typeof skus!=='object'||!Object.keys(skus).length)return false;
 return Object.values(skus).every(v=>v!==null&&v!==undefined&&Number.isFinite(Number(v))&&Number(v)===FREE_COST);
};
async function availableModels(key){
 const cache=inventoryCache.get(key);
 if(cache&&Date.now()-cache.time<120000)return cache.models;
 const {response,body}=await readApi(PROVIDER+'/models',{headers:{Authorization:'Bearer '+key}});
 if(!response.ok)throw Error('Kunne ikke kontrollere at videomodellen er gratis. Ingen video blir bestilt.');
 const entries=Array.isArray(body.data)?body.data:[];
 const models=entries.filter(pricingIsFree);
 inventoryCache.set(key,{time:Date.now(),models});
 return models;
}
const preferredResolution=entry=>{
 const resolutions=entry.supported_resolutions;
 if(!Array.isArray(resolutions)||resolutions.includes('720p'))return '720p';
 return resolutions.includes('480p')?'480p':null;
};
const supportsFreeDuration=(entry,duration)=>
 (!Array.isArray(entry.supported_durations)||entry.supported_durations.includes(duration))&&
 (!Array.isArray(entry.supported_aspect_ratios)||entry.supported_aspect_ratios.includes('16:9'))&&
 Boolean(preferredResolution(entry));
async function freeModel(key,duration){
 const models=await availableModels(key);
 return models.find(entry=>supportsFreeDuration(entry,duration));
}
function responseError(message){
 if(typeof message==='string')return cleanMessage(message);
 if(message&&typeof message==='object')return cleanMessage(message.message||message.detail||JSON.stringify(message));
 return 'Leverandøren kunne ikke behandle forespørselen.';
}
async function statusOf(videoId,key){
 const {response,body}=await readApi(PROVIDER+'/'+encodeURIComponent(videoId),{headers:{Authorization:'Bearer '+key}});
 if(!response.ok)throw Error(responseError(body.error||body.message||'Videostatus kunne ikke hentes.'));
 const data=body.data&&typeof body.data==='object'?body.data:body;
 const status=data.status==='succeeded'?'completed':data.status||'pending';
 const url=Array.isArray(data.unsigned_urls)?data.unsigned_urls[0]:'';
 return {status,url:safeSource(url)?url:'',cost:data.usage?.cost,message:responseError(data.error||'')};
}
module.exports=async(req,res)=>{
 const method=req.method||'GET',action=req.query?.action||'ready';
 if(method==='POST'){
  const origin=req.headers.origin;
  const host=req.headers.host;
  if(origin){
   try{if(!host||new URL(origin).host!==host)return fail(res,403,'Kryssdomeneforespørsler er ikke tillatt.')}
   catch{return fail(res,403,'Ugyldig opprinnelse.')}
  }
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return fail(res,415,'Bruk JSON.');
 }
 if((action==='ready'||action==='status')&&method!=='GET')return fail(res,405,'Ugyldig metode.');
 if((action==='create'||action==='import')&&method!=='POST')return fail(res,405,'Ugyldig metode.');
 if(!['ready','create','status','import'].includes(action))return fail(res,404,'Ukjent handling.');
 try{
  const user=await authorized(req);
  if(!user)return fail(res,403,'Administratorinnlogging er nødvendig.');
  const key=process.env.OPENROUTER_API_KEY;
  if(action==='ready'){
   if(!key)return res.status(200).json({ok:true,configured:false,freeOnly:true,model:MODEL,
    setup:'Opprett en gratis OpenRouter API-nøkkel uten betalingskort og legg OPENROUTER_API_KEY i Render Environment.'});
   try{
    const models=await availableModels(key);
    const durations=[5,10,15].filter(duration=>models.some(model=>supportsFreeDuration(model,duration)));
    return res.status(200).json({ok:true,configured:durations.length>0,freeOnly:true,
     model:models.find(model=>durations.some(duration=>supportsFreeDuration(model,duration)))?.id||null,
     durations,maxDuration:15,
     setup:durations.length?null:'Ingen verifisert gratis videomodell er tilgjengelig akkurat nå. Ingen betalt modell blir brukt.'});
   }catch(e){
    return res.status(200).json({ok:true,configured:false,freeOnly:true,model:null,setup:e.message});
   }
  }
  if(!key)return fail(res,503,'AI-video krever en gratis OPENROUTER_API_KEY. Betalte modeller brukes aldri.');
  if(action==='create'){
   const body=await readJson(req);
   if(!SLOTS.has(body.module)||![5,10,15].includes(body.duration)||!['professional','everyday','teacher'].includes(body.style)||
      typeof body.topic!=='string'||body.topic.trim().length<3||body.topic.length>95||
      typeof body.description!=='string'||body.description.trim().length<12||body.description.length>1100) return fail(res,400,'Velg modul, varighet, stil og en tydelig videobeskrivelse.');
   const now=Date.now(),last=rate.get(user.id)||0;
   if(now-last<60000)return fail(res,429,'Det er allerede startet en videobestilling. Kontroller status før du prøver igjen.');
   const selected=await freeModel(key,body.duration);
   if(!selected)return fail(res,503,'Ingen bekreftet gratis videomodell støtter denne varigheten akkurat nå. Ingen kostnad påløper.');
   rate.set(user.id,now);
   const payload={model:selected.id,prompt:promptFor(body),duration:body.duration,resolution:preferredResolution(selected),aspect_ratio:'16:9',generate_audio:false};
   const {response,body:result}=await readApi(PROVIDER,{
    method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},
    body:JSON.stringify(payload)
   });
   if(!response.ok){
    rate.delete(user.id);
    return fail(res,response.status===429?429:502,responseError(result.message||result.error||'Gratis videotjeneste er utilgjengelig eller kvoten er brukt opp.'));
   }
   const data=result.data||result;
   const id=data.id||data.video_id;
   if(!videoID(id))return fail(res,502,'Leverandøren returnerte ikke en gyldig video-ID.');
   return res.status(202).json({ok:true,videoId:id,signature:signature(user.id,id,key),status:'pending',module:body.module,costNok:0,model:selected.id});
  }
  const body=action==='import'?await readJson(req):req.query;
  const id=body.videoId,sign=body.signature;
  if(!videoID(id)||!isOwner(user.id,id,sign,key))return fail(res,403,'Videoen tilhører ikke denne Studio-økten.');
  const current=await statusOf(id,key);
  if(action==='status')return res.status(200).json({ok:true,status:current.status,videoUrl:current.status==='completed'?current.url:null,message:current.message});
  if(current.status!=='completed')return fail(res,409,'Videoen er ikke ferdig.');
  // Import only from OpenRouter authenticated content endpoint; never fetch user-supplied URLs.
  const file=await fetch(PROVIDER+'/'+encodeURIComponent(id)+'/content',{
   headers:{Authorization:'Bearer '+key},redirect:'error',signal:AbortSignal.timeout(45000)
  });
  if(!file.ok)return fail(res,502,'Den gratis genererte videofilen kunne ikke hentes.');
  const length=Number(file.headers.get('content-length'))||0,MAX=40*1024*1024;
  if(length>MAX)return fail(res,413,'Filen overstiger 40 MB. Bruk kortere klipp eller lavere oppløsning.');
  let size=0;const chunks=[];
  for await(const part of file.body){
   size+=part.length;
   if(size>MAX){await file.body.cancel().catch(()=>{});return fail(res,413,'Filen overstiger 40 MB.')}
   chunks.push(Buffer.from(part));
  }
  if(size<1024)return fail(res,502,'Videofilen ser ufullstendig ut.');
  const name='video/ai-'+crypto.randomUUID()+'.mp4';
  const dest=SUPABASE+'/storage/v1/object/animation-assets/'+name;
  const stored=await fetch(dest,{method:'POST',headers:{
   authorization:'Bearer '+user.token,apikey:PUBLIC_KEY,
   'Content-Type':'video/mp4','x-upsert':'false'
  },body:Buffer.concat(chunks),signal:AbortSignal.timeout(45000)});
  const answer=await stored.json().catch(()=>({}));
  if(!stored.ok)return fail(res,502,'Kunne ikke lagre video i mediearkivet: '+cleanMessage(answer.message||answer.error));
  return res.status(200).json({ok:true,videoUrl:SUPABASE+'/storage/v1/object/public/animation-assets/'+name});
 }catch(e){
  const msg=e.message==='Ugyldig forespørsel.'?e.message:'Tjenesten kunne ikke fullføre: '+cleanMessage(e.message);
  return fail(res,e.message==='Ugyldig forespørsel.'?400:502,msg);
 }
};
module.exports.promptFor=promptFor;
module.exports.safeSource=safeSource;
module.exports.pricingIsFree=pricingIsFree;
module.exports.FREE_MODELS=FREE_MODELS;
