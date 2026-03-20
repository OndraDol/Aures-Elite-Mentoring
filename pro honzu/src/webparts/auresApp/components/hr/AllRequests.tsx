import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, StageDecision, ISPLookup } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IAllRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const AllRequests: React.FC<IAllRequestsProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [search, setSearch]     = React.useState('');
  const [loading, setLoading]   = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState<number | null>(null);

  const loadData = React.useCallback(() => {
    setError(null);
    setLoading(true);
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r =>
        r.RequestStatus === RequestStatus.Pending || r.RequestStatus === RequestStatus.HR_Review
      )))
      .catch(() => setError('Nepodařilo se načíst žádosti.'))
      .finally(() => setLoading(false));
  }, [sp]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const getCurrentMentor = (req: IMentoringRequest): ISPLookup | undefined => {
    if (req.CurrentStage === 1) return req.Mentor1Ref;
    if (req.CurrentStage === 2) return req.Mentor2Ref;
    if (req.CurrentStage === 3) return req.Mentor3Ref;
    return req.Mentor1Ref;
  };

  const getStatusLabel = (req: IMentoringRequest): string => {
    if (req.RequestStatus === RequestStatus.HR_Review) return 'Čeká na schválení HR';
    const mentor = getCurrentMentor(req);
    return `Čeká na schválení — ${mentor?.Title ?? 'mentor'}`;
  };

  const getStatusClass = (req: IMentoringRequest): string => {
    if (req.RequestStatus === RequestStatus.HR_Review) return styles.statusHR;
    return styles.statusPending;
  };

  const handleHRApprove = async (req: IMentoringRequest): Promise<void> => {
    setProcessing(req.Id);
    try {
      await new MentoringService(sp).makeDecision(
        req.Id, req.CurrentStage, StageDecision.Approved, currentUser.id
      );
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== req.Id));
    setProcessing(null);
  };

  const handleHRSchedule = async (reqId: number): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, RequestStatus.Scheduled);
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  const handleHRCancel = async (reqId: number): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, RequestStatus.Cancelled);
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  const filtered = requests.filter(r => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const mentor = getCurrentMentor(r);
    return r.TalentRef.Title.toLowerCase().includes(q)
      || (mentor?.Title ?? '').toLowerCase().includes(q);
  });

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  return (
    <div>
      <h2 className={styles.pageTitle}>Čekající žádosti ({requests.length})</h2>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Hledat talent nebo mentora…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Žádné žádosti nečekají na vyřízení.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {filtered.map(req => {
            const mentor = getCurrentMentor(req);
            const isProcessing = processing === req.Id;
            const isHRReview = req.RequestStatus === RequestStatus.HR_Review;

            return (
              <div key={req.Id} className={styles.hrRequestRow}>
                <div className={styles.hrRequestMain}>
                  <div className={styles.hrRequestNames}>
                    <span className={styles.hrRequestTalent}>{req.TalentRef.Title}</span>
                    <span className={styles.hrRequestArrow}>&rarr;</span>
                    <span className={styles.hrRequestMentor}>{mentor?.Title ?? '—'}</span>
                  </div>
                  <span className={[styles.statusBadge, getStatusClass(req)].join(' ')}>
                    {getStatusLabel(req)}
                  </span>
                </div>
                <div className={styles.hrRequestActions}>
                  {isHRReview ? (
                    <button
                      className={styles.hrActionBtn}
                      disabled={isProcessing}
                      onClick={() => { void handleHRSchedule(req.Id); }}
                      title="Naplánovat mentoring"
                    >
                      Naplánovat
                    </button>
                  ) : (
                    <button
                      className={styles.hrActionBtn}
                      disabled={isProcessing}
                      onClick={() => { void handleHRApprove(req); }}
                      title="Schválit za mentora"
                    >
                      Schválit
                    </button>
                  )}
                  <button
                    className={styles.hrActionBtnDanger}
                    disabled={isProcessing}
                    onClick={() => { void handleHRCancel(req.Id); }}
                    title="Zrušit žádost"
                  >
                    Zrušit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllRequests;
