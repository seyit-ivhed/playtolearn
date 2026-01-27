import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../../../stores/game/store';
import { EXPERIENCE_CONFIG } from '../../../../data/experience.data';
import { CompanionExperienceCard } from './CompanionExperienceCard';
import { LevelUpModal } from './LevelUpModal';
import styles from './ExperienceDistributionScreen.module.css';
import { COMPANIONS } from '../../../../data/companions.data';
import type { Companion } from '../../../../types/companion.types';
import { getStatsForLevel } from '../../../../utils/progression.utils';

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

        if (!base || !stats) return null;

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

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('experienceGained')}</h1>

            <div className={styles.cardsContainer}>
                {partyCompanionsData.map(({ companion, experience }) => (
                    <CompanionExperienceCard
                        key={companion.id}
                        companion={companion}
                        currentExperience={experience}
                        previousStats={previousStats[companion.id]}
                        gainedXp={EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD}
                        onLevelUpClick={() => handleLevelUpClick(companion.id)}
                    />
                ))}
            </div>

            <button
                className={`${styles.continueButton} ${styles.visible}`}
                onClick={onContinue}
            >
                {t('continue')}
            </button>

            {selectedCompanionId && (
                <LevelUpModal
                    companion={partyCompanionsData.find(c => c.companion.id === selectedCompanionId)!.companion}
                    onConfirm={handleConfirmLevelUp}
                />
            )}
        </div>
    );
};
