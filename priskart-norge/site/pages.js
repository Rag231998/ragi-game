/* FAQ and privacy content: editable with admin CMS. Public read-only. */
(()=>{'use strict';
 const project='https://pryrgwfjniggjlrizenh.supabase.co',key='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
 const $=id=>document.getElementById(id);
 const page=document.body.dataset.page;
 const db=window.supabase?.createClient(project,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const fallback=[
 ['Hvor oppdaterte er prisene?','PrisKart viser dato og kilde for hver registrerte pris. Historiske priser kan være utdaterte, og ukjente priser vises som ukjent.'],
 ['Er ladere ledige akkurat nå?','Vi har kartlagt ladestasjoner og noe teknisk informasjon. Tilgjengelighet i sanntid er ikke integrert.'],
 ['Kan jeg legge inn en pris?','Ja. Velg en stasjon i kartet og logg inn for å melde inn en observert pris.']
 ];
 async function faq(){
  const root=$('faq-list');root.replaceChildren();
  let entries=[];
  try{
   if(!db)throw Error('Ingen databaseforbindelse');
   const {data,error}=await db.from('site_faq').select('question,answer').eq('published',true).order('sort_order').order('question').limit(100);
   if(error)throw error;entries=(data||[]).map(x=>[x.question,x.answer]);
  }catch(e){console.warn('FAQ failed, using basic help',e)}
  for(const [question,answer] of (entries.length?entries:fallback)){
   const d=document.createElement('details'),summary=document.createElement('summary'),body=document.createElement('p');
   summary.textContent=question;body.textContent=answer;
   d.append(summary,body);root.append(d);
  }
 }
 async function privacy(){
  if(db)try{
   const {data,error}=await db.from('site_settings').select('operator_name,organization_number,contact_email').eq('id',1).maybeSingle();
   if(error)throw error;
   if(data?.operator_name)$('privacy-controller').textContent=data.operator_name;
   if(data?.organization_number)$('privacy-org').textContent=data.organization_number;
   if(data?.contact_email&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contact_email)){
    const link=document.createElement('a');link.href='mailto:'+data.contact_email;link.textContent=data.contact_email;
    $('privacy-contact').replaceChildren(link);
   }
   if(data?.operator_name&&data?.contact_email)$('controller-warning').hidden=true;
  }catch(e){console.warn('Site owner info unavailable',e)}
  let selection='ikke registrert';
  try{
   const val=localStorage.getItem('priskart_consent_v1');
   selection=val==='preferences'?'Husk mine filtervalg':val==='necessary'?'Kun nødvendige':'Ikke valgt';
  }catch(e){}
  $('privacy-choice-status').textContent='Ditt valg: '+selection+'.';
  $('privacy-change-choice').addEventListener('click',()=>{
   try{localStorage.removeItem('priskart_consent_v1');localStorage.removeItem('priskart_filter_preferences_v1')}
   catch(e){}
   window.location.href='./index.html?cookievalg=1';
  });
 }
 if(page==='faq')faq();else if(page==='privacy')privacy();
})();