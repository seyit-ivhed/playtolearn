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
    const damageDiff = (newStats.abilityDamage || 0) - (oldStats.abilityDamage || 0);

    return (
        <div className={styles.overlay}>
            <GameParticles options={CONFETTI_OPTIONS} className={styles.particles} />

            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('camp.level_up_title', 'LEVEL UP!')}</h1>
                    <div className={styles.subtitle}>{companion.name} reached Level {newLevel}!</div>
                </div>

                <div className={styles.characterSection}>
                    <div className={styles.portraitContainer}>
                        <img
                            src={getCompanionSprite(companion.id)}
                            alt={companion.name}
                            className={styles.portrait}
                        />
                        <div className={styles.levelBadge}>{newLevel}</div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Max Health</div>
                        <div className={styles.statValue}>
                            {oldStats.maxHealth}
                            <ArrowRight className={styles.arrow} size={20} />
                            {newStats.maxHealth}
                            <span className={styles.increase}>(+{healthDiff})</span>
                        </div>
                        <Heart size={24} color="#ff6b6b" style={{ marginTop: 10 }} />
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Ability Damage</div>
                        <div className={styles.statValue}>
                            {oldStats.abilityDamage || 0}
                            <ArrowRight className={styles.arrow} size={20} />
                            {newStats.abilityDamage || 0}
                            <span className={styles.increase}>(+{damageDiff})</span>
                        </div>
                        <Swords size={24} color="#ffd700" style={{ marginTop: 10 }} />
                    </div>
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
