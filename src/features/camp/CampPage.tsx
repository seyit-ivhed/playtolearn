import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game.store';
import { ADVENTURES } from '../../data/adventures.data';
import styles from './CampPage.module.css';
import { CampfireScene } from './components/CampfireScene';
import { FellowshipRoster } from './components/FellowshipRoster';
import { LevelUpModal } from './components/LevelUpModal';
import { getCompanionById } from '../../data/companions.data';
import { getXpForNextLevel, getStatsForLevel } from '../../utils/progression.utils';
import type { Companion, CompanionStats } from '../../types/companion.types';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const { nodeId } = useParams<{ nodeId: string }>();

    // Level Up Modal State
    const [levelUpData, setLevelUpData] = React.useState<{
        companion: Companion;
        oldStats: CompanionStats;
        newStats: CompanionStats;
        oldLevel: number;
        newLevel: number;
    } | null>(null);
    const {
        unlockedCompanions,
        activeParty,
        addToParty,
        removeFromParty,
        xpPool,
        companionStats,
        activeAdventureId,
        currentMapNode,
        completeEncounter,
        levelUpCompanion
    } = useGameStore();

    const { t } = useTranslation();


    // Get active adventure and current camp info
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    // Find encounter either by ID from URL or fallback to current node
    const encounter = nodeId
        ? adventure?.encounters.find(e => e.id === nodeId)
        : adventure?.encounters[currentMapNode - 1];

    const currentEncounterIndex = adventure?.encounters.findIndex(e => e.id === encounter?.id) ?? -1;
    const nodeIndex = currentEncounterIndex + 1;

    // Helper to get remaining slots
    const slots = Array(MAX_PARTY_SIZE).fill(null).map((_, i) => activeParty[i] || null);

    const handleLevelUp = (companionId: string) => {
        const companion = getCompanionById(companionId);
        // Find current stats
        const currentStats = companionStats[companionId] || { level: 1, xp: 0 };

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
        completeEncounter(nodeIndex);
        navigate('/map');
    };

    // New logic: check if ANY companion can level up
    const canLevelAny = slots.some(compId => {
        if (!compId) return false;
        const stats = companionStats[compId] || { level: 1, xp: 0 };
        const data = getCompanionById(compId);
        if (!data) return false;
        return typeof xpPool === 'number' &&
            xpPool >= (getXpForNextLevel(stats.level) - stats.xp) &&
            stats.level < 10;
    });

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h1 className={styles.simpleTitle}>{t('party_camp')}</h1>
                <div className={styles.xpPoolDisplay}>
                    <span className={styles.xpLabel}>Shared XP</span>
                    <span className={styles.xpValue}>{xpPool}</span>
                </div>
            </div>

            <div className={styles.content}>
                <CampfireScene
                    slots={slots}
                    xpPool={xpPool}
                    companionStats={companionStats}
                    onRemove={removeFromParty}
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

            <FellowshipRoster
                unlockedCompanions={unlockedCompanions}
                activeParty={activeParty}
                maxPartySize={MAX_PARTY_SIZE}
                onAdd={addToParty}
            />

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
