import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game/store';
import styles from './CampPage.module.css';
import { usePremiumStore } from '../../stores/premium.store';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { CampfireScene } from './components/CampfireScene';
import { LevelUpModal } from './components/LevelUpModal';
import { getCompanionById } from '../../data/companions.data';
import { getStatsForLevel } from '../../utils/progression.utils';
import camp1 from '../../assets/images/camps/camp-1.png';
import camp2 from '../../assets/images/camps/camp-2.png';
import type { Companion, CompanionStats } from '../../types/companion.types';

const CAMP_BACKGROUNDS: Record<string, string> = {
    '1': camp1,
    '2': camp2,
};

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const { adventureId, nodeIndex: nodeIndexParam } = useParams<{ adventureId: string; nodeIndex: string }>();
    const nodeIndex = parseInt(nodeIndexParam || '1', 10);

    // Level Up Modal State
    const [levelUpData, setLevelUpData] = React.useState<{
        companion: Companion;
        oldStats: CompanionStats;
        newStats: CompanionStats;
        oldLevel: number;
        newLevel: number;
    } | null>(null);
    const {
        activeParty,

        companionStats,
        completeEncounter,
        levelUpCompanion
    } = useGameStore();

    const isProgressionUnlocked = useGameStore(state => state.isAdventureUnlocked);
    const { isAdventureUnlocked: isPremiumUnlocked, initialized: premiumInitialized } = usePremiumStore();

    const { t } = useTranslation();

    // Safety gate: Validate premium and progression
    if (premiumInitialized && adventureId) {
        const access = checkNavigationAccess({
            adventureId,
            nodeIndex,
            isPremiumUnlocked,
            isProgressionUnlocked,
            encounterResults: useGameStore.getState().encounterResults // Use fresh state if necessary, but encounterResults from hook is usually fine.
        });

        if (!access.allowed) {
            navigate('/chronicle', { replace: true });
            return null;
        }
    }

    // Helper to get remaining slots
    const slots = Array(MAX_PARTY_SIZE).fill(null).map((_, i) => activeParty[i] || null);

    const handleLevelUp = (companionId: string) => {
        const companion = getCompanionById(companionId);
        // Find current stats
        const currentStats = companionStats[companionId] || { level: 1 };

        if (!companion) return;

        const nextLevel = currentStats.level + 1;
        const oldStatValues = getStatsForLevel(companion, currentStats.level);
        const newStatValues = getStatsForLevel(companion, nextLevel);

        // Set data for modal triggers
        setLevelUpData({
            companion,
            oldStats: oldStatValues,
            newStats: newStatValues,
            oldLevel: currentStats.level,
            newLevel: nextLevel
        });

        // Apply logic immediately
        levelUpCompanion(companionId);
    };

    const handlePackUp = () => {
        if (adventureId) {
            completeEncounter(adventureId, nodeIndex);
            // After camp, we focus on the SAME node if they just wanted to rest, 
            // but usually camp is a transition. Let's focus on the next one.
            navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex + 1 } });
        } else {
            navigate('/chronicle');
        }
    };

    // New logic: check if ANY companion can level up
    // Since leveling is free now, this logic might need adjustment, or just always be true/false based on game design.
    // For now, let's say "true" if max level not reached.
    const canLevelAny = slots.some(compId => {
        if (!compId) return false;
        const stats = companionStats[compId] || { level: 1 };
        return stats.level < 10;
    });

    const backgroundUrl = adventureId ? CAMP_BACKGROUNDS[adventureId] : null;

    return (
        <div
            className={styles.container}
            style={backgroundUrl ? {
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.6)), url(${backgroundUrl})`
            } : {}}
        >
            <div className={styles.headerSection}>
                <h1 className={styles.simpleTitle} data-testid="camp-title">{t('party_camp')}</h1>

            </div>

            <div className={styles.content}>
                <CampfireScene
                    slots={slots}

                    companionStats={companionStats}
                    onLevelUp={handleLevelUp}
                />
            </div>

            <div className={styles.footerSection}>
                <button
                    onClick={handlePackUp}
                    className={`${styles.backButton} ${!canLevelAny ? styles.glowButton : ''}`}
                    data-testid="nav-map-btn"
                >
                    {t('common.continue')}
                </button>
            </div>


            {levelUpData && (
                <LevelUpModal
                    companion={levelUpData.companion}
                    oldStats={levelUpData.oldStats}
                    newStats={levelUpData.newStats}
                    oldLevel={levelUpData.oldLevel}
                    newLevel={levelUpData.newLevel}
                    onClose={() => setLevelUpData(null)}
                />
            )}
        </div>
    );
};

export default CampPage;
