import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdventureRewardSummary.module.css';
import type { AdventureReward } from '../../types/adventure.types';

interface RewardSummaryProps {
    rewards: AdventureReward;
    onNext: () => void;
    onReturn: () => void;
}

export const AdventureRewardSummary: React.FC<RewardSummaryProps> = ({
    rewards,
    onNext,
    onReturn,
}) => {
    const { t } = useTranslation();
    const hasRewards = rewards.xp || rewards.currency || rewards.unlocksCompanionId;

    return (
        <div className={styles.container} data-testid="reward-summary">
            <h2 className={styles.title}>{t('rewards.title')}</h2>
            <p className={styles.subtitle}>{t('rewards.subtitle')}</p>

            <div className={styles.rewardsContainer}>
                {rewards.xp && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>✨</span>
                        <span>{t('rewards.xp', { amount: rewards.xp })}</span>
                    </div>
                )}

                {rewards.currency && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>💎</span>
                        <span>{t('rewards.credits', { amount: rewards.currency })}</span>
                    </div>
                )}

                {rewards.unlocksCompanionId && (
                    <div className={styles.rewardItem}>
                        <span className={styles.icon}>🎁</span>
                        <span data-testid="new-companion-unlocked">{t('rewards.companion_unlocked')}</span>
                    </div>
                )}

                {!hasRewards && (
                    <div className={styles.rewardItem} style={{ color: 'var(--color-text-disabled)' }}>
                        {t('rewards.none')}
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onReturn} data-testid="return-to-camp-button">
                    {t('rewards.return_to_camp')}
                </button>
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={onNext}>
                    {t('rewards.next_adventure')}
                </button>
            </div>
        </div>
    );
};
