import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ShipStats } from '../../types/ship.types';
import styles from './ShipStatsDisplay.module.css';

interface ShipStatsDisplayProps {
    stats: ShipStats;
    className?: string;
}

export const ShipStatsDisplay: React.FC<ShipStatsDisplayProps> = ({ stats, className = '' }) => {
    const { t } = useTranslation();

    const getPercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <h3 className={styles.title}>{t('ship.status')}</h3>

            <div className={styles.statsGrid}>
                {/* Health Bar */}
                <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                        <span className={styles.statIcon}>❤️</span>
                        <span>{t('ship.stats.health')}</span>
                    </div>
                    <div className={styles.barContainer}>
                        <div
                            className={`${styles.bar} ${styles.healthBar}`}
                            style={{ width: `${getPercentage(stats.health, stats.maxHealth)}%` }}
                        />
                        <span className={styles.barText}>
                            {stats.health} / {stats.maxHealth}
                        </span>
                    </div>
                </div>

                {/* Energy Bar */}
                <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                        <span className={styles.statIcon}>🔋</span>
                        <span>{t('ship.stats.energy')}</span>
                    </div>
                    <div className={styles.barContainer}>
                        <div
                            className={`${styles.bar} ${styles.energyBar}`}
                            style={{ width: `${getPercentage(stats.energy, stats.maxEnergy)}%` }}
                        />
                        <span className={styles.barText}>
                            {stats.energy} / {stats.maxEnergy}
                        </span>
                    </div>
                </div>

                {/* Numeric Stats */}
                <div className={styles.numericStats}>
                    <div className={styles.numericStat}>
                        <span className={styles.statIcon}>⚔️</span>
                        <div className={styles.numericStatContent}>
                            <span className={styles.numericLabel}>{t('ship.stats.attack')}</span>
                            <span className={styles.numericValue}>{stats.attack}</span>
                        </div>
                    </div>

                    <div className={styles.numericStat}>
                        <span className={styles.statIcon}>🛡️</span>
                        <div className={styles.numericStatContent}>
                            <span className={styles.numericLabel}>{t('ship.stats.defense')}</span>
                            <span className={styles.numericValue}>{stats.defense}</span>
                        </div>
                    </div>

                    <div className={styles.numericStat}>
                        <span className={styles.statIcon}>⚡</span>
                        <div className={styles.numericStatContent}>
                            <span className={styles.numericLabel}>{t('ship.stats.speed')}</span>
                            <span className={styles.numericValue}>{stats.speed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
