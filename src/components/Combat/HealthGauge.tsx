import React from 'react';
import styles from './HealthGauge.module.css';

interface HealthGaugeProps {
    current: number;
    max: number;
    shield?: number;
    maxShield?: number;
    label?: string;
    className?: string;
    testId?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
    current,
    max,
    shield = 0,
    maxShield = 0,
    label,
    className = '',
    testId
}) => {
    const healthPercent = Math.max(0, Math.min(100, (current / max) * 100));
    const shieldPercent = maxShield > 0 ? Math.max(0, Math.min(100, (shield / maxShield) * 100)) : 0;

    return (
        <div className={`${styles.container} ${className}`}>
            {label && (
                <div className={styles.label}>
                    <span data-testid={testId}>{label}</span>
                </div>
            )}
            <div className={styles.barContainer}>
                <div
                    className={styles.healthBar}
                    style={{ width: `${healthPercent}%` }}
                />
                {shield > 0 && (
                    <div
                        className={styles.shieldBar}
                        style={{ width: `${shieldPercent}%` }}
                    />
                )}
                <div className={styles.valueOverlay}>
                    {current}/{max} {shield > 0 && `(+${shield})`}
                </div>
            </div>
        </div>
    );
};
