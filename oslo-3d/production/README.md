# Oslo Atlas – deployment og drift

Dette er et **produksjonsoppsett som ennå ikke er publisert**, ikke en påstand om en ferdig tjeneste for 100 000 besøkende. Nettsiden og API-et skal distribueres sammen fra én Cloudflare Worker slik at forespørsler går til `/api/*` på samme opphav.

## Oppsett

1. Opprett en Cloudflare-konto og et domene du selv eier (f.eks. `osloatlas.no`). Opphav til URL-er må kontrolleres før de deles.
2. Klon `Rag231998/ragi-game` og åpne `oslo-3d/production`.
3. Installer Node.js 22+ og kjør `npx wrangler login`.
4. Kjør `npx wrangler dev` lokalt. Nettsiden og `/api/health` skal svare.
5. Kjør `npx wrangler deploy` når Worker-kontoen er klar. Prosjektet får en `*.workers.dev`-adresse.
6. I Cloudflare Dashboard → Workers & Pages → Oslo Atlas → Settings → Domains & Routes → Add Custom Domain: velg f.eks. `kart.osloatlas.no`, men først etter at du har kjøpt/registrert domenet.
7. Test kilder, personvern, ytelse, lisens og aldersgrense på API-data før offentlig lansering. Sett budsjettvarsel og overvåk kvoter.

## Endepunkter

- `GET /api/health` – API-helse.
- `GET /api/stops?q=Grorud` – stoppestedsøk med Entur, cache 65s.
- `GET /api/departures?id=NSR:StopPlace:...` – avgangstavler, cache 18s.
- `GET /api/vehicles` – kjøretøyposisjoner fra Entur i Oslo/Romerike, cache 17s.
- `POST /api/predicted` – begrenset samlespørring etter estimerte avganger, cache 32s.
- `GET /api/speed?lat=59.93&lon=10.80` – fartsgrensekandidater fra NVDB 105 i et lite kartutsnitt. Svar med `kmh:null` betyr ukjent – aldri gjett.
- `GET /api/camera?id=furuset|hjortnes` – cachede offentlige stillbilder, dersom leverandøren tillater innlasting.
- `POST /api/presence` og `GET /api/presence` – omtrentlig samtidige aktive faner, definert som heartbeat de siste 95 sekundene. DO per shard og ingen IP-/personinformasjon lagres.

## Forutsetninger og driftsrisiko

- Bruk `ET-Client-Name` identifisert for din organisasjon, og avtal API-kvoter ved storskala bruk. Oppgitt generisk navn er kun en plassholder.
- En statisk GitHack-/GitHub-preview er **ikke** full funksjonalitet: API-rutene eksisterer først når Cloudflare Worker er deployert. Online-telleren og NVDB-integrasjonen krever backend.
- Veitrafikk fra `motion.js` er modellert. Rutetidsinterpolering er et første steg mellom kjente stopp og **ikke** en verifisert sporgeometri. Ikke bruk til reise-/sikkerhetsbeslutninger.
- Arbeid gjenstår for komplett NSR-katalog, sporadferd, NVDB retningsbestemt felt/veglenker, flest mulig kameraer, rutehendelser, frontend-redusering av marker-antall ved høy last, og driftstester.
- 100 000 månedlige besøk er ikke det samme som 100 000 samtidige brukere. Vi har ikke belastningstestet denne installasjonen eller avtalt kapasitet.
- Kamerabilder er stillbilder der API leverer dette. Ingen påstand om direktevideo.
- Bruk kun kilder og lisenser du har lov til å benytte. © OpenStreetMap-bidragsytere (ODbL), NVDB og Entur (NLOD), øvrige data etter egne vilkår.

## Kvalitetssikring før lansering

- Bruk Playwright i ekte nettleser med aktivt nettverk: 3D-grafikk, Grorud T, Lillestrøm, Eidsvoll og Jesheim, fartsgrensesøk og kameraer.
- Kontroller `/api/health`, `/api/stops`, `/api/departures`, `/api/vehicles`, `/api/speed`, `/api/camera`, `/api/presence` mot gyldige svar.
- Håndter 429, HTTP 5xx, tomme svar, CORS, timeout og utdatert data med tydelig feilmelding.
- Belastningstest med trinnvis 100, 1000, 5000 samtidige sesjoner; deretter plan for målvolum, beskyttelse og kostnad.
- Sjekk WCAG (kontrast, tastatur, mobil), personvern, sikkerhetshoder og feilfrie løp i nettleser.
