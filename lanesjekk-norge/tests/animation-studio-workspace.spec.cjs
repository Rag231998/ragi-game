const {test,expect}=require('@playwright/test');
const BASE='https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/';
const ids=['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy','currency'];
async function prepare(page,options={}){
 // Auth is mocked ONLY in tests; production always requires Supabase authorization.
 await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.abort());
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await page.evaluate(({ids,BASE})=>{
  const slots=Object.fromEntries(ids.map(id=>[id,{enabled:true,videoUrl:'',posterUrl:'',title:'',description:'',fit:'cover',loop:true,placement:'after-intro'}]));
  window.__mediaDraft={slots};
  window.__mediaUploaded=[];
  window.__mediaDeleted=[];
  window.__mediaFiles=[];
  window.__published={media:{slots:Object.fromEntries(ids.map(id=>[id,{videoUrl:'',posterUrl:''}]))}};
  const storage={from:()=>({
   upload:async(path,file)=>{
    window.__mediaUploaded.push({path,size:file.size});
    window.__mediaFiles.push({name:path.split('/').at(-1),folder:path.split('/')[0],metadata:{size:file.size}});
    return{error:null}
   },
   list:async(folder)=>({data:window.__mediaFiles.filter(f=>f.folder===folder).map(({folder,...rest})=>rest),error:null}),
   remove:async paths=>{
    window.__mediaDeleted.push(...paths);
    window.__mediaFiles=window.__mediaFiles.filter(f=>!paths.includes(f.folder+'/'+f.name));
    return{error:null}
   },
   getPublicUrl:path=>({data:{publicUrl:BASE+path}})
  })};
  document.getElementById('admin-workspace').hidden=false;
  const panels=document.querySelectorAll('#admin-workspace .admin-edit-panel>details');
  panels.forEach(p=>p.open=p.id==='animation-studio-panel');
  window.lanesjekkAnimationStudio.init({db:{storage,auth:{getSession:async()=>({data:{session:{access_token:'test-jwt'}}})}},getDraft:()=>({media:window.__mediaDraft}),getPublished:()=>window.__published,bucket:'animation-assets',notify:()=>{}});
  window.lanesjekkAnimationStudio.render();
  window.dispatchEvent(new Event('lanesjekk-studio-ready'));
 },{ids,BASE});
 await expect(page.locator('#media-workspace')).toHaveCount(1);
}
test('Animation Studio has immediate editor and three simple tabs, not a giant AI warning',async({page})=>{
 await prepare(page);
 await expect(page.locator('#media-workspace-tabs [role="tab"]')).toHaveCount(3);
 await expect(page.locator('#media-workspace-edit')).toBeVisible();
 await expect(page.locator('#studio-ai-connection')).toBeHidden();
 await expect(page.locator('#media-module-grid button')).toHaveCount(11);
 await expect(page.locator('#media-workspace-selected')).toContainText('Forsiden');
 await page.locator('#media-workspace-tab-ai').click();
 await expect(page.locator('#studio-ai-create')).toBeVisible();
 await expect(page.locator('#media-workspace-edit')).toBeHidden();
 await page.locator('#media-workspace-tab-edit').click();
 await expect(page.locator('#media-workspace-edit')).toBeVisible();
});
test('Each module click opens the correct editor and keeps previous unsaved changes',async({page})=>{
 await prepare(page);
 await page.locator('#media-title').fill('Spesialreklame for forsiden');
 await page.locator('#media-module-grid .media-module-choice').filter({hasText:'Budsjett'}).click();
 await expect(page.locator('#media-workspace-selected')).toContainText('Budsjett');
 await expect(page.locator('#media-target')).toHaveValue('budget');
 await expect(page.locator('#media-selected-name')).toContainText('Budsjett');
 await expect(page.locator('#media-workspace-edit')).toBeVisible();
 await page.locator('#media-title').fill('Budsjettvideo med klare råd');
 await page.locator('#media-placement').selectOption('bottom');
 await page.locator('#media-module-grid .media-module-choice').filter({hasText:'Forsiden'}).click();
 await expect(page.locator('#media-title')).toHaveValue('Spesialreklame for forsiden');
 await page.locator('#media-module-grid .media-module-choice').filter({hasText:'Budsjett'}).click();
 await expect(page.locator('#media-title')).toHaveValue('Budsjettvideo med klare råd');
 await expect(page.locator('#media-placement')).toHaveValue('bottom');
 await expect(page.locator('#media-module-grid .media-module-choice[aria-pressed="true"]')).toContainText('Budsjett');
});
test('Uploading a video stages the selected module and surfaces the new file in searchable library',async({page})=>{
 await prepare(page);
 await page.locator('#media-target').selectOption('valuation');
 await page.locator('#media-video').setInputFiles({name:'bolig-demo.mp4',mimeType:'video/mp4',buffer:Buffer.from('000000186674797069736f6d', 'hex')});
 await page.locator('#media-upload').click();
 await expect(page.locator('#media-status')).toContainText('lagt i utkastet');
 await expect.poll(()=>page.evaluate(()=>window.__mediaDraft.slots.valuation.videoUrl)).toContain('/video/media-');
 await expect.poll(()=>page.evaluate(()=>window.__mediaUploaded.length)).toBe(1);
 await page.locator('#media-workspace-tab-library').click();
 await expect(page.locator('#media-library-row')).toHaveCount(0);
 await expect(page.locator('.media-library-row')).toHaveCount(1);
 await expect(page.locator('#media-library-count')).toContainText('1 filer');
 await page.locator('#media-library-search').fill('ingenting');
 await expect(page.locator('.media-library-row')).toHaveCount(0);
 await page.locator('#media-library-search').fill('media-');
 await expect(page.locator('.media-library-row')).toHaveCount(1);
 await expect(page.locator('.media-library-row button.media-delete')).toBeDisabled();
 await page.locator('#media-workspace-tab-edit').click();
 await page.locator('#media-reset').click();
 await page.locator('#media-workspace-tab-library').click();
 await expect(page.locator('.media-library-row button.media-delete')).toBeEnabled();
 page.once('dialog',d=>d.accept());
 await page.locator('.media-library-row button.media-delete').click();
 await expect(page.locator('.media-library-row')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>window.__mediaDeleted.length)).toBe(1);
});
test('Archive is explicitly empty and safe before a first upload',async({page})=>{
 await prepare(page);
 await page.locator('#media-workspace-tab-library').click();
 await page.locator('#media-refresh').click();
 await expect(page.locator('.media-library-empty')).toContainText('Videoarkivet er tomt');
 await expect(page.locator('#media-library-count')).toContainText('0 filer');
});
test('Mobile Studio preserves module actions, tabs, preview, and responsive layout',async({page},testInfo)=>{
 test.skip(!/android|iphone/.test(testInfo.project.name),'Mobile browsers');
 await page.setViewportSize({width:390,height:844});
 await prepare(page);
 await expect(page.locator('#media-module-grid .media-module-choice')).toHaveCount(11);
 await page.locator('#media-module-grid .media-module-choice').filter({hasText:'Utleieanalyse'}).click();
 await expect(page.locator('#media-target')).toHaveValue('rental');
 await expect(page.locator('#media-preview')).toHaveCount(1);
 const dims=await page.evaluate(()=>{
  const root=document.querySelector('#media-workspace').getBoundingClientRect();
  return {workspaceWidth:root.width,viewport:document.documentElement.clientWidth};
 });
 expect(dims.workspaceWidth).toBeLessThanOrEqual(dims.viewport+1);
});
