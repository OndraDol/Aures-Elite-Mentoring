# Aures Elite Mentoring

Exkluzivni SPFx aplikace pro propojovani talentu Aures Holdings s top managementem (mentory). System "Concierge" — plne automatizovany fall-through workflow.

## Stack

| Vrstva | Technologie |
|---|---|
| Platform | SharePoint Online, SPFx 1.18.2 |
| Runtime | Node.js v18.20.0 |
| Framework | React 17.0.1, TypeScript 4.5.5 |
| Data | @pnp/sp v4 |
| Styling | Dart Sass + Fluent UI (Navy/Gold premium theme) |

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

## Email notifikace

- System posila emaily pouze na HR admin skupinu nastavovanou ve webpart property `hrEmail`.
- Pri vytvoreni nove zadosti jde notifikace na HR, ne mentorovi.
- Pri schvaleni zadosti mentorem jde notifikace znovu na HR.
- Pri eskalaci do `HR_Review` jde notifikace na HR.
- Mentorum ani mentees nejde ze systemu zadna prima emailova komunikace.

## GitHub Pages / Mockup

- Staticky mockup pro GitHub Pages je v root `index.html`.
- `mockup.html` zustava jako redirect na `index.html` kvuli starym odkazum.
- Mockup nyni obsahuje i HR zalozku `Mentees dashboard`, aby odpovidal implementaci ve SPFx aplikaci.

## Stav projektu

Viz [PROGRESS.md](PROGRESS.md)

| Phase | Popis | Status |
|-------|-------|--------|
| 0 | Scaffold, build, @pnp/sp inicializace | ✅ Hotovo |
| 1 | Interfaces, services (Mentoring, Notification, Role), mock data | ✅ Hotovo |
| 2 | Routing, AppShell, AccessDenied, role detection | ✅ Hotovo |
| 3 | Talent View — MentorCatalog, RequestForm, MyRequests | ✅ Hotovo |
| 4 | Mentor Dashboard — PendingRequests, RequestDetail, RequestHistory | ✅ Hotovo |
| 5 | HR Admin Panel | ✅ Hotovo |
| 6 | Email notifikace | ✅ Hotovo |
| 7 | Polish, lokalizace, production build (7.1–7.3 hotovo) | 🟡 In Progress |
| 8 | UX Redesign — Mentor CRUD, dynamicke taby, HR admin powers | ✅ Hotovo |
| 9 | Kritické opravy logiky — fall-through, bezpečnost rozhodování, HR identifikace mentora, spam blokace | ✅ Hotovo |

**Blocker:** SharePoint listy (Mentors, Talents, MentoringRequests) musi vytvorit IT (L2) rucne dle specifikace v Project_overview.md sekce 3. Seznam Mentors novy sloupec: `PhotoUrl` (URL/Hyperlink).
