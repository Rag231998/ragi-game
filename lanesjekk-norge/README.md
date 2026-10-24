# Lånesjekk Norge

> **Oppdatert inngang til prosjektet (25. oktober 2026):** Les [prosjektoversikten](docs/PROSJEKTOVERSIKT.md) for gjeldende arkitektur, brukerfunksjoner, driftsmiljø og hvilke deler som er testet. Se [drift, sikkerhet og overlevering](docs/DRIFT-OG-SIKKERHET.md) for publisering, administratorrettigheter, passord, SMTP-status og feilsøking. Eldre avsnitt nedenfor er historikk og kan inneholde utdaterte beskrivelser av admin og Vercel.


En separat, personvernvennlig nettside og et kalkulasjons-API for norske boliglån. Endrer ikke PrisKart Norge.

## Funksjonalitet
- Interaktiv annuitetskalkulator med restgjeld, boligverdi, nominell rente, løpetid og gebyr.
- Sammenlign opptil 8 tilbud brukeren legger inn, inkludert etableringskostnad.
- Se estimert månedlig betaling, totalkostnad, belåningsgrad og forskjell.
- Kopier forhandlingsmelding og låneoversikt.
- Finansportalens offisielle originale iframe, kun når brukeren aktiverer visningen.
- Fungerer uten konto, databaser, informasjonskapsler eller innebygd analyseverktøy.

## Bankdata
Finansportalens offentlige REST-feed krever signert distribusjonsavtale. Det er ikke lov å hente iframe-verktøyets interne datafeed uten avtale. Den offisielle iframe kan brukes uendret uten avtale. Se https://www.forbrukerradet.no/finansportalen/bank/bruk-av-vare-data/

For maskinell integrasjon etter avtale: bruk token-endepunktet POST https://finans-api.forbrukerradet.no/auth/token med grantType external_consumer, deretter GET /feed/mortgages. Oppbevar clientId/clientSecret på serveren og overhold avtalt caching, kreditering og aktualitet.

## Valgfritt JSON API når serverless-backend er publisert
POST /api/calculate
JSON body: {"principal":3000000,"propertyValue":4500000,"years":25,"current":{"rate":5.50,"monthlyFee":65},"offers":[{"bankId":"dnb","rate":5.0,"monthlyFee":65,"startupFee":5000}]}

API-et svarer med resultat for dagens lån og alternativer; det henter ingen bankpriser og lagrer ingen lånedata i applikasjonen. Den vanlige nettsiden regner lokalt og kaller ikke API-et. Ved direkte API-bruk sendes opplysningene til serveren for beregning.

## Regnemetode og begrensninger
Annuitet, 12 betalinger i året og nominell rente delt på 12. Renten antas uendret. Månedlige gebyrer og engangskostnader legges til, uten å finansiere engangskostnaden. Ikke beregnet skatteeffekt, individuell kredittvurdering eller regulatorisk effektiv rente. Resultatene er regneeksempler, ikke banktilbud.

Ved overgang fra kalkulator til personlig finansrådgivning, lånesøknad eller finansagentaktivitet må kravene i låneformidlingsloven undersøkes. Se https://www.finanstilsynet.no/tema/laneformidling/

## Kontroll
Statisk Javascript-syntaks, UI-referanser, annuitetsmatematikk (inkludert nullrente, renter og gebyrer) samt gyldige/ugyldige API-data er kontrollert. Interaktiv e2e-test i ekte nettleser og faktisk produksjonsdeploy av API-et gjenstår.

## Publisering
Koble et **eget Vercel-prosjekt** til eksisterende GitHub-repository `Rag231998/ragi-game`. Sett **Root Directory** til `lanesjekk-norge`, **Framework Preset** til `Other` / `None`, og la **Build Command** og **Output Directory** stå tomme. IKKE flytt filene fra undermappen; `index.html` og `api/calculate.js` er allerede plassert riktig når Root Directory brukes. Test både `/` og `POST /api/calculate` på preview-URL før produksjon. Domene/DNS må knyttes til dette prosjektet separat. GitHub Pages kan vise den statiske nettsiden, men kjører **ikke** Vercel-funksjonen `/api/calculate`.

## Oppgradert bankoversikt og premium-UX – 23. oktober 2026

