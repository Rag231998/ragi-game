/* Admin session storage. Session only by default; explicit 24-hour maximum on trusted devices.
   BroadcastChannel allows the account page opened with noopener to use the same
   in-memory browser session without permanently persisting a session-only token. */
(()=>{'use strict';
const KEY='lanesjekk-studio-token-v3',EXPIRY='lanesjekk-studio-expiry-v3',DAY=86400000;
const CHANNEL='lanesjekk-studio-auth-link-v1';
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel(CHANNEL):null;
const pending=new Map();
function remaining(){const t=Number(localStorage.getItem(EXPIRY)||0);return t>Date.now()?t-Date.now():0}
function expired(){const t=Number(localStorage.getItem(EXPIRY)||0);return !!t&&Date.now()>=t}
function rememberEnabled(){return remaining()>0}
function activeToken(){
 if(expired())return null;
 if(rememberEnabled())return localStorage.getItem(KEY);
 return sessionStorage.getItem(KEY);
}
function localClear(){
 localStorage.removeItem(KEY);sessionStorage.removeItem(KEY);localStorage.removeItem(EXPIRY);
}
function notify(message){try{channel?.postMessage(message)}catch{}}
function clear(){localClear();notify({type:'logout'})}
const store={
 async getItem(name){
  if(name!==KEY)return null;
  const found=activeToken();
  if(found||rememberEnabled()||expired()||!channel)return found;
  const request=crypto.randomUUID();
  return new Promise(resolve=>{
   const end=setTimeout(()=>{pending.delete(request);resolve(null)},700);
   pending.set(request,value=>{clearTimeout(end);resolve(value)});
   notify({type:'request-session',request});
  });
 },
 setItem(name,value){
  if(name!==KEY)return;
  if(rememberEnabled())localStorage.setItem(KEY,value);
  else if(!expired())sessionStorage.setItem(KEY,value);
 },
 removeItem(name){
  if(name!==KEY)return;
  localClear();notify({type:'logout'});
 },
};
channel?.addEventListener('message',event=>{
 const data=event.data;
 if(!data||typeof data!=='object')return;
 if(data.type==='request-session'&&typeof data.request==='string'){
  const token=activeToken();
  if(token)notify({type:'session-response',request:data.request,token});
 }else if(data.type==='session-response'&&pending.has(data.request)&&typeof data.token==='string'){
  // Session-only tokens are never persisted across browser restarts.
  if(!expired()){sessionStorage.setItem(KEY,data.token);pending.get(data.request)(data.token);pending.delete(data.request)}
 }else if(data.type==='logout'){
  localClear();
 }
});
function configure(keep){
 localClear();
 if(keep)localStorage.setItem(EXPIRY,String(Date.now()+DAY));
}
window.lanesjekkStudioSession={key:KEY,storage:store,configure,clear,expired,remaining,rememberEnabled};
})();