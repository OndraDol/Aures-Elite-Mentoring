import { RequestStatus, UserRole } from '../../../services/interfaces';
import { getTabsForRole, hasActiveTalentRequests, resolveActiveRoleForView, resolveDefaultView } from './appNavigationState';

describe('appNavigationState', () => {
  const multiRoleUser = {
    id: 1,
    title: 'Ondrej Dolejs',
    email: 'ondrej.dolejs@auresholdings.eu',
    roles: [UserRole.Mentor, UserRole.Talent, UserRole.HR]
  };

  it('keeps the current talent-first default view for multi-role users', () => {
    expect(resolveDefaultView(multiRoleUser)).toBe('MentorCatalog');
  });

  it('matches a multi-role talent user to the talent shell on first load', () => {
    const activeRole = resolveActiveRoleForView('MentorCatalog', [UserRole.Mentor, UserRole.Talent]);

    expect(activeRole).toBe(UserRole.Talent);
    expect(getTabsForRole(activeRole, false).map(tab => tab.view)).toEqual(['MentorCatalog']);
    expect(getTabsForRole(activeRole, true).map(tab => tab.view)).toEqual([
      'MentorCatalog',
      'MyRequests',
      'ResetChoice'
    ]);
  });

  it('matches a mentor detail view to the mentor shell even when talent is listed first', () => {
    const activeRole = resolveActiveRoleForView('RequestDetail', [UserRole.Talent, UserRole.Mentor]);

    expect(activeRole).toBe(UserRole.Mentor);
    expect(getTabsForRole(activeRole).map(tab => tab.view)).toEqual([
      'PendingRequests',
      'RequestHistory'
    ]);
  });

  it('treats pending, approved, HR review and scheduled requests as active', () => {
    expect(hasActiveTalentRequests([{ RequestStatus: RequestStatus.Pending }])).toBe(true);
    expect(hasActiveTalentRequests([{ RequestStatus: RequestStatus.Approved }])).toBe(true);
    expect(hasActiveTalentRequests([{ RequestStatus: RequestStatus.HR_Review }])).toBe(true);
    expect(hasActiveTalentRequests([{ RequestStatus: RequestStatus.Scheduled }])).toBe(true);
    expect(hasActiveTalentRequests([{ RequestStatus: RequestStatus.Cancelled }])).toBe(false);
  });
});