- `banker.js`: manuelt kuratert registerliste med **11 banker og bankkonsepter** der bank/filial og banktillatelse er dokumentert med en direkte lenke til Finanstilsynets virksomhetsregister. Dette er et utvalg, **ikke** hele markedet eller en løpende automatisk lisenskontroll.
- `bank-search.js`: øyeblikkelig banksøk (navn, juridisk navn og organisasjonsnummer), håndtering av norske aksenter, tastatur, søk uten treff og direkte valg av bankkort.
- Bankkortene forsøker å laste bankens **egne nettstedikoner/favicons**, og bruker stiliserte initialer hvis nettstedet ikke leverer et ikon. Det innebærer en nettverksforespørsel til de viste bankenes domener; IP-adressen kan derfor bli synlig der. Ikke anta at favicon er bankens fullstendige offisielle logo.
- Valg av bank fyller inn banknavnet som skrivebeskyttet. Brukeren må selv legge inn den **faktiske tilbudsrenten**. En valgt bank viser direkte lenke til registerkilden.
- `api/calculate.js` krever `bankId` fra en **server-side allowlist** med de samme elleve bank-/konsept-ID-ene. Påstander eller banknavn fra innsendt API-body aksepteres ikke ukritisk.
- Interaktiv renteslider viser hypotetisk reduksjon i **sum månedlige terminbeløp for 12 måneder** og er ikke en garanti for spart rentekostnad.
- `premium.css` er spesialutviklet responsivt brukergrensesnitt, ikke kopi av en annen nettsides design eller innhold.
- `tests/` og `.github/workflows/lanesjekk-browser-tests.yml` inneholder automatiske tester for desktop-Chromium, Android-Chromium, nettbrett og iPhone-WebKit. Testene er skrevet, men **ingen vellykket nettleserkjøring er bekreftet i denne samtalen**.

**Viktig:** Ikke vis en bank som «anbefalt», «billigst» eller «best» på bakgrunn av registeroppføring. Publiserte banktilbud krever faktiske data, tydelige betingelser og lisensiert datatilgang. Banker og logoer er ikke sponsorer eller partnere i tjenesten.

**Bankkonsepter:** Bulder er et konsept levert under Sparebanken Norges banktillatelse (Finanstilsynet ID 99313) og Sbanken er et konsept under DNB Bank ASA (ID 98973). Disse merkes eksplisitt som bankkonsepter, ikke egne konsesjonsbanker. Kilder: https://www.bulder.no/om-oss og https://www.dnb.no/hjelp-og-veiledning/sbanken-fusjonen .


## Kvalitetssikring av videreutviklingen – 23. oktober 2026

Regresjonstester i `tests/api.spec.cjs` verifiserer matematikk, 0 %-rente, ugyldige forespørsler, alle tillatte bank-ID-er og samsvar med nettleserens bankliste. UI-testene er utvidet med validering av tom rente, innsendelse med Enter, duplikat-/maksbegrensning og detaljerte feilsøkingstall ved mobil-overflyt. Pull requests utløser begge testtypene via GitHub Actions.

**Lokal kontroll (fra repository):**
```bash
cd lanesjekk-norge/tests
npm install
node --test api.spec.cjs
npm run test
```

Nettleserens `<form>` sendes ikke til serveren. Tast inn tom rente gir ugyldig beregning i stedet for en feilaktig rente på null. Husk at en vellykket CI-test ikke bekrefter at banktillatelser, banklogos eller bankrenter fortsatt er oppdaterte; bankkildene krever separat vedlikehold.

## Søkemotorer, eget domene og offentlig lansering

**Midlertidig hovedadresse:** `https://lanesjekk-norge.vercel.app/`. Appens `<link rel="canonical">`, Open Graph-URL, JSON-LD, `robots.txt` og `sitemap.xml` peker konsekvent dit frem til eget domene er valgt og verifisert. Dette er den eksisterende selvstendige Vercel-publiseringen; GitHub Pages er bare et alternativt speil/prosjektforhåndsvisning.

