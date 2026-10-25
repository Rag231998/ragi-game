'use strict';
// Studio-only HeyGen integration. HeyGen credentials never leave the Render backend.
// Video import uses the logged-in user's RLS permissions, never a service-role key.
const crypto=require('node:crypto');
const SUPABASE='https://pryrgwfjniggjlrizenh.supabase.co';
const PUBLIC_KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const MODEL='heygen-video-1',PROVIDER='https://api.heygen.com/v3/models/videos';
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
 try{const parsed=new URL(url);return parsed.protocol==='https:'&&
  (parsed.hostname==='resource2.heygen.ai'||parsed.hostname==='resource.heygen.ai'||
   parsed.hostname==='resource.heygen.com'||parsed.hostname==='resource2.heygen.com')&&!parsed.username&&!parsed.password}
 catch{return false}
};
async function statusOf(videoId,key){
 const {response,body}=await readApi(PROVIDER+'/'+encodeURIComponent(videoId),{headers:{'x-api-key':key}});
 if(!response.ok)throw Error(cleanMessage(body.message||body.error||'HeyGen-status kunne ikke hentes.'));
 const data=body.data&&typeof body.data==='object'?body.data:body;
 return {status:data.status||'pending',url:data.video_url||'',message:cleanMessage(data.failure_message||data.message||'')};
}
module.exports=async(req,res)=>{
 const method=req.method||'GET',action=req.query?.action||'ready';
 if(method==='POST'){
  const origin=req.headers.origin;
  const host=req.headers.host;
  if(origin&&(!host||new URL(origin).host!==host))return fail(res,403,'Kryssdomeneforespørsler er ikke tillatt.');
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return fail(res,415,'Bruk JSON.');
 }
 if((action==='ready'||action==='status')&&method!=='GET')return fail(res,405,'Ugyldig metode.');
 if((action==='create'||action==='import')&&method!=='POST')return fail(res,405,'Ugyldig metode.');
 if(!['ready','create','status','import'].includes(action))return fail(res,404,'Ukjent handling.');
 try{
  const user=await authorized(req);
  if(!user)return fail(res,403,'Administratorinnlogging er nødvendig.');
  const key=process.env.HEYGEN_API_KEY;
  if(action==='ready')return res.status(200).json({ok:true,configured:Boolean(key),model:MODEL,maxDuration:15});
  if(!key)return fail(res,503,'Direkte generering er ikke aktivert. Legg HEYGEN_API_KEY i Render Environment.');
  if(action==='create'){
   const body=await readJson(req);
   if(!SLOTS.has(body.module)||![5,10,15].includes(body.duration)||!['professional','everyday','teacher'].includes(body.style)||
      typeof body.topic!=='string'||body.topic.trim().length<3||body.topic.length>95||
      typeof body.description!=='string'||body.description.trim().length<12||body.description.length>1100) return fail(res,400,'Velg modul, varighet, stil og en tydelig videobeskrivelse.');
   const now=Date.now(),last=rate.get(user.id)||0;
   if(now-last<60000)return fail(res,429,'En video er allerede startet. Kontroller statusen før du starter flere betalte genereringer.');
   rate.set(user.id,now);
   const payload={model:MODEL,mode:'text_to_video',prompt:promptFor(body),duration:body.duration,resolution:'768p',aspect_ratio:'16:9'};
   const {response,body:result}=await readApi(PROVIDER,{
    method:'POST',headers:{'x-api-key':key,'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},
    body:JSON.stringify(payload)
   });
   if(!response.ok){
    rate.delete(user.id);
    return fail(res,response.status===429?429:502,cleanMessage(result.message||result.error||'HeyGen avviste forespørselen.'));
   }
   const data=result.data||result;
   const id=data.id||data.video_id;
   if(!videoID(id))return fail(res,502,'HeyGen returnerte ikke en gyldig video-ID.');
   return res.status(202).json({ok:true,videoId:id,signature:signature(user.id,id,key),status:'pending',module:body.module});
  }
  const body=action==='import'?await readJson(req):req.query;
  const id=body.videoId,sign=body.signature;
  if(!videoID(id)||!isOwner(user.id,id,sign,key))return fail(res,403,'Videoen tilhører ikke denne Studio-økten.');
  const current=await statusOf(id,key);
  if(action==='status')return res.status(200).json({ok:true,status:current.status,videoUrl:current.status==='completed'&&safeSource(current.url)?current.url:null,message:current.message});
  if(current.status!=='completed'||!safeSource(current.url))return fail(res,409,'Videoen er ikke ferdig, eller HeyGen har ikke levert en gyldig fil.');
  // Only import from trusted HeyGen CDN. Redirects are disabled to prevent SSRF.
  const file=await fetch(current.url,{redirect:'error',signal:AbortSignal.timeout(45000)});
  if(!file.ok)return fail(res,502,'HeyGen-videofilen kunne ikke hentes.');
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
