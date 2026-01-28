import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import styles from './CompanionExperienceCard.module.css';
import type { Companion } from '../../../../types/companion.types';
import { getRequiredXpForNextLevel, EXPERIENCE_CONFIG } from '../../../../data/experience.data';
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

    // logical check for interactions
    const isMaxLevel = currentLevel >= EXPERIENCE_CONFIG.MAX_LEVEL;
    const canLevelUp = !isMaxLevel && (currentXp >= requiredXp);

    // Animation State
    const [displayXp, setDisplayXp] = useState(startXp);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showLevelUpVisual, setShowLevelUpVisual] = useState(false);

    // If the new XP is lower than what we're currently displaying (depletion/level up reset)
    // or if we are at max level or already have enough XP to level up without animation,
    // adjust state during render (React recommended pattern)
    if (currentXp < displayXp) {
        setIsAnimating(false);
        setDisplayXp(currentXp);
        setShowLevelUpVisual(false);
    } else if (isMaxLevel && showLevelUpVisual) {
        setShowLevelUpVisual(false);
    } else if (!showLevelUpVisual && !isMaxLevel && currentXp >= requiredXp && displayXp >= currentXp && !isAnimating) {
        // If we are already at or above requirements and not currently animating, show visual immediately
        setShowLevelUpVisual(true);
    }

    useEffect(() => {
        // Animation logic only for non-max level companions and if target not yet reached
        if (isMaxLevel || displayXp >= currentXp) {
            return;
        }

        // Wait 1 second before starting the animation for increases
        const timer = setTimeout(() => {
            setIsAnimating(true);
            setDisplayXp(currentXp);

            // After the filling animation (matches CSS transition 2.5s), show level up if ready
            if (currentXp >= requiredXp) {
                const visualTimer = setTimeout(() => {
                    setShowLevelUpVisual(true);
                }, 2500);
                return () => {
                    clearTimeout(visualTimer);
                };
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [currentXp, displayXp, requiredXp, isMaxLevel]);

    const fillPercentage = isMaxLevel ? 100 : Math.min((displayXp / requiredXp) * 100, 100);

    return (
        <div
            className={`${styles.card} ${canLevelUp && showLevelUpVisual ? styles.canLevelUp : ''}`}
            onClick={canLevelUp && showLevelUpVisual ? onLevelUpClick : undefined}
            role={canLevelUp && showLevelUpVisual ? "button" : undefined}
            tabIndex={canLevelUp && showLevelUpVisual ? 0 : undefined}
            data-testid={`companion-card-${companion.id}`}
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

            {/* Bottom Content overlay - hidden only after animation finishes if leveling up */}
            {!showLevelUpVisual && (
                <div className={styles.cardContent}>
                    <div className={styles.xpContainer}>
                        {!isMaxLevel && (
                            <div className={styles.xpBarBg}>
                                <div
                                    className={`${styles.xpBarFill} ${isAnimating ? styles.isAnimating : ''}`}
                                    style={{ width: `${fillPercentage}%` }}
                                />
                            </div>
                        )}

                        <div className={styles.companionTitle}>
                            {t(companion.stats?.title || companion.title)}
                        </div>

                        <div className={styles.levelLabel}>
                            <span className={styles.lvlPrefix}>{t('common.level').toUpperCase()}</span>
                            <span className={styles.lvlValue}>{currentLevel}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Huge Arrow Overlay when Level Up is possible and animation is done */}
            {canLevelUp && showLevelUpVisual && (
                <div className={styles.levelUpOverlay} data-testid="level-up-indicator">
                    <ArrowUp className={styles.hugeArrow} />
                    <div className={styles.overlayLevelUpText}>
                        {t('companions.level_up').toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
};
