const {test,expect}=require('@playwright/test');
test('receipt studio starts with clear empty state and supports manual quantity',async({page})=>{
 await page.goto('/#kvitteringer',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#receipt-empty')).toBeVisible();
 await page.locator('#receipt-add-item').click();
 await expect(page.locator('#receipt-empty')).toBeHidden();
 await expect(page.locator('#receipt-items tr')).toHaveCount(1);
 await page.locator('#receipt-items tr td:nth-child(2) input').fill('3');
 await page.locator('#receipt-items tr td:nth-child(2) input').blur();
 await expect(page.locator('#receipt-count')).toHaveText('3');
 await page.locator('#receipt-items tr .receipt-delete').click();
 await expect(page.locator('#receipt-empty')).toBeVisible();
});
test('OCR correction text recognises totals, category and quantity',async({page})=>{
 await page.goto('/#kvitteringer',{waitUntil:'domcontentloaded'});
 await page.locator('.receipt-textentry summary').click();
 await page.locator('#receipt-raw').fill('REMA 1000\n3 x KOKESJOKOLADE 25,80\nPANT 3,00\nBANK 28,80\nSUM 28,80');
 await page.locator('#receipt-parse').click();
 await expect(page.locator('#receipt-items tr')).toHaveCount(2);
 await expect(page.locator('#receipt-count')).toHaveText('4');
 await expect(page.locator('#receipt-check')).toContainText('Stemmer');
 await expect(page.locator('#receipt-items tr').first().locator('input').first()).toHaveValue('KOKESJOKOLADE');
 await expect(page.locator('#receipt-items tr').nth(1).locator('select')).toHaveValue('Pant og retur');
});
test('menu dropdowns are exclusive and close with Escape',async({page},testInfo)=>{
 test.skip(testInfo.project.name.startsWith('iphone')||testInfo.project.name.startsWith('android'),'Mobile uses a separate menu');
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const groups=page.locator('.site-header .portal-nav > details.nav-group');
 await groups.nth(0).locator('summary').click();
 await expect(groups.nth(0)).toHaveAttribute('open','');
 await groups.nth(1).locator('summary').click();
 await expect(groups.nth(0)).not.toHaveAttribute('open','');
 await expect(groups.nth(1)).toHaveAttribute('open','');
 await page.keyboard.press('Escape');
 await expect(groups.nth(1)).not.toHaveAttribute('open','');
});

test('stable homepage and budget navigation',async({page})=>{await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('.hero h1')).toBeVisible();await expect(page.locator('.home-tool-grid a.home-tool')).toHaveCount(14);await page.locator('.hero a[href="#sparing"]').click();await expect(page.locator('#sparing')).toBeVisible();});
