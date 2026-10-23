const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('**/favicon.ico',route=>route.abort());
 await page.goto('/',{waitUntil:'domcontentloaded'});
});
test('renders all curated banks without invented rates',async({page})=>{
 await expect(page.getByRole('heading',{name:'Finn banken du vil sammenligne'})).toBeVisible();
 await expect(page.locator('.bank-card')).toHaveCount(8);
 await expect(page.locator('#bank-count')).toContainText('8 av 8');
 await expect(page.locator('#offer-rate-1')).toHaveCount(0);
});
test('instant searchable verified banks with normalised names and no results',async({page})=>{
 const input=page.locator('#bank-query');
 await input.fill('klp');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-name')).toHaveText('KLP Banken');
 await expect(page.locator('#bank-count')).toContainText('1 av 8');
 await input.fill('nordeá');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-name')).toHaveText('Nordea');
 await input.fill('ikke en bank');
 await expect(page.locator('.bank-card')).toHaveCount(0);
 await expect(page.locator('.bank-empty')).toBeVisible();
 await page.getByRole('button',{name:'Vis alle banker'}).click();
 await expect(page.locator('.bank-card')).toHaveCount(8);
});
test('selects vetted bank, accepts real user rate and calculates immediately',async({page})=>{
 await page.locator('#bank-query').fill('DNB');
 await page.locator('[data-bank="dnb"] .bank-select').click();
 await expect(page.locator('#offers .offer')).toHaveCount(1);
 await expect(page.locator('#offers [data-field="name"]')).toHaveValue('DNB');
 await expect(page.locator('#offers [data-field="name"]')).toHaveAttribute('readonly','');
 await page.locator('#offer-rate-1').fill('5.0');
 await expect(page.locator('#result-table-wrap')).toBeVisible();
 await expect(page.locator('#results')).toContainText('DNB');
 await expect(page.locator('#results')).toContainText('spart');
 await page.locator('#offer-rate-1').fill('');
 await expect(page.locator('#result-table-wrap')).toBeHidden();
});
test('scenario slider updates transparently and never represents real bank offers',async({page})=>{
 await expect(page.locator('#scenario-year')).not.toHaveText('–');
 const before=await page.locator('#scenario-year').innerText();
 await page.locator('#scenario-cut').evaluate(el=>{
  el.value='1.25';
  el.dispatchEvent(new Event('input',{bubbles:true}));
 });
 await expect(page.locator('#scenario-cut-label')).toContainText('1,25');
 await expect(page.locator('#scenario-year')).not.toHaveText(before);
 await expect(page.locator('#scenario-detail')).toContainText('Hypotetisk');
});
test('layout fits viewport with usable fields and controls',async({page,isMobile})=>{
 const dim=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth}));
 expect(dim.scrollWidth).toBeLessThanOrEqual(dim.width+3);
 await expect(page.locator('#bank-query')).toBeVisible();
 await expect(page.locator('#scenario-cut')).toBeVisible();
 await expect(page.locator('#balance')).toBeVisible();
});
