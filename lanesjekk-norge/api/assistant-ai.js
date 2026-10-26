'use strict';
let current=new Map();
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Kun POST'});
 const token=process.env.GEMINI_API_KEY;
 if(!token)return res.status(503).json({ok:false,error:'Generativ AI er ikke aktivert av administrator. Vanlig veiviser fungerer.'});
 const origin=req.headers?.origin;
 if(origin&&!['https://lanesjekk-norge.onrender.com','https://lanesjekk.no','https://www.lanesjekk.no'].includes(origin))return res.status(403).json({ok:false,error:'Ugyldig opprinnelse'});
 const ip=(req.headers?.['x-forwarded-for']||'anonymous').split(',')[0].trim().slice(0,70),now=Date.now();
 for(const [k,v] of current)if(v.until<now)current.delete(k);
 const usage=current.get(ip)||{n:0,until:now+3600000};
 if(++usage.n>12)return res.status(429).json({ok:false,error:'For mange AI-spørsmål fra denne forbindelsen. Prøv senere.'});current.set(ip,usage);
 let raw='',size=0;
 try{for await(const part of req.stream){size+=part.length;if(size>4500)throw Error('large');raw+=part} }catch{return res.status(413).json({ok:false,error:'Spørsmålet er for langt'})}
 let question;try{question=JSON.parse(raw).question}catch{}
 if(typeof question!=='string'||question.trim().length<2||question.length>1200)return res.status(400).json({ok:false,error:'Skriv et kort spørsmål.'});
 try{
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),14000);let response;
 try{response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',{method:'POST',headers:{'x-goog-api-key':token,'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:'Du er Lånesjekk Assistent for en norsk finansportal. Svar vennlig og konkret på norsk. Du kjenner bare spørsmålsteksten, ikke brukerens bank eller personlige kontoer. Du må aldri finne på gjeldende rente eller finanstilbud. Gi ingen personlig investeringsrådgivning. Brukeren kan finne budsjett under #budsjett og rapportdeling i budsjettverktøyet. Vær kortfattet.'}]},contents:[{role:'user',parts:[{text:question.trim()}]}],generationConfig:{temperature:0.3,maxOutputTokens:500}}),signal:controller.signal})}finally{clearTimeout(timer)}
 if(!response.ok)return res.status(response.status===429?429:502).json({ok:false,error:response.status===429?'AI-grensen er nådd. Prøv igjen senere.':'AI-tjenesten svarte ikke. Bruk veiviseren.'});
 const data=await response.json(),answer=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
 if(!answer)return res.status(502).json({ok:false,error:'AI ga ikke noe svar.'});
 return res.status(200).json({ok:true,answer:answer.slice(0,3200)});
 }catch{return res.status(503).json({ok:false,error:'AI er midlertidig utilgjengelig. Veiviseren fungerer fortsatt.'})}
};
