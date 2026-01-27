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
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Wait 1 second before starting the animation
        const timer = setTimeout(() => {
            setIsAnimating(true);
            setDisplayXp(currentXp);
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentXp]);

    // Check if ready to level up based on REAL store state
    const canLevelUp = (currentXp >= requiredXp);

    const fillPercentage = Math.min((displayXp / requiredXp) * 100, 100);

    return (
        <div
            className={`${styles.card} ${canLevelUp ? styles.canLevelUp : ''}`}
            onClick={canLevelUp ? onLevelUpClick : undefined}
            role={canLevelUp ? "button" : undefined}
            tabIndex={canLevelUp ? 0 : undefined}
        >
            {/* Top Name Badge */}
            <div className={styles.nameBadge}>
                <h3 className={styles.nameText}>{companion.name}</h3>
            </div>

            {/* Full-fill portrait background */}
            <div className={styles.portraitContainer}>
                <img
                    src={getCompanionCardImage(companion.id, currentLevel) || ''}
                    alt={companion.name}
                    className={styles.portrait}
                />
            </div>

            {/* Bottom Content overlay - hidden if leveling up */}
            {!canLevelUp && (
                <div className={styles.cardContent}>
                    <div className={styles.xpContainer}>
                        <div className={styles.xpBarBg}>
                            <div
                                className={`${styles.xpBarFill} ${isAnimating ? styles.isAnimating : ''}`}
                                style={{ width: `${fillPercentage}%` }}
                            />
                        </div>

                        <div className={styles.companionTitle}>
                            {t(companion.title)}
                        </div>

                        <div className={styles.levelLabel}>
                            <span className={styles.lvlPrefix}>{t('level').toUpperCase()}</span>
                            <span className={styles.lvlValue}>{currentLevel}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Huge Arrow Overlay when Level Up is possible */}
            {canLevelUp && (
                <div className={styles.levelUpOverlay}>
                    <ArrowUp className={styles.hugeArrow} />
                    <div className={styles.overlayLevelUpText}>
                        {t('levelUp').toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
};
