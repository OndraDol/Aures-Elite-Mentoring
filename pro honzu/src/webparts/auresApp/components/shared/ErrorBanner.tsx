import * as React from 'react';
import styles from '../AuresApp.module.scss';

interface IErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

const ErrorBanner: React.FC<IErrorBannerProps> = ({ message, onRetry }) => (
  <div className={styles.errorState}>
    <p>{message}</p>
    {onRetry && (
      <button className={styles.btnSecondary} onClick={onRetry}>
        Zkusit znovu
      </button>
    )}
  </div>
);

export default ErrorBanner;
