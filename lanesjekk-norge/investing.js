/* Original educational investment projection; no securities prices or accounts. */
(function(root){
 'use strict';
 function project(start,monthly,years,annual,fee){
  if(![start,monthly,years,annual,fee].every(Number.isFinite)||start<0||monthly<0||years<1||years>40||!Number.isInteger(years)||annual< -100||annual>100||fee<0||fee>100)return null;
  const series=[{year:0,net:start,gross:start,paid:start}];
  let net=start,gross=start,paid=start;
  // Assumes an effective annual growth factor spread evenly over 12 months;
  // fees reduce the annual gross return multiplicatively, paid at month-end.
  const g=Math.pow(1+annual/100,1/12);
  const n=g*Math.pow(1-fee/100,1/12);
  for(let m=1;m<=years*12;m++){
   net=net*n+monthly;gross=gross*g+monthly;paid+=monthly;
   if(m%12===0)series.push({year:m/12,net,gross,paid});
  }
  return {series,final:net,withoutFees:gross,paid,gain:net-paid,feeImpact:gross-net};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={project};
 if(!root)return;
 root.LANEINVEST={project};
 const $=id=>document.getElementById(id);
 const money=new Intl.NumberFormat('nb-NO',{style:'currency',currency:'NOK',maximumFractionDigits:0});
 const dec=new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2});
 function chart(series){
  const svg=$('invest-chart');svg.replaceChildren();
  const ns='http://www.w3.org/2000/svg',el=(tag,attrs)=>{
   const node=document.createElementNS(ns,tag);
   Object.entries(attrs).forEach(([key,val])=>node.setAttribute(key,val));svg.append(node);return node;
  };
  const top=Math.max(1,...series.map(x=>x.gross),...series.map(x=>x.net));
  const pos=(v,i)=>[30+i/(series.length-1)*640,234-v/top*198];
  for(let k=0;k<5;k++){const y=234-k*198/4;el('line',{x1:30,y1:y,x2:675,y2:y,stroke:'#dde6ef','stroke-dasharray':'4 5'});}
  for(const [key,color] of [['gross','#ad9ddc'],['net','#18a58a']]){
   const points=series.map((v,i)=>pos(v[key],i).map(n=>n.toFixed(2)).join(',')).join(' ');
   el('polyline',{points,fill:'none',stroke:color,'stroke-width':key==='net'?4:3,'stroke-linejoin':'round','stroke-linecap':'round'});
  }
  for(let k=0;k<3;k++){const idx=Math.round((series.length-1)*k/2),point=series[idx];const [x]=pos(0,idx);const text=el('text',{x,y:254,fill:'#637b8c','text-anchor':'middle','font-size':12});text.textContent=point.year+' år';}
 }
 function update(){
  if(!$('invest-start'))return;
  const start=Number($('invest-start').value),monthly=Number($('invest-monthly').value),years=Number($('invest-years').value),annual=Number($('invest-return').value),fee=Number($('invest-fee').value);
  $('invest-years-value').textContent=years+' år';
  $('invest-return-value').textContent=dec.format(annual)+' %';
  $('invest-fee-value').textContent=dec.format(fee)+' %';
  const result=project(start,monthly,years,annual,fee);
  if(!result){['invest-final','invest-paid','invest-gain'].forEach(id=>$(id).textContent='–');$('invest-chart').replaceChildren();$('invest-explainer').textContent='Skriv inn gyldige beløp og prøv på nytt.';return}
  $('invest-final').textContent=money.format(result.final);
  $('invest-paid').textContent=money.format(result.paid);
  $('invest-gain').textContent=money.format(result.gain);
  $('invest-explainer').textContent='Med disse forutsetningene reduserer kostnadene sluttverdien med cirka '+money.format(result.feeImpact)+'.';
  chart(result.series);
 }
 function boot(){
  if(!$('invest-start'))return;
  for(const id of ['invest-start','invest-monthly','invest-years','invest-return','invest-fee'])$(id).addEventListener('input',update);
  $('invest-reset').addEventListener('click',()=>{for(const [id,val] of [['invest-start','50000'],['invest-monthly','2500'],['invest-years','15'],['invest-return','6'],['invest-fee','.30']])$(id).value=val;update()});
  update();
 }
 document.addEventListener('DOMContentLoaded',boot);
})(typeof window!=='undefined'?window:null);
