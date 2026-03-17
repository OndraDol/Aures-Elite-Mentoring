# Aures Elite Mentoring

SPFx webpart pro mentoring workflow mezi talenty, mentory a HR v SharePoint Online.

## Aktuální stav

- SPFx stack je upgradovaný na `1.22.2`.
- Build runtime je `Node.js 22.x`.
- TypeScript compiler je `5.3.x`.
- Testovací i produkční SharePoint prostředí už existuje.
- Schválení a nasazení `.sppkg` do App Catalogu zatím čeká na IT.
- E-mailové notifikace nejsou aktivní. `NotificationService` je stub připravený pro budoucí Power Automate flow.

## Stack

| Vrstva | Technologie |
| --- | --- |
| Platforma | SharePoint Online, SPFx `1.22.2` |
| Runtime | Node.js `22.x` |
| Framework | React `17.0.1`, TypeScript `5.3.x` |
| Data | `@pnp/sp` v4 |
| Styling | Dart Sass + Fluent UI |

## Požadavky

- Node.js `22.x`
- npm `10+`

## Instalace

```bash
npm install
```

## Lokální příkazy

```bash
# Lokální SPFx debug
npx gulp serve

# Debug build
npx gulp build

# Production bundle
npx gulp bundle --ship

# Production package
npx gulp package-solution --ship

# Oba produkční kroky najednou
npm run package

# HTTPS certifikát pro localhost debug
npx gulp trust-dev-cert
```

## Co lze dělat bez schváleného `.sppkg`

Bez App Catalog deploymentu lze aplikaci testovat v SharePoint test site přes hosted workbench a debug manifesty z localhostu.

To už teď umožňuje:

- ověřit, že listy `Mentors`, `Talents`, `MentoringRequests` mají správné názvy a pole
- testovat reálné čtení a zápis do SharePoint listů
- testovat role Talent / Mentor / HR na reálných účtech
- testovat celý workflow žádosti v UI nad reálnými daty
- ověřit vzhled aplikace téměř stejně, jak ji uvidí uživatelé po nasazení

Bez schváleného `.sppkg` naopak zatím nelze:

- přidat webpart jako standardní komponentu na běžnou SharePoint stránku
- otestovat finální distribuci přes App Catalog
- pustit aplikaci normálním uživatelům bez debug režimu

## Jak testovat v SharePoint test prostředí

1. V repu spusť `nvm use 22.22.1` nebo jinou Node `22.x`.
2. Spusť `npm install`.
3. Poprvé případně `npx gulp trust-dev-cert`.
4. Spusť `npx gulp serve --nobrowser`.
5. Otevři hosted workbench na test site:
   `https://<tenant>.sharepoint.com/sites/<test-site>/_layouts/15/workbench.aspx`
6. Potvrď načtení debug manifestů z localhostu.

Tohle není jen „koukání na testovací stránku“. Uvidíš reálný webpart UI renderovaný v SharePointu nad reálnými listy. Rozdíl proti finálnímu nasazení je hlavně v tom, že běží přes debug manifest z tvého PC, ne z App Catalogu.

## SharePoint předpoklady

### Listy

Musí existovat tyto listy:

- `Mentors`
- `Talents`
- `MentoringRequests`

Interní názvy polí musí zůstat přesně podle implementace v [MentoringService.ts](/root/Aures-Elite-Mentoring/src/services/MentoringService.ts).

### HR role

HR role se aktuálně nebere ze SharePoint skupiny. Určuje se porovnáním přihlášeného e-mailu s hodnotami z webpart property `hrEmails`, viz [RoleService.ts](/root/Aures-Elite-Mentoring/src/services/RoleService.ts).

### Notifikace

- `SPUtility.sendEmail` je odstraněné.
- Microsoft Graph mail se nepoužívá.
- `NotificationService` je kompatibilní stub pro budoucí Power Automate řešení.
- Aktuální testy workflow proto neověřují skutečné odeslání e-mailu.

## Funkční přehled

### Talent

- katalog mentorů
- založení žádosti s 1 až 3 mentory
- přehled vlastních žádostí
- reset volby / zrušení aktivních žádostí

### Mentor

- čekající žádosti pro aktivní stage
- detail žádosti s approve / reject
- historie rozhodnutí

### HR

- `Mentees dashboard`
- `Domluvené mentoringy`
- správa mentorů
- správa talentů
- kapacitní dashboard

## Fotky a assety

- HTML mockup používá assety v `assets/mockup/`
- SPFx část používá bundled assety v `src/webparts/auresApp/assets/`
- výsledný `.sppkg` balíček obsahuje 10 mentor fotek, 21 talent fotek a 2 Teams ikony

## Deployment

1. Spustit `npm run package`
2. Vznikne balíček `sharepoint/solution/aures-elite-mentoring.sppkg`
3. IT / SharePoint tým musí balíček schválit a nahrát do App Catalogu
4. Až potom půjde webpart přidávat na běžné stránky bez debug režimu

## Stav projektu

Aktuální technický a projektový stav je v [PROGRESS.md](/root/Aures-Elite-Mentoring/PROGRESS.md).
