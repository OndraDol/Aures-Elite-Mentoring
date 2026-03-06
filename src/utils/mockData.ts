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
    Title: 'Jan Novak',
    MentorUser: { Id: 101, Title: 'Jan Novak', EMail: 'jan.novak@aures.cz' },
    JobTitle: 'CEO',
    Superpower: 'Strategicke mysleni a rozvoj lidi',
    Bio: 'Jan je CEO Aures Holdings s 20 lety zkusenosti v automobilovem prumyslu. Specializuje se na strategicky rust a budovani leadership tymu.',
    Capacity: 2,
    AvailabilityNote: 'Dostupny uterni odpoledne',
    IsActive: true
  },
  {
    Id: 2,
    Title: 'Petra Dvorakova',
    MentorUser: { Id: 102, Title: 'Petra Dvorakova', EMail: 'petra.dvorakova@aures.cz' },
    JobTitle: 'CFO',
    Superpower: 'Financni strategie a rizeni nakladovosti',
    Bio: 'Petra ridi finance skupiny Aures Holdings. Pomaha talentum pochopit business logiku a financni aspekty rozhodovani.',
    Capacity: 3,
    AvailabilityNote: 'Po domluve, preferuje ranni hodiny',
    IsActive: true
  },
  {
    Id: 3,
    Title: 'Martin Kolar',
    MentorUser: { Id: 103, Title: 'Martin Kolar', EMail: 'martin.kolar@aures.cz' },
    JobTitle: 'COO',
    Superpower: 'Operativni excelence a procesni zleprovani',
    Bio: 'Martin je zodpovedny za operace ve vsech pobockach. Specialista na lean management a efektivitu procesu.',
    Capacity: 2,
    AvailabilityNote: 'Plna kapacita — momentalne neprijima nove zadosti',
    IsActive: true
  },
  {
    Id: 4,
    Title: 'Lucie Horakova',
    MentorUser: { Id: 104, Title: 'Lucie Horakova', EMail: 'lucie.horakova@aures.cz' },
    JobTitle: 'VP Marketing',
    Superpower: 'Znacka, komunikace a customer experience',
    Bio: 'Lucie buduje znacku Aures po 10 let. Mentoruje v oblasti marketingu, prezentace a karierni prezentace.',
    Capacity: 4,
    AvailabilityNote: '',
    IsActive: true
  },
  {
    Id: 5,
    Title: 'Tomas Ruzicka',
    MentorUser: { Id: 105, Title: 'Tomas Ruzicka', EMail: 'tomas.ruzicka@aures.cz' },
    JobTitle: 'VP Sales',
    Superpower: 'Obchodni strategie a rozvoj tymu',
    Bio: 'Tomas vede obchodni tym Aures. Mentoruje v oblasti vyjednavani, prodejnich dovednosti a rizeni vztahu se zakazniky.',
    Capacity: 3,
    AvailabilityNote: 'Dostupny stredecni dopoledne',
    IsActive: false
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
    Mentor1Ref: { Id: 1, Title: 'Jan Novak' },
    Mentor2Ref: { Id: 2, Title: 'Petra Dvorakova' },
    Mentor3Ref: { Id: 4, Title: 'Lucie Horakova' },
    Message1: 'Chtela bych se naucit, jak prezentovat strategicke projekty top managementu. Vas pristup k leadershipu je pro me inspirujici.',
    Message2: 'Zajimam se o financni aspekty rozhodovani v ramci firmy.',
    Message3: 'Marketingova perspektiva by mi pomohla lepe prezentovat sve projekty.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Pending
  },
  {
    Id: 2,
    Title: 'REQ-2026-2',
    TalentRef: { Id: 2, Title: 'Ondrej Dostal' },
    Mentor1Ref: { Id: 3, Title: 'Martin Kolar' },
    Mentor2Ref: { Id: 5, Title: 'Tomas Ruzicka' },
    Message1: 'Chci se zdokonalit v operativnim rizeni a efektivite procesu.',
    Message2: 'Obchodni dovednosti jsou klic k memu karierni rozvoji.',
    CurrentStage: 2,
    RequestStatus: RequestStatus.Pending,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-02-15T10:30:00Z',
    Stage1DecisionBy: { Id: 103, Title: 'Martin Kolar', EMail: 'martin.kolar@aures.cz' }
  },
  {
    Id: 3,
    Title: 'REQ-2026-3',
    TalentRef: { Id: 3, Title: 'Katerina Simkova' },
    Mentor1Ref: { Id: 2, Title: 'Petra Dvorakova' },
    Message1: 'Chtela bych lepe rozumet financnim ukazatelum a jejich dopadu na strategicka rozhodnuti.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Approved,
    Stage1Decision: StageDecision.Approved,
    Stage1DecisionDate: '2026-02-20T14:00:00Z',
    Stage1DecisionBy: { Id: 102, Title: 'Petra Dvorakova', EMail: 'petra.dvorakova@aures.cz' }
  },
  {
    Id: 4,
    Title: 'REQ-2026-4',
    TalentRef: { Id: 1, Title: 'Eva Malkova' },
    Mentor1Ref: { Id: 3, Title: 'Martin Kolar' },
    Mentor2Ref: { Id: 5, Title: 'Tomas Ruzicka' },
    Mentor3Ref: { Id: 1, Title: 'Jan Novak' },
    Message1: 'Zajimajem se o procesy.',
    Message2: 'Obchod je moje vase.',
    Message3: 'Strategicke mysleni je to, co hledam.',
    CurrentStage: 3,
    RequestStatus: RequestStatus.HR_Review,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-01-10T09:00:00Z',
    Stage1DecisionBy: { Id: 103, Title: 'Martin Kolar', EMail: 'martin.kolar@aures.cz' },
    Stage2Decision: StageDecision.Rejected,
    Stage2DecisionDate: '2026-01-15T11:00:00Z',
    Stage2DecisionBy: { Id: 105, Title: 'Tomas Ruzicka', EMail: 'tomas.ruzicka@aures.cz' },
    Stage3Decision: StageDecision.Rejected,
    Stage3DecisionDate: '2026-01-20T13:00:00Z',
    Stage3DecisionBy: { Id: 101, Title: 'Jan Novak', EMail: 'jan.novak@aures.cz' }
  }
];
