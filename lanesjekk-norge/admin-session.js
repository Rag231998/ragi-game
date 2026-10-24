/* Lånesjekk Studio auth storage: session-only by default, opt-in 24 h. */
(()=>{'use strict';
const KEY='lanesjekk-studio-token-v3',EXPIRY='lanesjekk-studio-expiry-v3',DAY=86400000;
const store={
 getItem(name){
  if(name!==KEY)return null;
  const end=Number(localStorage.getItem(EXPIRY)||0);
  if(end>0&&Date.now()>=end){
   localStorage.removeItem(KEY);localStorage.removeItem(EXPIRY);sessionStorage.removeItem(KEY);return null;
  }
  if(end>Date.now())return localStorage.getItem(KEY);
  return sessionStorage.getItem(KEY);
 },
 setItem(name,value){
  if(name!==KEY)return;
  if(Number(localStorage.getItem(EXPIRY)||0)>Date.now())localStorage.setItem(KEY,value);
  else sessionStorage.setItem(KEY,value);
 },
 removeItem(name){
  if(name!==KEY)return;
  localStorage.removeItem(KEY);sessionStorage.removeItem(KEY);
 },
};
function configure(keep){
 localStorage.removeItem(KEY);localStorage.removeItem(EXPIRY);sessionStorage.removeItem(KEY);
 if(keep)localStorage.setItem(EXPIRY,String(Date.now()+DAY));
}
function clear(){store.removeItem(KEY);localStorage.removeItem(EXPIRY)}
function expired(){
 const until=Number(localStorage.getItem(EXPIRY)||0);
 return until>0&&Date.now()>=until;
}
function remaining(){
 const until=Number(localStorage.getItem(EXPIRY)||0);
 return until>Date.now()?until-Date.now():0;
}
function rememberEnabled(){return remaining()>0}
window.lanesjekkStudioSession={key:KEY,storage:store,configure,clear,expired,remaining,rememberEnabled};
})();