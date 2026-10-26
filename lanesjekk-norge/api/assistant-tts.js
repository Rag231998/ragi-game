'use strict';
// Opt-in neural Norwegian voice. Never expose a provider key or accept a browser-selected model.
const limits=new Map();
function wav(pcm){
 const h=Buffer.alloc(44);
 h.write('RIFF',0);h.writeUInt32LE(36+pcm.length,4);h.write('WAVE',8);h.write('fmt ',12);
 h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(24000,24);
 h.writeUInt32LE(48000,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);
 h.write('data',36);h.writeUInt32LE(pcm.length,40);
 return Buffer.concat([h,pcm]);
}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Kun POST'});
 const key=process.env.GEMINI_API_KEY;
 if(!key)return res.status(503).json({ok:false,error:'Naturlig AI-stemme er ikke konfigurert.'});
 const origin=req.headers?.origin;
 if(origin&&!['https://lanesjekk-norge.onrender.com','https://lanesjekk.no','https://www.lanesjekk.no'].includes(origin))
  return res.status(403).json({ok:false,error:'Ugyldig opprinnelse'});
 let size=0,raw='';
 try{for await(const chunk of req.stream){size+=chunk.length;if(size>2800)throw Error('large');raw+=chunk}}catch{return res.status(413).json({ok:false,error:'Teksten er for lang.'})}
 let text;
 try{text=JSON.parse(raw).text}catch{}
 if(typeof text!=='string'||text.trim().length<2||text.length>1250)return res.status(400).json({ok:false,error:'Ugyldig tekst'});
 const now=Date.now(),ip=String(req.headers?.['x-forwarded-for']||'anonymous').split(',')[0].slice(0,80);
 for(const [id,entry] of limits)if(entry.until<now)limits.delete(id);
 const entry=limits.get(ip)||{count:0,until:now+3600000};
 if(++entry.count>15)return res.status(429).json({ok:false,error:'Talegrensen er nådd for denne timen.'});
 limits.set(ip,entry);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),16000);
 try{
  const reply=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',{
   method:'POST',signal:controller.signal,
   headers:{'x-goog-api-key':key,'Content-Type':'application/json'},
   body:JSON.stringify({
    contents:[{parts:[{text:'Read the following text naturally in Norwegian Bokmål, with a calm, neutral, conversational voice. Do not add anything: '+text.trim()}]}],
    generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:'Schedar'}}}}
   })
  });
  if(!reply.ok)return res.status(reply.status===429?429:502).json({ok:false,error:'Stemmeleverandøren er ikke tilgjengelig.'});
  const data=await reply.json();
  const part=data.candidates?.[0]?.content?.parts?.find(x=>x.inlineData?.data);
  if(!part)return res.status(502).json({ok:false,error:'Ingen lyd ble levert.'});
  const pcm=Buffer.from(part.inlineData.data,'base64');
  if(!pcm.length||pcm.length>2500000||pcm.length%2!==0)return res.status(502).json({ok:false,error:'Ugyldig lydformat.'});
  const output=part.inlineData.mimeType?.toLowerCase().includes('wav')?pcm:wav(pcm);
  return res.status(200).json({ok:true,mimeType:'audio/wav',audioBase64:output.toString('base64')});
 }catch{return res.status(503).json({ok:false,error:'Naturlig stemme kunne ikke genereres.'})}
 finally{clearTimeout(timer)}
};
module.exports.wav=wav;
