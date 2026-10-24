const {test,expect}=require('@playwright/test');
const rate={from:'NOK',to:'EUR',rate:0.085,date:'2026-10-23',source:'Frankfurter – test fixture'};
const history={from:'NOK',to:'EUR',lastDate:'2026-10-23',points:[{date:'2026-10-20',rate:0.082},{date:'2026-10-21',rate:0.084},{date:'2026-10-23',rate:0.085}]};
test.beforeEach(async({page})=>{
 await page.route('**/api/currency-history?**',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(history)}));
 await page.route('**/api/currency?**',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rate)}));
});
test('Valutakompass is a separate working view with real calculations and history',async({page})=>{
 await page.goto('/#valutakompass',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#valutakompass')).toBeVisible();
 await expect(page.locator('#loan-showcase')).toBeHidden();
 await expect(page.locator('#ln-explainer')).toHaveCount(0);
 await expect(page.locator('#vc-result')).toContainText('850,00');
 await expect(page.locator('#vc-rate')).toContainText('0,085000');
 await expect(page.locator('#vc-date')).toHaveText('2026-10-23');
 await expect(page.locator('#vc-chart path')).not.toHaveCount(0);
 await page.locator('#vc-amount').fill('20 000');
 await expect(page.locator('#vc-result')).toContainText('1 700,00');
 await page.locator('#vc-fee').fill('0');
 await expect(page.locator('#vc-after-fee')).toContainText('1 700,00');
});
test('Homepage has one carousel with six scenes, including Valutakompass',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loan-showcase')).toBeVisible();
 await expect(page.locator('#loan-showcase .sc-slide')).toHaveCount(6);
 await expect(page.locator('#loan-showcase .sc-chapter')).toHaveCount(6);
 await expect(page.locator('#ln-explainer')).toHaveCount(0);
 await page.locator('.sc-chapter[data-sc-goto="5"]').click();
 await expect(page.locator('.sc-currency')).toHaveClass(/is-active/);
 await page.locator('.sc-currency .sc-action').click();
 await expect(page).toHaveURL(/#valutakompass$/);
 await expect(page.locator('#valutakompass')).toBeVisible();
});
test('Currency page is not wider than viewport',async({page})=>{
 await page.goto('/#valutakompass',{waitUntil:'domcontentloaded'});
 const dimensions=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width+2);
});
