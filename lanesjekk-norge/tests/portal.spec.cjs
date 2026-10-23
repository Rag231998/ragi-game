const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('**/*.ico',route=>route.abort());
});
test('homepage is a multi-category, navigable financial portal',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{name:/Få mer ut av/})).toBeVisible();
 await expect(page.locator('.home-tool')).toHaveCount(8);
 await expect(page.locator('.home-editorial a')).toHaveCount(3);
 await expect(page.locator('#sjekk')).toBeAttached();
 await expect(page.locator('#banker')).toBeAttached();
 await expect(page.locator('.home-tool.featured')).toHaveAttribute('href','./sparing.html');
});
test('savings page compares real sourced product examples by selected deposit',async({page})=>{
 await page.goto('/sparing.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#save-results .saving-result')).toHaveCount(10);
 await expect(page.locator('#winner-name')).toContainText('KLP Banken');
 await page.locator('#save-amount').fill('500000');
 await expect(page.locator('#save-amount')).toHaveValue('500 000');
 await expect(page.locator('#save-amount-title')).toContainText(/500\s?000/);
 await expect(page.locator('#save-results')).toContainText('Storebrand');
 await expect(page.locator('#save-results')).toContainText('DNB');
 await page.locator('#save-members').check();
 await expect(page.locator('#winner-name')).toContainText('OBOS-banken');
 await expect(page.locator('#winner-name')).toContainText('Sparekonto Langsiktig');
 await page.locator('#save-filter').selectOption('fri');
 await expect(page.locator('#save-results')).not.toContainText('Sparekonto Langsiktig');
});
test('bank search, empty state and reset on savings page work',async({page})=>{
 await page.goto('/sparing.html',{waitUntil:'domcontentloaded'});
 await page.locator('#save-search').fill('storebrand');
 await expect(page.locator('#save-results .saving-result')).toHaveCount(1);
 await expect(page.locator('.saving-bank')).toHaveText('Storebrand Bank');
 await page.locator('#save-search').fill('no such bank 1234567');
 await expect(page.locator('#winner-name')).toHaveText('Ingen treff');
 await page.locator('#save-reset').click();
 await expect(page.locator('#save-search')).toHaveValue('');
 await expect(page.locator('#save-amount')).toHaveValue('100 000');
 await expect(page.locator('#save-results .saving-result')).toHaveCount(10);
});
test('projection chart and slider recalculate and handle invalid input',async({page})=>{
 await page.goto('/sparing.html',{waitUntil:'domcontentloaded'});
 const baseline=await page.locator('#projection-total').innerText();
 await page.locator('#projection-monthly').fill('5000');
 await expect(page.locator('#projection-monthly')).toHaveValue('5 000');
 await expect(page.locator('#projection-total')).not.toHaveText(baseline);
 await expect(page.locator('#projection-chart .column')).toHaveCount(10);
 await page.locator('#projection-rate').fill('0');
 await expect(page.locator('#projection-total')).toContainText(/700\s?000/);
 await page.locator('#save-amount').fill('');
 await expect(page.locator('#save-error')).toBeVisible();
 await expect(page.locator('#projection-total')).toHaveText('–');
});
test('savings disclosure distinguishes snapshot from original official remote tool',async({page})=>{
 await page.goto('/sparing.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.status-box')).toContainText('23.10.2026');
 await expect(page.locator('.status-box')).toContainText('ikke sanntid');
 await expect(page.locator('#official-container')).toBeHidden();
 await page.route('https://www.forbrukerradet.no/finansportalen/bank/iframe/innskudd',route=>
  route.fulfill({status:200,contentType:'text/html',body:'<h1>Forbrukerrådet – innskudd</h1>'}));
 await page.locator('#official-launch').click();
 await expect(page.locator('#official-container')).toBeVisible();
 await expect(page.locator('#official-container iframe')).toHaveAttribute('src','https://www.forbrukerradet.no/finansportalen/bank/iframe/innskudd');
 await page.locator('#official-launch').click();
 await expect(page.locator('#official-container iframe')).toHaveCount(0);
});
test('guide articles have sources and are reachable from homepage',async({page})=>{
 await page.goto('/guider.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.guide-article')).toHaveCount(9);
 await expect(page.locator('.long-guide')).toHaveCount(9);
 await expect(page.locator('#innskuddsgaranti')).toContainText('2 millioner');
 await expect(page.locator('#bsu')).toContainText('27 500');
 await expect(page.locator('#ips')).toContainText('25 000');
 await expect(page.locator('#kilder a')).toContainText('Sjekk hovedkilden');
});
test('new pages have no horizontal overflow at configured device size',async({page})=>{
 for(const path of ['/','/sparing.html','/guider.html']){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  const dimensions=await page.evaluate(()=>({
    document:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth
  }));
  expect(dimensions.document,path).toBeLessThanOrEqual(dimensions.viewport+3);
 }
});
