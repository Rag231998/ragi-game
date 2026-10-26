'use strict';
// Source of truth: Norges Bank public policy rate page, not a guessed SDMX series.
let cache={until:0,data:null};
const sourceUrl='https://www.norges-bank.no/tema/pengepolitikk/styringsrenten/';
const verified={rate:4.5,date:'2026-09-24'};
const nextDecision='2026-11-05';
function parseOfficial(html){
 const plain=String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/\s+/g,' ');
 const patterns=[/Styringsrenten\s+(\d{1,2}(?:[,.]\d{1,2})?)\s*%\s*Publisert\s*(\d{2}\.\d{2}\.\d{4})/i,/Styringsrenten.{0,180}?(\d{1,2}(?:[,.]\d{1,2})?)\s*%\s*Publisert\s*(\d{2}\.\d{2}\.\d{4})/i];
 const match=patterns.map(p=>plain.match(p)).find(Boolean);if(!match)throw Error('Kunne ikke kontrollere offisiell sats');
 const rate=Number(match[1].replace(',','.'));const [day,month,year]=match[2].split('.').map(Number);
 const date=[year,String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
 if(!(rate>=0&&rate<=20)||!Number.isInteger(year)||year<2020||month<1||month>12||day<1||day>31||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('Ugyldig offisielt resultat');
 return{rate,date};
}
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'Kun GET'});
 if(cache.data&&cache.until>Date.now())return res.status(200).json(cache.data);
 try{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  let response;try{response=await fetch(sourceUrl,{headers:{Accept:'text/html','User-Agent':'Lanesjekk-Norge/1.0 public reference checker'},signal:controller.signal})}finally{clearTimeout(timer)}
  if(!response.ok)throw Error('Offisiell side utilgjengelig');
  const data=parseOfficial(await response.text());
  // A contradictory source parse must never replace the verified public decision.
  if(new Date().toISOString().slice(0,10)<nextDecision&&(data.rate!==verified.rate||data.date!==verified.date))throw Error('Inconsistent official rate');
  const payload={ok:true,...data,source:'Norges Bank – offisiell styringsrenteside',sourceUrl,note:'Datoen er publiseringsdato, ikke siste daglige observasjon. Ikke bankrenten.'};
  cache={until:Date.now()+15*60*1000,data:payload};
  return res.status(200).json(payload);
 }catch(e){
  // During the known decision period, show a dated, explicitly static official snapshot.
  if(new Date().toISOString().slice(0,10)<nextDecision)return res.status(200).json({ok:true,...verified,source:'Norges Bank – kontrollert rentebeslutning 24.09.2026',sourceUrl,snapshot:true,note:'Sist manuelt verifiserte rentebeslutning; ikke sanntidsdata.'});
  return res.status(503).json({ok:false,error:'Kan ikke bekrefte gjeldende styringsrente. Ingen rente vises.',sourceUrl})
 }
};
module.exports._test={parseOfficial};
