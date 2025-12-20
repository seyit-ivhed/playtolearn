import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/game.store';
import { ADVENTURES } from '../../data/adventures.data';
import styles from './CampPage.module.css';
import { CampHeader } from './components/CampHeader';
import { CampfireScene } from './components/CampfireScene';
import { FellowshipRoster } from './components/FellowshipRoster';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
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
    const currentEncounter = adventure?.encounters[currentMapNode - 1];
    const storyBeat = currentEncounter?.storyBeat ? {
        text: currentEncounter.storyBeat.text,
        speaker: currentEncounter.storyBeat.speaker || 'Narrator'
    } : undefined;

    // Helper to get remaining slots
    const slots = Array(MAX_PARTY_SIZE).fill(null).map((_, i) => activeParty[i] || null);

    const handleLevelUp = (companionId: string) => {
        levelUpCompanion(companionId);
    };

    const handlePackUp = () => {
        completeEncounter();
        navigate('/map');
    };

    return (
        <div className={styles.container}>
            <CampHeader
                title={currentEncounter?.label || 'Mountain Camp'}
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
