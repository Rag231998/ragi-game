const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
 testDir:__dirname,testMatch:/ui\.spec\.cjs/,timeout:30000,expect:{timeout:8000},retries:1,reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],
 use:{baseURL:'http://127.0.0.1:8765',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'python3 -m http.server 8765 --directory lanesjekk-norge',url:'http://127.0.0.1:8765',reuseExistingServer:!process.env.CI,timeout:20000},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
  {name:'tablet-chromium',use:{...devices['Desktop Chrome'],viewport:{width:820,height:1180}}},
  {name:'iphone-webkit',use:{...devices['iPhone 13'],viewport:{width:390,height:844}}},
  {name:'android-chromium',use:{...devices['Pixel 7'],viewport:{width:412,height:915}}}
 ]
});