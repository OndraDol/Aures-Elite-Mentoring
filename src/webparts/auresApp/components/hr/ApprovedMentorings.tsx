import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, ISPLookup, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IApprovedMentoringsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const ApprovedMentorings: React.FC<IApprovedMentoringsProps> = ({ sp }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r =>
        r.RequestStatus === RequestStatus.Approved || r.RequestStatus === RequestStatus.Scheduled
      )))
      .catch(() => setRequests(MOCK_REQUESTS.filter(r =>
        r.RequestStatus === RequestStatus.Approved || r.RequestStatus === RequestStatus.Scheduled
      )))
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám domluvené mentoringy…</div>;

  const getApprovedMentor = (req: IMentoringRequest): ISPLookup | undefined => {
    if (req.Stage1Decision === StageDecision.Approved) return req.Mentor1Ref;
    if (req.Stage2Decision === StageDecision.Approved) return req.Mentor2Ref;
    if (req.Stage3Decision === StageDecision.Approved) return req.Mentor3Ref;
    return undefined;
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Domluvené mentoringy ({requests.length})</h2>
      <p className={styles.sectionHint}>
        Přehled schválených mentorských párů. Další koordinaci řeší HR mimo systém.
      </p>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Zatím nejsou žádné domluvené mentoringy.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => {
            const mentor = getApprovedMentor(req);
            return (
              <div key={req.Id} className={styles.approvedPairRow}>
                <div className={styles.approvedPairInfo}>
                  <span className={styles.approvedPairTalent}>{req.TalentRef.Title}</span>
                  <span className={styles.approvedPairArrow}>&harr;</span>
                  <span className={styles.approvedPairMentor}>{mentor?.Title ?? '—'}</span>
                </div>
                <span className={[
                  styles.statusBadge,
                  req.RequestStatus === RequestStatus.Scheduled ? styles.statusScheduled : styles.statusApproved
                ].join(' ')}>
                  {req.RequestStatus === RequestStatus.Scheduled ? 'Naplánováno' : 'Schváleno'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovedMentorings;
