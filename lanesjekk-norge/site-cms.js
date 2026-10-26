/* Lånesjekk Norge: public CMS view.
 * Everyone reads published settings. Only authenticated admin may write in admin UI.
 * Preview messages are ephemeral, never written to storage. */
(()=>{
'use strict';
const base='https://pryrgwfjniggjlrizenh.supabase.co';
const key='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const MEDIA_IDS=Object.freeze(['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy','currency']);
const MEDIA_BASE='https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/';
function safeMedia(url,kind){
 if(typeof url!=='string'||!url.startsWith(MEDIA_BASE))return '';
 const filename=url.slice(MEDIA_BASE.length);
 const ok=kind==='video'?/^video\/[a-z0-9_-]+\.(?:mp4|webm)$/i.test(filename):/^poster\/[a-z0-9_-]+\.(?:png|jpg|jpeg|webp)$/i.test(filename);
 return ok?url:'';
}
const SLIDE_IDS=Object.freeze(['loan','budget','receipts','invest','property','currency']);
const SECTIONS=Object.freeze(['quick','hero','stats','workbook','insights']);
const CARD_IDS=Object.freeze(['sjekk','budsjett','kvitteringer','sparing','utleie','billan','forbrukslan','akademi','banker','offisielle-renter','bsu','ask','ips','innskuddsgaranti']);
const RELEASE_ROUTES=new Set(['topp','sjekk','billan','forbrukslan','banker','budsjett','kvitteringer','sparing','investering','valutakompass','boligverdi','utleieanalyse','akademi','guider']);
const nodes=()=>({quick:document.querySelector('#budsjett > .budget-start-panel'),hero:document.querySelector('#budsjett > .budget-hero'),
stats:document.querySelector('#budsjett > .tool-overview'),workbook:document.querySelector('#budsjett > .budget-workbook'),insights:document.querySelector('#budsjett > .budget-insights-grid')});
const defaults={introductions:window.LNIntroConfig.normalize(),animations:{autoplay:true,valuation:true,rental:true,receipts:true},brand:{name:'LÅNESJEKK NORGE',tagline:'Mer oversikt. Bedre valg.',theme:'light',accent:'#0c8878',logoUrl:'',heroVisual:true,heroMotion:true},
budget:{order:['quick','hero','stats','workbook','insights'],visible:{quick:true,hero:true,stats:true,workbook:true,insights:true},title:'Ditt budsjett.',subtitle:'Din økonomiske kontroll.',quickTitle:'Tre steg til økonomisk oversikt'},
investing:{title:'Fond og aksjer – forstå risiko og muligheter'},catalog:{headline:'Oppdag alt du kan gjøre',news:[]}};
let published=null,preview=false;
const THEME_STORAGE_KEY='lanesjekk.public.theme.v1';
const themeOptions=['site','light','dark'];
let visitorTheme='site';
try{
 const saved=window.localStorage.getItem(THEME_STORAGE_KEY);
 if(themeOptions.includes(saved))visitorTheme=saved;
}catch{}
const darkPreference=window.matchMedia?.('(prefers-color-scheme: dark)');
function effectiveDark(siteTheme){
 const selected=preview?'site':visitorTheme;
 const mode=selected==='site'?siteTheme:selected;
 return mode==='dark'||(mode==='auto'&&Boolean(darkPreference?.matches));
}
function updateThemeControls(){
 const mode=document.documentElement.dataset.activeTheme||'light';
 const quick=document.getElementById('site-theme-quick');
 if(quick){
  const checked=mode==='dark';
  quick.setAttribute('aria-checked',String(checked));
  quick.setAttribute('aria-label',checked?'Mørk modus på. Slå av mørk modus':'Mørk modus av. Slå på mørk modus');
  quick.title=checked?'Slå av mørk modus':'Slå på mørk modus';
  const icon=document.getElementById('site-theme-icon');
  if(icon){icon.textContent=checked?'☀':'☾';icon.title=checked?'Bytt til lys modus':'Bytt til mørk modus';}
 }
}
function applyTheme(siteTheme=document.documentElement.dataset.cmsTheme||'light'){
 const normalized=['dark','auto','light'].includes(siteTheme)?siteTheme:'light';
 const dark=effectiveDark(normalized);
 document.documentElement.dataset.cmsTheme=normalized;
 document.documentElement.dataset.activeTheme=dark?'dark':'light';
 document.documentElement.classList.toggle('cms-dark',dark);
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#101e2d':'#101c35');
 updateThemeControls();
}
function setVisitorTheme(choice){
 if(!themeOptions.includes(choice))return;
 visitorTheme=choice;
 try{if(choice==='site')window.localStorage.removeItem(THEME_STORAGE_KEY);else window.localStorage.setItem(THEME_STORAGE_KEY,choice)}catch{}
 applyTheme();

}
function initThemeControls(){
 // One control only. Follow the site's published/system preference by default,
 // then persist an explicit visitor choice only when the switch is activated.
 const quick=document.getElementById('site-theme-quick');
 const icon=document.getElementById('site-theme-icon');
 icon?.addEventListener('click',()=>quick?.click());
 quick?.addEventListener('click',()=>{
  const dark=document.documentElement.dataset.activeTheme==='dark';
  setVisitorTheme(dark?'light':'dark');
 });
 updateThemeControls();
}

function plain(s,max){return typeof s==='string'?s.trim().slice(0,max):''}
function configClean(input){
 const a=input&&typeof input==='object'?input:{},b=a.brand||{},c=a.budget||{},v=c.visible||{};
 const order=[...new Set(Array.isArray(c.order)?c.order.filter(x=>SECTIONS.includes(x)):defaults.budget.order)];
 const inputCardOrder=Array.isArray(a.cards?.order)?a.cards.order.filter(id=>CARD_IDS.includes(id)):CARD_IDS;
 for(const id of SECTIONS)if(!order.includes(id))order.push(id);
 return {
 introductions:window.LNIntroConfig.normalize(a.introductions),
 media:{slots:Object.fromEntries(MEDIA_IDS.map(id=>{const x=a.media?.slots?.[id]||{};return [id,{enabled:x.enabled!==false,videoUrl:safeMedia(x.videoUrl,'video'),posterUrl:safeMedia(x.posterUrl,'image'),title:plain(x.title,90),description:plain(x.description,210),fit:x.fit==='contain'?'contain':'cover',loop:x.loop!==false,placement:['before','after-intro','bottom'].includes(x.placement)?x.placement:'after-intro'}]}))},
 animations:{autoplay:a.animations?.autoplay!==false,valuation:a.animations?.valuation!==false,rental:a.animations?.rental!==false,receipts:a.animations?.receipts!==false},
 slides:{visible:a.slides?.visible!==false,order:[...new Set([...(Array.isArray(a.slides?.order)?a.slides.order.filter(id=>SLIDE_IDS.includes(id)):[]),...SLIDE_IDS])],items:Object.fromEntries(SLIDE_IDS.map(id=>[id,{title:plain(a.slides?.items?.[id]?.title,95),description:plain(a.slides?.items?.[id]?.description,220),enabled:a.slides?.items?.[id]?.enabled!==false}]))},
 brand:{
 name:plain(b.name,70)||defaults.brand.name,tagline:plain(b.tagline,130)||defaults.brand.tagline,
 theme:['light','dark','auto'].includes(b.theme)?b.theme:'light',accent:/^#[0-9a-fA-F]{6}$/.test(b.accent)?b.accent:defaults.brand.accent,
 heroVisual:b.heroVisual!==false,heroMotion:b.heroMotion!==false,
 logoUrl:typeof b.logoUrl==='string'&&/^https:\/\/pryrgwfjniggjlrizenh\.supabase\.co\/storage\/v1\/object\/public\/site-assets\/[a-z0-9_.-]+$/i.test(b.logoUrl)?b.logoUrl:''
 },
 budget:{order,visible:Object.fromEntries(SECTIONS.map(id=>[id,id==='workbook'?true:v[id]!==false])),
 title:plain(c.title,90)||defaults.budget.title,
 subtitle:plain(c.subtitle,120)||defaults.budget.subtitle,
 quickTitle:plain(c.quickTitle,100)||defaults.budget.quickTitle},
 investing:{title:plain(a.investing?.title,110)||defaults.investing.title},
 catalog:{
  headline:plain(a.catalog?.headline,100)||defaults.catalog.headline,
  news:(Array.isArray(a.catalog?.news)?a.catalog.news:[]).filter(item=>item&&typeof item==='object').slice(0,12).map((item,index)=>({
    id:plain(item.id,50)||'nyhet-'+index,title:plain(item.title,110),
    summary:plain(item.summary,500),route:RELEASE_ROUTES.has(item.route)?item.route:'topp',
    date:/^\d{4}-\d{2}-\d{2}$/.test(item.date||'')?item.date:''
  })).filter(item=>item.title),
  tools:(Array.isArray(a.catalog?.tools)?a.catalog.tools:[]).filter(item=>item&&typeof item==='object').slice(0,18).map((item,index)=>({
   id:/^custom-[a-z0-9-]{5,43}$/i.test(String(item.id||''))?item.id:'custom-'+index,
   route:RELEASE_ROUTES.has(item.route)?item.route:'budsjett',
   cat:['Lån','Økonomi','Sparing','Eiendom','Læring'].includes(item.cat)?item.cat:'Økonomi',
   title:plain(item.title,85),subtitle:plain(item.subtitle,170),
   how:plain(item.how,450),icon:plain(item.icon,8)||'✦',enabled:item.enabled!==false
  }))
 },
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
 applyTheme(cfg.brand.theme);
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
  // The rental landing card targets the actual rental tab but retains its Studio object ID.
  if(found.utleieanalyse&&!found.utleie)found.utleie=found.utleieanalyse;
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
  // New administrator-curated entries always link to an existing, real tool.
  // Incomplete entries never appear publicly, including before draft approval.
  grid.querySelectorAll('.cms-custom-tool').forEach(node=>node.remove());
  for(const entry of cfg.catalog.tools){
   if(!entry.enabled||!entry.title||!entry.subtitle||!entry.how)continue;
   const card=document.createElement('a');
   card.className='home-tool cms-custom-tool';
   card.href='#'+entry.route;
   card.dataset.cmsCustomTool=entry.id;
   card.setAttribute('aria-label','Åpne '+entry.title);
   const symbol=document.createElement('span');symbol.className='home-tool-art';symbol.textContent=entry.icon;
   const cat=document.createElement('span');cat.className='home-tool-category';cat.textContent=entry.cat.toUpperCase();
   const title=document.createElement('strong');title.textContent=entry.title;
   const hint=document.createElement('small');hint.textContent=entry.subtitle;
   const arrow=document.createElement('span');arrow.className='home-tool-arrow';arrow.textContent='Åpne '+entry.title+' ↗';
   card.append(symbol,cat,title,hint,arrow);grid.append(card);
  }
 }
 const heading=document.querySelector('#investering .tool-hero h1');
 if(heading)heading.textContent=cfg.investing.title;
 window.lanesjekkCatalog?.setNews(cfg.catalog);
 window.dispatchEvent(new CustomEvent('lanesjekk-intro-config',{detail:{...cfg.introductions,preview}}));
 window.dispatchEvent(new CustomEvent('lanesjekk-cms-rendered',{detail:{preview}}));
}
let lastPublicRevision=0;
function liveStatus(state){
 const node=document.getElementById('site-live-status');
 if(!node)return;
 node.dataset.state=state;
 const labels={connected:'Nettstedet synkroniseres automatisk',connecting:'Kobler til nettstedsoppdateringer …',fallback:'Oppdateringer kontrolleres automatisk',offline:'Kunne ikke kontrollere oppdateringer'};
 node.textContent=labels[state]||labels.fallback;
 // This describes CMS publishing, NEVER bank quotes, property prices or external data.
 node.title='Status gjelder bare publiserte nettstedinnstillinger, ikke live-renter, finansielle data eller boligpriser.';
}
async function init(){
 initThemeControls();
 apply(defaults);
 if(window.parent!==window){
  window.addEventListener('message',e=>{
   if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='lanesjekk-cms-preview')return;
   preview=true;apply(e.data.config);
  });
 }
 if(!window.supabase){liveStatus('offline');console.warn('Supabase unavailable');return}
 const db=window.supabase.createClient(base,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 let refreshing=false,refreshQueued=false;
 async function refreshPublished(){
  if(refreshing){refreshQueued=true;return}
  refreshing=true;
  try{
   const {data,error}=await db.from('lanesjekk_site_config').select('config,revision').eq('id',1).maybeSingle();
   if(error)throw error;
   if(data?.config){
    const incoming=Number(data.revision)||0;
    const changed=!published||incoming!==lastPublicRevision;
    published=data.config;lastPublicRevision=incoming;
    if(changed&&!preview){
     apply(published);
     window.dispatchEvent(new CustomEvent('lanesjekk-published-updated',{detail:{revision:incoming}}));
    }
   }
  }catch(error){liveStatus('offline');console.warn('Published configuration refresh failed',error)}
  finally{
   refreshing=false;
   if(refreshQueued){refreshQueued=false;void refreshPublished()}
  }
 }
 await refreshPublished();
 liveStatus('connecting');
 // Database publication delivers a low-latency signal. We fetch again under RLS, rather than trusting raw payloads.
 try{
  db.channel('lanesjekk-public-config-updates')
   .on('postgres_changes',{event:'UPDATE',schema:'public',table:'lanesjekk_site_config',filter:'id=eq.1'},()=>{void refreshPublished()})
   .subscribe(status=>{
    if(status==='SUBSCRIBED')liveStatus('connected');
    else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED')liveStatus('fallback');
   });
 }catch(error){liveStatus('fallback');console.warn('Realtime subscription unavailable',error)}
 // Loss of WebSocket connection must never leave old settings indefinitely.
 setInterval(()=>{if(!document.hidden)void refreshPublished()},60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshPublished()});
}
darkPreference?.addEventListener?.('change',()=>applyTheme());
window.lanesjekkCms={apply,configClean,defaults,getPublished:()=>published};
window.lanesjekkTheme={setChoice:setVisitorTheme,getChoice:()=>visitorTheme,applyTheme,active:()=>document.documentElement.dataset.activeTheme};
document.addEventListener('DOMContentLoaded',init);
})();