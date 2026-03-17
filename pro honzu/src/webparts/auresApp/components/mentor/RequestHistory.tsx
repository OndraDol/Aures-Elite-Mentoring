import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IRequestHistoryProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MOCK_MENTOR_ID = 1; // Jan Novak — fallback pro lokalni dev

const RequestHistory: React.FC<IRequestHistoryProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const mentorId = currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID;

    // Fallback: zadosti kde mentor rozhodoval (ma zaznam Stage*DecisionBy nebo je v MentorXRef)
    const mockFallback = MOCK_REQUESTS.filter(r =>
      (r.Mentor1Ref?.Id === mentorId && r.Stage1Decision != null) ||
      (r.Mentor2Ref?.Id === mentorId && r.Stage2Decision != null) ||
      (r.Mentor3Ref?.Id === mentorId && r.Stage3Decision != null)
    );

    new MentoringService(sp).getRequestHistoryForMentor(mentorId)
      .then(setRequests)
      .catch(() => setRequests(mockFallback))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  if (loading) return <div className={styles.loading}>Načítám historii…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Moje rozhodnuti</h2>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Zatím jsi nerozhodoval žádné žádosti.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => (
            <HistoryRow
              key={req.Id}
              request={req}
              mentorId={currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// HistoryRow — jeden zaznam v historii rozhodnuti
// ----------------------------------------------------------------

interface IHistoryRowProps {
  request: IMentoringRequest;
  mentorId: number;
}

const HistoryRow: React.FC<IHistoryRowProps> = ({ request, mentorId }) => {
  const myDecision = resolveMyDecision(request, mentorId);
  const decisionDate = myDecision ? formatDate(getDecisionDate(request, myDecision.stage)) : '';

  return (
    <div className={styles.historyCard}>
      <div className={styles.historyLeft}>
        <p className={styles.historyTitle}>
          {request.Title} — {request.TalentRef.Title}
        </p>
        <p className={styles.historyMeta}>
          Mentor #{myDecision?.stage ?? '?'}{decisionDate ? ` · ${decisionDate}` : ''}
        </p>
      </div>
      {myDecision && (
        <span className={[
          styles.decisionBadge,
          myDecision.decision === StageDecision.Approved ? styles.decisionApproved : styles.decisionRejected
        ].join(' ')}>
          {myDecision.decision === StageDecision.Approved ? 'Schváleno' : 'Zamítnuto'}
        </span>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function resolveMyDecision(
  req: IMentoringRequest,
  mentorId: number
): { stage: 1 | 2 | 3; decision: StageDecision } | undefined {
  if (req.Mentor1Ref?.Id === mentorId && req.Stage1Decision != null)
    return { stage: 1, decision: req.Stage1Decision };
  if (req.Mentor2Ref?.Id === mentorId && req.Stage2Decision != null)
    return { stage: 2, decision: req.Stage2Decision };
  if (req.Mentor3Ref?.Id === mentorId && req.Stage3Decision != null)
    return { stage: 3, decision: req.Stage3Decision };
  return undefined;
}

function getDecisionDate(req: IMentoringRequest, stage: 1 | 2 | 3): string | undefined {
  if (stage === 1) return req.Stage1DecisionDate;
  if (stage === 2) return req.Stage2DecisionDate;
  return req.Stage3DecisionDate;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default RequestHistory;
