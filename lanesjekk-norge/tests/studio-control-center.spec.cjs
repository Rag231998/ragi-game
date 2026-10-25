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

test('publication history exists once below editor and not in category navigation',async({page})=>{
 await prepareStudio(page);
 await expect(page.locator('[data-admin-jump="admin-panel-history"]')).toHaveCount(0);
 await expect(page.locator('#admin-panel-history')).toHaveCount(1);
 await expect(page.locator('#admin-panel-history')).toBeVisible();
 await expect(page.locator('#admin-history')).toHaveCount(1);
 await expect(page.locator('#admin-history-search')).toHaveCount(1);
 await expect(page.locator('#admin-history-refresh')).toHaveCount(1);
 const geometry=await page.evaluate(()=>{
  const hist=document.getElementById('admin-panel-history').getBoundingClientRect();
  const shell=document.getElementById('admin-dashboard-grid').getBoundingClientRect();
  return {under:hist.y>=shell.y+shell.height-2,width:hist.width,workspaceWidth:shell.width};
 });
 expect(geometry.under).toBe(true);
 expect(geometry.width).toBeGreaterThan(geometry.workspaceWidth*.8);
 await page.locator('#admin-history-search').fill('Versjon');
 await page.locator('[data-admin-jump="admin-panel-budget"]').click();
 await expect(page.locator('#admin-panel-history')).toBeVisible();
 await expect(page.locator('#admin-history-search')).toHaveValue('Versjon');
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


test('Add Function creates editable card and real route immediately without losing the draft',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-catalog"]').click();
 await expect(page.locator('#catalog-tool-route')).toBeVisible();
 await page.locator('#catalog-tool-route').selectOption('kvitteringer');
 await page.locator('#catalog-add-tool').click();
 const card=page.locator('#catalog-tool-editor .catalog-editor-card').first();
 await expect(card).toBeVisible();
 await expect(card.locator('input[aria-label="Tittel på kortet"]')).toBeFocused();
 await expect(card.locator('input[aria-label="Tittel på kortet"]')).toHaveValue('Kvitteringsstudio');
 await expect(card.locator('select[aria-label="Åpner eksisterende verktøy"]')).toHaveValue('kvitteringer');
 await expect(card.locator('input[role="switch"]')).toBeChecked();
 await expect(page.locator('#catalog-tools-count')).toContainText('1 ekstra');
 await expect(page.locator('#admin-draft-status')).toContainText('endringer');
 await expect.poll(()=>page.frameLocator('#admin-frame').locator('.cms-custom-tool[href="#kvitteringer"]').count()).toBe(1);
 await card.locator('input[aria-label="Tittel på kortet"]').fill('Kvitteringsanalyse');
 await expect(page.frameLocator('#admin-frame').locator('.cms-custom-tool strong')).toContainText('Kvitteringsanalyse');
 await page.locator('[data-admin-jump="admin-panel-budget"]').click();
 await page.locator('[data-admin-jump="admin-panel-catalog"]').click();
 await expect(page.locator('#catalog-tool-editor .catalog-editor-card input[aria-label="Tittel på kortet"]')).toHaveValue('Kvitteringsanalyse');
 await page.locator('#catalog-tool-editor .catalog-editor-card button').filter({hasText:'Slett kort'}).click();
 await expect(page.locator('#catalog-tools-count')).toContainText('0 ekstra');
 await expect(page.frameLocator('#admin-frame').locator('.cms-custom-tool')).toHaveCount(0);
});

test('Add update instantly opens an editable prefilled item, previews news, and validates publish',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-catalog"]').click();
 await page.locator('#catalog-news-route').selectOption('boligverdi');
 await page.locator('#catalog-add-news').click();
 const news=page.locator('#catalog-news-editor .catalog-editor-card').first();
 await expect(news).toBeVisible();
 await expect(news.locator('input[aria-label="Overskrift på oppdateringen"]')).toBeFocused();
 await expect(news.locator('input[aria-label="Overskrift på oppdateringen"]')).toHaveValue('Nytt i Boligverdi');
 await expect(news.locator('select[aria-label="Åpner funksjon"]')).toHaveValue('boligverdi');
 await expect(news.locator('input[type="date"]')).toHaveValue(/\d{4}-\d{2}-\d{2}/);
 await expect(page.locator('#admin-draft-status')).toContainText('endringer');
 await news.locator('button').filter({hasText:'Vis oppdateringen i Studio'}).click();
 await expect(page.locator('#site-feature-dialog')).toBeVisible();
 await expect(page.locator('#site-feature-list .fc-news')).toContainText('Nytt i Boligverdi');
 await page.keyboard.press('Escape');
 await news.locator('input[aria-label="Overskrift på oppdateringen"]').fill('');
 await page.locator('#admin-publish').click();
 await expect(page.locator('#admin-preflight')).not.toHaveAttribute('open','');
 await expect(page.locator('#admin-catalog-status')).toContainText('Fyll ut');
 await news.locator('input[aria-label="Overskrift på oppdateringen"]').fill('Nye boligdata og bedre oversikt');
 await expect(page.locator('#admin-draft-status')).toContainText('endringer');
 await expect(page.locator('#catalog-news-count')).toContainText('1 oppdateringer');
});

