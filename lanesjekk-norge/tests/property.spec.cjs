const {test,expect}=require('@playwright/test');
const data={source:'SSB',table:'14310',municipality:'0301',regionLabel:'Oslo',propertyTypeLabel:'Blokkleiligheter',rows:[{period:'2026K1',sqm:80000,sales:99},{period:'2026K2',sqm:82000,sales:119}],latest:{period:'2026K2',sqm:82000,sales:119}};
test.beforeEach(async({page})=>{
 await page.route('**/api/property-market?*',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
});
test('SSB-based home value changes when apartment size or condition changes',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#property-value-studio')).toBeVisible();
 await page.locator('#pv-municipality').fill('0301');
 await page.locator('#pv-area').fill('75');
 await page.locator('#pv-estimate').click();
 await expect(page.locator('#pv-value')).toContainText('6');
 await expect(page.locator('#pv-quarter')).toHaveText('2026K2');
 await expect(page.locator('#pv-sales')).toContainText('119');
 await page.locator('#pv-area').fill('90');
 await expect(page.locator('#pv-value')).toContainText('7');
 await page.locator('#pv-adjust').fill('10');
 await expect(page.locator('#pv-adjust-output')).toHaveText('+10 %');
});
test('user-entered broker values are distinct, removable and median calculated',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await page.locator('#pv-municipality').fill('0301');await page.locator('#pv-estimate').click();
 await page.locator('#pv-provider').selectOption('Krogsveen');
 await page.locator('#pv-broker-value').fill('6000000');await page.locator('#pv-broker-add').click();
 await page.locator('#pv-provider').selectOption('DNB Eiendom');
 await page.locator('#pv-broker-value').fill('6400000');await page.locator('#pv-broker-add').click();
 await expect(page.locator('#pv-broker-count')).toContainText('2');
 await expect(page.locator('#pv-median')).toContainText('6');
 await expect(page.locator('.pv-compare-row')).toHaveCount(3);
 await expect(page.locator('.pv-compare-row').nth(1)).toContainText('Brukerregistrert');
 await page.locator('.pv-remove').first().click();
 await expect(page.locator('.pv-compare-row')).toHaveCount(2);
});
test('property studio stays within the mobile viewport',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#property-value-studio')).toBeVisible();
 const sizing=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 expect(sizing.documentWidth).toBeLessThanOrEqual(sizing.viewport+2);
});
