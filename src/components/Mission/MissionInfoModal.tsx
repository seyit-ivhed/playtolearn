import React from 'react';
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
    return (
        <div className={styles.overlay} onClick={onClose} data-testid="mission-info-modal">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title} data-testid="mission-title">{mission.title}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>{mission.description}</p>

                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>Target Enemy</span>
                        <div className={styles.enemyInfo}>
                            <span className={styles.enemyIcon}>👾</span>
                            <div>
                                <strong>{mission.enemy.name}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                    ATK: {mission.enemy.attack} | DEF: {mission.enemy.defense} | HP: {mission.enemy.maxHealth}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>Mission Rewards</span>
                        <ul className={styles.rewardsList}>
                            {mission.rewards.xp && (
                                <li className={styles.rewardItem}>
                                    <span>✨</span> {mission.rewards.xp} XP
                                </li>
                            )}
                            {mission.rewards.currency && (
                                <li className={styles.rewardItem}>
                                    <span>💎</span> {mission.rewards.currency} Credits
                                </li>
                            )}
                            {mission.rewards.unlocksModuleId && (
                                <li className={styles.rewardItem}>
                                    <span>🎁</span> New Module Unlocked!
                                </li>
                            )}
                            {!mission.rewards.xp && !mission.rewards.currency && !mission.rewards.unlocksModuleId && (
                                <li className={styles.rewardItem} style={{ color: 'var(--color-text-disabled)' }}>
                                    No rewards listed
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.startButton} onClick={onStart} data-testid="start-mission-btn">
                        Start Mission
                    </button>
                </div>
            </div>
        </div>
    );
};
