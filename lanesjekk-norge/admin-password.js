/* Dedicated administrator password recovery page; Supabase publishable key only. */
(()=>{
'use strict';
const SUPABASE_URL='https://pryrgwfjniggjlrizenh.supabase.co';
const SUPABASE_KEY='sb_publishable_nMwAplLiIZ-p9zIu8F3yPQ_-_XwiMM9';
const $=id=>document.getElementById(id);
const hash=new URLSearchParams(location.hash.slice(1));
const query=new URLSearchParams(location.search);
const errorCode=hash.get('error_code')||query.get('error_code')||hash.get('error')||query.get('error');
const fromRecoveryLink=!errorCode&&(hash.get('type')==='recovery'||query.get('type')==='recovery'||query.has('code'));
let recoveryMode=fromRecoveryLink,db=null,activeAdmin=false;
function show(which){
 for(const section of ['account-change','reset-request','reset-create','reset-success'])$(section).hidden=section!==which;
}
function status(id,msg,isError=false){
 const el=$(id);el.textContent=msg;el.dataset.error=String(isError);
}
function guide(){
 const pw=$('password-new').value,check=$('password-repeat').value;
 const bar=$('password-strength-bar'),label=$('password-strength');
 bar.style.width=Math.min(100,pw.length/12*100)+'%';
 bar.dataset.valid=String(pw.length>=8);
 label.textContent=!pw.length?'Minst 8 tegn – anbefalt 12 eller flere.':
  pw.length<8?'Legg til '+(8-pw.length)+' tegn for å oppfylle minstekravet.':
  pw.length<12?'Minstekravet er oppfylt. 12 eller flere tegn anbefales.':
  'Lengdeanbefalingen er oppfylt. Bruk et unikt passord.';
 const match=$('password-match');
 match.textContent=!check?'Skriv inn det samme passordet på nytt.':check===pw?'Passordene er like.':'Passordene er ikke like.';
 match.dataset.matches=String(!!check&&check===pw);
}
function init(){
 if(fromRecoveryLink)show('reset-create');
 if(errorCode){
  show('reset-request');
  status('password-request-status','Lenken er ugyldig eller utløpt. Oppgi e-postadressen og be om en ny lenke.',true);
  history.replaceState(null,'',location.pathname);
 }
 if(!window.supabase){
  status('password-request-status','Innloggingstjenesten kunne ikke lastes. Oppdater siden, eller kontroller innholdsblokkering.',true);
  status('password-create-status','Innloggingstjenesten kunne ikke lastes. Prøv igjen senere.',true);
  return;
 }
 db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
 });
 db.auth.onAuthStateChange(event=>{
  if(event==='PASSWORD_RECOVERY'){
   recoveryMode=true;show('reset-create');
   status('password-create-status','Gjenopprettingslenken er bekreftet. Velg nå et nytt passord.');
  }
 });
 // Logged-in admins can update their own password without the email sender.
 if(!fromRecoveryLink&&!errorCode){
  void db.auth.getUser().then(async({data,error})=>{
   if(error||!data?.user)return;
   const {data:admin,error:adminError}=await db.from('admins').select('user_id').eq('user_id',data.user.id).maybeSingle();
   if(adminError||!admin)return;
   activeAdmin=true;
   $('password-open-account').hidden=false;
   show('account-change');
  }).catch(()=>{});
 }
 $('account-forgot-open').addEventListener('click',()=>show('reset-request'));
 $('password-open-account').addEventListener('click',()=>{if(activeAdmin)show('account-change')});
 $('account-change-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const current=$('account-current').value,newPassword=$('account-new').value,repeat=$('account-repeat').value;
  if(!activeAdmin){status('account-change-status','Logg inn i Studio for å endre passord direkte.',true);return}
  if(!current){status('account-change-status','Skriv inn det nåværende passordet.',true);return}
  if(newPassword.length<8){status('account-change-status','Det nye passordet må ha minst 8 tegn.',true);return}
  if(newPassword!==repeat){status('account-change-status','De nye passordene er ikke like.',true);return}
  if(current===newPassword){status('account-change-status','Velg et annet passord enn det du bruker nå.',true);return}
  const button=$('account-change-submit');button.disabled=true;
  status('account-change-status','Kontrollerer nåværende passord …');
  try{
   const {data:authenticated,error:userError}=await db.auth.getUser();
   if(userError||!authenticated?.user){status('account-change-status','Økten er utløpt. Logg inn igjen i Studio.',true);return}
   const {error}=await db.auth.updateUser({password:newPassword,current_password:current});
   if(error){
    const msg=/invalid.*password|incorrect.*password|current_password/i.test(error.message||'')?
     'Nåværende passord ble ikke godkjent. Kontroller at det er riktig.':
     error.message||'Endringen ble avvist av innloggingstjenesten.';
    status('account-change-status',msg,true);
    return;
   }
   $('account-current').value='';$('account-new').value='';$('account-repeat').value='';
   status('account-change-status','Passordet er oppdatert. Du kan fortsette å bruke Studio – neste innlogging bruker det nye passordet.');
  }catch(err){status('account-change-status','Kunne ikke oppdatere passordet nå. Prøv igjen.',true)}
  finally{button.disabled=false}
 });

 if(fromRecoveryLink){
  status('password-create-status','Bekrefter gjenopprettingslenken …');
  // Supabase processes implicit/PKCE recovery tokens asynchronously on page entry.
  // A valid session is also checked again before calling updateUser.
  void db.auth.getSession().then(({data,error})=>{
   if(error||!data?.session){
    status('password-create-status','Lenken er ikke gyldig eller er utløpt. Gå tilbake og be om en ny lenke.',true);
   }else status('password-create-status','Du kan nå velge et nytt passord.');
  }).catch(()=>status('password-create-status','Kunne ikke kontrollere lenken. Prøv igjen.',true));
 }
 $('password-request-form').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!db)return;
  const btn=$('password-request-send'),email=$('password-request-email').value.trim();
  if(!email)return;
  btn.disabled=true;$('password-email-limit').hidden=true;status('password-request-status','Sender forespørselen …');
  try{
   const redirectTo=new URL('/admin-password.html',location.origin).href;
   const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo});
   if(error){
    const emailLimit=error.code==='over_email_send_rate_limit'||/email rate limit/i.test(error.message||'');
    const perUser=error.code==='over_request_rate_limit'||/security purposes.*seconds/i.test(error.message||'');
    if(emailLimit){
     $('password-email-limit').hidden=false;
     status('password-request-status','Ingen e-post ble sendt: prosjektets e-postkvote er brukt opp.',true);
    }else if(perUser||error.status===429){
     status('password-request-status','Ingen ny lenke ble sendt. Det er for kort tid siden forrige forespørsel. Prøv igjen senere.',true);
    }else{
     status('password-request-status','Kunne ikke sende e-post nå. '+(error.message||'Kontroller adressen og prøv senere.'),true);
    }
   }else status('password-request-status','Hvis e-postadressen er registrert, får du en lenke på e-post. Sjekk også søppelpost.');
  }catch(e){status('password-request-status','Tilkoblingsfeil. Kontroller internett og prøv igjen.',true)}
  finally{btn.disabled=false}
 });
 $('password-new').addEventListener('input',guide);
 $('password-repeat').addEventListener('input',guide);
 guide();
 document.querySelectorAll('[data-password-toggle]').forEach(button=>button.addEventListener('click',()=>{
  const input=$(button.dataset.passwordToggle),visible=input.type==='password';
  input.type=visible?'text':'password';
  button.textContent=visible?'Skjul':'Vis';
  button.setAttribute('aria-pressed',String(visible));
  button.setAttribute('aria-label',(visible?'Skjul':'Vis')+' '+(input.id==='password-new'?'nytt passord':'bekreftelse av passord'));
  input.focus({preventScroll:true});
 }));
 $('password-create-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const pass=$('password-new').value,confirm=$('password-repeat').value,btn=$('password-create-submit');
  if(pass.length<8){status('password-create-status','Bruk minst 8 tegn.',true);$('password-new').focus();return}
  if(pass!==confirm){status('password-create-status','Passordene er ikke like.',true);$('password-repeat').focus();return}
  if(!recoveryMode){status('password-create-status','Du må først åpne den personlige gjenopprettingslenken fra e-posten.',true);return}
  btn.disabled=true;
  try{
   const {data,error:sessionError}=await db.auth.getSession();
   if(sessionError||!data?.session){status('password-create-status','Lenken er ikke gyldig lenger. Be om en ny lenke.',true);return}
   const {error}=await db.auth.updateUser({password:pass});
   if(error){status('password-create-status','Kunne ikke lagre passordet: '+error.message,true);return}
   $('password-new').value='';$('password-repeat').value='';
   recoveryMode=false;
   await db.auth.signOut();
   history.replaceState(null,'',location.pathname);
   show('reset-success');
  }catch(e){status('password-create-status','Kunne ikke endre passordet. Prøv igjen med en ny lenke.',true)}
  finally{btn.disabled=false}
 });
}
document.addEventListener('DOMContentLoaded',init);
})();