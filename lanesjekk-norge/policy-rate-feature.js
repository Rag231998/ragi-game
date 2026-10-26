(()=>{'use strict';
const target=document.getElementById('policy-rate-value');if(!target)return;
const status=document.getElementById('policy-rate-status'),date=document.getElementById('policy-rate-date');
const until='2026-11-05',snapshot={rate:4.5,date:'2026-09-24'};
const current=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Oslo'});
const display=(rate,day,description)=>{target.textContent=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2}).format(rate)+' %';date.textContent='Publisert '+day.split('-').reverse().join('.');status.textContent=description};
const canSnapshot=current()<until;
if(canSnapshot)display(snapshot.rate,snapshot.date,'Sist bekreftede rentebeslutning fra Norges Bank – ikke sanntidsdata.');
else{target.textContent='—';date.textContent='Ny bekreftelse kreves';status.textContent='Kontrollerer Norges Banks nyeste rentebeslutning …'}
fetch('/api/policy-rate',{cache:'no-store',headers:{Accept:'application/json'}}).then(async response=>{const data=await response.json();if(!response.ok||!data.ok||!Number.isFinite(data.rate)||!/^\d{4}-\d\d-\d\d$/.test(data.date))throw Error('Ubekreftet rentetall');if(canSnapshot&&(data.rate!==snapshot.rate||data.date!==snapshot.date))throw Error('Motstridende rentetall');display(data.rate,data.date,data.snapshot?'Sist bekreftede rentebeslutning fra Norges Bank – ikke sanntidsdata.':'Publisert styringsrente fra Norges Bank – ikke boliglånsrente.')}).catch(()=>{if(!canSnapshot){target.textContent='—';date.textContent='Mangler bekreftet verdi';status.textContent='Kan ikke hente en bekreftet styringsrente. Se Norges Bank via kildelenken.'}});
})();