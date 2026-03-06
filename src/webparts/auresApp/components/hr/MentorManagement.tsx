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

const MentorManagement: React.FC<IMentorManagementProps> = ({ sp }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editId, setEditId]   = React.useState<number | null>(null);
  const [editCap, setEditCap] = React.useState(0);
  const [saving, setSaving]   = React.useState(false);

  React.useEffect(() => {
    new MentoringService(sp).getAllMentorsForAdmin()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS))
      .finally(() => setLoading(false));
  }, [sp]);

  const startEdit = (mentor: IMentor): void => {
    setEditId(mentor.Id);
    setEditCap(mentor.Capacity);
  };

  const saveCapacity = async (mentorId: number): Promise<void> => {
    setSaving(true);
    try {
      await new MentoringService(sp).updateMentorCapacity(mentorId, editCap);
    } catch {
      // lokalni dev — ignoruj
    }
    setMentors(prev => prev.map(m => m.Id === mentorId ? { ...m, Capacity: editCap } : m));
    setEditId(null);
    setSaving(false);
  };

  const toggleActive = async (mentor: IMentor): Promise<void> => {
    try {
      await new MentoringService(sp).setMentorActive(mentor.Id, !mentor.IsActive);
    } catch {
      // lokalni dev — ignoruj
    }
    setMentors(prev => prev.map(m => m.Id === mentor.Id ? { ...m, IsActive: !m.IsActive } : m));
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Správa mentorů ({mentors.length})</h2>
      <div className={styles.managementList}>
        {mentors.map(mentor => (
          <div
            key={mentor.Id}
            className={[styles.managementRow, !mentor.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
          >
            {/* Info */}
            <div className={styles.managementInfo}>
              <p className={styles.managementName}>{mentor.Title}</p>
              <p className={styles.managementMeta}>{mentor.JobTitle}</p>
            </div>

            {/* Kapacita — inline edit */}
            <div className={styles.managementCapacity}>
              {editId === mentor.Id ? (
                <div className={styles.inlineEditGroup}>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    className={styles.inlineInput}
                    value={editCap}
                    onChange={e => setEditCap(Number(e.target.value))}
                  />
                  <button
                    className={styles.inlineSave}
                    disabled={saving}
                    onClick={() => { void saveCapacity(mentor.Id); }}
                  >
                    OK
                  </button>
                  <button className={styles.inlineCancel} onClick={() => setEditId(null)}>X</button>
                </div>
              ) : (
                <button className={styles.capacityEdit} onClick={() => startEdit(mentor)}>
                  Kapacita: {mentor.Capacity}
                </button>
              )}
            </div>

            {/* Aktivni toggle */}
            <button
              className={mentor.IsActive ? styles.activeBtn : styles.inactiveBtn}
              onClick={() => { void toggleActive(mentor); }}
            >
              {mentor.IsActive ? 'Aktivní' : 'Neaktivní'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorManagement;
