import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IPendingRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const PendingRequests: React.FC<IPendingRequestsProps> = ({ sp, currentUser, navigate }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    const mentorId = currentUser.mentorRecord?.Id;
    if (!mentorId) {
      setError('Mentor záznam nebyl nalezen.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    new MentoringService(sp).getPendingRequestsForMentor(mentorId)
      .then(setRequests)
      .catch(() => setError('Nepodařilo se načíst žádosti.'))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  React.useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  return (
    <div>
      <h2 className={styles.pageTitle}>Čekající žádosti</h2>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Momentálně na tebe nečeká žádná žádost.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => (
            <PendingRow
              key={req.Id}
              request={req}
              mentorId={currentUser.mentorRecord!.Id}
              onClick={() => navigate('RequestDetail', { requestId: req.Id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// PendingRow — jeden radek cekajici zadosti
// ----------------------------------------------------------------

interface IPendingRowProps {
  request: IMentoringRequest;
  mentorId: number;
  onClick: () => void;
}

const PendingRow: React.FC<IPendingRowProps> = ({ request, mentorId, onClick }) => {
  const stage = resolveMyStage(request, mentorId);
  const message = stage === 1 ? request.Message1 : stage === 2 ? request.Message2 : request.Message3;
  const preview = message ? message.slice(0, 120) + (message.length > 120 ? '...' : '') : '';

  return (
    <div className={styles.pendingRow} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.pendingRowLeft}>
        <div className={styles.pendingRowHeader}>
          <span className={styles.requestTitle}>{request.Title}</span>
          <span className={styles.stageIndicator}>Mentor #{stage}</span>
        </div>
        <p className={styles.talentName}>{request.TalentRef.Title}</p>
        {preview && <p className={styles.messagePreview}>{preview}</p>}
      </div>
      <span className={styles.arrowIcon}>›</span>
    </div>
  );
};

function resolveMyStage(req: IMentoringRequest, mentorId: number): 1 | 2 | 3 {
  if (req.Mentor2Ref?.Id === mentorId && req.CurrentStage === 2) return 2;
  if (req.Mentor3Ref?.Id === mentorId && req.CurrentStage === 3) return 3;
  return 1;
}

export default PendingRequests;
