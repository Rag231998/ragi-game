/* Norwegian financial input formatting.
 * Display: 3 109 049 kr; 5,25 %. Calculations always use finite JS numbers.
 * Handles pasted grouping, maintains keyboard caret and allows partial decimals. */
(()=>{
 'use strict';
 const formatGroup=digits=>digits.replace(/\B(?=(\d{3})+(?!\d))/g,' ');
 const cleanText=value=>String(value??'').replace(/[\u00a0\u202f\s]/g,'').replace(/kr/gi,'');
 function parseMoney(value){
  const s=cleanText(value).replace(/\./g,'').replace(',', '.');
  if(!/^-?\d+(?:\.\d{0,2})?$/.test(s))return NaN;
  return Number(s);
 }
 function parseDecimal(value){
  const s=cleanText(value).replace(',', '.');
  if(!/^-?\d+(?:\.\d+)?$/.test(s))return NaN;
  return Number(s);
 }
 function displayMoney(raw){
  let s=cleanText(raw).replace(/[^\d,.-]/g,'').replace(/\./g,'');
  if(!s)return '';
  const neg=s.startsWith('-')?'-':'';
  s=s.replace(/-/g,'');
  const comma=s.indexOf(','),whole=comma<0?s:s.slice(0,comma),dec=comma<0?'':s.slice(comma+1).replace(/,/g,'').slice(0,2);
  const digits=whole.replace(/\D/g,'').replace(/^0+(?=\d)/,'');
  if(!digits)return comma<0?'':neg+'0,'+dec;
  return neg+formatGroup(digits)+(comma<0?'':','+dec);
 }
 function displayDecimal(raw){
  return String(raw??'').replace(/\s/g,'').replace(/\./g,',').replace(/[^0-9,-]/g,'').replace(/,(?=.*?,)/g,'');
 }
 const semantic=value=>String(value).replace(/[^\d,]/g,'');
 function maintainCaret(input,next){
  const old=input.value,pos=input.selectionStart??old.length;
  const before=semantic(old.slice(0,pos)).length;
  if(next!==old)input.value=next;
  if(document.activeElement===input&&typeof input.setSelectionRange==='function'){
   if(!before){input.setSelectionRange(0,0);return}
   let count=0,at=next.length;
   for(let i=0;i<next.length;i++){
    if(/[\d,]/.test(next[i]))count++;
    if(count===before){at=i+1;break}
   }
   input.setSelectionRange(at,at);
  }
 }
 function formatInput(input,final=false){
  if(input.matches('[data-money-input]')){
   let formatted=displayMoney(input.value);
   if(final&&Number.isFinite(parseMoney(formatted)))formatted=displayMoney(formatted);
   maintainCaret(input,formatted);
  }else if(input.matches('[data-decimal-input]')){
   let formatted=displayDecimal(input.value);
   if(final&&Number.isFinite(parseDecimal(formatted)))formatted=new Intl.NumberFormat('nb-NO',{minimumFractionDigits:2,maximumFractionDigits:2}).format(parseDecimal(formatted));
   maintainCaret(input,formatted);
  }
 }
 document.addEventListener('input',e=>{
  if(e.target instanceof HTMLInputElement&&e.target.matches('[data-money-input], [data-decimal-input]')){
   formatInput(e.target);
  }
 },true);
 document.addEventListener('blur',e=>{
  if(e.target instanceof HTMLInputElement&&e.target.matches('[data-money-input], [data-decimal-input]')){
   formatInput(e.target,true);
  }
 },true);
 function formatAll(root=document){
  root.querySelectorAll('[data-money-input], [data-decimal-input]').forEach(input=>formatInput(input,true));
 }
 document.addEventListener('DOMContentLoaded',()=>formatAll());
 const api=Object.freeze({parseMoney,parseDecimal,displayMoney,displayDecimal,formatAll});
 window.LANENUMBERS=api;
})();
