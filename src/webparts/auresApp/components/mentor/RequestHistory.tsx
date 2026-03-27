import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IRequestHistoryProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const RequestHistory: React.FC<IRequestHistoryProps> = ({ sp, currentUser }) => {
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
    new MentoringService(sp).getRequestHistoryForMentor(mentorId)
      .then(setRequests)
      .catch(() => setError('Nepodařilo se načíst historii.'))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  React.useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className={styles.loading}>Načítám historii…</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

  return (
    <div>
      <h2 className={styles.pageTitle}>Moje rozhodnutí</h2>

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
              mentorId={currentUser.mentorRecord!.Id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// HistoryRow — jeden záznam v historii rozhodnutí
// ----------------------------------------------------------------

interface IHistoryRowProps {
  request: IMentoringRequest;
  mentorId: number;
}

function HistoryRow({ request, mentorId }: IHistoryRowProps): React.ReactElement {
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
}

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
