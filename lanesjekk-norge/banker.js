/* Manually curated registry-backed bank directory, 23 Oct 2026.
 * Each institution below has a named bank licence / Norwegian branch entry.
 * No bank rates are included; prices require licensed distribution feed.
 * Wider discovery uses Norges Bank's list of settlement-account banks (25 Jun 2026).
 * The directory is intentionally not a ranking, partnership or bank offer. */
const curated=[
 {id:'dnb',name:'DNB',legal:'DNB Bank ASA',org:'984851006',domain:'www.dnb.no',site:'https://www.dnb.no',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=98973',region:'Nasjonal',initials:'DNB',color:'#006c6a'},
 {id:'nordea',name:'Nordea',legal:'Nordea Bank Abp NUF',org:'920058817',domain:'www.nordea.no',site:'https://www.nordea.no',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=197422',region:'Nasjonal · EØS-filial',initials:'N',color:'#173b92'},
 {id:'obos',name:'OBOS-banken',legal:'OBOS-banken AS',org:'911986884',domain:'www.obos.no',site:'https://www.obos.no/bank',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=109233',region:'Nasjonal',initials:'OB',color:'#13506e'},
 {id:'storebrand',name:'Storebrand',legal:'Storebrand Bank ASA',org:'953299216',domain:'www.storebrand.no',site:'https://www.storebrand.no/privat/bank-og-lan',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=99141',region:'Nasjonal',initials:'S',color:'#167562'},
 {id:'landkreditt',name:'Landkreditt',legal:'Landkreditt Bank AS',org:'980374181',domain:'www.landkreditt.no',site:'https://www.landkreditt.no',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=99057',region:'Nasjonal',initials:'L',color:'#266d44'},
 {id:'klp',name:'KLP Banken',legal:'KLP Banken AS',org:'993821837',domain:'www.klp.no',site:'https://www.klp.no/bank',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=107283',region:'Nasjonal',initials:'KLP',color:'#006878'},
 {id:'sparebank1ost',name:'SpareBank 1 Østlandet',legal:'SpareBank 1 Østlandet',org:'920426530',domain:'www.sparebank1.no',site:'https://www.sparebank1.no/nb/ostlandet/privat.html',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=99217',region:'Innlandet / Østlandet',initials:'SB1',color:'#00577e'},
 {id:'bnbank',name:'BN Bank',legal:'BN Bank ASA',org:'914864445',domain:'www.bnbank.no',site:'https://www.bnbank.no',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=99230',region:'Nasjonal',initials:'BN',color:'#274b7d'},
 {id:'sparebankennorge',name:'Sparebanken Norge',legal:'Sparebanken Norge',org:'832554332',domain:'www.sparebankennorge.no',site:'https://www.sparebankennorge.no',register:'https://www.finanstilsynet.no/en/finanstilsynets-registry/details/?id=99313',region:'Nasjonal',initials:'SN',color:'#184779'},
 {id:'bulder',name:'Bulder',legal:'Sparebanken Norge (bankkonsesjon)',org:'832554332',domain:'www.bulder.no',site:'https://www.bulder.no',register:'https://www.finanstilsynet.no/en/finanstilsynets-registry/details/?id=99313',region:'Bankkonsept under Sparebanken Norge',initials:'B',color:'#3c417a'},
 {id:'sbanken',name:'Sbanken',legal:'DNB Bank ASA (bankkonsesjon)',org:'984851006',domain:'sbanken.no',site:'https://sbanken.no',register:'https://www.finanstilsynet.no/virksomhetsregisteret/detalj/?id=98973',region:'Bankkonsept under DNB Bank ASA',initials:'S',color:'#f89c36'}
];

/* Wider bank discovery. Every extra entry below occurs by name in Norges
 * Bank's own 25 June 2026 settlement-account list; inclusion is NOT evidence
 * that the bank offers residential mortgages or that today's permissions were
 * checked individually. Historical snapshots must be periodically reviewed. */
const sourceURL='https://www.norges-bank.no/en/topics/Norges-Banks-settlement-system/Banks-with-accounts-in-Norges-Bank/';
const registryURL='https://www.finanstilsynet.no/virksomhetsregisteret/';
const officialNames=[
 "Agder Sparebank",
 "Askim og Spydeberg Sparebank",
 "Aurskog Sparebank",
 "Banking Circle S.A. (Luxembourg) NUF",
 "Berg Sparebank",
 "Bien Sparebank AS",
 "Bjugn Sparebank",
 "BN Bank ASA",
 "BNP Paribas S.A. Norway Branch",
 "Boligbanken ASA",
 "Citibank Europe Public Limited Company NUF",
 "Cultura Sparebank",
 "Danske Bank",
 "DNB Bank ASA",
 "Eika digitalbank AS",
 "Etnedal Sparebank",
 "Evje og Hornnes Sparebank",
 "Fana Sparebank",
 "Flekkefjord Sparebank",
 "Grong Sparebank",
 "Grue Sparebank",
 "Haltdalen Sparebank",
 "Handelsbanken",
 "Haugesund Sparebank",
 "Heder Bank ASA",
 "Hegra Sparebank",
 "Høland og Setskog Sparebank",
 "JBF Sparebank",
 "Jæren Sparebank",
 "KLP Banken AS",
 "Kvinesdal Sparebank",
 "Landkreditt Bank AS",
 "Lillesands Sparebank",
 "Luster Sparebank",
 "Maritime & Merchant Bank ASA",
 "Marker og Eidsberg Sparebank",
 "Melhus Sparebank",
 "Nidaros Sparebank",
 "NOBA Bank Group AB (publ) NUF",
 "Nordea Bank Abp NUF",
 "Nordic Corporate Bank ASA",
 "Nordnet Bank NUF",
 "Næringsbanken ASA",
 "OBOSBanken AS",
 "Odal Sparebank",
 "Opdals Sparebank",
 "Orkla Sparebank",
 "Pareto Bank ASA",
 "Resurs Bank AB",
 "Rogaland Sparebank",
 "Romerike Sparebank",
 "Rørosbanken Røros Sparebank",
 "Santander Consumer Bank AS",
 "Selbu Sparebank",
 "Skagerrak Sparebank",
 "Skandinaviska Enskilda Banken AB",
 "Skudenes og Aakra Sparebank",
 "Skue Sparebank",
 "Sogn Sparebank",
 "Soknedal Sparebank",
 "SpareBank 1 Gudbrandsdal",
 "SpareBank 1 Hallingdal Valdres",
 "SpareBank 1 Helgeland",
 "SpareBank 1 Lom og Skjåk",
 "SpareBank 1 Nordmøre",
 "SpareBank 1 Nord-Norge",
 "SpareBank 1 Ringerike Hadeland",
 "SpareBank 1 SMN",
 "SpareBank 1 Sogn og Fjordane",
 "SpareBank 1 Sør-Norge",
 "SpareBank 1 Østfold Akershus",
 "SpareBank 1 Østlandet",
 "Sparebank 68 grader Nord",
 "Sparebanken Møre",
 "Sparebanken Narvik",
 "Sparebanken Norge",
 "Sparebanken Øst",
 "Spareskillingsbanken",
 "Stadsbygd Sparebank",
 "Storebrand Bank ASA",
 "Strømmen Sparebank",
 "Swedbank Norge",
 "Søgne og Greipstad Sparebank",
 "Telemark Sparebank",
 "Tinde Sparebank",
 "Tolga-Os Sparebank",
 "Trøgstad Sparebank",
 "Trøndelag Sparebank",
 "Valdres Sparebank",
 "Valle Sparebank",
 "Voss Sparebank",
 "Voss Veksel- og Landmandsbank ASA",
 "Ørland Sparebank",
 "Ørskog Sparebank",
 "Aasen Sparebank"
];
const normalizeName=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('nb-NO').replace(/[^a-z0-9]+/g,' ').trim();
const curatedKnownNames=new Set([
  'DNB Bank ASA','Nordea Bank Abp NUF','OBOSBanken AS','Storebrand Bank ASA',
  'Landkreditt Bank AS','KLP Banken AS','SpareBank 1 Østlandet','BN Bank ASA','Sparebanken Norge'
].map(normalizeName));
const slug=value=>normalizeName(value).replace(/\s+/g,'-');
const spareBankLogoNames=Object.freeze({
 'SpareBank 1 Nordmøre':'SpareBank 1 Nordmøre logo.svg',
 'SpareBank 1 Nord-Norge':'SpareBank 1 Nord-Norge logo.svg',
 'SpareBank 1 Ringerike Hadeland':'SpareBank 1 Ringerike Hadeland logo.svg',
 'SpareBank 1 SMN':'SpareBank 1 SMN logo.svg',
 'SpareBank 1 Sør-Norge':'SpareBank 1 Sør-Norge logo.svg',
 'SpareBank 1 Østfold Akershus':'SpareBank 1 Østfold Akershus logo.svg'
});
const commonsLogo=file=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file);
const newBanks=officialNames.filter(name=>!curatedKnownNames.has(normalizeName(name))).map(name=>{
 const initials=name.split(/\s+/).map(part=>part.charAt(0)).slice(0,3).join('').toUpperCase();
 return {id:'nb-'+slug(name),name,legal:name,org:'',domain:'',site:'',
  register:registryURL,region:'Norges Banks bankliste',initials,
  color:'#174b68',source:'norgesbank',sourceUrl:sourceURL,registryVerified:false,
  logo:spareBankLogoNames[name]?commonsLogo(spareBankLogoNames[name]):null};
});
const checkedLogoNames=Object.freeze({
 dnb:'DNB ASA logo.svg',
 bnbank:'BN Bank logo.svg',
 sbanken:'Sbanken.svg',
 sparebank1ost:'SpareBank 1 Østlandet logo.svg',
 sparebankennorge:'Sparebanken Norge 2025.svg'
});
const curatedBanks=curated.map(b=>Object.freeze({
 ...b,
 source:'finanstilsynet',
 sourceUrl:b.register,
 registryVerified:true,
 logo:checkedLogoNames[b.id]?commonsLogo(checkedLogoNames[b.id]):null
}));
const LANEBANKER=Object.freeze([...curatedBanks,...newBanks.map(Object.freeze)]);
if(typeof window!=='undefined')window.LANEBANKER=LANEBANKER;
if(typeof module!=='undefined'&&module.exports)module.exports=LANEBANKER;
