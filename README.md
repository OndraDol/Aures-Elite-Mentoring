# Aures Elite Mentoring

SPFx aplikace pro propojovani talentu Aures Holdings s top managementem (mentory) s concierge fall-through workflow a synchronnim HTML mockupem.

## Stack

| Vrstva | Technologie |
|---|---|
| Platform | SharePoint Online, SPFx 1.18.2 |
| Runtime | Node.js v18 LTS |
| Framework | React 17.0.1, TypeScript 4.5.x |
| Data | @pnp/sp v4 |
| Styling | Dart Sass + Fluent UI |

## Pozadavky

- Node.js v18 LTS
- npm 9+

## Instalace

```bash
npm install
```

## Prikazy

```bash
# Lokalni preview (SPFx)
npx gulp serve

# Debug build
npx gulp build

# Production bundle
npx gulp bundle --ship

# Production package
npx gulp package-solution --ship

# Fix HTTPS certifikatu
npx gulp trust-dev-cert
```

## Fotky a assety

- HTML mockup pouziva pouze assety v `assets/mockup/`.
- SPFx cast pouziva pouze bundled mentor assety v `src/webparts/auresApp/assets/mentors/`.
- Root `pic/` uz neni runtime zavislost pro mockup ani pro SPFx.
- SPFx resolver bere `PhotoUrl` ze SharePointu jako prioritu; kdyz chybi, pouzije bundled fallback podle mentora.
- Focal point pro kruhove avatary je drzen interne v UI vrstve, bez zmeny SharePoint schema.

## Mockup

- Staticky mockup pro GitHub Pages je v root `index.html`.
- `mockup.html` zustava jako redirect na `index.html`.
- Mockup podporuje deep-link QA pres query parametry:
  - `?role=talent&tab=newrequest&mentor=9`
  - `?role=hr&tab=mentees`

## Nasazeni

1. Spustit `npx gulp bundle --ship`.
2. Spustit `npx gulp package-solution --ship`.
3. Soubor `sharepoint/solution/aures-elite-mentoring.sppkg` predat SharePoint tymu.

## Email notifikace

- System posila emaily pouze na HR admin skupinu nastavovanou ve webpart property `hrEmail`.
- Pri vytvoreni nove zadosti jde notifikace na HR.
- Pri schvaleni zadosti mentorem jde notifikace znovu na HR.
- Pri eskalaci do `HR_Review` jde notifikace na HR.

## Stav projektu

Viz `PROGRESS.md`.
