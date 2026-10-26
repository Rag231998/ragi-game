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
 if(++usage.n>30)return res.status(429).json({ok:false,error:'For mange AI-spørsmål fra denne forbindelsen. Prøv senere.'});current.set(ip,usage);
 let raw='',size=0;
 try{for await(const part of req.stream){size+=part.length;if(size>12000)throw Error('large');raw+=part} }catch{return res.status(413).json({ok:false,error:'Spørsmålet er for langt'})}
 let question,history=[],page='';try{const data=JSON.parse(raw);question=data.question;if(Array.isArray(data.history))history=data.history.slice(-10).filter(x=>x&&['user','model'].includes(x.role)&&typeof x.text==='string'&&x.text.length<=800);if(typeof data.page==='string'&&/^#[a-z0-9-]{1,40}$/.test(data.page))page=data.page}catch{}
 if(typeof question!=='string'||question.trim().length<2||question.length>1200)return res.status(400).json({ok:false,error:'Skriv et kort spørsmål.'});
 try{
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),14000);let response;
 try{response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',{method:'POST',headers:{'x-goog-api-key':token,'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:"Du er Lånesjekk Assistent, en kunnskapsrik norsk samtalepartner som hjelper med privatøkonomi og mange andre vanlige spørsmål. Du skal aldri fungere som en regelstyrt FAQ: forstå meningen i brukerens fritekst, stavefeil, dialekt, synonymer, korte oppfølgingsspørsmål og temaskifter. Hvis brukeren spør om seksualitet, forhold, skole eller andre ufarlige tema, svar hjelpsomt og ikke tving samtalen tilbake til økonomi. Still bare ett konkret oppklarende spørsmål når informasjon mangler. Bruk samtalehistorikken og sidekontekst, ikke finn opp hva brukeren har fortalt. Gi presise tall kun når du har regnegrunnlag; ikke finn opp banktilbud, renter, skatteregler eller live data. For norske utlånsregler: gjeldsgrad normalt maks 5 x årsinntekt, nedbetalingslån normalt maks 90 % av verdi, betjeningsevne vurdert med det høyeste av 7 % rente eller +3 prosentpoeng (regjeringen.no utlånsforskriften). Banken vurderer alle forutsetninger, og regelunntak finnes. Gi allmenn informasjon, ikke endelig bankgodkjenning eller personlig investeringsråd. Ta først brukerens eget spørsmål på alvor. Svaret må være på forståelig norsk, gjerne 2-4 korte avsnitt, med relevante eksempler og naturlig oppfølgingsspørsmål. Svarformat er JSON med answer, suggestions (0–3 nye relevante oppfølgingsspørsmål), tool (en av #budsjett,#sjekk,#investering,#kvitteringer,#sparing,#utleieanalyse eller tom streng). Hvis tema ikke hører til portalen, la tool være tom. Vis bare verktøy når det er nyttig, ikke som standardsvar. Lånesjekk Norge har budsjett under #budsjett, boliglånskalkulator under #sjekk, investeringer under #investering, kvitteringer under #kvitteringer og utleieanalyse under #utleieanalyse. Du har ikke tilgang til brukerens nettbank eller lokale budsjett uten at de frivillig skriver beløpene. Aktiv side (kun navigasjonskontekst): "+page}]},contents:[...history.map(x=>({role:x.role,parts:[{text:x.text}]})),{role:'user',parts:[{text:question.trim()}]}],generationConfig:{temperature:0.48,maxOutputTokens:900,responseMimeType:'application/json',responseJsonSchema:{type:'object',properties:{answer:{type:'string'},suggestions:{type:'array',items:{type:'string'}},tool:{type:'string'}},required:['answer','suggestions','tool']}}}),signal:controller.signal})}finally{clearTimeout(timer)}
 if(!response.ok)return res.status(response.status===429?429:502).json({ok:false,error:response.status===429?'AI-grensen er nådd. Prøv igjen senere.':'AI-tjenesten svarte ikke. Bruk veiviseren.'});
 const data=await response.json(),rawAnswer=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
 if(!rawAnswer)return res.status(502).json({ok:false,error:'AI ga ikke noe svar.'});
 let parsed;try{parsed=JSON.parse(rawAnswer)}catch{parsed={answer:rawAnswer,suggestions:[],tool:''}}
 const answer=typeof parsed.answer==='string'?parsed.answer.trim().slice(0,3200):'';
 if(!answer)return res.status(502).json({ok:false,error:'AI-svaret mangler tekst.'});
 const suggestions=Array.isArray(parsed.suggestions)?parsed.suggestions.filter(v=>typeof v==='string'&&v.length<110).slice(0,3):[];
 const tool=['#budsjett','#sjekk','#investering','#kvitteringer','#sparing','#utleieanalyse'].includes(parsed.tool)?parsed.tool:null;
 return res.status(200).json({ok:true,answer,suggestions,tool});
 }catch{return res.status(503).json({ok:false,error:'AI er midlertidig utilgjengelig. Veiviseren fungerer fortsatt.'})}
};
