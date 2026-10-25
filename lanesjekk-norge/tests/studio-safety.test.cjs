'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'admin-studio.js'),'utf8');
const html=fs.readFileSync(path.join(root,'studio-admin.html'),'utf8');

test('Studio script parses after editor/navigation changes',()=>{
 assert.doesNotThrow(()=>new vm.Script(code));
});
test('Archived preview never overwrites an unsaved draft',()=>{
 const history=code.slice(code.indexOf('function renderPublishEvents(){'),code.indexOf('async function loadRevisions('));
 assert.ok(history.includes("void openFullPreview('topp',event)"));
 const view=history.slice(history.indexOf("previewButton.onclick=()=>{"),history.indexOf("const restore=create(",history.indexOf("previewButton.onclick=()=>{")));
 assert.doesNotMatch(view,/draft\s*=/);
 assert.doesNotMatch(view,/render\(\)/);
 assert.match(history,/restore\.onclick=\(\)=>\{/);
 assert.match(history,/draft=normalize\(event\.snapshot\)/);
 assert.match(code,/previewPayload=historical\?/);
 assert.match(code,/if\(historical\)lastPreviewFingerprint=''/);
});
test('History comparison uses active published version, independently of version diff',()=>{
 assert.match(code,/const difference=changesBetween\(normalize\(event\.snapshot\),published\)/);
 assert.match(code,/Sammenlign med aktiv/);
});
test('Live preview updates with edits, but archived snapshots cannot be overwritten by them',()=>{
 assert.match(code,/if\(!previewPayload\)deliverFullPreview\(\)/);
 assert.match(code,/lastPreviewFingerprint===JSON\.stringify\(config\)/);
 assert.match(code,/openFullPreview\(section='topp',historyVersion=null\)/);
});
test('Object preview routes and setting-level Studio search are available',()=>{
 for(const pair of ["utleie:'utleieanalyse'","'offisielle-renter':'sparing'","bsu:'guider'","ask:'guider'"]){
  assert.ok(code.includes(pair),'Missing object route: '+pair);
 }
 assert.match(code,/previewRouteForCard\(item\.object\)/);
 assert.match(code,/panel\.querySelectorAll\('\.admin-body label'\)/);
 assert.match(code,/item\.field\.focus\(\{preventScroll:true\}\)/);
 assert.match(html,/id="admin-object-search"/);
 assert.match(html,/id="preview-inline-fullscreen"/);
});
