import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, StageDecision, ISPLookup } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IMyRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MyRequests: React.FC<IMyRequestsProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) {
      setError('Talent záznam nebyl nalezen.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    new MentoringService(sp).getMyRequests(talentId)
      .then(setRequests)
      .catch(() => setError('Nepodařilo se načíst žádosti.'))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  React.useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  if (requests.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Zatím nemáš žádné žádosti o mentoring.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Moje žádosti</h2>
      <div className={styles.requestList}>
        {requests.map(req => <RequestCard key={req.Id} request={req} />)}
      </div>
    </div>
  );
};

interface IRequestCardProps { request: IMentoringRequest; }

const RequestCard: React.FC<IRequestCardProps> = ({ request }) => {
  const stages: { mentor: ISPLookup; stage: 1 | 2 | 3 }[] = (
    [
      { mentor: request.Mentor1Ref, stage: 1 as const },
      { mentor: request.Mentor2Ref, stage: 2 as const },
      { mentor: request.Mentor3Ref, stage: 3 as const }
    ] as { mentor: ISPLookup | undefined; stage: 1 | 2 | 3 }[]
  ).filter((s): s is { mentor: ISPLookup; stage: 1 | 2 | 3 } => s.mentor != null);

  const getDecision = (stage: 1 | 2 | 3): StageDecision | undefined => {
    if (stage === 1) return request.Stage1Decision;
    if (stage === 2) return request.Stage2Decision;
    return request.Stage3Decision;
  };

  const getMentorStatus = (stage: 1 | 2 | 3): { label: string; className: string } => {
    const decision = getDecision(stage);

    if (request.RequestStatus === RequestStatus.Approved && decision === StageDecision.Approved) {
      return { label: 'Schváleno', className: styles.statusApproved };
    }
    if (decision === StageDecision.Rejected) {
      return { label: 'Zamítnuto', className: styles.statusCancelled };
    }
    if (request.CurrentStage === stage && request.RequestStatus === RequestStatus.Pending) {
      return { label: 'Čeká na schválení', className: styles.statusPending };
    }
    if (stage > request.CurrentStage && request.RequestStatus === RequestStatus.Pending) {
      return { label: 'Ve frontě', className: styles.statusQueued };
    }
    if (request.RequestStatus === RequestStatus.HR_Review) {
      return { label: 'Předáno na HR', className: styles.statusHR };
    }
    if (request.RequestStatus === RequestStatus.Scheduled) {
      return { label: 'Naplánováno', className: styles.statusScheduled };
    }
    if (request.RequestStatus === RequestStatus.Cancelled) {
      return { label: 'Zrušeno', className: styles.statusCancelled };
    }
    return { label: 'Čeká', className: styles.statusPending };
  };

  return (
    <div className={styles.requestCard}>
      {stages.map(({ mentor, stage }) => {
        const status = getMentorStatus(stage);
        return (
          <div key={stage} className={styles.myRequestMentorRow}>
            <span className={styles.myRequestMentorName}>
              Mentoring od {mentor.Title}
            </span>
            <span className={[styles.statusBadge, status.className].join(' ')}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MyRequests;
