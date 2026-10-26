'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const from=path.join(root,'node_modules','jspdf','dist','jspdf.umd.min.js');
const target=path.join(root,'vendor','jspdf.umd.min.js');
if(!fs.existsSync(from))throw new Error('jsPDF library is missing: '+from);
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.copyFileSync(from,target);
console.log('[report-pdf] Bundled jsPDF locally for Safari/iOS:',fs.statSync(target).size,'bytes');
