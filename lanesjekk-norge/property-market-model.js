/* Lånesjekk Norge: transparent, deterministic SSB municipality-price proxy.
 * These are historical group averages, NOT a valuation of an individual home. */
(function(root){
 'use strict';
 function basis(rows){
  if(!Array.isArray(rows))return null;
  const verified=rows.filter(x=>typeof x.period==='string'&&/^\d{4}K[1-4]$/.test(x.period)&&Number.isFinite(x.value)&&x.value>0).sort((a,b)=>a.period.localeCompare(b.period));
  if(!verified.length)return null;
  const recent=verified.slice(-4);
  // If all quarters report transactions, weigh by actual recorded transactions.
  // Otherwise show an unweighted mean and explicitly flag missing sales counts.
  const weighted=recent.every(x=>Number.isFinite(x.sales)&&x.sales>0);
  const weights=recent.map(x=>weighted?x.sales:1);
  const total=weights.reduce((a,b)=>a+b,0);
  const price=recent.reduce((sum,x,i)=>sum+x.value*weights[i],0)/total;
  return {pricePerSqm:price,quarters:recent.length,firstQuarter:recent[0].period,lastQuarter:recent.at(-1).period,
   lowestSqm:Math.min(...recent.map(x=>x.value)),highestSqm:Math.max(...recent.map(x=>x.value)),
   sales:weighted?total:null,weighted,singleQuarter:recent.length===1};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={basis};
 root.LANEPROPERTYMARKET=Object.freeze({basis});
})(typeof window==='undefined'?{}:window);
