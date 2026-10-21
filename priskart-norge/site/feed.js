(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const client=window.supabase?.createClient('https://pryrgwfjniggjlrizenh.supabase.co','sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const fmt=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2});
 const types={'95':'Bensin 95','98':'Bensin 98',diesel:'Diesel',ccs:'Lading CCS',type2:'Lading Type 2',chademo:'Lading CHAdeMO'};
 async function fetchFeed(){
  const root=$('feed-list');root.replaceChildren();$('feed-count').textContent='Henter rapporter …';
  if(!client){$('feed-count').textContent='Klarte ikke starte datatilkoblingen.';return}
  try{
   const {data,error}=await client.from('price_reports').select('id,station_id,price,product_code,created_at,stations(name,kind)').eq('status','approved').order('created_at',{ascending:false}).limit(40);
   if(error)throw error;
   const list=data||[];
   $('feed-count').textContent=list.length?'Viser '+list.length+' siste innmeldinger':'Ingen nye brukerinnmeldinger ennå.';
   if(!list.length){
     const text=document.createElement('p');text.className='empty';
     text.textContent='Her kommer nye prisrapporter etter hvert som folk melder inn priser fra stasjoner rundt om i Norge.';
     root.append(text);return;
   }
   for(const p of list){
    const card=document.createElement('article');card.className='entry';
    const desc=document.createElement('div'),value=document.createElement('div');
    const label=document.createElement('div');label.className='mini-label';
    label.textContent=(p.stations?.kind==='charge'?'⚡ Lading':'⛽ Drivstoff')+' · Ikke verifisert';
    const name=document.createElement('strong');name.textContent=p.stations?.name||'Stasjon';
    const small=document.createElement('small');small.textContent=(types[p.product_code]||p.product_code)+' · '+new Intl.DateTimeFormat('nb-NO',{dateStyle:'short',timeStyle:'short'}).format(new Date(p.created_at));
    const link=document.createElement('a');link.href='./index.html?stasjon='+encodeURIComponent(p.station_id);link.textContent='Vis stasjonen ↗';
    desc.append(label,name,small,link);
    value.className='price';value.textContent=fmt.format(p.price)+' kr';
    const unit=document.createElement('small');unit.textContent=p.stations?.kind==='charge'?'per kWh':'per liter';value.append(unit);
    card.append(desc,value);root.append(card);
   }
  }catch(e){$('feed-count').textContent='Kunne ikke hente rapporter fra databasen. Prøv igjen senere.';console.warn('Feed error',e)}
 }
 $('feed-reload').addEventListener('click',fetchFeed);fetchFeed();
})();