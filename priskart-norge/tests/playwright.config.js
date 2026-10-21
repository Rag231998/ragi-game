const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
 testDir:__dirname,testMatch:/e2e\.spec\.js/,timeout:45000,retries:1,fullyParallel:true,
 reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],
 use:{baseURL:'https://priskart-norge-live.vercel.app',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'desktop-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
  {name:'desktop-firefox',use:{...devices['Desktop Firefox'],viewport:{width:1366,height:768}}},
  {name:'mobile-webkit',use:{...devices['iPhone 13'],viewport:{width:390,height:844}}},
  {name:'mobile-chromium',use:{...devices['Pixel 7'],viewport:{width:412,height:915}}}
 ]
});
