const {test,expect}=require('@playwright/test');
test('all important pages load with usable navigation',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('#sidebar')).toBeVisible();
  await expect(page.locator('#search')).toBeVisible();
  await expect(page.locator('button[data-mode="charge"]')).toBeVisible();
  await page.goto('/faq.html',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('heading',{name:'Ofte stilte spørsmål'})).toBeVisible();
  await page.goto('/personvern.html',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('heading',{name:'Personvern og informasjonskapsler'})).toBeVisible();
  await page.goto('/admin.html',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#admin-email')).toBeVisible();
});
test('desktop wheel scrolling moves the page instead of trapping inside map',{tag:'@desktop'},async({page,isMobile})=>{
  test.skip(isMobile,'Desktop-only scrolling');
  await page.goto('/',{waitUntil:'domcontentloaded'});
  // Extend the live list to test layout even if an external station feed is briefly unavailable.
  await page.evaluate(()=>{
    const target=document.querySelector('#results');
    for(let i=0;i<70;i++){
      const row=document.createElement('div');row.className='station';
      row.textContent='Test scroll element '+i;row.style.minHeight='78px';
      target.append(row);
    }
  });
  const sizes=await page.evaluate(()=>({
    scrollHeight:document.scrollingElement.scrollHeight,
    innerHeight:window.innerHeight,
    sidebar:document.querySelector('#sidebar').getBoundingClientRect()
  }));
  expect(sizes.scrollHeight).toBeGreaterThan(sizes.innerHeight+300);
  await page.locator('#sidebar').hover();
  await page.mouse.wheel(0,780);
  await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:4000}).toBeGreaterThan(250);
});
test('mobile view fits without desktop mode and retains map/list controls',async({page,isMobile})=>{
  test.skip(!isMobile,'Mobile layout only');
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#sidebar')).toBeVisible();
  await expect(page.locator('#mobile-toggle')).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth+2));
  await page.locator('#mobile-toggle').click();
  await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
  await page.locator('#mobile-toggle').click();
  await expect(page.locator('#sidebar')).not.toHaveClass(/collapsed/);
});

test('public navigation excludes administration but standalone admin is available',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.locator('#main-menu summary').click();
 const menu=page.locator('#main-menu nav');
 await expect(menu.getByText('Gratis og Pluss')).toBeVisible();
 await expect(menu.getByText('Nye priser')).toBeVisible();
 await expect(menu.getByText('Administrasjon')).toHaveCount(0);
 await page.goto('/admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-email')).toBeVisible();
});
test('theme changes without requiring desktop mode',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.locator('#theme-toggle').click();
 const first=await page.evaluate(()=>document.body.classList.contains('dark-theme'));
 await page.locator('#theme-toggle').click();
 const second=await page.evaluate(()=>document.body.classList.contains('dark-theme'));
 expect(first).not.toBe(second);
});
test('charging UI and comparison UI are clickable on responsive screens',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.locator('button[data-mode="charge"]').click();
 await expect(page.locator('#charger-filters')).toBeVisible();
 await expect(page.locator('#charge-power')).toBeVisible();
 await page.locator('#main-menu summary').click();
 await page.locator('#compare-open').click();
 await expect(page.locator('#compare-modal')).toBeVisible();
 await page.locator('#compare-close').click();
 await expect(page.locator('#compare-modal')).toBeHidden();
});
test('feed and free/pluss pages are accessible with no false checkout',async({page})=>{
 await page.goto('/priser.html',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{name:'Gratis',exact:true})).toBeVisible();
 await expect(page.getByText('Ingen betalt tjeneste er lansert ennå.')).toBeVisible();
 await page.goto('/nytt.html',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{name:'Nye prisrapporter'})).toBeVisible();
 await expect(page.locator('#feed-list')).toBeVisible();
});
