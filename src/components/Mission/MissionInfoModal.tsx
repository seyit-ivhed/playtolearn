import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MissionInfoModal.module.css';
import type { Mission } from '../../types/mission.types';

interface MissionInfoModalProps {
    mission: Mission;
    onStart: () => void;
    onClose: () => void;
}

export const MissionInfoModal: React.FC<MissionInfoModalProps> = ({
    mission,
    onStart,
    onClose,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.overlay} onClick={onClose} data-testid="mission-info-modal">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title} data-testid="mission-title">{t(`missions.${mission.id}.title`)}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>{t(`missions.${mission.id}.description`)}</p>

                    <div className={styles.grid}>
                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>{t('mission.target_enemy')}</span>
                            <div className={styles.enemyInfo}>
                                <span className={styles.enemyIcon}>👾</span>
                                <div style={{ width: '100%' }}>
                                    <strong>{t(`enemies.${mission.enemy.id}`)}</strong>
                                    <div className={styles.statGrid}>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>ATK</span>
                                            <span className={styles.statValue}>{mission.enemy.attack}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>DEF</span>
                                            <span className={styles.statValue}>{mission.enemy.defense}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>HP</span>
                                            <span className={styles.statValue}>{mission.enemy.maxHealth}</span>
                                        </div>
                                        {mission.enemy.maxShield && (
                                            <div className={styles.stat}>
                                                <span className={styles.statLabel}>SHLD</span>
                                                <span className={styles.statValue}>{mission.enemy.maxShield}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>{t('mission.rewards')}</span>
                            <ul className={styles.rewardsList}>
                                {mission.rewards.xp && (
                                    <li className={styles.rewardItem}>
                                        <span>✨</span> {t('rewards.xp', { amount: mission.rewards.xp })}
                                    </li>
                                )}
                                {mission.rewards.currency && (
                                    <li className={styles.rewardItem}>
                                        <span>💎</span> {t('rewards.credits', { amount: mission.rewards.currency })}
                                    </li>
                                )}
                                {mission.rewards.unlocksModuleId && (
                                    <li className={styles.rewardItem}>
                                        <span>🎁</span> {t('rewards.module_unlocked')}
                                    </li>
                                )}
                                {!mission.rewards.xp && !mission.rewards.currency && !mission.rewards.unlocksModuleId && (
                                    <li className={styles.rewardItem} style={{ color: 'var(--color-text-disabled)' }}>
                                        {t('mission.no_rewards')}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        {t('mission.cancel')}
                    </button>
                    <button className={styles.startButton} onClick={onStart} data-testid="start-mission-btn">
                        {t('mission.start')}
                    </button>
                </div>
            </div>
        </div>
    );
};
