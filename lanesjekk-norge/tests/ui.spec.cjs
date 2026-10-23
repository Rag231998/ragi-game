const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.route('**/favicon.ico',route=>route.abort());
 await page.goto('/#sjekk',{waitUntil:'domcontentloaded'});
});
test('renders all curated banks without invented rates',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{name:'Finn og sammenlign banker'})).toBeVisible();
 const count=await page.evaluate(()=>window.LANEBANKER.length);
 expect(count).toBeGreaterThan(80);
 await expect(page.locator('.bank-card')).toHaveCount(8);
 await expect(page.locator('#bank-count')).toContainText('Viser 8 av');
 await expect(page.locator('#offer-rate-1')).toHaveCount(0);
});
test('instant searchable verified banks with normalised names and no results',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 const input=page.locator('#bank-query');
 await input.fill('klp');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-name')).toHaveText('KLP Banken');
 await expect(page.locator('#bank-count')).toContainText('1 av 1 treff');
 await input.fill('nordeá');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-name')).toHaveText('Nordea');
 await input.fill('bulder');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-proof')).toContainText('Bankkonsept under registrert bank');
 await input.fill('sbanken');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await input.fill('ikke en bank');
 await expect(page.locator('.bank-card')).toHaveCount(0);
 await expect(page.locator('.bank-empty')).toBeVisible();
 await page.getByRole('button',{name:'Nullstill søket'}).click();
 await expect(page.locator('.bank-card')).toHaveCount(8);
});
test('selects vetted bank, accepts real user rate and calculates immediately',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
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
 const dim=await page.evaluate(()=>({
  scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
  overflowing:[...document.querySelectorAll('body *')].filter(el=>{
    const rect=el.getBoundingClientRect();
    return getComputedStyle(el).position!=='fixed' && rect.width>0 &&
      rect.right>innerWidth+3 && getComputedStyle(el).visibility!=='hidden';
  }).slice(0,12).map(el=>({tag:el.tagName,className:String(el.className).slice(0,80),id:el.id,right:Math.round(el.getBoundingClientRect().right)}))
 }));
 expect(dim.scrollWidth,JSON.stringify(dim.overflowing)).toBeLessThanOrEqual(dim.width+3);
 await expect(page.locator('#scenario-cut')).toBeVisible();
 await expect(page.locator('#balance')).toBeVisible();
 await expect(page.locator('#bank-query')).toBeHidden();
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#bank-query')).toBeVisible();
 await expect(page.locator('#balance')).toBeHidden();
});

test('blank interest rate cannot silently become a zero-interest loan',async({page})=>{
 const rate=page.locator('#rate');
 const before=await page.locator('#monthly').innerText();
 await rate.fill('');
 await expect(page.locator('#monthly')).toHaveText('–');
 await expect(page.locator('#copy-summary')).toBeDisabled();
 await rate.fill('5.5');
 await expect(page.locator('#monthly')).toHaveText(before);
 await expect(page.locator('#copy-summary')).toBeEnabled();
});

test('loan form Enter key does not reload or discard the comparison',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await page.locator('[data-bank="dnb"] .bank-select').click();
 await page.locator('#offer-rate-1').fill('5.0');
 await page.evaluate(()=>{window.__loanPageNotReloaded=true});
 await page.locator('#balance').press('Enter');
 expect(await page.evaluate(()=>window.__loanPageNotReloaded===true)).toBe(true);
 await expect(page.locator('#offers .offer')).toHaveCount(1);
});

test('bank additions reject duplicates, enforce eight maximum and allow removal',async({page})=>{
 const additions=await page.evaluate(()=>{
   const ids=window.LANEBANKER.slice(0,8).map(bank=>bank.id);
   return [...ids.map(id=>window.lanesjekkAddBank(id)),window.lanesjekkAddBank(ids[0]),window.lanesjekkAddBank('unregistered')];
 });
 expect(additions).toEqual([true,true,true,true,true,true,true,true,false,false]);
 await expect(page.locator('#offers .offer')).toHaveCount(8);
 await expect(page.locator('#add-offer')).toBeDisabled();
 await page.locator('#offers .offer').first().getByRole('button',{name:'Fjern banktilbud'}).click();
 await expect(page.locator('#offers .offer')).toHaveCount(7);
 await expect(page.locator('#add-offer')).toBeEnabled();
});

