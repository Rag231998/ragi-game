'use strict';
const zones=new Set(['NO1','NO2','NO3','NO4','NO5']);
const cache=new Map();
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','public, max-age=300');
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'Kun GET støttes.'});
 const zone=String(req.query?.zone||'NO1').toUpperCase();
 if(!zones.has(zone))return res.status(400).json({ok:false,error:'Ugyldig prisområde.'});
 const now=new Date(),d=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const [year,month,day]=d.split('-');const key=d+zone;
 try{
 let rows=cache.get(key);if(!rows||now.getTime()-rows.at>300000){
 const response=await fetch('https://www.hvakosterstrommen.no/api/v1/prices/'+year+'/'+month+'-'+day+'_'+zone+'.json',{signal:AbortSignal.timeout(6000)});
 if(!response.ok)throw Error('Datakilden svarte med '+response.status);
 const data=await response.json();
 if(!Array.isArray(data)||data.length<1)throw Error('Ingen gyldige strømpriser');
 rows={at:now.getTime(),data};cache.set(key,rows);
 }
 const match=rows.data.find(x=>now>=new Date(x.time_start)&&now<new Date(x.time_end));
 if(!match||!Number.isFinite(match.NOK_per_kWh))throw Error('Ingen pris publisert for gjeldende time.');
 return res.status(200).json({ok:true,zone,price:match.NOK_per_kWh,hour:new Intl.DateTimeFormat('nb-NO',{timeZone:'Europe/Oslo',hour:'2-digit',minute:'2-digit'}).format(new Date(match.time_start)),fetchedAt:new Intl.DateTimeFormat('nb-NO',{timeZone:'Europe/Oslo',hour:'2-digit',minute:'2-digit'}).format(new Date(rows.at)),source:'https://www.hvakosterstrommen.no/strompris-api'});
 }catch(e){return res.status(503).json({ok:false,error:'Strømprisene er midlertidig utilgjengelige.'});}
};