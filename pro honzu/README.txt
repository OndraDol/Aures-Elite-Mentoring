Aures Elite Mentoring - handoff export
=====================================

Tato slozka je generovany export z hlavniho projektu v rootu repozitare.
Neni to druhy aktivni projekt ani samostatny source of truth.

Plati:
- Source of truth je root repozitare.
- SPFx je sjednocene na verzi 1.22.x (aktualne 1.22.2).
- Build runtime je Node.js 22.x.
- Security baseline pro hlavni projekt vyzaduje npm audit bez nalezenych vulnerabilities.

Export vytvoren skriptem:
- Create-ProHonzu.ps1

Pokud je k dispozici production build, export obsahuje i hotovy balik:
- aures-elite-mentoring.sppkg
