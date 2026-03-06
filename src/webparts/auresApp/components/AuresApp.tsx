import * as React from 'react';
import { SPFI } from '@pnp/sp';
import styles from './AuresApp.module.scss';
import { IAuresAppProps } from './IAuresAppProps';
import { ICurrentUser, UserRole } from '../../../services/interfaces';
import { RoleService } from '../../../services/RoleService';
import { MentoringService } from '../../../services/MentoringService';
import { AppView, NavigateFn } from './AppView';
import AppShell from './AppShell';
import AccessDenied from './AccessDenied';
import MentorCatalog from './talent/MentorCatalog';
import RequestForm from './talent/RequestForm';
import MyRequests from './talent/MyRequests';
import PendingRequests from './mentor/PendingRequests';
import RequestDetail from './mentor/RequestDetail';
import RequestHistory from './mentor/RequestHistory';
import AllRequests from './hr/AllRequests';
import HRReviewQueue from './hr/HRReviewQueue';
import MentorManagement from './hr/MentorManagement';
import TalentManagement from './hr/TalentManagement';
import CapacityDashboard from './hr/CapacityDashboard';

const AuresApp: React.FC<IAuresAppProps> = ({ sp, hrEmail }) => {
  const [currentUser, setCurrentUser] = React.useState<ICurrentUser | null>(null);
  const [loading, setLoading]         = React.useState<boolean>(true);
  const [error, setError]             = React.useState<string | null>(null);
  const [view, setView]               = React.useState<AppView | null>(null);
  const [navParams, setNavParams]     = React.useState<Record<string, unknown>>({});
  const [navBadges, setNavBadges]     = React.useState<Partial<Record<AppView, number>>>({});

  React.useEffect(() => {
    const roleService = new RoleService(sp);
    roleService.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
        setView(resolveDefaultView(user));
        // Badge: nacti pocet cekajicich zadosti pro mentora
        if (user.roles.includes(UserRole.Mentor) && user.mentorRecord) {
          new MentoringService(sp).getPendingRequestsForMentor(user.mentorRecord.Id)
            .then(items => { if (items.length > 0) setNavBadges({ PendingRequests: items.length }); })
            .catch(() => { /* badge je best-effort */ });
        }
      })
      .catch(err => setError(err?.message ?? 'Neznama chyba'))
      .finally(() => setLoading(false));
  }, [sp]);

  const navigate: NavigateFn = React.useCallback(
    (nextView, params = {}) => {
      setView(nextView);
      setNavParams(params);
    },
    []
  );

  if (loading) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Načítám...</p></div>;
  }

  if (error) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Chyba při inicializaci: {error}</p></div>;
  }

  // Uzivatel nema zadnou platnou roli — AccessDenied bez shellu
  if (!currentUser || view === 'AccessDenied') {
    return (
      <div className={styles.auresApp}>
        <AccessDenied />
      </div>
    );
  }

  return (
    <div className={styles.auresApp}>
      <AppShell currentUser={currentUser} currentView={view!} navigate={navigate} navBadges={navBadges}>
        {renderView(view, currentUser, sp, navigate, navParams, hrEmail)}
      </AppShell>
    </div>
  );
};

// ----------------------------------------------------------------
// Vychozi view dle role
// ----------------------------------------------------------------
function resolveDefaultView(user: ICurrentUser): AppView {
  if (user.roles.includes(UserRole.Unknown) && user.roles.length === 1) return 'AccessDenied';
  if (user.roles.includes(UserRole.Talent))  return 'MentorCatalog';
  if (user.roles.includes(UserRole.Mentor))  return 'PendingRequests';
  if (user.roles.includes(UserRole.HR))      return 'AllRequests';
  return 'AccessDenied';
}

// ----------------------------------------------------------------
// Router
// ----------------------------------------------------------------
function renderView(
  view: AppView | null,
  currentUser: ICurrentUser,
  sp: SPFI,
  navigate: NavigateFn,
  params: Record<string, unknown>,
  hrEmail: string
): React.ReactElement {
  switch (view) {
    // Talent — Phase 3
    case 'MentorCatalog': return <MentorCatalog sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestForm':   return <RequestForm   sp={sp} currentUser={currentUser} navigate={navigate} preselectedMentorId={params.preselectedMentorId as number | undefined} />;
    case 'MyRequests':    return <MyRequests    sp={sp} currentUser={currentUser} navigate={navigate} />;
    // Mentor — Phase 4
    case 'PendingRequests': return <PendingRequests sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestDetail':   return <RequestDetail   sp={sp} currentUser={currentUser} navigate={navigate} requestId={params.requestId as number | undefined} hrEmail={hrEmail} />;
    case 'RequestHistory':  return <RequestHistory  sp={sp} currentUser={currentUser} navigate={navigate} />;
    // HR — Phase 5
    case 'AllRequests':       return <AllRequests      sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'HRReviewQueue':     return <HRReviewQueue    sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'MentorManagement':  return <MentorManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'TalentManagement':  return <TalentManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'CapacityDashboard': return <CapacityDashboard sp={sp} currentUser={currentUser} navigate={navigate} />;
    default:                  return <div>Nactivam...</div>;
  }
}

export default AuresApp;
