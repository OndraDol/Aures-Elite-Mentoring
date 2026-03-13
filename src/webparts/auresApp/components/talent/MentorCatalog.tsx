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

const MentorCard: React.FC<IMentorCardProps> = ({ mentor, onRequest }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Split bio on "\n\nNejvětší překonaná výzva:" to separate bio and challenge
  const bioChallengeSplit = mentor.Bio.split('\n\nNejvětší překonaná výzva:');
  const bioText = bioChallengeSplit[0];
  const challengeText = bioChallengeSplit.length > 1 ? bioChallengeSplit[1].trim() : '';

  // Short bio: first ~2 sentences
  const shortBio = bioText.split(/(?<=\.)\s+/).slice(0, 2).join(' ');
  const hasMore = bioText.length > shortBio.length || challengeText.length > 0;

  const avatarClass = mentor.PhotoUrl
    ? `${styles.mentorAvatar} ${styles.mentorAvatarPhoto}`
    : styles.mentorAvatar;
  const avatarStyle = mentor.PhotoUrl
    ? { backgroundImage: `url('${mentor.PhotoUrl}')` }
    : undefined;

  return (
    <div className={styles.mentorCard}>
      <div className={styles.mentorCardHeader}>
        <div className={avatarClass} style={avatarStyle}>
          {!mentor.PhotoUrl && getInitials(mentor.Title)}
        </div>
        <div>
          <p className={styles.mentorName}>{mentor.Title}</p>
          <p className={styles.mentorJobTitle}>{mentor.JobTitle}</p>
        </div>
      </div>

      <p className={styles.mentorSuperpower}>{mentor.Superpower}</p>
      <p className={styles.mentorBio}>{shortBio}</p>

      {hasMore && (
        <div className={styles.mentorDetails}>
          {!expanded && (
            <button
              className={styles.mentorDetailsToggle}
              onClick={() => setExpanded(true)}
            >
              Zobrazit celý profil
            </button>
          )}
          {expanded && (
            <div className={styles.mentorDetailsContent}>
              <p>{bioText.slice(shortBio.length).trim()}</p>
              {challengeText && (
                <div className={styles.mentorChallenge}>
                  <strong>Největší překonaná výzva:</strong> {challengeText}
                </div>
              )}
              <button
                className={styles.mentorDetailsToggle}
                onClick={() => setExpanded(false)}
                style={{ marginTop: '12px' }}
              >
                Sbalit profil
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.mentorCardActions}>
        <button className={styles.btnPrimary} onClick={onRequest} style={{ width: '100%' }}>
          Požádat o mentoring
        </button>
      </div>
    </div>
  );
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default MentorCatalog;
