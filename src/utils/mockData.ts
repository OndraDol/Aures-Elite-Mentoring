/**
 * Mock data pro lokalni vyvoj (gulp serve bez SP Online pripojeni).
 * Pouzivano jako fallback kdyz SharePoint neni dostupny.
 */

import {
  IMentor,
  ITalent,
  IMentoringRequest,
  RequestStatus,
  StageDecision
} from '../services/interfaces';

export const MOCK_MENTORS: IMentor[] = [
  {
    Id: 1,
    Title: 'Karolína Topolová',
    MentorUser: { Id: 101, Title: 'Karolína Topolová', EMail: 'karolina.topolova@aures.cz' },
    JobTitle: 'co-CEO',
    Superpower: 'Networking, change management, schopnost ovlivňovat a propojovat lidi',
    Bio: 'Karolína Topolová začala svou kariéru v roce 1998 založením firemního call centra, které tehdy tvořilo pět lidí a postupně vyrostlo v profesionální tým s více než 200 zaměstnanci. Během své kariéry prošla řadou manažerských rolí napříč oblastmi sales, financování, HR i externí komunikace. Díky této zkušenosti získala komplexní pohled na fungování firmy a její růst. V roce 2012 se stala Generální ředitelkou společnosti, a o tři roky později také Předsedkyní představenstva.\n\nNejvětší překonaná výzva: Úspěšně provést firmu zásadní transformací v období ekonomické krize a pandemie COVID-19.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 2,
    Title: 'Petr Vaněček',
    MentorUser: { Id: 102, Title: 'Petr Vaněček', EMail: 'petr.vanecek@aures.cz' },
    JobTitle: 'co-CEO',
    Superpower: 'Schopnost proměňovat data a technologické inovace v konkrétní businessová řešení a růst firmy',
    Bio: 'Petr Vaněček ve společnosti působí více než dvě dekády a během této doby prošel řadou klíčových manažerských rolí napříč businessem. Díky hluboké znalosti fungování firmy i trhu se dlouhodobě podílí na jejím strategickém směřování a rozvoji. V roli Co-CEO se soustředí zejména na rozvoj businessu, digitalizaci, práci s daty a technologické inovace.\n\nNejvětší překonaná výzva: Krizový management za Covidu.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 3,
    Title: 'Luboš Vorlík',
    MentorUser: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' },
    JobTitle: 'Managing Director CZ/SK',
    Superpower: 'Motivace a vedení týmu, orientace na výsledek, prezentační a komunikační dovednosti',
    Bio: 'Luboš Vorlík ve společnosti působí jako Výkonný ředitel pro Českou republiku a Slovensko, kde zodpovídá za strategické řízení a další rozvoj společnosti na obou trzích. Do firmy nastoupil v roce 2003 a během svého působení prošel řadou zákaznicky orientovaných pozic, což mu poskytlo hluboké porozumění potřebám klientů i fungování obchodních procesů.\n\nNejvětší překonaná výzva: Transformace sales departmentu na SK.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 4,
    Title: 'Martin Hrudník',
    MentorUser: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' },
    JobTitle: 'COO',
    Superpower: 'Schopnost přetavit detailní znalost operativy v efektivní strategii nákupu a růstu',
    Bio: 'Martin Hrudník působí ve společnosti jako COO a je zodpovědný za nákupní strategii společnosti, související marketingové aktivity a projekty podporující další expanzi skupiny. Do firmy nastoupil již v roce 1999 a během své kariéry prošel řadou pozic v oblasti nákupu a provozu.\n\nNejvětší překonaná výzva: Po 15 letech ve výkupní „bublině" převzetí odpovědnosti i za prodejní výsledky.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 5,
    Title: 'Daniel Luňáček',
    MentorUser: { Id: 105, Title: 'Daniel Luňáček', EMail: 'daniel.lunacek@aures.cz' },
    JobTitle: 'Group Sales Director',
    Superpower: 'Jak dosáhnout výsledku pomocí analýzy, lidí kolem sebe a správně nastavených procesů',
    Bio: 'Daniel Luňáček působí ve firmě 25 let. Svou kariéru začal jako representant v call centru a postupně se vypracoval přes pozici manažera poboček až na Regional Managera pro Českou republiku a Slovensko. Následně působil jako Country Manager pro CZ a SK a v současnosti zastává pozici Group Sales Director.\n\nNejvětší překonaná výzva: Naučit se delegovat, nevěřit jen v sám sebe, ale v tým.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 6,
    Title: 'Zdeněk Batěk',
    MentorUser: { Id: 106, Title: 'Zdeněk Batěk', EMail: 'zdenek.batek@aures.cz' },
    JobTitle: 'Group Purchasing Director',
    Superpower: 'Strategické myšlení a převedení vizí do reálné produkce',
    Bio: 'Zdeněk Batěk do AAA nastoupil v roce 2007 hned po střední škole na pozici testovacího technika. Po 3 letech se vrátil do Prahy a začal vykupovat auta jako mobilní výkupčí. V roce 2012 se posunul na pozici manažera mobilního výkupu. Byl vlastníkem nového projektu Buying Guide/Pricing Guide a nyní zastává pozici Group Purchasing Director.\n\nNejvětší překonaná výzva: Rychlý přechod do manažerské pozice v mladém věku s řízením pozičně i věkově starších kolegů.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 7,
    Title: 'Miroslav Vápeník',
    MentorUser: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
    JobTitle: 'Managing Director PL',
    Superpower: 'Schopnost budovat výkonné obchodní týmy a rozvíjet jejich potenciál',
    Bio: 'Miroslav Vápeník působí ve společnosti dvacátým rokem. Ve firmě si prošel všechny prodejní pozice od Sales Closing Managera až po Country Managera CZ. Aktuálně působí jako Managing Director pro polský trh, kde se podílí na strategickém růstu a budování silné zákaznické zkušenosti.\n\nNejvětší překonaná výzva: Převzetí odpovědnosti za řízení a rozvoj trhu v Polsku — prostředí s jinou zákaznickou mentalitou a silnou konkurencí.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 8,
    Title: 'Alen Svoboda',
    MentorUser: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
    JobTitle: 'General Manager Prague',
    Superpower: 'Na základě analýzy a empatické komunikace dokáže okolí vysvětlit, kam společně chceme dojít',
    Bio: 'Alen Svoboda působí ve firmě celkem 15 let a momentálně řídí pražský region. Svou kariéru začal jako prodejce na pobočce v Brně, kde velmi rychle postoupil na manažerské pozice. Nabral obrovské zkušenosti s chápáním prodeje jako vztahové záležitosti a souboru všech detailů ovlivňujících výkonnost business modelu.\n\nNejvětší překonaná výzva: Změnit pohled na strategii spolupracovníků a vysvětlovat hlubší motivanty ovlivňující pozitivní náhled v rámci fungování ve firmě.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 9,
    Title: 'Zuzana Voborníková',
    MentorUser: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' },
    JobTitle: 'Group Staffing Manager',
    Superpower: 'Schopnost pozitivně motivovat a propojovat lidi napříč týmy i zeměmi',
    Bio: 'Zuzana Voborníková působí na pozici Group Staffing Manager a vede náborové aktivity napříč skupinou ve všech zemích. Má více než dvacet let zkušeností v oblasti HR a recruitmentu v mezinárodních společnostech. V minulosti působila jako Senior Recruiter v Amazonu nebo ve vedoucích recruitment rolích ve firmách CSC či AB InBev.\n\nNejvětší překonaná výzva: Skloubení návratu na manažerskou roli s malým dítětem po MD. Otevření a personální obsazení poboček v Německu.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 10,
    Title: 'Marie Voršilková',
    MentorUser: { Id: 110, Title: 'Marie Voršilková', EMail: 'marie.vorsilkova@aures.cz' },
    JobTitle: 'Chief HR Officer',
    Superpower: 'Leadership, motivace lidí, práce se změnou',
    Bio: 'Marie Voršilková pochází z bankovního prostředí, kde prošla prodejními i rozvojovými rolemi v retailovém, korporátním i premium bankovnictví. Postupně ji její cesta přivedla od obchodu přes rozvoj lidí až ke komplexní HR agendě. Po přechodu do automotive prošla dynamickým obdobím změn — od integrace a slučování entit přes uzavírání zahraničních poboček až po optimalizace a restrukturalizace.\n\nNejvětší překonaná výzva: Udržet motivaci a energii pracovních týmů v obdobích velkých změn a ekonomických krizí.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  }
];

export const MOCK_TALENTS: ITalent[] = [
  {
    Id: 1,
    Title: 'Eva Malkova',
    TalentUser: { Id: 201, Title: 'Eva Malkova', EMail: 'eva.malkova@aures.cz' },
    IsActive: true
  },
  {
    Id: 2,
    Title: 'Ondrej Dostal',
    TalentUser: { Id: 202, Title: 'Ondrej Dostal', EMail: 'ondrej.dostal@aures.cz' },
    IsActive: true
  },
  {
    Id: 3,
    Title: 'Katerina Simkova',
    TalentUser: { Id: 203, Title: 'Katerina Simkova', EMail: 'katerina.simkova@aures.cz' },
    IsActive: true
  }
];

export const MOCK_REQUESTS: IMentoringRequest[] = [
  {
    Id: 1,
    Title: 'REQ-2026-1',
    TalentRef: { Id: 1, Title: 'Eva Malkova' },
    Mentor1Ref: { Id: 1, Title: 'Karolína Topolová' },
    Mentor2Ref: { Id: 2, Title: 'Petr Vaněček' },
    Mentor3Ref: { Id: 10, Title: 'Marie Voršilková' },
    Message1: 'Chtěla bych se naučit, jak prezentovat strategické projekty top managementu. Váš přístup k leadershipu je pro mě inspirující.',
    Message2: 'Zajímám se o digitalizaci a inovace v businessu.',
    Message3: 'Ráda bych pochopila HR perspektivu při řízení změn.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Pending
  },
  {
    Id: 2,
    Title: 'REQ-2026-2',
    TalentRef: { Id: 2, Title: 'Ondrej Dostal' },
    Mentor1Ref: { Id: 4, Title: 'Martin Hrudník' },
    Mentor2Ref: { Id: 5, Title: 'Daniel Luňáček' },
    Message1: 'Chci se zdokonalit v operativním řízení a efektivitě procesů.',
    Message2: 'Obchodní dovednosti jsou klíč k mému kariérnímu rozvoji.',
    CurrentStage: 2,
    RequestStatus: RequestStatus.Pending,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-02-15T10:30:00Z',
    Stage1DecisionBy: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' }
  },
  {
    Id: 3,
    Title: 'REQ-2026-3',
    TalentRef: { Id: 3, Title: 'Katerina Simkova' },
    Mentor1Ref: { Id: 9, Title: 'Zuzana Voborníková' },
    Message1: 'Chtěla bych lépe porozumět náborovým procesům a budování týmů v mezinárodním prostředí.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Approved,
    Stage1Decision: StageDecision.Approved,
    Stage1DecisionDate: '2026-02-20T14:00:00Z',
    Stage1DecisionBy: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' }
  },
  {
    Id: 4,
    Title: 'REQ-2026-4',
    TalentRef: { Id: 1, Title: 'Eva Malkova' },
    Mentor1Ref: { Id: 7, Title: 'Miroslav Vápeník' },
    Mentor2Ref: { Id: 8, Title: 'Alen Svoboda' },
    Mentor3Ref: { Id: 3, Title: 'Luboš Vorlík' },
    Message1: 'Zajímám se o obchodní strategii na zahraničních trzích.',
    Message2: 'Prodej jako vztahová záležitost je téma, které mě zajímá.',
    Message3: 'Strategické řízení a rozvoj na trhu CZ/SK je to, co hledám.',
    CurrentStage: 3,
    RequestStatus: RequestStatus.HR_Review,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-01-10T09:00:00Z',
    Stage1DecisionBy: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
    Stage2Decision: StageDecision.Rejected,
    Stage2DecisionDate: '2026-01-15T11:00:00Z',
    Stage2DecisionBy: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
    Stage3Decision: StageDecision.Rejected,
    Stage3DecisionDate: '2026-01-20T13:00:00Z',
    Stage3DecisionBy: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' }
  }
];
