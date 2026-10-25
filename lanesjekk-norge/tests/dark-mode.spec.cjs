const {test,expect}=require('@playwright/test');

test('Public light, dark and site default can be selected without reloading the calculator',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const theme=page.locator('#site-theme-quick');
 await expect(theme).toHaveAttribute('role','switch');
 await expect.poll(()=>page.evaluate(()=>typeof window.lanesjekkTheme?.setChoice)).toBe('function');
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('light'));
 await theme.click();
 await expect(page.locator('html')).toHaveClass(/cms-dark/);
 await expect(page.locator('#budsjett')).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-active-theme','dark');
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('html')).toHaveClass(/cms-dark/);
 await theme.click();
 await expect(page.locator('html')).not.toHaveClass(/cms-dark/);
 await expect(page.locator('html')).toHaveAttribute('data-active-theme','light');
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('site'));
 await expect(page.locator('#site-theme-picker')).toHaveCount(0);
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('lanesjekk.public.theme.v1'))).toBeNull();
});

test('Dark mode gives primary calculator surfaces dark backgrounds in each key tool',async({page})=>{
 const checks=[
  ['budsjett','#budsjett .budget-workbook'],
  ['kvitteringer','#kvitteringer .receipt-pane'],
  ['boligverdi','#utleie .pv-panel'],
  ['valutakompass','#valutakompass .vc-card'],
  ['investering','#investering .investment-controls'],
  ['sjekk','#sjekk .loan-form']
 ];
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.lanesjekkTheme.setChoice('dark'));
 for(const [route,selector] of checks){
  await page.evaluate(id=>window.lanesjekkNavigate(id),route);
  const element=page.locator(selector).first();
  await expect(element).toBeVisible();
  const paint=await element.evaluate(el=>{
   const bg=getComputedStyle(el).backgroundColor;
   const parts=bg.match(/[\d.]+/g)?.slice(0,3).map(Number)||[];
   return {bg,brightness:parts.length===3?parts.reduce((s,v)=>s+v,0)/3:255};
  });
  expect(paint.brightness,`${route}: ${paint.bg}`).toBeLessThan(105);
 }
});

test('Studio theme can be changed without authentication, preserved on reload and follows system',async({page})=>{
 await page.emulateMedia({colorScheme:'light'});
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await page.locator('#admin-ui-theme').selectOption('dark');
 await expect(page.locator('html')).toHaveClass(/studio-dark/);
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-ui-theme')).toHaveValue('dark');
 await expect(page.locator('html')).toHaveClass(/studio-dark/);
 await page.locator('#admin-ui-theme').selectOption('light');
 await expect(page.locator('html')).not.toHaveClass(/studio-dark/);
 await page.emulateMedia({colorScheme:'dark'});
 await page.locator('#admin-ui-theme').selectOption('auto');
 await expect(page.locator('html')).toHaveClass(/studio-dark/);
 await page.emulateMedia({colorScheme:'light'});
 await expect(page.locator('html')).not.toHaveClass(/studio-dark/);
});
