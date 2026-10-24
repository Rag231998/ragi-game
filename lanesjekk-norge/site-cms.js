/* Lånesjekk Norge: public CMS view.
 * Everyone reads published settings. Only authenticated admin may write in admin UI.
 * Preview messages are ephemeral, never written to storage. */
(()=>{
'use strict';
const base='https://pryrgwfjniggjlrizenh.supabase.co';
const key='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const MEDIA_IDS=Object.freeze(['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy']);
const MEDIA_BASE='https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/';
function safeMedia(url,kind){
 if(typeof url!=='string'||!url.startsWith(MEDIA_BASE))return '';
 const filename=url.slice(MEDIA_BASE.length);
 const ok=kind==='video'?/^video\/[a-z0-9_-]+\.(?:mp4|webm)$/i.test(filename):/^poster\/[a-z0-9_-]+\.(?:png|jpg|jpeg|webp)$/i.test(filename);
 return ok?url:'';
}
const SLIDE_IDS=Object.freeze(['loan','budget','receipts','invest','property']);
const SECTIONS=Object.freeze(['quick','hero','stats','workbook','insights']);
const CARD_IDS=Object.freeze(['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti']);
const nodes=()=>({quick:document.querySelector('#budsjett > .budget-start-panel'),hero:document.querySelector('#budsjett > .budget-hero'),
stats:document.querySelector('#budsjett > .tool-overview'),workbook:document.querySelector('#budsjett > .budget-workbook'),insights:document.querySelector('#budsjett > .budget-insights-grid')});
const defaults={animations:{autoplay:true,valuation:true,rental:true,receipts:true},brand:{name:'LÅNESJEKK NORGE',tagline:'Mer oversikt. Bedre valg.',accent:'#0c8878',logoUrl:'',heroVisual:true,heroMotion:true},
budget:{order:['quick','hero','stats','workbook','insights'],visible:{quick:true,hero:true,stats:true,workbook:true,insights:true},title:'Ditt budsjett.',subtitle:'Din økonomiske kontroll.',quickTitle:'Tre steg til økonomisk oversikt'},
investing:{title:'Fond og aksjer – forstå risiko og muligheter'}};
let published=null,preview=false;
function plain(s,max){return typeof s==='string'?s.trim().slice(0,max):''}
function configClean(input){
 const a=input&&typeof input==='object'?input:{},b=a.brand||{},c=a.budget||{},v=c.visible||{};
 const order=[...new Set(Array.isArray(c.order)?c.order.filter(x=>SECTIONS.includes(x)):defaults.budget.order)];
 const inputCardOrder=Array.isArray(a.cards?.order)?a.cards.order.filter(id=>CARD_IDS.includes(id)):CARD_IDS;
 for(const id of SECTIONS)if(!order.includes(id))order.push(id);
 return {
 media:{slots:Object.fromEntries(MEDIA_IDS.map(id=>{const x=a.media?.slots?.[id]||{};return [id,{enabled:x.enabled!==false,videoUrl:safeMedia(x.videoUrl,'video'),posterUrl:safeMedia(x.posterUrl,'image'),title:plain(x.title,90),description:plain(x.description,210),fit:x.fit==='contain'?'contain':'cover',loop:x.loop!==false}]}))},
 animations:{autoplay:a.animations?.autoplay!==false,valuation:a.animations?.valuation!==false,rental:a.animations?.rental!==false,receipts:a.animations?.receipts!==false},
 slides:{visible:a.slides?.visible!==false,order:[...new Set([...(Array.isArray(a.slides?.order)?a.slides.order.filter(id=>SLIDE_IDS.includes(id)):[]),...SLIDE_IDS])],items:Object.fromEntries(SLIDE_IDS.map(id=>[id,{title:plain(a.slides?.items?.[id]?.title,95),description:plain(a.slides?.items?.[id]?.description,220),enabled:a.slides?.items?.[id]?.enabled!==false}]))},
 brand:{
 name:plain(b.name,70)||defaults.brand.name,tagline:plain(b.tagline,130)||defaults.brand.tagline,
 accent:/^#[0-9a-fA-F]{6}$/.test(b.accent)?b.accent:defaults.brand.accent,
 heroVisual:b.heroVisual!==false,heroMotion:b.heroMotion!==false,
 logoUrl:typeof b.logoUrl==='string'&&/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/site-assets\/[a-z0-9_.-]+$/i.test(b.logoUrl)?b.logoUrl:''
 },
 budget:{order,visible:Object.fromEntries(SECTIONS.map(id=>[id,id==='workbook'?true:v[id]!==false])),
 title:plain(c.title,90)||defaults.budget.title,
 subtitle:plain(c.subtitle,120)||defaults.budget.subtitle,
 quickTitle:plain(c.quickTitle,100)||defaults.budget.quickTitle},
 investing:{title:plain(a.investing?.title,110)||defaults.investing.title},
 cards:{order:[...new Set([...inputCardOrder,...CARD_IDS])],
 appearance:Object.fromEntries(CARD_IDS.map(id=>{
 const x=a.cards?.appearance?.[id]||{};
 return [id,{title:plain(x.title,85),description:plain(x.description,200),
 icon:plain(x.icon,12),tone:['mint','blue','violet','peach'].includes(x.tone)?x.tone:'mint',
 visible:x.visible!==false,
 imageUrl:typeof x.imageUrl==='string'&&/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/site-assets\/[a-z0-9_.-]+$/i.test(x.imageUrl)?x.imageUrl:''}];
 })) }
 };
}
function apply(input){
 const cfg=configClean(input);
 const demoNodes={valuation:document.getElementById('pv-valuation-guide'),rental:document.getElementById('pv-rental-guide'),receipts:document.querySelector('#kvitteringer .receipt-tour')};
 for(const [key,node] of Object.entries(demoNodes))if(node)node.hidden=!cfg.animations[key];
 document.documentElement.classList.toggle('cms-stop-demo-motion',!cfg.animations.autoplay);
 window.lanesjekkSiteMedia?.apply(cfg.media,cfg.animations);
 const showcase=document.getElementById('loan-showcase');
 if(showcase){showcase.hidden=!cfg.slides.visible;const holder=showcase.querySelector('.sc-slides');
  for(const id of cfg.slides.order){const slide=holder?.querySelector('.sc-'+id);if(!slide)continue;const settings=cfg.slides.items[id];slide.dataset.cmsEnabled=String(settings.enabled);slide.hidden=!settings.enabled;const heading=slide.querySelector('h1,h2'),description=slide.querySelector('.sc-copy p');if(settings.title&&heading)heading.textContent=settings.title;if(settings.description&&description)description.textContent=settings.description;holder.append(slide)}
  window.dispatchEvent(new CustomEvent('lanesjekk-slides-config',{detail:cfg.slides}));
 }
 document.documentElement.style.setProperty('--cms-accent',cfg.brand.accent);
 document.documentElement.classList.toggle('cms-hide-hero-visual',cfg.brand.heroVisual===false);
 document.documentElement.classList.toggle('cms-pause-hero-motion',cfg.brand.heroMotion===false);
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
 const grid=document.querySelector('.home-tool-grid');
 if(grid){
  const found=Object.fromEntries([...grid.querySelectorAll('a.home-tool[href^="#"]')].map(a=>[a.getAttribute('href').slice(1),a]));
  for(const id of cfg.cards.order){
   const card=found[id];if(!card)continue;
   const appearance=cfg.cards.appearance[id];
   card.hidden=appearance.visible===false;
   card.dataset.cmsTone=appearance.tone;
   const strong=card.querySelector('strong'),small=card.querySelector('small'),art=card.querySelector('.home-tool-art');
   if(strong&&appearance.title)strong.textContent=appearance.title;
   if(small&&appearance.description)small.textContent=appearance.description;
   if(art){
    if(appearance.imageUrl){
     art.replaceChildren();const img=document.createElement('img');img.src=appearance.imageUrl;img.alt='';
     img.loading='lazy';img.style.cssText='width:52px;height:52px;max-width:100%;object-fit:contain';art.append(img);
    }else if(appearance.icon){art.textContent=appearance.icon}
   }
   grid.append(card);
  }
  for(const id of CARD_IDS)if(!cfg.cards.order.includes(id)&&found[id])grid.append(found[id]);
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