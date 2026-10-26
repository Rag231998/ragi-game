(()=>{'use strict';
const panel=document.getElementById('ln-assistant-panel');
if(!panel)return;
const tabs=[...panel.querySelectorAll('[data-ln-tab]')];
function activate(which){const tab=which==='share'?'share':'chat';panel.dataset.activeTab=tab;for(const b of tabs){const selected=b.dataset.lnTab===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1}const target=tab==='share'?panel.querySelector('.ln-vault button'):panel.querySelector('#ln-assistant-input');target?.focus({preventScroll:true})}
tabs.forEach((button,index)=>{button.addEventListener('click',()=>activate(button.dataset.lnTab));button.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();activate(tabs[(index+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length].dataset.lnTab)}})});
panel.dataset.activeTab='chat';
})();