import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS } from '../../../../utils/mockData';

interface IMentorManagementProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

interface IMentorFormData {
  Title: string;
  JobTitle: string;
  Superpower: string;
  Bio: string;
  Capacity: number;
  PhotoUrl: string;
}

const emptyForm: IMentorFormData = {
  Title: '', JobTitle: '', Superpower: '', Bio: '', Capacity: 3, PhotoUrl: ''
};

const MentorManagement: React.FC<IMentorManagementProps> = ({ sp }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving]   = React.useState(false);

  // Add/Edit form
  const [showForm, setShowForm]     = React.useState(false);
  const [editingId, setEditingId]   = React.useState<number | null>(null);
  const [form, setForm]             = React.useState<IMentorFormData>(emptyForm);

  // Delete confirmation
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    new MentoringService(sp).getAllMentorsForAdmin()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS))
      .finally(() => setLoading(false));
  }, [sp]);

  const updateField = <K extends keyof IMentorFormData>(key: K, value: IMentorFormData[K]): void => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const openAddForm = (): void => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (mentor: IMentor): void => {
    setEditingId(mentor.Id);
    setForm({
      Title: mentor.Title,
      JobTitle: mentor.JobTitle,
      Superpower: mentor.Superpower,
      Bio: mentor.Bio,
      Capacity: mentor.Capacity,
      PhotoUrl: mentor.PhotoUrl ?? ''
    });
    setShowForm(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!form.Title.trim()) return;
    setSaving(true);
    const svc = new MentoringService(sp);
    try {
      if (editingId) {
        await svc.updateMentor(editingId, {
          Title: form.Title.trim(),
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        });
        setMentors(prev => prev.map(m => m.Id === editingId ? {
          ...m,
          Title: form.Title.trim(),
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        } : m));
      } else {
        const newId = await svc.addMentor({
          Title: form.Title.trim(),
          MentorUserId: 0, // HR priradi rucne v SP
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        });
        setMentors(prev => [...prev, {
          Id: newId ?? prev.length + 100,
          Title: form.Title.trim(),
          MentorUser: { Id: 0, Title: form.Title.trim(), EMail: '' },
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          AvailabilityNote: '',
          PhotoUrl: form.PhotoUrl.trim(),
          IsActive: true
        }]);
      }
    } catch { /* lokalni dev */ }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (mentorId: number): Promise<void> => {
    setSaving(true);
    try {
      await new MentoringService(sp).deleteMentor(mentorId);
    } catch { /* lokalni dev */ }
    setMentors(prev => prev.filter(m => m.Id !== mentorId));
    setDeletingId(null);
    setSaving(false);
  };

  const toggleActive = async (mentor: IMentor): Promise<void> => {
    try {
      await new MentoringService(sp).setMentorActive(mentor.Id, !mentor.IsActive);
    } catch { /* lokalni dev */ }
    setMentors(prev => prev.map(m => m.Id === mentor.Id ? { ...m, IsActive: !m.IsActive } : m));
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Správa mentorů ({mentors.length})</h2>
        <button className={styles.btnPrimary} onClick={openAddForm}>
          + Přidat mentora
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={styles.mentorFormCard}>
          <h3 className={styles.formSectionTitle}>
            {editingId ? 'Upravit mentora' : 'Nový mentor'}
          </h3>
          <div className={styles.mentorFormGrid}>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Jméno a příjmení</label>
              <input
                className={styles.formInput}
                value={form.Title}
                onChange={e => updateField('Title', e.target.value)}
                placeholder="Jan Novák"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Pozice</label>
              <input
                className={styles.formInput}
                value={form.JobTitle}
                onChange={e => updateField('JobTitle', e.target.value)}
                placeholder="CEO, CFO, VP Marketing…"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Superschopnost</label>
              <input
                className={styles.formInput}
                value={form.Superpower}
                onChange={e => updateField('Superpower', e.target.value)}
                placeholder="Strategické myšlení, leadership…"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Kapacita (počet talentů)</label>
              <input
                className={styles.formInput}
                type="number"
                min={0}
                max={20}
                value={form.Capacity}
                onChange={e => updateField('Capacity', Number(e.target.value))}
              />
            </div>
            <div className={styles.mentorFormFieldFull}>
              <label className={styles.messageLabel}>Bio</label>
              <textarea
                className={styles.messageTextarea}
                value={form.Bio}
                onChange={e => updateField('Bio', e.target.value)}
                placeholder="Krátký popis mentora…"
                rows={3}
              />
            </div>
            <div className={styles.mentorFormFieldFull}>
              <label className={styles.messageLabel}>URL fotky</label>
              <input
                className={styles.formInput}
                value={form.PhotoUrl}
                onChange={e => updateField('PhotoUrl', e.target.value)}
                placeholder="https://… (odkaz na fotografii v SharePointu)"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              className={styles.btnPrimary}
              disabled={saving || !form.Title.trim()}
              onClick={() => { void handleSave(); }}
            >
              {saving ? 'Ukládám…' : (editingId ? 'Uložit změny' : 'Vytvořit mentora')}
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => { setShowForm(false); setEditingId(null); }}
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Mentor list */}
      <div className={styles.managementList}>
        {mentors.map(mentor => (
          <div
            key={mentor.Id}
            className={[styles.managementRow, !mentor.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
          >
            <div className={styles.managementInfo}>
              <p className={styles.managementName}>{mentor.Title}</p>
              <p className={styles.managementMeta}>
                {mentor.JobTitle} · {mentor.Superpower}
              </p>
            </div>

            <span className={styles.managementCapacityLabel}>
              Kapacita: {mentor.Capacity}
            </span>

            <button
              className={mentor.IsActive ? styles.activeBtn : styles.inactiveBtn}
              onClick={() => { void toggleActive(mentor); }}
            >
              {mentor.IsActive ? 'Aktivní' : 'Neaktivní'}
            </button>

            <button
              className={styles.hrActionBtn}
              onClick={() => openEditForm(mentor)}
              title="Upravit"
            >
              Upravit
            </button>

            {deletingId === mentor.Id ? (
              <div className={styles.deleteConfirm}>
                <span className={styles.deleteConfirmText}>Smazat?</span>
                <button
                  className={styles.hrActionBtnDanger}
                  disabled={saving}
                  onClick={() => { void handleDelete(mentor.Id); }}
                >
                  Ano
                </button>
                <button
                  className={styles.hrActionBtn}
                  onClick={() => setDeletingId(null)}
                >
                  Ne
                </button>
              </div>
            ) : (
              <button
                className={styles.hrActionBtnDanger}
                onClick={() => setDeletingId(mentor.Id)}
                title="Smazat mentora"
              >
                Smazat
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorManagement;
