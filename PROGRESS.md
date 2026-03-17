# PROGRESS.md — Aures Elite Mentoring

## Current Snapshot (2026-03-17)

- Aplikace je na SPFx `1.22.2`, Node `22.x`, TypeScript `5.3.x`.
- `NotificationService` je stub pro budoucí Power Automate; žádné aktivní e-maily se teď neposílají.
- Testovací i produkční SharePoint prostředí jsou připravené.
- Hlavní externí blocker je schválení a nahrání `.sppkg` balíčku do App Catalogu.

## Co je hotové

- Upgrade build stacku na SPFx `1.22.2`
- migrace na Node `22.x`
- TypeScript `5.3` compiler
- production build a fresh `.sppkg`
- HR role přes konfigurovatelné `hrEmails`
- full workflow Talent / Mentor / HR
- avatar asset pipeline pro mentory i talenty
- export `pro honzu/`

## Co je aktuálně možné dělat

- testovat aplikaci proti reálnému SharePoint test site přes hosted workbench
- zakládat a upravovat SharePoint list data
- ověřit role, workflow, assety a UX nad reálnými účty
- připravit produkční site datově a oprávněními

## Co je ještě blokované

- běžné nasazení webpartu na stránku bez debug režimu
- UAT přes App Catalog release
- produkční použití normálními uživateli
- reálné notifikace, dokud nebude dodělané Power Automate řešení

## Externí závislosti na IT

- [x] Testovací SharePoint site
- [x] Produkční SharePoint site
- [ ] Schválení `.sppkg` v App Catalogu
- [ ] Finální publikace webpartu do test/prod prostředí

## Doporučený další postup

1. V test site ověřit list schema a permission model.
2. Otestovat workflow přes hosted workbench s reálnými účty.
3. Po schválení `.sppkg` zopakovat smoke test už bez debug manifestů.
4. Až potom řešit Power Automate notifikace.

## Recent Session Log

- **2026-03-17**: Session 32. Talent fotky bundlované do `.sppkg` — 21 talent fotek přidáno do SPFx asset pipeline, build OK.
- **2026-03-17**: Session 31. Fix opakovaného `package-solution` na Windows + `NotificationService` přepsán na Power Automate stub, přidán script `npm run package`.
- **2026-03-17**: Session 30. Oprava portrétu Zuzany Voborníkové a sjednocení avatar assetů.
- **2026-03-17**: Session 29. Cleanup dočasných artefaktů a release šumu.
- **2026-03-17**: Session 28. Oddělení mockup/SPFx assetů a shared avatar resolver.
- **2026-03-17**: Session 27. Export `pro honzu/`.
- **2026-03-16**: Upgrade na SPFx `1.22.2`, Node `22.x`, TypeScript `5.3.x`, odstranění `sendEmail`.
- **2026-03-14**: Reálná data talentů, HR IA simplification a synchronizace mockupu.
- **2026-03-13**: HR `Mentees dashboard`, reální mentoři, UI polishing.
- **2026-03-09**: Kritické opravy workflow logiky.

## Poznámka k dokumentaci

Starší záznamy v dřívějších verzích dokumentace obsahovaly dnes už neplatné informace o SPFx `1.18.2`, Node `18` a `SPUtility.sendEmail`. Aktuální pravda je definovaná kódem a tímto souborem.
