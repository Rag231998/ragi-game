const {test,expect}=require('@playwright/test');

async function prepareStudio(page){
 await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.abort());
 await page.addInitScript(()=>{
  let config={brand:{name:'LÅNESJEKK NORGE',tagline:'Mer oversikt. Bedre valg.',accent:'#0c8878',theme:'light'}};
  let revision=1;
  let events=[{revision:1,published_at:'2026-10-23T16:04:18Z',snapshot:structuredClone(config),previous_revision:null}];
  const storage={list:async()=>({data:[],error:null}),upload:async()=>({error:null}),
   getPublicUrl:path=>({data:{publicUrl:'https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/'+path}})};
  window.supabase={createClient:()=>({
   auth:{getUser:async()=>({data:{user:{id:'admin-demo',email:'studio@example.invalid'}},error:null}),
    getSession:async()=>({data:{session:{access_token:'demo'}},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signOut:async()=>({error:null})},
   storage:{from:()=>storage},
   from:name=>{
    if(name==='admins')return {select:()=>({eq:()=>({maybeSingle:async()=>({data:{user_id:'admin-demo'},error:null})})})};
    if(name==='lanesjekk_site_config')return {
     select:()=>({eq:()=>({maybeSingle:async()=>({data:{config,revision,updated_at:'2026-10-23T16:04:18Z'},error:null})})}),
     update:payload=>({eq:()=>({eq:()=>({select:()=>({maybeSingle:async()=>{
      const old=revision;revision++;config=structuredClone(payload.config);
      events.unshift({revision,published_at:new Date().toISOString(),snapshot:structuredClone(config),previous_revision:old});
      return {data:{revision,updated_at:new Date().toISOString()},error:null}
     }})})})})
    };
    if(name==='lanesjekk_publish_events')return {select:()=>({order:()=>({range:async(start,end)=>({data:events.slice(start,end+1),error:null})})})};
    throw Error('Unexpected table '+name);
   }
  })};
 });
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-workspace')).toBeVisible();
}


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
 await prepareStudio(page);
 await page.evaluate(()=>{
  window.lanesjekkStudioVideoAuth=async()=> 'mock-jwt';
  window.__stagedVideo=null;
  window.lanesjekkAnimationStudio.useGeneratedVideo=(module,url)=>{window.__stagedVideo={module,url}};
  const select=document.getElementById('media-target');
  if(![...select.options].some(opt=>opt.value==='budget'))select.add(new Option('Budsjett','budget'));
  select.value='budget';
  select.dispatchEvent(new Event('change',{bubbles:true}));
  window.dispatchEvent(new Event('lanesjekk-studio-ready'));
 });
 await page.locator('[data-admin-jump="animation-studio-panel"]').click();
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