**Før flytting til eget domene:**
1. Sjekk at ønsket .no-domenenavn er tilgjengelig, og at det ikke krenker andres varemerker eller foretaksnavn. Registrer gjennom godkjent domeneforhandler.
2. Knytt domenet til **Vercel-prosjektet `lanesjekk-norge`**, ikke GitHub Pages-prosjektet for hele repositoryet. Under Vercel Settings → Domains får du korrekt A-/CNAME-/TXT-verifisering. Aktiver HTTPS og velg én kanonisk variant, med omdirigering fra den andre (www/apex).
3. **Samme pull request må oppdatere alle forekomster av midlertidig Vercel-URL** i `index.html` (canonical, Open Graph, JSON-LD), `robots.txt` og `sitemap.xml`. Ikke la sitemap annonsere en gammel adresse. Sørg for 301-viderekoblinger fra eventuelle offentlige gamle adresser når det er teknisk mulig.
4. Verifiser det nye domenet i [Google Search Console](https://search.google.com/search-console/about). Send inn `https://<ditt-domene>/sitemap.xml`, bruk verktøyet URL-inspeksjon, og kontroller at `robots.txt` og siden returnerer HTTP 200. Gjenta for Bing Webmaster Tools om ønskelig.
5. Kontrollér at offisiell bankkonsesjon er korrekt og oppdatert, at renter ikke presenteres som live uten avtale, at personvernopplysninger og kildehenvisninger er riktige, og at PC-/mobil- og produksjons-API-testene er grønne. Indeksering er ikke garanti for søkerangering.

**Automatiske SEO-regresjonstester:** `cd lanesjekk-norge/tests && node --test seo.spec.cjs`. Disse testene sjekker samsvar mellom metadata, sitemap og robots. Testsuiten hindrer ikke at innholdet kan være feil eller utdatert; kildene og faktiske brukertilstander må også kontrolleres.

**Viktig:** Ikke endre GitHub Pages' repo-globale custom domain eller DNS for andre prosjekter i monorepoet. Bruk Vercels prosjektspesifikke domeneadministrasjon.


## Oppgradering: norske tall og utvidet banksøk (23. oktober 2026)

### Norske inndata
- numbers.js håndterer tallformatet «3 109 049» kr, beløp med norske desimaler («3 109 049,50») og renter som «5,25 %». Tall med punktum som tusenskille kan limes inn.
- Beregningene utføres med gyldige numeriske verdier, ikke formatert tekst. Tomme felt gir ikke en falsk 0 %-rente.
- Fungerer for restgjeld, boligverdi, gebyr, engangskostnad og nominell rente.

### Banksøk og kildegrunnlag
- 11 manuelt kontrollerte oppføringer med direkte lenke til Finanstilsynets register samt ytterligere 86 navn fra Norges Banks bankliste per 25. juni 2026: https://www.norges-bank.no/en/topics/Norges-Banks-settlement-system/Banks-with-accounts-in-Norges-Bank/
- Totalt 97 søkbare oppføringer. Kilden er en datert snapshot, ikke et komplett sanntidsregister eller bekreftelse på at alle bankene tilbyr boliglån. Banker fra Norges Banks liste har ikke individuell konsesjonskontroll i denne versjonen.
- Banksøket bruker input/autocomplete fremfor en stor nedtrekksliste. Bankkort viser åtte banker i første omgang og søker gjennom alle oppføringene.
- Logoer som er identifisert mot riktig merkevare kan vises via Wikimedia Commons; deretter bankens offisielle favicon der dette er kjent, ellers initialer. Banklogoene indikerer ingen sponsoravtale eller partnerskap. Kontroller opphavsrett og varemerker før kommersiell lansering.
- Beregnings-API-et bruker samme bank-ID-register som nettsiden. Ingen renter oppgis automatisk.

### Nedbetalingsplan og tester
- repayment.js beregner år-for-år renter, avdrag og restgjeld ved månedlig annuitet og uendret nominell rente i 1–40 år. Gebyr og ekstra avdrag er ikke med i de enkelte årsradene.
- Kjør lokale tall- og API-regresjonstester med: node --test tests/format.spec.cjs tests/api.spec.cjs tests/seo.spec.cjs.
- Playwright dekker desktop, nettbrett, iPhone WebKit og Android Chromium.

### Før full markedsdekning eller automatiske renter
- Nye bankkonsesjoner, nedleggelser og fusjoner må kunne oppdateres gjennom en pålitelig synkroniseringsprosess, helst mot Finanstilsynets offisielle API med riktig filtrering.
- Live boliglånsrenter krever distribusjonsavtale med Finansportalen eller annen tillatt kilde: https://www.forbrukerradet.no/finansportalen/bank/bruk-av-vare-data/


## Finansportal: sparing og kunnskap (23. oktober 2026)

Denne versjonen bygger videre på eksisterende boliglånkalkulator uten å fjerne eller erstatte den. Forsiden har åtte navigerbare verktøykort og tre artikkelkort. Egne sider ligger på /sparing.html og /guider.html.

**Sparing:** Interaktiv kalkulator sorterer et tydelig begrenset utvalg offentlige kontoeksempler etter et oppgitt innskudd mellom 1 000 og 2 000 000 kr. Filtre skiller frie uttak, begrensede uttak, uttaksvarsel og medlemskap. Det er ikke hele norske bankmarkedet. Alle satser og krav ligger i savings-data.js som et datert kildeøyeblikksbilde kontrollert 23.10.2026, med direkte kildelenke til hver banks publiserte vilkår. Beregningen viser enkel rente før skatt på valgt saldo over ett år, uten rentes rente. Bankenes egne prislister kan endres etter kontrollen; en serverlevering i dag betyr ikke at en sats ble oppdatert i dag.

**Aktuelle kontoeksempler:** DNB, Nordea, SpareBank 1 Østlandet, KLP Banken, OBOS-banken, Storebrand Bank og Landkreditt Bank. OBOS-medlemskap skal aktiveres i filteret før slike kontoer vises. Rentetrinn, maksbeløp og gebyrfrie uttak er eksplisitt modellert, men betingelser skal alltid kontrolleres mot kilden. Logoer i denne visningen er kun bankinitialer i egne farger, ikke uautoriserte bankmerker.

**Oppdaterte renter:** Original og uendret innskudds-iframe fra Finansportalen kan aktiveres manuelt på sparingssiden. Den er levert fra Forbrukerrådets domenenavn i en separat iframe og følger deres datakilder og tidsstempler. Iframen brukes uten distribusjonsavtale i tråd med Forbrukerrådets regelverk: https://www.forbrukerradet.no/finansportalen/bank/bruk-av-vare-data/. Uttrykkelig FORBUDT i dette prosjektet uten avtale: å skrape data fra iframen, hente fra dens interne feed eller kalle øyeblikksbildet en live-rente. Det er ikke etablert en autorisert maskinell sanntidsfeed ennå.

**Spareprognose:** Inngående beløp + månedlig innbetaling over 1–30 år ved valgt hypotetisk nominell rente med månedlig kapitalisering. Grafen skiller egne innskudd fra antatt avkastning. Skatt, renteendringer, inflasjon og kostnader er ikke med i dette regneeksemplet.

**Guider:** Ni artikler med direkte kildehenvisninger dekker buffer, innskuddsgaranti, rentevilkår, BSU, ASK, IPS, refinansiering, sparing vs lånenedbetaling og vår datametode. Norske skatteregler og renteopplysninger må vedlikeholdes ved lov- og satsendringer.

**Test og publisering:** Node-regresjon: `cd lanesjekk-norge/tests && node --test api.spec.cjs seo.spec.cjs format.spec.cjs savings.spec.cjs`. Playwright: `npm run test -- --config=playwright.config.cjs` på desktop, nettbrett, iPhone WebKit og Android. Produksjonstest må bekrefte HTTP 200 for /, /sparing.html, /guider.html, scripts, sitemap og ekte kalkulasjons-API. Endringer publiseres til et eget Vercel-prosjekt med Root Directory lanesjekk-norge. Ikke endre andre prosjekter i repositoryet.

Direkte bankkilder for det oppdaterte eksempelsamlingen (kildesjekk 23.10.2026): Nordea Sparekonto Ekstra https://www.nordea.no/privat/vare-produkter/priser/priser-for-innskuddskonto-og-plasseringer-personkunder.html og SpareBank 1 Østlandet prisliste https://www.sparebank1.no/nb/ostlandet/privat/kundeservice/bestill/prisliste.html .


## Én samlet nettside – 23. oktober 2026

Hovedadressen `https://lanesjekk-norge.vercel.app/` viser **alle funksjoner i ett dokument**: forside og navigasjonskort, sparekalkulator og produktutvalg (`#sparing` / `#sparing-kalkulator`), hypotetisk spareprognose, innskuddsoversikten fra Finansportalen (`#offisielle-renter`), boliglånkalkulatoren (`#sjekk`), banksøk (`#banker`) og alle ni guideartiklene (`#guider`). Trykk på en artikkel for å lese den i et utvidbart panel på samme side. `single-page.js` åpner riktig artikkel ved direkte lenke med fragment. Ingen av de viktigste knapper eller menylenker navigerer til `sparing.html` eller `guider.html`.

**Bakoverkompatibilitet:** De gamle HTML-filene `sparing.html` og `guider.html` beholdes midlertidig for besøkende med lagrede lenker. De eksponeres ikke i hovednavigasjonen og ligger ikke lenger i den primære XML-sitemapen. For nye besøkende er det bare hovedadressen som trengs.

**Verifisering:** `tests/portal.spec.cjs` tester navigasjon uten sidelasting, rentesammenligning, guidepaneler og bredde på mobil/PC. Produksjonssjekken kontrollerer at alle seksjoner, scripts og kildeopplysninger er levert på den faktiske hovedsiden. Den opprinnelige boliglånkalkulatoren og API-et bevares.

## Egen visning for hver tjeneste (oppdatering 23. oktober 2026)

Viktig presisering av tidligere «én nettside»: **Dette er én app på ett domene, men ikke én sammenhengende lang side.** Appen viser nøyaktig én av fem hovedvisninger om gangen: Forside, Boliglån, Sparing, Bankoversikt og Guider/artikler. Funksjonaliteten bevares i DOM-en, men de inaktive visningene er skjult og utilgjengelige for tastatur/skjermleser.

single-page.js ruter hash-adresser til riktig visning, åpner dyplenker til guideartikler, synkroniserer hovedmeny/mobilmeny og støtter Tilbake/Frem. Utfylte kalkulatorverdier beholdes ved navigasjon. Banksøket er flyttet ut av boliglånsvisningen og har egen bankkatalog. Velg «Sammenlign bank» eller «Legg til bank» for å navigere mellom bankoversikt og boliglånstilbud.

Produksjons- og Playwright-testene er endret for å kontrollere at kun aktiv visning er synlig, at ulike skjermstørrelser fungerer, og at banksammenligninger fortsatt oppdaterer resultatene. Den opprinnelige datakildebegrensningen for renter gjelder fortsatt: egne kontoeksempler er et datert utvalg, ikke sanntidsdata.

## Økonomiverktøy med separate faner og egne grafer (23.10.2026)

Lånesjekk har nå åtte separate app-visninger: Forside, Boliglån, Sparing, Bankoversikt, Guider, Budsjett, Billån/Forbrukslån og Akademi. Forbrukslån har en egen fane i finansieringsvisningen og kan åpnes direkte via #forbrukslan. Vi bruker egen HTML, CSS og JavaScript uten en ferdigkjøpt bankdesignmal.

### Budsjett
- Redigerbart regneark med inntekt, utgift, kategori, beskrivelse, bank/konto, beløp og periode (uke, måned, kvartal, år). Omregnes til en månedlig basis.
- Egne grafer: en ringgraf over kategorier, horisontale bankfordelingsgrafer og 12-måneders akkumulert overskudd. Alle grafer beregnes fra brukerens utfylte rader.
- Oppstartsdata er et MERKET EKSEMPEL (fiktive beløp). Poster kan legges til/fjernes. Bankfelt kan søkes mot banknavn fra vår kildebelagte, statiske katalog og kan også fylles fritt.
- «Lagre lokalt» lagrer budsjettet i brukerens egen nettleser (localStorage), og ingenting sendes til vår server. Funksjonen er frivillig; brukeren kan slette den. Vær oppmerksom på at andre brukere av samme nettleser kan få tilgang til lagrede tall.
- CSV-eksport med semikolon og UTF-8 BOM er egnet for Excel i Norge. Ikke et ekte XLSX-dokument, ingen oppkobling til banktransaksjoner. Regnearket lar brukeren gjøre sine egne budsjettkontroller.
- Tips er matematiske, ikke individualisert rådgivning. Kategoriandeler, 10 % reduksjon av største utgiftsgruppe og 20 % reduksjon av abonnement bygger på inntastede tall. SIFO er generell referanse; husk å supplere med bolig, strøm og individuelle forhold: https://www.oslomet.no/no/om/sifo/referansebudsjettet

### Billån og forbrukslån
- Beregningsmotoren er egen `finance-tools.js`, testet i `tests/finance.spec.cjs`.
- Billån: kjøpesum, egenkapital, rente, løpetid, etableringsgebyr, termingebyr, restverdi/ballong og driftsutgifter. Forbrukslån: lånebeløp, rente, løpetid og gebyrer. Begge har egne skjema-tilstander.
- Regner annuitet med månedlig rente nominell/12, løser effektiv årsrente med biseksjon av netto låneutbetaling og fremtidige terminer, og illustrerer terminbeløp, samlet rente/gebyr, restgjeld og en hypotetisk reduksjon på 0,5 prosentpoeng i nominell rente.
- Grafer over fordeling av hovedstol, rente og gebyr og årlig restgjeld. Regnestykket forutsetter uendret rente, ingen ekstra nedbetaling og gebyrer som oppgitt. Effektiv rente kan avvike fra bankens offisielle beregning; den er ikke en bindende sats og er ikke hentet live.

### Lånesjekk Akademi
- Fire egenutviklede quizspørsmål med umiddelbar forklaring, progresjon og kildelenker. Egen visning og korte lenker til kunnskapsguidene.

### UI og regresjon
- Den tidligere toppseksjonens overflyt og lyse tekst på lys knapp er rettet gjennom `finance-style.css`, med egne målrettede mobilstilregler.
- CI kjører eksisterende testpakke pluss `finance.spec.cjs` og Playwright `finance-ui.spec.cjs` på desktop Chromium, nettbrett Chromium, iPhone WebKit og Android Chromium. Produksjonssmoke bekrefter riktige filer og visninger.
- Den originale Finansportalen-iframe kan brukes i henhold til deres kildevilkår, men ingen sanntidsrådata fra den eller fra bankene kopieres til vår egen beregningsmotor uten tillatelse: https://www.forbrukerradet.no/finansportalen/bank/bruk-av-vare-data/

## Oppdatering 23. oktober 2026: Budsjett, fond og PDF

**Budsjett PC/mobil:** Én navigasjon. Synlige knapper for inntekt, utgift, eksempel, CSV, utskrift/PDF. Månedsresultat og kategorigrafer oppdateres mens man skriver. Bank/konto per post er fjernet fra synlig skjema, CSV og ny lokal lagring. Gamle bankverdier nulles ved lasting. Avanserte lønns- og rad-summeringsverktøy er sammenklappbare.

**Profesjonell A4-rapport:** Skriv ut / Lagre PDF bygger en separat rapport med Lånesjekk-logo, dato, inntekter, utgifter, nøkkeltall og utgiftsfordeling. Den sendes direkte til nettleserens utskriftsdialog, hvor brukeren velger Lagre som PDF. Dette er ikke en automatisk nedlastet PDF. Ingen ekstern konvertering eller opplasting av budsjettall.

**Fond og aksjer:** Fire interaktive læringsverktøy med fondsgebyrer, drawdown/gjenhenting, aksje-/rentefordeling og spareplan mot mål. Åtte kildebaserte forklaringer (globale indeksfond, aktiv/passiv, enkeltaksjer, renter, ASK, IPS, usikkerhet og prissammenligning). Eksemplene er hypotetiske og viser ikke kurser eller personlige anbefalinger.

**Kvalitetsstatus:** Javascript-syntaks, alle HTML-referanser og deterministiske matematikktester er kontrollert. Automatiske Playwright-tester for desktop, mobil og Chromium-PDF-eksport finnes i tests/daily-studio.spec.cjs; full vellykket nettleserkjøring er ikke bekreftet her. Produksjonspublisering via Vercel/ GitHub-integrasjon: READY.

**Admin:** En egen sikker CMS-innlogging for tema/logo/layout er ikke ferdig. Ingen offentlig admin-redigering skal tilbys uten rollebasert autentisering og endringslogg.

Kilder: https://www.forbrukerradet.no/sparing-i-fond-og-spareprofiler/ · https://www.forbrukerradet.no/siste-nytt/na-kan-du-sjekke-om-du-betaler-for-mye-for-fondet-ditt/ · https://www.skatteetaten.no/person/skatt/hjelp-til-rett-skatt/aksjar-og-verdipapir/om/aksjesparekonto-ask/ · https://www.oslomet.no/om/sifo/referansebudsjettet