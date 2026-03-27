import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import ErrorBanner from '../shared/ErrorBanner';
import { completeRequestReset } from './requestNavigation';

interface IResetChoiceProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  onRequestsChanged: () => Promise<void>;
}

const ResetChoice: React.FC<IResetChoiceProps> = ({ sp, currentUser, navigate, onRequestsChanged }) => {
  const [resetting, setResetting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleReset = async (): Promise<void> => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) return;

    setError(null);
    setResetting(true);
    try {
      await new MentoringService(sp).cancelAllRequestsForTalent(talentId);
      await completeRequestReset(onRequestsChanged, () => {
        setDone(true);
      });
    } catch {
      setError('Nepodařilo se resetovat tvoji volbu. Žádné žádosti nebyly změněny.');
    } finally {
      setResetting(false);
    }
  };

  if (done) {
    return (
      <div className={styles.emptyState}>
        <p>Tvoje volba byla resetována. Můžeš si znovu vybrat mentora z katalogu.</p>
        <button
          className={styles.btnPrimary}
          style={{ marginTop: 16 }}
          onClick={() => navigate('MentorCatalog')}
        >
          Přejít na katalog mentorů
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Změna volby mentora</h2>

      {error && <ErrorBanner message={error} />}

      <div className={styles.resetChoiceCard}>
        <p className={styles.resetChoiceText}>
          Pokud chceš změnit svou volbu mentora, můžeš zde zrušit všechny aktuální žádosti
          a začít výběr od začátku. Systém zruší všechny tvoje aktivní žádosti
          a budeš si moci znovu vybrat mentora z katalogu.
        </p>
        <p className={styles.resetChoiceWarning}>
          Tato akce je nevratná. Všechny tvoje aktuální žádosti budou zrušeny.
        </p>
        <button
          className={styles.btnReject}
          onClick={() => { void handleReset(); }}
          disabled={resetting}
        >
          {resetting ? 'Ruším žádosti...' : 'Resetovat volbu a začít znovu'}
        </button>
      </div>
    </div>
  );
};

export default ResetChoice;