test('Additional cards require functioning internal route, not a fictitious calculator',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-catalog"]').click();
 await page.locator('#catalog-tool-route').selectOption('budsjett');
 await page.locator('#catalog-add-tool').click();
 const card=page.locator('#catalog-tool-editor .catalog-editor-card').first();
 await card.locator('select[aria-label="Åpner eksisterende verktøy"]').selectOption('billan');
 await expect(card.locator('input[aria-label="Tittel på kortet"]')).toHaveValue('Billån');
 await expect(page.frameLocator('#admin-frame').locator('.cms-custom-tool[href="#billan"]')).toHaveCount(1);
 await card.locator('input[role="switch"]').uncheck();
 await expect(page.frameLocator('#admin-frame').locator('.cms-custom-tool')).toHaveCount(0);
 await card.locator('input[role="switch"]').check();
 await expect(page.frameLocator('#admin-frame').locator('.cms-custom-tool')).toHaveCount(1);
});

test('All Studio categories open exactly one editor, preserve unsaved drafts and keep preview route synchronized',async({page})=>{
 await prepareStudio(page);
 const cases=[
  ['admin-panel-brand','topp'],['admin-panel-budget','budsjett'],
  ['admin-panel-cards','topp'],['admin-panel-slides','topp'],
  ['admin-panel-motion','boligverdi'],['animation-studio-panel','topp'],
  ['admin-panel-catalog','topp'],['admin-panel-invest','investering']
 ];
 for(const [id,route] of cases){
  await page.locator('[data-admin-jump="'+id+'"]').click();
  await expect(page.locator('#'+id)).toHaveAttribute('open','');
  await expect(page.locator('[data-admin-jump="'+id+'"]')).toHaveAttribute('aria-current','page');
  await expect(page.locator('#preview-inline-section')).toHaveValue(route);
  await expect(page.locator('#admin-workspace .admin-edit-panel>details[open]')).toHaveCount(1);
 }
 await page.locator('[data-admin-jump="admin-panel-slides"]').click();
 await expect(page.locator('#slide-editor .admin-slide-item')).toHaveCount(6);
 const title=page.locator('#slide-editor .admin-slide-item').first().locator('input[type="text"]');
 await title.fill('Et gjennomtestet utkast');
 await page.locator('[data-admin-jump="admin-panel-budget"]').click();
 await page.locator('[data-admin-jump="admin-panel-slides"]').click();
 await expect(page.locator('#slide-editor .admin-slide-item').first().locator('input[type="text"]')).toHaveValue('Et gjennomtestet utkast');
 await expect(page.locator('#admin-draft-status')).toContainText('endringer');
});

test('Advertising scene cards have full-width readable inputs and controls at desktop, tablet and phone sizes',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-slides"]').click();
 for(const width of [1800,1440,1280,820,390]){
  await page.setViewportSize({width,height:900});
  const info=await page.locator('#slide-editor .admin-slide-item').first().evaluate(el=>{
   const input=el.querySelector('input[type="text"]'),area=el.querySelector('textarea'),switcher=el.querySelector('input[type="checkbox"]'),label=el.querySelector('.admin-slide-visibility');
   const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,width:r.width,height:r.height}};
   return {outer:rect(el),title:rect(input),area:rect(area),toggle:rect(switcher),label:rect(label),visible:getComputedStyle(el).display};
  });
  expect(info.outer.width,'card width at '+width).toBeGreaterThan(210);
  expect(info.title.width,'title width at '+width).toBeGreaterThan(190);
  expect(info.area.width,'textarea width at '+width).toBeGreaterThan(190);
  expect(info.title.width/info.outer.width,'proportion at '+width).toBeGreaterThan(.7);
  expect(info.label.width,'toggle width at '+width).toBeGreaterThan(170);
  expect(info.visible,'layout at '+width).toBe('grid');
  await expect(page.locator('#slide-editor .admin-slide-item').first().locator('.admin-slide-tools button')).toHaveCount(2);
 }
});

test('Dark Studio displays readable advertising controls and retains one appearance preference',async({page})=>{
 await prepareStudio(page);
 await page.locator('[data-admin-jump="admin-panel-slides"]').click();
 await page.locator('#admin-ui-theme').selectOption('dark');
 await expect(page.locator('html')).toHaveClass(/studio-dark/);
 const rgb=await page.locator('#slide-editor .admin-slide-field>input').first().evaluate(input=>({
  background:getComputedStyle(input).backgroundColor,ink:getComputedStyle(input).color
 }));
 expect(rgb.background).not.toBe('rgb(255, 255, 255)');
 expect(rgb.ink).not.toBe(rgb.background);
 await expect(page.locator('#admin-panel-history')).toHaveCount(1);
});

test('Free AI video shows real provider readiness, disables unconfigured generation and supports retry',async({page})=>{
 let checks=0;
 await page.route('**/api/admin-video?**',route=>{
  const url=new URL(route.request().url()),action=url.searchParams.get('action');
  if(action==='ready'){checks++;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,configured:false,freeOnly:true,setup:'OPENROUTER_API_KEY mangler. Ingen betaling.'})})}
  return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,error:'Ikke konfigurert'})});
 });
 await prepareStudio(page);
 await page.locator('[data-admin-jump="animation-studio-panel"]').click();
 await page.locator('#media-workspace-tab-ai').click();
 await expect(page.locator('#studio-ai-generate')).toBeDisabled();
 await expect(page.locator('#studio-ai-connection')).toContainText('OPENROUTER_API_KEY');
 await expect(page.locator('#studio-ai-recheck')).toBeVisible();
 const before=checks;
 await page.locator('#studio-ai-recheck').click();
 await expect.poll(()=>checks).toBeGreaterThan(before);
 await expect(page.locator('#studio-ai-generate')).toBeDisabled();
});
