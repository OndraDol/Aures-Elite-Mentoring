// Vsechny mozne pohledy aplikace — pouzivano state-based routerem v AuresApp

export type AppView =
  // Talent
  | 'MentorCatalog'
  | 'RequestForm'
  | 'MyRequests'
  | 'ResetChoice'
  // Mentor
  | 'PendingRequests'
  | 'RequestDetail'
  | 'RequestHistory'
  // HR
  | 'MenteesDashboard'
  | 'AllRequests'
  | 'ApprovedMentorings'
  | 'HRReviewQueue'
  | 'MentorManagement'
  | 'TalentManagement'
  | 'CapacityDashboard'
  // System
  | 'AccessDenied';

/** Navigacni funkce predavana do child komponent */
export type NavigateFn = (view: AppView, params?: Record<string, unknown>) => void;

/** Props rozsirujici child komponenty o moznost navigace */
export interface INavigationProps {
  navigate: NavigateFn;
}
