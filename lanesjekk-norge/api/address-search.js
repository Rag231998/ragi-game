'use strict';
/* Nationwide Norwegian address suggestions. Kartverket's address service is open but
   it does not contain apartment unit lists. Never synthesize H numbers or owners.
   GET /api/address-search?q=Ammerudgrenda%20172
*/
const API='https://api.kartverket.no/adresser/v1/sok';
const valid=q=>typeof q==='string'&&q.trim().length>=2&&q.length<=110&&/^[\p{L}\p{N}\s,.\-\/]+$/u.test(q);
async function searchUrl(url){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
 try{const r=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw Error('Kartverket svarte '+r.status);return await r.json()}finally{clearTimeout(timer)}
}
function normalized(a){
 return {
  id:String(a.adressekode||'')+'-'+String(a.nummer||'')+'-'+String(a.bokstav||'')+'-'+String(a.kommunenummer||''),
  street:String(a.adressenavn||''),text:String(a.adressetekst||''),
  number:a.nummer??null,letter:a.bokstav||'',postal:String(a.postnummer||''),
  place:String(a.poststed||''),municipality:String(a.kommunenavn||''),
  municipalityCode:String(a.kommunenummer||'')
 }
}
function score(a,query){
 const name=a.street.toLocaleLowerCase('nb'),text=a.text.toLocaleLowerCase('nb'),q=query.toLocaleLowerCase('nb');
 const parts=q.match(/^(.+?)\s+(\d+)([a-z]?)$/i);
 if(text===q||text.startsWith(q+' '))return 1000;
 if(parts&&name===parts[1]&&String(a.number)===parts[2])return 950;
 if(text.startsWith(q))return 700;
 if(name.startsWith(q))return 600;
 if(text.includes(q))return 450;
 const words=q.split(/\s+/).filter(Boolean);return words.every(w=>text.includes(w))?300:0
}
async function lookup(q){
 const clean=q.trim().replace(/\s+/g,' ');
 const match=clean.match(/^(.+?)\s+(\d{1,4})([a-z]?)$/i);
 const queries=[];
 const push=p=>{const u=new URL(API);Object.entries(p).forEach(([k,v])=>u.searchParams.set(k,String(v)));u.searchParams.set('treffPerSide','50');queries.push(u.toString())};
 if(match)push({adressenavn:match[1],nummer:match[2]});
 push({sok:clean+'*'});
 if(!match)push({adressenavn:clean+'*'});
 const results=await Promise.allSettled(queries.map(searchUrl));
 const fulfilled=results.filter(x=>x.status==='fulfilled').map(x=>x.value);
 if(!fulfilled.length)throw Error('Adressetjenesten svarte ikke.');
 const uniq=new Map();
 for(const payload of fulfilled)for(const a of (payload.adresser||[])){
  const n=normalized(a);if(!n.street||!n.municipalityCode)continue;
  const key=[n.municipalityCode,n.text].join('|');if(!uniq.has(key))uniq.set(key,n)
 }
 const ranked=[...uniq.values()].map(x=>({...x,score:score(x,clean)})).sort((a,b)=>b.score-a.score||a.text.localeCompare(b.text,'nb'));
 const suggestions=ranked.slice(0,12).map(({score,...item})=>item);
 const streets=[...new Set(ranked.map(a=>a.street))].slice(0,7);
 return{query:clean,suggestions,streets,resultsCount:Math.max(...fulfilled.map(x=>Number(x.metadata?.totaltAntallTreff)||x.adresser?.length||0),0),source:'Kartverket – Matrikkelen Adresse',unitsAvailable:false}
}
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Kun GET er tillatt.'})}
 const q=req.query?.q;
 if(!valid(q))return res.status(400).json({error:'Skriv minst to bokstaver i adressen.'});
 try{
  const data=await lookup(q);res.setHeader('Cache-Control','public, s-maxage=180, stale-while-revalidate=1800');return res.status(200).json(data)
 }catch(e){res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'Adresseoppslaget er midlertidig utilgjengelig. Prøv igjen.'})}
};
module.exports._test={normalized,score,lookup,valid};
