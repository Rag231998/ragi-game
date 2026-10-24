/* Password recovery redirect fallback.
 * If Supabase falls back to Site URL instead of the admin redirect,
 * forward ONLY recovery callbacks to the existing password form.
 * Keep token fragments on this origin; no analytics or external links.
 */
(()=>{
 'use strict';
 const path=location.pathname;
 if(path!=='/'&&!path.endsWith('/index.html'))return;
 const hash=new URLSearchParams(location.hash.slice(1));
 const search=new URLSearchParams(location.search);
 const errorCode=hash.get('error_code')||search.get('error_code')||'';
 const isRecovery=hash.get('type')==='recovery'||search.get('type')==='recovery';
 const isExpiredRecovery=['otp_expired','otp_disabled'].includes(errorCode);
 const pkce=search.has('code')&&/^[A-Za-z0-9._~-]{10,2048}$/.test(search.get('code')||'');
 if(!isRecovery&&!isExpiredRecovery&&!pkce)return;
 const url=new URL('/studio-admin.html',location.origin);
 url.search=location.search;
 url.hash=location.hash;
 location.replace(url.href);
})();
