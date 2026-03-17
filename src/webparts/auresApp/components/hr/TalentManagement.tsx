import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ITalent, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_TALENTS } from '../../../../utils/mockData';
import { resolveTalentPhoto, getTalentInitials } from '../shared/talentAvatarCatalog';

interface ITalentManagementProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const TalentManagement: React.FC<ITalentManagementProps> = ({ sp }) => {
  const [talents, setTalents] = React.useState<ITalent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getAllTalentsForAdmin()
      .then(setTalents)
      .catch(() => setTalents(MOCK_TALENTS))
      .finally(() => setLoading(false));
  }, [sp]);

  const toggleActive = async (talent: ITalent): Promise<void> => {
    try {
      await new MentoringService(sp).setTalentActive(talent.Id, !talent.IsActive);
    } catch {
      // lokalni dev — ignoruj
    }
    setTalents(prev => prev.map(t => t.Id === talent.Id ? { ...t, IsActive: !t.IsActive } : t));
  };

  if (loading) return <div className={styles.loading}>Načítám talenty…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Správa talentů ({talents.length})</h2>
      <div className={styles.managementList}>
        {talents.map(talent => {
          const photoSrc = resolveTalentPhoto(talent);
          const initials = getTalentInitials(talent.Title);
          return (
            <div
              key={talent.Id}
              className={[styles.managementRow, !talent.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
            >
              <div className={styles.managementInfo}>
                <div className={styles.mentorAvatar}>
                  {photoSrc
                    ? <img src={photoSrc} alt={talent.Title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} />
                    : <span>{initials}</span>
                  }
                </div>
                <p className={styles.managementName}>{talent.Title}</p>
              </div>
              <button
                className={talent.IsActive ? styles.activeBtn : styles.inactiveBtn}
                onClick={() => { void toggleActive(talent); }}
              >
                {talent.IsActive ? 'Aktivní' : 'Neaktivní'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TalentManagement;
