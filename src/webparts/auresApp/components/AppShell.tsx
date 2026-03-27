import * as React from 'react';
import styles from './AuresApp.module.scss';
import { ICurrentUser, UserRole } from '../../../services/interfaces';
import { AppView, NavigateFn } from './AppView';
import { getTabsForRole, INavigationTab, resolveActiveRoleForView } from './appNavigationState';

const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  [UserRole.Talent]: 'Talent',
  [UserRole.Mentor]: 'Mentor',
  [UserRole.HR]:     'HR Admin',
};

const NAVIGABLE_ROLES: UserRole[] = [UserRole.Talent, UserRole.Mentor, UserRole.HR];

interface IAppShellProps {
  currentUser: ICurrentUser;
  currentView: AppView;
  navigate: NavigateFn;
  children: React.ReactNode;
  navBadges?: Partial<Record<AppView, number>>;
  hasActiveRequests?: boolean | null;
}

const AppShell: React.FC<IAppShellProps> = ({
  currentUser, currentView, navigate, children, navBadges, hasActiveRequests
}) => {
  const navigableRoles = currentUser.roles.filter(r => NAVIGABLE_ROLES.includes(r));
  const resolvedActiveRole = resolveActiveRoleForView(currentView, navigableRoles);
  const [activeRole, setActiveRole] = React.useState<UserRole>(resolvedActiveRole);

  React.useEffect(() => {
    setActiveRole(resolvedActiveRole);
  }, [resolvedActiveRole]);

  const tabs: INavigationTab[] = getTabsForRole(activeRole, hasActiveRequests);

  const handleRoleSwitch = (role: UserRole): void => {
    setActiveRole(role);
    const defaultTab = getTabsForRole(role, hasActiveRequests)[0];
    if (defaultTab) navigate(defaultTab.view);
  };

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLogo}>AURES</div>
          <span className={styles.headerTitle}>
            <span className={styles.headerTitleAccent}>ELITE</span>
            {' MENTORING'}
          </span>
        </div>
        <span className={styles.headerUser}>{currentUser.title}</span>
      </header>

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

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
