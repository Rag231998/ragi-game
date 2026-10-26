'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Consent-first private budget sharing is discoverable and accessible',()=>{
 const html=read('index.html'),js=read('assistant-vault.js');
 for(const id of ['ln-share-report','ln-vault-login','ln-vault-email','ln-vault-private','ln-vault-save','ln-vault-view','ln-vault-delete','ln-vault-logout','ln-vault-status'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/assistant-vault\.js/);assert.match(html,/assistant-vault\.css/);
 assert.match(js,/signInWithOtp/);assert.match(js,/confirm\('Du er i ferd med å dele/);
 assert.match(js,/confirm\('Lagre en privat kopi/);new vm.Script(js);
});
test('Never upload individual budget line items and enforce owner-scoped operations',()=>{
 const js=read('assistant-vault.js');
 assert.match(js,/entries:\[\]/);
 assert.match(js,/owner_id:user\.id/);
 assert.match(js,/\.eq\('owner_id',user\.id\)/);
 assert.doesNotMatch(js,/budget-rows|document\.cookie|service_role|secret_key/);
});
