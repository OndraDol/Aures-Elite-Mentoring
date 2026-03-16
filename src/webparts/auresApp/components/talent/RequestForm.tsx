import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { GraphFI } from '@pnp/graph';
import { IMentor, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS, MOCK_REQUESTS } from '../../../../utils/mockData';

interface IRequestFormProps {
  sp: SPFI;
  graph: GraphFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  hrEmail: string;
  preselectedMentorId?: number;
}

const RequestForm: React.FC<IRequestFormProps> = ({ sp, graph, currentUser, navigate, hrEmail, preselectedMentorId }) => {
  const [mentors, setMentors]       = React.useState<IMentor[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [submitting, setSubmitting]       = React.useState(false);
  const [error, setError]                 = React.useState<string | null>(null);
  const [hasActiveRequest, setHasActiveRequest] = React.useState(false);

  const [secondaryId, setSecondaryId] = React.useState<number | null>(null);
  const [tertiaryId, setTertiaryId]   = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    const talentId = currentUser.talentRecord?.Id;
    const svc = new MentoringService(sp);
    Promise.all([
      svc.getMentors(),
      talentId ? svc.getMyRequests(talentId) : Promise.resolve([])
    ])
      .then(([mentorsData, myReqs]) => {
        setMentors(mentorsData);
        const active = myReqs.some(r =>
          ([RequestStatus.Pending, RequestStatus.Approved, RequestStatus.HR_Review, RequestStatus.Scheduled] as string[]).includes(r.RequestStatus)
        );
        setHasActiveRequest(active);
      })
      .catch(() => {
        setMentors(MOCK_MENTORS.filter(m => m.IsActive));
        const active = MOCK_REQUESTS.some(r =>
          r.TalentRef?.Id === talentId &&
          ([RequestStatus.Pending, RequestStatus.Approved, RequestStatus.HR_Review, RequestStatus.Scheduled] as string[]).includes(r.RequestStatus)
        );
        setHasActiveRequest(active);
      })
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  const setMessage = (mentorId: number, msg: string): void => {
    setMessages(prev => ({ ...prev, [mentorId]: msg }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!preselectedMentorId) {
      setError('Nebyl zvolen primární mentor.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const talentId = currentUser.talentRecord?.Id ?? 0;
      const mentorIds: [number, number?, number?] = [
        preselectedMentorId,
        secondaryId ?? undefined,
        tertiaryId ?? undefined
      ];
      const msgs: [string, string?, string?] = [
        (messages[preselectedMentorId] ?? '').trim(),
        secondaryId != null ? (messages[secondaryId] ?? '').trim() : undefined,
        tertiaryId != null ? (messages[tertiaryId] ?? '').trim() : undefined
      ];
      const newId = await new MentoringService(sp).submitRequest(talentId, mentorIds, msgs);
      void (async () => {
        try {
          const mentor1 = mentors.find(m => m.Id === preselectedMentorId);
          if (mentor1 && currentUser.talentRecord) {
            await new NotificationService(graph).notifyHROnSubmit(
              hrEmail, currentUser.talentRecord, mentor1, newId, `REQ-2026-${newId}`
            );
          }
        } catch { /* best-effort */ }
      })();
      navigate('MyRequests');
    } catch {
      setError('Nepodařilo se odeslat žádost. Zkus to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  if (hasActiveRequest) {
    return (
      <div className={styles.emptyState}>
        <p>Již máš aktivní žádost o mentoring. Pokud chceš podat novou, musíš svou volbu nejprve resetovat.</p>
        <button className={styles.btnPrimary} onClick={() => navigate('MyRequests')}>Přejít na Moje žádosti</button>
      </div>
    );
  }

  const primaryMentor = mentors.find(m => m.Id === preselectedMentorId);
  const otherMentors = mentors.filter(m => m.Id !== preselectedMentorId);

  if (!primaryMentor) {
    return (
      <div className={styles.emptyState}>
        <p>Mentor nebyl nalezen.</p>
        <button className={styles.btnPrimary} onClick={() => navigate('MentorCatalog')}>
          Zpět na katalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.requestForm}>
      <h2 className={styles.pageTitle}>Nová žádost o mentoring</h2>

      {/* 1. Primary Mentor — prominent */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Tvůj vybraný mentor</h3>
        <div className={styles.primaryMentorCard}>
          <div className={styles.primaryMentorHeader}>
            <div className={styles.primaryMentorAvatar}>{getInitials(primaryMentor.Title)}</div>
            <div className={styles.primaryMentorInfo}>
              <p className={styles.primaryMentorName}>{primaryMentor.Title}</p>
              <p className={styles.primaryMentorJobTitle}>{primaryMentor.JobTitle}</p>
              <p className={styles.primaryMentorSuperpower}>{primaryMentor.Superpower}</p>
            </div>
            <span className={styles.primaryMentorBadge}>Primární mentor</span>
          </div>
          <p className={styles.primaryMentorBio}>{primaryMentor.Bio}</p>
        </div>
      </div>

      {/* 2. Backup mentors */}
      {otherMentors.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Záložní mentoři</h3>
          <p className={styles.formSectionHint}>
            Pokud vybraný mentor nebude mít kapacitu, systém automaticky osloví záložního mentora.
            Vyber si sekundárního a případně terciálního mentora.
          </p>
          <div className={styles.backupMentorList}>
            {otherMentors.map(mentor => {
              const isSecondary = secondaryId === mentor.Id;
              const isTertiary = tertiaryId === mentor.Id;
              const isSelected = isSecondary || isTertiary;

              return (
                <div
                  key={mentor.Id}
                  className={[
                    styles.backupMentorRow,
                    isSelected ? styles.backupMentorRowSelected : ''
                  ].filter(Boolean).join(' ')}
                >
                  <div className={styles.backupMentorInfo}>
                    <div className={styles.mentorAvatar}>{getInitials(mentor.Title)}</div>
                    <div>
                      <p className={styles.mentorSelectName}>{mentor.Title}</p>
                      <p className={styles.mentorSelectJobTitle}>
                        {mentor.JobTitle} · {mentor.Superpower}
                      </p>
                    </div>
                  </div>
                  <div className={styles.backupMentorActions}>
                    {isSecondary && <span className={styles.backupMentorLabel}>Sekundární</span>}
                    {isTertiary && <span className={styles.backupMentorLabelTertiary}>Terciální</span>}
                    {isSelected ? (
                      <button
                        className={styles.btnSecondary}
                        onClick={() => {
                          if (isSecondary) { setSecondaryId(tertiaryId); setTertiaryId(null); }
                          else { setTertiaryId(null); }
                        }}
                      >
                        Odebrat
                      </button>
                    ) : (
                      <button
                        className={styles.btnSecondary}
                        disabled={secondaryId !== null && tertiaryId !== null}
                        onClick={() => {
                          if (secondaryId === null) setSecondaryId(mentor.Id);
                          else if (tertiaryId === null) setTertiaryId(mentor.Id);
                        }}
                      >
                        {secondaryId === null ? 'Zvolit jako sekundárního' : 'Zvolit jako terciálního'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Optional messages */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Zprávy mentorům</h3>
        <p className={styles.formSectionHint}>
          Pokud chceš, můžeš mentorovi napsat zprávu — proč máš o něj zájem,
          co od mentoringu očekáváš, nebo cokoliv dalšího. Zpráva není povinná.
        </p>

        <div className={styles.messageGroup}>
          <label className={styles.messageLabel}>
            Zpráva pro {primaryMentor.Title} (primární)
          </label>
          <textarea
            className={styles.messageTextarea}
            value={messages[primaryMentor.Id] ?? ''}
            onChange={e => setMessage(primaryMentor.Id, e.target.value)}
            placeholder={`Napiš, proč tě zajímá mentoring od ${primaryMentor.Title}…`}
            rows={3}
          />
        </div>

        {secondaryId != null && (() => {
          const m = mentors.find(x => x.Id === secondaryId);
          return m ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {m.Title} (sekundární)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[secondaryId] ?? ''}
                onChange={e => setMessage(secondaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${m.Title}…`}
                rows={3}
              />
            </div>
          ) : null;
        })()}

        {tertiaryId != null && (() => {
          const m = mentors.find(x => x.Id === tertiaryId);
          return m ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {m.Title} (terciální)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[tertiaryId] ?? ''}
                onChange={e => setMessage(tertiaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${m.Title}…`}
                rows={3}
              />
            </div>
          ) : null;
        })()}
      </div>

      {/* 4. Actions */}
      <div className={styles.formActions}>
        <button
          className={styles.btnPrimary}
          onClick={() => { void handleSubmit(); }}
          disabled={submitting}
        >
          {submitting ? 'Odesílám…' : 'Odeslat žádost'}
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('MentorCatalog')}
          disabled={submitting}
        >
          Zpět na katalog
        </button>
        {error && <span className={styles.formError}>{error}</span>}
      </div>
    </div>
  );
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default RequestForm;
