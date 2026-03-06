import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS } from '../../../../utils/mockData';

interface IRequestFormProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  preselectedMentorId?: number;
}

const MAX_MENTORS = 3;

const RequestForm: React.FC<IRequestFormProps> = ({ sp, currentUser, navigate, preselectedMentorId }) => {
  const [mentors, setMentors]       = React.useState<IMentor[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError]           = React.useState<string | null>(null);

  const [selectedIds, setSelectedIds] = React.useState<number[]>(
    preselectedMentorId ? [preselectedMentorId] : []
  );
  const [messages, setMessages] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    new MentoringService(sp).getMentors()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS.filter(m => m.IsActive)))
      .finally(() => setLoading(false));
  }, [sp]);

  const toggleMentor = (mentorId: number): void => {
    setSelectedIds(prev => {
      if (prev.includes(mentorId)) return prev.filter(id => id !== mentorId);
      if (prev.length >= MAX_MENTORS) return prev;
      return [...prev, mentorId];
    });
  };

  const setMessage = (mentorId: number, msg: string): void => {
    setMessages(prev => ({ ...prev, [mentorId]: msg }));
  };

  const canSubmit = (): boolean => {
    if (selectedIds.length === 0) return false;
    return selectedIds.every(id => (messages[id] ?? '').trim().length > 0);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit()) {
      setError('Vyber alespoň jednoho mentora a vyplň zprávu pro každého z nich.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const talentId = currentUser.talentRecord?.Id ?? 0;
      const mentorIds: [number, number?, number?] = [selectedIds[0], selectedIds[1], selectedIds[2]];
      const msgs: [string, string?, string?] = [
        (messages[selectedIds[0]] ?? '').trim(),
        selectedIds[1] != null ? (messages[selectedIds[1]] ?? '').trim() : undefined,
        selectedIds[2] != null ? (messages[selectedIds[2]] ?? '').trim() : undefined
      ];
      const newId = await new MentoringService(sp).submitRequest(talentId, mentorIds, msgs);
      // 6.1 — notifikuj Mentora 1 (best-effort)
      void (async () => {
        try {
          const mentor1 = mentors.find(m => m.Id === selectedIds[0]);
          if (mentor1 && currentUser.talentRecord) {
            await new NotificationService(sp).notifyMentorOnSubmit(
              mentor1, currentUser.talentRecord, newId, `REQ-2026-${newId}`
            );
          }
        } catch { /* notifikace je best-effort */ }
      })();
      navigate('MyRequests');
    } catch {
      setError('Nepodařilo se odeslat žádost. Zkus to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  const selectedMentors = selectedIds
    .map(id => mentors.find(m => m.Id === id))
    .filter((m): m is IMentor => m != null);

  return (
    <div className={styles.requestForm}>
      <h2 className={styles.pageTitle}>Nová žádost o mentoring</h2>

      {/* 1. Výběr mentorů */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>
          Výběr mentorů ({selectedIds.length}/{MAX_MENTORS})
        </h3>
        <div className={styles.mentorSelectList}>
          {mentors.map(mentor => {
            const isChecked  = selectedIds.includes(mentor.Id);
            const isDisabled = !isChecked && selectedIds.length >= MAX_MENTORS;

            return (
              <div
                key={mentor.Id}
                className={[
                  styles.mentorSelectItem,
                  isChecked  ? styles.mentorSelectItemChecked : '',
                  isDisabled ? styles.mentorSelectDisabled    : ''
                ].filter(Boolean).join(' ')}
                onClick={() => { if (!isDisabled) toggleMentor(mentor.Id); }}
              >
                <input
                  type="checkbox"
                  className={styles.mentorSelectCheckbox}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => { if (!isDisabled) toggleMentor(mentor.Id); }}
                />
                <div className={styles.mentorSelectInfo}>
                  <p className={styles.mentorSelectName}>{mentor.Title}</p>
                  <p className={styles.mentorSelectJobTitle}>
                    {mentor.JobTitle} · {mentor.Superpower}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Zprávy pro vybrané mentory */}
      {selectedMentors.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Zprávy mentorům</h3>
          {selectedMentors.map((mentor, idx) => (
            <div key={mentor.Id} className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {mentor.Title} (#{idx + 1})
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[mentor.Id] ?? ''}
                onChange={e => setMessage(mentor.Id, e.target.value)}
                placeholder={`Proč chceš právě ${mentor.Title} jako mentora…`}
                rows={4}
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. Akce */}
      <div className={styles.formActions}>
        <button
          className={styles.btnPrimary}
          onClick={() => { void handleSubmit(); }}
          disabled={submitting || !canSubmit()}
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

export default RequestForm;
