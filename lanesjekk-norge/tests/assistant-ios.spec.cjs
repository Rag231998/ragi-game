const {test,expect}=require('@playwright/test');

test('iPhone assistant presents only one text field and a clearly labeled Send button',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-assistant-panel')).toBeVisible();
 await expect(page.locator('#ln-assistant-input')).toBeVisible();
 await expect(page.locator('#ln-assistant-form button[type="submit"]')).toBeVisible();
 await expect(page.locator('#ln-assistant-form .ln-chat-icon-button')).toHaveCount(0);
 await expect(page.locator('#ln-assistant-form .ln-chat-input-actions')).toHaveCount(0);
 const inputFont=await page.locator('#ln-assistant-input').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
 expect(inputFont).toBeGreaterThanOrEqual(16);
 await page.locator('#ln-assistant-input').fill('Hva koster et lån?');
 await page.locator('#ln-assistant-form button[type="submit"]').click();
 await expect(page.locator('#ln-assistant-messages')).toContainText('Hvor stort lån',{timeout:10000});
 await expect(page.locator('.ln-chat-capability')).not.toContainText('Mikrofonen er ikke tilgjengelig');
});
