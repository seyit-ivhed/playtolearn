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
    oldLevel,
    newLevel,
    onClose
}) => {
    const { t } = useTranslation();
    const oldImage = getCompanionSprite(companion.id, oldLevel);
    const newImage = getCompanionSprite(companion.id, newLevel);
    const isEvolution = oldImage !== newImage;

    // State for evolution sequence
    const [showEvolution, setShowEvolution] = React.useState(!isEvolution);
    const [triggerBang, setTriggerBang] = React.useState(false);

    React.useEffect(() => {
        if (isEvolution) {
            const timer = setTimeout(() => {
                setTriggerBang(true);
                // Switch image shortly after bang starts
                setTimeout(() => {
                    setShowEvolution(true);
                }, 100);
            }, 2000); // Wait 2 seconds instead of 1
            return () => clearTimeout(timer);
        }
    }, [isEvolution]);

    const healthDiff = newStats.maxHealth - oldStats.maxHealth;
    const attackDiff = (newStats.abilityDamage || 0) - (oldStats.abilityDamage || 0);

    const companionImage = showEvolution ? newImage : oldImage;
    const abilityId = newStats.specialAbilityId || companion.specialAbility.id;
    const abilityVariables = newStats.specialAbilityVariables || companion.specialAbility.variables || {};
    const abilityName = t(`abilities.${abilityId}.name`);
    const abilityDescription = t(`abilities.${abilityId}.description`, {
        ...abilityVariables,
        value: Object.values(abilityVariables)[0]
    });

    return (
        <div className={styles.overlay}>
            <GameParticles options={CONFETTI_OPTIONS} className={styles.particles} />

            <div className={`${styles.content} ${triggerBang ? styles.bangEffect : ''}`}>
                {companionImage && (
                    <div className={styles.backgroundWrapper}>
                        <img
                            key={companionImage}
                            src={companionImage}
                            alt=""
                            className={`${styles.backgroundImage} ${showEvolution && isEvolution ? styles.evolvedImage : ''}`}
                        />
                    </div>
                )}

                {triggerBang && <div className={styles.evolutionFlash} />}

                <div className={`${styles.header} ${!showEvolution ? styles.hidden : styles.visible}`}>
                    <h1 className={styles.title}>Level {newLevel}</h1>
                </div>

                <div className={`${styles.mainLayout} ${!showEvolution ? styles.hidden : styles.visible}`}>
                    <div className={styles.statsContainer}>
                        <div className={`${styles.statCard} ${styles.leftStat}`}>
                            <div className={styles.statValue}>
                                {oldStats.maxHealth}
                                <ArrowRight className={styles.arrow} size={16} />
                                {newStats.maxHealth}
                            </div>
                            <div className={styles.increase}>(+{healthDiff})</div>
                            <Heart size={32} color="#ff6b6b" className={styles.statIcon} />
                        </div>

                        <div className={`${styles.statCard} ${styles.rightStat}`}>
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

                <div className={`${styles.abilitySection} ${!showEvolution ? styles.hidden : styles.visible}`}>
                    <div className={styles.abilityName}>{abilityName}</div>
                    <div className={styles.abilityDescription}>{abilityDescription}</div>
                </div>

                <div className={`${styles.footer} ${!showEvolution ? styles.hidden : styles.visible}`}>
                    <button
                        className={styles.continueButton}
                        onClick={onClose}
                    >
                        {t('common.continue', 'Continue')}
                    </button>
                </div>

                {isEvolution && !showEvolution && (
                    <div className={styles.evolutionNarrative}>
                        <div className={styles.evolvingText}>
                            Evolution
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
