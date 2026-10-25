/* Animation Studio v2: one clear choice, three contextual tabs, no stacked forms.
 * Move original DOM nodes rather than cloning them, preserving native event handlers
 * and the existing secure draft / preview / publish lifecycle. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 let selected='edit',built=false;
 function element(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node}
 function activate(name,focus=false){
  if(!built)return;
  selected=['edit','ai','library'].includes(name)?name:'edit';
  document.querySelectorAll('#media-workspace-tabs [role="tab"]').forEach(button=>{
   const on=button.dataset.mediaTab===selected;
   button.setAttribute('aria-selected',String(on));
   button.tabIndex=on?0:-1;
  });
  document.querySelectorAll('#media-workspace .media-workspace-view').forEach(view=>{
   view.hidden=view.dataset.mediaView!==selected;
  });
  if(selected==='library'){
   const details=$('media-library-details-reworked');
   if(details)details.open=true;
   // The normal authenticated page load refreshes the library. This is safe
   // to call again on demand and reports an empty state rather than silence.
   if($('media-library')?.textContent?.includes('Biblioteket lastes'))
    void window.lanesjekkAnimationStudio?.refreshLibrary?.();
  }
  if(focus)document.querySelector('#media-workspace-tabs [aria-selected="true"]')?.focus();
 }
 function updateSelection(evt){
  if(!built)return;
  const id=evt?.detail?.module||$('media-target')?.value||'home';
  const title=window.lanesjekkAnimationStudio?.slotNames?.[id]||'Valgt modul';
  const label=$('media-workspace-selected');
  if(label)label.textContent='Valgt: '+title;
  document.querySelectorAll('#media-module-grid .media-module-choice').forEach(button=>{
   const on=button.dataset.module===id||button.dataset.slot===id||button.dataset.active==='true';
   button.setAttribute('aria-pressed',String(on));
   button.setAttribute('aria-controls','media-workspace-edit');
   if(on)button.classList.add('is-selected');else button.classList.remove('is-selected');
  });
  // A click on a module must visibly open its editor right below the cards.
  if(evt?.type==='lanesjekk-studio-media-target')activate('edit');
 }
 function setup(){
  const panel=document.querySelector('#animation-studio-panel > .admin-body');
  if(!panel||panel.dataset.workspaceReady==='true')return;
  const intro=panel.querySelector('.media-studio-intro'),modules=$('media-module-grid'),
   target=$('media-target')?.closest('label'),settings=panel.querySelector('.media-setting-card'),
   pair=panel.querySelector('.media-upload-pair'),actions=pair?.nextElementSibling,
   progress=$('media-progress'),status=$('media-status'),staged=$('media-staged-status'),
   preview=panel.querySelector('.media-preview-box'),library=panel.querySelector('.media-library-details'),
   ai=$('studio-ai-create'),manual=panel.querySelector('.studio-ai-manual'),
   note=panel.querySelector('.media-publish-note');
  if(!intro||!modules||!target||!settings||!pair||!actions||!progress||!status||!staged||!preview||!library||!ai)return;
  panel.dataset.workspaceReady='true';
  const workspace=element('div','media-workspace');workspace.id='media-workspace';
  intro.after(workspace);
  const modulesRegion=element('section','media-workspace-modules');
  const modHead=element('div','media-workspace-modules-head');
  const head=element('div');
  head.append(element('span','admin-eyebrow','TRINN 1 · HVOR SKAL VIDEOEN VISES?'),
   element('h3',null,'Velg én modul'));
  const chosen=element('span','media-workspace-chosen','Valgt: Forsiden / kampanje');
  chosen.id='media-workspace-selected';
  modHead.append(head,chosen);
  const noteText=element('p','media-workspace-hint','Trykk på en modul. Redigeringspanelet nedenfor viser innstillingene for akkurat denne siden.');
  modulesRegion.append(modHead,noteText,modules);
  const tabs=element('div','media-workspace-tabs');tabs.id='media-workspace-tabs';
  tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Arbeidsområder i Animation Studio');
  const categories=[
   ['edit','1 · Rediger og last opp','Innstillinger, filer, forhåndsvisning'],
   ['ai','2 · Lag AI-video','Gratis generering dersom en gratismodell er tilgjengelig'],
   ['library','3 · Mediearkiv','Søk, forhåndsvis og bruk opplastede filer']
  ];
  const views=element('div','media-workspace-views');
  for(const [id,label,sub] of categories){
   const tab=element('button','media-workspace-tab');
   tab.type='button';tab.id='media-workspace-tab-'+id;
   tab.dataset.mediaTab=id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','media-workspace-'+id);
   tab.append(element('strong',null,label),element('small',null,sub));
   tab.setAttribute('aria-selected',String(id===selected));tab.tabIndex=id===selected?0:-1;
   tab.addEventListener('click',()=>activate(id));
   tabs.append(tab);
   const view=element('section','media-workspace-view');view.id='media-workspace-'+id;
   view.dataset.mediaView=id;view.setAttribute('role','tabpanel');view.setAttribute('aria-labelledby',tab.id);
   view.hidden=id!==selected;views.append(view);
  }
  tabs.addEventListener('keydown',event=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
   event.preventDefault();
   const opts=[...tabs.querySelectorAll('[role="tab"]')];
   const i=opts.findIndex(b=>b.dataset.mediaTab===selected);
   const next=event.key==='Home'?0:event.key==='End'?opts.length-1:
    (i+(event.key==='ArrowRight'?1:-1)+opts.length)%opts.length;
   activate(opts[next].dataset.mediaTab,true);
  });
  workspace.append(modulesRegion,tabs,views);
  const edit=$('media-workspace-edit');
  const editHead=element('div','media-workspace-section-head');
  editHead.append(element('h3',null,'Rediger valgt modul'),element('p',null,'Alle endringer blir liggende som utkast til du velger «Kontroller og publiser».'));
  const editColumns=element('div','media-workspace-editor-columns');
  const editor=element('div','media-workspace-editor');
  editor.append(target,settings,pair,actions,progress,status,staged);
  const previewColumn=element('div','media-workspace-preview');
  previewColumn.append(preview);
  editColumns.append(editor,previewColumn);
  edit.append(editHead,editColumns);
  if(note)edit.append(note);
  const aiView=$('media-workspace-ai');
  aiView.append(ai);
  if(manual)aiView.append(manual);
  const libView=$('media-workspace-library');
  library.id='media-library-details-reworked';
  library.open=true;
  library.querySelector(':scope > summary')?.remove();
  libView.append(element('h3',null,'Videoarkiv og forsidebilder'),library);
  modules.addEventListener('click',()=>{window.requestAnimationFrame(()=>updateSelection())});
  window.addEventListener('lanesjekk-studio-media-target',updateSelection);
  window.addEventListener('lanesjekk-studio-ready',updateSelection);
  updateSelection();
  built=true;
  activate(selected);
 }
 document.addEventListener('DOMContentLoaded',setup);
 window.lanesjekkMediaWorkspace={activate,getActive:()=>selected};
})();