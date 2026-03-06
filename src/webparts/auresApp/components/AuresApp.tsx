import * as React from 'react';
import styles from './AuresApp.module.scss';
import { IAuresAppProps } from './IAuresAppProps';

// Placeholder — bude prepisano v Phase 2 (funkcni komponenta + role detection)
const AuresApp: React.FC<IAuresAppProps> = () => {
  return (
    <div className={styles.auresApp}>
      <p>Aures Elite Mentoring — inicializace...</p>
    </div>
  );
};

export default AuresApp;
