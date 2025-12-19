import React from 'react';
import styles from './CentralHub.module.css';

interface CentralHubProps {
    xpPool: number;
    onPackUp: () => void;
}

export const CentralHub: React.FC<CentralHubProps> = ({ xpPool, onPackUp }) => {
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
                🗺️ Pack Up & Go
            </button>
        </div>
    );
};
