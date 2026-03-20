import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IHRReviewQueueProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const HRReviewQueue: React.FC<IHRReviewQueueProps> = ({ sp }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState<number | null>(null);

  const loadData = React.useCallback(() => {
    setError(null);
    setActionError(null);
    setLoading(true);
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r => r.RequestStatus === RequestStatus.HR_Review)))
      .catch(() => setError('Nepodarilo se nacist HR frontu.'))
      .finally(() => setLoading(false));
  }, [sp]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const handleAction = async (reqId: number, newStatus: RequestStatus): Promise<void> => {
    setActionError(null);
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, newStatus);
      setRequests(prev => prev.filter(r => r.Id !== reqId));
    } catch {
      setActionError(
        newStatus === RequestStatus.Scheduled
          ? 'Nepodarilo se oznacit mentoring jako naplanovany.'
          : 'Nepodarilo se zrusit zadost.'
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className={styles.loading}>Nacitam HR frontu...</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  return (
    <div>
      <h2 className={styles.pageTitle}>HR Fronta ({requests.length})</h2>
      <p className={styles.sectionHint}>
        Zadosti odmitnute vsemi mentory vyzaduji rucni reseni HR.
      </p>

      {actionError && <ErrorBanner message={actionError} />}

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Fronta je prazdna. Zadne zadosti necekaji na HR.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => {
            const isProcessing = processing === req.Id;
            const mentors = [req.Mentor1Ref, req.Mentor2Ref, req.Mentor3Ref].filter(Boolean);

            return (
              <div key={req.Id} className={styles.hrReviewCard}>
                <div className={styles.hrReviewHeader}>
                  <span className={styles.requestTitle}>{req.Title}</span>
                  <span className={styles.talentName}>{req.TalentRef.Title}</span>
                </div>
                <div className={styles.requestMentors}>
                  {mentors.map((m, i) => m && (
                    <span key={i} className={[styles.mentorTag, styles.mentorTagRejected].join(' ')}>
                      #{i + 1} {m.Title}
                    </span>
                  ))}
                </div>
                <div className={styles.hrActionsBar}>
                  <button
                    className={styles.btnApprove}
                    disabled={isProcessing}
                    onClick={() => { void handleAction(req.Id, RequestStatus.Scheduled); }}
                  >
                    Naplanovat
                  </button>
                  <button
                    className={styles.btnReject}
                    disabled={isProcessing}
                    onClick={() => { void handleAction(req.Id, RequestStatus.Cancelled); }}
                  >
                    Zrusit zadost
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

export default HRReviewQueue;
