'use strict';
// Free official/institutional mid-market rate history, never card-provider quotes.
const allowed=new Set(['NOK','EUR','USD','GBP','SEK','DKK','CHF','JPY','THB','TRY','AUD','CAD','PLN','SGD','HKD','INR','LKR']);
const cache=new Map();
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Kun GET er tillatt.'});}
 const from=String(req.query?.from||'NOK').toUpperCase(),to=String(req.query?.to||'EUR').toUpperCase(),days=Number(req.query?.days||30);
 if(!allowed.has(from)||!allowed.has(to)||![7,30,90,365].includes(days))return res.status(400).json({error:'Ugyldig valuta eller tidsperiode.'});
 if(from===to)return res.status(200).json({from,to,points:[],sameCurrency:true,source:'Samme valuta'});
 const key=from+'/'+to+'/'+days,cached=cache.get(key);
 if(cached&&Date.now()-cached.saved<3600000)return res.status(200).json(cached.data);
 const start=new Date(Date.now()-days*86400000).toISOString().slice(0,10);
 const url=new URL('https://api.frankfurter.dev/v2/rates');
 url.searchParams.set('from',start);url.searchParams.set('base',from);url.searchParams.set('quotes',to);if(days>30)url.searchParams.set('group','week');
 const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),10000);
 try{
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:abort.signal});
  if(!response.ok)throw Error('Valutaleverandøren svarte '+response.status);
  const body=await response.json();
  if(!Array.isArray(body))throw Error('Ugyldig historisk datasett');
  const points=body.filter(r=>r.base===from&&r.quote===to&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&Number.isFinite(r.rate)&&r.rate>0)
   .map(r=>({date:r.date,rate:r.rate})).sort((a,b)=>a.date.localeCompare(b.date)).slice(-370);
  if(!points.length)throw Error('Ingen registrerte historiske valutakurser');
  const data={from,to,points,source:'Frankfurter (historiske valutakurser)',lastDate:points.at(-1).date};
  cache.set(key,{saved:Date.now(),data});
  res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=7200');
  return res.status(200).json(data);
 }catch(e){
  if(cached)return res.status(200).json({...cached.data,stale:true});
  return res.status(503).json({error:'Historiske kurser er midlertidig utilgjengelige.'});
 }finally{clearTimeout(timeout)}
};
