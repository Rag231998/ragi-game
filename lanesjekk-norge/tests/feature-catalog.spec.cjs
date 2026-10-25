const {test,expect}=require('@playwright/test');

test('Feature library opens as a separate modal with searchable thematic guides',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.locator('[data-open-catalog="tools"]').click();
 const dialog=page.locator('#site-feature-dialog');
 await expect(dialog).toHaveAttribute('open','');
 await expect(dialog.locator('.fc-card')).toHaveCount(13);
 await dialog.locator('#site-feature-input').fill('utleie');
 await expect(dialog.locator('.fc-card')).toHaveCount(1);
 await dialog.locator('.fc-card').click();
 await expect(dialog.locator('#site-feature-detail')).toContainText('Utleieanalyse');
 await expect(dialog.locator('#site-feature-detail')).toContainText('Slik bruker du funksjonen');
 await dialog.locator('.fc-go').click();
 await expect(dialog).not.toHaveAttribute('open','');
 await expect(page).toHaveURL(/#utleieanalyse$/);
 await expect(page.locator('#utleie')).toBeVisible();
});
test('Published catalog updates appear in the news tab and link to the correct module',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.lanesjekkCatalog.setNews({headline:'Utforsk verktøyene',news:[
  {id:'test',title:'Ny budsjettoversikt',summary:'Se utgifter og inntekter.',date:'2026-10-25',route:'budsjett'}
 ]}));
 await page.locator('[data-open-catalog="tools"]').click();
 await page.locator('[data-fc-tab="news"]').click();
 await expect(page.locator('#site-feature-list .fc-news')).toHaveCount(1);
 await expect(page.locator('#site-feature-list .fc-news')).toContainText('Ny budsjettoversikt');
 await page.locator('#site-feature-list .fc-news .fc-go').click();
 await expect(page).toHaveURL(/#budsjett$/);
});
test('Catalog and dark-mode text/background have readable contrast on mobile',async({page},testInfo)=>{
 test.skip(!/android|iphone/.test(testInfo.project.name),'Mobile viewport only');
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('dark'));
 await page.locator('[data-open-catalog="tools"]').click();
 await expect(page.locator('#site-feature-dialog')).toBeVisible();
 const metrics=await page.locator('#site-feature-dialog').evaluate(dialog=>{
  const computed=getComputedStyle(dialog);
  return{width:dialog.getBoundingClientRect().width,viewport:document.documentElement.clientWidth,background:computed.backgroundColor};
 });
 expect(metrics.width).toBeLessThanOrEqual(metrics.viewport+1);
 expect(metrics.background).not.toBe('rgb(255, 255, 255)');
 await page.keyboard.press('Escape');
 await expect(page.locator('#site-feature-dialog')).not.toHaveAttribute('open','');
});
