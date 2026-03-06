# 🚀 Aures Elite Mentoring: Business & Vision Overview (v2.3)

## 1. Celkový cíl projektu (Mise)

Cílem je vytvořit exkluzivní, plně automatizovaný nástroj typu „Concierge", který usnadní a zprofesionalizuje proces propojování největších talentů firmy s členy top managementu (mentory). Aplikace odstraňuje chaos v e-mailech a tabulkách a nahrazuje ho transparentním, důstojným a rychlým systémem v rámci SharePointu Aures Holdings.

## 2. Business potřeba (Proč to stavíme?)

**Efektivita:** Automatizované předávání žádostí mezi mentory bez nutnosti ručního přeposílání nebo urgencí.

**Zážitek pro talenty:** Moderní rozhraní, kde si vybraný zaměstnanec (whitelist) může sám vybrat své vzory a sledovat stav své cesty k mentoringu.

**Ochrana času managementu:** Mentoři vidí žádost až ve chvíli, kdy jsou skutečně na řadě, a mohou reagovat jediným kliknutím.

**Data a Audit:** HR Admin má poprvé v ruce kompletní přehled o tom, kdo o koho má zájem, kdo koho odmítl a kde se proces zastavil.

## 3. Logika fungování (The "Concierge" Flow)

Aplikace se chová jako inteligentní průvodce:

**Prioritní fronta:** Talent si nevybírá jednoho mentora, ale skládá si své „top 3".

**Princip propadávání (Fall-through):** Pokud první volba nemá kapacitu nebo zájem, systém žádost elegantně a tiše posune k druhé volbě. Talent není hned odmítnut, pouze se posouvá v rámci své priority.

**Záchranná síť HR:** Pokud selžou všechny tři volby, systém žádost „zachytí" do speciálního režimu (HR Review), kde administrátor najde náhradní řešení, aby žádný talent nezůstal bez odezvy.

## 4. Technická filozofie projektu

**Zero-Overhead:** Aplikace nevyžaduje žádné další servery, databáze ani placené Power Automate toky. Vše běží přímo v prohlížeči nad stávajícími seznamy SharePoint.

**Bezpečnost:** Přístup je omezen pouze na lidi ze seznamu Talentů a Mentorů, přičemž každý vidí pouze to, co se ho týká.

**Informativní kapacita:** Systém neblokuje schůzky natvrdo, ale dává HR Adminovi přehled o vytížení mentorů pro lepší strategické plánování.

---

# 📂 ULTIMATE MASTER HANDOVER: Aures Elite Mentoring

**Verze dokumentu:** 2.7 (Phase 7.1–7.3 kompletni) **Datum poslední aktualizace:** 6. března 2026 **Stav projektu:** 🟡 IN PROGRESS — Phase 0–7.3 hotove (UI redesign + lokalizace kompletni), zbyvá Phase 7.4 (production build) a nasazeni pres IT. Ceka se na SP prostredi od IT (L2).

---

## 1. AKTUÁLNÍ TECHNICKÝ KONTEXT

**Platforma:** SharePoint Online (Aures Holdings), SPFx v1.18+.

**Prostředí:** Node.js v18.20.0 (Striktně vyžadováno, vyřešen konflikt s v24).

**Stav repozitáře:** `C:\Users\ondrej.dolejs\Desktop\Projekty\Aures_Elite_Mentoring`

**Provedené opravy a instalace:**

- **SASS:** Starý node-sass byl odstraněn. Nahrazen moderním sass (Dart Sass).
- **Knihovny:** Úspěšně nainstalováno PnPjs (@pnp/sp, @pnp/logging, @pnp/common, @pnp/graph) pro veškerou datovou logiku.

### ⚠️ IT Constraints (nové v2.3)

Z bezpečnostních a provozních důvodů (kontrola nákladů na Azure, prevence problémů s traffic) platí následující omezení ze strany IT týmu Aures Holdings:

- **Oprávnění:** Uživateli (Ondřej Dolejš) nelze přidělit roli Owner. Maximální právo je **Contribute**. Automatické vytváření SharePoint listů vlastním skriptem (`setup_lists.js`) proto **není možné** – listy vytvoří L2 ručně dle specifikace v sekci 3.
- **Nasazení .sppkg:** Balíček bude připraven lokálně (viz sekce 5) a předán SHP týmu. Revize kódu proběhne dle kapacit SHP týmu – není garantován okamžitý termín.
- **Testovací prostředí:** IT bylo požádáno o zpřístupnění dev site / sandboxu pro testování před ostrým nasazením. Tím se minimalizuje počet revizních cyklů na straně SHP týmu.

