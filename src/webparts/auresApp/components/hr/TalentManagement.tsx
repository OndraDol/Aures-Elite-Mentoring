import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ITalent, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_TALENTS } from '../../../../utils/mockData';

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
        {talents.map(talent => (
          <div
            key={talent.Id}
            className={[styles.managementRow, !talent.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
          >
            <div className={styles.managementInfo}>
              <p className={styles.managementName}>{talent.Title}</p>
              <p className={styles.managementMeta}>{talent.TalentUser.EMail}</p>
            </div>
            <button
              className={talent.IsActive ? styles.activeBtn : styles.inactiveBtn}
              onClick={() => { void toggleActive(talent); }}
            >
              {talent.IsActive ? 'Aktivní' : 'Neaktivní'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentManagement;
