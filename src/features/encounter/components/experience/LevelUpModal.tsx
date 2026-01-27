import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUp, Activity, Sword } from 'lucide-react';
import styles from './ExperienceDistributionScreen.module.css';
import type { Companion } from '../../../../types/companion.types';
import { getEvolutionAtLevel, getStatsForLevel } from '../../../../utils/progression.utils';
import { getCompanionLevelUpImage } from '../../../../data/companion-sprites';

interface LevelUpModalProps {
    companion: Companion;
    onConfirm: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ companion, onConfirm }) => {
    const { t } = useTranslation();
    const currentLevel = companion.level;
    const nextLevel = currentLevel + 1;

    // Stats calculation
    const currentStats = companion.stats || getStatsForLevel(companion, currentLevel);
    const nextStats = getStatsForLevel(companion, nextLevel);

    // Evolution check
    const newEvolution = getEvolutionAtLevel(companion, nextLevel);

    // Image source - preferring wide/splash if available (mocking this logic or using standard image)
    const imageSrc = getCompanionLevelUpImage(companion.id, nextLevel) || '';

    return (
        <div className={styles.modalOverlay}>
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div
                    className={styles.imageSection}
                    style={{ backgroundImage: `url(${imageSrc})` }}
                >
                    <div className={styles.imageOverlay} />
                    {newEvolution && (
                        <div className={styles.evolutionBadge}>
                            {t('evolution')}
                        </div>
                    )}
                </div>

                <div className={styles.detailsSection}>
                    <div>
                        <div className={styles.levelUpHeader}>
                            <h2 className={styles.levelUpTitle}>{t('levelUp')}!</h2>
                            <div className={styles.levelChange}>
                                <span>{t('level')} {currentLevel}</span>
                                <ArrowUp size={24} />
                                <span>{t('level')} {nextLevel}</span>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <div className={styles.statLabel}>{t('health')}</div>
                                <div className={styles.statValue}>
                                    <Activity size={24} color="#e74c3c" />
                                    <span>{currentStats.maxHealth}</span>
                                    <span className={styles.statIncrease}>
                                        +{nextStats.maxHealth - currentStats.maxHealth}
                                    </span>
                                </div>
                            </div>

                            {(currentStats.abilityDamage !== undefined && nextStats.abilityDamage !== undefined) && (
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>{t('power')}</div>
                                    <div className={styles.statValue}>
                                        <Sword size={24} color="#f1c40f" />
                                        <span>{currentStats.abilityDamage}</span>
                                        <span className={styles.statIncrease}>
                                            +{nextStats.abilityDamage - currentStats.abilityDamage}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {newEvolution && (
                            <div className={styles.evoSection}>
                                <div className={styles.evoTitle}>{newEvolution.title}</div>
                                <div className={styles.evoDesc}>
                                    {t('companionHasEvolved')}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className={styles.confirmButton} onClick={onConfirm}>
                        {t('continue')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
