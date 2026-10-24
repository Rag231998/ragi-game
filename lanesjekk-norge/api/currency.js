'use strict';
const CURRENCIES=['NOK','EUR','USD','GBP','SEK','DKK','CHF','JPY','THB','TRY','AUD','CAD','PLN','SGD','HKD','INR','LKR'];
const ALLOWED=new Set(CURRENCIES);
let cache=new Map();
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET')return res.status(405).json({error:'Kun GET støttes'});
 const from=String(req.query?.from||'NOK').toUpperCase(),to=String(req.query?.to||'EUR').toUpperCase();
 if(!ALLOWED.has(from)||!ALLOWED.has(to))return res.status(400).json({error:'Ugyldig valuta'});
 if(from===to)return res.status(200).json({from,to,rate:1,date:new Date().toISOString().slice(0,10),source:'Samme valuta'});
 const key=from+'/'+to,existing=cache.get(key);
 if(existing&&Date.now()-existing.time<1800000)return res.status(200).json(existing.data);
 try{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8500);
  let response;
  try{response=await fetch('https://api.frankfurter.dev/v2/rates?base='+from+'&quotes='+to,{signal:controller.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timer)}
  if(!response.ok)throw Error('Valutatjenesten svarte '+response.status);
  const json=await response.json();
  const line=Array.isArray(json)?json.find(x=>x.base===from&&x.quote===to):json;
  const rate=Number(line?.rate),date=String(line?.date||'');
  if(!Number.isFinite(rate)||rate<=0||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))throw Error('Ugyldig valutadata');
  const data={from,to,rate,date,source:'Frankfurter – referansekurser fra institusjonelle kilder'};
  cache.set(key,{time:Date.now(),data});
  res.setHeader('Cache-Control','public, s-maxage=1800, stale-while-revalidate=7200');
  return res.status(200).json(data);
 }catch(e){
  if(existing){res.setHeader('Cache-Control','no-store');return res.status(200).json({...existing.data,stale:true})}
  return res.status(503).json({error:'Valutakursen er midlertidig utilgjengelig. Prøv igjen.'});
 }
};
