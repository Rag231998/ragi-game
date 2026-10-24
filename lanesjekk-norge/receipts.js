/* Kvitteringsstudio. Scan in browser; opt-in receipt-only localStorage; no image upload. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),NOK=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:2,minimumFractionDigits:0});
const C=[['Mat og dagligvarer','#118672'],['Pant og retur','#369a7d'],['Snacks og godteri','#ecae55'],['Drikke','#44a6b6'],['Hus og hjem','#758bc0'],['Elektronikk','#9277bd'],['Klær og sko','#e68ca9'],['Transport','#46789d'],['Helse og pleie','#90af69'],['Restaurant og kafé','#af8057'],['Annet','#8e9da9']];
const KEY='lanesjekk_receipts_v1';let items=[],scanTotal=null,image=null,imageUrl=null,busy=false;
const el=(tag,t,cls)=>{const x=document.createElement(tag);if(t!==undefined)x.textContent=String(t);if(cls)x.className=cls;return x};
const money=n=>Number.isFinite(n)?NOK.format(Math.round(n*100)/100):'–';
const date=()=>new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
function price(v){const s=String(v??'').replace(/[\u00a0\s]|kr/gi,'').replace('−','-').replace(',','.');return /^[+\-]?\d{1,8}(?:\.\d{1,2})?$/.test(s)?Number(s):NaN}
function category(s){
 s=s.toLowerCase();
 if(/\bpant\b|returpant|panteflaske/.test(s))return 'Pant og retur';
 if(/sjokolade|chips|snacks|godter|kjek|popcorn|iskrem|smågodt/.test(s))return 'Snacks og godteri';
 if(/kaffe|brus|juice|cola|energi|drikke|øl|vann|fanta/.test(s))return 'Drikke';
 if(/tv\b|mobil|skjerm|data|hodetelefon|airpod|usb|kabel|lader|batteri/.test(s))return 'Elektronikk';
 if(/jakke|bukse|sko\b|genser|skjorte|kjole|t.skjorte|sokker/.test(s))return 'Klær og sko';
 if(/krem|tann|såpe|sjampo|shampoo|vitamin|apotek|medisin/.test(s))return 'Helse og pleie';
 if(/rengjør|vaskemiddel|toalettpapir|serviett|lyspære|rullepapir/.test(s))return 'Hus og hjem';
 if(/drivstoff|bensin|diesel|billett|parkering/.test(s))return 'Transport';
 if(/pizza|kebab|restaurant|burger|takeaway|cafe|kafé/.test(s))return 'Restaurant og kafé';
 if(/melk|brød|ost|egg|fisk|laks|kylling|kjøtt|ris\b|pasta|smør|banan|eple|frukt|yoghurt|potet/.test(s))return 'Mat og dagligvarer';
 return 'Annet';
}
const EXCLUDED=/^(?:kvittering|sum\b|sum varer|totalt?|beløp|å betale|betalt|kort|visa|mastercard|bank(?:axept)?\b|mva\b|moms|kontant|herav|org|terminal|betalingsmiddel|kasse|ordre|transaksjon|takk for handelen|av dette)/i;
function parseText(raw){
 const rows=String(raw).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);let total=null,merchant='';
 const next=[];
 for(const [index,line] of rows.entries()){
  if(index<6&&!merchant&&/rema\s*1000|kiwi|coop|extra|meny|spar\b|obs\b|joker|bunnpris|europris|clas ohlson|elkjøp|power\b|komplett/i.test(line))merchant=line.slice(0,90);
  const found=line.match(/([−+\-]?\s*(?:\d{1,3}(?:[ .]\d{3})+|\d{1,7})[,.]\d{1,2})\s*(?:kr)?\s*$/i);
  if(!found)continue;
  const amount=price(found[1]);if(!Number.isFinite(amount)||Math.abs(amount)>100000)continue;
  if(/^(?:sum\b|totalt?|beløp|å betale)/i.test(line)){total=amount;continue}
  if(EXCLUDED.test(line)||/\b(?:grunnlag|mva\s*%|kortinnehaverens|referanse|godkjent|autorisert|kredit|debet)\b/i.test(line)||/^(?:\d{1,2}[,.]\d{2}\s+){2,}/.test(line))continue;
  const name=line.slice(0,found.index).replace(/[.·:|\s_\-]+$/,'').trim();
  if(name.length<2||/^\d{3,}$/.test(name))continue;
  const discount=/rabatt|avslag|kupong|prisavslag/i.test(name);
  const qtyPattern=name.match(/(?:^|\s)(\d{1,3})\s*[x×]\s*(?=\S)/i)||name.match(/(?:^|\s)[x×]\s*(\d{1,3})(?=\s|$)/i);
  const qty=qtyPattern?Math.max(1,Math.min(999,Number(qtyPattern[1]))):1;
  const cleanName=name.replace(/(?:^|\s)\d{1,3}\s*[x×]\s*/i,' ').replace(/(?:^|\s)[x×]\s*\d{1,3}(?=\s|$)/i,' ').trim()||name;
  const lineAmount=discount&&amount>0?-amount:amount;
  next.push({name:cleanName.slice(0,90),category:discount?'Annet':category(cleanName),quantity:qty,unitPrice:Math.round(lineAmount/qty*100)/100,amount:lineAmount});
 }
 return {items:next.slice(0,160),total,merchant};
}
const round2=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
function normalize(item){const q=Math.max(1,Math.min(999,Math.round(Number(item.quantity)||1)));item.quantity=q;if(!Number.isFinite(Number(item.unitPrice)))item.unitPrice=round2(Number(item.amount||0)/q);item.amount=round2(item.unitPrice*q);return item}
function stats(){
 const valid=items.map(normalize).filter(x=>Number.isFinite(x.amount)),total=valid.reduce((s,x)=>s+x.amount,0),map=new Map();
 for(const row of valid)map.set(row.category,(map.get(row.category)||0)+row.amount);
 const cats=[...map].filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 return {total,valid:valid.length,cats};
}
function updateWhatIf(){
 const s=stats(),cat=$('receipt-whatif-category').value||s.cats[0]?.[0],amount=s.cats.find(x=>x[0]===cat)?.[1]||0;
 const percent=Number($('receipt-whatif-range').value)||0,frequency=Math.max(1,Math.min(31,Number($('receipt-frequency').value)||1));
 const perTrip=amount*percent/100,annual=perTrip*frequency*12;
 $('receipt-whatif-percent').textContent=percent+' %';
 $('receipt-whatif-trip').textContent=money(perTrip)+' / tur';$('receipt-whatif-annual').textContent=money(annual);
 $('receipt-metric-whatif').textContent=money(perTrip);$('receipt-metric-year').textContent=money(annual);
 const goal=$('receipt-goal').value.trim()||'sparemålet ditt';
 $('receipt-insight').textContent=amount>0?'Hvis du frivillig reduserte '+cat.toLowerCase()+' med '+money(perTrip)+' per lignende handletur, kunne du prioritert '+money(annual)+' i året til «'+goal+'». Det er et regneeksempel, ikke dokumentert sparing eller en vurdering av kjøpene dine.':
 'Skann eller legg inn en kvittering for å utforske et mulig alternativ til noen av kjøpene.';
}
function refresh(){
 const s=stats(),sum=s.total;$('receipt-sum').textContent=money(sum);$('receipt-count').textContent=String(items.reduce((n,i)=>n+(Number(i.quantity)||1),0));
 const delta=scanTotal===null?null:Math.round((sum-scanTotal)*100)/100;
 $('receipt-check').textContent=delta===null?'Se over varene':Math.abs(delta)<=.05?'✓ Stemmer':'Må sjekkes';
 const check=$('receipt-reconcile');check.classList.toggle('issue',delta!==null&&Math.abs(delta)>.05);
 check.textContent=delta===null?'Ingen gjenkjent totalsum – kontroller varelinjene.':
 Math.abs(delta)<=.05?'Varesummen stemmer med kvitteringens totalsum '+money(scanTotal)+'.':
 'Kontroller totalsummen: varelinjene er '+money(sum)+', mens kvitteringen viser '+money(scanTotal)+'. Avvik: '+money(Math.abs(delta))+'.';
 $('receipt-save').disabled=!items.length;
 $('receipt-metric-total').textContent=money(sum);$('receipt-metric-top').textContent=s.cats[0]?.[0]||'–';
 const categoriesTotal=s.cats.reduce((a,b)=>a+b[1],0),donut=$('receipt-donut'),legend=$('receipt-legend'),bars=$('receipt-bars'),parts=[];
 legend.replaceChildren();bars.replaceChildren();
 let offset=0;
 for(const [cat,value] of s.cats){
  const share=categoriesTotal?100*value/categoriesTotal:0,color=C.find(x=>x[0]===cat)?.[1]||'#9ba8ad';
  parts.push(color+' '+offset+'% '+(offset+share)+'%');offset+=share;
  const row=el('div',undefined,'legend-row'),swatch=el('span',undefined,'legend-swatch');swatch.style.background=color;
  row.append(swatch,el('span',cat,'legend-label'),el('strong',money(value),'legend-value'));legend.append(row);
  const line=el('div'),meta=el('div',undefined,'receipt-bar-meta');meta.append(el('span',cat),el('strong',money(value)));
  const track=el('div',undefined,'receipt-bar-track'),fill=el('span');fill.style.width=share+'%';fill.style.background=color;
  track.append(fill);line.append(meta,track);bars.append(line);
 }
 if(!s.cats.length){legend.append(el('p','Ingen varer ennå.'));bars.append(el('p','Kategoriene vises her.'))}
 donut.style.background=parts.length?'conic-gradient('+parts.join(',')+')':'#e9eff1';
 donut.setAttribute('aria-label',s.cats.map(x=>x[0]+': '+money(x[1])).join(', ')||'Ingen forbruk');
 $('receipt-donut-center').textContent=money(sum);
 const choice=$('receipt-whatif-category'),selected=choice.value;choice.replaceChildren();
 for(const [cat] of s.cats){const o=el('option',cat);o.value=cat;choice.append(o)}
 if(s.cats.some(x=>x[0]===selected))choice.value=selected;
 updateWhatIf();
}
function render(){
 const root=$('receipt-items');root.replaceChildren();
 const empty=$('receipt-empty');if(empty)empty.hidden=items.length>0;
 items.forEach((item,index)=>{
  normalize(item);
  const card=el('div',undefined,'receipt-item-card');
  const field=(label,control,extra='')=>{const wrap=el('label',undefined,'receipt-item-field '+extra);wrap.append(el('span',label,'receipt-item-label'),control);return wrap};
  const name=el('input');name.type='text';name.value=item.name;name.maxLength=90;name.setAttribute('aria-label','Varenavn '+(index+1));
  name.oninput=()=>{item.name=name.value;refresh()};
  const qty=el('input');qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.inputMode='numeric';qty.value=String(item.quantity||1);qty.setAttribute('aria-label','Antall '+item.name);
  const unit=el('input');unit.type='number';unit.step='.01';unit.min='-100000';unit.max='100000';unit.inputMode='decimal';unit.value=String(item.unitPrice);unit.setAttribute('aria-label','Stykkpris for '+item.name);
  const select=el('select');for(const [c] of C){const opt=el('option',c);opt.value=c;select.append(opt)}select.value=item.category;select.setAttribute('aria-label','Kategori for '+item.name);
  const line=el('output',money(item.amount),'receipt-line-value');line.setAttribute('aria-label','Linjesum for '+item.name);
  const updateLine=()=>{item.amount=round2(item.unitPrice*item.quantity);line.textContent=money(item.amount);refresh()};
  qty.oninput=()=>{const v=Number(qty.value);if(Number.isInteger(v)&&v>=1&&v<=999){item.quantity=v;updateLine()}};
  unit.oninput=()=>{const v=price(unit.value);if(Number.isFinite(v)){item.unitPrice=v;updateLine()}};
  select.onchange=()=>{item.category=select.value;refresh()};
  const remove=el('button','×','receipt-delete');remove.type='button';remove.setAttribute('aria-label','Fjern '+item.name);remove.title='Fjern vare';remove.onclick=()=>{items.splice(index,1);render()};
  const removeWrap=el('div',undefined,'receipt-item-remove');removeWrap.append(el('span','Fjern','receipt-item-label'),remove);
  card.append(field('Vare',name,'receipt-item-name'),field('Antall',qty,'receipt-item-qty'),field('Stykkpris',unit,'receipt-item-unit'),field('Kategori',select,'receipt-item-category'),field('Linjesum',line,'receipt-item-total'),removeWrap);
  root.append(card);
 });refresh();
}
function applyText(){
 const parsed=parseText($('receipt-raw').value);items=parsed.items;scanTotal=parsed.total;
 if(parsed.merchant&&!$('receipt-merchant').value)$('receipt-merchant').value=parsed.merchant;
 render();
 $('receipt-ocr-status').textContent=items.length?items.length+' foreslåtte varelinjer. Kontroller dem før lagring.':'Ingen varelinjer funnet. Skriv for eksempel «MELK 24,90» på én linje per vare.';
}
function reset(){
 items=[];scanTotal=null;image=null;if(imageUrl){URL.revokeObjectURL(imageUrl);imageUrl=null}
 $('receipt-file').value='';$('receipt-preview').hidden=true;$('receipt-preview').removeAttribute('src');
 $('receipt-raw').value='';$('receipt-merchant').value='';$('receipt-date').value=date();
 $('receipt-ocr').disabled=true;$('receipt-save-optin').checked=false;
 $('receipt-ocr-status').textContent='Klar for ny kvittering.';$('receipt-save-status').textContent='';render();
}
async function loadOCR(){
 if(window.Tesseract)return window.Tesseract;
 return new Promise((ok,fail)=>{
  const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';script.async=true;
  script.onload=()=>window.Tesseract?ok(window.Tesseract):fail(Error('OCR-biblioteket ble ikke initialisert'));
  script.onerror=()=>fail(Error('OCR-biblioteket kunne ikke lastes ned'));
  document.head.append(script);
 });
}
async function scan(){
 if(!image||busy)return;busy=true;$('receipt-ocr').disabled=true;
 $('receipt-ocr-status').textContent='Starter lokal bildegjenkjenning …';
 let worker=null;
 try{
  const T=await loadOCR();const img=await createImageBitmap(image),scale=Math.min(1,2200/Math.max(img.width,img.height));
  const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);img.close?.();
  const logger=m=>{if(m.status)$('receipt-ocr-status').textContent='OCR: '+m.status+' '+(Number.isFinite(m.progress)?Math.round(m.progress*100)+' %':'')};
  try{worker=await T.createWorker('nor+eng',1,{logger})}
  catch(e){worker=await T.createWorker('eng',1,{logger})}
  const result=await worker.recognize(canvas);
  $('receipt-raw').value=result?.data?.text||'';$('receipt-raw').closest('details').open=true;
  applyText();
 }catch(e){$('receipt-ocr-status').textContent='Kunne ikke lese kvitteringen: '+e.message+'. Du kan bruke tekstfeltet eller legge inn varer manuelt.'}
 finally{try{await worker?.terminate()}catch(e){}busy=false;$('receipt-ocr').disabled=!image}
}
function history(){
 try{const h=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(h)?h.filter(x=>x&&Array.isArray(x.items)).slice(0,80):[]}
 catch(e){return[]}
}
function store(h){
 try{localStorage.setItem(KEY,JSON.stringify(h.slice(0,80)));return true}
 catch(e){$('receipt-save-status').textContent='Lagring feilet. Nettleseren kan være i privat modus.';return false}
}
function renderHistory(){
 const root=$('receipt-history-list');root.replaceChildren();const records=history();
 if(!records.length){root.append(el('p','Ingen lagrede kvitteringer. Skanning alene lagres ikke.'));return}
 root.append(el('p',records.length+' lokale kvitteringer · '+money(records.reduce((s,r)=>s+r.items.reduce((a,i)=>a+Number(i.amount||0),0),0))+' totalt.'));
 for(const rec of records){
  const card=el('div',undefined,'receipt-history-entry'),info=el('div');
  const cost=rec.items.reduce((s,i)=>s+Number(i.amount||0),0);
  info.append(el('strong',rec.merchant||'Ukjent butikk'),el('span',rec.date+' · '+rec.items.reduce((n,i)=>n+(Number(i.quantity)||1),0)+' produkter · '+money(cost)));
  const del=el('button','Slett');del.type='button';del.onclick=()=>{if(store(history().filter(r=>r.id!==rec.id)))renderHistory()};
  card.append(info,del);root.append(card);
 }
}
function save(){
 if(!$('receipt-save-optin').checked){$('receipt-save-status').textContent='Velg frivillig lokal lagring først.';return}
 if(!items.length||items.some(i=>!Number.isFinite(i.amount)||i.name.trim().length<2||!Number.isInteger(Number(i.quantity||1))||Number(i.quantity||1)<1)){
  $('receipt-save-status').textContent='Kontroller navn og beløp på alle varelinjer.';return
 }
 const record={id:crypto.randomUUID(),date:$('receipt-date').value||date(),merchant:$('receipt-merchant').value.trim().slice(0,90),
  items:items.map(i=>({name:i.name.slice(0,90),category:i.category,quantity:i.quantity||1,unitPrice:i.unitPrice,amount:i.amount}))};
 if(store([record,...history()])){
  $('receipt-save-status').textContent='Kvitteringen er lagret på denne enheten, uten bilde.';$('receipt-save-optin').checked=false;renderHistory();
 }
}
function exportCSV(){
 const rows=[['Dato','Butikk','Vare','Antall','Kategori','Linjesum NOK']];
 for(const rec of history())for(const i of rec.items)rows.push([rec.date,rec.merchant,i.name,i.quantity||1,i.category,Number(i.amount).toFixed(2).replace('.',',')]);
 if(rows.length===1){$('receipt-save-status').textContent='Ingen lagrede kjøp å eksportere.';return}
 const text='\uFEFF'+rows.map(row=>row.map(val=>'"'+String(val??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='lanesjekk-kvitteringer.csv';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const sample=['EKSEMPELBUTIKK','MELK LETT 1L 24,90','BRØD GROVT 32,90','KAFFE 250G 69,90','SJOKOLADE 39,90','BANANER 24,50','TANNKREM 29,90','SUM 222,00'].join('\n');
function setupTour(){
 const screen=$('receipt-tour-screen'),progress=$('receipt-tour-progress'),step=$('receipt-tour-step'),pause=$('receipt-tour-pause'),play=$('receipt-tour-play');
 if(!screen)return;
 const names=['Last opp','Finn varene','Se fordelingen','Utforsk sparing'],duration=12000;let start=performance.now(),elapsed=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,frame=0,visible=true;
 function tick(now){
  if(playing&&visible){elapsed=(now-start)%duration;const idx=Math.min(3,Math.floor(elapsed/3000));screen.dataset.stage=String(idx+1);step.textContent=String(idx+1).padStart(2,'0')+' / 04 · '+names[idx];progress.style.width=(elapsed/duration*100)+'%'}
  frame=requestAnimationFrame(tick);
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible&&playing)start=performance.now()-elapsed},{threshold:.02});observer.observe(screen);
 function reset(){elapsed=0;start=performance.now();playing=true;pause.textContent='Pause';screen.dataset.stage='1'}
 play.addEventListener('click',reset);pause.addEventListener('click',()=>{playing=!playing;start=performance.now()-elapsed;pause.textContent=playing?'Pause':'Fortsett'});
 screen.dataset.stage='1';frame=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect()},{once:true});
}
function boot(){
 if(!$('receipt-items'))return;
 setupTour();
 $('receipt-date').value=date();
 $('receipt-file').addEventListener('change',e=>{
  const f=e.target.files?.[0];if(!f)return;
  if(!f.type.startsWith('image/')||f.size>12*1024*1024){$('receipt-ocr-status').textContent='Velg et bilde under 12 MB.';return}
  image=f;if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=URL.createObjectURL(f);
  $('receipt-preview').src=imageUrl;$('receipt-preview').hidden=false;$('receipt-ocr').disabled=false;
  $('receipt-ocr-status').textContent='Trykk «Les kvitteringen» for å starte bildegjenkjenning.';
 });
 $('receipt-ocr').addEventListener('click',scan);
 $('receipt-parse').addEventListener('click',applyText);
 const pasteButton=$('receipt-paste-image');
 if(pasteButton)pasteButton.addEventListener('click',async()=>{
  try{
   const entries=await navigator.clipboard.read();
   const entry=entries.flatMap(e=>e.types.filter(t=>t.startsWith('image/')).map(t=>({e,t})))[0];
   if(!entry)throw Error('Utklippstavlen inneholder ikke et bilde');
   const blob=await entry.e.getType(entry.t);if(blob.size>12*1024*1024)throw Error('Bildet er større enn 12 MB');
   image=blob;if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=URL.createObjectURL(blob);
   $('receipt-preview').src=imageUrl;$('receipt-preview').hidden=false;$('receipt-ocr').disabled=false;
   $('receipt-ocr-status').textContent='Bilde limt inn. Kontroller at hele kvitteringen er synlig, og velg Les kvitteringen.';
  }catch(e){$('receipt-ocr-status').textContent='Kunne ikke lime inn bilde: '+e.message+'. Bruk bildeopplasting på mobil.'}
 });
 document.addEventListener('paste',e=>{
  if(!document.getElementById('kvitteringer')||document.getElementById('kvitteringer').hidden)return;
  if(e.target?.matches?.('input, textarea, [contenteditable]'))return;
  const file=Array.from(e.clipboardData?.files||[]).find(f=>f.type.startsWith('image/')&&f.size<=12*1024*1024);
  if(!file)return;e.preventDefault();image=file;if(imageUrl)URL.revokeObjectURL(imageUrl);
  imageUrl=URL.createObjectURL(file);$('receipt-preview').src=imageUrl;$('receipt-preview').hidden=false;$('receipt-ocr').disabled=false;
  $('receipt-ocr-status').textContent='Bilde limt inn. Trykk Les kvitteringen.';
 });
 $('receipt-demo').addEventListener('click',()=>{reset();$('receipt-raw').value=sample;$('receipt-raw').closest('details').open=true;applyText();$('receipt-merchant').value='Fiktiv eksempelbutikk'});
 $('receipt-add-item').addEventListener('click',()=>{if(items.length>=160)return;items.push({name:'Ny vare',category:'Annet',quantity:1,unitPrice:0,amount:0});render()});
 $('receipt-clear').addEventListener('click',reset);
 $('receipt-save').addEventListener('click',save);
 $('receipt-export').addEventListener('click',exportCSV);
 $('receipt-delete-all').addEventListener('click',()=>{
  if(!history().length)return;
  if(confirm('Vil du slette alle kvitteringene som er lagret lokalt på denne enheten?')){
   try{localStorage.removeItem(KEY)}catch(e){}renderHistory();
  }
 });
 for(const id of ['receipt-whatif-category','receipt-whatif-range','receipt-frequency','receipt-goal'])$(id).addEventListener('input',updateWhatIf);
 render();renderHistory();
 window.lanesjekkReceipts={parseText,price,category,stats};
}
document.addEventListener('DOMContentLoaded',boot);
})();