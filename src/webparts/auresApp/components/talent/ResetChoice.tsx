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
      setError('Nepodarilo se resetovat tvoji volbu. Zadne zadosti nebyly zmeneny.');
    } finally {
      setResetting(false);
    }
  };

  if (done) {
    return (
      <div className={styles.emptyState}>
        <p>Tvoje volba byla resetovana. Muzes si znovu vybrat mentora z katalogu.</p>
        <button
          className={styles.btnPrimary}
          style={{ marginTop: 16 }}
          onClick={() => navigate('MentorCatalog')}
        >
          Prejit na katalog mentoru
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Zmena volby mentora</h2>

      {error && <ErrorBanner message={error} />}

      <div className={styles.resetChoiceCard}>
        <p className={styles.resetChoiceText}>
          Pokud chces zmenit svou volbu mentora, muzes zde zrusit vsechny aktualni zadosti
          a zacit vyber od zacatku. System zrusi vsechny tvoje aktivni zadosti
          a budes si moci znovu vybrat mentora z katalogu.
        </p>
        <p className={styles.resetChoiceWarning}>
          Tato akce je nevratna. Vsechny tvoje aktualni zadosti budou zruseny.
        </p>
        <button
          className={styles.btnReject}
          onClick={() => { void handleReset(); }}
          disabled={resetting}
        >
          {resetting ? 'Rusim zadosti...' : 'Resetovat volbu a zacit znovu'}
        </button>
      </div>
    </div>
  );
};

export default ResetChoice;
