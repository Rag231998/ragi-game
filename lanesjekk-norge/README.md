# Lånesjekk Norge

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
