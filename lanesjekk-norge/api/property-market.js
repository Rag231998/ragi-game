/* Property price proxy: SSB PxWeb API v2 / table 14310. No user data is stored.
   Official statistics CC BY 4.0. Cache responses to respect SSB request limits.
   GET /api/property-market?municipality=0301&type=block
*/
'use strict';
const BASE='https://data.ssb.no/api/pxwebapi/v2/tables/14310';
const TYPE_PATTERNS={block:/blokk|apartment/i,small:/småhus|rekkehus|row house/i,house:/enebolig|detached/i};
let metaCache={until:0,data:null};
const httpError=(status,message)=>Object.assign(new Error(message),{status});
async function json(url){
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),9000);
 try{
  const res=await fetch(url,{headers:{'Accept':'application/json','User-Agent':'Lanesjekk-Norge/1.0 (public statistics)'},signal:controller.signal});
  if(!res.ok)throw httpError(res.status===429?503:502,'SSB svarte med HTTP '+res.status);
  return await res.json();
 }finally{clearTimeout(timeout)}
}
function codes(dim){
 const ix=dim?.category?.index||{};
 if(Array.isArray(ix))return ix;
 return Object.keys(ix).sort((a,b)=>ix[a]-ix[b]);
}
function keyFor(ids,regex){return ids.find(x=>regex.test(x))||null}
function pickValue(dim,regex){return codes(dim).find(x=>regex.test(String(dim?.category?.label?.[x]||'')))}
function rowsFromJsonStat(raw,wantRegion,wantType,priceCode,salesCode){
 const dims=raw.dimension||{},ids=raw.id||Object.keys(dims),sizes=raw.size||ids.map(id=>codes(dims[id]).length);
 const regionId=keyFor(ids,/region/i),typeId=keyFor(ids,/bolig|type/i),contentId=keyFor(ids,/contents|statistikk|variable/i),timeId=keyFor(ids,/tid|time|kvartal/i);
 if(!regionId||!typeId||!contentId||!timeId)throw httpError(502,'SSB endret tabellstrukturen.');
 const index=ids.map(id=>codes(dims[id]));const byTime=new Map();
 (raw.value||[]).forEach((value,offset)=>{
  if(!Number.isFinite(value)||value<0)return;
  const coordinates={};let n=offset;
  for(let i=ids.length-1;i>=0;i--){coordinates[ids[i]]=index[i][n%sizes[i]];n=Math.floor(n/sizes[i])}
  if(coordinates[regionId]!==wantRegion||coordinates[typeId]!==wantType)return;
  const quarter=coordinates[timeId],which=coordinates[contentId];if(!quarter)return;
  let row=byTime.get(quarter);if(!row){row={period:quarter,sqm:null,sales:null};byTime.set(quarter,row)}
  if(which===priceCode&&value>0)row.sqm=value;
  if(which===salesCode)row.sales=value;
 });
 return [...byTime.values()].filter(r=>r.sqm!==null).sort((a,b)=>a.period.localeCompare(b.period)).slice(-16);
}
async function lookup(municipality,type){
 let meta=metaCache.data;
 if(!meta||metaCache.until<Date.now()){meta=await json(BASE+'/metadata?lang=no');metaCache={data:meta,until:Date.now()+60*60*1000}}
 const dims=meta.dimension||{},ids=meta.id||Object.keys(dims);
 const rg=keyFor(ids,/region/i),typ=keyFor(ids,/bolig|type/i),co=keyFor(ids,/contents|statistikk|variable/i),time=keyFor(ids,/tid|time|kvartal/i);
 if(!rg||!typ||!co||!time)throw httpError(502,'SSB-tabellen har uventet struktur.');
 const available=codes(dims[rg]);
 // The default region metadata may contain counties only. Municipality codes are
 // exposed by the explicit vs_Kommun value set, so do not reject valid IDs here.
 const region=available.find(x=>x===municipality||x==='K-'+municipality||x.endsWith('-'+municipality))||'K-'+municipality;
 const propertyType=pickValue(dims[typ],TYPE_PATTERNS[type]);
 const priceCode=pickValue(dims[co],/gjennomsnittlig kvadratmeterpris|kvadratmeterpris|price per square metre/i);
 const salesCode=pickValue(dims[co],/antall (?:bolig)?omsetninger|antall salg|number of sales|transactions/i);
 if(!propertyType||!priceCode)throw httpError(502,'SSB mangler boligtype eller prisserie.');
 const url=new URL(BASE+'/data');url.searchParams.set('lang','no');
 url.searchParams.set('valueCodes['+rg+']',region);
 // Table 14310 exposes both county and municipality code lists. Select municipal values explicitly.
 url.searchParams.set('codeList['+rg+']','vs_Kommun');
 url.searchParams.set('valueCodes['+typ+']',propertyType);
 url.searchParams.set('valueCodes['+co+']',[priceCode,salesCode].filter(Boolean).join(','));
 url.searchParams.set('valueCodes['+time+']','top(16)');
 let result;
 try{result=await json(url.toString())}
 catch(error){
  // Some table revisions already expose the municipality value set as default.
  // Retry without the explicit code list if the first query was rejected.
  url.searchParams.delete('codeList['+rg+']');
  result=await json(url.toString());
 }
 const rows=rowsFromJsonStat(result,region,propertyType,priceCode,salesCode);
 if(!rows.length)throw httpError(404,'Ingen publiserte kvadratmeterpriser for dette utvalget.');
 return{source:'SSB',table:'14310',municipality,type,propertyTypeLabel:dims[typ]?.category?.label?.[propertyType]||type,
         regionLabel:result.dimension?.[rg]?.category?.label?.[region]||dims[rg]?.category?.label?.[region]||municipality,rows,latest:rows.at(-1),method:'BRA-i × publisert gjennomsnittlig kvadratmeterpris i kommunen (siste inntil fire kvartaler; evt. vektet etter omsetninger)'};
}
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Kun GET er tillatt.'})}
 const{municipality,type}=req.query||{};
 if(typeof municipality!=='string'||!/^\d{4}$/.test(municipality)||!Object.hasOwn(TYPE_PATTERNS,type)){return res.status(400).json({error:'Ugyldig kommune eller boligtype.'})}
 try{
  const data=await lookup(municipality,type);
  res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).json(data);
 }catch(e){res.setHeader('Cache-Control','no-store');return res.status(e.status||503).json({error:e.message||'Kildedata er midlertidig utilgjengelige.'})}
};
module.exports._test={codes,pickValue,rowsFromJsonStat,lookup};
