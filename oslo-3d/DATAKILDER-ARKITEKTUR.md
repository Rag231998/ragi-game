# Oslo Atlas – datakilder, arkitektur og kvalitetskrav

Sist vurdert: 20. oktober 2026. Dekning: Oslo og Romerike, inkludert Gardermoen, Jessheim, Kløfta, Lillestrøm og Eidsvoll.

**Omfang:** En selvstendig 3D-tjeneste basert på lovlig gjenbruk av åpne data. Ikke en kopi av Miniatyr-Norges proprietære kode, metoder, grafikk eller varemerker. **Fly er uttrykkelig utelatt**, selv om fly inngikk i den sammenlignede nettsidens datakilder.

## Status i eksisterende prototype

- `index.html` – kart, tredelt grensesnitt (Avganger/Bevegelse/Kamera), MapLibre og 3D-lag.
- `v2.js` – Entur-søk, avgangstavler, GPS-sporing der kilde rapporterer posisjon, kameraoversikt.
- `motion.js` – modellerte biler langs vegsegmenter fra et OSM-basert vektorkart, samt anslåtte kjøretøy mellom utvalgte stopp fra Entur-avgangstider.
- Disse er **kodeintegrasjoner, ikke nettleser-/driftstestede funksjoner**. Ingen påstand om at alle API-kall, korrekt posisjonering, oppdateringsintervaller eller kameravisninger er verifisert.
- Terreng i dagens prototype bruker et globalt raster-Dem fra AWS/Mapzen; det er **ikke Kartverkets laserbaserte 2 m terreng**.
- Biltrafikken er **simulert, ikke målt**. Beregnet kollektivtransport bruker foreløpig rett linje mellom noen stopp, **ikke korrekt skinne-/veggeometri**. Disse må prioriteres før offentlig lansering.
- Nettsiden er statisk, uten egen backend, datacache, beskyttelse mot begrensning av API-kall eller pålitelig overvåking.

## Datakildekatalog og prioritering

