import * as React from 'react';
import styles from './AuresApp.module.scss';

const AccessDenied: React.FC = () => (
  <div className={styles.accessDenied}>
    <div className={styles.accessDeniedIcon}>🔒</div>
    <h2>Přístup odepřen</h2>
    <p>
      Váš účet není registrován jako Talent ani Mentor
      v systému Aures Elite Mentoring.
    </p>
    <p>
      Kontaktujte HR oddělení Aures Holdings pro přidání do systému.
    </p>
  </div>
);

export default AccessDenied;
