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
})().catch(e=>{console.error(e);process.exit(1)});
