/* Public feature guide and release notes. Does not store user inputs or generate data. */
(()=>{'use strict';
const FEATURES=Object.freeze([
 {id:'sjekk',cat:'Lån',title:'Boliglånskalkulator',subtitle:'Se renter, kostnader og effekten av nedbetaling.',how:'Legg inn lånebeløp, rente og løpetid. Sammenlign kostnader og se hvordan endringer i renten påvirker terminbeløpet.',icon:'⌂',keywords:'boliglån rente nedbetaling måned'},
 {id:'billan',cat:'Lån',title:'Billån',subtitle:'Undersøk finansiering av bil.',how:'Angi pris, egenkapital, rente og nedbetalingstid. Se et regneeksempel for billånet.',icon:'▣',keywords:'bil finansiering'},
 {id:'forbrukslan',cat:'Lån',title:'Forbrukslån',subtitle:'Forstå hva usikret kreditt kan koste.',how:'Regn på lånebeløp, rente og løpetid. Sammenlign månedskostnad og samlet rentebelastning.',icon:'▤',keywords:'kreditt forbruk'},
 {id:'banker',cat:'Lån',title:'Bankoversikt',subtitle:'Finn frem til banker og deres egne nettsteder.',how:'Søk etter banken eller filtrer listen. Gå videre til bankens nettsted for oppdaterte vilkår og priser.',icon:'▥',keywords:'banker søk'},
 {id:'budsjett',cat:'Økonomi',title:'Budsjett og månedsplan',subtitle:'Se inntekt, utgifter og økonomisk handlingsrom.',how:'Legg til inntekter og utgifter, organiser postene og undersøk grafer og månedlige scenarier. Budsjettdata kan lagres lokalt i nettleseren.',icon:'▦',keywords:'økonomi lønn skatt utgifter månedsplan'},
 {id:'kvitteringer',cat:'Økonomi',title:'Kvitteringsstudio',subtitle:'Analyser kjøp og forbruk fordelt på varer og kategorier.',how:'Legg inn eller importer kvitteringsinnhold der funksjonen støtter det. Gå gjennom poster, kategorier og analyser mulige sparetiltak.',icon:'▧',keywords:'skann kvittering handleliste mat'},
 {id:'sparing',cat:'Sparing',title:'Sparing og sparekonto',subtitle:'Utforsk sparing, renter og fremtidig saldo.',how:'Skriv inn beløp og spareperiode for å se et beregnet sparescenario. Kontrollér alltid dato og kilder for banksatser.',icon:'◉',keywords:'sparekonto rente bsu'},
 {id:'investering',cat:'Sparing',title:'Fond og aksjer',subtitle:'Lær om risiko, langsiktig sparing og avkastning.',how:'Utforsk beregningene og illustrerte scenarioene. Resultater er eksempler og ikke avkastningsgarantier eller investeringsråd.',icon:'↗',keywords:'fond aksjer aksjesparekonto ips pensjon'},
 {id:'valutakompass',cat:'Sparing',title:'Valutakompass',subtitle:'Regn om beløp og se historiske kurser.',how:'Velg to valutaer, skriv inn et beløp og undersøk oppgitt kursdato. Kurser er ikke garanterte sanntidstilbud.',icon:'¤',keywords:'valuta kurs euro dollar nok'},
 {id:'boligverdi',cat:'Eiendom',title:'Boligverdi',subtitle:'Undersøk et estimat basert på tilgjengelige boligdata.',how:'Søk etter adresse og fyll inn boligopplysninger. Les metode, datakilder og usikkerhet før du bruker estimatet.',icon:'⌂',keywords:'eiendom bolig estimat adresse'},
 {id:'utleieanalyse',cat:'Eiendom',title:'Utleieanalyse',subtitle:'Regn på leieinntekter, kostnader og mulig avkastning.',how:'Legg inn boligverdi, forventet leie og kostnader. Se beregningen som scenario, ikke en garantert markedspris.',icon:'▤',keywords:'utleie leilighet leieinntekter'},
 {id:'akademi',cat:'Læring',title:'Lånesjekk Akademiet',subtitle:'Forstå økonomiske begreper med praktiske øvelser.',how:'Velg tema, arbeid deg gjennom leksjonene og test hva du har lært.',icon:'✦',keywords:'læring kurs quiz skole økonomi'},
 {id:'guider',cat:'Læring',title:'Guider og artikler',subtitle:'Finn bakgrunnskunnskap, råd og metodeforklaringer.',how:'Bla gjennom artikler om lån, sparing og økonomi. Følg kildehenvisningene for detaljer.',icon:'☷',keywords:'artikler hjelp guide forklaring'}
]);
const categories=['Alle','Lån','Økonomi','Sparing','Eiendom','Læring'];
let catalog={headline:'Oppdag alt du kan gjøre',news:[]},category='Alle',tab='tools',search='',lastFocus=null;
const SEEN_KEY='lanesjekk.catalog.read-news.v1';
function readSeen(){
 try{const result=JSON.parse(window.localStorage.getItem(SEEN_KEY)||'[]');return new Set(Array.isArray(result)?result.slice(-100):[])}catch{return new Set()}
}
function unreadCount(){const seen=readSeen();return catalog.news.filter(item=>!seen.has(item.id)).length}
function updateBadge(){
 const badge=$('site-feature-news-count');if(!badge)return;
 const unread=unreadCount();badge.textContent=unread?'Ny '+unread:'';
 badge.hidden=!unread;
}
function markRead(){
 if(window.parent!==window||!catalog.news.length)return;
 try{
  const saved=readSeen();
  for(const item of catalog.news)saved.add(item.id);
  window.localStorage.setItem(SEEN_KEY,JSON.stringify([...saved].slice(-100)));
 }catch{}
 updateBadge();
}
const $=id=>document.getElementById(id);
const root=()=>$('site-feature-dialog');
function node(tag,className,textValue){
 const n=document.createElement(tag);
 if(className)n.className=className;
 if(textValue!==undefined)n.textContent=textValue;
 return n;
}
function searched(item){
 const needle=search.toLocaleLowerCase('nb-NO');
 return !needle||[item.cat,item.title,item.subtitle,item.how,item.keywords].join(' ').toLocaleLowerCase('nb-NO').includes(needle);
}
function openFeature(id){
 const item=FEATURES.find(x=>x.id===id);if(!item)return;
 const area=$('site-feature-detail');area.replaceChildren();
 const back=node('button','fc-back','← Tilbake til oversikten');back.type='button';back.addEventListener('click',()=>{draw();$('site-feature-input')?.focus()});
 const icon=node('div','fc-detail-icon',item.icon),title=node('h3','',item.title),subtitle=node('p','fc-subtitle',item.subtitle);
 const guide=node('section','fc-explainer');guide.append(node('h4','', 'Slik bruker du funksjonen'),node('p','',item.how));
 const link=node('button','fc-go','Åpne '+item.title);link.type='button';link.addEventListener('click',()=>navigate(item.id));
 area.append(back,icon,title,subtitle,guide,link);area.hidden=false;
 $('site-feature-list').hidden=true;$('site-feature-controls').hidden=true;
 area.querySelector('button')?.focus();
}
function navigate(route){
 close();
 if(window.lanesjekkNavigate)window.lanesjekkNavigate(route);
 else window.location.hash='#'+route;
}
function draw(){
 const list=$('site-feature-list');if(!list)return;
 const detail=$('site-feature-detail');detail.hidden=true;
 list.hidden=false;$('site-feature-controls').hidden=false;list.replaceChildren();
 $('site-feature-title').textContent=tab==='news'?'Nyheter og forbedringer':catalog.headline;
 $('site-feature-input').placeholder=tab==='news'?'Søk i nyheter …':'Søk i funksjoner, f.eks. rente eller kvittering …';
 $('site-feature-input').value=search;
 $('site-feature-count').textContent=tab==='news'?'Publiserte oppdateringer':'Alle verktøy og forklaringer';
 $('site-feature-tabs').querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.fcTab===tab)));
 const cats=$('site-feature-categories');cats.replaceChildren();cats.hidden=tab==='news';
 if(tab==='tools'){
  for(const cat of categories){
   const button=node('button','fc-category'+(cat===category?' is-selected':''),cat);button.type='button';
   button.setAttribute('aria-pressed',String(cat===category));button.addEventListener('click',()=>{category=cat;draw()});cats.append(button);
  }
  const shown=FEATURES.filter(x=>(category==='Alle'||category===x.cat)&&searched(x));
  if(!shown.length)list.append(node('p','fc-empty','Ingen funksjoner passet søket.'));
  for(const item of shown){
   const card=node('button','fc-card');card.type='button';card.dataset.featureId=item.id;
   const sign=node('span','fc-card-icon',item.icon),copy=node('span','fc-card-copy'),tag=node('span','fc-card-cat',item.cat);
   copy.append(tag,node('strong','',item.title),node('small','',item.subtitle));
   card.append(sign,copy,node('span','fc-card-arrow','›'));card.addEventListener('click',()=>openFeature(item.id));list.append(card);
  }
 }else{
  const news=(catalog.news||[]).filter(x=>!search||[x.title,x.summary,x.route].join(' ').toLocaleLowerCase('nb-NO').includes(search.toLocaleLowerCase('nb-NO')));
  if(!news.length)list.append(node('p','fc-empty','Det er ingen publiserte nyheter som passer søket. Funksjonene er tilgjengelige i fanen «Alle funksjoner».'));
  for(const item of news){
   const card=node('article','fc-news'),date=node('time','fc-news-date',item.date||'Publisert');
   if(item.date)date.dateTime=item.date;
   const title=node('h3','',item.title),desc=node('p','',item.summary);
   const action=node('button','fc-go','Åpne funksjonen');action.type='button';action.addEventListener('click',()=>navigate(item.route));
   card.append(date,title,desc,action);list.append(card);
  }
 }
}
function open(selectedTab='tools'){
 const dialog=root();if(!dialog)return;
 if(dialog.open){tab=selectedTab;search='';if(tab==='news')markRead();draw();return}
 lastFocus=document.activeElement;tab=selectedTab;search='';category='Alle';if(tab==='news')markRead();draw();
 dialog.showModal();$('site-feature-input')?.focus();
}
function close(){
 const dialog=root();if(dialog?.open)dialog.close();
 if(lastFocus?.isConnected)lastFocus.focus();
}
function setNews(input){
 catalog={
  headline:typeof input?.headline==='string'&&input.headline.trim()?input.headline.slice(0,100):'Oppdag alt du kan gjøre',
  news:(Array.isArray(input?.news)?input.news:[]).filter(x=>x&&typeof x.title==='string'&&x.title.trim()&&FEATURES.some(f=>f.id===x.route||x.route==='topp')).slice(0,12)
 };
 if(root()?.open)draw();
 updateBadge();
}
function init(){
 const dialog=root();if(!dialog)return;
 document.querySelectorAll('[data-open-catalog]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.openCatalog==='news'?'news':'tools')));
 $('site-feature-close')?.addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
 dialog.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus()});
 $('site-feature-tabs')?.addEventListener('click',event=>{
  const btn=event.target.closest('button[data-fc-tab]');if(!btn)return;
  tab=btn.dataset.fcTab;search='';if(tab==='news')markRead();draw();
 });
 $('site-feature-input')?.addEventListener('input',event=>{search=event.target.value;const focus=document.activeElement;draw();if(focus?.id==='site-feature-input')focus.focus()});
}
window.lanesjekkCatalog={setNews,open,getFeatures:()=>FEATURES.map(({id,cat,title,subtitle})=>({id,cat,title,subtitle}))};
document.addEventListener('DOMContentLoaded',init);
})();