import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Swords, ArrowRight } from 'lucide-react';
import type { Companion, CompanionStats } from '../../../types/companion.types';
import { GameParticles } from '../../../components/ui/GameParticles';
import { CONFETTI_OPTIONS } from '../../../components/ui/GameParticles.constants';
import { getCompanionSprite } from '../../../data/companion-sprites';
import styles from './LevelUpModal.module.css';

interface LevelUpModalProps {
    companion: Companion;
    oldStats: CompanionStats;
    newStats: CompanionStats;
    oldLevel: number;
    newLevel: number;
    onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
    companion,
    oldStats,
    newStats,
    newLevel,
    onClose
}) => {
    const { t } = useTranslation();

    const healthDiff = newStats.maxHealth - oldStats.maxHealth;
    const attackDiff = (newStats.abilityDamage || 0) - (oldStats.abilityDamage || 0);

    const companionImage = getCompanionSprite(companion.id, newLevel);
    const abilityId = newStats.specialAbilityId || companion.specialAbility.id;
    const abilityValue = newStats.specialAbilityValue || companion.specialAbility.value;
    const abilityName = t(`abilities.${abilityId}.name`);
    const abilityDescription = t(`abilities.${abilityId}.description`, { value: abilityValue });

    return (
        <div className={styles.overlay}>
            <GameParticles options={CONFETTI_OPTIONS} className={styles.particles} />

            <div className={styles.content}>
                {companionImage && (
                    <div className={styles.backgroundWrapper}>
                        <img
                            src={companionImage}
                            alt=""
                            className={styles.backgroundImage}
                        />
                    </div>
                )}

                <div className={styles.header}>
                    <h1 className={styles.title}>Level {newLevel}</h1>
                </div>

                <div className={styles.mainLayout}>
                    <div className={styles.statsContainer}>
                        <div className={`${styles.statCard} ${styles.leftStat}`}>
                            <div className={styles.statLabel}>{t('companions.stats.hp', 'Health')}</div>
                            <div className={styles.statValue}>
                                {oldStats.maxHealth}
                                <ArrowRight className={styles.arrow} size={16} />
                                {newStats.maxHealth}
                            </div>
                            <div className={styles.increase}>(+{healthDiff})</div>
                            <Heart size={32} color="#ff6b6b" className={styles.statIcon} />
                        </div>

                        <div className={`${styles.statCard} ${styles.rightStat}`}>
                            <div className={styles.statLabel}>{t('companions.stats.attack', 'Attack')}</div>
                            <div className={styles.statValue}>
                                {oldStats.abilityDamage || 0}
                                <ArrowRight className={styles.arrow} size={16} />
                                {newStats.abilityDamage || 0}
                            </div>
                            <div className={styles.increase}>(+{attackDiff})</div>
                            <Swords size={32} color="#ffd700" className={styles.statIcon} />
                        </div>
                    </div>
                </div>

                <div className={styles.abilitySection}>
                    <div className={styles.abilityLabel}>Ultimate Ability</div>
                    <div className={styles.abilityName}>{abilityName}</div>
                    <div className={styles.abilityDescription}>{abilityDescription}</div>
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.continueButton}
                        onClick={onClose}
                    >
                        {t('common.continue', 'Continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};
