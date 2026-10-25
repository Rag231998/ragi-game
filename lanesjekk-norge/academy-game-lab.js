(()=>{'use strict';
const root=document.getElementById('academy-game-lab');if(!root)return;
const questions={
 budget:[['Du får 30 000 kr utbetalt og bruker 27 000 kr. Hvor mye er igjen?',['3 000 kr','2 700 kr','30 000 kr'],0,'30 000 − 27 000 = 3 000 kr.'],['Hva bør en buffer normalt brukes til?',['Uforutsette nødvendige utgifter','Risikoaksjer','Dyre impulskjøp'],0,'Buffer gir tilgjengelige penger ved uventede utgifter.']],
 loan:[['Hva skjer normalt med månedskostnaden hvis renten øker?',['Den øker','Den faller','Den blir alltid lik'],0,'Høyere rente øker normalt rentebelastningen.'],['Hva gjør effektiv rente mer sammenlignbar?',['Den inkluderer relevante gebyrer','Den er alltid null','Den er bare avdrag'],0,'Effektiv rente tar med kostnader etter reglene for beregningen.']],
 saving:[['Hva er rentes rente?',['Avkastning også på tidligere renter','Et engangsgebyr','Kun skatt'],0,'Tidligere opptjente renter kan gi ny rente.'],['Hva er viktig før langsiktig fondssparing?',['Risiko og tidshorisont','Å få garantert gevinst','Å ignorere kostnader'],0,'Fond har risiko, gebyrer og ingen garantert avkastning.']],
 tax:[['Hva er forskjellen på tabelltrekk og prosenttrekk?',['Ulike måter å beregne forskuddstrekk','Tabelltrekk betyr skattefritak','Prosenttrekk er alltid sluttlig skatt'],0,'Begge er former for forskuddstrekk; endelig skatt beregnes senere.'],['Hva bør du gjøre dersom inntekten endrer seg mye?',['Kontrollere skattekortet','Ignorere endringen','Fjerne all skatt'],0,'Oppdater skattekortet for mer passende forskuddstrekk.']]
};
const topics={budget:'Budsjett',loan:'Lån og renter',saving:'Sparing og fond',tax:'Skatt'};
let topic='budget',index=0,score=0,answered=false;
const $=id=>document.getElementById(id);
function render(){
 const q=questions[topic][index];answered=false;
 $('academy-game-topic').textContent=topics[topic]+' · '+(index+1)+' av '+questions[topic].length;
 $('academy-game-question').textContent=q[0];$('academy-game-options').replaceChildren();
 $('academy-game-feedback').textContent='';$('academy-game-next').disabled=true;
 q[1].forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.className='academy-game-option';b.textContent=answer;b.onclick=()=>{if(answered)return;answered=true;if(i===q[2])score++;$('academy-game-feedback').textContent=(i===q[2]?'Riktig! ':'Ikke helt. ')+q[3];$('academy-game-next').disabled=false;[...$('academy-game-options').children].forEach((node,k)=>{node.disabled=true;node.dataset.correct=String(k===q[2]);});$('academy-game-score').textContent=score+' poeng';};$('academy-game-options').append(b);});
 $('academy-game-next').textContent=index===questions[topic].length-1?'Spill på nytt':'Neste oppgave';
}
$('academy-game-select').addEventListener('change',e=>{topic=e.target.value;index=0;score=0;$('academy-game-score').textContent='0 poeng';render()});
$('academy-game-next').onclick=()=>{if(index===questions[topic].length-1){index=0;score=0;$('academy-game-score').textContent='0 poeng'}else index++;render();};render();
const zone=$('academy-live-zone'),status=$('academy-live-status'),value=$('academy-live-value');
async function refresh(){
 status.textContent='Henter publiserte strømpriser …';value.textContent='–';
 try{
 const response=await fetch('/api/market-feed?zone='+encodeURIComponent(zone.value),{cache:'no-store'});
 const data=await response.json();if(!response.ok||!data.ok)throw Error(data.error||'Datakilden svarte ikke.');
 value.textContent=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2}).format(data.price)+' kr/kWh';
 status.textContent='Spotpris ekskl. mva., avgifter, påslag og nettleie · '+data.zone+' · '+data.hour+' · oppdatert '+data.fetchedAt;
 }catch(err){status.textContent='Strømprisen er ikke tilgjengelig nå. '+(err.message||'Prøv igjen senere.');}
}
$('academy-live-refresh').onclick=refresh;zone.onchange=refresh;void refresh();
})();