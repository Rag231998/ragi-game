const {test,expect}=require('@playwright/test');
test('global search opens and routes to Boligverdi without hiding the section',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.locator('#site-search-open').click();
 await expect(page.locator('#site-search')).toBeVisible();
 await page.locator('#site-search-input').fill('boligverdi');
 await expect(page.locator('.site-search-result').first()).toContainText('Boligverdi');
 await page.locator('.site-search-result').first().click();
 await expect(page).toHaveURL(/#boligverdi$/);
 await expect(page.locator('#boligverdi')).toBeVisible();
 await expect(page.locator('#site-search')).toBeHidden();
 await expect(page.locator('#utleie')).toHaveClass(/rental-studio/);
});
test('property navigation opens the requested rental tab and back restores valuation',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.lanesjekkNavigate('utleieanalyse'));
 await expect(page).toHaveURL(/#utleieanalyse$/);
 await expect(page.locator('#utleie')).toHaveClass(/pv-mode-rental/);
 await expect(page.locator('.pv-rental-extras')).toBeVisible();
 await expect(page.locator('#pv-mode-rental')).toHaveAttribute('aria-pressed','true');
 await page.evaluate(()=>window.lanesjekkNavigate('boligverdi'));
 await expect(page.locator('#utleie')).not.toHaveClass(/pv-mode-rental/);
 await expect(page.locator('#pv-trend-lab')).toBeVisible();
});
test('search overlay closes by Escape and handles missing search',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.keyboard.press('Control+k');
 await expect(page.locator('#site-search')).toBeVisible();
 await page.locator('#site-search-input').fill('ikkeettema897');
 await expect(page.locator('.site-search-empty')).toContainText('Ingen treff');
 await page.keyboard.press('Escape');
 await expect(page.locator('#site-search')).toBeHidden();
});
test('high-contrast labels and interactive panels fit inside the viewport',async({page})=>{
 await page.goto('/#boligverdi',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(()=>{
  const sample=document.querySelector('#utleie .pv-panel label');
  const color=getComputedStyle(sample).color,bg=getComputedStyle(document.querySelector('#utleie .pv-panel')).backgroundColor;
  return{color,bg,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,visible:sample.getBoundingClientRect().width>0}
 });
 expect(result.visible).toBe(true);
 expect(result.color).toBe('rgb(41, 79, 96)');
 expect(result.scrollWidth).toBeLessThanOrEqual(result.clientWidth+2);
});
test('all main navigation targets appear on property and financing groups',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.portal-nav a[href="#boligverdi"]')).toHaveCount(1);
 await expect(page.locator('.portal-nav a[href="#utleieanalyse"]')).toHaveCount(1);
 await expect(page.locator('.mobile-menu a[href="#boligverdi"]')).toHaveCount(1);
 await expect(page.locator('.mobile-menu a[href="#utleieanalyse"]')).toHaveCount(1);
});
