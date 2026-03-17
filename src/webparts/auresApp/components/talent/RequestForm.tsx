import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS, MOCK_REQUESTS } from '../../../../utils/mockData';
import MentorAvatar from '../shared/MentorAvatar';

interface IRequestFormProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  hrEmails: string[];
  preselectedMentorId?: number;
}

const RequestForm: React.FC<IRequestFormProps> = ({ sp, currentUser, navigate, hrEmails, preselectedMentorId }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasActiveRequest, setHasActiveRequest] = React.useState(false);

  const [secondaryId, setSecondaryId] = React.useState<number | null>(null);
  const [tertiaryId, setTertiaryId] = React.useState<number | null>(null);
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
      setError('Nebyl zvolen primarni mentor.');
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

      navigate('MyRequests');
    } catch {
      setError('Nepodarilo se odeslat zadost. Zkus to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Nacitam mentory...</div>;
  }

  if (hasActiveRequest) {
    return (
      <div className={styles.emptyState}>
        <p>Jiz mas aktivni zadost o mentoring. Pokud chces podat novou, musis svou volbu nejprve resetovat.</p>
        <button className={styles.btnPrimary} onClick={() => navigate('MyRequests')}>Prejit na Moje zadosti</button>
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
          Zpet na katalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.requestForm}>
      <h2 className={styles.pageTitle}>Nova zadost o mentoring</h2>

      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Tvuj vybrany mentor</h3>
        <div className={styles.primaryMentorCard}>
          <div className={styles.primaryMentorHeader}>
            <MentorAvatar mentor={primaryMentor} variant="primary" />
            <div className={styles.primaryMentorInfo}>
              <p className={styles.primaryMentorName}>{primaryMentor.Title}</p>
              <p className={styles.primaryMentorJobTitle}>{primaryMentor.JobTitle}</p>
              <p className={styles.primaryMentorSuperpower}>{primaryMentor.Superpower}</p>
            </div>
            <span className={styles.primaryMentorBadge}>Primarni mentor</span>
          </div>
          <p className={styles.primaryMentorBio}>{primaryMentor.Bio}</p>
        </div>
      </div>

      {otherMentors.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Zalozni mentori</h3>
          <p className={styles.formSectionHint}>
            Pokud vybrany mentor nebude mit kapacitu, system automaticky oslovi zalozniho mentora.
            Vyber si sekundarniho a pripadne terciarniho mentora.
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
                    {isSecondary && <span className={styles.backupMentorLabel}>Sekundarni</span>}
                    {isTertiary && <span className={styles.backupMentorLabelTertiary}>Terciarni</span>}
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
                        {secondaryId === null ? 'Zvolit jako sekundarniho' : 'Zvolit jako terciarniho'}
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
        <h3 className={styles.formSectionTitle}>Zpravy mentorum</h3>
        <p className={styles.formSectionHint}>
          Pokud chces, muzes mentorovi napsat zpravu - proc mas o nej zajem,
          co od mentoringu ocekavas, nebo cokoliv dalsiho. Zprava neni povinna.
        </p>

        <div className={styles.messageGroup}>
          <label className={styles.messageLabel}>
            Zprava pro {primaryMentor.Title} (primarni)
          </label>
          <textarea
            className={styles.messageTextarea}
            value={messages[primaryMentor.Id] ?? ''}
            onChange={e => setMessage(primaryMentor.Id, e.target.value)}
            placeholder={`Napis, proc te zajima mentoring od ${primaryMentor.Title}...`}
            rows={3}
          />
        </div>

        {secondaryId != null && (() => {
          const mentor = mentors.find(x => x.Id === secondaryId);
          return mentor ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zprava pro {mentor.Title} (sekundarni)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[secondaryId] ?? ''}
                onChange={e => setMessage(secondaryId, e.target.value)}
                placeholder={`Napis, proc te zajima mentoring od ${mentor.Title}...`}
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
                Zprava pro {mentor.Title} (terciarni)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[tertiaryId] ?? ''}
                onChange={e => setMessage(tertiaryId, e.target.value)}
                placeholder={`Napis, proc te zajima mentoring od ${mentor.Title}...`}
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
          {submitting ? 'Odesilam...' : 'Odeslat zadost'}
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('MentorCatalog')}
          disabled={submitting}
        >
          Zpet na katalog
        </button>
        {error && <span className={styles.formError}>{error}</span>}
      </div>
    </div>
  );
};

export default RequestForm;
