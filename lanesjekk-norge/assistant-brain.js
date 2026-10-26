(()=>{'use strict';
const norm=s=>String(s||'').toLocaleLowerCase('nb-NO').replace(/\s+/g,' ').trim();
const kr=n=>Math.round(n).toLocaleString('nb-NO')+' kr';
const num=value=>{let s=String(value||'').replace(/[\s\u00a0\u202f]/g,'').replace(/[^0-9,.-]/g,'');if(!s)return 0;if(s.includes(',')&&s.includes('.')){const lastComma=s.lastIndexOf(',')>s.lastIndexOf('.');s=lastComma?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'')}else if((s.match(/\./g)||[]).length>1||/^\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replace(/\./g,'');else if(/^\d{1,3}(?:,\d{3})+$/.test(s))s=s.replace(/,/g,'');else s=s.replace(',','.');return Number(s)||0};
const state={topic:null,loan:{amount:null,rate:null,years:null}};
function budget(){const $=id=>num(document.getElementById(id)?.textContent);const rows=document.querySelectorAll('#budget-rows tr'),cats=new Map();
 rows.forEach(row=>{const td=row.querySelectorAll('td');if(td.length<7)return;const label=td[1]?.querySelector('select')?.selectedOptions?.[0]?.textContent||td[1]?.textContent||'',v=num(td[6]?.textContent);if(v>0&&!/(lønn|inntekt|pensjon|trygd|stipend)/i.test(label))cats.set(label,(cats.get(label)||0)+v)});
 return{income:$('budget-income'),expenses:$('budget-expenses'),balance:$('budget-balance'),categories:[...cats].sort((a,b)=>b[1]-a[1])}}
function response(q){const t=norm(q),vague=/^(ja|gjerne|ok|fortell mer|mer|nei|hvordan da|fortsett|ja takk)[.!? ]*$/.test(t),b=budget();let topic=vague?state.topic:null;
 if(/rapport|pdf|dele|deling|mail|e-post|epost|facebook|instagram|lenke/.test(t))topic='report';
 else if(/lån|låne|rente|termin|nedbetaling/.test(t)||(state.topic==='loan'&&(/\d[\d .,]*(kr|millioner|mill)\b/.test(t)||/\d+(?:[.,]\d+)?\s*%/.test(t)||/\d+\s*år/.test(t)||/^[\d\s.,]+$/.test(t))))topic='loan';
 else if(state.topic==='report'&&/^(hele budsjettet|bare hovedtallene|alle poster|alle postene)/.test(t))topic='report';
 else if(/budsjett|spare|sparing|utgift|inntekt|forbruk|overskudd|reduser|kutte/.test(t))topic='budget';
 else if(/fond|aksje|investering/.test(t))topic='invest';
 else if(/kvittering/.test(t))topic='receipt';
 state.topic=topic||state.topic;
 if(/^(hei|hallo|heisann|god dag)/.test(t))return{text:'Hei! Hva ønsker du å finne ut i dag? Vi kan se på budsjettet ditt, regne på et lån eller snakke om sparing.',follow:['Se på budsjettet mitt','Hva koster et lån?']};
 if(/takk|det hjalp/.test(t))return{text:'Bare hyggelig! Vi kan fortsette med et annet spørsmål når du vil.'};
 if(topic==='report')return{text:'Dette gjør du i Budsjett, ikke i chatten: Trykk «Lag PDF / del budsjettet», velg hvilke opplysninger som skal være med, se forhåndsvisningen og del PDF eller kopier en kryptert lenke. Egen forklaring på lokal og privat lagring ligger rett under budsjettverktøyene. Hva ønsker du å dele?',href:'#budsjett',follow:['Hele budsjettet','Bare hovedtallene']};
 if(topic==='loan'){
  const amount=t.match(/([\d][\d\s.,]*)\s*(millioner|million|mill|kr|kroner)\b/)||((state.loan.amount===null&&/^[\d\s.,]+$/.test(t)&&num(t)>=10000)?[null,t,'kr']:null);
  if(amount){let n=num(amount[1]);if(/mill/.test(amount[2]))n*=1e6;if(n>=10000)state.loan.amount=n}
  const rate=t.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:%|prosent)/)||((state.loan.amount!==null&&state.loan.rate===null&&/^\d{1,2}(?:[.,]\d{1,2})?$/.test(t))?[null,t]:null);if(rate)state.loan.rate=/(øker|opp|høyere|mer)/.test(t)&&state.loan.rate!==null?state.loan.rate+num(rate[1]):/(synker|ned|lavere|mindre)/.test(t)&&state.loan.rate!==null?Math.max(0,state.loan.rate-num(rate[1])):num(rate[1]);
  const years=t.match(/(\d{1,2})\s*år/)||((state.loan.amount!==null&&state.loan.rate!==null&&state.loan.years===null&&/^\d{1,2}$/.test(t))?[null,t]:null);if(years)state.loan.years=Number(years[1]);
  const l=state.loan;if(l.amount===null)return{text:'Vi kan beregne dette sammen. Hvor stort lån vurderer du, for eksempel «3 millioner kr»?',href:'#sjekk'};
  if(l.rate===null)return{text:'Da regner vi på '+kr(l.amount)+'. Hvilken årlig rente skal vi bruke, for eksempel «5,2 %»?',href:'#sjekk'};
  if(l.years===null)return{text:'Vi har '+kr(l.amount)+' og '+l.rate+' % rente. Hvor lang nedbetalingstid ser du for deg, for eksempel «25 år»?',href:'#sjekk'};
  const n=l.years*12,r=l.rate/1200,payment=r?l.amount*r/(1-(1+r)**(-n)):l.amount/n;
  return{text:'Med '+kr(l.amount)+', '+l.rate+' % nominell rente og '+l.years+' år er anslått terminbeløp '+kr(payment)+' per måned. Anslåtte rentekostnader i hele perioden: '+kr(payment*n-l.amount)+'. Det forutsetter uendret rente og tar ikke med gebyrer. Vil du sammenligne med en annen rente?',href:'#sjekk',follow:['Hva om renten øker?','Hva betyr effektiv rente?']};
 }
 if(topic==='budget'){
  if(b.income===0&&b.expenses===0)return{text:'Jeg ser ingen registrerte budsjettbeløp ennå. Legg inn netto inntekt og faste utgifter først, så kan jeg hjelpe deg med å forstå resultatet. Vil du begynne med inntektene eller utgiftene?',href:'#budsjett'};
  const top=b.categories.slice(0,3).map(([name,value])=>name+' ('+kr(value)+')').join(', ');
  const cut=t.match(/(?:kutter|spare|sparer|reduserer)\s*([\d\s.,]+)\s*kr/);
  if(cut){const v=num(cut[1]);if(v>0)return{text:'Hvis du klarer å spare '+kr(v)+' ekstra hver måned, er det '+kr(v*12)+' på ett år. Med dagens budsjett får du da rundt '+kr(b.balance+v)+' igjen per måned, så lenge resten er likt.',href:'#budsjett'}}
  if(/spare|kutte|forbedre|mer igjen|fortell mer|hvordan da/.test(t)||vague)return{text:'Jeg ser '+kr(b.income)+' i netto inntekt og '+kr(b.expenses)+' i utgifter. Du har '+kr(b.balance)+' til overs per måned. '+(top?'De største utgiftskategoriene er '+top+'. ':'')+'Vil du vurdere hvilke av disse utgiftene du realistisk kan redusere?',href:'#budsjett',follow:['Hva hvis jeg sparer 1 000 kr?','Forklar utgiftene']};
  return{text:'Budsjettet viser inntekt '+kr(b.income)+', utgifter '+kr(b.expenses)+' og '+kr(b.balance)+' til overs per måned. Jeg henter disse tallene lokalt fra budsjettet du ser på. Vil du gå gjennom de største kostnadene eller lage en rapport?',href:'#budsjett',follow:['Hvor kan jeg spare mer?','Lag budsjettrapport']};
 }
 if(topic==='invest')return{text:'Du kan sammenligne fond og aksjer i investeringsverktøyet. En god start er å se på sparehorisont, risiko og hva du tåler av svingninger. Vil du vite mer om indeksfond eller aksjer?',href:'#investering'};
 if(topic==='receipt')return{text:'Kvitteringsoversikten hjelper deg å se hva innkjøpene faktisk koster. Vil du gjennomgå et kjøp eller sammenligne forbruk fra flere kvitteringer?',href:'#kvitteringer'};
 return{text:'Fortell gjerne litt mer om det du ønsker hjelp med. Jeg kan forklare budsjett, sparing, lån, investering og rapportdeling. Du kan skrive et spørsmål helt vanlig, så følger jeg opp med et mer konkret spørsmål.',follow:['Forstå budsjettet mitt','Hva koster et lån?']};
}
window.LNConversationBrain={response,budget,reset:()=>{state.topic=null;state.loan={amount:null,rate:null,years:null}}};
})();