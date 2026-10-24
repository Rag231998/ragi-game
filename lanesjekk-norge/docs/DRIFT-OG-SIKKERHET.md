# Lånesjekk Norge – drift, sikkerhet og overlevering

**Sist oppdatert:** 25. oktober 2026  
**Regel:** Ikke dokumenter tilgangsnøkler, passord, private e-postadresser, reservekoder, SMTP-hemmeligheter eller tokens i GitHub, skjermbilder eller supportsaker.

> **Sikkerhetsfunn og oversikt over leverandører:** [PLATTFORMER-ARKITEKTUR-SIKKERHET.md](PLATTFORMER-ARKITEKTUR-SIKKERHET.md) beskriver kontrollerte Supabase-policyer, åpne rådgivervarsler, driftsplattformer og arkitekturen.

## 1. Driftsoversikt og lenker

| Hva | Hvor |
| --- | --- |
| Offentlig nettside | https://lanesjekk-norge.onrender.com/ |
| Helsesjekk | https://lanesjekk-norge.onrender.com/health |
| Admin | https://lanesjekk-norge.onrender.com/studio-admin.html |
| Passord | https://lanesjekk-norge.onrender.com/admin-password.html |
| Render dashboard | https://dashboard.render.com/web/srv-dbecojo473hc73csuvlg |
| GitHub | https://github.com/Rag231998/ragi-game/tree/main/lanesjekk-norge |
| Supabase | https://supabase.com/dashboard/project/pryrgwfjniggjlrizenh |
| Supabase SMTP | https://supabase.com/dashboard/project/pryrgwfjniggjlrizenh/auth/smtp |
| Supabase auth-URL-er | https://supabase.com/dashboard/project/pryrgwfjniggjlrizenh/auth/url-configuration |

Render har automatisk deploy fra main. Test og verifiser *aktiv* commit før du sier at en kodeendring er live. Prod og versjonskontroll er to forskjellige ting.

## 2. Lokal utvikling og test

Forutsetter Node.js 20 eller nyere og tilgang til prosjektkoden.

    git clone https://github.com/Rag231998/ragi-game.git
    cd ragi-game/lanesjekk-norge
    npm install
    npm test
    npm start

Besøk http://localhost:3000/ og http://localhost:3000/health.

I package.json:
- npm test: Node-testene i tests/site-integrity.test.cjs.
- npm start: starter server.js; prestart kjører npm test.
- postinstall: prøver offentlige datakilder uten å blokkere all oppstart ved kildesvikt.

Playwright-tester ligger i tests og bruker eget npm-prosjekt. Det finnes konfigurasjon for desktop, nettbrett, iPhone og Android. Ikke påstå at de er kjørt bare fordi filene finnes. For lokal kjøring må testavhengigheter og nettlesere installeres; følg tests/playwright.config.cjs og relevante GitHub Actions-workflows.

## 3. Publisering og kontroll

1. Endre filer i lanesjekk-norge på main, med beskrivende commitmelding.
2. Kontroller testresultat (i repoet og/eller Render-loggene).
3. Følg Render Deploys til aktuell commit får status live.
4. Sjekk GET /health og at HTML, JS og CSS i nettleseren svarer uten kritiske feil.
5. Test berørte visninger, inkludert smale skjermbredder og navigasjon.
6. Når endringen påvirker innlogging, valuta, adresse eller boligstatistikk: test den faktiske kjeden mot den relevante eksterne tjenesten.
7. Loggfør dato, commit, deploy-ID, passerende tester, kjente begrensninger og ansvarlig for oppfølging.

Viktig: Det finnes et eldre Vercel-oppsett. En mislykket Vercel-sjekk beviser ikke at Render-produksjon er nede; kontroller riktig driftsmål. Motsatt betyr «Render live» ikke at en e-post faktisk ble levert.

## 4. Studio og CMS – daglig drift

1. Åpne studio-admin.html og logg inn med godkjent Supabase-konto.
2. Rediger ønskede felt. Ikke anta at hvert felt på nettsiden er CMS-styrt.
3. Bruk forhåndsvisning for å inspisere endringen før publisering.
4. Velg «Publiser permanent» for å lagre godkjent konfigurasjon i Supabase.
5. Bekreft den faktiske endringen på publikumsforsiden i nytt vindu.
6. Hvis et medieoppsett er feil, kontroller filformat, lagring, offentlig URL og at mediet faktisk er slått på.

Endringer i CMS erstatter ikke endringer i kildekode. Oppdaterte kodeskript krever ny Render-deploy.

## 5. Tilgangsstyring og hemmeligheter

- Supabase Auth administrerer brukere og økter; tabellen public.admins brukes for adminautorisasjon.
- RLS må beholdes på tabeller som er synlige gjennom Supabases Data API; privilegerte nøkler hører utelukkende hjemme på serversiden.
- Publiserbar Supabase-nøkkel i klienten gir ikke administratorrettigheter alene.
- Ikke legg Supabase service-role, Resend API-nøkkel eller andre private nøkler i JavaScript sendt til klienten, git-commits, dokumentskjermbilder eller logger.
- Bruk minste nødvendige tillatelser. Kontroller tilganger etter endringer.
- Ved mistanke om eksponert nøkkel: tilbakekall nøkkelen hos leverandøren, opprett ny og oppdater sikre serverinnstillinger.
- Sjekk at reservekodetabellen fortsatt har RLS på og ingen direkte offentlige lese-/skrivetillatelser.

