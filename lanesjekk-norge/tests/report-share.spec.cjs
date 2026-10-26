const {test,expect}=require('@playwright/test');
test('Budget wizard lets the user select, preview, save and close a PDF report',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#ln-report-open')).toBeVisible();
 await page.locator('#ln-report-open').click();
 await expect(page.locator('#ln-report-modal')).toBeVisible();
 await expect(page.locator('#ln-rw-title')).toBeVisible();
 await expect(page.locator('[data-rw-part="summary"]')).toBeChecked();
 await page.locator('#ln-rw-next').click();
 await expect(page.locator('#ln-report-preview')).toHaveAttribute('srcdoc',/report-metric-grid|Resultater/);
 const preview=page.frameLocator('#ln-report-preview');
 await expect(preview.locator('.paper')).toBeVisible();
 await expect(preview.locator('body')).toContainText('Lånesjekk Norge');
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-report-consent').check();
 await page.locator('#ln-rw-more > summary').click();
 await page.locator('#ln-report-save').click();
 await expect(page.locator('#ln-report-status')).toContainText('lagret lokalt');
 await page.locator('#ln-report-open-saved').click();
 await expect(page.locator('#ln-report-status')).toContainText('Viser sist lagrede');
 await page.locator('#ln-report-close').click();
 await expect(page.locator('#ln-report-modal')).toBeHidden();
});
test('Encrypted budget report opens in a separate unauthenticated browser session',async({page,browser})=>{
 await page.addInitScript(()=>{window.__copiedReportLink='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copiedReportLink=value},readText:async()=>window.__copiedReportLink}})});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-report-consent').check();
 await page.locator('#ln-report-private-link').click();
 await expect(page.locator('#ln-report-status')).toContainText('Kryptert delingslenke er kopiert');
 const link=await page.evaluate(()=>window.__copiedReportLink);
 expect(link).toContain('#delt=');
 const recipientContext=await browser.newContext();
 try{const recipient=await recipientContext.newPage();await recipient.goto(link,{waitUntil:'domcontentloaded'});await expect(recipient.locator('#ln-report-modal')).toBeVisible({timeout:15000});await expect(recipient.locator('#ln-report-status')).toContainText('Rapport åpnet via kryptert lenke');await expect(recipient.frameLocator('#ln-report-preview').locator('body')).toContainText('Lånesjekk Norge')}finally{await recipientContext.close()}
});
test('Assistant is a single chat view without an extra sharing tab',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#ln-report-open')).toHaveCSS('position','static');
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-assistant-panel')).toBeVisible();
 await expect(page.locator('#ln-assistant-open')).toBeHidden();
 await expect(page.locator('[data-ln-tab="share"]')).toHaveCount(0);
 await expect(page.locator('.ln-chat-suggestions')).toBeVisible();
 await page.locator('#ln-assistant-input').fill('Hvordan lager jeg rapport?');
 await page.locator('#ln-assistant-form button[type="submit"]').click();
 await expect(page.locator('#ln-assistant-messages')).toContainText('Lag PDF / del budsjettet');
 await expect(page.locator('#ln-assistant-panel .ln-assistant-account')).toHaveCount(0);
 await page.locator('#ln-assistant-close').click();
 await page.locator('#ln-budget-private-tools .ln-assistant-account>summary').click();
 await expect(page.locator('#ln-budget-private-tools .ln-vault')).toBeVisible();
});

test('Mobile sharing controls remain reachable and native PDF + social image files are offered',async({page})=>{
 await page.setViewportSize({width:390,height:700});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-rw-next').click();
 await expect(page.locator('#ln-report-modal')).toHaveAttribute('data-wizard-step','3');
 await expect(page.locator('#ln-report-preview')).toBeHidden();
 await page.locator('#ln-report-consent').check();
 await page.evaluate(()=>{
   window.__sharedFiles=[];
   Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
   Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.__sharedFiles.push(payload.files?.[0]?.name||'missing')}});
   window.LNReportPDF.file=()=>new File(['%PDF-1.4'],'budsjett.pdf',{type:'application/pdf'});
   window.LNReportSocial.file=()=>new File(['picture'],'budsjett.png',{type:'image/png'});
 });
 const actions=page.locator('#ln-report-social');
 await actions.scrollIntoViewIfNeeded();
 await actions.click();
 await expect(page.locator('#ln-report-status')).toContainText('Delingsmenyen ble lukket');
 await page.locator('#ln-rw-more > summary').click();
 const image=page.locator('#ln-report-social-image');
 await image.scrollIntoViewIfNeeded();
 await image.click();
 const names=await page.evaluate(()=>window.__sharedFiles);
 expect(names).toEqual(['budsjett.pdf','budsjett.png']);
 const box=await image.boundingBox();
 expect(box).not.toBeNull();
 expect(box.x).toBeGreaterThanOrEqual(0);
 expect(box.x+box.width).toBeLessThanOrEqual(391);
 await page.locator('#ln-rw-back').scrollIntoViewIfNeeded();
 await page.locator('#ln-rw-back').click();
 await expect(page.locator('#ln-report-preview')).toBeVisible();
});

