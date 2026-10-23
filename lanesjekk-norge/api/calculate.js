/* Lånesjekk Norge /api/calculate
   Public stateless calculator. Does not fetch banks, store users, or issue credit decisions.
   Method: POST JSON; restrict to 8 comparisons and sane financial inputs.
 */
'use strict';
function valid(n,min,max){return typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max}
/* Reuse the very same curated directory as the browser to avoid drifting IDs. */
const allowedBanks=Object.freeze(Object.fromEntries(require('../banker.js').map(bank=>[bank.id,bank.name])));
function payment(principal,annualNominal,months){
 const r=annualNominal/1200;
 if(r===0)return principal/months;
 return principal*r/(1-Math.pow(1+r,-months));
}
function calculate(principal,annualNominal,months,monthlyFee=0,startupFee=0){
 const base=payment(principal,annualNominal,months),monthly=base+monthlyFee;
 return {monthlyPayment:Math.round(monthly*100)/100,totalPayment:Math.round((monthly*months+startupFee)*100)/100,
  totalInterest:Math.round((base*months-principal)*100)/100,
  totalFees:Math.round((monthlyFee*months+startupFee)*100)/100,
  startupFee,monthlyFee};
}
module.exports=function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='OPTIONS'){
  res.setHeader('Allow','POST, OPTIONS');res.statusCode=204;return res.end();
 }
 if(req.method!=='POST')return res.status(405).json({error:'Bruk POST med JSON.'});
 if(Number(req.headers['content-length']||0)>12000)return res.status(413).json({error:'For stor forespørsel.'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!b||typeof b!=='object'||Array.isArray(b))throw Error('JSON-objekt mangler.');
  const {principal,propertyValue,years,current,offers=[]}=b;
  if(!valid(principal,10000,100000000)||!valid(propertyValue,10000,200000000)||
      !valid(years,1,40)||!Number.isInteger(years))throw Error('Ugyldig lånebeløp, boligverdi eller løpetid.');
  if(!current||!valid(current.rate,0,35)||!valid(current.monthlyFee,0,2000))throw Error('Ugyldig gjeldende rente eller gebyr.');
  if(!Array.isArray(offers)||offers.length>8)throw Error('Maks åtte banktilbud.');
  const months=years*12,baseline=calculate(principal,current.rate,months,current.monthlyFee,0);
  const comparisons=offers.map((offer,i)=>{
   if(!offer||typeof offer.bankId!=='string'||!Object.hasOwn(allowedBanks,offer.bankId)||!valid(offer.rate,0,35)||!valid(offer.monthlyFee,0,2000)||!valid(offer.startupFee,0,500000))throw Error('Ugyldig banktilbud eller ikke-verifisert bank '+(i+1)+'.');
   const result=calculate(principal,offer.rate,months,offer.monthlyFee,offer.startupFee);
   return {bankId:offer.bankId,name:allowedBanks[offer.bankId],
    nominalRate:offer.rate,...result,monthlyDifference:Math.round((baseline.monthlyPayment-result.monthlyPayment)*100)/100,
    totalSavings:Math.round((baseline.totalPayment-result.totalPayment)*100)/100};
  }).sort((a,b)=>a.totalPayment-b.totalPayment);
  return res.status(200).json({
   currency:'NOK',loan:{principal,propertyValue,years,ltvPercent:Math.round(principal/propertyValue*10000)/100},
   assumption:'Annuity; nominal yearly interest; monthly repayment; constant rates; excludes tax effects and future changes.',
   current:{nominalRate:current.rate,...baseline},comparisons,
   source:'user_supplied_rates_only',bankDirectory:'finanstilsynet_verified_entries_plus_norges_bank_list_2026_06_25',financialAdvice:false,
   marketDataStatus:'No Finansportalen feed credentials. Compare with official embedded Finansportalen widget on the website.'});
 }catch(e){return res.status(400).json({error:String(e.message||'Ugyldige data').slice(0,200)})}
};
module.exports._internals={calculate,payment};