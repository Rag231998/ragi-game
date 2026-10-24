const {test,expect}=require('@playwright/test');

test('Forgot password opens its own browser tab, leaving Studio login intact',async({page,context})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#admin-auth')).toBeVisible();
 const logo=page.locator('.admin-header a').first();
 await expect(logo).toHaveAttribute('href','./studio-admin.html');
 const forgot=page.locator('#admin-forgot-open');
 await expect(forgot).toHaveAttribute('target','_blank');
 await expect(forgot).toHaveAttribute('rel',/noopener/);
 const opened=context.waitForEvent('page');
 await forgot.click();
 const tab=await opened;
 await tab.waitForLoadState('domcontentloaded');
 await expect(tab).toHaveURL(/\/admin-password\.html$/);
 await expect(tab.locator('#password-request-form')).toBeVisible();
 await expect(tab.locator('#password-request-email')).toBeVisible();
 await expect(tab.locator('#reset-create')).toBeHidden();
 await expect(page).toHaveURL(/\/studio-admin\.html$/);
 await expect(page.locator('#admin-login-form')).toBeVisible();
 await tab.close();
});
test('Studio logo keeps user inside the admin portal',async({page})=>{
 await page.goto('/studio-admin.html',{waitUntil:'domcontentloaded'});
 await page.locator('.admin-header a').first().click();
 await expect(page).toHaveURL(/\/studio-admin\.html$/);
 await expect(page.locator('#admin-login-form')).toBeVisible();
});
test('Password page has accessible recovery steps and 8-character minimum',async({page})=>{
 await page.goto('/admin-password.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('h1')).toContainText('Tilbakestill passordet');
 await expect(page.locator('#password-request-form')).toBeVisible();
 await expect(page.locator('#password-new')).toHaveAttribute('minlength','8');
 await expect(page.locator('#password-repeat')).toHaveAttribute('minlength','8');
 await expect(page.locator('#reset-success')).toBeHidden();
 await page.locator('.password-page-back').click();
 await expect(page).toHaveURL(/\/studio-admin\.html$/);
});
