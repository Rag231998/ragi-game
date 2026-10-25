'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),file=name=>fs.readFileSync(path.join(root,name),'utf8');
test('The Studio feature catalog lists real route destinations with useful descriptions',()=>{
 const window={},document={addEventListener(){}};
 vm.runInNewContext(file('site-feature-catalog.js'),{window,document},{filename:'site-feature-catalog.js'});
 const features=window.lanesjekkCatalog.getFeatures();
 assert.ok(features.length>=12);
 assert.equal(new Set(features.map(x=>x.id)).size,features.length);
 const html=file('index.html');
 for(const feature of features){
  assert.ok(html.includes('href="#'+feature.id+'"')||html.includes('id="'+feature.id+'"'),feature.id+' has no link or target');
  assert.ok(feature.subtitle.length>=15,feature.id+' missing useful description');
 }
 for(const category of ['Lån','Økonomi','Sparing','Eiendom','Læring'])assert.ok(features.some(x=>x.cat===category));
});
test('Feature guide is an accessible dedicated window for desktop and mobile, including dark mode',()=>{
 const html=file('studio-admin.html'),publicHtml=file('index.html'),
  css=file('site-feature-catalog.css'),studioCSS=file('admin-feature-catalog.css');
 for(const id of ['site-feature-dialog','site-feature-input','site-feature-tabs','site-feature-list','site-feature-detail','site-feature-close','admin-open-features']){
  assert.ok(html.includes('id="'+id+'"'),id+' missing from Studio');
 }
 assert.match(html,/<dialog id="site-feature-dialog"/);
 assert.match(html,/data-open-catalog="tools"/);
 assert.match(html,/site-feature-catalog\.js/);
 assert.ok(!publicHtml.includes('id="site-feature-dialog"'));
 assert.ok(!publicHtml.includes('data-open-catalog='));
 assert.ok(!publicHtml.includes('site-feature-catalog\.js'));
 assert.match(css,/#site-feature-dialog::backdrop/);
 assert.match(studioCSS,/html\.studio-dark #site-feature-dialog/);
 assert.match(css,/@media\(max-width:670px\)/);
});
test('The publishing CMS supports safe editor-controlled release notes with restricted routes',()=>{
 const client=file('site-cms.js'),admin=file('admin-studio.js'),html=file('studio-admin.html');
 assert.match(client,/window\.lanesjekkCatalog\?\.setNews\(cfg\.catalog\)/);
 assert.match(client,/const RELEASE_ROUTES=new Set/);
 assert.match(admin,/renderCatalog\(\)/);
 assert.match(admin,/catalog-add-news/);
 assert.match(admin,/draft\.catalog\.news/);
 assert.match(html,/id="admin-panel-catalog"/);
 assert.match(html,/id="catalog-news-editor"/);
 assert.match(admin,/lanesjekkStudioPreviewRoute/);
 assert.match(admin,/lanesjekkCatalog\?\.setNews\(draft\.catalog\)/);
});
test('AI presenter brief is generated per tool but a video is only published through the uploader',()=>{
 const handlers={};const elements={
  'media-target':{value:'rental'},'ai-video-style':{value:'professional'},'ai-video-length':{value:'30'},
  'ai-video-generate':{addEventListener:(name,cb)=>handlers.generate=cb},
  'ai-video-copy':{disabled:true,addEventListener:(name,cb)=>handlers.copy=cb},
  'ai-video-brief':{value:'',focus(){},select(){}}
 };
 const document={addEventListener:(name,cb)=>handlers.load=cb,getElementById:id=>elements[id]||null};
 vm.runInNewContext(file('ai-video-brief.js'),{document,window:{}});
 handlers.load();handlers.generate();
 const result=elements['ai-video-brief'].value;
 assert.match(result,/Utleieanalyse/);
 assert.match(result,/realistisk, fiktiv, voksen AI-skuespiller/);
 assert.match(result,/GRATIS AI-VIDEO/);
 assert.match(result,/Ingen garanti/);
 assert.match(result,/MP4/);
 assert.equal(elements['ai-video-copy'].disabled,false);
});
test('Realtime CMS subscription validates RLS via re-fetch and retains reconnect fallback',()=>{
 const client=file('site-cms.js'),index=file('index.html');
 assert.match(client,/postgres_changes/);
 assert.match(client,/lanesjekk_site_config/);
 assert.match(client,/await refreshPublished\(\)/);
 assert.match(client,/setInterval\(\(\)=>\{if\(!document\.hidden\)void refreshPublished\(\)\},60000\)/);
 assert.match(client,/visibilitychange/);
 assert.match(index,/id="site-live-status"/);
 assert.doesNotMatch(index,/site-feature-catalog\.js/);
 assert.match(file('studio-admin.html'),/site-feature-catalog\.js/);
});


test('New CMS tool links can be added, selected, hidden, and navigate only to real pages',()=>{
 const window={},document={addEventListener(){},getElementById(){return null}};
 vm.runInNewContext(file('site-feature-catalog.js'),{window,document},{filename:'site-feature-catalog.js'});
 const catalog=window.lanesjekkCatalog;
 const original=catalog.getFeatures().length;
 catalog.setNews({headline:'Verktøy',news:[],tools:[
  {id:'custom-123456',route:'budsjett',cat:'Økonomi',title:'Nytt budsjettkort',
   subtitle:'Åpne budsjett med grafer.',how:'Fyll inn inntekt og utgifter.',icon:'▦',enabled:true},
  {id:'custom-987654',route:'guider',cat:'Læring',title:'Skjult kort',
   subtitle:'Vises ikke når deaktivert.',how:'Åpne artiklene.',icon:'☷',enabled:false},
  {id:'custom-222222',route:'not-a-route',cat:'Økonomi',title:'Falsk kalkulator',
   subtitle:'Må avvises.',how:'Skal ikke eksistere.',icon:'◉',enabled:true}
 ]});
 const all=catalog.getFeatures();
 assert.equal(all.length,original+1);
 const created=all.find(x=>x.id==='custom-123456');
 assert.ok(created);
 assert.equal(created.route,'budsjett');
 assert.equal(all.some(x=>x.title==='Skjult kort'),false);
 assert.equal(all.some(x=>x.title==='Falsk kalkulator'),false);
 const admin=file('admin-studio.js'),client=file('site-cms.js');
 assert.match(admin,/catalog-add-tool/);
 assert.match(admin,/catalog-tool-route/);
 assert.match(admin,/validateCatalogDraft/);
 assert.match(client,/cms-custom-tool/);
 assert.match(client,/card\.href='#'\+entry\.route/);
 assert.match(file('studio-admin.html'),/admin-catalog-workflow\.css/);
});

test('Adding an existing feature opens a guided editable draft with working next actions',()=>{
 const html=file('studio-admin.html'),admin=file('admin-studio.js'),css=file('studio-catalog-flow.css');
 for(const id of ['catalog-next-step','catalog-next-title','catalog-next-description','catalog-next-edit','catalog-next-preview','catalog-next-publish']){
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(admin,/draft\.catalog\.tools\.unshift\(item\)/);
 assert.match(admin,/renderCatalog\(item\.id\)/);
 assert.match(admin,/showPreviewSection\('topp'\)/);
 assert.match(admin,/catalog-next-step/);
 assert.match(admin,/openFullPreview\('topp'\)/);
 assert.match(admin,/\$\('admin-publish'\)\?\.click\(\)/);
 assert.match(css,/catalog-next-step/);
 assert.match(css,/studio-dark/);
 assert.match(css,/max-width:660px/);
});
