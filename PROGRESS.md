# PROGRESS.md — Aures Elite Mentoring

## Session Log
- **2026-03-13**: Session 21. Phase 11 — HR Mentees Dashboard: nová HR záložka `Mentees dashboard` jako talent-centric přehled nad `Talents` + `MentoringRequests`. Zobrazuje stavy Bez žádosti / Čeká na mentora / Vyžaduje HR / Mentor potvrzen / Propojeno, warning pro více aktivních žádostí a kontextové HR akce (Schválit za mentora / Naplánovat / Zrušit). Router + AppShell aktualizovány, nový komponent `hr/MenteesDashboard.tsx`, nové SCSS styly. Build OK.
- **2026-03-13**: Session 20. Phase 10 — Doplnění reálných dat mentorů: nahrazeni 5 mock mentorů → 10 reálných z Mentoří.docx s fotkami z pic/ folder. MentorCatalog.tsx: expandable bio + challenge text. mockup.html: reordered 10 mentorů dle user request (Topolová→Vaněček→Hrudník→Vorlík→Luňáček→Vápeník→Voršílková→Voborníková→Batěk→Svoboda). Phase 7.4: production build OK (Node v18.19.0 LTS, 22s). Opraveno $gold-dark → $gold-dk. UI: toggle button behavior updated (Zobrazit → Sbalit). Build + push OK.
- **2026-03-09**: Session 18. Phase 9 — Oprava 4 kritickyck bugy: (1) Fall-through logika MentoringService.makeDecision — fix podmínky pro přeskočení Mentor2 při stage=1→Mentor3 (stage===1||2 místo jen stage===2). (2) Bezpečnost rozhodování v RequestDetail — resolveMyStage nahrazena resolveActiveStage vracející null mimo aktivní fázi + guard s info zprávou (brání "zombie" schválení ze staré stránky). (3) HR ApprovedMentorings — getApprovedMentor přepsána dle StageXDecision===Approved místo CurrentStage (fix chybné identifikace mentora u HR_Review→Scheduled). (4) Talent RequestForm — přidána kontrola aktivní žádosti při načtení, blokuje spam nových žádostí. Commit + push.
- **2026-03-07**: Session 17. Phase 8 — Major UX redesign dle pozadavku vlastnika. MentorCatalog: odebrany kapacitni info. RequestForm: primarni mentor prominentne zobrazen, sekundarni/terciarni v tabulce, nepovinne zpravy. MyRequests: "Mentoring od XY" s per-mentor statusy (Ceka/Ve fronte/Schvaleno). Talent taby: dynamicke (Katalog / Moje zadosti / Zmena volby). HR taby: "Ceka" (pending+HR_Review s admin akcemi Schvalit/Zrusit) + "Domluvene mentoringy" (approved pary). MentorManagement: plny CRUD (pridat/upravit/smazat mentora). Nove komponenty: ResetChoice.tsx, ApprovedMentorings.tsx. MentoringService: +addMentor, +updateMentor, +deleteMentor, +deleteRequest, +cancelAllRequestsForTalent. IMentor: +PhotoUrl. Mockup.html aktualizovan. Build OK.
- **2026-03-07**: Session 16. Premium UI/UX overhaul v8: Navy+Gold+Glassmorphism design system. SCSS kompletne prepsany — nove tokeny ($navy, $gold, blue-tinted shadows, $ease-out krivky), gold accent stripe pod headerem, frosted glass efekty, gold ring na avatarech, gold active indicator na tabech, shimmer/pulseGold animace, refined typografie. AppShell.tsx — logo placeholder (diamond motif), split title "AURES ELITE MENTORING" se zlatym akcentem. Build OK.
- **2026-03-06**: Session 15. Phase 7 kompletni: AuresApp.module.scss — kompletni redesign (design tokeny, keyframes spin+fadeUp, gradient header, card shadows, hover lift, loading spinner pres ::before, mentorAvatar, navBadge, skryta kapacita). MentorCatalog — avatar+initials, bez kapacity, tlacitko vzdy aktivni. RequestForm — isDisabled bez isFull. MyRequests — ceske texty. Vsech 8 zbyvajicich komponent (mentor/*, hr/*) — opraveny ceske diakritiky. Phase 7.1+7.2+7.3 hotove.
- **2026-03-06**: Session 14. Phase 6 kompletni: 6.1 notify Mentor1 po submitu (RequestForm), 6.2 notify next mentor / HR po rejectu (RequestDetail), 6.3 notify HR+Talent po approve (RequestDetail), 6.4 navBadge pocet cekajicich (AppShell). hrEmail jako WebPart property (property pane). MentoringService: +getMentorById, +getTalentById.
- **2026-03-06**: Session 13. Phase 5 kompletni: AllRequests (filter+search), HRReviewQueue (Naplanovat/Zrusit), MentorManagement (kapacita inline edit + toggle), TalentManagement (toggle aktivni), CapacityDashboard (kapacitni bar). MentoringService: +getAllMentorsForAdmin, +getAllTalentsForAdmin, +setTalentActive. SCSS Phase 5.
- **2026-03-06**: Session 12. Phase 4 kompletni: PendingRequests.tsx (seznam cekajicich zadosti pro mentora), RequestDetail.tsx (detail zadosti + Schvalit/Zamitnout + hint o fall-through), RequestHistory.tsx (historie rozhodnuti + datum + badge). SCSS Phase 4 styly. AuresApp.tsx router aktualizovan. Build OK.
- **2026-03-06**: Session 11. Phase 3 kompletni: MentorCatalog.tsx (grid karet + MentorCard), RequestForm.tsx (multi-select 1-3 mentoru + zpravy, validace, submit), MyRequests.tsx (seznam zadosti + status badge + mentor tagy). SCSS Phase 3 styly. AuresApp.tsx router aktualizovan. Build OK.
- **2026-03-06**: Session 10. Subtasky 2.4+2.5: AccessDenied.tsx, AppShell.tsx (header, role switcher, nav taby), AuresApp.module.scss (shell styly). Phase 2 kompletni.
- **2026-03-06**: Session 9. Subtasky 2.2+2.3: AppView.ts — typ AppView + NavigateFn; AuresApp.tsx — state-based router (switch na vsechny views), resolveDefaultView dle role, navigate callback.
- **2026-03-06**: Session 8. Subtask 2.1: AuresApp.tsx — funkcni komponenta s hooky (useState/useEffect), nacitani currentUser pres RoleService, loading + error stavy.
- **2026-03-06**: Session 7. Subtask 1.5: RoleService.ts — detekce role z SP (Mentor/Talent/HR/Unknown), paralelni kontrola Mentors+Talents listu a SP skupiny "Aures Mentoring HR". Fail-safe pro chybejici skupinu.
- **2026-03-06**: Session 6. Subtasky 1.3+1.4: MentoringService (CRUD + fall-through logika), NotificationService (sendEmail pres SP Utility). Build OK.
- **2026-03-06**: Session 5. Subtask 1.2: src/utils/mockData.ts — 5 mentoru, 3 talenty, 4 zadosti (Pending/Approved/HR_Review). Build OK.
- **2026-03-06**: Session 4. Subtask 1.1: src/services/interfaces.ts — enums (RequestStatus, StageDecision, UserRole), ISPUser, ISPLookup, IMentor, ITalent, IMentoringRequest, ICurrentUser. Build OK.
- **2026-03-06**: Session 3. Subtasky 0.4+0.5: gulp build overeno (OK), @pnp/sp inicializace v WebPartu (spfi + SPFx). IAuresAppProps rozsirien o sp:SPFI + context. Build prochazi.
- **2026-03-06**: Session 2. Upgrade SPFx 1.11 → 1.18.2, React 16 → 17, TS 4.5, Gulp 3 → 4. Build prochazi. GitHub repo propojeno. Subtasky 0.1–0.3 hotove.
- **2026-03-06**: Session 1. Analyzovan scaffold (SPFx 1.11), precten Project_overview.md, vytvoren PROGRESS.md, navrzen architektura. Zadny kod.

---

## Stav projektu

SPFx **1.18.2**, React 17, TypeScript 4.5.5. Phase 0–8 hotove. Ceka se na SP prostredi od IT (L2) pro produkce build.

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
- [x] 1.5 Vytvorit `src/services/RoleService.ts` — detekce role (porovnani current user vs Mentors/Talents list)

## Phase 2: Routing & App Shell

- [x] 2.1 Prevest AuresApp.tsx na funkcni komponentu s hooky
- [x] 2.2 Implementovat jednoduchy router (state-based view switching)
- [x] 2.3 Implementovat detekci role pri nacteni (Talent / Mentor / HR / kombinace)
- [x] 2.4 AccessDenied obrazovka — blokace pro uzivatele mimo Talents/Mentors listy
- [x] 2.5 App shell — navigace, header, layout dle role (tab switcher pro viceroli)

## Phase 3: Talent View

- [x] 3.1 MentorCatalog — grid aktivnich mentoru (karty s bio, kapacita, AvailabilityNote)
- [x] 3.2 MentorCard — detail mentora (Superpower, JobTitle, Bio, AvailabilityNote) — soucasti MentorCatalog.tsx
- [x] 3.3 RequestForm — formular zadosti (vyber 1-3 mentoru + zpravy ke kazdemu, validace)
- [x] 3.4 MyRequests — seznam mych zadosti + stav (Pending/Approved/HR_Review)

## Phase 4: Mentor Dashboard

- [x] 4.1 PendingRequests — seznam zadosti cekajicich na me rozhodnuti (dle CurrentStage)
- [x] 4.2 RequestDetail — detail zadosti (talent info, zprava, approve/reject akce)
- [x] 4.3 Fall-through logika — implementovana v MentoringService.makeDecision(), v UI hint "pri zamitnutí predana X"
- [x] 4.4 RequestHistory — moje minula rozhodnuti

## Phase 5: HR Admin Panel

- [x] 5.1 AllRequests — prehled vsech zadosti (filtry dle statusu, vyhledavani)
- [x] 5.2 HRReviewQueue — fronta zadosti odmitnutych vsemi mentory, akce Naplanovat/Zrusit
- [x] 5.3 MentorManagement — kapacita inline edit + toggle aktivni/neaktivni
- [x] 5.4 TalentManagement — seznam talentu + toggle aktivni/neaktivni
- [x] 5.5 CapacityDashboard — tabulka schvaleni vs kapacita + barevny progress bar

## Phase 6: Notifikace

- [x] 6.1 Email notifikace pri submitu zadosti (Mentor1) — RequestForm.tsx
- [x] 6.2 Email notifikace pri rejectu (dalsi mentor / HR) — RequestDetail.tsx + sendDecisionNotification
- [x] 6.3 Email notifikace pri approve (HR + Talent CC) — RequestDetail.tsx + sendDecisionNotification
- [x] 6.4 In-app badge pocet cekajicich — AppShell navBadge, nacitano pri initu

## Phase 7: Polish & Deploy

- [x] 7.1 Styling — Premium UI/UX overhaul v8: Navy+Gold+Glassmorphism, gold accents, frosted glass, refined typography, premium animations
- [x] 7.2 Error handling — loading states, try/catch + mock fallback ve vsech komponentach
- [x] 7.3 Lokalizace — ceske diakritiky opraveny ve vsech 11 komponentach (talent/* + mentor/* + hr/*)
- [x] 7.4 Production build — `npm run build` prochází OK (Node.js 18.19.0 LTS); release/ folder s .sppkg generován
- [ ] 7.5 Testovani na SharePoint Online workbench
- [ ] 7.6 README.md aktualizace — finalni setup instrukce

## Session 20 (2026-03-13) — UI vylepšení a build
- Opraven SCSS: `$gold-dark` → `$gold-dk`
- Mentor toggle button: skrýt "Zobrazit" po rozbalení, "Sbalit profil" dole pod challenge
- Reordered mentors: Topolová, Vaněček, Hrudník, Vorlík, Luňáček, Vápeník, Voršílková, Voborníková, Batěk, Svoboda
- Production build OK (22s, Node v18.19.0)

## Phase 9: Kritické opravy logiky (2026-03-09)

- [x] 9.1 MentoringService.makeDecision — fall-through logika pro přeskočení Mentor2 (stage 1→Mentor3 bez Mentor2)
- [x] 9.2 RequestDetail — resolveActiveStage vrací null mimo aktivní fázi; guard brání pozdnímu rozhodnutí mentora
- [x] 9.3 ApprovedMentorings — getApprovedMentor identifikuje mentora dle StageXDecision=Approved (ne CurrentStage)
- [x] 9.4 RequestForm — blokace submitu pokud má talent aktivní žádost (Pending/Approved/HR_Review/Scheduled)

## Phase 10: Doplnění reálných dat mentorů (2026-03-13)

- [x] 10.1 mockup.html — MENTORS data nahrazena 10 reálnými mentory (karolina.topolova, petr.vanecek, lubos.vorlik, martin.hrudnik, daniel.lunacek, zdenek.batek, miroslav.vapenik, alen.svoboda, zuzana.vobornikova, marie.vorsilkova)
- [x] 10.2 mockup.html — Fotky z pic/ (80px avatar s box-shadow), bio s expandovací sekcí (details HTML), challenge v gold-bordered box
- [x] 10.3 src/utils/mockData.ts — MOCK_MENTORS nahrazeny 10 reálnými s Bio = krátký text + "\n\nNejvětší překonaná výzva: ..."
- [x] 10.4 MentorCatalog.tsx — MentorCard rozšířena: split bio/challenge, expandable section, real photos se 80px avatarem
- [x] 10.5 AuresApp.module.scss — styly pro .mentorAvatarPhoto, .mentorDetails*, .mentorChallenge
- [x] 10.6 MENTOR_MGMT a CAPACITY v mockup.html — aktualizovány na 10 reálných mentorů s kapacitami
- [x] 10.7 Ověření v prohlížeči — fotky OK, expandable bio OK, HR dashboard s 10 mentory OK

## Phase 8: UX Redesign (vlastnik pozadavky)

- [x] 8.1 MentorCatalog — odebrana kapacitni info (AvailabilityNote)
- [x] 8.2 RequestForm — primarni mentor prominentne, sekundarni/terciarni tabulka, nepovinne zpravy
- [x] 8.3 MyRequests — "Mentoring od XY" s per-mentor statusy (Ceka na schvaleni / Ve fronte / Schvaleno / Zamitnuto)
- [x] 8.4 Talent taby — dynamicke dle existence zadosti (Katalog | Moje zadosti + Zmena volby)
- [x] 8.5 ResetChoice — stránka pro reset volby mentora (zruseni vsech aktivnich zadosti)
- [x] 8.6 HR AllRequests — "Ceka" tab s jmenem talenta+mentora, srozumitelnymi statusy, HR admin akcemi (Schvalit/Zrusit)
- [x] 8.7 ApprovedMentorings — "Domluvene mentoringy" tab pro schvalene pary
- [x] 8.8 MentorManagement CRUD — pridat/upravit/smazat mentora (vcetne PhotoUrl)
- [x] 8.9 MentoringService — nove metody (addMentor, updateMentor, deleteMentor, deleteRequest, cancelAllRequestsForTalent)
- [x] 8.10 IMentor interface — pridáno PhotoUrl pole
- [x] 8.11 Mockup.html — aktualizovan dle noveho designu
- [x] 8.12 SCSS — nove styly pro vsechny Phase 8 komponenty
