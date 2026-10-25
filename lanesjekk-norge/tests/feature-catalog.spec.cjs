const {test,expect}=require('@playwright/test');

test('Feature directory is absent from public navigation and belongs to Studio',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await expect(page.locator('[data-open-catalog]')).toHaveCount(0);
 await expect(page.locator('#site-feature-dialog')).toHaveCount(0);
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-open-features')).toHaveCount(1);
 await expect(page.locator('#site-feature-dialog')).toHaveCount(1);
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkCatalog?.open)).toBe('function');
});

test('Studio feature directory opens in its own searchable window with thematic guides',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkCatalog?.open)).toBe('function');
 // Authentication is never bypassed: open the already rendered catalog component in an isolated UI test.
 await page.evaluate(()=>window.lanesjekkCatalog.open('tools'));
 const dialog=page.locator('#site-feature-dialog');
 await expect(dialog).toHaveAttribute('open','');
 await expect(dialog.locator('.fc-card')).toHaveCount(13);
 await dialog.locator('#site-feature-input').fill('utleie');
 await expect(dialog.locator('.fc-card')).toHaveCount(1);
 await dialog.locator('.fc-card').click();
 await expect(dialog.locator('#site-feature-detail')).toContainText('Utleieanalyse');
 await expect(dialog.locator('#site-feature-detail')).toContainText('Slik bruker du funksjonen');
 await page.keyboard.press('Escape');
 await expect(dialog).not.toHaveAttribute('open','');
});

test('Studio release-notes tab shows a draft announcement and links to draft preview route',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkCatalog?.open)).toBe('function');
 await page.evaluate(()=>{
  window.__catalogTestRoute=null;
  window.lanesjekkStudioPreviewRoute=route=>{window.__catalogTestRoute=route};
  window.lanesjekkCatalog.setNews({headline:'Verktøyoversikten',news:[{
   id:'test',title:'Ny budsjettoversikt',summary:'Se utgifter og inntekter.',date:'2026-10-25',route:'budsjett'
  }]});
  window.lanesjekkCatalog.open('news');
 });
 await expect(page.locator('#site-feature-list .fc-news')).toHaveCount(1);
 await expect(page.locator('#site-feature-list .fc-news')).toContainText('Ny budsjettoversikt');
 await page.locator('#site-feature-list .fc-news .fc-go').click();
 await expect.poll(()=>page.evaluate(()=>window.__catalogTestRoute)).toBe('budsjett');
 await expect(page).toHaveURL(/studio-admin\.html$/);
});

test('Studio directory has usable responsive dark-mode contrast',async({page},testInfo)=>{
 test.skip(!/android|iphone/.test(testInfo.project.name),'Mobile viewport only');
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await page.locator('#admin-ui-theme').selectOption('dark');
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkCatalog?.open)).toBe('function');
 await page.evaluate(()=>window.lanesjekkCatalog.open('tools'));
 await expect(page.locator('#site-feature-dialog')).toBeVisible();
 const metrics=await page.locator('#site-feature-dialog').evaluate(dialog=>({
  width:dialog.getBoundingClientRect().width,
  viewport:document.documentElement.clientWidth,
  background:getComputedStyle(dialog).backgroundColor
 }));
 expect(metrics.width).toBeLessThanOrEqual(metrics.viewport+1);
 expect(metrics.background).not.toBe('rgb(255, 255, 255)');
 await page.keyboard.press('Escape');
 await expect(page.locator('#site-feature-dialog')).not.toHaveAttribute('open','');
});
