(()=>{'use strict';
const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
function graphic(report){if(!report)throw Error('Rapporten mangler');
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)throw Error('Bildedeling støttes ikke i denne nettleseren');
 canvas.width=900;canvas.height=1100;const w=canvas.width;
 ctx.fillStyle='#f0f8f6';ctx.fillRect(0,0,w,1100);
 const header=ctx.createLinearGradient(0,0,w,290);header.addColorStop(0,'#075f57');header.addColorStop(1,'#0ba08a');ctx.fillStyle=header;ctx.fillRect(0,0,w,230);
 ctx.fillStyle='#ffffff';ctx.font='bold 29px system-ui,Arial';ctx.fillText('◈  LÅNESJEKK NORGE',58,80);ctx.font='600 18px system-ui,Arial';ctx.fillStyle='#d4fff5';ctx.fillText('Din økonomi – tydelig oppsummert',58,119);
 ctx.fillStyle='#fff';ctx.font='bold 37px system-ui,Arial';ctx.fillText(clean(report.title).slice(0,35),58,193);
 const vals=(report.results||[]).filter(x=>typeof x.label==='string').slice(0,6);
 for(let i=0;i<Math.min(4,vals.length);i++){const x=56+(i%2)*400,y=270+Math.floor(i/2)*160;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(x,y,386,143,18);ctx.fill();
  ctx.font='600 17px system-ui,Arial';ctx.fillStyle='#55777c';ctx.fillText(clean(vals[i].label).slice(0,33),x+22,y+47);
  ctx.font='bold 37px system-ui,Arial';ctx.fillStyle=i===2?'#057d68':'#173b46';ctx.fillText(clean(vals[i].value).slice(0,18),x+22,y+101);
 }
 const startY=vals.length>=3?643:475;
 ctx.fillStyle='#163b44';ctx.font='bold 28px system-ui,Arial';ctx.fillText('Budsjettposter',60,startY);
 const rows=(report.rows||[]).slice(0,6),heads=report.heads||[],cat=heads.findIndex(x=>/kategori/i.test(x)),money=heads.findIndex(x=>/per m[aå]ned/i.test(x));
 ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(55,startY+28,790,Math.max(80,Math.min(6,rows.length)*54+22),18);ctx.fill();
 rows.forEach((cells,i)=>{const label=clean(cells[cat>=0?cat:1]||'Post '+(i+1)).slice(0,37),amount=clean(cells[money>=0?money:6]||'');
  const y=startY+73+i*54;ctx.font='500 20px system-ui,Arial';ctx.fillStyle='#234652';ctx.fillText(label,79,y);
  ctx.font='bold 20px system-ui,Arial';ctx.fillStyle='#086d61';ctx.textAlign='right';ctx.fillText(amount.slice(0,19),810,y);ctx.textAlign='left';
  if(i<rows.length-1){ctx.strokeStyle='#e5eeee';ctx.beginPath();ctx.moveTo(77,y+16);ctx.lineTo(815,y+16);ctx.stroke()}
 });
 ctx.fillStyle='#55737a';ctx.font='15px system-ui,Arial';ctx.fillText('Basert på informasjon oppgitt av brukeren – ikke bankbekreftet.',60,1047);
 ctx.font='bold 15px system-ui,Arial';ctx.fillStyle='#086b60';ctx.fillText('lanesjekk-norge.onrender.com',60,1076);
 return canvas;
}
function file(report){const c=graphic(report),data=c.toDataURL('image/png'),bytes=atob(data.split(',')[1]),array=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)array[i]=bytes.charCodeAt(i);return new File([array],'lanesjekk-budsjett.png',{type:'image/png'})}
function download(report){const canvas=graphic(report),link=document.createElement('a');link.href=canvas.toDataURL('image/png');link.download='lanesjekk-budsjett.png';link.click()}
window.LNReportSocial={file,download};
})();
