(()=>{'use strict';
const norm=s=>String(s||'').toLocaleLowerCase('nb-NO').replace(/\s+/g,' ').trim();
const kr=n=>Math.round(n).toLocaleString('nb-NO')+' kr';
const num=value=>{let s=String(value||'').replace(/[\s\u00a0\u202f]/g,'').replace(/[^0-9,.-]/g,'');if(!s)return 0;if(s.includes(',')&&s.includes('.')){const lastComma=s.lastIndexOf(',')>s.lastIndexOf('.');s=lastComma?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'')}else if((s.match(/\./g)||[]).length>1||/^\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replace(/\./g,'');else if(/^\d{1,3}(?:,\d{3})+$/.test(s))s=s.replace(/,/g,'');else s=s.replace(',','.');return Number(s)||0};
const state={topic:null,loan:{amount:null,rate:null,years:null},property:{purpose:null,price:null,equity:null,income:null,debt:null}};
function budget(){const $=id=>num(document.getElementById(id)?.textContent);const rows=document.querySelectorAll('#budget-rows tr'),cats=new Map();
 rows.forEach(row=>{const td=row.querySelectorAll('td');if(td.length<7)return;const label=td[1]?.querySelector('select')?.selectedOptions?.[0]?.textContent||td[1]?.textContent||'',v=num(td[6]?.textContent);if(v>0&&!/(lønn|inntekt|pensjon|trygd|stipend)/i.test(label))cats.set(label,(cats.get(label)||0)+v)});
 return{income:$('budget-income'),expenses:$('budget-expenses'),balance:$('budget-balance'),categories:[...cats].sort((a,b)=>b[1]-a[1])}}
const officialRules='https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/';
function secondHome(t){
 const p=state.property;
 const intro='Det er mulig å kjøpe bolig nummer to, men banken vil normalt vurdere eksisterende boliglån, samlet gjeld, inntekt, egenkapital og kostnadene ved begge boligene. Etter utlånsforskriften er hovedgrensene normalt 90 % belåning, samlet gjeld opptil fem ganger årsinntekt og at du tåler minst 7 % rente eller tre prosentpoeng renteøkning. Banken kan ha strengere krav. ';
 if(/(utleie|leie ut|leie den ut|leie boligen ut|vil leie|leieinntek|investering)/.test(t))p.purpose='utleie';
 else if(/(ferie|fritid|hytte)/.test(t))p.purpose='fritid';
 else if(/(selv|egen bruk|bo selv|familie|pendle|pendler)/.test(t))p.purpose='egen bruk';
 const m=t.match(/(?:bolig(?:en)?|pris|koste|kostnad|kjøpe|prisantydning)\D{0,20}(\d[\d\s.,]*)\s*(millioner|million|mill|kr|kroner)?/i);
 const amount=t.match(/^(\d[\d\s.,]*)\s*(millioner|million|mill|kr|kroner)?(?:\s+kr)?\s*$/i);
 const v=m||amount;if(v){let n=num(v[1]);if(/mill/.test(v[2]||''))n*=1e6;if(n>=100000&&n<1e10)p.price=n}
 if(/(egenkapital|sparepeng|oppspart|kontant)/.test(t)){const x=t.match(/(\d[\d\s.,]*)\s*(millioner|million|mill|kr|kroner)?/);if(x){let n=num(x[1]);if(/mill/.test(x[2]||''))n*=1e6;if(n>=0&&n<1e10)p.equity=n}}
 if(/(årsinntekt|årslønn|lønn|bruttoinntekt)/.test(t)){const x=t.match(/(\d[\d\s.,]*)\s*(millioner|million|mill|kr|kroner)?/);if(x){let n=num(x[1]);if(/mill/.test(x[2]||''))n*=1e6;if(n>=10000&&n<1e10)p.income=n}}
 if(/(eksisterende lån|gjeld fra før|boliglån i dag|restgjeld|gjeld)/.test(t)){const x=t.match(/(\d[\d\s.,]*)\s*(millioner|million|mill|kr|kroner)?/);if(x){let n=num(x[1]);if(/mill/.test(x[2]||''))n*=1e6;if(n>=0&&n<1e10)p.debt=n}}
 if(!p.purpose)return{text:'Ja, vi kan undersøke muligheten for å kjøpe bolig nummer to. '+intro+'Skal den nye boligen leies ut, brukes som fritidsbolig, eller skal du bo der selv?',href:'#sjekk',sourceUrl:officialRules,follow:['Jeg vil leie den ut','Jeg skal bo der selv','Det er en fritidsbolig']};
 if(p.price===null)return{text:'Da ser vi på en ekstra bolig til '+(p.purpose==='utleie'?'utleie':p.purpose==='fritid'?'fritidsbruk':'egen bruk')+'. '+intro+'Hva er omtrent kjøpesummen du ser for deg, for eksempel «3 millioner kr»?',href:'#sjekk',sourceUrl:officialRules,follow:['3 millioner kr','4 millioner kr','5 millioner kr']};
 const minEquity=p.price*.1;
 if(p.equity===null)return{text:'Med en kjøpesum på '+kr(p.price)+' tilsvarer 10 % av prisen '+kr(minEquity)+'. Det kan i tillegg komme dokumentavgift og andre kjøpskostnader, og banken vurderer egenkapital og pant samlet. Hvor mye egenkapital eller tilgjengelig sikkerhet har du til denne boligen?',href:'#sjekk',follow:['Jeg har 500 000 kr i egenkapital','Jeg har egenkapital i første bolig']};
 if(p.income===null)return{text:'Vi har nå kjøpesum '+kr(p.price)+' og tilgjengelig egenkapital '+kr(p.equity)+'. Hvor stor er din årlige bruttoinntekt? Banken ser på samlet gjeld i forhold til inntekt.',href:'#sjekk'};
 if(p.debt===null)return{text:'Med brutto årsinntekt '+kr(p.income)+' er en generell grense etter utlånsforskriften '+kr(p.income*5)+' i samlet gjeld, men betalingsevne og andre forhold kan gi en lavere låneramme. Hvor mye lån og annen gjeld har du allerede?',href:'#sjekk',sourceUrl:officialRules};
 const potential=p.income*5-p.debt,need=Math.max(0,p.price-p.equity);
 return{text:'Foreløpig oversikt for bolig nr. 2: kjøpesum '+kr(p.price)+', egenkapital '+kr(p.equity)+', eksisterende gjeld '+kr(p.debt)+' og brutto årsinntekt '+kr(p.income)+'. Antatt nytt lånebehov før omkostninger: '+kr(need)+'. Ledig gjeldsramme etter fem-ganger-regelen: '+kr(Math.max(0,potential))+'. '+(need>potential?'Lånebehovet overstiger denne generelle rammen.':'Rammen alene utelukker ikke kjøpet, men banken må også vurdere evnen til å betale begge lån og øvrige kostnader.')+' Dette er kun en forenklet vurdering, ikke lånetilsagn. Vil du beregne månedlige lånekostnader eller se på forventede leieinntekter?',href:'#sjekk',sourceUrl:officialRules,follow:['Regn ut månedskostnaden','Hva hvis jeg leier ut?']};
}
function response(q){const t=norm(q),vague=/^(ja|gjerne|ok|fortell mer|mer|nei|hvordan da|fortsett|ja takk)[.!? ]*$/.test(t),b=budget();let topic=vague?state.topic:null;
 if(/rapport|pdf|dele|deling|mail|e-post|epost|facebook|instagram|lenke/.test(t))topic='report';
 else if(/lån|låne|rente|termin|nedbetaling/.test(t)||(state.topic==='loan'&&(/\d[\d .,]*(kr|millioner|mill)\b/.test(t)||/\d+(?:[.,]\d+)?\s*%/.test(t)||/\d+\s*år/.test(t)||/^[\d\s.,]+$/.test(t))))topic='loan';
 else if(state.topic==='report'&&/^(hele budsjettet|bare hovedtallene|alle poster|alle postene)/.test(t))topic='report';
 else if(/budsjett|spare|sparing|utgift|inntekt|forbruk|overskudd|reduser|kutte/.test(t)||(state.topic==='budget'&&/(kostnad|største|størst|postene|postene mine|gå gjennom|disse|forklar|hvor mye|mat|bolig|transport)/.test(t)))topic='budget';
 else if(/fond|aksje|investering/.test(t))topic='invest';
 else if(/kvittering/.test(t))topic='receipt';
 state.topic=topic||state.topic;
 if(/(porno|pornografi|seksualitet|seksuell orientering|homo|homofil|skeiv)/.test(t)){
   if(/(homo|homofil|skeiv|gutt)/.test(t))return{text:'Det er helt vanlig at gutter eller menn tiltrekkes av andre gutter eller menn. Det er ikke noe galt med å være homofil eller skeiv. Lurer du på noe konkret om seksualitet eller forhold, kan du gjerne spørre.'};
   return{text:'Pornografi er seksuelt innhold beregnet for voksne. Jeg kan gi generell informasjon om samtykke, nettvett og hvordan pornografi kan påvirke forventninger til sex og forhold, hvis du lurer på det.'};
 }
 const propertyIntent=/(sekundærbolig|utleiebolig|boligkjøp|kjøp(?:e|er)? (?:en )?(?:ny |annen |ekstra |andre )?bolig|bolig (?:nummer |nr[.]? ?)?(?:2|to)\b|bolig nr[.]? ?2|bolig nummer to|enda en bolig|bolig til utleie|eiendom nr[.]? ?2)/.test(t);
 const propertyReply=state.topic==='secondhome'&&(/^(utleie|leie ut|jeg vil leie|egen bruk|jeg skal bo|fritid|hytte|ferie|selv)/.test(t)||/^\d[\d\s.,]*(millioner|million|mill|kr|kroner)?(?:\s+kr)?\s*$/.test(t)||/(egenkapital|årsinntekt|årslønn|bruttoinntekt|gjeld|restgjeld)/.test(t));
 if(propertyIntent||propertyReply){state.topic='secondhome';return secondHome(t)}
 if(/(effektiv rente|nominell rente)/.test(t))return{text:'Nominell rente er selve lånerenten. Effektiv rente inkluderer også gebyrer og viser dermed en mer samlet lånekostnad. Når du sammenligner lånetilbud, er effektiv rente ofte best å bruke. Vil du beregne forskjellen på to renter?',href:'#sjekk',follow:['Vis et eksempel','Hva koster et lån?']};
 if(/(refinansier|refinansiering|samle lån)/.test(t))return{text:'Refinansiering betyr å endre eller samle eksisterende gjeld. For boliglån er det særlig effektiv rente, nedbetalingstid, gebyrer og eventuelle kostnader ved å bytte bank som er relevante. Ønsker du å sammenligne et nytt tilbud med lånet du har i dag?',href:'#sjekk',follow:['Sammenlign renter','Hva er effektiv rente?']};
 if(/(bufferkonto|buffer|nødspare|uforutsett)/.test(t))return{text:'En bufferkonto er penger satt av til uforutsette utgifter, som reparasjoner eller plutselige regninger. Hvor stor buffer som passer, avhenger av faste kostnader og økonomisk risiko. Vil du ta utgangspunkt i budsjettet ditt og lage et månedlig sparemål?',href:'#budsjett',follow:['Se på budsjettet mitt','Hvordan spare mer?']};
 if(/(skatt|skattekort|tabelltrekk|prosenttrekk)/.test(t))return{text:'Skattekort kan bruke tabelltrekk eller prosenttrekk. Forskuddstrekket er ikke nødvendigvis lik den endelige skatten. I budsjettverktøyet kan du se et anslag over nettolønn, men for riktig skattekort må du bruke Skatteetaten. Vil du se på hvordan skattetrekk påvirker månedens budsjett?',href:'#budsjett',follow:['Åpne Budsjett','Hva betyr tabelltrekk?']};
 if(/(forsikring|innboforsikring|husforsikring)/.test(t))return{text:'Forsikringsutgifter bør stå i budsjettet som faste eller årlige kostnader. Ved sammenligning er både pris, egenandel og dekning viktige. Vil du legge forsikringen inn i budsjettet eller få forklart forskjellen på egenandel og dekning?',href:'#budsjett'};
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
  if(/(største|størst|gå gjennom|kostnadene|utgiftskategoriene)/.test(t)){
   if(!b.categories.length)return{text:'Jeg ser ingen positive utgiftsposter i budsjettet ennå. Legg inn noen utgifter først, så kan vi gå gjennom dem én etter én.',href:'#budsjett'};
   const list=b.categories.slice(0,5).map(([category,amount],i)=>(i+1)+'. '+category+': '+kr(amount)).join('; ');
   return{text:'Dette er de største registrerte utgiftskategoriene dine per måned: '+list+'. Til sammen bruker du '+kr(b.expenses)+' på utgifter. Hvilken kategori vil du undersøke først? Vi kan se på konkrete muligheter for å spare, uten å anta at alt kan kuttes.',href:'#budsjett',follow:b.categories.slice(0,3).map(([name])=>'Se på '+name)};
  }
  if(b.income===0&&b.expenses===0)return{text:'Jeg ser ingen registrerte budsjettbeløp ennå. Legg inn netto inntekt og faste utgifter først, så kan jeg hjelpe deg med å forstå resultatet. Vil du begynne med inntektene eller utgiftene?',href:'#budsjett'};
  const top=b.categories.slice(0,3).map(([name,value])=>name+' ('+kr(value)+')').join(', ');
  const cut=t.match(/(?:kutter|spare|sparer|reduserer)\s*([\d\s.,]+)\s*kr/);
  if(cut){const v=num(cut[1]);if(v>0)return{text:'Hvis du klarer å spare '+kr(v)+' ekstra hver måned, er det '+kr(v*12)+' på ett år. Med dagens budsjett får du da rundt '+kr(b.balance+v)+' igjen per måned, så lenge resten er likt.',href:'#budsjett'}}
  if(/spare|kutte|forbedre|mer igjen|fortell mer|hvordan da/.test(t)||vague)return{text:'Jeg ser '+kr(b.income)+' i netto inntekt og '+kr(b.expenses)+' i utgifter. Du har '+kr(b.balance)+' til overs per måned. '+(top?'De største utgiftskategoriene er '+top+'. ':'')+'Vil du vurdere hvilke av disse utgiftene du realistisk kan redusere?',href:'#budsjett',follow:['Hva hvis jeg sparer 1 000 kr?','Forklar utgiftene']};
  return{text:'Budsjettet viser inntekt '+kr(b.income)+', utgifter '+kr(b.expenses)+' og '+kr(b.balance)+' til overs per måned. Jeg henter disse tallene lokalt fra budsjettet du ser på. Vil du gå gjennom de største kostnadene eller lage en rapport?',href:'#budsjett',follow:['Hvor kan jeg spare mer?','Lag budsjettrapport']};
 }
 if(topic==='invest')return{text:'Du kan sammenligne fond og aksjer i investeringsverktøyet. En god start er å se på sparehorisont, risiko og hva du tåler av svingninger. Vil du vite mer om indeksfond eller aksjer?',href:'#investering'};
 if(topic==='receipt')return{text:'Kvitteringsoversikten hjelper deg å se hva innkjøpene faktisk koster. Vil du gjennomgå et kjøp eller sammenligne forbruk fra flere kvitteringer?',href:'#kvitteringer'};
 return{text:t.length<5?'Jeg fikk bare med meg «'+String(q).trim().slice(0,20)+'». Kan du skrive litt mer om hva du ønsker å spørre om?':'Jeg er usikker på hva du mener med dette. Gjelder det budsjettet ditt, et lån eller noe annet? Fortell gjerne litt mer, så kan jeg hjelpe deg videre.',follow:['Forstå budsjettet mitt','Hva koster et lån?']};
}
window.LNConversationBrain={response,budget,reset:()=>{state.topic=null;state.loan={amount:null,rate:null,years:null};state.property={purpose:null,price:null,equity:null,income:null,debt:null}}};
})();