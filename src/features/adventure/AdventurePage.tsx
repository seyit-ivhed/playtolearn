import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game.store';
import { useEncounterStore } from '../../stores/encounter.store';
import { calculateEncounterXp } from '../../utils/progression.utils';
import './AdventurePage.css';

import { ADVENTURES } from '../../data/adventures.data';
import { EncounterType } from '../../types/adventure.types';

const FantasyMapPath = ({ currentNode }: { currentNode: number }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activeParty: party, activeAdventureId, companionStats } = useGameStore();
    const { initializeEncounter } = useEncounterStore();

    const currentNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use a small timeout to ensure the DOM is fully ready and styles are applied
        const timer = setTimeout(() => {
            if (currentNodeRef.current) {
                currentNodeRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [currentNode]);

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
                initializeEncounter(party, encounter.enemies, xpReward, nodeStep, companionStats);
                navigate('/encounter');
            }
        }

        if (encounter.type === EncounterType.PUZZLE) {
            navigate(`/puzzle/${encounter.id}`);
        }
    };

    return (
        <>
            {/* Integrated Header */}
            <div className="map-header">
                <h1 className="map-title" data-testid="map-title">
                    {t(`adventures.${adventure.id}.title`, adventure.title)}
                </h1>
            </div>

            <div className="map-container">

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
                        <svg className="map-svg-path" viewBox="0 0 500 3200" preserveAspectRatio="xMidYMin slice">
                            <defs>
                                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            {/* Dynamic Path Logic based on encounter coordinates */}
                            <path
                                d={encounters.reduce((acc, node, i) => {
                                    const x = node.coordinates?.x ?? 250;
                                    const y = node.coordinates?.y ?? (250 + i * 200);
                                    if (i === 0) return `M ${x} ${y}`;
                                    const prev = encounters[i - 1];
                                    const px = prev.coordinates?.x ?? 250;
                                    const py = prev.coordinates?.y ?? (250 + (i - 1) * 200);
                                    const cy = (py + y) / 2;
                                    return `${acc} C ${px} ${cy}, ${x} ${cy}, ${x} ${y}`;
                                }, "")}
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

                            // Node Shape

                            return (
                                <div
                                    key={node.id}
                                    ref={isCurrent ? currentNodeRef : null}
                                    className="node-wrapper"
                                    style={{ left: leftPos, top: topPos }}
                                    onClick={() => !isLocked && handleNodeClick(node)}
                                >
                                    {/* Node Shape */}
                                    <div className={nodeContainerClasses} data-testid={`map-node-${node.id}`}>
                                    </div>

                                    {/* Label */}
                                    <div className={labelClasses}>
                                        {isCamp && <span className="mr-2">✨</span>}
                                        {t(`adventures.${adventure.id}.nodes.${node.id}.label`, node.label)}
                                        {isCamp && <span className="ml-2">✨</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
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
