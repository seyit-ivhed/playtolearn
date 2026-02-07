import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game/store';
import { useEncounterStore } from '../../stores/encounter/store';
import { usePremiumStore } from '../../stores/premium.store';
import { getFocalNodeIndex } from './utils/navigation.utils';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { DifficultySelectionModal } from './components/DifficultySelectionModal';
import './AdventurePage.css';

import { ADVENTURES } from '../../data/adventures.data';
import { EncounterType, type Encounter, type AdventureMonster } from '../../types/adventure.types';
import { FantasyMap } from './components/FantasyMap';
import { AdventureHeader } from './components/AdventureHeader';

const AdventurePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { adventureId } = useParams<{ adventureId: string }>();

    const {
        companionStats,
        encounterResults,
        setEncounterDifficulty,
        activeEncounterDifficulty,
        completeEncounter,
        completeAdventure,
        unlockAdventure,
        isAdventureUnlocked: isProgressionUnlocked,
        notifyEncounterStarted
    } = useGameStore();
    const { initializeEncounter } = useEncounterStore();
    const {
        isAdventureUnlocked: isPremiumUnlocked,
        initialized: premiumInitialized
    } = usePremiumStore();

    const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
    const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);


    // Get active adventure
    const adventure = ADVENTURES.find(a => a.id === adventureId);

    // Safety gate: Validate premium and progression
    if (premiumInitialized && adventureId) {
        const access = checkNavigationAccess({
            adventureId,
            isPremiumUnlocked,
            isProgressionUnlocked,
            encounterResults
        });

        if (!access.allowed) {
            navigate('/chronicle', { replace: true });
            return null;
        }
    }

    if (!adventure || !adventureId) {
        return <div>{t('adventure.not_found', 'Adventure not found')}</div>;
    }

    // Dynamic focal node logic
    const focalNodeFromState = (location.state as { focalNode?: number } | null)?.focalNode;
    const currentNode = focalNodeFromState ?? getFocalNodeIndex(adventureId, encounterResults);

    const { encounters } = adventure;

    const handleNodeClick = (encounter: typeof encounters[0]) => {
        if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS || encounter.type === EncounterType.PUZZLE) {
            setSelectedEncounter(encounter);
            setIsDifficultyModalOpen(true);
        }

        if (encounter.type === EncounterType.ENDING) {
            // Complete current adventure in game progress
            completeEncounter(adventureId, encounters.findIndex(e => e.id === encounter.id) + 1);

            // Mark adventure as completed in metadata store
            completeAdventure(adventureId);

            // Find next adventure to unlock
            const currentAdventureIndex = ADVENTURES.findIndex(a => a.id === adventureId);
            if (currentAdventureIndex !== -1 && currentAdventureIndex < ADVENTURES.length - 1) {
                const nextAdventure = ADVENTURES[currentAdventureIndex + 1];
                unlockAdventure(nextAdventure.id);
            }

            navigate('/chronicle', { state: { justCompletedAdventureId: adventureId } });
        }
    };

    const handleStartEncounter = (difficulty: number) => {
        if (!selectedEncounter) {
            return;
        }

        const nodeStep = encounters.findIndex(e => e.id === selectedEncounter.id) + 1;
        setEncounterDifficulty(difficulty);

        // Notify store encounter started (handles data-driven companion joins)
        notifyEncounterStarted(adventureId, nodeStep);

        if (selectedEncounter.type === EncounterType.BATTLE || selectedEncounter.type === EncounterType.BOSS) {
            if (selectedEncounter.enemies && selectedEncounter.enemies.length > 0) {
                const localizedEnemies = selectedEncounter.enemies.map((enemy: AdventureMonster) => ({
                    ...enemy,
                    name: t(`monsters.${enemy.id}.name`, enemy.name || enemy.id)
                }));

                // Use the latest party from the store to ensure it includes any companion that just joined
                const latestParty = useGameStore.getState().activeParty;
                initializeEncounter(latestParty, localizedEnemies, nodeStep, difficulty, companionStats);
                navigate(`/encounter/${adventureId}/${nodeStep}`);
            }
        } else if (selectedEncounter.type === EncounterType.PUZZLE) {
            navigate(`/puzzle/${adventureId}/${nodeStep}`);
        }

        setIsDifficultyModalOpen(false);
    };

    const getInitialDifficulty = () => {
        // Per user request: Always stick to previously selected difficulty ("sticky").
        // activeEncounterDifficulty tracks the last difficulty used to START an encounter.
        return activeEncounterDifficulty;
    };



    return (
        <div className="adventure-page custom-scrollbar">
            <main className="adventure-content">
                <AdventureHeader
                    adventureId={adventure.id}
                    adventureTitle={t(`adventures.${adventureId}.title`, adventure.title || t('common.adventure', 'Adventure'))}
                    onBack={() => navigate(`/chronicle/${adventureId}`)}
                />

                <FantasyMap
                    adventure={adventure}
                    currentNode={currentNode}
                    onNodeClick={handleNodeClick}
                />
            </main>

            <DifficultySelectionModal
                isOpen={isDifficultyModalOpen}
                onClose={() => setIsDifficultyModalOpen(false)}
                onStart={handleStartEncounter}
                title={(selectedEncounter ? t(`adventures.${adventureId}.nodes.${selectedEncounter.id}.label`, selectedEncounter.label || '') : '') as string}
                initialDifficulty={getInitialDifficulty()}
            />
        </div>
    );
};

export default AdventurePage;
