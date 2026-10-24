'use strict';
// Non-blocking deployment checks against actual public sources.
// Do not prevent a healthy website from starting when an external authority is down.
const checks=[
 ['Kartverket-adresser',require('../api/address-search.js'),{method:'GET',query:{q:'Storgata 1'}},d=>Array.isArray(d.suggestions)],
 ['SSB-14310-Ullensaker',require('../api/property-market.js'),{method:'GET',query:{municipality:'3209',type:'block'}},d=>Array.isArray(d.rows)&&d.rows.length>0],
 ['Frankfurter-NOK-EUR',require('../api/currency.js'),{method:'GET',query:{from:'NOK',to:'EUR'}},d=>Number.isFinite(d.rate)&&d.rate>0&&/^\d{4}-\d{2}-\d{2}$/.test(d.date)]
];
async function probe(name,handler,req,verify){
 const res={code:200,setHeader(){return this},status(value){this.code=value;return this},json(value){this.body=value;return this}};
 try{
  await Promise.race([handler(req,res),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timed out')),29000))]);
  if(res.code===200&&verify(res.body)){console.log('[live-data-check] '+name+' PASS'+(name.startsWith('SSB-')?' published quarters='+res.body.rows.length:''));return}
  console.log('[live-data-check] '+name+' UNAVAILABLE HTTP '+res.code+' '+String(res.body?.error||'missing verified data').slice(0,140));
 }catch(e){console.log('[live-data-check] '+name+' UNAVAILABLE '+String(e.message).slice(0,140))}
}
Promise.allSettled(checks.map(c=>probe(...c))).then(()=>console.log('[live-data-check] Completed; unavailable upstream data never substituted with invented results.'));
