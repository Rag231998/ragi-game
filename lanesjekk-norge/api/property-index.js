'use strict';
/* Official SSB 07221 used-home price index (2015=100).
  GET /api/property-index?municipality=0301&type=block
  Use only for development of a known earlier price, NOT a standalone valuation.
*/
const BASE='https://data.ssb.no/api/pxwebapi/v2/tables/07221';
const CLASSES={block:/blokkleilig|apartment|flats/i,small:/småhus|row house|semi.detached/i,house:/enebolig|detached/i};
let cache={data:null,until:0};
function array(dim){const idx=dim?.category?.index||{};return Array.isArray(idx)?idx:Object.keys(idx).sort((a,b)=>idx[a]-idx[b])}
function variable(ids,pattern){return ids.find(x=>pattern.test(x))}
function label(dim,code){return String(dim.category?.label?.[code]||code||'')}
function chooseRegion(code){
 // SSB 07221 regional indices are broader than municipalities.
 // For unknown areas use country index and mark the fallback explicitly.
 if(code==='0301'||code==='3201')return {match:/oslo.*bærum/i,name:'Oslo med Bærum'};
 if(code==='1103')return {match:/^stavanger$/i,name:'Stavanger'};
 if(code==='4601')return {match:/^bergen$/i,name:'Bergen'};
 if(code==='5001')return {match:/^trondheim$/i,name:'Trondheim'};
 const county=code.slice(0,2);
 const region={
 '32':[/akershus.*uten.*bærum/i,'Akershus uten Bærum'],
 '31':[/østfold.*buskerud.*vestfold.*telemark/i,'Østfold, Buskerud, Vestfold og Telemark'],
 '33':[/østfold.*buskerud.*vestfold.*telemark/i,'Østfold, Buskerud, Vestfold og Telemark'],
 '39':[/østfold.*buskerud.*vestfold.*telemark/i,'Østfold, Buskerud, Vestfold og Telemark'],
 '40':[/østfold.*buskerud.*vestfold.*telemark/i,'Østfold, Buskerud, Vestfold og Telemark'],
 '34':[/innlandet/i,'Innlandet'],
 '42':[/agder.*rogaland.*uten.*stavanger/i,'Agder og Rogaland uten Stavanger'],
 '11':[/agder.*rogaland.*uten.*stavanger/i,'Agder og Rogaland uten Stavanger'],
 '15':[/møre.*romsdal.*vestland.*uten.*bergen/i,'Møre og Romsdal og Vestland uten Bergen'],
 '46':[/møre.*romsdal.*vestland.*uten.*bergen/i,'Møre og Romsdal og Vestland uten Bergen'],
 '50':[/trøndelag.*uten.*trondheim/i,'Trøndelag uten Trondheim'],
 '18':[/nord.norge/i,'Nord-Norge'],
 '55':[/nord.norge/i,'Nord-Norge'],
 '56':[/nord.norge/i,'Nord-Norge']
 }[county];
 return region?{match:region[0],name:region[1]}:{match:/hele landet/i,name:'Hele landet',fallback:true};
}
async function get(url){
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),9500);
 try{const result=await fetch(url,{headers:{Accept:'application/json'},signal:ctl.signal});if(!result.ok)throw Error('SSB svarte HTTP '+result.status);return result.json()}
 finally{clearTimeout(timer)}
}
function unpack(data,regionCode,typeCode,indexCode){
 const dims=data.dimension||{},ids=data.id||Object.keys(dims),sizes=data.size||ids.map(k=>array(dims[k]).length);
 const r=variable(ids,/region/i),t=variable(ids,/bolig|type/i),c=variable(ids,/contents|statistikk|variable/i),period=variable(ids,/tid|time|kvartal/i);
 if(!r||!t||!c||!period)throw Error('SSB endret tabellstrukturen');
 const values=ids.map(id=>array(dims[id]));const results=[];
 (data.value||[]).forEach((n,k)=>{
  if(!Number.isFinite(n)||n<=0)return;
  const coordinates={};let z=k;
  for(let i=ids.length-1;i>=0;i--){coordinates[ids[i]]=values[i][z%sizes[i]];z=Math.floor(z/sizes[i])}
  if(coordinates[r]===regionCode&&coordinates[t]===typeCode&&coordinates[c]===indexCode)results.push({period:coordinates[period],index:n})
 });
 return results.sort((a,b)=>a.period.localeCompare(b.period)).slice(-32)
}
async function lookup(municipality,kind){
 let meta=cache.data;
 if(!meta||cache.until<Date.now()){meta=await get(BASE+'/metadata?lang=no');cache={data:meta,until:Date.now()+3600e3}}
 const dims=meta.dimension||{},ids=meta.id||Object.keys(dims);
 const r=variable(ids,/region/i),t=variable(ids,/bolig|type/i),c=variable(ids,/contents|statistikk|variable/i),p=variable(ids,/tid|time|kvartal/i);
 if(!r||!t||!c||!p)throw Error('Indekstabellen mangler forventede variabler');
 const classification=chooseRegion(municipality);
 const options=array(dims[r]),codes=options.filter(x=>classification.match.test(label(dims[r],x)));
 const chosen=codes[0]||options.find(x=>/hele landet/i.test(label(dims[r],x)));
 if(!chosen)throw Error('Prisindeksregion ikke tilgjengelig');
 const property=array(dims[t]).find(x=>CLASSES[kind].test(label(dims[t],x)));
 const preferred=property||array(dims[t]).find(x=>/alle boligtyper/i.test(label(dims[t],x)));
 if(!preferred)throw Error('Boligtypen mangler i indeksen');
 const content=array(dims[c]).find(x=>/prisindeks|price index|index/i.test(label(dims[c],x)))||array(dims[c])[0];
 if(!content)throw Error('Fant ingen prisindeksvariabel');
 const u=new URL(BASE+'/data');u.searchParams.set('lang','no');
 for(const [key,value] of [[r,chosen],[t,preferred],[c,content],[p,'top(32)']])u.searchParams.set('valueCodes['+key+']',value);
 const data=await get(u.toString()),rows=unpack(data,chosen,preferred,content);
 if(!rows.length)throw Error('Ingen indeksdata for boligtype og region');
 return {source:'SSB',table:'07221',municipality,region:label(dims[r],chosen),regionFallback:!codes.length||!!classification.fallback,kind:label(dims[t],preferred),rows,latest:rows.at(-1),
  method:'Ny indeksjustert verdi = tidligere dokumentert verdi × (ny indeks / indeks i kjøpsperioden)',baseYear:2015};
}
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Kun GET er tillatt.'})}
 const{municipality,type}=req.query||{};
 if(typeof municipality!=='string'||!/^\d{4}$/.test(municipality)||!Object.prototype.hasOwnProperty.call(CLASSES,type))return res.status(400).json({error:'Ugyldig kommune eller boligtype'});
 try{const data=await lookup(municipality,type);res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');return res.status(200).json(data)}
 catch(e){res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'SSBs boligprisindeks er ikke tilgjengelig akkurat nå. Prøv igjen senere.'})}
};
module.exports._test={array,chooseRegion,unpack,lookup};
