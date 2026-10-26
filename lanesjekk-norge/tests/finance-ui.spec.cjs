const {test,expect}=require('@playwright/test');
test('homepage has new clickable budget, car, consumer and academy tools',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.home-tool')).toHaveCount(12);
 for(const target of ['#budsjett','#billan','#forbrukslan','#akademi']){
  await expect(page.locator('.home-tool[href="'+target+'"]')).toHaveCount(1);
 }
 await expect(page.locator('#budsjett')).toBeHidden();
 await page.locator('.home-tool[href="#budsjett"]').click();
 await expect(page.locator('#budsjett')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(page.locator('#billan')).toBeHidden();
});
test('editable budget computes accurate totals, insights and custom charts',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('.budget-advanced-tools > summary').click();
 await expect(page.locator('.budget-table tbody tr')).toHaveCount(9);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
 await expect(page.locator('#budget-expenses')).toContainText(/32\s?200/);
 await expect(page.locator('#budget-balance')).toContainText(/11\s?800/);
 await expect(page.locator('#budget-category-list .legend-row')).toHaveCount(7);
 await expect(page.locator('#budget-timeline>div')).toHaveCount(12);
 await expect(page.locator('#budget-bank-chart').locator('xpath=ancestor::*[contains(@class,"tool-pane")][1]')).toBeHidden();
 await page.locator('#budget-add-expense').click();
 await expect(page.locator('.budget-table tbody tr')).toHaveCount(10);
 await page.locator('.budget-table tbody tr').last().locator('[data-field=amount]').fill('1200');
 await expect(page.locator('.budget-table tbody tr').last().locator('[data-field=amount]')).toHaveValue('1 200');
 await expect(page.locator('#budget-expenses')).toContainText(/33\s?400/);
 await expect(page.locator('#budget-balance')).toContainText(/10\s?600/);
 await expect(page.locator('.budget-table th').nth(3)).toBeHidden();
 expect(await page.locator('.budget-table tbody tr:visible').count()).toBe(10);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
});
test('budget preserves opt-in local data, exports semicolon CSV and can remove saved values',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('.budget-advanced-tools > summary').click();
 await page.locator('#budget-rows tr').first().locator('[data-field=amount]').fill('55000');
 await page.locator('#budget-save').click();
 await expect(page.locator('#budget-storage-status')).toContainText(/lagret/i);
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#budget-export').click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('lanesjekk-budsjett.csv');
 await page.reload();
 await expect(page.locator('#budget-rows tr').first().locator('[data-field=amount]')).toHaveValue('55 000');
 await page.locator('.budget-advanced-tools > summary').click();
 await page.locator('#budget-clear-save').click();
 await expect(page.locator('#budget-storage-status')).toContainText('slettet');
 await page.locator('#budget-reset').click();
 await expect(page.locator('#budget-rows tr')).toHaveCount(0);
 await expect(page.locator('#budget-donut-value')).toContainText('0');
});
test('car loan calculates monthly cost, APR, fees and decreasing debt chart',async({page})=>{
 await page.goto('/#billan',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#billan')).toBeVisible();
 await expect(page.locator('#loan-tab-car')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#finance-principal')).toContainText(/275\s?000/);
 await expect(page.locator('#finance-cost-bar span')).toHaveCount(3);
 await expect(page.locator('#finance-debt-chart>div')).toHaveCount(6);
 await expect(page.locator('#finance-error')).toBeHidden();
 await page.locator('#finance-amount').fill('425000');
 await expect(page.locator('#finance-amount')).toHaveValue('425 000');
 await expect(page.locator('#finance-principal')).toContainText(/350\s?000/);
 await page.locator('#finance-down').fill('425000');
 await expect(page.locator('#finance-error')).toBeVisible();
 await expect(page.locator('#finance-principal')).toHaveText('–');
});
test('consumer loan opens in its own tab and retains car inputs when switching',async({page})=>{
 await page.goto('/#forbrukslan',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#billan')).toBeVisible();
 await expect(page.locator('#loan-tab-consumer')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#finance-principal')).toContainText(/125\s?000/);
 await expect(page.locator('.car-only').first()).toBeHidden();
 await page.locator('#finance-amount').fill('130000');
 await expect(page.locator('#finance-principal')).toContainText(/130\s?000/);
 await page.locator('#loan-tab-car').click();
 await expect(page.locator('#finance-principal')).toContainText(/275\s?000/);
 await page.locator('#loan-tab-consumer').click();
 await expect(page.locator('#finance-amount')).toHaveValue('130 000');
});
test('academy quizzes have working feedback, progress, course links and retry',async({page})=>{
 await page.goto('/#akademi',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#akademi')).toBeVisible();
 await expect(page.locator('#academy-options button')).toHaveCount(3);
 await page.locator('#academy-options button').nth(1).click();
 await expect(page.locator('#academy-feedback')).toContainText('Helt riktig');
 await expect(page.locator('#academy-score')).toHaveText('1 riktige');
 await page.locator('#academy-next').click();
 await expect(page.locator('#academy-count')).toHaveText('2 av 4');
 await expect(page.locator('.academy-course')).toHaveCount(4);
 await page.locator('.academy-course[href="#buffer"]').click();
 await expect(page).toHaveURL(/#buffer$/);
 await expect(page.locator('#guider')).toBeVisible();
 await expect(page.locator('#akademi')).toBeHidden();
});
test('every new view is independent and avoids horizontal page scrolling',async({page})=>{
 for(const p of ['/','#budsjett','#billan','#forbrukslan','#akademi']){
  await page.goto('/'+(p.startsWith('#')?p:''),{waitUntil:'domcontentloaded'});
  const dimensions=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(dimensions.page,p).toBeLessThanOrEqual(dimensions.viewport+2);
  if(p!=='/')await expect(page.locator('.hero')).toBeHidden();
 }
});

test('at 725px hero headline is not cut off and main call to action has contrast',async({page})=>{
 await page.setViewportSize({width:725,height:800});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const measure=await page.evaluate(()=>{
   const title=document.querySelector('.hero h1');
   const button=document.querySelector('.hero .cta-row .btn:not(.dark-outline)');
   return {right:title.getBoundingClientRect().right,
           left:title.getBoundingClientRect().left,
           viewport:document.documentElement.clientWidth,
           scrollWidth:document.documentElement.scrollWidth,
           buttonColor:getComputedStyle(button).color};
 });
 expect(measure.right).toBeLessThanOrEqual(measure.viewport+3);
 expect(measure.left).toBeGreaterThanOrEqual(-1);
 expect(measure.scrollWidth).toBeLessThanOrEqual(measure.viewport+3);
 expect(measure.buttonColor).toBe('rgb(7, 63, 60)');
});
test('four quiz questions can be completed and restarted',async({page})=>{
 await page.goto('/#akademi',{waitUntil:'domcontentloaded'});
 for(let i=0;i<4;i++){
   await page.locator('#academy-options button').nth(1).click();
   await expect(page.locator('#academy-feedback')).toBeVisible();
   await page.locator('#academy-next').click();
 }
 await expect(page.locator('#academy-count')).toHaveText('Fullført');
 await expect(page.locator('#academy-question')).toContainText('4 av 4');
 await page.locator('#academy-next').click();
 await expect(page.locator('#academy-count')).toHaveText('1 av 4');
});


test('budget what-if graph calculates actual monthly and annual savings per category',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('.budget-advanced-tools > summary').click();
 await expect(page.locator('#budget-scenario-category')).toBeVisible();
 await page.locator('#budget-scenario-category').selectOption('Mat og drikke');
 await expect(page.locator('#budget-scenario-percent-value')).toHaveText('10 %');
 await expect(page.locator('#budget-scenario-month')).toContainText(/650/);
 await expect(page.locator('#budget-scenario-year')).toContainText(/7\s?800/);
 await page.locator('#budget-scenario-percent').focus();
 await page.locator('#budget-scenario-percent').press('ArrowRight');
 await page.locator('#budget-scenario-percent').press('ArrowRight');
 await expect(page.locator('#budget-scenario-percent-value')).toHaveText('20 %');
 await expect(page.locator('#budget-scenario-month')).toContainText(/1\s?300/);
 await expect(page.locator('#budget-scenario-year')).toContainText(/15\s?600/);
 // Edit the source amount by its real category, then verify the what-if estimate.
 const row=page.locator('#budget-rows tr').filter({has:page.locator('select[data-field="category"]')}).nth(4);
 await row.locator('[data-field="amount"]').fill('7000');
 await expect(page.locator('#budget-scenario-month')).toContainText(/1\s?400/);
 await expect(page.locator('#budget-scenario-year')).toContainText(/16\s?800/);
});
test('compact mobile navigation is colorful, responsive and switches only the active view',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const nav=page.locator('.mobile-bottom-tabs');
 await expect(nav).toBeVisible();
 await expect(nav.locator('a')).toHaveCount(5);
 await expect(nav.locator('a[href="#topp"]')).toHaveAttribute('aria-current','page');
 await nav.locator('a[href="#budsjett"]').click();
 await expect(page).toHaveURL(/#budsjett$/);
 await expect(page.locator('#budsjett')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(nav.locator('a[href="#budsjett"]')).toHaveAttribute('aria-current','page');
 await nav.locator('a[href="#sparing"]').click();
 await expect(page.locator('#sparing')).toBeVisible();
 await expect(page.locator('#budsjett')).toBeHidden();
 await expect(nav.locator('a[href="#sparing"]')).toHaveAttribute('aria-current','page');
 const size=await page.evaluate(()=>({width:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth}));
 expect(size.overflow).toBeLessThanOrEqual(size.width+2);
});
test('financing tabs update the URL, active navigation and retain individual values',async({page})=>{
 await page.goto('/#billan',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.viewbar-shortcuts a[href="#billan"]')).toHaveAttribute('aria-current','page');
 await page.locator('#finance-amount').fill('425000');
 await page.locator('#loan-tab-consumer').click();
 await expect(page).toHaveURL(/#forbrukslan$/);
 await expect(page.locator('.viewbar-shortcuts a[href="#forbrukslan"]')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.viewbar-shortcuts a[href="#billan"]')).not.toHaveAttribute('aria-current','page');
 await page.locator('#loan-tab-car').click();
 await expect(page).toHaveURL(/#billan$/);
 await expect(page.locator('#finance-amount')).toHaveValue('425 000');
 await expect(page.locator('#loan-tab-car')).toHaveAttribute('aria-selected','true');
});
test('dashboard cards use distinct category colors and accessible tap targets',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const look=await page.evaluate(()=>{
  const tiles=[...document.querySelectorAll('.home-tool')];
  const colors=tiles.map(x=>getComputedStyle(x).backgroundImage);
  return {count:tiles.length,uniques:new Set(colors).size,
   smallButtonHeight:document.querySelector('.home-tool').getBoundingClientRect().height};
 });
 expect(look.count).toBe(12);
 expect(look.uniques).toBeGreaterThan(6);
 expect(look.smallButtonHeight).toBeGreaterThanOrEqual(180);
});


test('budget autosaves edits and restores them on refresh',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#budget-rows tr').first().locator('[data-field=amount]').fill('57000');
 await expect(page.locator('#budget-storage-status')).toContainText('automatisk');
 await page.reload();
 await expect(page.locator('#budget-rows tr').first().locator('[data-field=amount]')).toHaveValue('57 000');
});
test('budget undo restores deleted rows and their totals',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#budget-rows tr')).toHaveCount(9);
 await page.locator('#budget-rows tr').first().locator('.budget-remove').click();
 await expect(page.locator('#budget-rows tr')).toHaveCount(8);
 await page.locator('.budget-advanced-tools > summary').click();
 await page.locator('#budget-undo').click();
 await expect(page.locator('#budget-rows tr')).toHaveCount(9);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
});
test('budget salary transfer updates income and subtotal of chosen rows',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('.budget-deep-tools > summary').click();
 await page.locator('#budget-salary-gross').fill('60000');
 await page.locator('#budget-salary-tax').fill('25');
 await page.locator('#budget-salary-other').fill('1000');
 await expect(page.locator('#budget-salary-net')).toContainText(/44\s?000/);
 await page.locator('#budget-salary-use').click();
 await expect(page.locator('#budget-income')).toContainText(/46\s?000/);
 await page.locator('#budget-rows tr').first().locator('.budget-mark').check();
 await expect(page.locator('#budget-selected-total')).toContainText(/44\s?000/);
});
test('invalid amounts display an error and prevent saving bad values',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#budget-rows tr').first().locator('[data-field=amount]').fill('');
 await expect(page.locator('#budget-error-count')).toContainText('feil beløp');
 await expect(page.locator('#budget-rows tr').first().locator('[data-field=amount]')).toHaveAttribute('aria-invalid','true');
});

test('budget row can be reordered using drag handle and still keeps correct totals',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const first=page.locator('#budget-rows tr').first();
 const second=page.locator('#budget-rows tr').nth(1);
 const before=await second.locator('[data-field=description]').inputValue();
 await first.locator('.budget-drag-handle').dragTo(second.locator('.budget-drag-handle'),{targetPosition:{x:10,y:36}});
 await expect(page.locator('#budget-rows tr').first().locator('[data-field=description]')).toHaveValue(before);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
});
test('investment workspace opens as distinct view, runs mathematical simulator',async({page})=>{
 await page.goto('/#investering',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#investering')).toBeVisible();
 await expect(page.locator('#budsjett')).toBeHidden();
 await expect(page.locator('#invest-chart polyline')).toHaveCount(2);
 await page.locator('#invest-start').fill('10000');
 await page.locator('#invest-monthly').fill('1000');
 await page.locator('#invest-years').fill('2');
 await page.locator('#invest-return').fill('0');
 await page.locator('#invest-fee').fill('0');
 await expect(page.locator('#invest-final')).toContainText(/34\s?000/);
 await expect(page.locator('#invest-paid')).toContainText(/34\s?000/);
 await page.locator('#invest-reset').click();
 await expect(page.locator('#invest-years-value')).toHaveText('15 år');
});

test('Budget entries are completely visible, editable and removable on 390px iPhone without sideways clipping',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const row=page.locator('#budget-rows tr').first();await expect(row).toBeVisible();
 for(const element of [row,row.locator('[data-field="category"]'),row.locator('[data-field="description"]'),row.locator('[data-field="amount"]'),row.locator('[data-field="period"]'),row.locator('.budget-remove')]){
  const bounds=await element.boundingBox();expect(bounds).toBeTruthy();expect(bounds.x).toBeGreaterThanOrEqual(-1);expect(bounds.x+bounds.width).toBeLessThanOrEqual(391);
 }
 await row.locator('[data-field="description"]').fill('Test månedslønn');await expect(row.locator('[data-field="description"]')).toHaveValue('Test månedslønn');
 const before=await page.locator('#budget-rows tr').count();await row.locator('.budget-remove').click();await expect(page.locator('#budget-rows tr')).toHaveCount(before-1);
});
