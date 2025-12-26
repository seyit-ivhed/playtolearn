import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game.store';
import { usePlayerStore } from '../../stores/player.store';
import { useEncounterStore } from '../../stores/encounter.store';
import { DifficultySelectionModal } from './components/DifficultySelectionModal';
import './AdventurePage.css';

import { ADVENTURES } from '../../data/adventures.data';
import { EncounterType } from '../../types/adventure.types';
import { FantasyMap } from './components/FantasyMap';

const AdventurePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        activeParty: party,
        activeAdventureId,
        companionStats,
        currentMapNode,
        encounterResults,
        setEncounterDifficulty,
        activeEncounterDifficulty
    } = useGameStore();
    const { initializeEncounter } = useEncounterStore();
    const { difficulty: playerDifficulty } = usePlayerStore();

    const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
    const [selectedEncounter, setSelectedEncounter] = useState<any>(null);

    // Get active adventure
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    if (!adventure) {
        return <div>{t('adventure.not_found', 'Adventure not found')}</div>;
    }

    const { encounters } = adventure;

    const handleNodeClick = (encounter: typeof encounters[0]) => {
        if (encounter.type === EncounterType.CAMP) {
            navigate(`/camp/${encounter.id}`);
            return;
        }

        if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS || encounter.type === EncounterType.PUZZLE) {
            setSelectedEncounter(encounter);
            setIsDifficultyModalOpen(true);
        }
    };

    const handleStartEncounter = (difficulty: number) => {
        if (!selectedEncounter) return;

        const nodeStep = encounters.indexOf(selectedEncounter) + 1;
        setEncounterDifficulty(difficulty);

        if (selectedEncounter.type === EncounterType.BATTLE || selectedEncounter.type === EncounterType.BOSS) {
            if (selectedEncounter.enemies && selectedEncounter.enemies.length > 0) {
                const xpReward = selectedEncounter.xpReward;
                const localizedEnemies = selectedEncounter.enemies.map((enemy: any) => ({
                    ...enemy,
                    name: t(`monsters.${enemy.id}.name`, enemy.name || enemy.id)
                }));
                initializeEncounter(party, localizedEnemies, xpReward, nodeStep, difficulty, companionStats);
                navigate('/encounter');
            }
        } else if (selectedEncounter.type === EncounterType.PUZZLE) {
            navigate(`/puzzle/${selectedEncounter.id}`);
        }

        setIsDifficultyModalOpen(false);
    };

    const getInitialDifficulty = () => {
        // Per user request: Always stick to previously selected difficulty ("sticky").
        // activeEncounterDifficulty tracks the last difficulty used to START an encounter.

        // Edge case: If this is a fresh session (default 1) and we haven't completed anything,
        // respect the player's profile setting.
        const hasCompletedAny = Object.keys(encounterResults).length > 0;
        if (!hasCompletedAny && activeEncounterDifficulty === 1) {
            return playerDifficulty;
        }

        return activeEncounterDifficulty;
    };

    const getCurrentStars = (encounter: any) => {
        if (!encounter) return 0;
        const nodeStep = encounters.indexOf(encounter) + 1;
        const encounterKey = `${activeAdventureId}_${nodeStep}`;
        return encounterResults[encounterKey]?.stars || 0;
    };

    return (
        <div className="adventure-page custom-scrollbar">
            <main className="adventure-content">
                <FantasyMap
                    adventure={adventure}
                    currentNode={currentMapNode}
                    onNodeClick={handleNodeClick}
                />
            </main>

            <DifficultySelectionModal
                isOpen={isDifficultyModalOpen}
                onClose={() => setIsDifficultyModalOpen(false)}
                onStart={handleStartEncounter}
                title={(selectedEncounter ? t(`adventures.${activeAdventureId}.nodes.${selectedEncounter.id}.label`, selectedEncounter.label || '') : '') as string}
                initialDifficulty={getInitialDifficulty()}
                currentStars={getCurrentStars(selectedEncounter)}
            />
        </div>
    );
};

export default AdventurePage;
