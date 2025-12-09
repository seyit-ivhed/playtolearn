import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdventureInfoModal.module.css';
import type { Adventure } from '../../../types/adventure.types';

interface AdventureInfoModalProps {
    adventure: Adventure;
    onStart: () => void;
    onClose: () => void;
}

export const AdventureInfoModal: React.FC<AdventureInfoModalProps> = ({
    adventure,
    onStart,
    onClose,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.overlay} onClick={onClose} data-testid="adventure-info-modal">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title} data-testid="adventure-title">{t(`adventures.${adventure.id}.title`)}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>{t(`adventures.${adventure.id}.description`)}</p>

                    <div className={styles.grid}>
                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>{t('adventure.target_monster')}</span>
                            <div className={styles.enemyInfo}>
                                <span className={styles.enemyIcon}>👾</span>
                                <div style={{ width: '100%' }}>
                                    <strong>{t(`monsters.${adventure.enemy.id}`)}</strong>
                                    <div className={styles.statGrid}>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>ATK</span>
                                            <span className={styles.statValue}>{adventure.enemy.attack}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>DEF</span>
                                            <span className={styles.statValue}>{adventure.enemy.defense}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>HP</span>
                                            <span className={styles.statValue}>{adventure.enemy.maxHealth}</span>
                                        </div>
                                        {adventure.enemy.maxShield && (
                                            <div className={styles.stat}>
                                                <span className={styles.statLabel}>SHLD</span>
                                                <span className={styles.statValue}>{adventure.enemy.maxShield}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>{t('adventure.rewards')}</span>
                            <ul className={styles.rewardsList}>
                                {adventure.rewards.xp && (
                                    <li className={styles.rewardItem}>
                                        <span>✨</span> {t('rewards.xp', { amount: adventure.rewards.xp })}
                                    </li>
                                )}
                                {adventure.rewards.currency && (
                                    <li className={styles.rewardItem}>
                                        <span>💎</span> {t('rewards.credits', { amount: adventure.rewards.currency })}
                                    </li>
                                )}
                                {adventure.rewards.unlocksCompanionId && (
                                    <li className={styles.rewardItem}>
                                        <span>🎁</span> {t('rewards.companion_unlocked')}
                                    </li>
                                )}
                                {!adventure.rewards.xp && !adventure.rewards.currency && !adventure.rewards.unlocksCompanionId && (
                                    <li className={styles.rewardItem} style={{ color: 'var(--color-text-disabled)' }}>
                                        {t('adventure.no_rewards')}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        {t('adventure.cancel')}
                    </button>
                    <button className={styles.startButton} onClick={onStart} data-testid="start-adventure-btn">
                        {t('adventure.start')}
                    </button>
                </div>
            </div>
        </div>
    );
};
