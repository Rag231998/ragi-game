const {defineConfig,devices}=require('@playwright/test');
const externalBaseURL=process.env.LANESJEKK_BASE_URL;
module.exports=defineConfig({
 testDir:__dirname,testMatch:/(ui|portal|finance-ui|daily-studio|site-studio|receipts)\.spec\.cjs/,timeout:30000,expect:{timeout:8000},retries:1,reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],
 use:{baseURL:externalBaseURL||'http://127.0.0.1:8765',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:externalBaseURL?undefined:{command:'python3 -m http.server 8765 --directory ..',url:'http://127.0.0.1:8765',reuseExistingServer:!process.env.CI,timeout:20000},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
  {name:'tablet-chromium',use:{...devices['Desktop Chrome'],viewport:{width:820,height:1180}}},
  {name:'iphone-webkit',use:{...devices['iPhone 13'],viewport:{width:390,height:844}}},
  {name:'android-chromium',use:{...devices['Pixel 7'],viewport:{width:412,height:915}}}
 ]
});