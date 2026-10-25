const {test,expect}=require('@playwright/test');
const BASE='https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/';
function fixture(){
 return {animations:{autoplay:true,valuation:true,rental:true,receipts:true},media:{slots:{valuation:{enabled:true,videoUrl:BASE+'video/media-abc123.mp4',posterUrl:BASE+'poster/media-def456.webp',title:'Slik finner du boligverdien',description:'Få forståelige prisgrafer',fit:'cover',loop:true}}}}
}
test('admin page contains media uploader, module controls and safe publishing affordance',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#animation-studio-panel')).toHaveCount(1);
 for(const id of ['media-target','media-video','media-poster','media-upload','media-library','media-preview','media-reset','media-enabled','media-loop','media-fit','media-title','media-description'])await expect(page.locator('#'+id)).toHaveCount(1);
 await expect(page.locator('#admin-workspace')).toBeHidden();
});
test('admin Animation Studio can stage a video and update module config without publishing',async({page})=>{
 await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.abort());
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 const setup=await page.evaluate(()=>{
  const ids=['home','loans','budget','receipts','valuation','rental','savings','investing','carloan','academy','currency'];
  const draft={slots:Object.fromEntries(ids.map(id=>[id,{enabled:true,videoUrl:'',posterUrl:'',title:'',description:'',fit:'cover',loop:true}]))};
  window.__mediaDraft=draft;
  const db={storage:{from:()=>({upload:async()=>({error:null}),list:async()=>({data:[],error:null}),getPublicUrl:(path)=>({data:{publicUrl:'https://pryrgwfjniggjlrizenh.supabase.co/storage/v1/object/public/animation-assets/'+path}})})}};
  document.getElementById('admin-workspace').hidden=false;
  document.getElementById('animation-studio-panel').open=true;
 window.lanesjekkAnimationStudio.init({db,getDraft:()=>({media:draft}),bucket:'animation-assets',notify:()=>{}});
  window.lanesjekkAnimationStudio.render();
  return document.querySelectorAll('.media-module-choice').length;
 });
 expect(setup).toBe(11);
 await page.locator('#media-target').selectOption('valuation');
 await page.locator('#media-title').fill('Premium boligvideo');
 await page.locator('#media-description').fill('Slik fungerer prisestimater');
 await page.locator('#media-video').setInputFiles({name:'intro.mp4',mimeType:'video/mp4',buffer:Buffer.from([0,0,0,24,102,116,121,112,105,115,111,109])});
 await page.locator('#media-upload').click();
 await expect(page.locator('#media-file-status')).toContainText('Video valgt');
 const state=await page.evaluate(()=>window.__mediaDraft.slots.valuation);
 expect(state.title).toBe('Premium boligvideo');
 expect(state.description).toBe('Slik fungerer prisestimater');
 expect(state.videoUrl).toMatch(/^https:\/\/pryrgwfjniggjlrizenh.supabase.co\/storage\/v1\/object\/public\/animation-assets\/video\/media-/);
 await page.locator('#media-reset').click();
 expect((await page.evaluate(()=>window.__mediaDraft.slots.valuation.videoUrl))).toBe('');
});
test('published CMS media video replaces demo and restores native animation',async({page})=>{
 const config=fixture();
 await page.route('**/rest/v1/lanesjekk_site_config*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({config,revision:1})}));
 await page.goto('/#boligverdi',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>!!window.lanesjekkCms?.configClean&&!!window.lanesjekkSiteMedia?.apply)).toBe(true);
 await page.evaluate(cfg=>window.lanesjekkCms.apply(cfg),config);
 await expect(page.locator('.studio-video-showcase[data-media-slot=valuation]')).toHaveCount(1);
 await expect(page.locator('#pv-valuation-guide')).toBeHidden();
 await expect(page.locator('.studio-video-copy h2')).toContainText('Slik finner du boligverdien');
 expect(await page.locator('.studio-video-player source').getAttribute('src')).toBe(config.media.slots.valuation.videoUrl);
 await page.evaluate(()=>window.lanesjekkCms.apply({}));
 await expect(page.locator('.studio-video-showcase[data-media-slot=valuation]')).toHaveCount(0);
 await expect(page.locator('#pv-valuation-guide')).toBeVisible();
});
test('reject untrusted video URLs in published config',async({page})=>{
 await page.goto('/#boligverdi',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>!!window.lanesjekkCms?.configClean)).toBe(true);
 const result=await page.evaluate(()=>window.lanesjekkCms.configClean({media:{slots:{valuation:{videoUrl:'https://malicious.example/video.mp4',posterUrl:'javascript:alert(1)'}}}}).media.slots.valuation);
 expect(result.videoUrl).toBe('');
 expect(result.posterUrl).toBe('');
});
test('premium video modules remain inside mobile viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#boligverdi',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>!!window.lanesjekkCms?.apply)).toBe(true);
 await page.waitForLoadState('networkidle');
 await page.evaluate(cfg=>window.lanesjekkCms.apply(cfg),fixture());
 await expect(page.locator('.studio-video-showcase[data-media-slot=valuation]')).toHaveCount(1);
 const sizes=await page.evaluate(()=>({
  document:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
  module:document.querySelector('.studio-video-showcase[data-media-slot=valuation]').getBoundingClientRect().width
 }));
 expect(sizes.document).toBeLessThanOrEqual(sizes.viewport+2);
 expect(sizes.module).toBeLessThanOrEqual(sizes.viewport+2);
});
