import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../stores/game.store';
import { ADVENTURES } from '../../data/adventures.data';
import styles from './CampPage.module.css';
import { CampHeader } from './components/CampHeader';
import { CampfireScene } from './components/CampfireScene';
import { FellowshipRoster } from './components/FellowshipRoster';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const { nodeId } = useParams<{ nodeId: string }>();
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

    // Get active adventure and current camp info
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    // Find encounter either by ID from URL or fallback to current node
    const encounter = nodeId
        ? adventure?.encounters.find(e => e.id === nodeId)
        : adventure?.encounters[currentMapNode - 1];

    const currentEncounterIndex = adventure?.encounters.findIndex(e => e.id === encounter?.id) ?? -1;
    const nodeIndex = currentEncounterIndex + 1;

    const storyBeat = encounter?.storyBeat ? {
        text: encounter.storyBeat.text,
        speaker: encounter.storyBeat.speaker || 'Narrator'
    } : undefined;

    // Helper to get remaining slots
    const slots = Array(MAX_PARTY_SIZE).fill(null).map((_, i) => activeParty[i] || null);

    const handleLevelUp = (companionId: string) => {
        levelUpCompanion(companionId);
    };

    const handlePackUp = () => {
        completeEncounter(nodeIndex);
        navigate('/map');
    };

    return (
        <div className={styles.container}>
            <CampHeader
                title={encounter?.label || 'Mountain Camp'}
                storyBeat={storyBeat}
            />

            <div className={styles.content}>
                <CampfireScene
                    slots={slots}
                    xpPool={xpPool}
                    companionStats={companionStats}
                    onRemove={removeFromParty}
                    onLevelUp={handleLevelUp}
                    onPackUp={handlePackUp}
                />

                <FellowshipRoster
                    unlockedCompanions={unlockedCompanions}
                    activeParty={activeParty}
                    maxPartySize={MAX_PARTY_SIZE}
                    onAdd={addToParty}
                />
            </div>
        </div>
    );
};

export default CampPage;
