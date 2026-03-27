# Aures Elite Mentoring

SPFx aplikace pro propojování talentů Aures Holdings s mentory a HR workflow nad SharePoint Online.

## Source of Truth

- Zdrojový kód je v rootu repozitáře.
- Složka `pro honzu/` je generovaný export pro review/předání (viz `Create-ProHonzu.ps1`), není to druhý aktivní projekt.

## Hlavní workflow

1. Talent podá žádost a zvolí 1-3 mentory.
2. Žádost jde nejdřív na Mentora 1.
3. Při odmítnutí se posouvá na dalšího mentora.
4. Pokud odmítnou všichni, žádost přejde do `HR_Review`.
5. Při schválení jde případ k HR k domluvení mentoringu.

## Tech stack

| Vrstva | Technologie |
|---|---|
| Platform | SharePoint Online, SPFx 1.22.2 |
| Build | Heft + ejected Webpack |
| Runtime pro build | Node.js 22.14+ |
| Framework | React 17.0.1, TypeScript 5.8.x |
| Data | `@pnp/sp` v4 |
| Styling | Sass |

## Požadavky

- Node.js `>=22.14.0 <23`
- npm 10+

## Příkazy

```bash
npm install          # Instalace závislostí
npm run start        # Lokální vývoj
npm test             # Jest testy přes Heft
npm test -- --test-path-pattern packageSolution.test   # Regresní kontrola package manifestu
npm run build        # Production build
npm run package      # Production .sppkg přes Heft package-solution
npm run clean        # Cleanup
npm audit            # Kontrola zranitelností
```

## Build artefakty

Hlavní výstup pro nasazení:

- `sharepoint/solution/aures-elite-mentoring.sppkg`

## Poznámka k nasazení

- Deployment balík se vytváří přes Heft workflow `npm run package`, ne přes legacy gulp příkazy.
- V `config/package-solution.json` musí být `solution.id` unikátní a nesmí se shodovat s žádným `features[*].id`.
- Regresní kontrola této podmínky je pokrytá testem `src/config/packageSolution.test.js`.

## Poznámka k buildu

Repo je po migraci v ejected módu, takže `config/heft.json`, `webpack.config.js` a `webpack.dev.config.js` jsou součástí projektu. To je záměrné pro plnou kontrolu nad buildem pod SPFx 1.22.x a Node 22.

## Lokalizace

SPFx webpart lokalizace je v `src/webparts/auresApp/loc/en-us.resjson`.

## Mockup

- Statický mockup pro GitHub Pages je v `index.html`.
- SPFx assety v `src/webparts/auresApp/assets/`.

## Provozní poznámka

- Nové mentory přidávej přímo do listu `Mentors`, ne přes HR UI.
- Mentory nemaž přes HR UI `Smazat`; pro vyřazení použij deaktivaci přes `IsActive`.

## Otevřené body

- Otestovat aplikaci na SharePoint Online workbench / tenantovi
- Nahrát `.sppkg` do App Catalogu
- Vytvořit a naplnit SharePoint listy `Mentors`, `Talents`, `MentoringRequests`

## Changelog

### 2026-03-24

- Opraven konflikt GUID mezi `solution.id` a `features[0].id` v `config/package-solution.json`
- Přidán regresní test `src/config/packageSolution.test.js` pro kontrolu unikátních GUID v package manifestu
- Potvrzen Heft packaging workflow pro deployment (`npm run package`)

### 2026-03-20

- Odstranění nebezpečných mock data fallbacků ze všech komponent
- Přidání sdíleného `ErrorBanner` komponentu pro zobrazení chyb
- Doplnění metadata a features do `config/package-solution.json`
- Aktualizace `initialPage` v `webpack.dev.config.js`

### 2026-03-18

- Migrace toolchainu na SPFx 1.22.2 + Heft + ejected Webpack
- Migrace build runtime na Node.js 22.x
- Srovnání dependency stromu, 0 vulnerabilities
- Bundling assetů mentorů a talentů do `.sppkg`
