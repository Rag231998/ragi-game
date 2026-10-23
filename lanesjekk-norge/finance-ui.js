/* Lånesjekk Finance Studio: calculations and self-made visuals.
 * User information is processed locally. No bank-account access, uploads or
 * automated financial recommendations. Example data are explicitly labelled. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const engine=window.LANEFINANCE;
 if(!engine)return;
 const format=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
 const decimal=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2});
 const money=x=>Number.isFinite(x)?format.format(Math.round(x)):'–';
 const percent=x=>Number.isFinite(x)?decimal.format(x)+' %':'–';
 const parse=x=>window.LANENUMBERS?.parseMoney(String(x))??NaN;
 const parseDecimal=x=>window.LANENUMBERS?.parseDecimal(String(x))??NaN;
 const categories=['Bolig','Strøm','Mat og drikke','Transport','Forsikring','Lån','Abonnement','Helse','Barn og familie','Fritid','Sparing','Annet'];
 const periods=[['month','Per måned'],['week','Per uke'],['quarter','Per kvartal'],['year','Per år']];
 const palette=['#0a8778','#4286ba','#a183db','#edaf5c','#e37981','#4fbaab','#699ddd','#d690bf','#749e65','#af93b4','#b3a75e','#92a8b3'];
 const example=[
  {kind:'income',category:'Lønn',description:'Netto månedslønn',bank:'DNB',amount:42000,period:'month'},
  {kind:'income',category:'Annen inntekt',description:'Ekstra inntekt',bank:'DNB',amount:2000,period:'month'},
  {kind:'expense',category:'Bolig',description:'Boliglån / husleie',bank:'DNB',amount:14500,period:'month'},
  {kind:'expense',category:'Strøm',description:'Strøm og nettleie',bank:'DNB',amount:1800,period:'month'},
  {kind:'expense',category:'Mat og drikke',description:'Dagligvarer',bank:'Nordea',amount:6500,period:'month'},
  {kind:'expense',category:'Transport',description:'Bil og kollektiv',bank:'Nordea',amount:3800,period:'month'},
  {kind:'expense',category:'Forsikring',description:'Innbo, bil og person',bank:'DNB',amount:1700,period:'month'},
  {kind:'expense',category:'Abonnement',description:'Mobil, strømmetjenester',bank:'Nordea',amount:1300,period:'month'},
  {kind:'expense',category:'Fritid',description:'Restaurant og fritid',bank:'DNB',amount:2600,period:'month'}
 ];
 const categoryRules=[
  [/lønn|salary|honorar|utbetaling fra arbeid/i,'Lønn'],
  [/kiwi|rema|coop|meny|joker|bunnpris|dagligvare|matbutikk/i,'Mat og drikke'],
  [/netflix|spotify|disney|hbo|viaplay|abonnement|streaming|mobilabonnement/i,'Abonnement'],
  [/elvia|strømregning|nettleie|strømleverandør/i,'Strøm'],
  [/ruter|vy |buss|tog|bensin|diesel|parkering|bompassering/i,'Transport'],
  [/forsikring|gjensidige|if skade|fremtind/i,'Forsikring'],
  [/husleie|felleskostnad|boliglån|kommunale avgifter/i,'Bolig'],
  [/tannlege|apotek|legekontor/i,'Helse'],
  [/barnehage|sfo|skolefritidsordning/i,'Barn og familie'],
  [/kinobillett|restaurant|kafe|konsert/i,'Fritid']
 ];
 function suggestCategory(text,kind){
  if(kind==='income')return /lønn|salary|honorar/i.test(text)?'Lønn':'Annen inntekt';
  return categoryRules.find(([pattern])=>pattern.test(text))?.[1]||null;
 }
 let exampleActive=true;
 let count=0;
 let saveTimer=null;
 let undoSnapshot=null;
 let preventAutosave=false;
 const storageKey='lanesjekk-norge-budget-v1';
 const cell=(row,node)=>{const td=document.createElement('td');td.append(node);row.append(td);return td};
 const option=(value,label)=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o};
 function createInput(value,field){
  const input=document.createElement('input');input.type='text';input.dataset.field=field;
  input.value=value||'';input.autocomplete='off';
  input.setAttribute('aria-label',field==='bank'?'Bank eller konto':field==='description'?'Beskrivelse':'Beløp');
  if(field==='amount'){input.dataset.moneyInput='';input.inputMode='decimal'}
  if(field==='bank')input.setAttribute('list','budget-banks-list');
  return input;
 }
 function createSelect(choices,value,field){
  const select=document.createElement('select');select.dataset.field=field;
  select.setAttribute('aria-label',field==='category'?'Kategori':'Periode');
  for(const [val,label] of choices)select.append(option(val,label));
  select.value=value;
  return select;
 }
 function fillBankOptions(){
  if($('budget-banks-list'))return;
  const list=document.createElement('datalist');list.id='budget-banks-list';
  const names=(window.LANEBANKER||[]).map(b=>b.name);
  for(const name of [...new Set(names)].sort((a,b)=>a.localeCompare(b,'nb')).slice(0,150))list.append(option(name,name));
  document.body.append(list);
 }
 function addRow(p){
  count++;
  const row=document.createElement('tr');row.dataset.lineId=String(count);
  const kind=p.kind==='income'?'income':'expense';
  const kindSpan=document.createElement('span');kindSpan.className='line-kind '+kind;
  kindSpan.textContent=kind==='income'?'↑ Inntekt':'↓ Utgift';const typeCell=cell(row,kindSpan);const marked=document.createElement('input');marked.type='checkbox';marked.className='budget-mark';marked.setAttribute('aria-label','Velg post for summering');marked.checked=!!p.selected;typeCell.prepend(marked);row.classList.add(kind==='income'?'budget-income-row':'budget-expense-row');
  cell(row,createSelect(
   (kind==='income'?['Lønn','Annen inntekt']:categories).map(c=>[c,c]),
   p.category||(kind==='income'?'Lønn':'Annet'),'category'));
  cell(row,createInput(p.description,'description'));
  cell(row,createInput(p.bank,'bank'));
  cell(row,createInput(String(p.amount??0),'amount'));
  cell(row,createSelect(periods,p.period||'month','period'));
  const result=document.createElement('strong');result.className='budget-month-value';result.textContent='–';cell(row,result);
  const actions=document.createElement('div');actions.className='budget-row-actions';
  for(const [dir,symbol,label] of [['up','↑','Flytt opp'],['down','↓','Flytt ned']]){
   const button=document.createElement('button');button.type='button';button.className='budget-move';button.dataset.move=dir;button.textContent=symbol;button.title=label;button.setAttribute('aria-label',label);actions.append(button);
  }
  const remove=document.createElement('button');remove.type='button';remove.className='budget-remove';remove.title='Fjern post';remove.setAttribute('aria-label','Fjern budsjettpost');remove.textContent='×';actions.append(remove);cell(row,actions);
  $('budget-rows').append(row);
  window.LANENUMBERS?.formatAll(row);
  return row;
 }
 function allLines(){
  return Array.from($('budget-rows').querySelectorAll('tr')).map(tr=>{
   const get=field=>tr.querySelector('[data-field="'+field+'"]')?.value||'';
   return {kind:tr.querySelector('.line-kind').classList.contains('income')?'income':'expense',
    category:get('category'),description:get('description').trim().slice(0,180),
    bank:get('bank').trim().slice(0,100),
    amount:parse(get('amount')),period:get('period'),selected:!!tr.querySelector('.budget-mark')?.checked};
  });
 }
 function setLines(lines){
  $('budget-rows').replaceChildren();for(const line of lines.slice(0,250))addRow(line);
  renderBudget();
 }
 function scheduleSave(){
  if(exampleActive)return;
  preventAutosave=false;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>saveBudget(true),450);
 }
 function rememberUndo(){
  undoSnapshot=allLines().map(x=>({...x,amount:Number.isFinite(x.amount)?x.amount:0}));
  const undo=$('budget-undo');
  if(undo)undo.hidden=false;
 }
 function restoreUndo(){
  if(!undoSnapshot)return;
  const old=undoSnapshot;undoSnapshot=null;
  $('budget-undo').hidden=true;
  exampleActive=false;setLines(old);scheduleSave();
  $('budget-storage-status').textContent='Forrige endring er angret. Budsjettet lagres automatisk.';
 }
 function updateFilter(lines){
  const select=$('budget-bank-filter'),selected=select.value;
  const query=($('budget-bank-query')?.value||'').trim().toLocaleLowerCase('nb-NO');
  const assigned=[...new Set(lines.map(x=>x.bank.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'nb'));
  const visible=assigned.filter(name=>name.toLocaleLowerCase('nb-NO').includes(query));
  // Filters only accounts that actually have entries; the full bank directory is
  // available as suggestions when entering a bank on any budget row.
  const signature=visible.join('\u001f')+'|'+selected;
  if(select.dataset.signature!==signature){
   select.replaceChildren(option('all','Alle kontoer i budsjettet'));
   for(const name of visible)select.append(option(name,name));
   if(selected!=='all'&&!visible.includes(selected))select.append(option(selected,selected));
   select.value=selected;
   select.dataset.signature=signature;
  }
  const status=$('budget-bank-results');
  if(status)status.textContent=visible.length+' kontoer med budsjettposter · Skriv banknavn i en rad for flere valg';
 }
 function focusNewRow(row){
  const input=row.querySelector('[data-field="description"]');
  row.scrollIntoView?.({behavior:'smooth',block:'nearest'});
  input?.focus({preventScroll:true});
 }
 function drawDonut(rows,total){
  const target=$('budget-donut'),legend=$('budget-category-list');legend.replaceChildren();
  $('budget-donut-value').textContent=money(total);
  if(total<=0){target.style.background='#eaf1f2';legend.textContent='Legg inn utgifter for å vise fordelingen.';return}
  let position=0;
  const stops=[];
  rows.forEach((x,i)=>{
   const part=100*x.amount/total,until=position+part,color=palette[i%palette.length];
   stops.push(color+' '+position.toFixed(3)+'% '+until.toFixed(3)+'%');
   position=until;
   const r=document.createElement('div');r.className='legend-row';
   const dot=document.createElement('span');dot.className='legend-dot';dot.style.background=color;
   const name=document.createElement('span');name.className='legend-name';name.textContent=x.name;
   const amount=document.createElement('strong');amount.className='legend-amount';amount.textContent=money(x.amount);
   r.append(dot,name,amount);legend.append(r);
  });
  target.style.background='conic-gradient('+stops.join(',')+')';
 }
 function drawBanks(rows){
  const dest=$('budget-bank-chart');dest.replaceChildren();
  if(!rows.length){dest.textContent='Registrer utgiftsposter med banknavn for å se fordelingen.';return}
  const max=Math.max(...rows.map(r=>r.amount),1);
  for(const item of rows){
   const r=document.createElement('div');r.className='tool-bar-row';
   const head=document.createElement('div');head.className='tool-bar-row-head';
   const name=document.createElement('span');name.textContent=item.name;
   const number=document.createElement('strong');number.textContent=money(item.amount);
   head.append(name,number);
   const track=document.createElement('div');track.className='tool-bar-track';
   const fill=document.createElement('div');fill.className='tool-bar-fill';
   fill.style.width=(100*item.amount/max).toFixed(2)+'%';track.append(fill);r.append(head,track);dest.append(r);
  }
 }
 function drawTimeline(monthlyBalance){
  const root=$('budget-timeline');root.replaceChildren();
  const amount=Math.max(0,monthlyBalance);
  for(let month=1;month<=12;month++){
   const col=document.createElement('div');col.title='Måned '+month+': '+money(amount*month);
   const bar=document.createElement('span');
   bar.style.height=amount>0?(100*month/12)+'%':'3px';
   const label=document.createElement('b');label.textContent=month%2===0?'M'+month:'';
   col.append(bar,label);root.append(col);
  }
 }

 function renderBudgetScenario(totals){
  const picker=$('budget-scenario-category'),slider=$('budget-scenario-percent');
  if(!picker||!slider)return;
  const previous=picker.value;
  picker.replaceChildren();
  for(const entry of totals.categories)picker.append(option(entry.name,entry.name));
  const match=totals.categories.find(x=>x.name===previous);
  if(match)picker.value=previous;
  picker.disabled=totals.categories.length===0;
  slider.disabled=totals.categories.length===0;
  const fraction=Number(slider.value)/100;
  const amount=totals.categories.find(x=>x.name===picker.value)?.amount||0;
  $('budget-scenario-percent-value').textContent=slider.value+' %';
  $('budget-scenario-month').textContent=money(amount*fraction);
  $('budget-scenario-year').textContent=money(amount*fraction*12);
 }
 function renderSelection(){
  const selected=allLines().filter(line=>line.selected);const total=selected.reduce((sum,line)=>{const n=engine.monthly(line.amount,line.period);return sum+(Number.isFinite(n)?(line.kind==='income'?n:-n):0)},0);
  $('budget-selected-total').textContent=money(total);
  $('budget-selected-count').textContent=selected.length+' valgt';
  $('budget-selected-hint').textContent='Inntekter legges til, utgifter trekkes fra. Beløpene er omregnet til måned.';
 }
 function renderSalary(){
  const gross=parse($('budget-salary-gross').value),tax=parseDecimal($('budget-salary-tax').value),other=parse($('budget-salary-other').value);
  const valid=Number.isFinite(gross)&&gross>=0&&Number.isFinite(tax)&&tax>=0&&tax<=100&&Number.isFinite(other)&&other>=0;
  const net=valid?Math.max(0,gross*(1-tax/100)-other):NaN;
  $('budget-salary-net').textContent=money(net);
  $('budget-salary-deduction').textContent=money(valid?gross-net:NaN);
  $('budget-salary-use').disabled=!valid;
  $('budget-salary-message').textContent=valid?'Forenklet anslag basert på oppgitt trekkprosent. Ikke en skattekort- eller skatteberegning.':'Fyll inn gyldig bruttolønn, skattetrekk 0–100 % og andre trekk.';
  return net;
 }
 function renderBudget(){
  const lines=allLines();
  renderSelection();
  for(const tr of $('budget-rows').querySelectorAll('tr')){
   const raw=tr.querySelector('[data-field="amount"]').value;
   const amount=parse(raw);
   const period=tr.querySelector('[data-field="period"]').value;
   const value=engine.monthly(amount,period);
   const amountInput=tr.querySelector('[data-field="amount"]');
   const periodInput=tr.querySelector('[data-field="period"]');
   amountInput.setAttribute('aria-invalid',String(!Number.isFinite(value)));
   periodInput.setAttribute('aria-invalid',String(!Number.isFinite(value)));
   amountInput.title=Number.isFinite(value)?'':'Skriv inn et gyldig, ikke-negativt beløp';
   tr.querySelector('.budget-month-value').textContent=money(value);
  }
  updateFilter(lines);
  const selected=$('budget-bank-filter').value;
  for(const tr of $('budget-rows').querySelectorAll('tr')){
   const bank=tr.querySelector('[data-field="bank"]').value.trim();
   tr.hidden=selected!=='all'&&bank!==selected;
  }
  const totals=engine.budget(lines);
  $('budget-income').textContent=money(totals.income);
  $('budget-expenses').textContent=money(totals.expense);
  $('budget-balance').textContent=money(totals.balance);
  $('budget-ratio').textContent=totals.savingRatio===null?'–':new Intl.NumberFormat('nb-NO',{style:'percent',maximumFractionDigits:1}).format(totals.savingRatio);
  $('budget-annual').textContent=money(totals.annualBalance);
  const negative=totals.balance<0;$('budget-balance').closest('.tool-kpi').classList.toggle('negative',negative);
  $('budget-balance-caption').textContent=exampleActive?'Basert på et eksempel – bytt tallene':'Basert på dine inntastede tall';
  $('budget-row-count').textContent=lines.length+' poster';
  $('budget-empty').hidden=lines.length>0;
  drawDonut(totals.categories,totals.expense);drawBanks(totals.banks);drawTimeline(totals.balance);
  renderBudgetScenario(totals);
  const tips=$('budget-insights');tips.replaceChildren();
  $('budget-error-count')?.replaceChildren();
  if(totals.invalidLines>0){
   const warning=document.createElement('span');
   warning.textContent=totals.invalidLines+' post(er) har feil beløp. Rett feltene markert med rødt.';
   $('budget-error-count')?.append(warning);
  }
  for(const message of engine.budgetInsights(totals,lines)){
   const p=document.createElement('div');p.className='insight-item';p.textContent=message;tips.append(p);
  }
 }
 function csvField(v){
  let s=String(v??'');
  if(/^[\s]*[=+@-]/.test(s))s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
 }
 function exportCSV(){
  const headers=['Type','Kategori','Beskrivelse','Bank / konto','Beløp NOK','Periode','Beløp per måned NOK'];
  const lines=allLines().map(row=>[row.kind==='income'?'Inntekt':'Utgift',row.category,row.description,row.bank,Number.isFinite(row.amount)?row.amount.toFixed(2):'',row.period,engine.monthly(row.amount,row.period).toFixed(2)]);
  const csv='\ufeff'+[headers,...lines].map(line=>line.map(csvField).join(';')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='lanesjekk-budsjett.csv';
  document.body.append(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 function saveBudget(automatic=false){
  try{
   const lines=allLines().map(x=>({...x,amount:Number.isFinite(x.amount)?x.amount:null}));
   if(lines.some(x=>x.amount===null)){
    $('budget-storage-status').textContent='Rett ugyldige beløp før budsjettet kan lagres.';
    return;
   }
   localStorage.setItem(storageKey,JSON.stringify({version:1,lines}));
   $('budget-storage-status').textContent=automatic?'✓ Endringer lagret automatisk i denne nettleseren.':'✓ Budsjettet er lagret på denne enheten. Ingen kontodata sendes til serveren.';
  }catch{
   $('budget-storage-status').textContent='Kunne ikke lagre lokalt – sjekk nettleserens lagringsinnstillinger.';
  }
 }
 function initBudget(){
  fillBankOptions();
  let loaded=false;
  try{
   const record=JSON.parse(localStorage.getItem(storageKey)||'null');
   if(record?.version===1&&Array.isArray(record.lines)&&record.lines.length<=250){
    const clean=record.lines.filter(l=>l&&['income','expense'].includes(l.kind)&&typeof l.category==='string'&&typeof l.period==='string').map(l=>({...l,amount:Number(l.amount)||0}));
    setLines(clean);loaded=true;exampleActive=false;
    $('budget-storage-status').textContent='Lagret budsjett lastet fra denne nettleseren. Ingen bankkonto er tilkoblet.';
   }
  }catch{}
  if(!loaded)setLines(example);
  $('budget-rows').addEventListener('input',event=>{
   const field=event.target?.dataset?.field;
   if(field==='description'&&$('budget-auto-category')?.checked){
    const tr=event.target.closest('tr');
    const kind=tr.querySelector('.line-kind').classList.contains('income')?'income':'expense';
    const suggested=suggestCategory(event.target.value,kind);
    if(suggested)tr.querySelector('[data-field="category"]').value=suggested;
   }
   exampleActive=false;renderBudget();scheduleSave();
  });
  $('budget-rows').addEventListener('change',()=>{exampleActive=false;renderBudget();scheduleSave()});
  $('budget-rows').addEventListener('click',e=>{
   const move=e.target.closest('[data-move]');
   if(move){
    const tr=move.closest('tr'),other=move.dataset.move==='up'?tr.previousElementSibling:tr.nextElementSibling;
    if(!other)return;
    if(move.dataset.move==='up')other.before(tr);else other.after(tr);
    exampleActive=false;renderBudget();scheduleSave();move.focus();return;
   }
   if(e.target.closest('.budget-remove')){rememberUndo();e.target.closest('tr').remove();exampleActive=false;renderBudget();scheduleSave();}
  });
  $('budget-add-income').addEventListener('click',()=>{const row=addRow({kind:'income',category:'Lønn',description:'',bank:'',amount:0,period:'month'});exampleActive=false;renderBudget();scheduleSave();focusNewRow(row)});
  $('budget-add-expense').addEventListener('click',()=>{const row=addRow({kind:'expense',category:'Annet',description:'',bank:'',amount:0,period:'month'});exampleActive=false;renderBudget();scheduleSave();focusNewRow(row)});
  $('budget-show-bank')?.addEventListener('change',event=>{
   document.querySelector('.budget-table')?.classList.toggle('budget-bank-visible',event.target.checked);
  });
  $('budget-bank-filter').addEventListener('change',renderBudget);
  for(const id of ['budget-salary-gross','budget-salary-tax','budget-salary-other'])$(id)?.addEventListener('input',renderSalary);
  $('budget-salary-use')?.addEventListener('click',()=>{
   const net=renderSalary();if(!Number.isFinite(net))return;
   const existing=[...$('budget-rows').querySelectorAll('tr')].find(tr=>tr.querySelector('.line-kind.income')&&tr.querySelector('[data-field="category"]').value==='Lønn');
   const row=existing||addRow({kind:'income',category:'Lønn',description:'Netto lønn (beregnet)',bank:'',amount:net,period:'month'});
   row.querySelector('[data-field="amount"]').value=window.LANENUMBERS.displayMoney(String(Math.round(net*100)/100).replace('.',','));
   row.querySelector('[data-field="description"]').value='Netto lønn (fra brutto og oppgitt skattetrekk)';
   row.querySelector('[data-field="period"]').value='month';
   exampleActive=false;renderBudget();scheduleSave();$('budget-salary-message').textContent='Nettoanslaget er overført til budsjettposten Lønn.';
  });
  renderSalary();
  $('budget-bank-query')?.addEventListener('input',renderBudget);
  $('budget-demo').addEventListener('click',()=>{rememberUndo();exampleActive=true;setLines(example);$('budget-storage-status').textContent='Eksempelbudsjett vises. Beløpene er oppdiktede illustrasjoner.'});
  $('budget-reset').addEventListener('click',()=>{rememberUndo();exampleActive=false;setLines([]);scheduleSave();$('budget-storage-status').textContent='Skjemaet er tømt. Trykk «Angre» for å gjenopprette postene.'});
  $('budget-undo')?.addEventListener('click',restoreUndo);
  $('budget-scenario-category').addEventListener('change',renderBudget);
  $('budget-scenario-percent').addEventListener('input',renderBudget);
  $('budget-export').addEventListener('click',exportCSV);
  $('budget-save').addEventListener('click',saveBudget);
  $('budget-clear-save').addEventListener('click',()=>{
   clearTimeout(saveTimer);
   preventAutosave=true;
   try{localStorage.removeItem(storageKey);$('budget-storage-status').textContent='Lokal lagring er slettet. Gjeldende tall i skjemaet beholdes til siden lastes på nytt.'}
   catch{$('budget-storage-status').textContent='Kunne ikke slette lokal lagring.'}
  });
  renderBudget();
 }
 const scenarios={
  car:{amount:'350 000',down:'75 000',rate:'6,90',years:'5',setup:'2 000',fee:'65',balloon:'0',running:'1 500'},
  consumer:{amount:'125 000',down:'0',rate:'11,90',years:'5',setup:'950',fee:'50',balloon:'0',running:'0'}
 };
 let mode='car';
 function readScenario(){
  return Object.fromEntries(Object.keys(scenarios.car).map(k=>{
   const el=$(k==='amount'?'finance-amount':k==='down'?'finance-down':k==='rate'?'finance-rate':k==='years'?'finance-years':k==='setup'?'finance-setup':k==='fee'?'finance-fee':k==='balloon'?'finance-balloon':'finance-running');
   return [k,el.value];
  }));
 }
 function applyScenario(s){
  const ids={amount:'finance-amount',down:'finance-down',rate:'finance-rate',years:'finance-years',setup:'finance-setup',fee:'finance-fee',balloon:'finance-balloon',running:'finance-running'};
  for(const [key,id] of Object.entries(ids))$(id).value=s[key];
 }
 function chooseMode(newMode){
  if(newMode!==mode){
   scenarios[mode]=readScenario();
   mode=newMode;
   applyScenario(scenarios[mode]);
  }
  $('loan-tab-car').setAttribute('aria-selected',String(mode==='car'));
  $('loan-tab-consumer').setAttribute('aria-selected',String(mode==='consumer'));
  document.querySelectorAll('#billan .car-only').forEach(el=>{el.hidden=mode==='consumer'});
  $('loan-input-title').textContent=mode==='car'?'Beregn billånet':'Beregn forbrukslånet';
  $('loan-input-intro').textContent=mode==='car'?'Legg inn kjøpesum, egenkapital og vilkår fra banken.':'Sammenlign lånekostnaden uten sikkerhet i bil eller bolig.';
  $('finance-price-label').textContent=mode==='car'?'Bilens kjøpesum':'Beløpet du vil låne';
  $('finance-monthly-total-label').textContent=mode==='car'?'Månedlig utgift inkl. bildrift':'Månedlig utgift inkl. termingebyr';
  renderLoan();
 }
 function loanInputs(){
  const v=id=>parse($(id).value),rate=parseDecimal($('finance-rate').value);
  return {kind:mode,amount:v('finance-amount'),down:mode==='car'?v('finance-down'):0,
   rate,years:Number($('finance-years').value),setup:v('finance-setup'),
   monthlyFee:v('finance-fee'),balloon:mode==='car'?v('finance-balloon'):0,
   operations:mode==='car'?v('finance-running'):0};
 }
 function displayParts(parts){
  const total=parts.reduce((a,b)=>a+b.value,0)||1;
  const bar=$('finance-cost-bar'),legend=$('finance-cost-legend');
  bar.replaceChildren();legend.replaceChildren();
  for(const part of parts){
   const span=document.createElement('span');span.style.width=(100*part.value/total).toFixed(4)+'%';span.style.background=part.color;
   span.title=part.label+': '+money(part.value);
   bar.append(span);
   const item=document.createElement('span');item.style.setProperty('--part-color',part.color);
   item.textContent=part.label+' '+money(part.value);legend.append(item);
  }
 }
 function drawDebt(rows,principal,balloon){
  const chart=$('finance-debt-chart');chart.replaceChildren();
  const all=[{month:0,debt:principal},...rows];
  const max=principal;
  for(const point of all){
   const col=document.createElement('div');
   col.title='Måned '+point.month+': restgjeld '+money(point.debt);
   const bar=document.createElement('span');
   bar.style.height=Math.max(2,100*point.debt/max)+'%';
   const label=document.createElement('b');label.textContent=point.month===0?'Start':point.month%12===0?point.month/12+' år':'';
   col.append(bar,label);chart.append(col);
  }
 }
 function renderLoan(){
  const result=engine.loan(loanInputs()),error=$('finance-error');
  error.hidden=!!result;
  const ids=['finance-monthly','finance-apr','finance-cost','finance-principal','finance-total','finance-allin','finance-saving'];
  if(!result){
   for(const id of ids)$(id).textContent='–';
   $('finance-cost-bar').replaceChildren();$('finance-cost-legend').replaceChildren();$('finance-debt-chart').replaceChildren();return;
  }
  $('finance-monthly').textContent=money(result.monthlyWithFees);
  $('finance-apr').textContent=percent(result.apr);
  $('finance-cost').textContent=money(result.totalCredit);
  $('finance-principal').textContent=money(result.principal);
  $('finance-total').textContent=money(result.totalToLender);
  $('finance-allin').textContent=money(result.monthlyAllIn);
  $('finance-saving').textContent=money(result.savingHalfPoint);
  displayParts([{label:'Lån',value:result.principal,color:'#1a897b'},
    {label:'Renter',value:result.interest,color:'#efae54'},
    {label:'Gebyrer',value:result.totalCredit-result.interest,color:'#9e81d9'}]);
  drawDebt(result.remaining,result.principal,result.balloon);
 }
 function initLoan(){
  $('loan-tab-car').addEventListener('click',()=>{
   if(typeof window.lanesjekkNavigate==='function')window.lanesjekkNavigate('billan');else chooseMode('car');
  });
  $('loan-tab-consumer').addEventListener('click',()=>{
   if(typeof window.lanesjekkNavigate==='function')window.lanesjekkNavigate('forbrukslan');else chooseMode('consumer');
  });
  $('financing-form-panel').addEventListener('input',renderLoan);
  $('financing-form-panel').addEventListener('change',renderLoan);
  window.lanesjekkFinanceChooseMode=chooseMode;
  chooseMode(window.location.hash==='#forbrukslan'?'consumer':'car');
 }
 document.addEventListener('DOMContentLoaded',()=>{if(!$('budsjett')||!$('billan'))return;initBudget();initLoan()});
})();