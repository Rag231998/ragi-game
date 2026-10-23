/* Lånesjekk Norge: public CMS view.
 * Everyone reads published settings. Only authenticated admin may write in admin UI.
 * Preview messages are ephemeral, never written to storage. */
(()=>{
'use strict';
const base='https://pryrgwfjniggjlrizenh.supabase.co';
const key='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const SECTIONS=Object.freeze(['quick','hero','stats','workbook','insights']);
const nodes=()=>({quick:document.querySelector('#budsjett > .budget-start-panel'),hero:document.querySelector('#budsjett > .budget-hero'),
stats:document.querySelector('#budsjett > .tool-overview'),workbook:document.querySelector('#budsjett > .budget-workbook'),insights:document.querySelector('#budsjett > .budget-insights-grid')});
const defaults={brand:{name:'LÅNESJEKK NORGE',tagline:'Mer oversikt. Bedre valg.',accent:'#0c8878',logoUrl:''},
budget:{order:['quick','hero','stats','workbook','insights'],visible:{quick:true,hero:true,stats:true,workbook:true,insights:true},title:'Ditt budsjett.',subtitle:'Din økonomiske kontroll.',quickTitle:'Tre steg til økonomisk oversikt'},
investing:{title:'Fond og aksjer – forstå risiko og muligheter'}};
let published=null,preview=false;
function plain(s,max){return typeof s==='string'?s.trim().slice(0,max):''}
function configClean(input){
 const a=input&&typeof input==='object'?input:{},b=a.brand||{},c=a.budget||{},v=c.visible||{};
 const order=[...new Set(Array.isArray(c.order)?c.order.filter(x=>SECTIONS.includes(x)):defaults.budget.order)];
 for(const id of SECTIONS)if(!order.includes(id))order.push(id);
 return {
 brand:{
 name:plain(b.name,70)||defaults.brand.name,tagline:plain(b.tagline,130)||defaults.brand.tagline,
 accent:/^#[0-9a-fA-F]{6}$/.test(b.accent)?b.accent:defaults.brand.accent,
 logoUrl:typeof b.logoUrl==='string'&&/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/site-assets\/[a-z0-9_.-]+$/i.test(b.logoUrl)?b.logoUrl:''
 },
 budget:{order,visible:Object.fromEntries(SECTIONS.map(id=>[id,id==='workbook'?true:v[id]!==false])),
 title:plain(c.title,90)||defaults.budget.title,
 subtitle:plain(c.subtitle,120)||defaults.budget.subtitle,
 quickTitle:plain(c.quickTitle,100)||defaults.budget.quickTitle},
 investing:{title:plain(a.investing?.title,110)||defaults.investing.title}
 };
}
function apply(input){
 const cfg=configClean(input);
 document.documentElement.style.setProperty('--cms-accent',cfg.brand.accent);
 const logo=document.querySelector('.portal-logo');
 if(logo){
  const emblem=logo.querySelector('.logo-emblem');
  if(emblem){
   emblem.replaceChildren();
   if(cfg.brand.logoUrl){const image=document.createElement('img');image.className='cms-custom-logo';
    image.alt='';image.src=cfg.brand.logoUrl;image.referrerPolicy='no-referrer';emblem.append(image);}
   else emblem.textContent='◈';
  }
  const label=logo.querySelector(':scope > span:last-child');
  if(label){label.replaceChildren();label.append(document.createTextNode(cfg.brand.name));
   const small=document.createElement('small');small.textContent=cfg.brand.tagline;label.append(small);}
 }
 const budget=document.getElementById('budsjett');
 if(budget){
  const els=nodes();
  for(const id of cfg.budget.order){const el=els[id];if(el)budget.append(el);}
  for(const id of SECTIONS){if(els[id])els[id].hidden=cfg.budget.visible[id]===false;}
  const h=els.hero?.querySelector('h1');
  if(h){h.replaceChildren(document.createTextNode(cfg.budget.title));const br=document.createElement('br');
    const em=document.createElement('em');em.textContent=cfg.budget.subtitle;h.append(br,em);}
  const quick=els.quick?.querySelector('h2');if(quick)quick.textContent=cfg.budget.quickTitle;
 }
 const heading=document.querySelector('#investering .tool-hero h1');
 if(heading)heading.textContent=cfg.investing.title;
 window.dispatchEvent(new CustomEvent('lanesjekk-cms-rendered',{detail:{preview}}));
}
async function init(){
 apply(defaults);
 if(window.parent!==window){
  window.addEventListener('message',e=>{
   if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='lanesjekk-cms-preview')return;
   preview=true;apply(e.data.config);
  });
 }
 try{
  if(!window.supabase)throw Error('Supabase unavailable');
  const db=window.supabase.createClient(base,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data,error}=await db.from('lanesjekk_site_config').select('config,revision').eq('id',1).maybeSingle();
  if(error)throw error;
  if(data?.config){published=data.config;if(!preview)apply(published)}
 }catch(e){console.warn('Published design settings could not be loaded; using default',e)}
}
window.lanesjekkCms={apply,configClean,defaults,getPublished:()=>published};
document.addEventListener('DOMContentLoaded',init);
})();