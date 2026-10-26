'use strict';
const buckets=new Map();
const json=(res,status,obj)=>res.status(status).json(obj);
function validEmail(v){return typeof v==='string'&&v.length<=254&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)}
function readBody(stream){return new Promise((resolve,reject)=>{let data='',size=0;stream.on('data',chunk=>{size+=chunk.length;if(size>1100000){reject(Error('too large'));stream.destroy();return}data+=chunk});stream.on('end',()=>{try{resolve(JSON.parse(data))}catch{reject(Error('invalid json'))}});stream.on('error',reject)})}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return json(res,405,{ok:false,error:'Kun POST er tillatt'});
 const key=process.env.RESEND_API_KEY,from=process.env.LANESJEKK_REPORT_FROM,project=process.env.LANESJEKK_SUPABASE_URL||'https://pryrgwfjniggjlrizenh.supabase.co',anon=process.env.LANESJEKK_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
 if(!key||!from)return json(res,503,{ok:false,error:'Direkte e-post er ikke aktivert. Administrator må konfigurere en verifisert avsender og e-postleverandør.'});
 const origin=req.headers?.origin;
 if(origin&&!['https://lanesjekk-norge.onrender.com','https://www.lanesjekk.no','https://lanesjekk.no'].includes(origin))return json(res,403,{ok:false,error:'Ikke tillatt opprinnelse'});
 const bearer=/^Bearer (.+)$/i.exec(req.headers?.authorization||'');
 if(!bearer)return json(res,401,{ok:false,error:'Logg inn for å sende rapporter fra nettstedet.'});
 let auth;try{const response=await fetch(project+'/auth/v1/user',{headers:{Authorization:'Bearer '+bearer[1],apikey:anon},signal:AbortSignal.timeout(6000)});if(!response.ok)throw Error('auth');auth=await response.json();if(!auth.id||!auth.email)throw Error('auth')}catch{return json(res,401,{ok:false,error:'Kunne ikke bekrefte innloggingen.'})}
 const now=Date.now();for(const [k,v] of buckets)if(v.until<now)buckets.delete(k);const b=buckets.get(auth.id)||{count:0,until:now+3600000};if(b.count>=5)return json(res,429,{ok:false,error:'Grensen er fem e-poster i timen. Prøv igjen senere.'});b.count++;buckets.set(auth.id,b);
 let body;try{body=await readBody(req.stream)}catch{return json(res,400,{ok:false,error:'Ugyldig eller for stor rapport.'})}
 if(!validEmail(body.to)||typeof body.pdf!=='string'||body.pdf.length<100||body.pdf.length>1000000||!/^[A-Za-z0-9+/]+={0,2}$/.test(body.pdf)||typeof body.title!=='string'||body.title.length>100||!body.consent)return json(res,400,{ok:false,error:'Kontroller mottaker, samtykke og PDF-vedlegget.'});
 try{const bytes=Buffer.from(body.pdf,'base64');if(bytes.length<50||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('bad pdf');
 const safe=body.title.replace(/[<>\r\n]/g,'').slice(0,100);
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:[body.to],subject:'Økonomirapport fra Lånesjekk Norge – '+safe,html:'<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><div style="background:#08685f;color:white;padding:24px;font-size:22px;font-weight:bold">LN | Lånesjekk Norge</div><div style="padding:24px"><h2>Økonomirapport</h2><p>Du har mottatt en rapport laget med <strong>Lånesjekk Norge</strong>.</p><p>Hele rapporten er vedlagt som PDF. Beregningene er basert på opplysninger oppgitt av brukeren.</p><p><a href="https://lanesjekk-norge.onrender.com/">Besøk Lånesjekk Norge</a></p></div></div>',attachments:[{filename:'lanesjekk-rapport.pdf',content:body.pdf,content_type:'application/pdf'}]}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)return json(res,502,{ok:false,error:'E-postleverandøren avviste utsendingen. Kontroller avsenderkonfigurasjonen.'});
 return json(res,200,{ok:true,message:'Rapporten er levert til e-postleverandøren for utsending.'})}catch{return json(res,502,{ok:false,error:'Kunne ikke sende e-posten. Prøv igjen senere.'})}
};
