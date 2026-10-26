'use strict';
// Optional opt-in speech-to-text: audio is sent to Google only when a user activates natural AI conversation.
const quota=new Map();
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Kun POST'});
 const key=process.env.GEMINI_API_KEY;
 if(!key)return res.status(503).json({ok:false,error:'AI-tale er ikke konfigurert.'});
 const origin=req.headers?.origin;
 if(origin&&!['https://lanesjekk-norge.onrender.com','https://lanesjekk.no','https://www.lanesjekk.no'].includes(origin))
  return res.status(403).json({ok:false,error:'Ugyldig opprinnelse'});
 let raw='',size=0;
 try{for await(const chunk of req.stream){size+=chunk.length;if(size>2350000)throw Error('large');raw+=chunk}}catch{return res.status(413).json({ok:false,error:'Opptaket er for stort.'})}
 let data;try{data=JSON.parse(raw)}catch{return res.status(400).json({ok:false,error:'Ugyldig opptak'})}
 const mime=String(data.mimeType||'').toLowerCase();
 if(!['audio/mp4','audio/webm','audio/m4a','audio/ogg','audio/wav'].includes(mime)
  ||typeof data.audioBase64!=='string'||data.audioBase64.length<1400
  ||data.audioBase64.length>2270000||!/^[a-z0-9+/]+=*$/i.test(data.audioBase64))
  return res.status(400).json({ok:false,error:'Ugyldig lydformat'});
 const bytes=Buffer.from(data.audioBase64,'base64');
 if(bytes.length<1024||bytes.length>1700000)return res.status(413).json({ok:false,error:'Opptaket er for stort eller tomt'});
 const now=Date.now(),ip=String(req.headers?.['x-forwarded-for']||'anonymous').split(',')[0].slice(0,80);
 for(const [id,entry] of quota)if(entry.until<now)quota.delete(id);
 const count=quota.get(ip)||{n:0,until:now+3600000};
 if(++count.n>30)return res.status(429).json({ok:false,error:'For mange taleforespørsler. Prøv igjen senere.'});
 quota.set(ip,count);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),16000);
 try{
  const reply=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',{
   method:'POST',signal:controller.signal,
   headers:{'x-goog-api-key':key,'Content-Type':'application/json'},
   body:JSON.stringify({
    contents:[{role:'user',parts:[
     {text:'Transkriber tale i dette opptaket nøyaktig. Språket er vanligvis norsk bokmål. Svar bare med ordene som ble sagt, uten forklaringer. Hvis det ikke er tydelig tale, svar med en tom streng.'},
     {inlineData:{mimeType:mime,data:data.audioBase64}}
    ]}],
    generationConfig:{temperature:0,maxOutputTokens:280}
   })
  });
  if(!reply.ok)return res.status(reply.status===429?429:502).json({ok:false,error:'Talegjenkjenning kunne ikke gjennomføres.'});
  const result=await reply.json();
  const text=result.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('')||'';
  const transcript=String(text).trim().replace(/^["'«]\s*|\s*["'»]$/g,'').slice(0,700);
  if(!transcript)return res.status(422).json({ok:false,error:'Ingen tydelig tale funnet.'});
  return res.status(200).json({ok:true,transcript});
 }catch{return res.status(503).json({ok:false,error:'AI-tale kunne ikke gjennomføres akkurat nå.'})}
 finally{clearTimeout(timer)}
};
