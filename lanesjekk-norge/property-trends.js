(()=>{'use strict';
const $=id=>document.getElementById(id);
const fmt=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:1});
const nok=n=>new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0}).format(Math.round(n));
let indexRows=[],meta=null,periodCount=20,marketController=null;
const chartNS='http://www.w3.org/2000/svg';
function node(name,attributes,root){const el=document.createElementNS(chartNS,name);for(const [key,val]of Object.entries(attributes||{}))el.setAttribute(key,String(val));if(root)root.append(el);return el}
function label(root,content,x,y,attrs={}){const el=node('text',{x,y,fill:'#688394','font-size':11,...attrs},root);el.textContent=content;return el}
function plot(id,rows,key,unit,mode){
 const svg=$(id);if(!svg)return;
 svg.replaceChildren();
 if(rows.length<2){label(svg,'Grafen vises når du har hentet dokumenterte data.',26,97);return}
 const values=rows.map(row=>row[key]).filter(Number.isFinite);
 if(values.length!==rows.length)return;
 const min=Math.min(...values),max=Math.max(...values),gap=Math.max(0.5,(max-min)*.17);
 const low=min-gap,high=max+gap,left=52,right=708,top=22,bottom=204;
 const xx=i=>left+(right-left)*i/(rows.length-1);
 const yy=n=>bottom-(n-low)/(high-low)*(bottom-top);
 const defs=node('defs',{},svg),grad=node('linearGradient',{id:'pv-gradient-'+mode,x1:0,y1:0,x2:0,y2:1},defs);
 node('stop',{offset:'0%','stop-color':mode==='rent'?'#3184c7':'#15a582','stop-opacity':.24},grad);
 node('stop',{offset:'100%','stop-color':mode==='rent'?'#3184c7':'#15a582','stop-opacity':0},grad);
 for(let i=0;i<4;i++){const y=top+(bottom-top)*i/3;node('line',{x1:left,y1:y,x2:right,y2:y,stroke:'#dce9e9','stroke-width':1},svg);label(svg,unit==='NOK'?fmt.format(low+(high-low)*(3-i)/3):fmt.format(low+(high-low)*(3-i)/3),5,y+4)}
 const path=rows.map((row,i)=>(i?'L':'M')+xx(i).toFixed(1)+' '+yy(row[key]).toFixed(1)).join(' ');
 const area=path+' L '+right+' '+bottom+' L '+left+' '+bottom+' Z';
 node('path',{d:area,fill:'url(#pv-gradient-'+mode+')'},svg);
 const curve=node('path',{d:path,fill:'none',stroke:mode==='rent'?'#408ad0':'#0f9a7b','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round',class:'pv-trend-line'},svg);
 if(curve.getTotalLength){const length=curve.getTotalLength();curve.style.strokeDasharray=length;curve.style.strokeDashoffset=length;requestAnimationFrame(()=>{curve.style.strokeDashoffset='0'})}
 const ticks=[0,Math.floor((rows.length-1)/2),rows.length-1];
 for(const i of [...new Set(ticks)])label(svg,rows[i].period||rows[i].label,xx(i),236,{'text-anchor':i===0?'start':i===rows.length-1?'end':'middle'});
 const target=$(id+'-tip');
 rows.forEach((r,i)=>{
  const dot=node('circle',{cx:xx(i),cy:yy(r[key]),r:14,fill:'transparent',tabindex:'0','aria-label':String(r.period||r.label)+': '+fmt.format(r[key])+unit},svg);
  const show=()=>{const highlight=$(id+'-marker');if(highlight){highlight.setAttribute('cx',xx(i));highlight.setAttribute('cy',yy(r[key]));highlight.setAttribute('visibility','visible')}if(target)target.textContent=(r.period||r.label)+' · '+(unit==='NOK'?nok(r[key]):fmt.format(r[key])+' '+unit)};
  dot.addEventListener('pointerenter',show);dot.addEventListener('focus',show);
 });
 const last=rows.at(-1),marker=node('circle',{id:id+'-marker',cx:xx(rows.length-1),cy:yy(last[key]),r:6,fill:'#ffffff',stroke:mode==='rent'?'#408ad0':'#0f9a7b','stroke-width':4},svg);
 if(target)target.textContent=(last.period||last.label)+' · '+(unit==='NOK'?nok(last[key]):fmt.format(last[key])+' '+unit);
}
function renderIndex(){
 if(!indexRows.length)return;
 const rows=indexRows.slice(-periodCount),first=rows[0].index,last=rows.at(-1).index;
 const delta=(last/first-1)*100;const growth=$('pv-trend-growth');
 growth.textContent=(delta>0?'+':'')+fmt.format(delta)+' %';
 growth.dataset.direction=delta<0?'down':'up';
 $('pv-trend-period').textContent=rows[0].period+' → '+rows.at(-1).period;
 $('pv-trend-current').textContent=fmt.format(last);
 $('pv-trend-region').textContent=meta?.region||'SSB';
 $('pv-index-source').textContent='SSB 07221 · '+(meta?.kind||'Bolig')+' · '+(meta?.region||'')+(meta?.regionFallback?' (bred regional/nasjonal referanse)':'')+' · indeks 2015 = 100. Ikke individuell markedsverdi.';
 plot('pv-trend-svg',rows,'index','indeks','index');renderPurchase();
}
function renderPurchase(){
 const source=Number($('pv-known-price').value),period=$('pv-known-period').value;
 const old=indexRows.find(x=>x.period===period),newest=indexRows.at(-1);
 if(!Number.isFinite(source)||source<100000||source>250000000||!old||!newest){$('pv-index-adjusted').textContent='—';$('pv-index-difference').textContent='Legg inn dokumentert kjøpspris og velg perioden den gjelder.';return}
 const estimate=source*newest.index/old.index;
 $('pv-index-adjusted').textContent=nok(estimate);
 $('pv-index-difference').textContent='Indeksjustering: '+(newest.index/old.index*100-100>=0?'+':'')+fmt.format((newest.index/old.index-1)*100)+' % siden '+old.period+'. Kun generell prisutvikling; ikke et takstbeløp.';
}
function fetchIndex(municipality,type){
 if(marketController)marketController.abort();marketController=new AbortController();
 $('pv-trend-status').textContent='Henter boligprisindeks fra SSB …';
 fetch('/api/property-index?municipality='+encodeURIComponent(municipality)+'&type='+encodeURIComponent(type),{signal:marketController.signal})
 .then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||'Kilden svarte ikke');return data})
 .then(data=>{
  indexRows=(data.rows||[]).filter(x=>Number.isFinite(x.index)&&x.index>0);
  if(indexRows.length<2)throw Error('For få indeksobservasjoner');
  meta=data;
  $('pv-known-period').replaceChildren();
  indexRows.forEach(row=>{const o=document.createElement('option');o.value=row.period;o.textContent=row.period;$('pv-known-period').append(o)});
  $('pv-known-period').value=indexRows[Math.max(0,indexRows.length-13)].period;
  $('pv-trend-status').textContent='Bekreftet SSB-statistikk. Endringen viser historisk prisindeks, ikke en prognose.';
  renderIndex()
 }).catch(error=>{if(error.name==='AbortError')return;indexRows=[];$('pv-trend-status').textContent='Boligprisindeksen kunne ikke hentes: '+error.message;plot('pv-trend-svg',[]);$('pv-trend-growth').textContent='—';$('pv-trend-current').textContent='—'});
}
function rentForecast(){
 if(!$('pv-rent-chart'))return;
 const num=id=>Number($(id)?.value),sale=num('rental-price'),rent=num('rental-rent'),equity=num('rental-equity'),
 costs=num('rental-buy-costs')||0,rate=num('rental-interest'),years=num('rental-years'),common=num('rental-common')||0,
 running=num('rental-running')||0,maintenance=num('rental-maintenance')||0,vacancy=num('rental-vacancy')||0;
 if(!(sale>0&&rent>0&&equity>=0&&rate>=0&&rate<=30&&years>0&&vacancy>=0&&vacancy<=12)){
  $('pv-rent-summary').textContent='Fyll inn pris, leie, egenkapital og rente i kalkulatoren under, eller velg «Se eksempel».';
  plot('pv-rent-chart',[]);
  return
 }
 const principal=Math.max(0,sale+costs-equity),monthly=principal===0?0:(rate===0?principal/(years*12):(principal*(rate/1200))/(1-Math.pow(1+rate/1200,-years*12)));
 const inflation=Math.min(10,Math.max(-2,Number($('pv-rent-inflation').value)||0))/100;
 const rows=[];
 for(let yr=0;yr<10;yr++){
  const annualRent=rent*12*Math.max(0,(12-vacancy)/12)*Math.pow(1+inflation,yr);
  const annualExpenses=(common+running+maintenance)*12*Math.pow(1.025,yr);
  const annualDebt=monthly*12;
  rows.push({label:String(new Date().getFullYear()+yr),value:Math.round((annualRent-annualExpenses-annualDebt)/12)});
 }
 plot('pv-rent-chart',rows,'value','NOK','rent');
 $('pv-rent-summary').textContent='Månedlig kontantstrøm før skatt: '+nok(rows[0].value)+' nå → '+nok(rows.at(-1).value)+' i år 10 (scenario). 2,5 % kostnadsvekst årlig, uendret lånerente og '+fmt.format(inflation*100)+' % årlig leievekst.';
}
function guide(id){
 const shell=$(id);if(!shell)return;const stages=[...shell.querySelectorAll('.pv-guide-step')],progress=shell.querySelector('.pv-guide-progress > span'),label=shell.querySelector('.pv-guide-current'),button=null;
 let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,started=performance.now(),elapsed=0,visible=true;
 const observer=new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;if(visible)started=performance.now()-elapsed},{threshold:.05});observer.observe(shell);
 function render(now){
  if(playing&&visible&&!document.documentElement.classList.contains('motion-stopped')){elapsed=(now-started)%12000;const stage=Math.min(stages.length-1,Math.floor(elapsed/(12000/stages.length)));
   stages.forEach((s,i)=>s.classList.toggle('is-active',i===stage));
   if(label)label.textContent=String(stage+1).padStart(2,'0')+' / '+String(stages.length).padStart(2,'0');
   if(progress)progress.style.width=(elapsed/12000*100)+'%';
  }
  if(shell.isConnected)requestAnimationFrame(render)
 }

 shell.querySelector('.pv-guide-replay')?.addEventListener('click',()=>{elapsed=0;started=performance.now();playing=true});
 requestAnimationFrame(render);
}
function boot(){
 if(!$('pv-trend-svg'))return;
 document.addEventListener('property:market',e=>fetchIndex(e.detail.municipality,e.detail.type));
 for(const b of document.querySelectorAll('[data-pv-range]'))b.addEventListener('click',()=>{
  periodCount=Number(b.dataset.pvRange);document.querySelectorAll('[data-pv-range]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderIndex()
 });
 $('pv-known-price').addEventListener('input',renderPurchase);$('pv-known-period').addEventListener('change',renderPurchase);
 $('pv-rent-inflation').addEventListener('change',rentForecast);
 $('utleie').addEventListener('input',e=>{if(e.target.closest('.rental-workspace'))rentForecast()});
 $('rental-example').addEventListener('click',()=>setTimeout(rentForecast,0));
 for(const id of ['pv-valuation-guide','pv-rental-guide'])guide(id);
 rentForecast();
}
document.addEventListener('DOMContentLoaded',boot);
})();