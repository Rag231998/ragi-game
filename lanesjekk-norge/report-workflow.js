(()=>{'use strict';
const $=id=>document.getElementById(id),api=window.LNReportCenter,modal=$('ln-report-modal'),controls=modal?.querySelector('.ln-report-controls'),preview=$('ln-report-preview'),status=$('ln-report-status');
if(!api||!modal||!controls||!preview)return;
const share=document.createElement('div');share.className='ln-rw-share';share.setAttribute('aria-label','Lagre og del rapporten');
for(const child of [...controls.children])if(child!==status)share.append(child);
const description=document.createElement('div');description.className='ln-rw-share-summary';description.innerHTML='<h3>Klar til å dele</h3><p id="ln-rw-share-details" aria-live="polite">Rapporten vises her før du deler den.</p><p class="ln-rw-privacy">Bare opplysningene du valgte i trinn 1 er med. Alle som får PDF-filen eller den komplette lenken kan lese dem.</p>';
share.prepend(description);
const consent=share.querySelector('.ln-report-check');
if(consent)description.insertAdjacentElement('afterend',consent);
const actions=document.createElement('div');actions.className='ln-rw-main-actions';
const pdf=$('ln-report-social'),download=$('ln-report-download'),link=$('ln-report-private-link');
if(pdf){pdf.textContent='Del PDF';pdf.classList.add('ln-rw-primary');actions.append(pdf)}
if(download){download.textContent='Last ned PDF';actions.append(download)}
if(link){link.textContent='Kopier sikker lenke';actions.append(link)}
share.append(actions);
const more=document.createElement('details');more.className='ln-rw-more';more.id='ln-rw-more';
const title=document.createElement('summary');title.textContent='Flere valg – bilde, lagring og e-post';more.append(title);
const moreList=document.createElement('div');moreList.className='ln-rw-extra-actions';more.append(moreList);
const image=$('ln-report-social-image'),save=$('ln-report-save'),openSaved=$('ln-report-open-saved');
if(image){image.textContent='Del budsjettbilde (Instagram, Facebook m.m.)';moreList.append(image)}
if(save){save.textContent='Lagre i denne nettleseren';moreList.append(save)}
if(openSaved){openSaved.textContent='Åpne lagret rapport';moreList.append(openSaved)}
const copySummary=document.createElement('button');copySummary.type='button';copySummary.id='ln-rw-copy-summary';copySummary.textContent='Kopier kort oppsummering';moreList.append(copySummary);
const mailGroup=document.createElement('div');mailGroup.id='ln-report-mail-group';mailGroup.className='ln-rw-mail-group';mailGroup.hidden=true;
const recipientLabel=share.querySelector('label[for="ln-report-recipient"]'),recipient=$('ln-report-recipient'),email=$('ln-report-email');
for(const el of [recipientLabel,recipient,email])if(el)mailGroup.append(el);
if(email)email.textContent='Send PDF direkte (krever innlogging)';
moreList.append(mailGroup);
const print=$('ln-report-print');if(print)print.hidden=true;
share.append(more);
function updateMail(){mailGroup.hidden=!api.hasDirectEmail?.()}
document.addEventListener('ln-report-email-ready',updateMail);updateMail();
copySummary.addEventListener('click',async()=>{
 const r=api.getReport();
 if(!r||!$('ln-report-consent')?.checked){api.showMessage('Godkjenn delingen før du kopierer økonomiske opplysninger.');return}
 const rows=(r.results||[]).slice(0,10).map(x=>x.label+': '+x.value);
 const message=[r.title,'Opprettet med Lånesjekk Norge',...rows,'Beregningene er basert på opplysninger oppgitt av brukeren.'].join('\\n');
 try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText(message);api.showMessage('Kort oppsummering er kopiert og klar for deling.')}catch{api.showMessage('Nettleseren blokkerte kopiering. Bruk Del PDF eller Last ned PDF i stedet.')}
});
const selection=document.createElement('div');selection.className='ln-rw-selection';
const options=[
 ['summary','Sammendrag','Hovedtall, resultater og nøkkelinformasjon',true],
 ['income','Inntekter','Lønn og andre inntekter i budsjettet',true],
 ['expenses','Utgifter','Kategorier og månedlige kostnader',true],
 ['savings','Sparing og mål','Til overs, spareandel og mulig utvikling',true],
 ['details','Beregning og poster','Detaljerte budsjettposter og grunnlag',true],
 ['loans','Lån og renter','Eventuelle lån, gjeld og renteposter',false],
 ['notes','Egne kommentarer','Legg til en kort forklaring',false]
];
selection.innerHTML='<h3>Velg innhold</h3><p>Du bestemmer hva mottakeren får se. Ingen rapport sendes før du deler den.</p><div class="ln-rw-options">'+options.map(([id,name,description,selected])=>'<label class="ln-rw-option"><input data-rw-part="'+id+'" type="checkbox" '+(selected?'checked':'')+'><span><strong>'+name+'</strong><small>'+description+'</small></span></label>').join('')+'</div><label class="ln-rw-label" for="ln-rw-title">Rapporttittel</label><input id="ln-rw-title" type="text" maxlength="90" value="Mitt budsjett" placeholder="Mitt budsjett"><label class="ln-rw-label" for="ln-rw-note">Kommentar (valgfritt)</label><textarea id="ln-rw-note" rows="3" maxlength="500" placeholder="Hva ønsker du at mottakeren skal vite?"></textarea>';
controls.prepend(selection,share);
const nav=document.createElement('div');nav.className='ln-rw-nav';nav.innerHTML='<button id="ln-rw-back" type="button">Tilbake</button><button id="ln-rw-next" type="button">Forhåndsvis rapport →</button>';modal.querySelector('.ln-report-card')?.append(nav);
if(status)controls.append(status);
const progress=document.createElement('nav');progress.className='ln-rw-progress';progress.setAttribute('aria-label','Trinn for rapportdeling');progress.innerHTML=['1. Velg innhold','2. Forhåndsvis','3. Del rapport'].map((txt,i)=>'<button type="button" data-rw-step="'+(i+1)+'">'+txt+'</button>').join('');
modal.querySelector('.ln-report-header')?.after(progress);
const back=$('ln-rw-back'),next=$('ln-rw-next');
let step=1,original=null,usedHash=false;
const selected=id=>!!selection.querySelector('[data-rw-part="'+id+'"]')?.checked;
function makeReport(){
 const source=original||api.collect();if(!source)return null;
 const r={...source,results:[...source.results],entries:[...source.entries],rows:source.rows.map(c=>[...c])};
 r.title=$('ln-rw-title').value.trim()||'Budsjettrapport';
 const inc=/(lønn|inntekt|pensjon|stønad|trygd|stipend)/i;
 if(!selected('details'))r.entries=[];if(!selected('loans'))r.entries=r.entries.filter(e=>!/(lån|gjeld|rente)/i.test(e.label));
 r.rows=r.rows.filter(c=>{const category=String(c[1]||'');if(/(lån|gjeld|rente)/i.test(category))return selected('loans');return inc.test(category)?selected('income'):selected('expenses')});
 r.results=r.results.filter(x=>{
  const t=x.label.toLowerCase();
  if(/spare|til overs|overskudd|sparing/.test(t))return selected('savings')||selected('summary');
  if(/inntekt/.test(t))return selected('income')||selected('summary');
  if(/utgift|kostnad/.test(t))return selected('expenses')||selected('summary');
  if(/budsjettposter/.test(t))return selected('details');
  return selected('summary');
 });
 if(!selected('summary')&&!selected('income')&&!selected('expenses')&&!selected('savings'))r.results=[];
 if(selected('notes')&&$('ln-rw-note').value.trim())r.entries.push({label:'Kommentar',value:$('ln-rw-note').value.trim()});
 return r;
}
function show(n){
 step=Math.min(3,Math.max(1,n));modal.dataset.wizardStep=String(step);controls.scrollTop=0;
 for(const b of progress.querySelectorAll('button')){const i=Number(b.dataset.rwStep);b.dataset.active=String(i===step);b.disabled=i>step;b.setAttribute('aria-current',i===step?'step':'false')}
 selection.hidden=step!==1;share.hidden=step!==3;back.hidden=step===1;next.hidden=step===3;
 next.textContent=step===1?'Generer forhåndsvisning →':'Fortsett til deling →';back.textContent=step===3?'← Se forhåndsvisning':'← Velg innhold';
 if(step===2){const filtered=makeReport();if(filtered)api.setReport(filtered);preview.title='Forhåndsvisning av valgt budsjett';api.showMessage('Kontroller beløp og innhold. Bruk Tilbake for å endre hva som er med.')}
 if(step===3){const prepared=api.getReport(),metrics=prepared?.results?.length||0,items=prepared?.rows?.length||0,inputs=prepared?.entries?.length||0;
 const info=document.getElementById('ln-rw-share-details');if(info)info.textContent=metrics+' nøkkeltall · '+items+' budsjettposter · '+inputs+' opplysninger fra beregningen.';
 api.showMessage('Velg hvordan du vil dele rapporten. Ingen e-post sendes automatisk uten at du fullfører sendingen.')}

 if(step===1)api.showMessage('Velg hvilke opplysninger rapporten skal inneholde.');
}
next.addEventListener('click',()=>show(step+1));back.addEventListener('click',()=>show(step-1));
progress.addEventListener('click',e=>{const b=e.target.closest('[data-rw-step]');if(b&&!b.disabled)show(Number(b.dataset.rwStep))});
$('ln-report-open')?.addEventListener('click',()=>{original=api.getReport();usedHash=false;if(original){$('ln-rw-title').value='Mitt budsjett – '+new Intl.DateTimeFormat('nb-NO',{month:'long',year:'numeric'}).format(new Date());show(1)}}); 
// When opening an encrypted recipient link, show the preview directly.
new MutationObserver(()=>{if(!modal.hidden&&!usedHash&&location.hash.startsWith('#delt=')){usedHash=true;original=api.getReport();if(original)$('ln-rw-title').value=original.title;show(2)}}).observe(modal,{attributes:true,attributeFilter:['hidden']});
if(!modal.hidden&&location.hash.startsWith('#delt=')){original=api.getReport();if(original)$('ln-rw-title').value=original.title;usedHash=true;show(2)}
})();
