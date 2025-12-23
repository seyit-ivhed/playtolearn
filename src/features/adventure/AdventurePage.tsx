import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game.store';
import { useEncounterStore } from '../../stores/encounter.store';
import { calculateEncounterXp } from '../../utils/progression.utils';
import './AdventurePage.css';

import { ADVENTURES } from '../../data/adventures.data';
import { EncounterType } from '../../types/adventure.types';
import { FantasyMap } from './components/FantasyMap';

const AdventurePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activeParty: party, activeAdventureId, companionStats, currentMapNode } = useGameStore();
    const { initializeEncounter } = useEncounterStore();

    // Get active adventure
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    if (!adventure) {
        return <div>{t('adventure.not_found', 'Adventure not found')}</div>;
    }

    const { encounters } = adventure;

    const handleNodeClick = (encounter: typeof encounters[0]) => {
        const nodeStep = encounters.indexOf(encounter) + 1;

        if (encounter.type === EncounterType.CAMP) {
            navigate(`/camp/${encounter.id}`);
            return;
        }

        if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS) {
            if (encounter.enemies && encounter.enemies.length > 0) {
                const xpReward = calculateEncounterXp(activeAdventureId, nodeStep);
                const localizedEnemies = encounter.enemies.map(enemy => ({
                    ...enemy,
                    name: t(`monsters.${enemy.id}.name`, enemy.name || enemy.id)
                }));
                initializeEncounter(party, localizedEnemies, xpReward, nodeStep, companionStats);
                navigate('/encounter');
            }
        }

        if (encounter.type === EncounterType.PUZZLE) {
            navigate(`/puzzle/${encounter.id}`);
        }
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
        </div>
    );
};

export default AdventurePage;
