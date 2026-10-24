const {test,expect}=require('@playwright/test');
test('receipt studio starts with clear empty state and supports manual quantity',async({page})=>{
 await page.goto('/#kvitteringer',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#receipt-empty')).toBeVisible();
 await page.locator('#receipt-add-item').click();
 await expect(page.locator('#receipt-empty')).toBeHidden();
 await expect(page.locator('.receipt-item-card')).toHaveCount(1);
 await page.locator('.receipt-item-card .receipt-item-qty input').fill('3');
 await page.locator('.receipt-item-card .receipt-item-qty input').blur();
 await expect(page.locator('#receipt-count')).toHaveText('3');
 await page.locator('.receipt-item-card .receipt-delete').click();
 await expect(page.locator('#receipt-empty')).toBeVisible();
});
test('OCR correction text recognises totals, category and quantity',async({page})=>{
 await page.goto('/#kvitteringer',{waitUntil:'domcontentloaded'});
 await page.locator('.receipt-textentry summary').click();
 await page.locator('#receipt-raw').fill('REMA 1000\n3 x KOKESJOKOLADE 25,80\nPANT 3,00\nBANK 28,80\nSUM 28,80');
 await page.locator('#receipt-parse').click();
 await expect(page.locator('.receipt-item-card')).toHaveCount(2);
 await expect(page.locator('#receipt-count')).toHaveText('4');
 await expect(page.locator('#receipt-check')).toContainText('Stemmer');
 await expect(page.locator('.receipt-item-card').first().locator('.receipt-item-name input')).toHaveValue('KOKESJOKOLADE');
 await expect(page.locator('.receipt-item-card').nth(1).locator('.receipt-item-category select')).toHaveValue('Pant og retur');
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

test('cinematic slider shows five independently animated scenes and navigates',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const hero=page.locator('#loan-showcase');
 await expect(hero).toBeVisible();
 await expect(page.locator('.sc-slide')).toHaveCount(5);
 await expect(page.locator('.sc-slide.is-active')).toHaveCount(1);
 await expect(page.locator('.sc-slide[data-sc-index="0"]')).toHaveClass(/is-active/);
 await page.locator('.sc-next').click();
 await expect(page.locator('.sc-slide[data-sc-index="1"]')).toHaveClass(/is-active/);
 await page.locator('.sc-pause').click();
 await expect(hero).toHaveClass(/sc-paused/);
 await expect(page.locator('.sc-pause')).toHaveAttribute('aria-pressed','true');
 await page.locator('.sc-chapter[data-sc-goto="2"]').click();
 await expect(page.locator('.sc-slide[data-sc-index="2"]')).toHaveClass(/is-active/);
 await page.locator('.sc-pause').click();
 await expect(page.locator('.sc-pause')).toHaveAttribute('aria-pressed','false');
 await page.locator('.sc-slide.is-active .sc-action').click();
 await expect(page.locator('#kvitteringer')).toBeVisible();
});
test('mobile campaign hero has no page-width overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loan-showcase')).toBeVisible();
 await page.locator('.sc-next').click();
 await expect(page.locator('.sc-slide[data-sc-index="1"]')).toHaveClass(/is-active/);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(overflow).toBe(false);
});
