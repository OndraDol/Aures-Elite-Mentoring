# PROGRESS.md — Aures Elite Mentoring

## Session Log
- **2026-03-06**: Session 6. Subtasky 1.3+1.4: MentoringService (CRUD + fall-through logika), NotificationService (sendEmail pres SP Utility). Build OK.
- **2026-03-06**: Session 5. Subtask 1.2: src/utils/mockData.ts — 5 mentoru, 3 talenty, 4 zadosti (Pending/Approved/HR_Review). Build OK.
- **2026-03-06**: Session 4. Subtask 1.1: src/services/interfaces.ts — enums (RequestStatus, StageDecision, UserRole), ISPUser, ISPLookup, IMentor, ITalent, IMentoringRequest, ICurrentUser. Build OK.
- **2026-03-06**: Session 3. Subtasky 0.4+0.5: gulp build overeno (OK), @pnp/sp inicializace v WebPartu (spfi + SPFx). IAuresAppProps rozsirien o sp:SPFI + context. Build prochazi.
- **2026-03-06**: Session 2. Upgrade SPFx 1.11 → 1.18.2, React 16 → 17, TS 4.5, Gulp 3 → 4. Build prochazi. GitHub repo propojeno. Subtasky 0.1–0.3 hotove.
- **2026-03-06**: Session 1. Analyzovan scaffold (SPFx 1.11), precten Project_overview.md, vytvoren PROGRESS.md, navrzen architektura. Zadny kod.

---

## Stav projektu

Scaffold: SPFx **1.11** (CLAUDE.md vyzaduje 1.18+). Pouze default WebPart, zadne services/components.

### Zavislosti na IT (L2)
- [ ] SP listy (Mentors, Talents, MentoringRequests) — vytvoreni rucne dle specifikace
- [ ] Dev site / sandbox pro testovani
- [ ] Nahrani .sppkg do App Catalogu (az bude hotovy build)

---

## Phase 0: Zakladna & Scaffold

- [x] 0.1 Re-scaffold SPFx na v1.18+ → SPFx 1.18.2, React 17.0.1, TypeScript 4.5.5, Gulp 4.0.2
- [x] 0.2 Vycistit package.json — sjednotit @pnp/sp v4, odstranit @pnp/common v2
- [x] 0.3 Overit Dart Sass (sass) — build prosel (gulp build OK)
- [x] 0.4 Overit `gulp serve` funguje s cistym scaffoldem — gulp build OK, TypeScript 4.5.5 kompilace bez chyb
- [x] 0.5 Nastavit @pnp/sp inicializaci v WebPart (spfi + SPFx context) — spfi().using(SPFx(this.context)) v onInit()

## Phase 1: Core Infrastructure

- [x] 1.1 Vytvorit `src/services/interfaces.ts` — IMentor (vcetne AvailabilityNote), ITalent, IMentoringRequest, enums (RequestStatus, StageDecision, UserRole)
- [x] 1.2 Vytvorit `src/utils/mockData.ts` — mock data pro lokalni vyvoj
- [x] 1.3 Vytvorit `src/services/MentoringService.ts` — CRUD operace nad 3 SP listy
- [x] 1.4 Vytvorit `src/services/NotificationService.ts` — email notifikace pres SP Utility (SendEmail)
- [ ] 1.5 Vytvorit `src/services/RoleService.ts` — detekce role (porovnani current user vs Mentors/Talents list)

## Phase 2: Routing & App Shell

- [ ] 2.1 Prevest AuresApp.tsx na funkcni komponentu s hooky
- [ ] 2.2 Implementovat jednoduchy router (state-based view switching)
- [ ] 2.3 Implementovat detekci role pri nacteni (Talent / Mentor / HR / kombinace)
- [ ] 2.4 AccessDenied obrazovka — blokace pro uzivatele mimo Talents/Mentors listy
- [ ] 2.5 App shell — navigace, header, layout dle role (tab switcher pro viceroli)

## Phase 3: Talent View

- [ ] 3.1 MentorCatalog — grid aktivnich mentoru (karty s bio, kapacita, AvailabilityNote)
- [ ] 3.2 MentorCard — detail mentora (Superpower, JobTitle, Bio, AvailabilityNote)
- [ ] 3.3 RequestForm — formular zadosti (vyber 1-3 mentoru + zpravy ke kazdemu, validace)
- [ ] 3.4 MyRequests — seznam mych zadosti + stav (Pending/Approved/HR_Review)

## Phase 4: Mentor Dashboard

- [ ] 4.1 PendingRequests — seznam zadosti cekajicich na me rozhodnuti (dle CurrentStage)
- [ ] 4.2 RequestDetail — detail zadosti (talent info, zprava, approve/reject akce)
- [ ] 4.3 Fall-through logika — pri rejectu posun na dalsiho mentora nebo HR_Review (resit 1-3 mentory)
- [ ] 4.4 RequestHistory — moje minula rozhodnuti

## Phase 5: HR Admin Panel

- [ ] 5.1 AllRequests — prehled vsech zadosti (filtry dle statusu, vyhledavani)
- [ ] 5.2 HRReviewQueue — fronta zadosti odmitnutych vsemi mentory (1-3)
- [ ] 5.3 MentorManagement — sprava mentoru (pridani/uprava/deaktivace)
- [ ] 5.4 TalentManagement — sprava talentu
- [ ] 5.5 CapacityDashboard — srovnani Kapacita vs. Schvalene zadosti per mentor

## Phase 6: Notifikace

- [ ] 6.1 Email notifikace pri submitu zadosti (Mentor1)
- [ ] 6.2 Email notifikace pri rejectu (dalsi mentor / HR)
- [ ] 6.3 Email notifikace pri approve (HR + Talent)
- [ ] 6.4 In-app indikatory novych cekajicich zadosti

## Phase 7: Polish & Deploy

- [ ] 7.1 Styling — Fluent UI theme, responsive design
- [ ] 7.2 Error handling — loading states, error boundaries, toast notifikace
- [ ] 7.3 Lokalizace — ceske texty (popisy, labely, chybove hlasky)
- [ ] 7.4 Production build — `gulp bundle --ship && gulp package-solution --ship`
- [ ] 7.5 Testovani na SharePoint Online workbench
- [ ] 7.6 README.md aktualizace — finalni setup instrukce
