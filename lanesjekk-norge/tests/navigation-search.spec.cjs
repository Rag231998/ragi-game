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
 await expect(page.locator('#global-menu-panel a[href="#boligverdi"]')).toHaveCount(1);
 await expect(page.locator('#global-menu-panel a[href="#utleieanalyse"]')).toHaveCount(1);
});

test('dashboard CTA pills have readable foreground on dark blue background',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const results=await page.locator('.premium-dashboard .home-tool .home-tool-arrow').evaluateAll(els=>{
  const lum=rgb=>{const v=rgb.match(/[\d.]+/g).slice(0,3).map(n=>Number(n)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722};
  return els.map(el=>{
   const style=getComputedStyle(el),light=Math.max(lum(style.color),lum(style.backgroundColor)),dark=Math.min(lum(style.color),lum(style.backgroundColor));
   return {label:el.textContent.trim(),ratio:(light+.05)/(dark+.05),fg:style.color,bg:style.backgroundColor}
  });
 });
 expect(results.length).toBeGreaterThan(5);
 for(const cta of results)expect(cta.ratio,JSON.stringify(cta)).toBeGreaterThanOrEqual(4.5);
});
test('top-level menus open with mouse and close by Escape',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const group=page.locator('.portal-nav .nav-group').filter({has:page.locator('summary', {hasText:'Eiendom'})});
 if((page.viewportSize()?.width||0)<810){
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('#global-menu-panel')).toBeVisible();
  await page.locator('#global-menu-panel .mobile-menu-category').filter({has:page.locator('summary', {hasText:'Eiendom'})}).locator('summary').click();
  await expect(page.locator('#global-menu-panel a[href="#boligverdi"]')).toBeVisible();
  await page.keyboard.press('Escape');
  return;
 }
 await group.locator('summary').click();
 await expect(group).toHaveAttribute('open','');
 await expect(group.locator('a[href="#boligverdi"]')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(group).not.toHaveAttribute('open','');
});


test('search traps keyboard focus and restores it when closed',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const trigger=page.locator('#site-search-open');
 await trigger.focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#site-search')).toBeVisible();
 await expect(page.locator('#site-search-input')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.locator('#site-search')).toBeHidden();
 await expect(trigger).toBeFocused();
 await page.keyboard.press('Control+k');
 await expect(page.locator('#site-search')).toBeVisible();
 await page.locator('#site-search-close').focus();
 await page.keyboard.press('Tab');
 await expect(page.locator('#site-search-input')).toBeFocused();
 await page.keyboard.press('Escape');
});


test('home-only hero and overview never appear inside any tool view',async({page})=>{
 for(const route of ['boligverdi','utleieanalyse','sjekk','budsjett','kvitteringer','sparing','investering','akademi','billan']){
  await page.goto('/#'+route,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).not.toHaveAttribute('data-active-view','home');
  await expect(page.locator('#loan-showcase')).toBeHidden();
  await expect(page.locator('[data-portal-view="home"]:visible')).toHaveCount(0);
 }
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loan-showcase')).toBeVisible();
});


test('view switcher opens global search from a tool without resetting another tool',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('body')).toHaveAttribute('data-active-view','budget');
 await page.locator('#viewbar-switch').click();
 await expect(page.locator('#site-search-input')).toBeFocused();
 await page.locator('#site-search-input').fill('fond');
 await expect(page.locator('.site-search-result').first()).toContainText('Fond og aksjer');
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#investering$/);
 await expect(page.locator('#investering')).toBeVisible();
 await expect(page.locator('body')).toHaveAttribute('data-active-route','investering');
 await expect(page.locator('#site-search')).toBeHidden();
 await expect(page.locator('#viewbar-title')).toContainText('Fond og aksjer');
});

test('rental homepage shortcut opens rental mode and browser history restores the prior view',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await page.locator('#home-tools-toggle').click();
 await expect(page.locator('.home-tool-property')).toBeVisible();
 await page.locator('.home-tool-property').click();
 await expect(page).toHaveURL(/#utleieanalyse$/);
 await expect(page.locator('#utleie')).toHaveClass(/pv-mode-rental/);
 await expect(page.locator('.pv-rental-extras')).toBeVisible();
 await expect(page.locator('#viewbar-title')).toContainText('Utleieanalyse');
 await expect(page.locator('.portal-nav a[href="#utleieanalyse"]')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.portal-nav a[href="#boligverdi"]')).not.toHaveAttribute('aria-current','page');
 await page.evaluate(()=>window.lanesjekkNavigate('boligverdi'));
 await expect(page.locator('#viewbar-title')).toContainText('Boligverdi');
 await expect(page.locator('.portal-nav a[href="#boligverdi"]')).toHaveAttribute('aria-current','page');
 await page.goBack({waitUntil:'domcontentloaded'});
 await expect(page).toHaveURL(/#utleieanalyse$/);
 await expect(page.locator('#utleie')).toHaveClass(/pv-mode-rental/);
 await page.goForward({waitUntil:'domcontentloaded'});
 await expect(page).toHaveURL(/#boligverdi$/);
 await expect(page.locator('#utleie')).not.toHaveClass(/pv-mode-rental/);
});

test('desktop navigation marks only its precise selected tool within a shared group',async({page})=>{
 await page.goto('/#forbrukslan',{waitUntil:'domcontentloaded'});
 await expect(page.locator('body')).toHaveAttribute('data-active-view','financing');
 await expect(page.locator('.portal-nav a[href="#forbrukslan"]')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.portal-nav a[href="#billan"]')).not.toHaveAttribute('aria-current','page');
 await expect(page.locator('.portal-nav .nav-group').filter({has:page.locator('a[href="#forbrukslan"]')})).toHaveClass(/is-current-group/);
 await page.evaluate(()=>window.lanesjekkNavigate('billan'));
 await expect(page.locator('.portal-nav a[href="#billan"]')).toHaveAttribute('aria-current','page');
 await expect(page.locator('.portal-nav a[href="#forbrukslan"]')).not.toHaveAttribute('aria-current','page');
});

test('mobile navigation is a single row of six actions and closes when choosing a destination',async({page},testInfo)=>{
 test.skip(!testInfo.project.name.startsWith('android')&&!testInfo.project.name.startsWith('iphone'),'Mobile viewport only');
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const tabs=page.locator('.mobile-bottom-tabs');
 await expect(tabs.locator('a')).toHaveCount(6);
 const layout=await tabs.evaluate(el=>({count:getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length,width:el.scrollWidth,viewport:document.documentElement.clientWidth}));
 expect(layout.count).toBe(6);
 expect(layout.width).toBeLessThanOrEqual(layout.viewport+2);
 await page.locator('.mobile-menu > summary').click();
 await expect(page.locator('#global-menu-panel')).toBeVisible();
 await page.locator('#global-menu-panel .mobile-menu-category').filter({has:page.locator('summary', {hasText:'Eiendom'})}).locator('summary').click();
 await page.locator('#global-menu-panel a[href="#utleieanalyse"]').click();
 await expect(page).toHaveURL(/#utleieanalyse$/);
 await expect(page.locator('#global-menu-panel')).toBeHidden();
 await expect(page.locator('#utleie')).toHaveClass(/pv-mode-rental/);
});
