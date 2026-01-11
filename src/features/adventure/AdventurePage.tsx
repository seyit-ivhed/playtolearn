import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game/store';
import { useEncounterStore } from '../../stores/encounter/store';
import { useAdventureStore } from '../../stores/adventure.store';
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
        activeParty: party,
        companionStats,
        encounterResults,
        setEncounterDifficulty,
        activeEncounterDifficulty,
        completeEncounter
    } = useGameStore();
    const { initializeEncounter } = useEncounterStore();
    const {
        completeAdventure,
        unlockAdventure,
        isAdventureUnlocked: isProgressionUnlocked
    } = useAdventureStore();
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
            if (encounter.type === EncounterType.CAMP) {
                navigate(`/camp/${adventureId}/${encounters.indexOf(encounter) + 1}`);
                return;
            }
    
            if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS || encounter.type === EncounterType.PUZZLE) {
                setSelectedEncounter(encounter);
                setIsDifficultyModalOpen(true);
            }
    
            if (encounter.type === EncounterType.ENDING) {
                // Complete current adventure in game progress
                completeEncounter(adventureId, encounters.indexOf(encounter) + 1);
    
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
            if (!selectedEncounter) return;
    
            const nodeStep = encounters.indexOf(selectedEncounter) + 1;
            setEncounterDifficulty(difficulty);
    
            if (selectedEncounter.type === EncounterType.BATTLE || selectedEncounter.type === EncounterType.BOSS) {
                if (selectedEncounter.enemies && selectedEncounter.enemies.length > 0) {
                    const xpReward = selectedEncounter.xpReward;
                    const localizedEnemies = selectedEncounter.enemies.map((enemy: AdventureMonster) => ({
                        ...enemy,
                        name: t(`monsters.${enemy.id}.name`, enemy.name || enemy.id)
                    }));
                    initializeEncounter(party, localizedEnemies, xpReward, nodeStep, difficulty, companionStats);
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

    const getCurrentStars = (encounter: Encounter | null) => {
        if (!encounter || !adventureId) return 0;
        const nodeStep = encounters.indexOf(encounter) + 1;
        const encounterKey = `${adventureId}_${nodeStep}`;
        return encounterResults[encounterKey]?.stars || 0;
    };

    return (
        <div className="adventure-page custom-scrollbar">
            <main className="adventure-content">
                <AdventureHeader
                    adventureId={adventure.id}
                    adventureTitle={adventure.title || 'Adventure'}
                    onBack={() => navigate('/chronicle')}
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
                currentStars={getCurrentStars(selectedEncounter)}
            />
        </div>
    );
};

export default AdventurePage;
