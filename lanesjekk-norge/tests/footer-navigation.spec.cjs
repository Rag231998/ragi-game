const {test,expect}=require('@playwright/test');

test('Modern footer has grouped useful navigation and no unprofessional one-line links',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const footer=page.locator('footer.site-footer');
 await expect(footer).toBeVisible();
 await expect(footer.locator('.site-footer-column')).toHaveCount(3);
 await expect(footer.locator('#site-live-status')).toHaveCount(1);
 await expect(footer.locator('.site-footer-important')).toContainText('veiledende');
 await expect(footer).not.toContainText('Lær mer:');
 await expect(footer.locator('a[href="#budsjett"]')).toHaveCount(1);
 await expect(footer.locator('a[href="#guider"]')).toHaveCount(1);
 await expect(footer.locator('a[href="#topp"]')).toHaveCount(2);
 const internal=await footer.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>{
  const route=a.getAttribute('href');
  const target=document.querySelector(route);
  // Forbrukslån intentionally routes to the consumer mode inside the billån panel.
  const alias=route==='#forbrukslan'&&!!document.getElementById('billan');
  return {route,valid:Boolean(target||alias)};
 }));
 expect(internal.filter(x=>!x.valid)).toEqual([]);
});
test('All footer links lead to the correct section via the real navigation engine',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 const footer=page.locator('footer.site-footer');
 await footer.locator('a[href="#kvitteringer"]').click();
 await expect(page).toHaveURL(/#kvitteringer/);
 await expect(page.locator('#kvitteringer')).toBeVisible();
 await footer.locator('a[href="#akademi"]').click();
 await expect(page).toHaveURL(/#akademi/);
 await expect(page.locator('#akademi')).toBeVisible();
});
test('Footer is readable on phone, does not create horizontal overflow, and offers top-of-page navigation',async({page},testInfo)=>{
 test.skip(!/android|iphone/.test(testInfo.project.name),'Mobile test only');
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const footer=page.locator('footer.site-footer');
 await expect(footer).toBeVisible();
 const dims=await footer.evaluate(el=>({x:el.getBoundingClientRect().x,width:el.getBoundingClientRect().width,scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 expect(dims.width).toBeLessThanOrEqual(dims.viewport+1);
 expect(dims.scroll-dims.viewport).toBeLessThanOrEqual(2);
 await footer.locator('.site-footer-top').click();
 await expect(page).toHaveURL(/#topp/);
});
test('Footer remains legible in dark mode and never shows misleading live-rate status',async({page})=>{
 await page.goto('/#topp',{waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkTheme?.setChoice)).toBe('function');
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('dark'));
 const paint=await page.locator('footer.site-footer').evaluate(el=>({
  bg:getComputedStyle(el).backgroundColor,text:getComputedStyle(el).color,
  status:document.getElementById('site-live-status').getAttribute('title')
 }));
 expect(paint.bg).not.toBe('rgba(0, 0, 0, 0)');
 expect(paint.text).not.toBe('rgb(16, 40, 56)');
 expect(paint.status).toContain('ikke live-renter');
});
