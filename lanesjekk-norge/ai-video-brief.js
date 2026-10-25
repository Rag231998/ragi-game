/* Realistic AI presenter production briefs for free AI video models.
   Creation is deliberately separate from publishing; no API token in public code. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const modules={
  home:['Lånesjekk Norge','Samle økonomiverktøy på ett sted.','Bruk lån, budsjett og sparing som eksempler.'],
  loans:['Boliglån','Hvor mye kan rente og nedbetaling påvirke boliglånet?','Vis en bruker som legger inn lånebeløp og sammenligner to scenarioer.'],
  budget:['Personlig budsjett','Hvor blir egentlig lønnen av hver måned?','Vis en person som registrerer faste kostnader og oppdager fordelingen i en graf.'],
  receipts:['Kvitteringsstudio','Vet du hva handleturen faktisk kostet?','Vis en person som gjennomgår kjøp, grupperer varer og utforsker mulige sparemuligheter.'],
  valuation:['Boligverdi','Hva kan påvirke den anslåtte verdien av boligen?','Vis en person som søker etter bolig og kontrollerer datagrunnlaget.'],
  rental:['Utleieanalyse','Hva kan du sitte igjen med ved utleie?','Vis en utleier som sammenligner forventet leie, kostnader og en beregnet netto.'],
  savings:['Sparing','Små sparevaner kan gi bedre oversikt over tid.','Vis en person som lager en spareplan og sammenligner illustrative scenarier.'],
  investing:['Fond og aksjer','Forstå muligheter og risiko før du investerer.','Vis en person som utforsker langsiktige avkastningsscenarioer uten gevinstløfter.'],
  carloan:['Billån','Hva koster bilfinansiering totalt?','Vis en person som sammenligner egenkapital, løpetid og rentekostnader.'],
  academy:['Lånesjekk Akademiet','Kan privatøkonomi være lett å lære?','Vis en student som prøver forklaringer, regneeksempler og spørsmål.'],
  currency:['Valutakompass','Se hvor mye beløpet tilsvarer i en annen valuta.','Vis valg av valuta, beløp og kildedato på et enkelt grensesnitt.']
 };
 const styles={
  professional:'Eksklusiv, troverdig nordisk fintech-reklame. Ren studiobelysning, diskret premium-antrekk, moderne nøytral setting, rolig kameraføring.',
  everyday:'Naturlig hverdagsreklame med en troverdig voksen norsk-/skandinavisktalende AI-presentatør i et ekte hjemmekontor eller kjøkken. Varm, ledig samtaletone.',
  teacher:'Pedagogisk miniforelesning med en vennlig AI-veileder, oversiktlige skjermillustrasjoner og forklaring uten fagsjargong.'
 };
 function draft(){
  const id=$('media-target')?.value||'home',record=modules[id]||modules.home;
  const style=styles[$('ai-video-style')?.value]||styles.professional;
  const seconds=Number($('ai-video-length')?.value)||30;
  return [
   'GRATIS AI-VIDEO · PRODUKSJONSBRIEF FOR LÅNESJEKK NORGE',
   'Modul: '+record[0]+' · Format: 16:9 · Varighet: '+seconds+' sekunder · Språk: norsk bokmål.',
   '',
   'SKUESPILLER OG STIL',
   'Bruk en realistisk, fiktiv, voksen AI-skuespiller med naturlig norsk tale og troverdig leppesynkronisering. Ingen etterligning av identifiserbare personer. '+style,
   '',
   'SCENE 1 – ÅPNING (0–25 %)',
   'Presenter står i et moderne miljø, ser naturlig på kamera. Åpningsreplikk: «'+record[1]+'»',
   '',
   'SCENE 2 – DEMONSTRASJON (25–75 %)',
   record[2]+' Legg inn rolige kamerakutt og nøytrale skjermplassholdere. Skjermbilder av det faktiske produktet kan monteres på etterpå. Ikke finn på knapper, grafer eller resultater.',
   '',
   'SCENE 3 – AVSLUTNING (75–100 %)',
   'Replikk: «Prøv '+record[0].toLowerCase()+' hos Lånesjekk Norge, og forstå tallene før du tar valget.»',
   'Sluttbilde: LÅNESJEKK NORGE · Mer oversikt. Bedre valg.',
   '',
   'PRODUKSJONSKRAV',
   'Realistisk ansikt og øyne, naturlige håndbevegelser, konsekvent lys og klær mellom opptak. Teksting på norsk og rolig bakgrunnsmusikk med dokumenterte rettigheter.',
   'Ingen garanti om sparing, gevinst, presise bankrenter eller boligverdi. Ikke etterlign eksisterende bankmerker.',
   'Eksporter MP4 (H.264) med passende filstørrelse (maks 40 MB for nåværende Studio-opplaster). Lag gjerne separat forsidebilde i 16:9.',
   'Gå til Animation Studio → last opp MP4 og poster → kontroller mobil/PC → publiser fra Studio.'
  ].join('\n');
 }
 function init(){
  const button=$('ai-video-generate'),copy=$('ai-video-copy'),output=$('ai-video-brief');
  if(!button||!copy||!output)return;
  button.addEventListener('click',()=>{output.value=draft();copy.disabled=false;output.focus();output.select()});
  copy.addEventListener('click',async()=>{
   if(!output.value)return;
   try{
    await navigator.clipboard.writeText(output.value);
    copy.textContent='✓ Kopiert';
   }catch{
    output.focus();output.select();copy.textContent='Velg og kopier teksten (Ctrl/Cmd+C)';
   }
  });
 }
 document.addEventListener('DOMContentLoaded',init);
})();