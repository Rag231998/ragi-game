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
JSON body: {"principal":3000000,"propertyValue":4500000,"years":25,"current":{"rate":5.50,"monthlyFee":65},"offers":[{"name":"Banktilbud","rate":5.0,"monthlyFee":65,"startupFee":5000}]}

API-et svarer med resultat for dagens lån og alternativer; det henter ingen bankpriser og lagrer ingen lånedata i applikasjonen. Den vanlige nettsiden regner lokalt og kaller ikke API-et. Ved direkte API-bruk sendes opplysningene til serveren for beregning.

## Regnemetode og begrensninger
Annuitet, 12 betalinger i året og nominell rente delt på 12. Renten antas uendret. Månedlige gebyrer og engangskostnader legges til, uten å finansiere engangskostnaden. Ikke beregnet skatteeffekt, individuell kredittvurdering eller regulatorisk effektiv rente. Resultatene er regneeksempler, ikke banktilbud.

Ved overgang fra kalkulator til personlig finansrådgivning, lånesøknad eller finansagentaktivitet må kravene i låneformidlingsloven undersøkes. Se https://www.finanstilsynet.no/tema/laneformidling/

## Kontroll
Statisk Javascript-syntaks, UI-referanser, annuitetsmatematikk (inkludert nullrente, renter og gebyrer) samt gyldige/ugyldige API-data er kontrollert. Interaktiv e2e-test i ekte nettleser og faktisk produksjonsdeploy av API-et gjenstår.

## Publisering
Opprett et eget Vercel-prosjekt, legg index.html, app.js og api/calculate.js i prosjektroten; framework None. Deploy må utføres når Vercel-tilgangen til brukerens team er godkjent. En statisk HTML-forhåndsvisning kan ikke kjøre serverless API-endepunktet.