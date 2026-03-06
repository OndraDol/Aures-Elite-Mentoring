import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

type StatusFilter = RequestStatus | 'All';

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'All',                      label: 'Vše' },
  { value: RequestStatus.Pending,      label: 'Čeká' },
  { value: RequestStatus.Approved,     label: 'Schváleno' },
  { value: RequestStatus.HR_Review,    label: 'HR Fronta' },
  { value: RequestStatus.Scheduled,    label: 'Naplánováno' },
  { value: RequestStatus.Cancelled,    label: 'Zrušeno' },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.Pending]:   'Čeká',
  [RequestStatus.Approved]:  'Schváleno',
  [RequestStatus.HR_Review]: 'HR Fronta',
  [RequestStatus.Scheduled]: 'Naplánováno',
  [RequestStatus.Cancelled]: 'Zrušeno',
};

const STATUS_CLASS: Record<RequestStatus, string> = {
  [RequestStatus.Pending]:   styles.statusPending,
  [RequestStatus.Approved]:  styles.statusApproved,
  [RequestStatus.HR_Review]: styles.statusHR,
  [RequestStatus.Scheduled]: styles.statusScheduled,
  [RequestStatus.Cancelled]: styles.statusCancelled,
};

interface IAllRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const AllRequests: React.FC<IAllRequestsProps> = ({ sp }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [filter, setFilter]     = React.useState<StatusFilter>('All');
  const [search, setSearch]     = React.useState('');
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(setRequests)
      .catch(() => setRequests(MOCK_REQUESTS))
      .finally(() => setLoading(false));
  }, [sp]);

  const filtered = requests.filter(r => {
    if (filter !== 'All' && r.RequestStatus !== filter) return false;
    const q = search.trim().toLowerCase();
    if (q && !r.Title.toLowerCase().includes(q) && !r.TalentRef.Title.toLowerCase().includes(q)) return false;
    return true;
  });

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Všechny žádosti ({requests.length})</h2>

      {/* Filtry + hledani */}
      <div className={styles.filterRow}>
        <div className={styles.filterBar}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={filter === f.value ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Hledat talent nebo ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Vysledky */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}><p>Žádné žádosti neodpovídají filtru.</p></div>
      ) : (
        <div className={styles.requestList}>
          {filtered.map(req => (
            <div key={req.Id} className={styles.allRequestRow}>
              <div className={styles.allRequestMain}>
                <span className={styles.requestTitle}>{req.Title}</span>
                <span className={styles.talentName}>{req.TalentRef.Title}</span>
              </div>
              <div className={styles.allRequestMeta}>
                <span className={styles.stageIndicator}>Stage {req.CurrentStage}</span>
                <span className={[styles.statusBadge, STATUS_CLASS[req.RequestStatus]].join(' ')}>
                  {STATUS_LABEL[req.RequestStatus]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRequests;
