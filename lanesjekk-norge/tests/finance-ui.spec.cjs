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
 await expect(page.locator('.budget-table tbody tr')).toHaveCount(9);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
 await expect(page.locator('#budget-expenses')).toContainText(/32\s?200/);
 await expect(page.locator('#budget-balance')).toContainText(/11\s?800/);
 await expect(page.locator('#budget-category-list .legend-row')).toHaveCount(7);
 await expect(page.locator('#budget-timeline>div')).toHaveCount(12);
 await expect(page.locator('#budget-bank-chart .tool-bar-row')).toHaveCount(2);
 await page.locator('#budget-add-expense').click();
 await expect(page.locator('.budget-table tbody tr')).toHaveCount(10);
 await page.locator('.budget-table tbody tr').last().locator('[data-field=amount]').fill('1200');
 await expect(page.locator('.budget-table tbody tr').last().locator('[data-field=amount]')).toHaveValue('1 200');
 await expect(page.locator('#budget-expenses')).toContainText(/33\s?400/);
 await expect(page.locator('#budget-balance')).toContainText(/10\s?600/);
 await page.locator('#budget-bank-filter').selectOption('Nordea');
 expect(await page.locator('.budget-table tbody tr:visible').count()).toBe(3);
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
});
test('budget preserves opt-in local data, exports semicolon CSV and can remove saved values',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#budget-rows tr').first().locator('[data-field=amount]').fill('55000');
 await page.locator('#budget-save').click();
 await expect(page.locator('#budget-storage-status')).toContainText('Lagret lokalt');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#budget-export').click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('lanesjekk-budsjett.csv');
 await page.reload();
 await expect(page.locator('#budget-rows tr').first().locator('[data-field=amount]')).toHaveValue('55 000');
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
