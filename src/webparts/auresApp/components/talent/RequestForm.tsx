import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { hasActiveTalentRequests } from '../appNavigationState';
import { completeRequestSubmission } from './requestNavigation';
import MentorAvatar from '../shared/MentorAvatar';
import ErrorBanner from '../shared/ErrorBanner';

interface IRequestFormProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  hrEmails: string[];
  onRequestsChanged: () => Promise<void>;
  preselectedMentorId?: number;
}

const RequestForm: React.FC<IRequestFormProps> = ({
  sp, currentUser, navigate, hrEmails, onRequestsChanged, preselectedMentorId
}) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [hasActiveRequest, setHasActiveRequest] = React.useState(false);

  const [secondaryId, setSecondaryId] = React.useState<number | null>(null);
  const [tertiaryId, setTertiaryId] = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<Record<number, string>>({});

  const loadData = React.useCallback(() => {
    const talentId = currentUser.talentRecord?.Id;
    const svc = new MentoringService(sp);
    setLoadError(null);
    setLoading(true);

    Promise.all([
      svc.getMentors(),
      talentId ? svc.getMyRequests(talentId) : Promise.resolve([])
    ])
      .then(([mentorsData, myReqs]) => {
        setMentors(mentorsData);
        setHasActiveRequest(hasActiveTalentRequests(myReqs));
      })
      .catch(() => {
        setLoadError('Nepodařilo se načíst data formuláře.');
      })
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  React.useEffect(() => { loadData(); }, [loadData]);

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
            await new NotificationService().notifyHROnSubmit(
              hrEmails,
              currentUser.talentRecord,
              mentor1,
              newId,
              `REQ-2026-${newId}`
            );
          }
        } catch {
          // best-effort
        }
      })();

      await completeRequestSubmission(onRequestsChanged, navigate);
    } catch {
      setError('Nepodařilo se odeslat žádost. Zkus to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Načítám mentory...</div>;
  }

  if (loadError) return <ErrorBanner message={loadError} onRetry={loadData} />;

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

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Tvůj vybraný mentor</h3>
        <div className={styles.primaryMentorCard}>
          <div className={styles.primaryMentorHeader}>
            <MentorAvatar mentor={primaryMentor} variant="primary" />
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

      {otherMentors.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Záložní mentoři</h3>
          <p className={styles.formSectionHint}>
            Pokud vybraný mentor nebude mít kapacitu, systém automaticky osloví záložního mentora.
            Vyber si sekundárního a případně terciárního mentora.
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
                    <MentorAvatar mentor={mentor} />
                    <div>
                      <p className={styles.mentorSelectName}>{mentor.Title}</p>
                      <p className={styles.mentorSelectJobTitle}>
                        {mentor.JobTitle} · {mentor.Superpower}
                      </p>
                    </div>
                  </div>
                  <div className={styles.backupMentorActions}>
                    {isSecondary && <span className={styles.backupMentorLabel}>Sekundární</span>}
                    {isTertiary && <span className={styles.backupMentorLabelTertiary}>Terciární</span>}
                    {isSelected ? (
                      <button
                        className={styles.btnSecondary}
                        onClick={() => {
                          if (isSecondary) {
                            setSecondaryId(tertiaryId);
                            setTertiaryId(null);
                          } else {
                            setTertiaryId(null);
                          }
                        }}
                      >
                        Odebrat
                      </button>
                    ) : (
                      <button
                        className={styles.btnSecondary}
                        disabled={secondaryId !== null && tertiaryId !== null}
                        onClick={() => {
                          if (secondaryId === null) {
                            setSecondaryId(mentor.Id);
                          } else if (tertiaryId === null) {
                            setTertiaryId(mentor.Id);
                          }
                        }}
                      >
                        {secondaryId === null ? 'Zvolit jako sekundárního' : 'Zvolit jako terciárního'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Zprávy mentorům</h3>
        <p className={styles.formSectionHint}>
          Pokud chceš, můžeš mentorovi napsat zprávu - proč máš o něj zájem,
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
            placeholder={`Napiš, proč tě zajímá mentoring od ${primaryMentor.Title}...`}
            rows={3}
          />
        </div>

        {secondaryId != null && (() => {
          const mentor = mentors.find(x => x.Id === secondaryId);
          return mentor ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {mentor.Title} (sekundární)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[secondaryId] ?? ''}
                onChange={e => setMessage(secondaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${mentor.Title}...`}
                rows={3}
              />
            </div>
          ) : null;
        })()}

        {tertiaryId != null && (() => {
          const mentor = mentors.find(x => x.Id === tertiaryId);
          return mentor ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {mentor.Title} (terciární)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[tertiaryId] ?? ''}
                onChange={e => setMessage(tertiaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${mentor.Title}...`}
                rows={3}
              />
            </div>
          ) : null;
        })()}
      </div>

      <div className={styles.formActions}>
        <button
          className={styles.btnPrimary}
          onClick={() => { void handleSubmit(); }}
          disabled={submitting}
        >
          {submitting ? 'Odesílám...' : 'Odeslat žádost'}
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

export default RequestForm;
