/* Theme of Studio's chrome only; no Supabase write and no changes to the public website. */
(()=>{'use strict';
 const KEY='lanesjekk.studio.theme.v1',choices=['auto','light','dark'];
 const dropdown=document.getElementById('admin-ui-theme');
 if(!dropdown)return;
 const darkSystem=window.matchMedia?.('(prefers-color-scheme: dark)');
 let choice='auto';
 try{const saved=window.localStorage.getItem(KEY);if(choices.includes(saved))choice=saved}catch{}
 dropdown.value=choice;
 function apply(){
  const dark=choice==='dark'||(choice==='auto'&&Boolean(darkSystem?.matches));
  document.documentElement.classList.toggle('studio-dark',dark);
  document.documentElement.dataset.studioTheme=choice;
  document.documentElement.style.colorScheme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0c1b29':'#101f31');
 }
 dropdown.addEventListener('change',()=>{
  if(!choices.includes(dropdown.value))return;
  choice=dropdown.value;
  try{window.localStorage.setItem(KEY,choice)}catch{}
  apply();
 });
 darkSystem?.addEventListener?.('change',()=>{if(choice==='auto')apply()});
 apply();
})();
