import * as React from 'react';
import { SPFI } from '@pnp/sp';
import styles from './AuresApp.module.scss';
import { IAuresAppProps } from './IAuresAppProps';
import { ICurrentUser, UserRole } from '../../../services/interfaces';
import { RoleService } from '../../../services/RoleService';
import { MentoringService } from '../../../services/MentoringService';
import { AppView, NavigateFn } from './AppView';
import { hasActiveTalentRequests, resolveDefaultView } from './appNavigationState';
import AppShell from './AppShell';
import AccessDenied from './AccessDenied';
import ErrorBanner from './shared/ErrorBanner';
import MentorCatalog from './talent/MentorCatalog';
import RequestForm from './talent/RequestForm';
import MyRequests from './talent/MyRequests';
import ResetChoice from './talent/ResetChoice';
import PendingRequests from './mentor/PendingRequests';
import RequestDetail from './mentor/RequestDetail';
import RequestHistory from './mentor/RequestHistory';
import MenteesDashboard from './hr/MenteesDashboard';
import ApprovedMentorings from './hr/ApprovedMentorings';
import MentorManagement from './hr/MentorManagement';
import TalentManagement from './hr/TalentManagement';
import CapacityDashboard from './hr/CapacityDashboard';

const AuresApp: React.FC<IAuresAppProps> = ({ sp, hrEmails }) => {
  const [currentUser, setCurrentUser] = React.useState<ICurrentUser | null>(null);
  const [loading, setLoading]         = React.useState<boolean>(true);
  const [error, setError]             = React.useState<string | null>(null);
  const [view, setView]               = React.useState<AppView | null>(null);
  const [navParams, setNavParams]     = React.useState<Record<string, unknown>>({});
  const [navBadges, setNavBadges]     = React.useState<Partial<Record<AppView, number>>>({});
  const [hasActiveRequests, setHasActiveRequests] = React.useState<boolean | null>(null);
  const [requestStateError, setRequestStateError] = React.useState<string | null>(null);

  const checkActiveRequests = React.useCallback(async (user: ICurrentUser): Promise<void> => {
    if (!user.roles.includes(UserRole.Talent) || !user.talentRecord) {
      setHasActiveRequests(false);
      setRequestStateError(null);
      return;
    }
    setHasActiveRequests(null);
    setRequestStateError(null);
    try {
      const requests = await new MentoringService(sp).getMyRequests(user.talentRecord.Id);
      setHasActiveRequests(hasActiveTalentRequests(requests));
      setRequestStateError(null);
    } catch {
      setHasActiveRequests(null);
      setRequestStateError(
        'Nepodařilo se ověřit stav tvých žádostí. Talent záložky zůstávají dostupné, ale data mohou být neúplná.'
      );
    }
  }, [sp]);

  React.useEffect(() => {
    const roleService = new RoleService(sp, hrEmails);
    roleService.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
        setView(resolveDefaultView(user));
        void checkActiveRequests(user);
        if (user.roles.includes(UserRole.Mentor) && user.mentorRecord) {
          new MentoringService(sp).getPendingRequestsForMentor(user.mentorRecord.Id)
            .then(items => { if (items.length > 0) setNavBadges({ PendingRequests: items.length }); })
            .catch(() => { /* best-effort */ });
        }
      })
      .catch(err => setError(err?.message ?? 'Neznámá chyba'))
      .finally(() => setLoading(false));
  }, [sp, checkActiveRequests]);

  const navigate: NavigateFn = React.useCallback(
    (nextView, params = {}) => {
      setView(nextView);
      setNavParams(params);
    },
    []
  );

  const handleRequestsChanged = React.useCallback(async (): Promise<void> => {
    if (currentUser) {
      await checkActiveRequests(currentUser);
    }
  }, [currentUser, checkActiveRequests]);

  if (loading) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Načítám...</p></div>;
  }

  if (error) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Chyba při inicializaci: {error}</p></div>;
  }

  if (!currentUser || view === 'AccessDenied') {
    return (
      <div className={styles.auresApp}>
        <AccessDenied />
      </div>
    );
  }

  return (
    <div className={styles.auresApp}>
      <AppShell
        currentUser={currentUser}
        currentView={view!}
        navigate={navigate}
        navBadges={navBadges}
        hasActiveRequests={hasActiveRequests}
      >
        <>
          {requestStateError && (
            <ErrorBanner
              message={requestStateError}
              onRetry={() => { void checkActiveRequests(currentUser); }}
            />
          )}
          {renderView(view, currentUser, sp, navigate, navParams, hrEmails, handleRequestsChanged)}
        </>
      </AppShell>
    </div>
  );
};

function renderView(
  view: AppView | null,
  currentUser: ICurrentUser,
  sp: SPFI,
  navigate: NavigateFn,
  params: Record<string, unknown>,
  hrEmails: string[],
  onRequestsChanged: () => Promise<void>
): React.ReactElement {
  switch (view) {
    // Talent
    case 'MentorCatalog': return <MentorCatalog sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestForm':   return <RequestForm   sp={sp} currentUser={currentUser} navigate={navigate} hrEmails={hrEmails} onRequestsChanged={onRequestsChanged} preselectedMentorId={params.preselectedMentorId as number | undefined} />;
    case 'MyRequests':    return <MyRequests    sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'ResetChoice':   return <ResetChoice  sp={sp} currentUser={currentUser} navigate={navigate} onRequestsChanged={onRequestsChanged} />;
    // Mentor
    case 'PendingRequests': return <PendingRequests sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestDetail':   return <RequestDetail   sp={sp} currentUser={currentUser} navigate={navigate} requestId={params.requestId as number | undefined} hrEmails={hrEmails} />;
    case 'RequestHistory':  return <RequestHistory  sp={sp} currentUser={currentUser} navigate={navigate} />;
    // HR
    case 'MenteesDashboard': return <MenteesDashboard sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'ApprovedMentorings': return <ApprovedMentorings sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'MentorManagement':  return <MentorManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'TalentManagement':  return <TalentManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'CapacityDashboard': return <CapacityDashboard sp={sp} currentUser={currentUser} navigate={navigate} />;
    default:                  return <div>Načítám...</div>;
  }
}

export default AuresApp;
