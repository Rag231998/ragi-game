const {test,expect}=require('@playwright/test');

test('Studio includes real generation, draft placement and clear API setup state',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#studio-ai-generate')).toHaveCount(1);
 await expect(page.locator('#media-placement')).toHaveCount(1);
 await expect(page.locator('#studio-ai-result-video')).toHaveCount(1);
 await expect(page.locator('#admin-dashboard-grid')).toHaveCount(1);
 await expect(page.locator('#studio-ai-generate')).toBeDisabled();
});

test('Mocked provider creates a commercial, reviews it and stages it without publishing',async({page})=>{
 await page.route('**/api/admin-video?**',route=>{
  const action=new URL(route.request().url()).searchParams.get('action');
  const replies={
   ready:{ok:true,configured:true},
   create:{ok:true,videoId:'mock-video-123',signature:'a'.repeat(64),status:'pending',module:'budget'},
   status:{ok:true,status:'completed',videoUrl:'https://resource2.heygen.ai/example.mp4'},
   import:{ok:true,videoUrl:'https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/video/ai-preview.mp4'}
  };
  return route.fulfill({status:action==='create'?202:200,contentType:'application/json',body:JSON.stringify(replies[action])});
 });
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{
  document.getElementById('admin-workspace').hidden=false;
  window.lanesjekkStudioVideoAuth=async()=> 'mock-jwt';
  window.__stagedVideo=null;
  window.lanesjekkAnimationStudio.useGeneratedVideo=(module,url)=>{window.__stagedVideo={module,url}};
  const select=document.getElementById('media-target');
  if(![...select.options].some(opt=>opt.value==='budget'))select.add(new Option('Budsjett','budget'));
  select.value='budget';
  select.dispatchEvent(new Event('change',{bubbles:true}));
  window.dispatchEvent(new Event('lanesjekk-studio-ready'));
 });
 await page.evaluate(()=>{document.getElementById('animation-studio-panel').open=true});
 await page.locator('#media-workspace-tab-ai').click();
 await expect(page.locator('#studio-ai-create')).toBeVisible();
 await expect(page.locator('#studio-ai-generate')).toBeEnabled();
 await page.locator('#studio-ai-topic').fill('Økonomisk budsjett');
 await page.locator('#studio-ai-scene').fill('En voksen norsk person sitter ved kjøkkenbordet og forklarer et enkelt månedsbudsjett.');
 await page.locator('#studio-ai-generate').click();
 await expect(page.locator('#studio-ai-result')).toBeVisible();
 await page.locator('#studio-ai-apply').click();
 await expect.poll(()=>page.evaluate(()=>window.__stagedVideo?.module)).toBe('budget');
 await expect(page.locator('#studio-ai-connection')).toContainText('upublisert utkast');
});
