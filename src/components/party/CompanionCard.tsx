import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Companion } from '../../types/party.types';
import styles from './CompanionCard.module.css';

type CompanionCardState = 'unlocked' | 'locked' | 'equipped';

interface CompanionCardProps {
    companion: Companion;
    state: CompanionCardState;
    onAdd?: (companion: Companion) => void;
    onRemove?: () => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
    companion,
    state,
    onAdd,
    onRemove
}) => {
    const { t } = useTranslation();

    const handleClick = () => {
        if (state === 'unlocked' && onAdd) {
            onAdd(companion);
        } else if (state === 'equipped' && onRemove) {
            onRemove();
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'WARRIOR': return '#e74c3c';
            case 'GUARDIAN': return '#3498db';
            case 'SUPPORT': return '#2ecc71';
            default: return '#95a5a6';
        }
    };

    const getActionLabel = () => {
        if (state === 'locked') return t('companions.locked');
        if (state === 'equipped') return t('companions.remove');
        return t('companions.add');
    };

    return (
        <div
            className={`${styles.card} ${styles[state]}`}
            onClick={state !== 'locked' ? handleClick : undefined}
            style={{ borderColor: getRoleColor(companion.role) }}
        >
            <div className={styles.header}>
                <h3 className={styles.name}>{companion.name}</h3>
                <span
                    className={styles.role}
                    style={{ backgroundColor: getRoleColor(companion.role) }}
                >
                    {companion.role}
                </span>
            </div>

            <div className={styles.ability}>
                <span className={styles.abilityLabel}>Ability:</span>
                <span className={styles.abilityName}>{companion.combatAction}</span>
            </div>

            <p className={styles.description}>{companion.description}</p>

            <div className={styles.stats}>
                {companion.stats.attack && (
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>⚔️</span>
                        <span>{companion.stats.attack}</span>
                    </div>
                )}
                {companion.stats.defense && (
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>🛡️</span>
                        <span>{companion.stats.defense}</span>
                    </div>
                )}
                {companion.stats.health && (
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>❤️</span>
                        <span>{companion.stats.health}</span>
                    </div>
                )}
                {companion.stats.maxEnergy !== undefined && (
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>⚡</span>
                        <span>{companion.stats.maxEnergy}</span>
                    </div>
                )}
            </div>

            {state !== 'locked' && (
                <div className={styles.footer}>
                    <span className={styles.level}>Level {companion.level}</span>
                    <button
                        className={styles.actionBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    >
                        {getActionLabel()}
                    </button>
                </div>
            )}

            {state === 'locked' && (
                <div className={styles.lockedOverlay}>
                    <span className={styles.lockIcon}>🔒</span>
                    <p>{t('companions.unlock_requirement')}</p>
                </div>
            )}
        </div>
    );
};
