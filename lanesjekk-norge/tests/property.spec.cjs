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
 await expect(page.locator('#pv-adjust')).toHaveCount(0);
 await expect(page.locator('#pv-value')).toContainText('7');
});
test('user-entered broker values are distinct, removable and median calculated',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await page.locator('#pv-municipality').fill('0301');await page.locator('#pv-area').fill('75');await page.locator('#pv-estimate').click();
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

test('live address suggestions appear while typing and exact address can be selected',async({page})=>{
 const find={query:'Ammerudgrenda 172',streets:['Ammerudgrenda'],resultsCount:1,suggestions:[{id:'10144-172--0301',street:'Ammerudgrenda',text:'Ammerudgrenda 172',number:172,postal:'0960',place:'OSLO',municipality:'OSLO',municipalityCode:'0301'}]};
 await page.route('**/api/address-search?*',async route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(find)}));
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 const input=page.locator('#pv-address');
 await input.fill('Ammerudgrenda 172');
 await expect(page.locator('.pv-address-choice').first()).toContainText('Ammerudgrenda 172');
 await page.locator('.pv-address-choice').first().click();
 await expect(page.locator('#pv-municipality')).toHaveValue('0301');
 await expect(page.locator('#pv-address-verified')).toBeVisible();
 await expect(page.locator('#pv-area')).toHaveValue('');
 await page.locator('#pv-area').fill('76');
 await page.locator('#pv-estimate').click();
 await expect(page.locator('#pv-badge')).toContainText('SSB');
 await expect(page.locator('#pv-value')).toContainText('6');
});
test('property tabs separate valuation and rental tools',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.pv-shell')).toBeVisible();
 await expect(page.locator('.rental-workspace')).toBeHidden();
 await page.locator('#pv-mode-rental').click();
 await expect(page.locator('.rental-workspace')).toBeVisible();
 await expect(page.locator('.pv-shell')).toBeHidden();
 await page.locator('#pv-mode-valuation').click();
 await expect(page.locator('.pv-shell')).toBeVisible();
});

test('animated guides use admin visibility settings without replay buttons',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#pv-valuation-guide')).toBeVisible();
 await expect(page.locator('.pv-guide-replay')).toHaveCount(0);
 await expect(page.locator('#receipt-tour-play')).toHaveCount(0);
 await expect(page.locator('#receipt-tour-pause')).toHaveCount(0);
 const options=await page.evaluate(()=>{
  const cms=window.lanesjekkCms;
  const options=cms.configClean({animations:{autoplay:false,valuation:false,rental:false,receipts:false}}).animations;
  cms.apply({animations:options});
  return options;
 });
 expect(options).toEqual({autoplay:false,valuation:false,rental:false,receipts:false});
 await expect(page.locator('#pv-valuation-guide')).toBeHidden();
 await expect(page.locator('#pv-rental-guide')).toBeHidden();
 await expect(page.locator('html')).toHaveClass(/cms-stop-demo-motion/);
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 for(const id of ['motion-autoplay','motion-valuation','motion-rental','motion-receipts'])await expect(page.locator('#'+id)).toHaveCount(1);
});
