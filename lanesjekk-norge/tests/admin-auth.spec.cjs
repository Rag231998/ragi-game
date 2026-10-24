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
 await expect(page.locator('h1')).toContainText('Glemt passord?');
 await expect(page.locator('#password-request-form')).toBeVisible();
 await expect(page.locator('#password-new')).toHaveAttribute('minlength','8');
 await expect(page.locator('#password-repeat')).toHaveAttribute('minlength','8');
 await expect(page.locator('#reset-success')).toBeHidden();
 await page.locator('.password-page-back').click();
 await expect(page).toHaveURL(/\/studio-admin\.html$/);
});


test('Existing administrator can change password without triggering a recovery email',async({page})=>{
 await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.abort());
 await page.addInitScript(()=>{
  window.__passwordCalls=[];
  window.supabase={createClient:()=>({
   auth:{
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    getUser:async()=>({data:{user:{id:'admin-test'}},error:null}),
    getSession:async()=>({data:{session:{access_token:'stub'}},error:null}),
    updateUser:async payload=>{window.__passwordCalls.push(payload);return {error:null}},
    resetPasswordForEmail:async()=>({error:{status:429,code:'over_email_send_rate_limit',message:'email rate limit exceeded'}})
   },
   from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{user_id:'admin-test'},error:null})})})})
  })}
 });
 await page.goto('/admin-password.html',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#account-change')).toBeVisible();
 await expect(page.locator('#reset-request')).toBeHidden();
 await page.locator('#account-current').fill('OldPassword123!');
 await page.locator('#account-new').fill('NewPassword123!');
 await page.locator('#account-repeat').fill('NewPassword123!');
 await page.locator('#account-change-submit').click();
 await expect(page.locator('#account-change-status')).toContainText('Passordet er oppdatert');
 const calls=await page.evaluate(()=>window.__passwordCalls);
 expect(calls).toEqual([{password:'NewPassword123!',current_password:'OldPassword123!'}]);
 await page.locator('#account-forgot-open').click();
 await expect(page.locator('#reset-request')).toBeVisible();
 await page.locator('#password-request-email').fill('test@example.invalid');
 await page.locator('#password-request-send').click();
 await expect(page.locator('#password-email-limit')).toBeVisible();
 await expect(page.locator('#password-email-limit strong')).toContainText('grense');
 await expect(page.locator('#password-request-status')).toBeEmpty();
});
