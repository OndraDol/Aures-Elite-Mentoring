# Aures Elite Mentoring — Business & Technical Overview

## Mise

Vytvořit důstojný mentoring concierge systém v SharePoint Online, který:

- dává talentům jasný a moderní způsob, jak požádat o mentoring
- chrání čas mentorů tím, že vidí jen žádosti, které jsou právě na jejich stage
- dává HR kompletní audit a operativní přehled nad celým procesem

## Aktuální implementační realita

- aplikace je client-side SPFx webpart
- data leží ve třech SharePoint listech
- workflow běží v aplikaci, ne v Power Automate
- e-mailové notifikace jsou dočasně vypnuté; kód je připravený na budoucí PA integraci

## Workflow

1. Talent vybere 1 až 3 mentory a odešle žádost.
2. Žádost začne ve `CurrentStage = 1` a `RequestStatus = Pending`.
3. Pokud mentor na aktivní stage zamítne, žádost se propadne na další stage.
4. Pokud další mentor už neexistuje, žádost jde do `HR_Review`.
5. Jakékoli schválení nastaví `RequestStatus = Approved`.
6. HR může následně posunout žádost do `Scheduled` nebo `Cancelled`.

## Role a přístupy

### Talent

- katalog mentorů
- vytvoření žádosti
- moje žádosti
- změna volby / reset

### Mentor

- čekající žádosti pro svou aktivní stage
- detail žádosti
- historie rozhodnutí

### HR

- `Mentees dashboard`
- `Domluvené mentoringy`
- správa mentorů
- správa talentů
- kapacita

HR role se dnes poznává porovnáním e-mailu uživatele s webpart property `hrEmails`. Není závislá na SharePoint skupině.

## SharePoint datový model

### `Mentors`

- `Title`
- `MentorUser` (Person)
- `JobTitle`
- `Superpower`
- `Bio`
- `Capacity`
- `AvailabilityNote`
- `PhotoUrl`
- `IsActive`

### `Talents`

- `Title`
- `TalentUser` (Person)
- `IsActive`

### `MentoringRequests`

- `Title`
- `TalentRef`
- `Mentor1Ref`, `Mentor2Ref`, `Mentor3Ref`
- `Message1`, `Message2`, `Message3`
- `CurrentStage`
- `RequestStatus`
- `Stage1Decision`, `Stage2Decision`, `Stage3Decision`
- `Stage1DecisionDate`, `Stage2DecisionDate`, `Stage3DecisionDate`
- `Stage1DecisionBy`, `Stage2DecisionBy`, `Stage3DecisionBy`

## Aktuální technický stack

- SharePoint Online + SPFx `1.22.2`
- Node.js `22.x`
- React `17.0.1`
- TypeScript `5.3.x`
- `@pnp/sp` v4
- Dart Sass

## Notifikace

Aktuálně:

- `SPUtility.sendEmail` je odstraněno
- Microsoft Graph mail se nepoužívá
- `NotificationService` je stub kompatibilní s budoucím Power Automate napojením

To znamená, že aplikace dnes umí kompletní workflow bez aktivního mail transportu.

## Testování před schválením `.sppkg`

Protože už existuje SharePoint test site, lze dělat téměř plnohodnotné integrační testy přes hosted workbench:

- UI uvidíš přímo v SharePointu
- poběží nad reálnými listy a reálnými účty
- budeš testovat skutečné CRUD operace a role

Rozdíl proti finálnímu nasazení je jen v tom, že webpart běží z debug manifestu na localhostu, ne z App Catalogu.

## Aktuální blocker

Hlavní blocker už není vývoj aplikace ani SharePoint prostředí, ale schválení a publikace `sharepoint/solution/aures-elite-mentoring.sppkg`.

Do té doby lze:

- připravit a validovat listy
- ověřit role a workflow
- odladit data a UX

Do té doby nelze:

- používat webpart jako standardně nasazenou komponentu na stránkách
- pustit řešení běžným uživatelům bez debug režimu
