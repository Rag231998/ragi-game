'use strict';
const countries=[['NOR','Norge'],['WLD','Verden']];
const indicators=[['NY.GDP.MKTP.KD.ZG','Økonomisk vekst','%'],['FP.CPI.TOTL.ZG','Prisvekst','%']];
let cached=null,at=0;
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','public, max-age=1800');
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'Kun GET'});
 if(cached&&Date.now()-at<6*3600e3)return res.status(200).json({ok:true,updatedAt:new Date(at).toISOString(),items:cached});
 try{
 const results=await Promise.all(countries.flatMap(([country,name])=>indicators.map(async([indicator,label,unit])=>{
 const url='https://api.worldbank.org/v2/country/'+country+'/indicator/'+indicator+'?format=json&per_page=10';
 const response=await fetch(url,{signal:AbortSignal.timeout(8500)});if(!response.ok)throw Error('Kilde utilgjengelig');
 const json=await response.json();const row=Array.isArray(json?.[1])?json[1].find(x=>x.value!=null&&Number.isFinite(Number(x.value))):null;
 if(!row)return null;
 return{country,name,label,value:Number(row.value),unit,year:String(row.date),source:'Verdensbanken',url:'https://data.worldbank.org/indicator/'+indicator+'?locations='+country};
 })));
 cached=results.filter(Boolean);at=Date.now();
 if(!cached.length)throw Error('Ingen publiserte tall');
 return res.status(200).json({ok:true,updatedAt:new Date(at).toISOString(),items:cached});
 }catch{return res.status(503).json({ok:false,error:'Oppdaterte økonomitall er midlertidig utilgjengelige.',items:[]});}
};