| Prioritet | Datalag | Kilde / dokumentasjon | Tilgang og nødvendig arbeid |
|---|---|---|---|
| P0 | Norske høyder og terreng (DTM/DOM/laser) | [Kartverket høydedata](https://www.kartverket.no/en/api-and-data/terrengdata) | CC BY 4.0 for frie data. Hent prosjektbaserte GeoTIFF-data, kontroller oppløsning/dekning og bygg egne terrengfliser. Ikke alle detaljerte datasett er offentlig frie. |
| P0 | Vegnett, fartsgrenser, bruer, tunneler | [NVDB API Les V4](https://nvdb-docs.atlas.vegvesen.no/category/nvdb-api-les-v4/) | Mye åpent uten autentisering. Forbehandle geometri til lokale kartfliser; sammenstill med OSM for fullstendige boligveger. NVDB er *ikke* en live-GPS-strøm av privatbiler. |
| P0 | Geometri for bygninger, arealbruk og skinner | [OpenStreetMap](https://www.openstreetmap.org/copyright) | ODbL, krediter og vurder databaselisensen ved sammenslåtte/avledede databaser. Kvalitet varierer lokalt. |
| P0 | StopPlace, Quay og søk | [Entur åpne API-er](https://developer.entur.no/apis/open) | Bruk NSR Stop Place Register til full stoppestedsdekning, og Geocoder til søk; ikke gjett ID-er fra stedsnavn. |
| P0 | Avganger, linjer, kjøretøyturer og prognoser | [Entur Journey Planner](https://developer.entur.no/docs/open-services/journey-planner) | GraphQL. Krever ET-Client-Name. Knytt sammen stop, quay, serviceJourney, linje og dato. Skill rutetid fra sanntidsprognose. |
| P0 | Faktiske posisjoner for rapporterende kjøretøy | [Entur Vehicle Positions](https://developer.entur.no/apis/graphql/vehicle-positions) | HTTP GraphQL / WebSocket. Verifiser hvilke operatører og transportmidler som faktisk leverer data, oppdateringsalder og geometri. |
| P0 | Korrekt animasjon langs veg og skinnegang | OSM / NVDB + Entur rutegeometri/NeTEx + [Valhalla](https://github.com/valhalla/valhalla) | Match observert/rutetidsberegnet posisjon til en verifisert trasé; ikke tegn rett linje mellom stasjoner. Valhalla er rutemotor, ikke GPS-leverandør. |
| P1 | Vegtrafikkmengde og stedsbestemt veginfo | Statens vegvesen [dataportal](https://dataut.vegvesen.no/) | Må skille tellepunkter/historiske volum fra beregnet/simulert trafikk. Dokumenter datakvalitet og perioder. |
| P1 | Trafikkhendelser, vegvær, webcam | [DATEX II](https://dataut.vegvesen.no/dataservice/datex) | NLOD; for enkelte datasett må tilgang bestilles. Normaliser hendelsesgeometri, utsnitt og utløsende status. Kamerabilder kan være stillbilder og kan blokkere iframe/CORS. |
| P1 | Vær | [MET Locationforecast](https://api.met.no/weatherapi/locationforecast/2.0/documentation) | Krever korrekt klientidentifikasjon og respekt for caching. Best via server/proxy, ikke gjentatte nettleserkall per bruker. |
| P1 | Historisk/aktuell trafikkflyt | [HERE Traffic API](https://docs.here.com/traffic-api/docs/send-request-readme) | Krever API-nøkkel, kvote og vilkår; ikke likestill med NLOD. Sjekk kostnad og visningsrettigheter før implementering. |
| P1 | Kartadresser og stedsnavn | [Kartverket API/data](https://www.kartverket.no/api-og-data) | CC BY 4.0 der datasettet er fritt. Søkekatalog og koordinatsystem må tilpasses. |
| P2 | Kyst og sjøbunn | [EMODnet Bathymetry](https://emodnet.ec.europa.eu/en/bathymetry) | Digital sjøbunnsmodell gjennom OGC-nedlasting; trenger særskilt terreng-/dybderendering. Bekreft spesifikk datasetlisens. |
| P2 | Delemobilitet (Voi/Bolt/Ryde/bysykkel etc.) | [Entur Mobility](https://developer.entur.no/apis/open) | Dynamisk tilgjengelighet, soner og operatørdekning; ikke forutsett at alle navngitte selskaper er tilstede eller viser eksakt enhetsposisjon. |
| P2 | Befolkning, arbeidsplasser, pendling | [SSB PxWebApi v2](https://www.ssb.no/api/pxwebapiv2) | CC BY 4.0, normalt statistikk per geografisk område – ikke individdata. Kombiner med Kartverkets kommunegrenser. |
| P2 | Flom, jord-/snøskred, energi og kraftanlegg | [NVE karttjenester](https://www.nve.no/karttjenester/) | NLOD for karttjenester; temalag med riktig legend og tids-/fareinformasjon. Ikke kall det full sikkerhetsvurdering. |
| P2 | Luftkvalitet | [Miljødirektoratets måle-API](https://api-luftmalinger.miljodirektoratet.no/) | NLOD; skill målepunkter fra beregnet luftkvalitetsflate. |
| P2 | Vegstøy | Statens vegvesen / Geonorge | Tematiske kartdata. Finn/valider eksakt datasett, oppløsning og vilkår før implementering. |
| P3 | Kraftflyt | Statnett | Sjekk aktuell datatjeneste og vilkår før utvikling; ingen verifisert offentlig sanntids-strøm integrert her. |
| P3 | Strømproduksjon og priser | [ENTSO-E Transparency](https://transparency.entsoe.eu/) | API/registrering og tilhørende vilkår må undersøkes; koble til prisområder, ikke oppfattes som målerstand per bygning. |
| P3 | Heiser, gondoler, ladere, bensinstasjoner | OpenStreetMap | ODbL. Statiske POI-data; kontroller alder og fullstendighet. |
| P3 | LEGO-estetikk fra LDraw | [LDraw Parts Library](https://www.ldraw.org/docs-main/licenses/legal-info.html) | Valgfritt. Enkeltdeler har blandet lisenshistorikk, herunder CC BY 2.0/4.0. Ingen LEGO-tilknytning må antydes. |
| Utelatt | Fly/ADS-B/Avinor | – | Brukeren har eksplisitt bedt om å fjerne fly fra Oslo Atlas. |

## Viktig: 4 ulike sannhetsnivåer

1. **GPS**: rapportert punkt + tidspunkt + kilde/operatør. Vis ferskhetsstatus; fjern/ton ned utdaterte objekter.
2. **Interpolert GPS**: glidende animasjon mellom de to siste rapporterte punktene. Ikke fortell at hver mellomposisjon er målt.
3. **Rutetidsberegnet**: posisjon langs kjent og kontrollert trasé, estimert fra riktig tur, retning, ankomst/avgang og avvik. Merk som beregnet.
4. **Modellert**: visuelt trafikkmønster langs eksisterende veger. Oppdiktede objekter – aldri kall dette sanntids-GPS. Et eventuelt HERE-lag kan justere en simulert flythastighet, men gjør ikke den enkelte bilen virkelig.

Skjermbildet må bruke egne symboler/legend og forklare nøyaktigheten, ikke bare ordet «LIVE».

## Foreslått produksjonsarkitektur

```
Open APIs / nedlastede GIS-data
  |
  +-- Innsamling (server: tidsstyrt, kilde-ID, rate-limit, retry, varsling)
  |      +-- Entur: avgang, posisjon, NSR, turgeometri
  |      +-- NVDB/OSM: veg-/skinnenett og vegobjekter
  |      +-- Kartverket: høyder og steder
  |      +-- MET/DATEX/NVE/SSB: valgfrie datalag
  |
  +-- Normalisering og datakvalitet
  |      +-- koordinatsystem -> WGS84/WebMercator
  |      +-- deduplisering, tidsstempler, kilde, alder, usikkerhet
  |      +-- topologisk rutenett og map matching
  |
  +-- Cache / database
  |      +-- PostgreSQL + PostGIS for veg/skinnekart og objekter
  |      +-- Redis (eller tilsvarende) for kortvarige live-snapshot
  |      +-- statiske vektortiles og terrengfliser på objektlager/CDN
  |
  +-- Eget offentlig API: /stops, /departures, /vehicles, /roads, /layers
  |      +-- WebSocket/SSE for posisjonsdeltaer, HTTPS for oppslag
  |
  +-- Frontend: MapLibre + Three.js
         +-- ett søk, ett infoskjema, progressive layers
         +-- animasjon kun med verifiserte ruter for GPS/beregnede turer
         +-- tilgjengelighet, tastatur, mobil, datakildeinfo, degradering
```

Serveren og geodatapipelinen er **ikke bygget i dagens prototype**. Lenkene til statiske filer er ikke et substitutt for en driftsplattform.

## Leveranseplan (teknisk prioritet)

### Fase 1 – fungerende transportfundament
- Les komplette StopPlace/Quay-data og linjer for Oslo og Romerike. Søket «Grorud T», «Jessheim stasjon» og «Lillestrøm» skal gi riktig ID, ikke bare navnelikhet.
- Koble Entur departures og sanntid. Bruk datakildefelter og test mot offisiell avgangstavle.
- Ta ned korrekte traséer og rutemønster for jernbane/T-bane/trikk/buss/ferge og animér kjøretøy langs dem, ikke i rette linjer.
- Flytt datahenting til én backend for alle brukere. Legg inn overvåking, CORS-håndtering, fallback, kvote og caching.
- Få bevegelse jevn uten å påstå GPS når kilden bare er rutetider.

### Fase 2 – norsk 3D-infrastruktur
- Høyder fra Kartverket DTM/laser, geometri for bruer/tunneler fra NVDB, vegdetaljer og bygninger fra OSM.
- Korrekt z-høyde for objekter, tunnelportal og brodekke; ikke drapér alle kjøretøy på bakken.
- Modeller biler med vegkryss, retning og kjørefelt. Trafikktetthet er simulert inntil trafikkmålinger/HERE er kontrollert.
- Test flislasting og FPS på mobil og PC.

### Fase 3 – flere lag, bare når kilden er klar
- DATEX hendelser, kamera/vegvær og MET vær som separate valgfrie lag.
- EMODnet sjøbunn og Entur delemobilitet.
- NVE/luftkvalitet/SSB, reisetid via selvhostet Valhalla; senere kraftnett og strømpris.

## Definisjon av «kvalitetssikret»

Et lag kan først markeres `VERIFISERT` når:
- [ ] Endepunkt, svarformat, lisens, kildekreditering og tilgjengelighet er kontrollert mot dokumentasjon.
- [ ] Det finnes vellykkede nettverkskall med realistiske svar for Oslo og Romerike.
- [ ] Dataene virker i nettleser på PC og mobil uten CORS-feil og uten avhengighet av uautorisert proxy.
- [ ] Korrekte koordinater, kjøreretning, rutegeometri og stoppetider er testet mot kilden.
- [ ] Kjøretøy med manglende data blir korrekt markert, skjult eller beregnet og ikke feilmerket som GPS.
- [ ] Områdebytte, tusenvis av objekter, skjermytelse og 20+ samtidige brukere har belastningstester.
- [ ] API-feil, tomme svar, 429, 401, 403, 5xx og utdaterte data gir forståelig UI uten falske posisjoner.
- [ ] Tilgjengelighet (tastatur, mobil, kontrast, skjermleser), kildehenvisning og personvern er kontrollert.
- [ ] Publisering på egen webadresse og overvåking er utført.

## Åpne begrensninger og rettigheter

- At Miniatyr-Norge oppgir en leverandør, gir ingen rett til å kopiere deres egendefinerte metode, logo, design, datasamling eller kode.
- Offentlige data har egne vilkår; kontrollér per datasett. NLOD, CC BY 4.0, ODbL og kommersielle HERE-vilkår er ulike lisenser.
- «Realtid» er ikke garanti for korrekt/sikker posisjon. Ikke lag reise- eller sikkerhetsbeslutninger på denne siden.
- Del gjerne verdi av åpne data, men ikke legg API-nøkler i Javascript eller GitHub.
- Ikke alle leverandører leverer alle ønskede datasett på riktig oppløsning i hele regionen.
