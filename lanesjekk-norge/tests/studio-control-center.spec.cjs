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

test('navigation chooses one category, follows preview, searches a precise object',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-budget"]').click();
 await expect(page.locator('#admin-panel-budget')).toHaveAttribute('open','');
 await expect(page.locator('#preview-inline-section')).toHaveValue('budsjett');
 await page.locator('[data-admin-jump="admin-panel-cards"]').click();
 await expect(page.locator('#admin-panel-budget')).not.toHaveAttribute('open','');
 await page.locator('#admin-object-search').fill('Kvitteringsstudio');
 await expect(page.locator('.admin-search-result').first()).toBeVisible();
 await page.locator('.admin-search-result').first().click();
 await expect(page.locator('#preview-inline-section')).toHaveValue('kvitteringer');
 await page.locator('[data-admin-jump="admin-panel-brand"]').focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('[data-admin-jump="admin-panel-budget"]')).toHaveAttribute('aria-current','page');
});

test('publish requires whole-site preview and confirmation; history captures the new revision',async({page,context})=>{
 await prepareStudio(page);
 await page.locator('#site-name').fill('Nytt nettstedutkast');
 await expect(page.locator('#admin-draft-status')).toContainText('endringer');
 const pop=context.waitForEvent('page');
 await page.locator('#admin-publish').click();
 const preview=await pop;
 await preview.waitForLoadState('domcontentloaded');
 await expect(preview).toHaveURL(/studio-preview\.html$/);
 await expect(preview.locator('#preview-state')).toContainText('Utkast oppdatert');
 await expect(page.locator('#admin-preflight')).toBeVisible();
 await expect(page.locator('#admin-preview-confirm')).toBeEnabled();
 await expect(page.locator('#admin-confirm-publish')).toBeDisabled();
 await page.locator('#admin-preview-confirm').check();
 await page.locator('#admin-confirm-publish').click();
 await expect(page.locator('#admin-preflight')).toBeHidden();
 await expect(page.locator('#admin-revision')).toContainText('2');
 await expect(page.locator('#admin-history')).toContainText('Versjon 2');
 await preview.close();
});

test('remember me is off by default with session-only or opt-in 24-hour storage',async({page})=>{
 await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.abort());
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-remember')).not.toBeChecked();
 const state=await page.evaluate(async()=>{
  const s=window.lanesjekkStudioSession;
  s.configure(false);s.storage.setItem(s.key,'test-value');
  const sessionOnly=!!sessionStorage.getItem(s.key)&&!localStorage.getItem(s.key);
  s.configure(true);s.storage.setItem(s.key,'test-value');
  const remembered=!!localStorage.getItem(s.key)&&s.remaining()>86000000&&s.remaining()<=86400000;
  localStorage.setItem('lanesjekk-studio-expiry-v3',String(Date.now()-100));
  const timedOut=s.expired()&&(await s.storage.getItem(s.key))===null;
  s.clear();return {sessionOnly,remembered,timedOut};
 });
 expect(state).toEqual({sessionOnly:true,remembered:true,timedOut:true});
});
