const {test,expect}=require('@playwright/test');
test('Budget reporting is local to budget, opens a readable preview and saves a PDF',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#ln-report-open')).toBeVisible();
 await page.locator('#ln-report-open').click();
 await expect(page.locator('#ln-report-modal')).toBeVisible();
 await expect(page.locator('#ln-report-preview')).toHaveAttribute('srcdoc',/budget-report-rows|Resultater/);
 const preview=page.frameLocator('#ln-report-preview');
 await expect(preview.locator('.paper')).toBeVisible();
 await expect(preview.locator('body')).toContainText('Lånesjekk Norge');
 await page.locator('#ln-report-consent').check();
 await page.locator('#ln-report-save').click();
 await expect(page.locator('#ln-report-status')).toContainText('lagret lokalt');
 await page.locator('#ln-report-open-saved').click();
 await expect(page.locator('#ln-report-status')).toContainText('Viser sist lagrede');
 await page.locator('#ln-report-close').click();
 await expect(page.locator('#ln-report-modal')).toBeHidden();
});
test('Encrypted budget share link opens in a fresh browser context',async({page,browser})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-report-consent').check();
 await page.locator('#ln-report-private-link').click();
 await expect(page.locator('#ln-report-status')).toContainText('Kryptert delingslenke er kopiert');
 const link=await page.evaluate(()=>navigator.clipboard.readText());
 expect(link).toContain('#delt=');
 const isolated=await browser.newContext();
 try{const recipient=await isolated.newPage();await recipient.goto(link,{waitUntil:'domcontentloaded'});await expect(recipient.locator('#ln-report-modal')).toBeVisible();await expect(recipient.locator('#ln-report-status')).toContainText('Rapport åpnet via kryptert lenke');await expect(recipient.frameLocator('#ln-report-preview').locator('body')).toContainText('Lånesjekk Norge')}finally{await isolated.close()}
});
test('Assistant and report are not independent floating overlays',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#ln-report-open')).toHaveCSS('position','static');
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-assistant-panel')).toBeVisible();
 await expect(page.locator('#ln-assistant-open')).toBeHidden();
 await page.locator('[data-ln-tab="share"]').click();
 await expect(page.locator('.ln-vault')).toBeVisible();
 await page.locator('[data-ln-tab="chat"]').click();
 await expect(page.locator('#ln-assistant-form')).toBeVisible();
});
