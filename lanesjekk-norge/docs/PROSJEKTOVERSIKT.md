# Lånesjekk Norge – arkitektur og prosjektoversikt

**Sist gjennomgått:** 25. oktober 2026  
**Status:** Dokumentasjon av faktisk kode, tilkoblede tjenester og bekreftet produksjon. Et implementert skjermbilde eller en bestått enhetstest betyr ikke nødvendigvis at hele funksjonen er godkjent i sluttbrukertest.

## 1. Formål og omfang

Lånesjekk Norge er en norsk, nettleserbasert portal for å forstå privatøkonomi gjennom kalkulatorer, grafer, eksempler og artikler. Verktøyene er ment som informasjon og læring, ikke personlige finansråd, banktilbud eller kreditbeslutninger.

Publisert adresse: https://lanesjekk-norge.onrender.com/  
Administrasjon: https://lanesjekk-norge.onrender.com/studio-admin.html  
Passord og gjenoppretting: https://lanesjekk-norge.onrender.com/admin-password.html  
GitHub-kode: https://github.com/Rag231998/ragi-game/tree/main/lanesjekk-norge  
Aktiv kodegren: main. Hele appen ligger i undermappen lanesjekk-norge.

## 2. Teknisk arkitektur

    Besøkende / administrator
               |
               v
    Render – Node.js (server.js)
               |
       +-------+-------------------+
       |                           |
       v                           v
    Statisk HTML/CSS/JS       /api/* (Node-handlere)
       |                           |
       |                     Offentlige kilder
       |                     – Kartverket
       |                     – SSB
       |                     – Frankfurter
       v
    Supabase (autentisering, RLS, konfigurasjon, medielagring)
       |
       +-- Studio administrerer publisert konfigurasjon
       +-- Auth administrerer innlogging og passordlenker
       +-- Edge Function håndterer engangs-reservekoder

Kildekode og historikk oppbevares i GitHub. Render bygger fra main og starter Node-serveren. Brukergrensesnittet er overveiende vanlig HTML, CSS og JavaScript, uten at hele portalen er bundet til et React/Vue-byggeverktøy.

**Render-konfigurasjon ved kontroll:** tjeneste lanesjekk-norge, tjeneste-ID srv-dbecojo473hc73csuvlg, region Frankfurt, gratis webplan; byggkommando cd lanesjekk-norge && npm install --omit=dev; startkommando cd lanesjekk-norge && npm start. Historiske Vercel-filer/integrasjoner finnes, men er ikke den bekreftede produksjonsserveren.

**Server:** lanesjekk-norge/server.js serverer forsiden, lokale ressurser, /health og API-ruter under /api/. API-modulene er filer i lanesjekk-norge/api. Ikke anta at alle API-endepunkter er verifisert med faktisk produksjonstrafikk.

## 3. Brukerfunksjoner

Følgende moduler er representert i den nåværende nettsiden. Status «finnes» beskriver implementasjon, ikke feilfri gjennomtesting.

| Område | Visning | Omfang |
| --- | --- | --- |
| Forside | #topp | Seks animerte økonomiscener |
| Boliglån | #sjekk | Annuitet, rente, nedbetaling og sammenligning |
| Billån | #billan | Finansierings- og bilkostnadseksempler |
| Forbrukslån | #forbrukslan | Nedbetaling, renter og gebyrer |
| Banker | #banker | Utvalgt bankregister og søk, ikke automatiske sanntidstilbud |
| Budsjett | #budsjett | Inntekter, utgifter, nøkkeltall, grafer og utskrift/PDF |
| Kvitteringer | #kvitteringer | Registrering og forbruksanalyse; ikke anta fullstendig OCR-støtte |
| Sparing | #sparing | Spareeksempler og forklaringer |
| Fond og aksjer | #investering | Investering, avgifter og illustrative risikoscenarioer |
| Valuta | #valutakompass | Valutakonvertering, historikk og gebyreksempler |
| Boligverdi | #boligverdi | Adressesøk og statistisk sammenligning, ikke e-takst |
| Utleie | #utleieanalyse | Inntekter, kostnader og utleieregnestykker |
| Akademi | #akademi | Læring og quiz |
| Guider | #guider | Artikler og forklaringer |

Navigasjonen benytter separate visninger med fragmentlenker på hovedsiden. Mye økonomisk regning gjøres lokalt i nettleseren. Data som frivillig tastes inn i slike skjemaer, skal ikke omtales som overført til Supabase uten kontroll av den aktuelle modulen.

## 4. Viktige filer

| Fil eller mappe | Ansvar |
| --- | --- |
| index.html | Hovedside, navigasjon, seksjoner og skriptreferanser |
| server.js | HTTP-server og ruting |
| finance-tools.js, finance-ui.js | Finansberegninger og brukergrensesnitt |
| daily-studio.js | Budsjett-/utskriftsfunksjoner i nettleser |
| valutakompass.js, valutakompass.css | Egen valutavisning |
| api/ | Offentlige beregnings- og dataendepunkter |
| studio-admin.html | Admin-grensesnitt |
| admin-studio.js, admin-studio.css | Autentisering, editor og stil |
| admin-animation-studio.js | Medieopplasting og animasjonsadministrasjon |
| site-cms.js | Leser og bruker publisert CMS-konfigurasjon |
| site-media.js | Viser konfigurerte medieinnslag |
| admin-password.html, admin-password.js | E-postgjenoppretting, passordbytte og reservekoder |
| auth-recovery-redirect.js | Sikker omdirigering når en auth-lenke havner på forsiden |
| supabase/functions/lanesjekk-admin-recovery/index.ts | Privilegert behandling av engangs-reservekoder |
| tests/ | Node-tester og Playwright-testfiler |
| scripts/check-live-data.cjs | Ikke-blokkerende sjekk av offentlige datakilder |

## 5. Offentlige data og beregningsforutsetninger

- **Kartverket**: adressesøk via /api/address-search. Treffer er adresser, ikke verifiserte eiendomspriser.
- **Statistisk sentralbyrå (SSB)**: boligstatistikk via /api/property-market, særlig tabell 14310. Statistikk per kommune/boligtype er ikke en individuell markedsvurdering.
- **Frankfurter**: valutakurser via /api/currency og /api/currency-history. Daglige referansekurser, ikke bankenes faktiske kjøps-/salgskurser eller betaling i sanntid.
- **Bankoversikt**: et kuratert utvalg; ikke en fullstendig eller kontinuerlig live prissammenligning. Finansportalens datafeed krever avtale.
- **Låne- og investeringsgrafer**: matematisk modellerte eksempler med antakelser som må vises i brukergrensesnittet.

Serverens kontrollskript prøver Kartverket, SSB og Frankfurter, men dersom en ekstern tjeneste er utilgjengelig, betyr ikke dette automatisk at nettsiden er frisk eller at tall skal erstattes med oppdiktede verdier.

## 6. Supabase: faktisk lagringsmodell

Supabase-prosjekt: drivpris-norge, prosjekt-ID pryrgwfjniggjlrizenh. Prosjektnavnet er historisk; det benyttes også av Lånesjekk Norge.

Bekreftede tabeller i public-skjemaet:

| Tabell | Formål |
| --- | --- |
| admins | Kobler tillatte administratorer til autentiserte Supabase-brukere |
| lanesjekk_site_config | Gjeldende publisert CMS-konfigurasjon (JSON, revisjonsnummer) |
| lanesjekk_site_revisions | Revisjonshistorikk for publisert innhold |
| lanesjekk_rate_updates | Registrerte spare-/rentesatser og kildeinformasjon |
| lanesjekk_admin_recovery_codes | Hash, eier, generasjon, utløp og brukstid for engangskoder |

Lagringsområder som brukes i kode: site-assets og animation-assets. Eksakt antall filer kan endres; kontroller status i Supabase før tall rapporteres.

Publiseringsforløp: innlogget administrator endrer et lokalt utkast i Studio, forhåndsviser og velger «Publiser permanent». site-cms.js laster publisert konfigurasjon for besøkende. Endringer som gjøres direkte i GitHub krever kodepublisering via Render, mens CMS-konfigurasjon kan endres uten ny kodedistribusjon.

## 7. Administrator og passord

Supabase Auth håndterer e-post/passord og gjenopprettingslenker. En innlogget bruker er **ikke automatisk administrator**; admin-funksjonene krever oppslag i admins og relevant databaseadgang/RLS.

- Glemt passord åpnes på separat admin-password.html, ikke en vilkårlig offentlig redigeringsside.
- E-postflyten benytter Supabases resetPasswordForEmail og returnerer til admin-password.html.
- Passord kan også endres av allerede innlogget administrator på kontosiden.
- Alternativt kan administrator opprette tre engangskoder mens vedkommende er innlogget. Koder lages med kryptografisk tilfeldighet, SHA-256-hash lagres, og kode konsumeres før passordet endres av en privilegert Edge Function. Nye generasjoner ugyldiggjør tidligere koder. De er reserveordning, **ikke** erstatning for e-post som ønsket hovedmetode.
- Reservekoder må opprettes og oppbevares trygt *før* en eventuell låsesituasjon. De kan ikke gjenopprettes fra databasen i klartekst.

**SMTP-status:** Resend ble undersøkt, men det finnes ikke grunnlag i prosjektkontrollen for å erklære egen SMTP-konfigurasjon eller slutt-testet e-postutsending som aktiv. Den innebygde Supabase-senderen har tidligere gitt 429 / over_email_send_rate_limit. Hvis custom SMTP konfigureres i Supabase, må den faktiske mottatte e-posten og gjenopprettingslenken testes før status settes til «verifisert». Ingen hemmelige API-nøkler skal inn i GitHub eller dette dokumentet.

## 8. Dagens kvalitetsstatus

Sist bekreftede vellykkede Render-utrulling før denne dokumentasjonsendringen: 24. oktober 2026, deploy dep-dbein6rncjis73eckc80, commit 7f211a26caa9803736ad4dc708d3fdbba5568b1d.

Ved den utrullingen besto **16 av 16 Node-regresjonstester** (npm test under prestart). Bekreftelsen gjelder disse testene, ikke en full sluttbruker-, sikkerhets- eller nettlesertest. Playwright-testfiler og GitHub Actions finnes, men grønn gjennomkjøring for alle nettlesere og virkelige innlogginger er ikke dokumentert.

Følg sjekklistene i [DRIFT-OG-SIKKERHET.md](DRIFT-OG-SIKKERHET.md) før endringer omtales som ferdige.

## 9. Videre utvikling og vedlikehold

Når en funksjon endres: (1) oppdater koden, (2) skriv/reguler tester, (3) bygg/publiser, (4) kontroller produksjonsadressen og eventuelle eksterne avhengigheter, (5) dokumenter hva som faktisk ble testet, og (6) oppdater denne oversikten og gjeldende driftsstatus.

Eksisterende [INTEGRASJONER-STATUS.md](../INTEGRASJONER-STATUS.md) og [README.md](../README.md) inneholder historikk og eldre statusopplysninger. Denne oversikten er den nye inngangen for arkitektur per 25. oktober 2026, men ingen dokumenter erstatter inspeksjon av gjeldende kode og konfigurasjon.
