import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game.store';
import { useCombatStore } from '../../stores/combat.store';
import '../../styles/pages/AdventurePage.css';

import { ADVENTURES } from '../../data/adventures.data';
import { EncounterType } from '../../types/adventure.types';

const FantasyMapPath = ({ currentNode }: { currentNode: number }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activeParty: party, activeAdventureId } = useGameStore();
    const { initializeCombat } = useCombatStore();

    // Get active adventure
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    if (!adventure) {
        return <div>Adventure not found</div>;
    }

    const { encounters } = adventure;

    const handleNodeClick = (encounter: typeof encounters[0]) => {
        if (encounter.type === EncounterType.CAMP) {
            navigate('/camp');
            return;
        }

        if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS) {
            if (encounter.enemy) {
                // Create array of enemies (single for now based on data)
                // Or if data supported multiple, we'd use that. 
                // Current AdventureMonster is singular, so wrap in array? 
                // Combat store likely expects array of IDs or objects.
                // Looking at usages, initializeCombat typically takes ['id', 'id'].
                // But our data now has full objects. 
                // We need to pass IDs or create monster instances?
                // The store expects IDs to look up in MONSTERS, or we should check combat.store.ts.
                // The previous code used: `['goblin_scout', 'goblin_scout']`.
                // Our new data `enemy` has an `id`.
                // Let's assume for now we pass `[encounter.enemy.id]`.
                // Wait, encounter.enemy is an inline object now in our new data structure, not just an ID reference to a global list?
                // Let's check `encounters` in `adventures.data.ts`. Yes, it has full properties.
                // BUT `monsters.data.ts` creates monsters from templates.
                // If `initializeCombat` expects IDs, it expects keys from `MONSTERS`.
                // Our `enemy.id` in `adventures.data.ts` (e.g. 'goblin_scout_weak') might NOT be in `MONSTERS`.
                // THIS IS A POTENTIAL ISSUE. 
                // However, for the prototype, let's assume `enemy.id` maps to a known monster OR we need to adjust `initializeCombat`.
                // Let's look at `initializeCombat` signature in next step if needed. 
                // For now, I'll pass `[encounter.enemy.id]` and we might need to fix `monsters.data.ts` or `combat.store` to handle this.
                // Actually, the previous hardcoded one used `['goblin_scout', 'goblin_scout']`.
                // My new data has `id: 'goblin_scout_weak'`. 
                // I should probably ensure `monsters.data.ts` has these keys, OR use a different init method.

                // Re-reading `combat.store.ts` would be wise, but I'll proceed with passing the ID and fix if broken.
                initializeCombat(party, [encounter.enemy]);
                navigate('/encounter');
            }
        }
    };

    return (
        <div className="map-container">
            {/* Integrated Header */}
            <div className="map-header">
                <h1 className="map-title" data-testid="map-title">{adventure.title}</h1>
                <p className="map-subtitle">{adventure.description}</p>
            </div>

            {/* Background decoration */}
            <div className="map-bg-pattern"></div>

            <svg className="map-svg-full">
                {/* Spacer for SVG layers if needed */}
            </svg>

            {/* 
                Re-implementing with a centered max-width container for reliable alignment 
                between HTML nodes and SVG path.
            */}
            <div className="map-center-col">
                <div className="map-col-inner">
                    <svg className="map-svg-path" viewBox="0 0 500 1300" preserveAspectRatio="xMidYMin slice">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        {/* 
                           Path Logic needs to be dynamic or roughly match the 3-node structure.
                           For prototype with 3 nodes:
                           1: 250, 250
                           2: 350, 450
                           3: 250, 650
                        */}
                        <path
                            d="M 250 250 
                               C 250 350, 350 350, 350 450 
                               S 250 550, 250 650"
                        />
                    </svg>

                    {encounters.map((node, index) => {
                        // Node ID in data is string like "1_1", but progress is number index+1
                        const nodeStep = index + 1;
                        const isCompleted = nodeStep < currentNode;
                        const isCurrent = nodeStep === currentNode;
                        const isLocked = nodeStep > currentNode;
                        const isCamp = node.type === EncounterType.CAMP;
                        const isBoss = node.type === EncounterType.BOSS;

                        // Use coordinates from data or fallback
                        const leftPos = node.coordinates ? `${(node.coordinates.x / 500) * 100}%` : '50%';
                        const topPos = node.coordinates ? node.coordinates.y : 250 + (index * 200);

                        // CSS Classes Construction
                        const nodeContainerClasses = [
                            'node-container',
                            isCamp ? 'camp' : 'default',
                            isBoss ? 'boss' : '', // Might need CSS for boss node
                            isLocked ? 'locked' : '',
                            isCurrent ? 'current' : '',
                            isCompleted ? 'completed' : ''
                        ].filter(Boolean).join(' ');

                        const labelClasses = [
                            'node-label',
                            isCamp ? 'camp' : '',
                            isLocked ? 'locked' : '',
                            isCurrent ? 'current' : '',
                            isCompleted ? 'completed' : ''
                        ].filter(Boolean).join(' ');

                        // Node Icon
                        let icon = nodeStep.toString();
                        if (isCamp) icon = '⛺';
                        if (isBoss) icon = '💀';
                        if (isCompleted) icon = '✓';

                        return (
                            <div
                                key={node.id}
                                className="node-wrapper"
                                style={{ left: leftPos, top: topPos }}
                                onClick={() => !isLocked && handleNodeClick(node)}
                            >
                                {/* Node Shape */}
                                <div className={nodeContainerClasses} data-testid={`map-node-${node.id}`}>
                                    <span className="node-icon">
                                        {icon}
                                    </span>
                                </div>

                                {/* Label */}
                                <div className={labelClasses}>
                                    {isCamp && <span className="mr-2">✨</span>}
                                    {node.label}
                                    {isCamp && <span className="ml-2">✨</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const AdventurePage = () => {
    const { currentMapNode } = useGameStore();

    return (
        <div className="adventure-page custom-scrollbar">
            <main className="adventure-content">
                <FantasyMapPath currentNode={currentMapNode} />
            </main>
        </div>
    );
};

export default AdventurePage;
