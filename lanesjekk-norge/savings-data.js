/* Sourced snapshot for illustrative account comparison, checked 2026-10-23.
 * Not a live/real-time Finansportalen feed. Never label these rates "live".
 * Exact product-specific conditions should always be checked at source.
 * A snapshot becomes stale; do not imply it covers the whole market. */
(function(root){
'use strict';
const data={
  asOf:'2026-10-23',
  status:'historical_official_bank_page_snapshot_not_live',
  methodology:'Årlig rente ≈ innskudd × nominell sats / 100, før skatt, uten rentes rente. Månedssparing beregnes separat som illustrasjon.',
  products:[
    {id:'dnb-vanlig',bank:'DNB',account:'Sparekonto',type:'fri',rateTiers:[{min:0,rate:2.45}],maxBalance:2000000,
      freeWithdrawals:'Ubegrenset',member:false,notes:'Ordinær sparekonto. Rente oppgitt i bankens prisliste for nye kontoer fra 12. mai 2026.',
      source:'https://www.dnb.no/sparing/prisliste-sparing',brand:'#006b61',initials:'DNB'},
    {id:'dnb-pluss',bank:'DNB',account:'Sparekonto Pluss',type:'begrenset',rateTiers:[{min:0,rate:2.45},{min:100000,rate:3.65},{min:500000,rate:4.10}],maxBalance:2000000,
      freeWithdrawals:'12 per år',member:false,notes:'Rente for hele innskuddet ved angitt saldo til og med 2 mill. kr. Over grensen gjelder egne rentetrinn.',
      source:'https://www.dnb.no/sparing/prisliste-sparing',brand:'#006b61',initials:'DNB'},
    {id:'klp-vanlig',bank:'KLP Banken',account:'Sparekonto',type:'fri',rateTiers:[{min:0,rate:3.40}],maxBalance:2000000,
      freeWithdrawals:'Ubegrenset',member:false,notes:'Rente fra første krone; banken oppgir andre vilkår for saldo over 8 mill. kr.',
      source:'https://www.klp.no/bank/sparing-pa-konto/sparekonto',brand:'#08718a',initials:'KLP'},
    {id:'klp-hoy',bank:'KLP Banken',account:'Høyrentekonto',type:'begrenset',rateTiers:[{min:0,rate:3.40},{min:100000,rate:3.95}],maxBalance:2000000,
      freeWithdrawals:'4 per år',member:false,notes:'Fire gebyrfrie uttak per år. Høyere sats fra 100 000 kr gjelder hele saldoen.',
      source:'https://www.klp.no/bank/priser',brand:'#08718a',initials:'KLP'},
    {id:'klp-31',bank:'KLP Banken',account:'Plasseringskonto 31 dager',type:'varsel',rateTiers:[{min:0,rate:4.20}],maxBalance:2000000,
      freeWithdrawals:'31 dagers varsel',member:false,notes:'Uttak må varsles minst 31 dager før; kortere varsel medfører gebyr.',
      source:'https://www.klp.no/bank/sparing-pa-konto/plasseringskonto-31-dager',brand:'#08718a',initials:'KLP'},
    {id:'obos-vanlig',bank:'OBOS-banken',account:'Sparekonto',type:'begrenset',rateTiers:[{min:0,rate:4.07}],maxBalance:2000000,
      freeWithdrawals:'24 per år',member:true,notes:'Krever OBOS-medlemskap. Utover 24 frie uttak påløper uttaksgebyr.',
      source:'https://www.obos.no/bank/sparing/sparekonto',brand:'#14528c',initials:'OB'},
    {id:'obos-lang',bank:'OBOS-banken',account:'Sparekonto Langsiktig',type:'begrenset',rateTiers:[{min:0,rate:4.55}],maxBalance:2000000,
      freeWithdrawals:'1 per år',member:true,notes:'Krever OBOS-medlemskap. Ett gratis uttak per kalenderår.',
      source:'https://www.obos.no/bank/sparing/sparekonto-langsiktig',brand:'#14528c',initials:'OB'},
    {id:'storebrand-hoy',bank:'Storebrand Bank',account:'Høyrentekonto',type:'begrenset',rateTiers:[{min:0,rate:3.50},{min:100000,rate:3.75},{min:500000,rate:4.40}],maxBalance:2000000,
      freeWithdrawals:'4 per år',member:false,notes:'Renten gjelder hele saldoen på kontoen i angitt intervall. Gebyr etter fire gratis uttak.',
      source:'https://www.storebrand.no/privat/bank-og-lan/prisliste-bank/prisliste-renter-og-lan',brand:'#0e7963',initials:'SB'},
    {id:'landkreditt-plus',bank:'Landkreditt Bank',account:'Spare+',type:'begrenset',rateTiers:[{min:0,rate:3.45},{min:100000,rate:3.65},{min:500000,rate:4.15},{min:1000000,rate:4.60}],maxBalance:2000000,
      freeWithdrawals:'Se vilkår',member:false,notes:'Rentetrapp avhengig av saldo. Bankens prisliste er oppdatert 22. juli 2026; kontroller produktvilkår.',
      source:'https://www.landkreditt.no/vare-priser/konto/',brand:'#2b7650',initials:'LK'}
  ]
};
if(typeof module!=='undefined'&&module.exports)module.exports=data;
if(root)root.LANESAVINGS=data;
})(typeof window==='undefined'?null:window);