**Reservekoder:** Tre engangskoder genereres etter godkjent admininnlogging. Hver kode er tilfeldig, hash lagres i Supabase, og en vellykket gjenoppretting forbruker den aktuelle koden. Kodene vises én gang; oppbevar dem i en passordbehandler. Gyldighet settes ved generering (for tiden ett år). Skulle alle koder gå tapt, må en annen støttet identitetsbekreftet gjenopprettingsvei benyttes.

## 6. Passord via e-post – verifikasjonsprosedyre

**Ønsket hovedflyt:** Glemt passord → registrert admin-e-post → autentisk Supabase-lenke → admin-password.html → nytt passord → innlogging.

Supabase var tidligere konfigurert med den innebygde e-postsenderen. Auth-loggene har vist 429 over_email_send_rate_limit. Resend ble brukt i SMTP-oppsettet, og administrator bekrefter 25.10.2026 at passord-e-post fungerer. Gratis prøvesender kan ha streng mottakerbegrensning. Resend krever normalt verifisert avsenderdomene for vanlig produksjonsutsending; et akseptert domenenavn i skjemaet er *ikke* det samme som å eie/verifisere domenet.

Ved kontroll og vedlikehold av SMTP:
1. Verifiser hvilken avsender og mottaker leverandøren tillater. Ikke gjett ut fra grønt domeneikon.
2. Lag SMTP-legitimasjon hos leverandøren og lagre den i Supabase Auth SMTP-konfigurasjon, aldri i frontend eller repoet.
3. Sett riktig senderadresse, sendernavn, host, port og brukernavn.
4. Sørg for at redirect-URL https://lanesjekk-norge.onrender.com/admin-password.html er tillatt i Supabase Authentication → URL Configuration.
5. Send **én** passordlenke til en konto du eier og har tillatelse til å teste.
6. Bekreft faktisk e-postmottak, korrekt avsender, riktig redirect, utløp, passordendring og påfølgende innlogging. Bruk testkonto der det er mulig.
7. Sjekk Supabase Auth-logger og leverandørens leveranselogger. Skill HTTP 200 på forespørsel fra faktisk levert e-post.
8. Merk dato, testkonto (ikke fullstendig adresse), leverandør, konfigurasjonsstatus og testresultat her.

**Status oppdatert 25.10.2026:** Administrator bekrefter at passord-e-post fungerer og mottas. Dette er brukerbekreftet funksjon, ikke en uavhengig SMTP-konfigurasjonsrevisjon eller dokumentert ende-til-ende passordbytte. Fortsett å følge prosedyren etter vesentlige endringer. Reservekoder beholdes som valgfri nødløsning.

## 7. Testmatrise

| Kontroll | Dokumentert status |
| --- | --- |
| Node-regresjonstest | 16/16 pass på Render 24.10.2026 før dokumentasjonsoppdateringen |
| Gjeldende Render-produksjon | Bekreftet live ved kontroll 25.10.2026, deploy dep-dbein6rncjis73eckc80 |
| Direkte datakildekontroll | Sjekk mot Kartverket, SSB og Frankfurter inngår i deployløpet |
| Playwright nettlesertester | Testfiler finnes; full grønn kjøring for alle miljøer ikke bekreftet |
| Visuell mobil-/Safari-QA | Ikke dokumentert fullført |
| E-postlevering/SMTP | Brukerbekreftet fungerende 25.10.2026; uavhengig fulltest gjenstår |
| Virkelig passordbytte for admin | Ikke automatisk utført eller bekreftet i denne dokumentasjonen |
| Ende-til-ende reservekodegjenoppretting | Kode og tester finnes; faktisk reset av bruker ikke utført her |
| Tilgjengelighet, kontrast og ytelse | Full revisjon gjenstår |

## 8. Feilsøking

**Nettsiden viser gammel versjon:** Sjekk aktiv commit og Render deploy-status, så nettleser-cache og HTML/JS versjonsparametere.

**Administrator får ikke redigert:** Sjekk Supabase-økt, public.admins, RLS, nettverk, lagringsbucket og browser-konsoll. Ikke omgå autorisasjonen for å få redigeringen til å virke.

**Glemt passord gir 429:** Se Supabase Auth-logg. Ved e-postbegrensning må faktisk SMTP-leveranse konfigureres/verifiseres, eller vente på kvoten. Ikke vis en fiktiv suksessmelding.

**Brukt eller utløpt reservekode:** En reservekode kan ikke gjenbrukes. Opprett nye koder mens du er innlogget eller bruk gyldig e-postgjenoppretting. Ikke legg koder i supportsaker.

**Valuta eller boligstatistikk mangler:** Kontroller tredjepartsstatus, kildeversjon, HTTP-svar, caching og begrensninger. Vis «utilgjengelig» fremfor oppdiktet kurs eller e-takst.

**Kritisk produksjonsfeil:** Finn sist kjente fungerende commit/deploy, undersøk logger og avgjør om ny korrekt commit eller tilbakeføring kreves. Oppbevar en kort hendelsesrapport i intern logg uten hemmeligheter.

## 9. Vedlikeholdslogg – mal

| Dato | Funksjon | Commit/deploy | Endret | Verifisert | Åpent |
| --- | --- | --- | --- | --- | --- |
| 25.10.2026 | Prosjektdokumentasjon | Se GitHub-historikk | Opprettet samlet arkitektur- og driftsoversikt | Kode-/konfigurasjonsinspeksjon | Uavhengig SMTP/lenke-sluttest, komplett QA |

Oppdater dato, eventuelle API-kildeendringer, auth/SMTP-status og nye avhengigheter hver gang strukturen endres.

Gå tilbake til [PROSJEKTOVERSIKT.md](PROSJEKTOVERSIKT.md) for arkitektur, funksjoner og komponenter.
