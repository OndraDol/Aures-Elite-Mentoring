import * as React from 'react';
import styles from './AuresApp.module.scss';
import { ICurrentUser, UserRole } from '../../../services/interfaces';
import { AppView, NavigateFn } from './AppView';

interface ITab { label: string; view: AppView; }

const TALENT_TABS: ITab[] = [
  { label: 'Katalog mentorů', view: 'MentorCatalog' },
  { label: 'Moje žádosti',    view: 'MyRequests'    },
];

const MENTOR_TABS: ITab[] = [
  { label: 'Čekající žádosti', view: 'PendingRequests' },
  { label: 'Historie',         view: 'RequestHistory'  },
];

const HR_TABS: ITab[] = [
  { label: 'Všechny žádosti', view: 'AllRequests'       },
  { label: 'HR Fronta',       view: 'HRReviewQueue'     },
  { label: 'Mentoři',         view: 'MentorManagement'  },
  { label: 'Talenti',         view: 'TalentManagement'  },
  { label: 'Kapacita',        view: 'CapacityDashboard' },
];

const ROLE_TABS: Partial<Record<UserRole, ITab[]>> = {
  [UserRole.Talent]: TALENT_TABS,
  [UserRole.Mentor]: MENTOR_TABS,
  [UserRole.HR]:     HR_TABS,
};

const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  [UserRole.Talent]: 'Talent',
  [UserRole.Mentor]: 'Mentor',
  [UserRole.HR]:     'HR Admin',
};

// Role s vlastnimi taby (v poradi priority)
const NAVIGABLE_ROLES: UserRole[] = [UserRole.Talent, UserRole.Mentor, UserRole.HR];

interface IAppShellProps {
  currentUser: ICurrentUser;
  currentView: AppView;
  navigate: NavigateFn;
  children: React.ReactNode;
  navBadges?: Partial<Record<AppView, number>>;
}

const AppShell: React.FC<IAppShellProps> = ({ currentUser, currentView, navigate, children, navBadges }) => {
  const navigableRoles = currentUser.roles.filter(r => NAVIGABLE_ROLES.includes(r));

  // Aktivni role — vychozi je ta s nejvyssi prioritou v NAVIGABLE_ROLES
  const [activeRole, setActiveRole] = React.useState<UserRole>(navigableRoles[0]);

  const tabs = ROLE_TABS[activeRole] ?? [];

  const handleRoleSwitch = (role: UserRole): void => {
    setActiveRole(role);
    const defaultTab = ROLE_TABS[role]?.[0];
    if (defaultTab) navigate(defaultTab.view);
  };

  return (
    <div className={styles.appShell}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.headerTitle}>Aures Elite Mentoring</span>
        <span className={styles.headerUser}>{currentUser.title}</span>
      </header>

      {/* Role switcher — jen pro uzivatele s vice rolemi */}
      {navigableRoles.length > 1 && (
        <div className={styles.roleSwitch}>
          {navigableRoles.map(role => (
            <button
              key={role}
              className={role === activeRole ? styles.roleBtnActive : styles.roleBtn}
              onClick={() => handleRoleSwitch(role)}
            >
              {ROLE_LABELS[role] ?? role}
            </button>
          ))}
        </div>
      )}

      {/* Navigacni taby */}
      <nav className={styles.nav}>
        {tabs.map(tab => {
          const badge = navBadges?.[tab.view] ?? 0;
          return (
            <button
              key={tab.view}
              className={currentView === tab.view ? styles.navTabActive : styles.navTab}
              onClick={() => navigate(tab.view)}
            >
              {tab.label}
              {badge > 0 && <span className={styles.navBadge}>{badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Obsah */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
