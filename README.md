# Aures Elite Mentoring

Exkluzivni SPFx aplikace pro propojovani talentu Aures Holdings s top managementem (mentory). System "Concierge" — plne automatizovany fall-through workflow.

## Stack

| Vrstva | Technologie |
|---|---|
| Platform | SharePoint Online, SPFx 1.18.2 |
| Runtime | Node.js v18.20.0 |
| Framework | React 17.0.1, TypeScript 4.5.5 |
| Data | @pnp/sp v4 |
| Styling | Dart Sass + Fluent UI |

## Pozadavky

- Node.js **v18.20.0** (striktne — v24 nefunguje)
- npm 10+

## Instalace

```bash
npm install
```

## Prikazy

```bash
# Lokalni preview (gulp serve — vyzaduje SP Online workbench)
gulp serve

# Build pro produkci
gulp bundle --ship && gulp package-solution --ship

# Fix HTTPS certifikatu
gulp trust-dev-cert
```

## Nasazeni

1. Spustit `gulp bundle --ship && gulp package-solution --ship`
2. Soubor `sharepoint/solution/aures-elite-mentoring.sppkg` predat SHP tymu
3. SHP tym nahraje do App Catalogu

## Stav projektu

Viz [PROGRESS.md](PROGRESS.md)

**Status testování**: GitHub integration funguje ✓ (2026-03-06)
