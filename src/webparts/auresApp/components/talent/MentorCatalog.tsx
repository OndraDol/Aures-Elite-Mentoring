import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS } from '../../../../utils/mockData';

interface IMentorCatalogProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MentorCatalog: React.FC<IMentorCatalogProps> = ({ sp, navigate }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getMentors()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS.filter(m => m.IsActive)))
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  if (!mentors.length) {
    return (
      <div className={styles.emptyState}>
        <p>Momentálně nejsou k dispozici žádní aktivní mentoři.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Katalog mentorů</h2>
      <div className={styles.mentorGrid}>
        {mentors.map(mentor => (
          <MentorCard
            key={mentor.Id}
            mentor={mentor}
            onRequest={() => navigate('RequestForm', { preselectedMentorId: mentor.Id })}
          />
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// MentorCard
// ----------------------------------------------------------------

interface IMentorCardProps {
  mentor: IMentor;
  onRequest: () => void;
}

const MentorCard: React.FC<IMentorCardProps> = ({ mentor, onRequest }) => (
  <div className={styles.mentorCard}>
    <div className={styles.mentorCardHeader}>
      <div className={styles.mentorAvatar}>{getInitials(mentor.Title)}</div>
      <div>
        <p className={styles.mentorName}>{mentor.Title}</p>
        <p className={styles.mentorJobTitle}>{mentor.JobTitle}</p>
      </div>
    </div>

    <p className={styles.mentorSuperpower}>{mentor.Superpower}</p>
    <p className={styles.mentorBio}>{mentor.Bio}</p>

    <div className={styles.mentorCardActions}>
      <button className={styles.btnPrimary} onClick={onRequest} style={{ width: '100%' }}>
        Požádat o mentoring
      </button>
    </div>
  </div>
);

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default MentorCatalog;
