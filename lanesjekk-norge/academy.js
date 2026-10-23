/* Original Lånesjekk Akademi micro-lessons. No tracking or accounts. */
(()=>{
 'use strict';
 const questions=[
  {q:'Du setter 100 000 kr på en konto med 4 % nominell årlig rente. Omtrent hvor mye tjener du i rente første året før skatt, hvis saldoen står uendret?',choices:['400 kr','4 000 kr','40 000 kr'],correct:1,why:'100 000 × 0,04 = 4 000 kr. Faktisk utbetaling og effektiv rente kan variere med kapitalisering og vilkår.',source:'https://www.forbrukerradet.no/finansportalen/'},
  {q:'Hva bør du sammenligne når du vurderer to lånetilbud med ulikt etableringsgebyr?',choices:['Bare nominell rente','Både effektiv rente, gebyrer, løpetid og totalbeløp','Bare navnet på banken'],correct:1,why:'Et lavt nominelt rentetall sier ikke alt. Etableringsgebyr og termingebyr påvirker den samlede kredittkostnaden.',source:'https://www.forbrukerradet.no/finansportalen/'},
  {q:'Du har flere sparekontoer i samme norske bank. Hva er den vanlige hovedregelen for innskuddsgaranti?',choices:['2 mill. kr per konto','2 mill. kr per kunde per bank','Ingen garanti dersom du har mer enn én konto'],correct:1,why:'Hovedregelen er inntil 2 millioner kroner per kunde per bank, på tvers av kontoer. Særlige regler og utenlandske filialer kan avvike.',source:'https://www.bankenessikringsfond.no/'},
  {q:'Hvilke utgifter må du normalt legge til selv hvis du bruker SIFOs referansebudsjett?',choices:['Mat og dagligvarer','Bolig og strøm','Klær og sko'],correct:1,why:'SIFOs referansebudsjett dekker mange vanlige forbrukskategorier, men bolig og strøm skal normalt legges til separat.',source:'https://www.oslomet.no/no/om/sifo/referansebudsjettet'}
 ];
 const $=id=>document.getElementById(id);
 let current=0,chosen=-1,score=0;
 function draw(){
  const item=questions[current];
  $('academy-count').textContent=(current+1)+' av '+questions.length;
  $('academy-progress').style.width=(100*current/questions.length)+'%';
  $('academy-question').textContent=item.q;
  $('academy-score').textContent=score+' riktige';
  $('academy-feedback').hidden=true;
  $('academy-feedback').classList.remove('is-wrong');
  $('academy-options').replaceChildren();
  $('academy-next').disabled=true;
  $('academy-next').textContent=current===questions.length-1?'Vis resultat →':'Neste spørsmål →';
  chosen=-1;
  for(const [index,answer] of item.choices.entries()){
   const btn=document.createElement('button');btn.type='button';btn.textContent=answer;
   btn.setAttribute('aria-pressed','false');
   btn.addEventListener('click',()=>choose(index));$('academy-options').append(btn);
  }
 }
 function choose(index){
  if(chosen!==-1)return;
  chosen=index;
  const item=questions[current],correct=index===item.correct;
  if(correct)score++;
  $('academy-score').textContent=score+' riktige';
  const feedback=$('academy-feedback');
  feedback.classList.toggle('is-wrong',!correct);
  const summary=document.createElement('strong');summary.textContent=correct?'✓ Helt riktig!':'Ikke helt. Riktig svar: '+item.choices[item.correct];
  const p=document.createElement('p');p.textContent=item.why;
  const link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Les mer hos kilden ↗';
  feedback.replaceChildren(summary,p,link);feedback.hidden=false;
  $('academy-options').querySelectorAll('button').forEach((b,i)=>{
    b.disabled=true;b.setAttribute('aria-pressed',String(i===index));
    if(i===item.correct)b.dataset.correct='true';
  });
  $('academy-next').disabled=false;
 }
 function finish(){
  $('academy-progress').style.width='100%';
  $('academy-question').textContent='Du fikk '+score+' av '+questions.length+' riktige!';
  $('academy-count').textContent='Fullført';
  $('academy-options').replaceChildren();
  $('academy-feedback').replaceChildren();$('academy-feedback').hidden=false;
  const p=document.createElement('p');
  p.textContent='Dette er en enkel læringstest, ikke individuell finansiell rådgivning. Du kan prøve igjen eller lese mer i artiklene våre.';
  $('academy-feedback').append(p);
  $('academy-next').textContent='↺ Prøv igjen';
  $('academy-next').disabled=false;
  current=questions.length;
 }
 function next(){
  if(current===questions.length){score=0;current=0;draw();return}
  if(chosen===-1)return;
  current++;
  if(current===questions.length)finish();
  else draw();
 }
 document.addEventListener('DOMContentLoaded',()=>{
  if(!$('academy-options'))return;
  $('academy-next').addEventListener('click',next);draw();
 });
})();
