import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import styles from './ExperienceDistributionScreen.module.css';
import type { Companion } from '../../../../types/companion.types';
import { getRequiredXpForNextLevel } from '../../../../data/experience.data';
import { getCompanionCardImage } from '../../../../data/companion-sprites';

interface CompanionExperienceCardProps {
    companion: Companion;
    currentExperience: number;
    previousStats?: { experience?: number; level?: number };
    gainedXp: number;
    onLevelUpClick: () => void;
}

export const CompanionExperienceCard: React.FC<CompanionExperienceCardProps> = ({
    companion,
    currentExperience,
    previousStats,
    gainedXp,
    onLevelUpClick
}) => {
    const { t } = useTranslation();

    // Stats
    const currentLevel = companion.level;
    const currentXp = currentExperience;

    const startXp = previousStats?.experience ?? (currentXp - gainedXp);

    const requiredXp = getRequiredXpForNextLevel(currentLevel);

    // Animation State
    const [displayXp, setDisplayXp] = useState(startXp);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => {
            setDisplayXp(currentXp);
        }, 300);
        return () => clearTimeout(timer);
    }, [currentXp]);

    // Check if ready to level up based on REAL store state
    const canLevelUp = (currentXp >= requiredXp);

    const fillPercentage = Math.min((displayXp / requiredXp) * 100, 100);

    return (
        <div className={`${styles.card} ${canLevelUp ? styles.glow : ''}`}>
            <div className={styles.portraitContainer}>
                <img
                    src={getCompanionCardImage(companion.id, currentLevel) || ''}
                    alt={companion.name}
                    className={styles.portrait}
                />
                <div className={styles.levelBadge}>
                    {t('lvl')} {currentLevel}
                </div>
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.name}>{companion.name}</h3>
                <div className={styles.titleText}>{t(companion.title)}</div>

                <div className={styles.xpContainer}>
                    <div className={styles.xpBarBg}>
                        <div
                            className={styles.xpBarFill}
                            style={{ width: `${fillPercentage}%` }}
                        />
                    </div>
                    <div className={styles.xpText}>
                        {Math.floor(displayXp)} / {requiredXp} XP
                    </div>
                </div>

                {canLevelUp && (
                    <button
                        className={styles.levelUpButton}
                        onClick={onLevelUpClick}
                        aria-label={t('levelUp')}
                    >
                        <ArrowUp className={styles.levelUpIcon} />
                    </button>
                )}
            </div>
        </div>
    );
};
