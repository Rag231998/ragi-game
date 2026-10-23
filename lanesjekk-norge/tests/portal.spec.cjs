const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('**/*.ico',route=>route.abort());
});
test('homepage is a multi-category, navigable financial portal',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{name:/Få mer ut av/})).toBeVisible();
 await expect(page.locator('.home-tool')).toHaveCount(12);
 await expect(page.locator('.home-editorial a')).toHaveCount(3);
 await expect(page.locator('#sjekk')).toBeHidden();
 await expect(page.locator('#bankoversikt')).toBeHidden();
 await expect(page.locator('#guider')).toBeHidden();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(page.locator('.home-tool.featured')).toHaveAttribute('href','#sparing');
});
test('savings page compares real sourced product examples by selected deposit',async({page})=>{
 await page.goto('/#sparing',{waitUntil:'domcontentloaded'});
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
 await page.goto('/#sparing',{waitUntil:'domcontentloaded'});
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
 await page.goto('/#sparing',{waitUntil:'domcontentloaded'});
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
 await page.goto('/#sparing',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#sparing-kalkulator .status-box')).toContainText('23.10.2026');
 await expect(page.locator('#sparing-kalkulator .status-box')).toContainText('ikke sanntid');
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
 await page.goto('/#guider',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.guide-article')).toHaveCount(9);
 await expect(page.locator('.long-guide')).toHaveCount(9);
 await expect(page.locator('#innskuddsgaranti')).toContainText('2 millioner');
 await expect(page.locator('#bsu')).toContainText('27 500');
 await expect(page.locator('#ips')).toContainText('25 000');
 await expect(page.locator('#kilder a').first()).toContainText('Sjekk hovedkilden');
});
test('new pages have no horizontal overflow at configured device size',async({page})=>{
 for(const path of ['/','/#sparing','/#guider','/#sjekk','/#banker']){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  const dimensions=await page.evaluate(()=>({
    document:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth
  }));
  expect(dimensions.document,path).toBeLessThanOrEqual(dimensions.viewport+3);
 }
});

test('all primary menu and cards stay on one document and use section anchors',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const origin=new URL(page.url()).origin;
 const mainNav=page.locator('.portal-nav');
 const compactMenu=!(await mainNav.isVisible());
 const savingsLink=compactMenu?page.locator('.mobile-menu a[href="#sparing"]').first():mainNav.locator('a[href="#sparing"]');
 if(compactMenu){await page.locator('.mobile-menu summary').click()}
 await savingsLink.click();
 await expect(page).toHaveURL(origin+'/#sparing');
 await expect(page.locator('#save-amount')).toBeVisible();
 await expect(page.locator('#bank-query')).toBeHidden();
 await expect(page.locator('#monthly')).toBeHidden();
 await expect(page.locator('#guider')).toBeHidden();
 const learnLink=compactMenu?page.locator('.mobile-menu a[href="#guider"]').first():mainNav.locator('a[href="#guider"]');
 if(compactMenu)await page.locator('.mobile-menu summary').click();
 await learnLink.click();
 await expect(page).toHaveURL(origin+'/#guider');
 await expect(page.locator('#artikler .guide-article')).toHaveCount(9);
 await expect(page.locator('#artikler')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
});
test('article cards open corresponding guides inline without navigation',async({page})=>{
 await page.goto('/#guider',{waitUntil:'domcontentloaded'});
 await page.locator('.guide-article a[href="#innskuddsgaranti"]').click();
 await expect(page).toHaveURL(/\/#innskuddsgaranti$/);
 await expect(page.locator('#innskuddsgaranti')).toHaveAttribute('open','');
 await expect(page.locator('#innskuddsgaranti .guide-full')).toBeVisible();
 await page.locator('#innskuddsgaranti summary').click();
 await expect(page.locator('#innskuddsgaranti')).not.toHaveAttribute('open','');
});
test('homepage contains no internal navigation to legacy savings or guide pages',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 expect(await page.locator('a[href*="sparing.html"], a[href*="guider.html"]').count()).toBe(0);
 await expect(page.locator('#sparing-kalkulator')).toBeAttached();
 await expect(page.locator('#offisielle-renter')).toBeAttached();
 await expect(page.locator('#guider')).toBeAttached();
});

test('switching views preserves inputs without showing unrelated tools',async({page})=>{
 await page.goto('/#sparing',{waitUntil:'domcontentloaded'});
 await page.locator('#save-amount').fill('310904');
 await expect(page.locator('#save-amount')).toHaveValue('310 904');
 await page.evaluate(()=>window.lanesjekkNavigate('sjekk'));
 await expect(page.locator('#sjekk')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await page.locator('#balance').fill('3109049');
 await expect(page.locator('#balance')).toHaveValue('3 109 049');
 await page.evaluate(()=>window.lanesjekkNavigate('sparing'));
 await expect(page.locator('#save-amount')).toHaveValue('310 904');
 await expect(page.locator('#sjekk')).toBeHidden();
 await page.goBack();
 await expect(page.locator('#balance')).toHaveValue('3 109 049');
 await expect(page.locator('#sparing')).toBeHidden();
});
test('deep links open exactly the requested guide window and keep calculators hidden',async({page})=>{
 await page.goto('/#bsu',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#guider')).toBeVisible();
 await expect(page.locator('#bsu')).toHaveAttribute('open','');
 await expect(page.locator('#bsu .guide-full')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(page.locator('#sjekk')).toBeHidden();
 await expect(page.locator('#bankoversikt')).toBeHidden();
});
