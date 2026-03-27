import { ICurrentUser, IMentoringRequest, RequestStatus, UserRole } from '../../../services/interfaces';
import { AppView } from './AppView';

export interface INavigationTab {
  label: string;
  view: AppView;
}

const TALENT_TABS_BASE: INavigationTab[] = [
  { label: 'Katalog mentor\u016f', view: 'MentorCatalog' }
];

const TALENT_TABS_WITH_REQUESTS: INavigationTab[] = [
  { label: 'Katalog mentor\u016f', view: 'MentorCatalog' },
  { label: 'Moje \u017e\u00e1dosti', view: 'MyRequests' },
  { label: 'Zm\u011bna volby', view: 'ResetChoice' }
];

const MENTOR_TABS: INavigationTab[] = [
  { label: '\u010cekaj\u00edc\u00ed \u017e\u00e1dosti', view: 'PendingRequests' },
  { label: 'Historie', view: 'RequestHistory' }
];

const HR_TABS: INavigationTab[] = [
  { label: 'Mentees dashboard', view: 'MenteesDashboard' },
  { label: 'Domluven\u00e9 mentoringy', view: 'ApprovedMentorings' },
  { label: 'Mento\u0159i', view: 'MentorManagement' },
  { label: 'Spr\u00e1va talent\u016f', view: 'TalentManagement' },
  { label: 'Kapacita', view: 'CapacityDashboard' }
];

const NAVIGABLE_ROLES: UserRole[] = [UserRole.Talent, UserRole.Mentor, UserRole.HR];

const ACTIVE_REQUEST_STATUSES = new Set<RequestStatus>([
  RequestStatus.Pending,
  RequestStatus.Approved,
  RequestStatus.HR_Review,
  RequestStatus.Scheduled
]);

const TALENT_VIEWS: AppView[] = ['MentorCatalog', 'RequestForm', 'MyRequests', 'ResetChoice'];
const MENTOR_VIEWS: AppView[] = ['PendingRequests', 'RequestDetail', 'RequestHistory'];
const HR_VIEWS: AppView[] = ['MenteesDashboard', 'ApprovedMentorings', 'MentorManagement', 'TalentManagement', 'CapacityDashboard'];

export function resolveDefaultView(user: ICurrentUser): AppView {
  if (user.roles.includes(UserRole.Unknown) && user.roles.length === 1) return 'AccessDenied';
  if (user.roles.includes(UserRole.Talent)) return 'MentorCatalog';
  if (user.roles.includes(UserRole.Mentor)) return 'PendingRequests';
  if (user.roles.includes(UserRole.HR)) return 'MenteesDashboard';
  return 'AccessDenied';
}

export function resolveActiveRoleForView(view: AppView, roles: UserRole[]): UserRole {
  const matchedRole = getRoleForView(view);

  if (matchedRole && roles.includes(matchedRole)) {
    return matchedRole;
  }

  return roles.find(role => NAVIGABLE_ROLES.includes(role)) ?? UserRole.Unknown;
}

export function getTabsForRole(role: UserRole, hasActiveRequests?: boolean | null): INavigationTab[] {
  if (role === UserRole.Talent) {
    return hasActiveRequests === false ? TALENT_TABS_BASE : TALENT_TABS_WITH_REQUESTS;
  }

  if (role === UserRole.Mentor) return MENTOR_TABS;
  if (role === UserRole.HR) return HR_TABS;
  return [];
}

export function hasActiveTalentRequests(requests: Pick<IMentoringRequest, 'RequestStatus'>[]): boolean {
  return requests.some(request => ACTIVE_REQUEST_STATUSES.has(request.RequestStatus));
}

function getRoleForView(view: AppView): UserRole | undefined {
  if (TALENT_VIEWS.includes(view)) return UserRole.Talent;
  if (MENTOR_VIEWS.includes(view)) return UserRole.Mentor;
  if (HR_VIEWS.includes(view)) return UserRole.HR;
  return undefined;
}
