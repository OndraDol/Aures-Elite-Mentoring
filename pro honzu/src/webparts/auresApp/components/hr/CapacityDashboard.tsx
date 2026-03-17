import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, IMentoringRequest, ICurrentUser, RequestStatus, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS, MOCK_REQUESTS } from '../../../../utils/mockData';

interface ICapacityDashboardProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const CapacityDashboard: React.FC<ICapacityDashboardProps> = ({ sp }) => {
  const [mentors, setMentors]   = React.useState<IMentor[]>([]);
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const svc = new MentoringService(sp);
    Promise.all([svc.getMentors(), svc.getAllRequests()])
      .then(([m, r]) => { setMentors(m); setRequests(r); })
      .catch(() => {
        setMentors(MOCK_MENTORS.filter(m => m.IsActive));
        setRequests(MOCK_REQUESTS);
      })
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám dashboard…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Kapacitní dashboard</h2>
      <div className={styles.capacityList}>
        {mentors.map(mentor => {
          const approved  = countApproved(mentor.Id, requests);
          const remaining = Math.max(0, mentor.Capacity - approved);
          const pct       = mentor.Capacity > 0
            ? Math.min(100, Math.round((approved / mentor.Capacity) * 100))
            : 100;
          const barClass  = pct >= 100 ? styles.barFull : pct >= 75 ? styles.barHigh : styles.barOk;

          return (
            <div key={mentor.Id} className={styles.capacityRow}>
              <div className={styles.capacityMentorInfo}>
                <p className={styles.managementName}>{mentor.Title}</p>
                <p className={styles.managementMeta}>{mentor.JobTitle}</p>
              </div>
              <div className={styles.capacityStats}>
                <span className={styles.capacityStat}>{approved} / {mentor.Capacity}</span>
                <span className={[
                  styles.capacityRemaining,
                  remaining === 0 ? styles.capacityFull : ''
                ].filter(Boolean).join(' ')}>
                  {remaining > 0 ? `${remaining} volných` : 'Plno'}
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

function countApproved(mentorId: number, reqs: IMentoringRequest[]): number {
  return reqs.filter(r =>
    r.RequestStatus === RequestStatus.Approved && (
      (r.Mentor1Ref?.Id === mentorId && r.Stage1Decision === StageDecision.Approved) ||
      (r.Mentor2Ref?.Id === mentorId && r.Stage2Decision === StageDecision.Approved) ||
      (r.Mentor3Ref?.Id === mentorId && r.Stage3Decision === StageDecision.Approved)
    )
  ).length;
}

export default CapacityDashboard;
