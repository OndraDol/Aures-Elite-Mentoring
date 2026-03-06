import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, StageDecision, ISPLookup } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IMyRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.Pending]:   'Čeká na vyjádření',
  [RequestStatus.Approved]:  'Schváleno',
  [RequestStatus.HR_Review]: 'Předáno na HR',
  [RequestStatus.Scheduled]: 'Naplánováno',
  [RequestStatus.Cancelled]: 'Zrušeno'
};

const STATUS_CLASS: Record<RequestStatus, string> = {
  [RequestStatus.Pending]:   styles.statusPending,
  [RequestStatus.Approved]:  styles.statusApproved,
  [RequestStatus.HR_Review]: styles.statusHR,
  [RequestStatus.Scheduled]: styles.statusScheduled,
  [RequestStatus.Cancelled]: styles.statusCancelled
};

const MyRequests: React.FC<IMyRequestsProps> = ({ sp, currentUser, navigate }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) {
      setRequests(MOCK_REQUESTS.filter(r => r.TalentRef.Id === 1));
      setLoading(false);
      return;
    }
    new MentoringService(sp).getMyRequests(talentId)
      .then(setRequests)
      .catch(() => setRequests(MOCK_REQUESTS.filter(r => r.TalentRef.Id === talentId)))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Moje žádosti</h2>
        <button className={styles.btnPrimary} onClick={() => navigate('MentorCatalog')}>
          + Nová žádost
        </button>
      </div>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Zatím nemáš žádné žádosti o mentoring.</p>
          <button
            className={styles.btnPrimary}
            style={{ marginTop: 16 }}
            onClick={() => navigate('MentorCatalog')}
          >
            Vybrat mentora
          </button>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => <RequestRow key={req.Id} request={req} />)}
        </div>
      )}
    </div>
  );
};

interface IRequestRowProps { request: IMentoringRequest; }

const RequestRow: React.FC<IRequestRowProps> = ({ request }) => {
  const stages: { mentor: ISPLookup; stage: 1 | 2 | 3 }[] = (
    [
      { mentor: request.Mentor1Ref, stage: 1 as const },
      { mentor: request.Mentor2Ref, stage: 2 as const },
      { mentor: request.Mentor3Ref, stage: 3 as const }
    ] as { mentor: ISPLookup | undefined; stage: 1 | 2 | 3 }[]
  ).filter((s): s is { mentor: ISPLookup; stage: 1 | 2 | 3 } => s.mentor != null);

  const getDecision = (stage: 1 | 2 | 3) => {
    if (stage === 1) return request.Stage1Decision;
    if (stage === 2) return request.Stage2Decision;
    return request.Stage3Decision;
  };

  const getMentorTagClass = (stage: 1 | 2 | 3): string => {
    const d = getDecision(stage);
    if (d === StageDecision.Approved) return [styles.mentorTag, styles.mentorTagApproved].join(' ');
    if (d === StageDecision.Rejected) return [styles.mentorTag, styles.mentorTagRejected].join(' ');
    if (request.CurrentStage === stage && request.RequestStatus === RequestStatus.Pending)
      return [styles.mentorTag, styles.mentorTagCurrent].join(' ');
    return styles.mentorTag;
  };

  return (
    <div className={styles.requestCard}>
      <div className={styles.requestCardHeader}>
        <p className={styles.requestTitle}>{request.Title}</p>
        <span className={[styles.statusBadge, STATUS_CLASS[request.RequestStatus]].join(' ')}>
          {STATUS_LABEL[request.RequestStatus]}
        </span>
      </div>
      <div className={styles.requestMentors}>
        {stages.map(({ mentor, stage }) => (
          <span key={stage} className={getMentorTagClass(stage)}>
            #{stage} {mentor.Title}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
