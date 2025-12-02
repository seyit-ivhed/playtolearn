import React from 'react';
import styles from './RewardSummary.module.css';
import type { MissionReward } from '../../types/mission.types';

interface RewardSummaryProps {
    rewards: MissionReward;
    onNext: () => void;
    onReturn: () => void;
}

export const RewardSummary: React.FC<RewardSummaryProps> = ({
    rewards,
    onNext,
    onReturn,
}) => {
    const hasRewards = rewards.xp || rewards.currency || rewards.unlocksModuleId;

    return (
        <div className={styles.container} data-testid="reward-summary">
            <h2 className={styles.title}>Mission Complete!</h2>
            <p className={styles.subtitle}>Excellent work, Cadet. Here are your rewards:</p>

            <div className={styles.rewardsContainer}>
                {rewards.xp && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>✨</span>
                        <span>+{rewards.xp} XP</span>
                    </div>
                )}

                {rewards.currency && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>💎</span>
                        <span>+{rewards.currency} Credits</span>
                    </div>
                )}

                {rewards.unlocksModuleId && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>🎁</span>
                        <span data-testid="new-module-unlocked">New Module Unlocked!</span>
                    </div>
                )}

                {!hasRewards && (
                    <div className={styles.rewardItem} style={{ color: 'var(--color-text-disabled)' }}>
                        No rewards for this mission.
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onReturn} data-testid="return-to-base-button">
                    Return to Base
                </button>
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={onNext}>
                    Next Mission
                </button>
            </div>
        </div>
    );
};
