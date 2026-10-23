const {test,expect}=require('@playwright/test');
test('budget has one clear navigation and no mandatory bank column',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#budsjett')).toBeVisible();
 await expect(page.locator('.viewbar-shortcuts')).toHaveCount(0);
 await expect(page.locator('#budget-quick-income')).toBeVisible();
 await expect(page.locator('#budget-quick-expense')).toBeVisible();
 await expect(page.locator('#budget-print')).toBeVisible();
 const bankCell=page.locator('.budget-table th').nth(3);
 await expect(bankCell).toBeHidden();
 const bankChart=page.locator('#budget-bank-chart').locator('xpath=ancestor::*[contains(@class,"tool-pane")][1]');
 await expect(bankChart).toBeHidden();
});
test('monthly budget visual updates and quick buttons stay responsive',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#budget-income')).toContainText(/44\s?000/);
 await expect(page.locator('#budget-health-description')).toContainText(/11\s?800/);
 await page.locator('#budget-quick-income').click();
 await expect(page.locator('#budget-rows tr')).toHaveCount(10);
 const last=page.locator('#budget-rows tr').last();
 await last.locator('[data-field="amount"]').fill('3000');
 await expect(page.locator('#budget-health-description')).toContainText(/14\s?800/);
 await page.locator('#budget-quick-csv').click();
});
test('print budget builds accurate branded A4 report without uploading user values',async({page,browserName})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{window.__printed=false;window.print=()=>{window.__printed=true}});
 await page.locator('#budget-print').click();
 await expect.poll(()=>page.evaluate(()=>window.__printed)).toBe(true);
 await expect(page.locator('#budget-print-sheet')).toContainText('LÅNESJEKK NORGE');
 await expect(page.locator('#budget-print-sheet')).toContainText('Min personlige budsjettrapport');
 await expect(page.locator('#budget-print-sheet')).toContainText('11 800');
 await expect(page.locator('#budget-print-sheet .print-table')).toHaveCount(2);
 expect(await page.evaluate(()=>document.querySelector('#budget-print-sheet .print-table tbody').rows.length)).toBe(2);
 const printed=await page.evaluate(()=>{document.body.classList.contains('print-budget')});
 expect(printed).toBe(true);
 if(browserName==='chromium'){
  const pdf=await page.pdf({format:'A4',printBackground:true});
  expect(pdf.length).toBeGreaterThan(3000);
  expect(pdf.toString('ascii',0,4)).toBe('%PDF');
 }
});
test('fund fees, drawdown, portfolio split and savings goal recompute',async({page})=>{
 await page.goto('/#investering',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#investering')).toBeVisible();
 const initial=await page.locator('#fund-fee-difference').innerText();
 await page.locator('#fund-high-fee').fill('2');
 await expect(page.locator('#fund-fee-difference')).not.toHaveText(initial);
 await page.locator('#fund-low-fee').fill('2.5');
 await expect(page.locator('#fund-fee-status')).toContainText('Kontroller gebyrene');
 await page.locator('#fund-low-fee').fill('0.20');
 await page.locator('#invest-drawdown').evaluate(input=>{input.value='50';input.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#invest-recover-pct')).toHaveText('100 %');
 await page.locator('#invest-share-stock').evaluate(input=>{input.value='40';input.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#invest-stock-part')).toHaveText('40 % aksjefond');
 await page.locator('#invest-goal').fill('100000');
 await page.locator('#invest-goal-years').fill('5');
 await expect(page.locator('#invest-goal-monthly')).not.toHaveText('–');
 await expect(page.locator('.invest-topic-grid details')).toHaveCount(8);
 await page.locator('.invest-topic-grid details').first().locator('summary').click();
 await expect(page.locator('.invest-topic-grid details').first()).toHaveAttribute('open','');
});
test('mobile layout avoids horizontal overflow on budget and investing',async({page,isMobile})=>{
 test.skip(!isMobile);
 for(const fragment of ['#budsjett','#investering']){
  await page.goto('/'+fragment,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
  expect(result.scrollWidth,fragment).toBeLessThanOrEqual(result.width+3);
 }
});
