import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IHRReviewQueueProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const HRReviewQueue: React.FC<IHRReviewQueueProps> = ({ sp }) => {
  const [requests, setRequests]     = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [processing, setProcessing] = React.useState<number | null>(null);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r => r.RequestStatus === RequestStatus.HR_Review)))
      .catch(() => setRequests(MOCK_REQUESTS.filter(r => r.RequestStatus === RequestStatus.HR_Review)))
      .finally(() => setLoading(false));
  }, [sp]);

  const handleAction = async (reqId: number, newStatus: RequestStatus): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, newStatus);
    } catch {
      // lokalni dev — ignoruj chybu SP
    }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  if (loading) return <div className={styles.loading}>Načítám HR frontu…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>HR Fronta ({requests.length})</h2>
      <p className={styles.sectionHint}>
        Žádosti odmítnuté všemi mentory — vyžadují ruční řešení HR.
      </p>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Fronta je prázdná. Žádné žádosti nečekají na HR.</p>
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
                    Naplánovat
                  </button>
                  <button
                    className={styles.btnReject}
                    disabled={isProcessing}
                    onClick={() => { void handleAction(req.Id, RequestStatus.Cancelled); }}
                  >
                    Zrušit žádost
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
