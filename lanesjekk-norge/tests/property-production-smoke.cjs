'use strict';
const base='https://lanesjekk-norge.vercel.app';
async function read(path){
 const r=await fetch(base+path,{headers:{Accept:'application/json'}});
 const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={body:text.slice(0,400)}}
 console.log(path,'HTTP',r.status,JSON.stringify(data).slice(0,350));
 if(!r.ok)throw Error('production '+path+' HTTP '+r.status);
 return data
}
(async()=>{
 const [a,b]=await Promise.all([
 read('/api/address-search?q='+encodeURIComponent('Ammerudgrenda 172')),
 read('/api/property-market?municipality=0301&type=block')
 ]);
 if(!Array.isArray(a.suggestions)||!a.suggestions.some(x=>x.text==='Ammerudgrenda 172'&&x.municipalityCode==='0301'))throw Error('Address suggestion missing');
 if(b.source!=='SSB'||!b.rows?.some(x=>x.sqm>0))throw Error('SSB source missing');
 const r=await fetch(base+'/#utleie');const html=await r.text();
 if(!r.ok||!html.includes('pv-studio-tabs')||!html.includes('pv-address-results'))throw Error('New valuation frontend missing');
 console.log('PASS: live website address and SSB API and new valuation UI');
})().catch(e=>{console.error('FAILED',e.message);process.exitCode=1});