test('iOS report uses a separate unobstructed footer with scrollable action buttons',async({page})=>{
 await page.setViewportSize({width:390,height:700});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-rw-next').click();
 const back=page.locator('#ln-rw-back'),controls=page.locator('#ln-report-modal .ln-report-controls');
 await expect(back).toBeVisible();
 await expect(controls).toHaveCSS('overflow-y','auto');
 expect(await page.locator('#ln-report-modal .ln-report-card > .ln-rw-nav').count()).toBe(1);
 const result=await page.evaluate(()=>{
  const r=document.querySelector('#ln-rw-back').getBoundingClientRect();
  const c=document.querySelector('#ln-report-modal .ln-report-controls').getBoundingClientRect();
  const footer=document.querySelector('#ln-report-modal .ln-rw-nav').getBoundingClientRect();
  return{footerAboveControls:footer.top>=c.bottom-1,noButtonOverlap:r.top>=c.bottom-1,footerInsideViewport:footer.bottom<=innerHeight+1}
 });
 expect(result.footerAboveControls).toBe(true);
 expect(result.noButtonOverlap).toBe(true);
 expect(result.footerInsideViewport).toBe(true);
 await page.locator('#ln-rw-more > summary').click();
 await page.locator('#ln-report-social-image').scrollIntoViewIfNeeded();
 await expect(page.locator('#ln-report-social-image')).toBeVisible();
});
test('Floating iOS assistant button can be dragged away from content and restores its placement',async({page})=>{
 await page.setViewportSize({width:390,height:780});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const b=page.locator('#ln-assistant-open');await expect(b).toBeVisible();
 await page.evaluate(()=>{
  const el=document.querySelector('#ln-assistant-open'),r=el.getBoundingClientRect();
  const args={pointerId:12,pointerType:'touch',bubbles:true,isPrimary:true,button:0};
  el.dispatchEvent(new PointerEvent('pointerdown',{...args,clientX:r.left+12,clientY:r.top+12}));
  el.dispatchEvent(new PointerEvent('pointermove',{...args,clientX:r.left-90,clientY:r.top-130}));
  el.dispatchEvent(new PointerEvent('pointerup',{...args,clientX:r.left-90,clientY:r.top-130}));
 });
 const styles=await b.evaluate(e=>({left:e.style.left,top:e.style.top,key:localStorage.getItem('ln-assistant-floating-position-v2')}));
 expect(styles.left).toMatch(/px/);expect(styles.top).toMatch(/px/);expect(styles.key).toContain('"x"');
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(b).toHaveAttribute('style',/(left|inset):/);
});

test('Step three has exactly three primary actions; optional features remain accessible',async({page})=>{
 await page.setViewportSize({width:390,height:700});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-rw-next').click();
 const primary=page.locator('#ln-report-modal .ln-rw-main-actions > button');
 await expect(primary).toHaveCount(3);
 await expect(primary.nth(0)).toContainText('Del PDF');
 await expect(primary.nth(1)).toContainText('Last ned PDF');
 await expect(primary.nth(2)).toContainText('Kopier sikker lenke');
 await expect(page.locator('#ln-rw-more')).not.toHaveAttribute('open',/.+/);
 await expect(page.locator('#ln-report-social-image')).toBeHidden();
 await expect(page.locator('#ln-report-mail-group')).toBeHidden();
 await expect(page.locator('#ln-rw-share-details')).toContainText('budsjettposter');
 await page.locator('#ln-rw-more > summary').click();
 await expect(page.locator('#ln-report-social-image')).toBeVisible();
 await expect(page.locator('#ln-report-save')).toBeVisible();
 await expect(page.locator('#ln-rw-copy-summary')).toBeVisible();
});

