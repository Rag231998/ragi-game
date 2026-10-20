# PrisKart Norge – landsdekkende sammenligning og brukerpriser

Prosjektet er **uavhengig av Oslo Atlas** og koden ligger i `priskart-norge/`.
`site/` er et mobiltilpasset MapLibre-kart, `production/worker.js` er Cloudflare Worker med D1-skrivefunksjon.

## Hva fungerer i en ren HTML-forhåndsvisning?

- Landsdekkende bensinstasjonsoversikt hentet i nettleseren fra `https://drivstoffpriser.github.io/Drivstoffpriser-App/data/stations.json` (rundt 1 885 oppføringer i eksporten datert 2026-08-09; eksakt antall i neste eksport kan variere).
- Innmeldte historiske bensin-/dieselpriser fra `prices.json`, *med faktiske tidsstempler*.
- Filtre for produkt, kategori, ferskhet, pris og sortering. Stedssnarveier, inkludert Tromsø, og søk etter stasjonsnavn/by.
- Ladestasjonspunkter for innzoomede områder fra OpenStreetMap/Overpass, forutsatt at den gratis tjenesten svarer. **Dette er ikke komplett dekning av alle ladestasjoner i Norge.**
- Stasjonsdetaljer, Google Maps-veibeskrivelse og prisrapportskjema.
- **Prisrapportskjemaet kan ikke publisere for andre i statisk forhåndsvisning.** Skjemaet forteller dette eksplisitt.

## Virkelig deling av priser (for eksempel fra Tromsø)

`production/worker.js` implementerer:
- `GET /api/fuel/stations` og `/api/fuel/prices` – servercachet åpen eksport.
- `GET /api/chargers?bbox=s,w,n,e` – cachet OpenStreetMap-ladestasjoner i små geografiske utsnitt.
- `GET /api/reports?bbox=w,s,e,n` – publiserte prisrapporter i området.
- `GET /api/config` – om prispublisering og Turnstile er aktivert.
- `POST /api/report` – aksepterer en kontrollert stasjon, pris og sikkerhetstoken, beskytter med Turnstile og IP-basert HMAC-kvotebøtte som roterer hver time, og lagrer rapport i D1.

Innmeldte priser vises som **brukerrapporter, ikke automatisk verifiserte eller garanterte sanntidspriser**. Produksjon bør ha moderatorfunksjon, flagging, svindeldeteksjon, bedre pris-/stasjonsverifisering og personvernerklæring før markedsføring.

## Publisering – krever din handling på Cloudflare-kontoen

1. Koble GitHub-prosjektet til et eget Cloudflare-oppsett, eller klon repoet lokalt.
2. Installer Node.js LTS og kjør `npx wrangler login`.
3. Opprett Cloudflare D1: `npx wrangler d1 create priskart-norge`.
4. Kopier Cloudflare-generert database_id inn i `production/wrangler.toml` (erstatt `REPLACE_WITH_REAL_CLOUDFLARE_D1_ID`).
5. Fra `priskart-norge/production`: kjør `npx wrangler d1 execute priskart-norge --file=./schema.sql --remote`.
6. Lag Turnstile-widget for det faktiske domenet i Cloudflare Dashboard, og sett sitekey i `[vars] TURNSTILE_SITE_KEY="..."` i wrangler.toml.
7. Sett hemmelige nøkler med `npx wrangler secret put TURNSTILE_SECRET` og `npx wrangler secret put RATE_SECRET`.
8. Kjør `npx wrangler dev` lokalt og deretter `npx wrangler deploy`.
9. Kontroller `/api/config` viser `reportingEnabled: true`, og test Tromsø-innmelding fra to forskjellige nettlesere.
10. Knytt til et eget domene (f.eks. `priskart.no` hvis det er ledig og registrert av deg). Sett opp WAF/ratelimit, logger uten unødvendig personinfo, backups og moderering.

**Avhengigheter:** CDN laster MapLibre GL JS, MapLibre-kartet laster OpenFreeMap. Cloudflare Worker krever D1, og nettlesere trenger nettverkstilgang. Static preview på GitHack er ingen produksjonsplattform.

## Data, begrensninger og opphavsrett

- Drivstoffpriser Open Data: https://drivstoffpriser.github.io/Drivstoffpriser-App/data/index.html ; historiske brukerdata kan være utdaterte og eksporten kan være forsinket.
- Kart og bensinstasjoner bygger på © OpenStreetMap-bidragsytere under ODbL.
- Offentlig ladeoversikt: NOBIL av Enova (CC BY 4.0), https://info.nobil.no/om, krever egen API-nøkkel. Dagens prototype bruker ikke NOBIL API og kan ikke kalles komplett.
- Live ladepunktstatus: Enova NOBIL Real-time krever API-produktabonnement og WebSocket-tilkobling. Ikke integrert.
- Offisielle drivstoffpriser for alle bensinstasjoner i sanntid er **ikke tilgjengelige som en gratis komplett offentlig strøm** her. Vi viser tidspunkter og aldersmerking.
- Uautoriserte prisskrapere eller kopi av konkurrenters proprietære tjeneste inngår ikke.
- For 100 000 brukere trengs særskilt belastningstest, skikkelig stasjonsindeks, offisielle NOBIL-data med korrekt lisens, caching, kamp mot falske priser og budsjett for Cloudflare.

## Testplan

- Statisk JS-syntaks, gyldig Cloudflare Worker-konfigurasjon og D1 migrasjon.
- Hent kildenes datasett og les `exportedAt`, `count` og de virkelige prisdatoene (ingen dummy-priser).
- Søk Oslo og Tromsø; filtrer Diesel, Bensin 95, «bare ferske».
- Velg en stasjon, åpne navigasjon og rapporteringsskjema.
- Test sårbare API-parametere, fremmede koordinater, ugyldige drivstofftyper, falsk Turnstile, rate-limit og duplikater.
- Bekreft prisinnmelding fra Tromsø vises på annen enhet innen cache 25 sekunder.
- Kjør nettleser- og mobiltester (Chrome, Safari, Firefox), samt realistiske lasttester før større lansering.

Ingen av disse er automatisk gjennomført bare ved at koden er lagret på GitHub.
