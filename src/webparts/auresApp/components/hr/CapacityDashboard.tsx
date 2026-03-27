import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, IMentoringRequest, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';
import { countCapacityRequests } from './capacityDashboardHelpers';

interface ICapacityDashboardProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const CapacityDashboard: React.FC<ICapacityDashboardProps> = ({ sp }) => {
  const [mentors, setMentors]   = React.useState<IMentor[]>([]);
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    setError(null);
    setLoading(true);
    const svc = new MentoringService(sp);
    Promise.all([svc.getMentors(), svc.getAllRequests()])
      .then(([m, r]) => { setMentors(m); setRequests(r); })
      .catch(() => setError('NepodaĹ™ilo se naÄŤĂ­st kapacitnĂ­ dashboard.'))
      .finally(() => setLoading(false));
  }, [sp]);

  React.useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className={styles.loading}>NaÄŤĂ­tĂˇm dashboardâ€¦</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  return (
    <div>
      <h2 className={styles.pageTitle}>KapacitnĂ­ dashboard</h2>
      <div className={styles.capacityList}>
        {mentors.map(mentor => {
          const occupied  = countCapacityRequests(mentor.Id, requests);
          const remaining = Math.max(0, mentor.Capacity - occupied);
          const pct       = mentor.Capacity > 0
            ? Math.min(100, Math.round((occupied / mentor.Capacity) * 100))
            : 100;
          const barClass  = pct >= 100 ? styles.barFull : pct >= 75 ? styles.barHigh : styles.barOk;

          return (
            <div key={mentor.Id} className={styles.capacityRow}>
              <div className={styles.capacityMentorInfo}>
                <p className={styles.managementName}>{mentor.Title}</p>
                <p className={styles.managementMeta}>{mentor.JobTitle}</p>
              </div>
              <div className={styles.capacityStats}>
                <span className={styles.capacityStat}>{occupied} / {mentor.Capacity}</span>
                <span className={[
                  styles.capacityRemaining,
                  remaining === 0 ? styles.capacityFull : ''
                ].filter(Boolean).join(' ')}>
                  {remaining > 0 ? `${remaining} volnĂ˝ch` : 'Plno'}
                </span>
              </div>
              <div className={styles.capacityBarWrap}>
                <div
                  className={[styles.capacityBarFill, barClass].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CapacityDashboard;
