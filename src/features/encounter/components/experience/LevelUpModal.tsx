import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Sword } from 'lucide-react';
import styles from './ExperienceDistributionScreen.module.css';
import type { Companion } from '../../../../types/companion.types';
import { getStatsForLevel } from '../../../../utils/progression.utils';
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

    // Image source - full background level-up image
    const imageSrc = getCompanionLevelUpImage(companion.id, nextLevel) || '';

    const hpIncrease = nextStats.maxHealth - currentStats.maxHealth;
    const atkIncrease = (nextStats.abilityDamage || 0) - (currentStats.abilityDamage || 0);

    return (
        <div className={styles.modalOverlay} data-testid="level-up-modal">
            <motion.div
                className={styles.levelUpFullScreen}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Full Screen Background Image */}
                <div
                    className={styles.fullScreenBg}
                    style={{ backgroundImage: `url(${imageSrc})` }}
                />

                {/* Vignette Overlay */}
                <div className={styles.fullScreenOverlay} />

                {/* Bottom HUD: 3 Columns anchored to bottom */}
                <div className={styles.bottomActionsRow}>
                    {/* Left Column: HP Increase */}
                    <motion.div
                        className={styles.statPulseBox}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <Heart className={styles.statIconHP} size={32} />
                        <div className={styles.statAmount}>+{hpIncrease}</div>
                    </motion.div>

                    {/* Center Column: Level Display (Top) + Continue Button (Bottom) */}
                    <div className={styles.centerActionsColumn}>
                        <motion.div
                            className={styles.levelStompContainer}
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: 0.2,
                                duration: 0.5,
                                type: "spring",
                                damping: 12
                            }}
                        >
                            <span className={styles.levelLabelPrefix}>{t('level').toUpperCase()}</span>
                            <span className={styles.levelValueLarge}>{nextLevel}</span>
                        </motion.div>

                        <motion.div
                            className={styles.modalFooter}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <button className={styles.modalContinueButtonSmall} onClick={onConfirm} data-testid="modal-continue-button">
                                {t('continue').toUpperCase()}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: ATK Increase */}
                    <motion.div
                        className={styles.statPulseBox}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <Sword className={styles.statIconATK} size={32} />
                        <div className={styles.statAmount}>+{atkIncrease}</div>
                    </motion.div>
                </div>

                {/* Visual Flair Lines */}
                <div className={styles.flairContainer}>
                    <div className={styles.horizontalLine} />
                </div>
            </motion.div>
        </div>
    );
};
