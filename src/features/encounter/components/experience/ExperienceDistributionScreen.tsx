import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/stores/game/store';
import { EXPERIENCE_CONFIG, getRequiredXpForNextLevel } from '@/data/experience.data';
import { COMPANIONS } from '@/data/companions.data';
import type { Companion } from '@/types/companion.types';
import { getStatsForLevel } from '@/utils/progression.utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CompanionExperienceCard } from './CompanionExperienceCard';
import { LevelUpModal } from './LevelUpModal';
import styles from './ExperienceDistributionScreen.module.css';

interface ExperienceDistributionScreenProps {
    partyIds: string[];
    previousStats: Record<string, { experience?: number; level?: number }>;
    onContinue: () => void;
}

export const ExperienceDistributionScreen: React.FC<ExperienceDistributionScreenProps> = ({
    partyIds,
    previousStats,
    onContinue
}) => {
    const { t } = useTranslation();
    const { companionStats, levelUpCompanion } = useGameStore();
    const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(null);

    // Merge static data with dynamic stats
    const partyCompanionsData = partyIds.map(id => {
        const base = COMPANIONS[id]; // Static data
        const stats = companionStats[id]; // Dynamic stats

        if (!base || !stats) {
            if (!stats) {
                console.error(`Companion stats not found in ExperienceDistributionScreen for ${id}`);
            }
            return null;
        }

        // Calculate full derived stats for the current level
        const calculatedStats = getStatsForLevel(base, stats.level);

        // Return the companion object with updated level and stats
        const companion: Companion = {
            ...base,
            level: stats.level,
            stats: calculatedStats
        };

        return {
            companion,
            experience: stats.experience
        };
    }).filter((c): c is NonNullable<typeof c> => c !== null);

    const handleLevelUpClick = (companionId: string) => {
        setSelectedCompanionId(companionId);
    };

    const handleConfirmLevelUp = () => {
        if (selectedCompanionId) {
            levelUpCompanion(selectedCompanionId);
            setSelectedCompanionId(null);
        }
    };

    const anyCanLevelUp = partyCompanionsData.some(({ companion, experience }) => {
        if (companion.level >= EXPERIENCE_CONFIG.MAX_LEVEL) return false;
        const requiredXp = getRequiredXpForNextLevel(companion.level);
        return experience >= requiredXp;
    });

    return (
        <div className={styles.container} data-testid="experience-screen">


            <div className={styles.cardsContainer}>
                {partyCompanionsData.map(({ companion, experience }) => {
                    const prev = previousStats[companion.id];
                    // If level increased, it's more complex, but we only cap if level is HIGH.
                    // If level stayed same, gained = current - prev.
                    // If level increased, gained = (req - prev) + current.
                    let actualGainedXp = 0;
                    if (prev) {
                        if (prev.level === companion.level) {
                            actualGainedXp = (experience || 0) - (prev.experience || 0);
                        } else if ((prev.level || 0) < companion.level) {
                            // Level up happened
                            const req = getRequiredXpForNextLevel(prev.level || 1);
                            actualGainedXp = (req - (prev.experience || 0)) + (experience || 0);
                        }
                    }

                    return (
                        <CompanionExperienceCard
                            key={companion.id}
                            companion={companion}
                            currentExperience={experience}
                            previousStats={prev}
                            gainedXp={actualGainedXp}
                            onLevelUpClick={() => handleLevelUpClick(companion.id)}
                        />
                    );
                })}
            </div>

            {!anyCanLevelUp && (
                <div className={styles.actionsContainer}>
                    <PrimaryButton
                        variant="gold"
                        radiate={true}
                        onClick={onContinue}
                        data-testid="continue-button"
                        className={styles.continueButton}
                    >
                        {t('common.continue')}
                    </PrimaryButton>
                </div>
            )}

            {selectedCompanionId && (() => {
                const selectedData = partyCompanionsData.find(c => c.companion.id === selectedCompanionId);
                if (!selectedData) {
                    return null;
                }
                return (
                    <LevelUpModal
                        companion={selectedData.companion}
                        onConfirm={handleConfirmLevelUp}
                    />
                );
            })()}
        </div>
    );
};
