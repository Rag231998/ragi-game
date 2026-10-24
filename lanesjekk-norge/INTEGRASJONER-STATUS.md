# Lånesjekk Norge – teknisk statusoversikt
Oppdatert 24. oktober 2026. Dette dokumentet beskriver faktisk kode, lagringsstatus og bekreftede tester. Det er ikke en garanti om at alle brukerflyter er feilfrie.

## Publisering og prosjekt
- Produksjon: https://lanesjekk-norge.onrender.com/ (Render, Node.js, Frankfurt, gratis webtjeneste).
- Kode: GitHub Rag231998/ragi-game, katalog lanesjekk-norge, gren main.
- Vercel: eldre publiseringsoppsett, ikke avhengighet for Render.
- Domenenavn: Render-subdomene, ikke dokumentert eget domene.
- HTTP-server: server.js; /health og /api/* samt lokale JS/CSS/HTML-filer.
- Administrator: studio-admin.html, med Supabase RLS-autorisasjon.

## Brukerverktøy: integrert kode
| Modul | Hash | Status |
| --- | --- | --- |
| Forside og seks scener | #topp | Kode/publisering på Render; animasjoner krever visuell QA |
| Boliglån, rente og nedbetaling | #sjekk | Eksisterende kalkulator; fullstendig QA ikke bekreftet |
| Billån | #billan | Eksisterende kalkulator; fullstendig QA ikke bekreftet |
| Forbrukslån | #forbrukslan | Deler finansverktøy; fullstendig QA ikke bekreftet |
| Bankoversikt | #banker | Eksisterende bankkatalog; datakvalitet/ferskhet må kontrolleres |
| Budsjett | #budsjett | Eksisterende verktøy; fullstendig QA ikke bekreftet |
| Kvitteringer | #kvitteringer | Eksisterende klientverktøy; fullstendig skanne-/datatest ikke bekreftet |
| Sparing | #sparing | Eksisterende sammenligning; periodiske bankrentekilder ikke automatisert |
| Fond og aksjer | #investering | Eksisterende investeringsverktøy; fullstendig QA ikke bekreftet |
| Valutakompass | #valutakompass | Egen fane med valuta, gebyreksempel og historikk; kildeavhengighet |
| Boligverdi | #boligverdi | Kartverket-adressesøk og SSB-statistikk; live prisestimat ikke verifisert |
| Utleie | #utleieanalyse | Eksisterende kalkulator; fullstendig QA ikke bekreftet |
| Akademiet | #akademi | Eksisterende læringsinnhold; fullstendig QA ikke bekreftet |
| Guider | #guider | Eksisterende artikkel-/guidevisning |

## Offentlige data og API
- /api/address-search: Kartverkets norske adresseregister; adresse, postnummer og kommunenummer er forskjellige felt.
- /api/property-market: SSB Statistikkbanken tabell 14310. Statistisk gjennomsnitt; **ikke** adressebasert e-takst.
- /api/property-index: indekser/utvikling fra kilder definert i kode; datakontroll gjenstår.
- /api/currency: Frankfurter v2 daglig institusjonell/blandet referansekurs, servercache 30 minutter; ingen sanntidskurs.
- /api/currency-history: Frankfurter v2 historiske kurser, 7/30/90/365 dager, cache 1 time.
- Norges Bank direkte: **ikke** integrert som primær direkte API i denne versjonen.
- Valutagebyr: illustrasjon av fast budsjett etter valutapåslag; bankens faktiske pris kan avvike.

## Supabase
- lanesjekk_site_config: 1 publisert konfigurasjonsrad, RLS aktiv.
- lanesjekk_site_revisions: 0 revisjoner ved kontroll, RLS aktiv.
- lanesjekk_rate_updates: 0 importerte renter ved kontroll, RLS aktiv.
- storage site-assets: opprettet, men 0 filer ved kontroll.
- storage animation-assets: opprettet, men 0 videoer ved kontroll.
- Animation Studio: kontroll for video-/posteropplastning finnes i admin; **ingen offentlig opplastet MP4**.
- Animerte SVG-grafikker: seks er lagret i repo og brukes i flere verktøy; dette er ikke det samme som MP4-filer.
- Forsiden: nå en seks-scene-kampanjekarusell; overflødig 40-sekunders ekstra seksjon er fjernet.

## Tester
- Render prestart: 8 av 8 Node-tester bestått ved publisering 24. oktober 2026. Testene kontrollerer HTML, lokale filer, JavaScript-syntaks, ruting og valuta-API med kontrollerte data.
- Playwright-testskript: skrevet for søk, animasjoner, valutakurs og mobil; **ikke** bekreftet full grønn gjennomkjøring mot faktisk produksjon i denne kontrollen.
- Eksternt datatrekk fra live Frankfurter og live SSB: **ikke** verifisert med direkte nettlesersvar.
- Core Web Vitals (LCP, INP, CLS): **ikke** målt med reelle trafikkdata.
- Sikkerhets-/personvernvurdering: gjennomgang av hele nettstedet er **ikke** ferdigstilt.

## Utestående før profesjonell lansering / videresalg
1. Full visuell QA og klikkflyttest i Chrome, Safari og mobil.
2. Reell verifisering av adresser og SSB-estimater i flere norske kommuner.
3. Bank- og sparekilder: automatikk, faktiske publiserte renter, oppdateringsdato og kilde.
4. Valutakurser: driftstest mot direkte kilde; historikk og kurser på helligdager; varsler er ikke bygget.
5. Produksjons-MP4-filer mangler fortsatt i Animation Studio.
6. Konsistent design-system, lastetid, søk, responsivitet, kontrast og tilgjengelighet.
7. Reell trafikkmåling, samtykkekontroller ved behov og analyse av inntekter/brukere.
8. Juridiske krav, datakildenes vilkår og innholdsansvar.

## Markedsverdi
Ingen pålitelig salgsverdi kan beregnes bare ut fra antall sider eller moduler. Besøk, månedlig resultat, dokumentert vekst, rettigheter og teknisk kvalitet må dokumenteres. Benchmark for lønnsomme små SaaS-tjenester gjelder ikke direkte en portal uten dokumenterte inntekter.
