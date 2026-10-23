/* Lånesjekk Norge: private, in-browser annuity comparisons.
   No personal data is transmitted by this script. No cookies, localStorage or analytics. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const nok=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
const number=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:1});
const pct=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2});
let offerId=0;let offers=[];
const opts={balance:3000000,property:4500000,rate:5.5,years:25,currentfee:65};
function val(id){const raw=$(id).value.trim();return raw===''?NaN:Number(raw)}
function validNumber(n,min,max){return Number.isFinite(n)&&n>=min&&n<=max}
function money(v){return Number.isFinite(v)?nok.format(Math.round(v)):'–'}
function annuity(principal,annualRate,months){
 if(!validNumber(principal,1,100000000)||!validNumber(annualRate,0,35)||!validNumber(months,1,480))return null;
 const rate=annualRate/1200;
 if(rate===0)return principal/months;
 const factor=Math.pow(1+rate,-months);
 return principal*rate/(1-factor);
}
function scenario(principal,rate,months,fee,setup=0){
 const base=annuity(principal,rate,months);
 if(base===null||!validNumber(fee,0,2000)||!validNumber(setup,0,500000))return null;
 const monthly=base+fee;
 const cost=monthly*months+setup;
 return {monthly,total:cost,interest:Math.max(0,base*months-principal),fees:fee*months+setup,principal,setup,base};
}
function getLoan(){
 const balance=val('balance'),property=val('property'),rate=val('rate'),years=val('years'),currentfee=val('currentfee');
 const valid=validNumber(balance,10000,100000000)&&validNumber(property,10000,200000000)&&validNumber(rate,0,35)&&validNumber(years,1,40)&&Number.isInteger(years)&&validNumber(currentfee,0,2000);
 return valid?{balance,property,rate,years,months:years*12,currentfee}:null;
}
function row(tag,text){const n=document.createElement(tag);n.textContent=text;return n}
function text(id,str){$(id).textContent=str}
function setEmpty(){
 for(const id of ['ltv','monthly','interest','total','split-label'])text(id,'–');
 $('principal-bar').style.width='50%';
 text('ltv-warning','Kontroller at alle felter inneholder gyldige verdier.');
 $('result-table-wrap').hidden=true;$('copy-request').disabled=true;$('copy-summary').disabled=true;
 $('copy-request').dataset.best='';$('copy-summary').dataset.summary='';$('results').replaceChildren();
}
function offerValue(o,field){return o.element.querySelector('[data-field="'+field+'"]')?.value??''}
function addOffer(bank){
 if(!bank||!(window.LANEBANKER||[]).some(b=>b.id===bank.id))return false;
 if(offers.some(o=>o.bankId===bank.id)){text('action-status',bank.name+' er allerede lagt til. Du kan redigere renten i tilbudet under.');return false}
 if(offers.length>=8){text('action-status','Du kan sammenligne opptil åtte tilbud av gangen.');return false}
 const id=++offerId;
 const div=document.createElement('article');div.className='offer';
 div.innerHTML='<div class="offer-head"><h3>Banktilbud '+id+'</h3><button class="remove" type="button" aria-label="Fjern banktilbud">Fjern ×</button></div>'+
 '<div class="offer-fields">'+
 '<div class="field"><label for="offer-name-'+id+'">Bank / produkt</label><div class="input-wrap"><input data-field="name" id="offer-name-'+id+'" placeholder="F.eks. bankens navn" type="text" maxlength="80" autocomplete="off"></div></div>'+
 '<div class="field"><label for="offer-rate-'+id+'">Nominell rente</label><div class="input-wrap"><input data-field="rate" id="offer-rate-'+id+'" type="number" inputmode="decimal" min="0" max="35" step="0.01" placeholder="5,10" required><span>%</span></div></div>'+
 '<div class="field"><label for="offer-fee-'+id+'">Gebyr per måned</label><div class="input-wrap"><input data-field="fee" id="offer-fee-'+id+'" type="number" inputmode="numeric" min="0" max="2000" step="1" value="0"><span>kr</span></div></div>'+
 '<div class="field"><label for="offer-setup-'+id+'">Engangskostnad</label><div class="input-wrap"><input data-field="setup" id="offer-setup-'+id+'" type="number" inputmode="numeric" min="0" max="500000" step="1" value="0"><span>kr</span></div></div>'+
 '</div><div class="conditions"><label for="offer-notes-'+id+'" style="font-size:10px;color:#607887;font-weight:800">Vilkår, medlemskap eller merknad (valgfritt)</label><input data-field="notes" id="offer-notes-'+id+'" type="text" maxlength="160" placeholder="F.eks. krav om lønnskonto eller medlemskap"></div>';
 const offer={id,bankId:bank.id,element:div};offers.push(offer);
 const title=div.querySelector('.offer-head h3');title.textContent=bank.name;
 const nameField=div.querySelector('[data-field="name"]');nameField.value=bank.name;nameField.readOnly=true;
 nameField.title='Banken er valgt fra registrerte foretak og kan ikke erstattes med et ukontrollert banknavn.';
 const licence=document.createElement('a');licence.textContent='✓ Se tillatelse i Finanstilsynet ↗';licence.href=bank.register;licence.target='_blank';licence.rel='noopener noreferrer';
 licence.className='offer-licence';div.append(licence);
 const note=document.createElement('p');note.className='offer-data-note';note.textContent='Fyll inn en faktisk tilbudt nominell rente fra '+bank.name+'. Vi har ikke registrert noen bankrente på dine vegne.';div.append(note);
 div.querySelector('.remove').addEventListener('click',()=>{
  div.remove();offers=offers.filter(o=>o.id!==id);compute()
 });
 div.addEventListener('input',compute);
 $('offers').append(div);
 $('add-offer').disabled=offers.length>=8;
 compute();
 div.querySelector('[data-field="rate"]').focus();
 return true;
}
function extractOffers(loan){
 const list=[];
 for(const o of offers){
  const raw=offerValue(o,'rate');if(raw.trim()==='')continue;
  const rate=Number(raw),fee=Number(offerValue(o,'fee')),setup=Number(offerValue(o,'setup'));
  if(!validNumber(rate,0,35)||!validNumber(fee,0,2000)||!validNumber(setup,0,500000))continue;
  const calc=scenario(loan.balance,rate,loan.months,fee,setup);
  if(!calc)continue;
  list.push({name:offerValue(o,'name').trim()||'Banktilbud '+o.id,notes:offerValue(o,'notes').trim(),rate,fee,setup,...calc});
 }
 list.sort((a,b)=>a.total-b.total||a.rate-b.rate||a.name.localeCompare(b.name,'nb'));
 return list;
}
function compute(){
 const loan=getLoan();
 scenarioPreview();
 $('offers-empty').hidden=offers.length>0;
 $('add-offer').disabled=offers.length>=8;
 if(!loan){setEmpty();return}
 const now=scenario(loan.balance,loan.rate,loan.months,loan.currentfee);
 const ltv=loan.balance/loan.property*100;
 text('ltv',pct.format(ltv)+' %');
 text('ltv-warning',ltv>100?'Restgjelden er høyere enn boligverdien. Bankene kan stille krav om ekstra sikkerhet.':ltv>90?'Over 90 % belåning. Ordinære lån kan være begrenset av utlånsforskriften og bankens kredittvurdering.':'');
 text('monthly',money(now.monthly));
 text('interest',money(now.interest));
 text('total',money(now.total));
 const portion=Math.max(2,Math.min(98,100*loan.balance/now.total));
 $('principal-bar').style.width=portion.toFixed(2)+'%';
 text('split-label',pct.format(portion)+' % nedbetaling');
 $('comparison-note').textContent='Alle beregninger forutsetter '+loan.years+' år, månedlig annuitet og uendret nominell rente. Engangskostnader telles med i totalen. Skattefradrag er ikke trukket fra.';
 const comparisons=extractOffers(loan);
 const body=$('results');body.replaceChildren();
 for(const [i,o] of comparisons.entries()){
  const tr=document.createElement('tr');const savings=now.total-o.total;
  const t1=document.createElement('td');const strong=row('strong',o.name);
  t1.append(strong);
  if(o.notes){t1.append(row('span',o.notes));t1.lastChild.className='offer-caption'}
  if(i===0){const lbl=row('span','Lavest beregnet totalkostnad');lbl.className='offer-caption';t1.append(lbl)}
  tr.append(t1);
  tr.append(row('td',pct.format(o.rate)+' %'),row('td',money(o.monthly)),row('td',money(o.total)));
  const diff=row('td',(savings>=0?'+':'')+money(savings)+' '+(savings>=0?'spart':'dyrere'));
  diff.className=savings>=0?'positive':'negative';tr.append(diff);
  body.append(tr);
 }
 if(comparisons.length){
  const tr=document.createElement('tr');tr.append(row('td',($('currentbank').value.trim()||'Din bank')+' (i dag)'),
   row('td',pct.format(loan.rate)+' %'),row('td',money(now.monthly)),row('td',money(now.total)),row('td','Utgangspunkt'));
  body.append(tr);
 }
 $('result-table-wrap').hidden=comparisons.length===0;
 $('copy-request').disabled=comparisons.length===0;
 $('copy-summary').disabled=false;
 $('copy-request').dataset.best=comparisons.length?JSON.stringify({loan,best:comparisons[0],baseline:now}):'';
 $('copy-summary').dataset.summary=JSON.stringify({loan,baseline:now,offers:comparisons});
}
async function copyValue(value,label){
 try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);
  else{const box=document.createElement('textarea');box.value=value;box.style.cssText='position:fixed;left:-200vw;top:0';document.body.append(box);box.select();
    if(!document.execCommand('copy'))throw Error('Clipboard not supported');box.remove()}
  text('action-status',label+' er kopiert til utklippstavlen.');
 }catch(e){text('action-status','Kunne ikke kopiere automatisk. Prøv en annen nettleser eller tillat utklippstavletilgang.')}
}
function negotiation(){
 const raw=$('copy-request').dataset.best;
 if(!raw)return;
 const {loan,best,baseline}=JSON.parse(raw);
 const bank=$('currentbank').value.trim()||'banken';
 const msg='Hei!\n\nJeg ønsker en ny vurdering av renten på boliglånet mitt hos '+bank+'. '+
 'Jeg har omtrent '+money(loan.balance)+' i restgjeld, boligen er verdt '+money(loan.property)+
 ' og jeg har '+pct.format(loan.rate)+' % nominell rente i dag.\n\n'+
 'Jeg har funnet et alternativ ('+best.name+') med oppgitt nominell rente på '+
 pct.format(best.rate)+' %, '+money(best.fee)+' i termingebyr og '+money(best.setup)+' i engangskostnader. '+
 'For tilsvarende nedbetalingstid beregner jeg en mulig forskjell på omtrent '+
 money(Math.max(0,baseline.total-best.total))+' i totale betalinger dersom rentene forblir uendret.\n\n'+
 'Kan dere undersøke om dere kan matche eller forbedre disse betingelsene og sende meg et skriftlig tilbud?\n\nMed vennlig hilsen';
 copyValue(msg,'Melding til banken');
}
function summary(){
 const raw=$('copy-summary').dataset.summary;if(!raw)return;
 const {loan,baseline,offers:rows}=JSON.parse(raw);
 const chunks=['LÅNESJEKK NORGE – PRIVAT BEREGNING','Restgjeld: '+money(loan.balance),'Boligverdi: '+money(loan.property),
 'Løpetid: '+loan.years+' år','Dagens nominelle rente: '+pct.format(loan.rate)+' %',
 'Dagens terminbeløp: '+money(baseline.monthly),'Dagens totale betaling: '+money(baseline.total)];
 for(const o of rows)chunks.push(o.name+': '+pct.format(o.rate)+' % – '+money(o.monthly)+'/mnd – '+money(o.total)+' totalt');
 chunks.push('Beregnet ved uendret rente, månedlig annuitet og oppgitte gebyrer. Ikke banktilbud.');
 copyValue(chunks.join('\n'),'Låneoversikt');
}
function market(){
 const container=$('market-frame'),button=$('load-market');
 if(container.firstElementChild)return;
 const frame=document.createElement('iframe');
 frame.src='https://www.forbrukerradet.no/finansportalen/bank/iframe/lan/boliglan';
 frame.title='Finansportalen – Boliglån (Forbrukerrådets offisielle, uendrede sammenligning)';
 frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';
 // Display Finansportalen's official portable calculator unmodified.
 container.append(frame);button.disabled=true;button.textContent='Bankoversikten er lastet inn';
 text('market-disclaimer','Du har åpnet Finansportalens uendrede tredjepartsverktøy. Dersom det ikke vises i denne nettleseren, åpne Finansportalen via lenken nedenfor.');
 const link=document.createElement('a');link.href='https://www.forbrukerradet.no/finansportalen/bank/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Åpne Finansportalen i ny fane ↗';
 $('market-disclaimer').append(' ',link);
}
function reset(){
 for(const [id,v] of Object.entries(opts))$(id).value=String(v);
 $('currentbank').value='';$('offers').replaceChildren();offers=[];offerId=0;
 $('scenario-cut').value='0.5';
 $('add-offer').disabled=false;
 text('action-status','Eksempelverdiene er gjenopprettet.');compute();
}

function scenarioPreview(){
 const loan=getLoan();
 if(!loan){text('scenario-year','–');text('scenario-detail','Kontroller lånebeløp, rente og nedbetalingstid først.');return}
 const cut=Math.max(0,Math.min(2,Number($('scenario-cut').value)||0));
 const today=scenario(loan.balance,loan.rate,loan.months,loan.currentfee);
 const loweredRate=Math.max(0,loan.rate-cut);
 const alternate=scenario(loan.balance,loweredRate,loan.months,loan.currentfee);
 const savedYear=Math.max(0,(today.monthly-alternate.monthly)*12);
 text('scenario-cut-label',pct.format(loan.rate-loweredRate)+' prosentpoeng');
 text('scenario-year',money(savedYear));
 text('scenario-detail','Tilsvarer omtrent '+money((today.monthly-alternate.monthly))+' lavere månedlig terminbeløp. Hypotetisk scenario ved '+pct.format(loweredRate)+' % rente, ingen bankgaranti. Ikke det samme som netto rentebesparelse.');
}

function init(){
 const bankSelect=$('currentbank');
 for(const b of (window.LANEBANKER||[])){
  const opt=document.createElement('option');opt.value=b.name;opt.textContent=b.name;bankSelect.append(opt);
 }
 $('loan-form').addEventListener('input',compute);
 $('loan-form').addEventListener('submit',event=>event.preventDefault());
 $('add-offer').addEventListener('click',()=>{
  const input=$('bank-query');input.scrollIntoView({behavior:'smooth',block:'center'});input.focus();
 });
 $('copy-request').addEventListener('click',negotiation);
 $('copy-summary').addEventListener('click',summary);
 $('load-market').addEventListener('click',market);
 $('reset').addEventListener('click',reset);
 $('scenario-cut').addEventListener('input',scenarioPreview);
 window.lanesjekkAddBank=bankId=>{
  const bank=(window.LANEBANKER||[]).find(b=>b.id===bankId);
  return bank?addOffer(bank):false;
 };
 compute();
}
document.addEventListener('DOMContentLoaded',init);
})();