# Aures Elite Mentoring

SPFx aplikace pro propojovani talentu Aures Holdings s mentory a HR workflow nad SharePoint Online.

## Source of Truth

- Zdrojovy kod je v rootu repozitare.
- Slozka `pro honzu/` je generovany export pro review/predani (viz `Create-ProHonzu.ps1`), neni to druhy aktivni projekt.

## Hlavni workflow

1. Talent poda zadost a zvoli 1-3 mentory.
2. Zadost jde nejdriv na Mentora 1.
3. Pri odmitnuti se posouva na dalsiho mentora.
4. Pokud odmitnou vsichni, zadost prejde do `HR_Review`.
5. Pri schvaleni jde pripad k HR k domluveni mentoringu.

## Tech stack

| Vrstva | Technologie |
|---|---|
| Platform | SharePoint Online, SPFx 1.22.2 |
| Build | Heft + ejected Webpack |
| Runtime pro build | Node.js 22.14+ |
| Framework | React 17.0.1, TypeScript 5.8.x |
| Data | `@pnp/sp` v4 |
| Styling | Sass |

## Pozadavky

- Node.js `>=22.14.0 <23`
- npm 10+

## Prikazy

```bash
npm install          # Instalace zavislosti
npm run start        # Lokalni vyvoj
npm test             # Jest testy pres Heft
npm test -- --test-path-pattern packageSolution.test   # Regresni kontrola package manifestu
npm run build        # Production build
npm run package      # Production .sppkg pres Heft package-solution
npm run clean        # Cleanup
npm audit            # Kontrola zranitelnosti
```

## Build artefakty

Hlavni vystup pro nasazeni:

- `sharepoint/solution/aures-elite-mentoring.sppkg`

## Poznamka k nasazeni

- Deployment balik se vytvari pres Heft workflow `npm run package`, ne pres legacy gulp prikazy.
- V `config/package-solution.json` musi byt `solution.id` unikatni a nesmi se shodovat s zadnym `features[*].id`.
- Regresni kontrola teto podminky je pokryta testem `src/config/packageSolution.test.js`.

## Poznamka k buildu

Repo je po migraci v ejected modu — `config/heft.json`, `webpack.config.js`, `webpack.dev.config.js` jsou soucasti projektu. To je zamerne pro plnou kontrolu nad buildem pod SPFx 1.22.x a Node 22.

## Lokalizace

SPFx webpart lokalizace je v `src/webparts/auresApp/loc/en-us.resjson`.

## Mockup

- Staticky mockup pro GitHub Pages je v `index.html`.
- SPFx assety v `src/webparts/auresApp/assets/`.

## Otevrene body

- Otestovat aplikaci na SharePoint Online workbench / tenantovi
- Nahrat `.sppkg` do App Catalogu
- Vytvorit a naplnit SharePoint listy `Mentors`, `Talents`, `MentoringRequests`

## Changelog

### 2026-03-24

- Opraven konflikt GUID mezi `solution.id` a `features[0].id` v `config/package-solution.json`
- Pridan regresni test `src/config/packageSolution.test.js` pro kontrolu unikatnich GUID v package manifestu
- Potvrzen Heft packaging workflow pro deployment (`npm run package`)

### 2026-03-20

- Odstraneni nebezpecnych mock data fallbacku ze vsech komponent
- Pridani sdileneho ErrorBanner komponentu pro zobrazeni chyb
- Doplneni metadata a features do `config/package-solution.json`
- Aktualizace initialPage v `webpack.dev.config.js`

### 2026-03-18

- Migrace toolchainu na SPFx 1.22.2 + Heft + ejected Webpack
- Migrace build runtime na Node.js 22.x
- Srovnani dependency stromu, 0 vulnerabilities
- Bundling assetů mentoru a talentu do .sppkg
