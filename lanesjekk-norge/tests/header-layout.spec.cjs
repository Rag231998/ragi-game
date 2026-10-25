const {test,expect}=require('@playwright/test');

test('single-row premium header at 2048px with no enormous search or theme buttons',async({page})=>{
 await page.setViewportSize({width:2048,height:900});
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const h=page.locator('.site-header'),logo=page.locator('.site-header .portal-logo'),actions=page.locator('.site-header .header-actions');
 await expect(h).toBeVisible();
 await expect(page.locator('.site-header .portal-group-nav')).toBeVisible();
 await expect(page.locator('.site-header .mobile-menu')).toBeHidden();
 await expect(page.locator('[data-open-catalog="tools"]')).toHaveCount(0);
 const metrics=await page.evaluate(()=>{
  const rect=sel=>document.querySelector(sel).getBoundingClientRect();
  const head=rect('.site-header'),logo=rect('.site-header .portal-logo'),nav=rect('.site-header .portal-group-nav'),actions=rect('.site-header .header-actions'),search=rect('#site-search-open'),switcher=rect('#site-theme-quick');
  return {height:head.height,logoY:logo.y+logo.height/2,navY:nav.y+nav.height/2,actionsY:actions.y+actions.height/2,searchWidth:search.width,themeWidth:switcher.width,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
 });
 expect(metrics.height).toBeLessThan(97);
 expect(Math.abs(metrics.logoY-metrics.actionsY)).toBeLessThan(20);
 expect(Math.abs(metrics.navY-metrics.actionsY)).toBeLessThan(20);
 expect(metrics.searchWidth).toBeLessThan(65);
 expect(metrics.themeWidth).toBeLessThan(55);
 expect(metrics.overflow).toBeLessThanOrEqual(2);
});
test('iOS dark-mode switch updates the actual live theme and persists on reload',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const sw=page.locator('#site-theme-quick');
 await expect(sw).toHaveAttribute('role','switch');
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkTheme?.setChoice)).toBe('function');
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('light'));
 await expect(sw).toHaveAttribute('aria-checked','false');
 await sw.click();
 await expect(sw).toHaveAttribute('aria-checked','true');
 await expect(page.locator('html')).toHaveClass(/cms-dark/);
 await expect(page.locator('#budsjett')).toBeVisible();
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(sw).toHaveAttribute('aria-checked','true');
 await sw.click();
 await expect(sw).toHaveAttribute('aria-checked','false');
 await expect(page.locator('html')).not.toHaveClass(/cms-dark/);
 await expect(page.locator('#site-theme-picker')).toHaveCount(0);
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('site'));
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('lanesjekk.public.theme.v1'))).toBeNull();
});
test('tablet and phone keep one header row with accessible search, dark mode and menu',async({page})=>{
 for(const width of [1440,820,540,390,360,320]){
  await page.setViewportSize({width,height:800});
  await page.goto('/#topp',{waitUntil:'domcontentloaded'});
  const info=await page.evaluate(()=>{
   const header=document.querySelector('.site-header');
   const h=header.getBoundingClientRect();
   const box=sel=>document.querySelector(sel).getBoundingClientRect();
   return {height:h.height,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,logo:box('.site-header .portal-logo'),actions:box('.site-header .header-actions'),menu:box('.site-header .mobile-menu'),sitewidth:document.documentElement.clientWidth};
  });
  expect(info.height,'height at '+width).toBeLessThan(97);
  expect(info.overflow,'overflow at '+width).toBeLessThanOrEqual(2);
  expect(Math.abs(info.logo.y-info.actions.y),'wrapping at '+width).toBeLessThan(24);
  if(width>1140){await expect(page.locator('.site-header .portal-group-nav')).toBeVisible();await expect(page.locator('.site-header .mobile-menu')).toBeHidden()}else await expect(page.locator('.site-header .mobile-menu')).toBeVisible();
  await expect(page.locator('#site-search-open')).toBeVisible();
  await expect(page.locator('#site-theme-quick')).toBeVisible();
  await expect(page.locator('[data-open-catalog="tools"]')).toHaveCount(0);
 }
});
test('Studio uses native iOS switches for its visibility and animation controls',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 for(const id of ['site-hero-visual','site-hero-motion','slide-visible','motion-autoplay','motion-valuation','motion-rental','motion-receipts','media-enabled','media-loop']){
  await expect(page.locator('#'+id)).toHaveAttribute('role','switch');
 }
 await expect(page.locator('#admin-remember')).toHaveAttribute('role','switch');
});
test('One unmistakable moon icon is paired with the actual dark mode switch',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 for(const width of [1440,820,390]){
  await page.setViewportSize({width,height:850});
  const moon=page.locator('.site-header .header-theme-moon');
  const toggle=page.locator('#site-theme-quick');
  await expect(moon).toBeVisible();
  await expect(moon).toHaveText('☾');
  await expect(toggle).toBeVisible();
  await expect(page.locator('.site-header [role="switch"]')).toHaveCount(1);
  await expect(page.locator('.site-header .site-theme-picker')).toHaveCount(0);
  const positions=await page.evaluate(()=>{
   const m=document.querySelector('.header-theme-moon').getBoundingClientRect();
   const t=document.getElementById('site-theme-quick').getBoundingClientRect();
   return{distance:t.left-(m.left+m.width),overlap:Math.abs((m.top+m.height/2)-(t.top+t.height/2))}
  });
  expect(positions.distance).toBeGreaterThanOrEqual(0);
  // Desktop deliberately has a visible "Mørk modus" label between the moon
  // and the toggle. Tablet/phone hide that text and keep the icons together.
  expect(positions.distance).toBeLessThan(width>1240?125:55);
  expect(positions.overlap).toBeLessThan(15);
 }
 await page.locator('#site-theme-quick').click();
 await expect(page.locator('html')).toHaveClass(/cms-dark/);
 await expect(page.locator('.site-header .header-theme-moon')).toBeVisible();
});
