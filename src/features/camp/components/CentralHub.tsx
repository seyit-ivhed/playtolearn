import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CentralHub.module.css';

interface CentralHubProps {
    xpPool: number;
    onPackUp: () => void;
}

export const CentralHub: React.FC<CentralHubProps> = ({ xpPool, onPackUp }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.centralHub}>
            <div className={styles.xpPoolDisplay}>
                <span className={styles.xpLabel}>Shared XP</span>
                <span className={styles.xpValue}>{xpPool}</span>
            </div>

            <div className={styles.fireEffect}>🔥</div>

            <button
                onClick={onPackUp}
                className={styles.backButton}
                data-testid="nav-map-btn"
            >
                {t('common.continue')}
            </button>
        </div>
    );
};
