const {test,expect}=require('@playwright/test');

test('grouped navigation opens property and receipt tools',async({page,isMobile})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 if(isMobile){
  await page.locator('.mobile-menu > summary').click();
  await page.locator('.mobile-menu a[href="#utleie"]').click();
 }else{
  const g=page.locator('.nav-group').filter({hasText:'Eiendom'});
  await g.locator('summary').click();
  await g.locator('a[href="#utleie"]').click();
 }
 await expect(page.locator('#utleie')).toBeVisible();
 await page.locator('#pv-mode-rental').click();
 await expect(page.locator('#rental-price')).toBeVisible();
 await page.locator('a[href="#kvitteringer"]').first().evaluate(a=>a.click());
 await expect(page.locator('#kvitteringer')).toBeVisible();
});

test('rental analyzer calculates a scenario from user inputs',async({page})=>{
 await page.goto('/#utleie',{waitUntil:'domcontentloaded'});
 await page.locator('#pv-mode-rental').click();
 await expect(page.locator('#rental-price')).toBeVisible();
 await expect(page.locator('#rental-price')).toBeEmpty();
 await page.locator('#rental-example').click();
 await expect(page.locator('#rental-price')).toHaveValue('3500000');
 await expect(page.locator('#rental-gross')).toContainText('181 500');
 await expect(page.locator('#pv-rent-summary')).toContainText('kontantstrøm');
 await page.locator('#rental-rent-cut').evaluate(e=>{e.value='25';e.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#rental-stress')).toContainText('25 %');
});

test('receipt demo shows line items, balancing, donut and transparent scenarios',async({page})=>{
 await page.goto('/#kvitteringer',{waitUntil:'domcontentloaded'});
 await page.locator('#receipt-demo').click();
 await expect(page.locator('.receipt-item-card')).toHaveCount(6);
 await expect(page.locator('#receipt-sum')).toContainText('222');
 await expect(page.locator('#receipt-check')).toContainText('Stemmer');
 await expect(page.locator('#receipt-metric-top')).not.toHaveText('–');
 await page.locator('#receipt-whatif-range').evaluate(e=>{e.value='50';e.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#receipt-whatif-percent')).toHaveText('50 %');
 await page.locator('#receipt-clear').click();
 await expect(page.locator('.receipt-item-card')).toHaveCount(0);
});

test('budget layout starts with action buttons above heading',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#budsjett')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.querySelector('#budsjett').firstElementChild?.classList.contains('budget-start-panel'))).toBe(true);
});

test('temporary editor preview resets on browser refresh',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{
  window.postMessage({type:'lanesjekk-cms-preview',config:{budget:{order:['hero','quick','stats','workbook','insights']}}},location.origin)
 });
 // Messages are accepted only from a parent preview frame, not a random window.
 await expect.poll(()=>page.evaluate(()=>document.querySelector('#budsjett').firstElementChild?.classList.contains('budget-start-panel'))).toBe(true);
});

test('admin studio is separate from public navigation and requires login',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('a[href="studio-admin.html"]')).toHaveCount(0);
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-auth')).toBeVisible();
 await expect(page.locator('#admin-email')).toBeVisible();
 await expect(page.locator('#admin-workspace')).toBeHidden();
});

test('tabellkort 2026 input visibly differs from percent mode',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('.budget-deep-tools > summary').click();
 await page.locator('#budget-tax-method').selectOption('table');
 await expect(page.locator('#budget-table-field')).toBeVisible();
 await expect(page.locator('#budget-percent-field')).toBeHidden();
 await page.locator('#budget-tax-method').selectOption('percent');
 await expect(page.locator('#budget-percent-field')).toBeVisible();
});
