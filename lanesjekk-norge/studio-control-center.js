/* Studio command center: persistent navigation rail + main work surface.
 * Rearranges existing elements without replacing event listeners or draft state. */
(()=>{'use strict';
function init(){
 const workspace=document.getElementById('admin-workspace');
 const command=workspace?.querySelector(':scope > .admin-command-center');
 const sidebar=command?.querySelector('.admin-navigation-shell');
 const editor=workspace?.querySelector(':scope > .admin-editor-layout');
 if(!workspace||!command||!sidebar||!editor)return;
 const shell=document.createElement('div');shell.className='admin-dashboard-grid';shell.id='admin-dashboard-grid';
 editor.before(shell);
 shell.append(sidebar,editor);
 const heading=document.createElement('div');heading.className='studio-rail-heading';
 heading.innerHTML='<span class="admin-eyebrow">ARBEIDSOMRÅDER</span><strong>Kontrollsenter</strong><small>Velg ett område om gangen</small>';
 sidebar.prepend(heading);
 const nav=sidebar.querySelector('.admin-section-nav');
 const buttons=[...nav.querySelectorAll('button[data-admin-jump]')];
 for(let i=0;i<buttons.length;i++){
  const btn=buttons[i];
  if(!btn.querySelector('.studio-rail-icon')){
   const icon=document.createElement('span');icon.className='studio-rail-icon';icon.setAttribute('aria-hidden','true');
   icon.textContent=({ 'admin-panel-brand':'◈','admin-panel-budget':'▦','admin-panel-cards':'▤','admin-panel-slides':'◩','animation-studio-panel':'▶','admin-panel-catalog':'⌘','admin-panel-invest':'↗','admin-panel-motion':'◌','admin-panel-history':'◷' })[btn.dataset.adminJump]||'•';
   btn.prepend(icon);
  }
 }
 const quick=document.createElement('div');quick.className='studio-rail-footer';
 const text=document.createElement('span');text.textContent='Utkast først · Ingen automatisk publisering';
 const link=document.createElement('button');link.type='button';link.className='studio-rail-preview';
 link.textContent='↗ Stor forhåndsvisning';
 link.addEventListener('click',()=>document.getElementById('admin-preview')?.click());
 quick.append(text,link);sidebar.append(quick);
 // Search stays usable; it is not cloned and retains the original handler.
 const update=()=>{
  const active=buttons.find(b=>b.getAttribute('aria-current')==='true');
  if(active){
   sidebar.dataset.selected=active.dataset.adminJump;
   document.getElementById('admin-navigation-tip')?.setAttribute('aria-label','Åpent område: '+active.textContent.trim());
  }
 };
 nav.addEventListener('click',update);
 const watch=new MutationObserver(update);
 for(const btn of buttons)watch.observe(btn,{attributes:true,attributeFilter:['aria-current']});
 update();
}
document.addEventListener('DOMContentLoaded',init);
})();