test('Real PDF and Instagram-ready PNG have valid file signatures on mobile',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-report-open').click();
 await page.locator('#ln-rw-next').click();
 await page.locator('#ln-rw-next').click();
 const pdf=await page.evaluate(async()=>{
   const report=window.LNReportCenter.getReport();
   const file=window.LNReportPDF.file(report);
   const bytes=new Uint8Array(await file.arrayBuffer());
   return{name:file.name,mime:file.type,size:file.size,head:String.fromCharCode(...bytes.slice(0,5))};
 });
 expect(pdf.mime).toBe('application/pdf');
 expect(pdf.head).toBe('%PDF-');
 expect(pdf.size).toBeGreaterThan(250);
 const png=await page.evaluate(async()=>{
   const report=window.LNReportCenter.getReport();
   const file=window.LNReportSocial.file(report);
   const bytes=new Uint8Array(await file.arrayBuffer());
   return{name:file.name,mime:file.type,size:file.size,head:Array.from(bytes.slice(0,4))};
 });
 expect(png.mime).toBe('image/png');
 expect(png.head).toEqual([137,80,78,71]);
 expect(png.size).toBeGreaterThan(1000);
});

test('Assistant keeps conversational loan parameters across several turns',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-assistant-open').click();
 const field=page.locator('#ln-assistant-input'),send=page.locator('#ln-assistant-form button[type="submit"]');
 async function ask(q,text){await field.fill(q);await send.click();await expect(page.locator('#ln-assistant-messages')).toContainText(text,{timeout:15000})}
 await ask('Hva koster et lån?','Hvor stort lån');
 await ask('3 millioner kr','3 000 000');
 await ask('5,2 %','nedbetalingstid');
 await ask('25 år','terminbeløp');
 await ask('Hva om renten øker 1 %?','6.2 %');
 await expect(page.locator('#ln-assistant-panel .ln-assistant-account')).toHaveCount(0);
 await expect(page.locator('.ln-chat-capability')).toContainText('veiviser');
});
test('Budget storage controls are explained in budget, never buried in chat',async({page})=>{
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 const area=page.locator('#ln-budget-private-tools');
 await expect(area).toBeVisible();
 await expect(area).toContainText('Lagre lokalt');
 await expect(area).toContainText('Kun fire summer');
 await expect(area.locator('.ln-assistant-account')).toBeVisible();
 await area.locator('.ln-assistant-account>summary').click();
 await expect(area.locator('.ln-vault-details > summary')).toBeVisible();
 await area.locator('.ln-vault-details > summary').click();
 await expect(area.locator('#ln-vault-login')).toBeVisible();
 await expect(page.locator('#ln-assistant-panel .ln-vault')).toHaveCount(0);
});

test('Chat on iPhone persists across refresh and New chat keeps archived conversations',async({page})=>{
 await page.setViewportSize({width:390,height:780});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-chat-new')).toBeVisible();
 await page.locator('#ln-assistant-input').fill('Hva koster et lån?');
 await page.locator('#ln-assistant-form button[type="submit"]').click();
 await expect(page.locator('#ln-assistant-messages')).toContainText('Hvor stort lån',{timeout:15000});
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('lanesjekk-chat-history-v1')||'[]').length)).toBeGreaterThan(0);
 await page.locator('#ln-chat-new').click();
 await expect(page.locator('#ln-assistant-messages')).not.toContainText('Hvor stort lån');
 await page.locator('#ln-chat-list').click();
 await expect(page.locator('.ln-chat-history-select')).toContainText(['Hva koster et lån?']);
 await page.locator('.ln-chat-history-select').first().click();
 await expect(page.locator('#ln-assistant-messages')).toContainText('Hvor stort lån');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-assistant-messages')).toContainText('Hva koster et lån?');
});
test('Voice on Safari opens animated dialog, displays transcript, sends question and offers spoken answer',async({page})=>{
 await page.addInitScript(()=>{
  window.webkitSpeechRecognition=class {
   start(){queueMicrotask(()=>{this.onstart?.();this.onresult?.({results:[Object.assign([{transcript:'Hva koster et lån?'}],{isFinal:true})]});this.onend?.()})}
   stop(){this.onend?.()}
   abort(){}
  };
 });
 await page.setViewportSize({width:390,height:780});
 await page.goto('/#budsjett',{waitUntil:'domcontentloaded'});
 await page.locator('#ln-assistant-open').click();
 await expect(page.locator('#ln-voice-start')).toContainText('Snakk');
 await page.locator('#ln-voice-start').click();
 await expect(page.locator('#ln-voice-modal, .ln-voice-modal')).toBeVisible();
 await expect(page.locator('#ln-voice-transcript')).toContainText('Hva koster et lån?');
 await expect(page.locator('#ln-assistant-messages')).toContainText('Hvor stort lån',{timeout:15000});
 await page.locator('#ln-voice-done').click();
 await expect(page.locator('.ln-voice-modal')).toBeHidden();
});
