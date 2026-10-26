(()=>{'use strict';
const toAscii=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[øØ]/g,'o').replace(/[æÆ]/g,'ae').replace(/[åÅ]/g,'a').replace(/[^\x20-\x7e]/g,'?');
function build(report){const jsPDF=window.jspdf?.jsPDF;if(!jsPDF)throw Error('PDF-biblioteket er ikke tilgjengelig. Prøv igjen senere.');
const doc=new jsPDF({unit:'mm',format:'a4',compress:true}),width=210,margin=16;let y=35;
doc.setFillColor(8,104,95);doc.rect(0,0,210,30,'F');doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(19);doc.text('LN  LANESJEKK NORGE',margin,19);doc.setTextColor(26,57,69);doc.setFontSize(16);doc.text(toAscii(report.title).slice(0,75),margin,y);y+=8;
doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('Rapport opprettet: '+new Date(report.at).toLocaleString('nb-NO'),margin,y);y+=9;
function page(){if(y>275){doc.addPage();y=20}}
function row(k,v){const label=doc.splitTextToSize(toAscii(k),65),value=doc.splitTextToSize(toAscii(v),110);const height=Math.max(label.length,value.length)*5+4;page();if(y+height>275){doc.addPage();y=20}doc.setFont('helvetica','bold');doc.text(label,margin,y);doc.setFont('helvetica','normal');doc.text(value,91,y);y+=height;doc.setDrawColor(225,233,235);doc.line(margin,y-2,width-margin,y-2)}
function title(t){if(y>255){doc.addPage();y=20}y+=4;doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text(t,margin,y);doc.setFontSize(10);doc.setFont('helvetica','normal');y+=9}
if(report.results?.length){title('RESULTATER');for(const r of report.results)row(r.label,r.value)}
if(report.entries?.length){title('BEREGNINGSGRUNNLAG');for(const r of report.entries)row(r.label,r.value)}
if(report.rows?.length){title('BUDSJETTPOSTER');report.rows.forEach((cells,i)=>{const headings=report.heads||[];const joined=cells.map((v,j)=>headings[j]?headings[j]+': '+v:v).filter(Boolean).join('  |  ');row((i+1)+'.',joined)})}
const pages=doc.getNumberOfPages();for(let n=1;n<=pages;n++){doc.setPage(n);doc.setTextColor(231,241,239);doc.setFont('helvetica','bold');doc.setFontSize(15);doc.text('LANESJEKK NORGE',194,282,{align:'right'});doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(89,112,122);doc.text('Opprettet med Lanesjekk Norge - beregninger er ikke bankbekreftede.',margin,289);doc.text(String(n)+' / '+pages,194,289,{align:'right'})}
return doc}
window.LNReportPDF={build,download(r){build(r).save('lanesjekk-rapport-'+new Date().toISOString().slice(0,10)+'.pdf')},base64(r){return build(r).output('datauristring').split(',')[1]},file(r){return new File([build(r).output('blob')],'lanesjekk-rapport.pdf',{type:'application/pdf'})}};
})();