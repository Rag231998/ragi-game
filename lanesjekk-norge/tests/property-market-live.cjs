'use strict';
const handler=require('../api/property-market.js');
(async()=>{
 const res={headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;return this},
  status(n){this.statusCode=n;return this},json(obj){this.body=obj;return this}};
 await handler({method:'GET',query:{municipality:'0301',type:'block'}},res);
 console.log('SSB market API',res.statusCode,JSON.stringify(res.body).slice(0,2000));
 if(res.statusCode!==200||!res.body||res.body.source!=='SSB'||!Array.isArray(res.body.rows)||!res.body.rows.length||
 !Number.isFinite(res.body.rows.at(-1).sqm)||res.body.rows.at(-1).sqm<=0)process.exit(1);
 console.log('OK: verifiable SSB live data for Oslo:',res.body.rows.at(-1));
 const a=await fetch('https://api.kartverket.no/adresser/v1/sok?sok=Karl%20Johans%20gate%201%20Oslo&treffPerSide=3',{headers:{Accept:'application/json'}});
 if(!a.ok){console.error('Kartverket status',a.status);process.exit(1)}
 const data=await a.json();
 console.log('Kartverket address lookup',data.adresser?.slice(0,2).map(x=>({name:x.adressetekst,municipality:x.kommunenummer})));
 if(!Array.isArray(data.adresser)||!data.adresser.length||!data.adresser.some(x=>/^\d{4}$/.test(x.kommunenummer||'')))process.exit(1);

 const suggest=require('../api/address-search.js')._test.lookup;
 for(const query of ['Ammerud','Ammerudgrenda 172','Karl Johans gate 1']){
  const found=await suggest(query);
  console.log('ADDRESS TEST',query,JSON.stringify({total:found.resultsCount,count:found.suggestions.length,top:found.suggestions.slice(0,4),streets:found.streets.slice(0,4)}));
  if(!found.suggestions.length)throw Error('No suggestions for '+query);
 }

})().catch(e=>{console.error(e);process.exit(1)});
