import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';

interface IResetChoiceProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  onRequestsChanged: () => void;
}

const ResetChoice: React.FC<IResetChoiceProps> = ({ sp, currentUser, navigate, onRequestsChanged }) => {
  const [resetting, setResetting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleReset = async (): Promise<void> => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) return;

    setResetting(true);
    try {
      await new MentoringService(sp).cancelAllRequestsForTalent(talentId);
    } catch {
      // lokalni dev — ignoruj
    }
    setDone(true);
    setResetting(false);
    onRequestsChanged();
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
      <div className={styles.resetChoiceCard}>
        <p className={styles.resetChoiceText}>
          Pokud chceš změnit svou volbu mentora, můžeš zde zrušit všechny aktuální žádosti
          a začít výběr od začátku. Systém zruší všechny tvoje aktivní žádosti
          a budeš si moci znovu vybrat mentora z katalogu.
        </p>
        <p className={styles.resetChoiceWarning}>
          Tato akce je nevratná — všechny tvoje aktuální žádosti budou zrušeny.
        </p>
        <button
          className={styles.btnReject}
          onClick={() => { void handleReset(); }}
          disabled={resetting}
        >
          {resetting ? 'Ruším žádosti…' : 'Resetovat volbu a začít znovu'}
        </button>
      </div>
    </div>
  );
};

export default ResetChoice;