test('groups full Norwegian currency amounts while keeping calculation correct',async({page})=>{
 const balance=page.locator('#balance');
 await balance.fill('3109049');
 await expect(balance).toHaveValue('3 109 049');
 await expect(page.locator('#monthly')).not.toHaveText('–');
 await page.locator('#rate').fill('5,25');
 await expect(page.locator('#rate')).toHaveValue('5,25');
 await expect(page.locator('#monthly')).not.toHaveText('–');
 await page.locator('#property').fill('4000000');
 await expect(page.locator('#property')).toHaveValue('4 000 000');
 await expect(page.locator('#ltv')).toContainText('77,73');
 await page.locator('#balance').fill('');
 await expect(page.locator('#monthly')).toHaveText('–');
 await page.locator('#balance').fill('3109049');
 await expect(page.locator('#monthly')).not.toHaveText('–');
});
test('bank combobox searches instead of showing all banks in a select list',async({page})=>{
 await expect(page.locator('#currentbank')).toHaveAttribute('type','search');
 await expect(page.locator('#currentbank')).toHaveValue('');
 await page.locator('#currentbank').fill('sparebank 1 smn');
 await expect(page.locator('.bank-autocomplete-option')).toHaveCount(1);
 await page.locator('.bank-autocomplete-option').first().click();
 await expect(page.locator('#currentbank')).toHaveValue('SpareBank 1 SMN');
 await expect(page.locator('#currentbank')).toHaveAttribute('data-bank-id',/nb-sparebank/);
 await expect(page.locator('#currentbank-results')).toBeHidden();
});
test('search finds regionally listed banks and shows their truthful source',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await page.locator('#bank-query').fill('Rørosbanken');
 await expect(page.locator('.bank-card')).toHaveCount(1);
 await expect(page.locator('.bank-name')).toHaveText('Rørosbanken Røros Sparebank');
 await expect(page.locator('.bank-proof')).toContainText('Norges Bank');
 await page.locator('.bank-select').click();
 await page.locator('#offer-rate-1').fill('4,95');
 await expect(page.locator('#result-table-wrap')).toBeVisible();
 await expect(page.locator('#results')).toContainText('Rørosbanken');
});
test('manual bank rates and fees support Norwegian decimal/grouping',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await page.locator('[data-bank="dnb"] .bank-select').click();
 await page.locator('#offer-rate-1').fill('4,99');
 await page.locator('#offer-fee-1').fill('1299');
 await page.locator('#offer-setup-1').fill('25000');
 await expect(page.locator('#offer-rate-1')).toHaveValue('4,99');
 await expect(page.locator('#offer-fee-1')).toHaveValue('1 299');
 await expect(page.locator('#offer-setup-1')).toHaveValue('25 000');
 await expect(page.locator('#result-table-wrap')).toBeVisible();
});
test('incremental bank results do not render all banks at once',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.bank-card')).toHaveCount(8);
 await page.locator('#bank-more').click();
 await expect(page.locator('.bank-card')).toHaveCount(20);
 await page.locator('#bank-query').fill('sparebank 1');
 expect(await page.locator('.bank-card').count()).toBeGreaterThan(1);
});

test('separate views protect the user from seeing every calculator at once',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(page.locator('#sjekk')).toBeHidden();
 await expect(page.locator('#bankoversikt')).toBeHidden();
 await expect(page.locator('#guider')).toBeHidden();
 await page.goto('/#sjekk',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#balance')).toBeVisible();
 await expect(page.locator('#sparing')).toBeHidden();
 await expect(page.locator('.hero')).toBeHidden();
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#bank-query')).toBeVisible();
 await expect(page.locator('#balance')).toBeHidden();
});
test('bank selection automatically opens the separate mortgage comparison window',async({page})=>{
 await page.goto('/#banker',{waitUntil:'domcontentloaded'});
 await page.locator('#bank-query').fill('DNB');
 await page.locator('[data-bank="dnb"] .bank-select').click();
 await expect(page).toHaveURL(/\/#sammenlign$/);
 await expect(page.locator('#sammenlign')).toBeVisible();
 await expect(page.locator('#bankoversikt')).toBeHidden();
 await expect(page.locator('#offers .offer')).toHaveCount(1);
});
