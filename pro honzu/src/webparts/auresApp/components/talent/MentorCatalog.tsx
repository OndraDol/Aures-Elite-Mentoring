import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import MentorAvatar from '../shared/MentorAvatar';
import ErrorBanner from '../shared/ErrorBanner';

interface IMentorCatalogProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MentorCatalog: React.FC<IMentorCatalogProps> = ({ sp, navigate }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    setError(null);
    setLoading(true);
    new MentoringService(sp).getMentors()
      .then(setMentors)
      .catch(() => setError('Nepodařilo se načíst mentory.'))
      .finally(() => setLoading(false));
  }, [sp]);

  React.useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;
  if (error) return <ErrorBanner message={error} onRetry={loadData} />;

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

  return (
    <div className={styles.mentorCard}>
      <div className={styles.mentorCardHeader}>
        <MentorAvatar mentor={mentor} variant="catalog" />
        <div>
          <p className={styles.mentorName}>{mentor.Title}</p>
          <p className={styles.mentorJobTitle}>{mentor.JobTitle}</p>
        </div>
      </div>

      <p className={styles.mentorSuperpower}>{mentor.Superpower}</p>
      <p className={styles.mentorBio}>{shortBio}</p>

      {hasMore && (
        <div className={styles.mentorDetails}>
          {expanded && (
            <div className={styles.mentorDetailsContent}>
              <p>{bioText.slice(shortBio.length).trim()}</p>
              {challengeText && (
                <div className={styles.mentorChallenge}>
                  <strong>Největší překonaná výzva:</strong> {challengeText}
                </div>
              )}
            </div>
          )}
          <button
            className={styles.mentorDetailsToggle}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Sbalit profil' : 'Zobrazit celý profil'}
          </button>
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

export default MentorCatalog;
