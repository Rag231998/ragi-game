/* Shared non-privileged introduction schema. Changes take effect only after Studio Publish. */
(()=>{'use strict';
const DEFINITIONS=Object.freeze([
 {id:'history',name:'Chatbot – samtalehistorikk',target:'#ln-chat-list',title:'Nå kan du finne tilbake til samtalene dine',body:'Du kan åpne tidligere samtaler og fortsette der du slapp. Lagring av samtaler er frivillig og må aktiveres av deg i samtaleoversikten. Uten lagring beholdes ikke historikken etter et nytt besøk.',enabled:true},
 {id:'budget',name:'Budsjett',target:'#budget-add-income',title:'Budsjettet har fått nye muligheter',body:'Registrer inntekter og utgifter, og se hva du har til overs hver måned. Du kan redigere postene når som helst.',enabled:false},
 {id:'reports',name:'PDF og budsjettrapporter',target:'#ln-report-open',title:'Lag din egen budsjettrapport',body:'Velg hvilke opplysninger som skal være med, forhåndsvis resultatet og last ned eller del rapporten. Kontroller innholdet før du deler.',enabled:false},
 {id:'receipts',name:'Kvitteringsstudio',target:'a[href="#kvitteringer"]',title:'Utforsk Kvitteringsstudio',body:'Registrer og analyser kjøpene dine, og få oversikt over forbruket fordelt på kategorier.',enabled:false},
 {id:'investments',name:'Fond og aksjer',target:'a[href="#investering"]',title:'Lær mer om fond og aksjer',body:'Bruk beregningene som illustrasjoner. Investeringer innebærer risiko og avkastning kan variere.',enabled:false},
 {id:'voice',name:'Taleassistent',target:'#ln-voice-start',title:'Nå kan du bruke taleassistenten',body:'Du kan stille spørsmål muntlig eller skriftlig. Direkte talegjenkjenning avhenger av nettleseren. Valgfri AI-tale innebærer at lyd kan behandles hos en ekstern leverandør.',enabled:false},
 {id:'valuation',name:'Boligestimat',target:'a[href="#boligverdi"]',title:'Forstå ditt boligestimat',body:'Estimater bygger på tilgjengelige data og er ikke en garanti for faktisk salgspris.',enabled:false}
]);
function normalize(input){
 const src=input&&typeof input==='object'?input:{},raw=src.items&&typeof src.items==='object'?src.items:{};
 return {historyEnabled:src.historyEnabled===true,
 items:Object.fromEntries(DEFINITIONS.map(meta=>{
  const v=raw[meta.id]&&typeof raw[meta.id]==='object'?raw[meta.id]:{};
  return[meta.id,{
   enabled:typeof v.enabled==='boolean'?v.enabled:meta.enabled,
   highlight:v.highlight!==false,requireAck:v.requireAck!==false,
   title:String(v.title||meta.title).trim().slice(0,110)||meta.title,
   body:String(v.body||meta.body).trim().slice(0,650)||meta.body,
   version:Number.isInteger(v.version)&&v.version>=1&&v.version<=9999?v.version:1
  }];
 }))};
}
window.LNIntroConfig=Object.freeze({definitions:DEFINITIONS,normalize});
})();