---

## 2. BUSINESS LOGIKA & PRINCIPY (Specifikace v2.0)

Aplikace funguje jako exkluzivní „Concierge" systém pro mentoring. Žádná logika neběží v Power Automate; vše je řízeno kódem aplikace (Client-Side).

### Klíčový koncept: Priority Fall-through Logic

- **Start:** Talent vytvoří žádost, vybere 1–3 mentory. Žádost začíná u Mentora č. 1 (CurrentStage = 1).
- **Propadávání:** Pokud Mentor 1 zamítne → kód přepne na CurrentStage = 2 (vidí ji Mentor 2). Pokud i ten zamítne → CurrentStage = 3.
- **Záchranná síť:** Pokud zamítnou všichni tři, status se změní na HR_Review.

### Audit Trail

Každé rozhodnutí mentora zapisuje: Rozhodnutí (Approved/Rejected), Datum a čas, ID osoby, která rozhodla.

### Notifikační systém

E-maily se odesílají přes SPUtility.SendEmail přímo z prohlížeče:

- **Submit:** Notifikace Mentorovi 1.
- **Reject:** Notifikace dalšímu mentorovi v pořadí nebo HR (při HR_Review).
- **Approve:** Notifikace pro HR i Talenta k naplánování schůzky.

---

## 3. DATOVÝ MODEL (SharePoint Listy)

> ⚠️ Listy vytváří L2 ručně. Názvy (InternalNames) musí být dodrženy přesně pro funkčnost PnPjs.

### List A: Mentors (Katalog)

`Title` (Text), `MentorUser` (Person), `JobTitle` (Text), `Superpower` (Text), `Bio` (Multi-line), `Capacity` (Number), `AvailabilityNote` (Text), `IsActive` (Boolean)

### List B: Talents (Whitelist)

`Title` (Jméno), `TalentUser` (Person), `IsActive` (Boolean)

### List C: MentoringRequests (Hlavní transakční list)

- `Title` – ID ve formátu REQ-2026-{Id} (generováno po uložení)
- `TalentRef` (Lookup → Talents), `Mentor1Ref`, `Mentor2Ref`, `Mentor3Ref` (Lookup → Mentors)
- `Message1`, `Message2`, `Message3` (Text)
- `CurrentStage` (Number: 1, 2, 3)
- `RequestStatus` (Choice: Pending / Approved / HR_Review / Scheduled / Cancelled)
- `Stage1Decision`, `Stage2Decision`, `Stage3Decision` (Choice: Approved / Rejected)
- `Stage1DecisionDate`, `Stage2DecisionDate`, `Stage3DecisionDate` (DateTime)
- `Stage1DecisionBy`, `Stage2DecisionBy`, `Stage3DecisionBy` (Person)

---

## 4. IMPLEMENTAČNÍ STRATEGIE

**UI Komponenty:** Fluent UI. Rozhraní se dělí na `TalentView`, `MentorDashboard` a `HRAdminPanel`.

**Capacity Management:** Kapacita mentora je informativní. HR Admin vidí v dashboardu srovnání (Kapacita vs. Schválené žádosti).

**Bezpečnost:** Frontend ověřuje identitu uživatele proti listům Mentors/Talents. Přístup nepovoleným osobám je blokován na úrovni React routeru.

---

## 5. PROCES BUILDU A NASAZENÍ

### Lokální build (provádí Ondřej Dolejš)

bash

```bash
# Spuštění v Node.js v18.20.0 – povinné
gulp bundle --ship
gulp package-solution --ship
```

Výsledný soubor: `sharepoint/solution/aures-elite-mentoring.sppkg`

### Předání IT

Hotový `.sppkg` soubor se předá SHP týmu k bezpečnostní revizi a nahrání do App Catalogu.

### Testování

- **Lokálně (`gulp serve`):** UI, layout, navigace – bez napojení na SharePoint data.
- **Plnohodnotný test:** Možný až po nasazení na testovací prostředí (dev site), o které bylo IT požádáno.