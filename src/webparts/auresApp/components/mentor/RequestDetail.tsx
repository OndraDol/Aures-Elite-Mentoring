import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, StageDecision, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';

interface IRequestDetailProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  requestId: number | undefined;
  hrEmails: string[];
}

const RequestDetail: React.FC<IRequestDetailProps> = ({ sp, currentUser, navigate, requestId, hrEmails }) => {
  const [request, setRequest] = React.useState<IMentoringRequest | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [deciding, setDeciding] = React.useState(false);
  const [decisionDone, setDecisionDone] = React.useState(false);

  const loadData = React.useCallback(() => {
    if (!requestId) {
      navigate('PendingRequests');
      return;
    }

    setError(null);
    setActionError(null);
    setLoading(true);
    new MentoringService(sp).getRequestById(requestId)
      .then(setRequest)
      .catch(() => setError('Nepodařilo se načíst detail žádosti.'))
      .finally(() => setLoading(false));
  }, [sp, requestId, navigate]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const mentorId = currentUser.mentorRecord?.Id;
  const myStage = request ? resolveActiveStage(request, mentorId) : null;

  const handleDecision = async (decision: StageDecision): Promise<void> => {
    if (!request || !myStage) return;

    setActionError(null);
    setDeciding(true);
    try {
      await new MentoringService(sp).makeDecision(
        request.Id,
        myStage,
        decision,
        currentUser.id
      );

      void sendDecisionNotification(sp, decision, request, myStage, currentUser, hrEmails);
      setDecisionDone(true);
      setTimeout(() => navigate('PendingRequests'), 1200);
    } catch {
      setActionError('Nepodařilo se uložit tvoje rozhodnutí. Zkus to znovu.');
    } finally {
      setDeciding(false);
    }
  };

  if (loading) return <div className={styles.loading}>Načítám detail žádosti...</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;
  if (!request) return <div className={styles.loading}>Žádost nenalezena.</div>;

  if (!myStage) {
    return (
      <div className={styles.requestDetailCard}>
        <p>Tato žádost momentálně nevyžaduje tvoje rozhodnutí.</p>
        <button className={styles.btnSecondary} onClick={() => navigate('PendingRequests')}>Zpět</button>
      </div>
    );
  }

  const myMessage = myStage === 1 ? request.Message1
    : myStage === 2 ? request.Message2
    : request.Message3;

  const nextMentorHint = resolveNextMentorHint(request, myStage);

  return (
    <div>
      <button className={styles.btnBack} onClick={() => navigate('PendingRequests')}>
        &larr; Zpět na seznam
      </button>

      <h2 className={styles.pageTitle}>{request.Title}</h2>

      {actionError && <ErrorBanner message={actionError} />}

      <div className={styles.requestDetailCard}>
        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Talent</p>
          <p className={styles.detailValue}>{request.TalentRef.Title}</p>
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Tvoje pozice v řetězu</p>
          <span className={styles.stageIndicator}>Mentor #{myStage}</span>
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Zpráva od talentu</p>
          <div className={styles.talentMessage}>
            {myMessage ?? '(žádná zpráva)'}
          </div>
        </div>

        {decisionDone ? (
          <div className={styles.decisionConfirm}>
            Rozhodnutí uloženo. Přesměrovávám...
          </div>
        ) : (
          <div className={styles.detailSection}>
            <p className={styles.detailLabel}>Tvoje rozhodnutí</p>
            <div className={styles.decisionBtns}>
              <button
                className={styles.btnApprove}
                disabled={deciding}
                onClick={() => { void handleDecision(StageDecision.Approved); }}
              >
                Schválit
              </button>
              <button
                className={styles.btnReject}
                disabled={deciding}
                onClick={() => { void handleDecision(StageDecision.Rejected); }}
              >
                Zamítnout
              </button>
            </div>
            {nextMentorHint && (
              <p className={styles.rejectHint}>{nextMentorHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function resolveActiveStage(req: IMentoringRequest, mentorId: number | undefined): 1 | 2 | 3 | null {
  if (!mentorId) return null;
  if (req.RequestStatus !== RequestStatus.Pending) return null;
  if (req.CurrentStage === 1 && req.Mentor1Ref?.Id === mentorId) return 1;
  if (req.CurrentStage === 2 && req.Mentor2Ref?.Id === mentorId) return 2;
  if (req.CurrentStage === 3 && req.Mentor3Ref?.Id === mentorId) return 3;
  return null;
}

function resolveNextMentorHint(req: IMentoringRequest, myStage: 1 | 2 | 3): string {
  if (myStage === 1 && req.Mentor2Ref) return `Při zamítnutí bude žádost předána ${req.Mentor2Ref.Title}.`;
  if (myStage === 2 && req.Mentor3Ref) return `Při zamítnutí bude žádost předána ${req.Mentor3Ref.Title}.`;
  return 'Při zamítnutí bude žádost předána na HR review.';
}

async function sendDecisionNotification(
  sp: SPFI,
  decision: StageDecision,
  request: IMentoringRequest,
  myStage: 1 | 2 | 3,
  currentUser: ICurrentUser,
  hrEmails: string[]
): Promise<void> {
  try {
    const svc = new MentoringService(sp);
    const ns = new NotificationService();
    const talent = await svc.getTalentById(request.TalentRef.Id);

    if (decision === StageDecision.Approved) {
      if (currentUser.mentorRecord) {
        await ns.notifyOnApproval(hrEmails, talent, currentUser.mentorRecord, request.Id, request.Title);
      }
    } else {
      const nextRef = myStage === 1 ? request.Mentor2Ref
        : myStage === 2 ? request.Mentor3Ref
        : undefined;

      if (!nextRef) {
        await ns.notifyHROnEscalation(hrEmails, talent, request.Id, request.Title);
      }
    }
  } catch {
    // Notifications are best-effort and must not break the decision flow.
  }
}

export default RequestDetail;
