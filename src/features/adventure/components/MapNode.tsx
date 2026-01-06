import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swords, Tent, Puzzle, Star, BookOpen } from 'lucide-react';
import { EncounterType, type Encounter } from '../../../types/adventure.types';
import { useGameStore } from '../../../stores/game/store';

interface MapNodeProps {
    node: Encounter;
    index: number;
    currentNode: number;
    adventureId: string;
    onNodeClick: (node: Encounter) => void;
    nodeRef?: React.Ref<HTMLDivElement>;
    referenceHeight: number;
}

export const MapNode: React.FC<MapNodeProps> = ({
    node,
    index,
    currentNode,
    adventureId,
    onNodeClick,
    nodeRef,
    referenceHeight
}) => {
    const { encounterResults } = useGameStore();
    const encounterKey = `${adventureId}_${index + 1}`;
    const stars = encounterResults[encounterKey]?.stars || 0;
    const { t } = useTranslation();
    const nodeStep = index + 1;
    const isCompleted = nodeStep < currentNode;
    const isCurrent = nodeStep === currentNode;
    const isLocked = nodeStep > currentNode;
    const isCamp = node.type === EncounterType.CAMP;
    const isBoss = node.type === EncounterType.BOSS;
    const isPuzzle = node.type === EncounterType.PUZZLE;
    const isEnding = node.type === EncounterType.ENDING;

    // Use coordinates from data or fallback
    // Horizontal range is -500 to 500 (total width 1000)
    const leftPos = node.coordinates ? `${((node.coordinates.x + 500) / 1000) * 100}%` : '50%';
    const topPos = node.coordinates
        ? `${(node.coordinates.y / referenceHeight) * 100}%`
        : `${((250 + (index * 200)) / referenceHeight) * 100}%`;

    // CSS Classes Construction
    const nodeContainerClasses = [
        'node-container',
        isCamp ? 'camp' : isBoss ? 'boss' : isPuzzle ? 'puzzle' : isEnding ? 'ending' : 'default',
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

    const renderIcon = () => {
        const iconProps = {
            size: 48,
            strokeWidth: 2,
            className: 'node-icon'
        };

        if (isBoss) return <Swords {...iconProps} />;
        if (isCamp) return <Tent {...iconProps} />;
        if (isPuzzle) return <Puzzle {...iconProps} />;
        if (isEnding) return <BookOpen {...iconProps} />;
        return <Swords {...iconProps} />;
    };

    return (
        <div
            ref={nodeRef}
            className="node-wrapper"
            style={{ left: leftPos, top: topPos }}
            onClick={() => !isLocked && onNodeClick(node)}
        >
            {/* Stars Display */}
            {!isCamp && !isEnding && !isLocked && (
                <div className="node-stars">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={18}
                            fill={i < stars ? "#FFD700" : "transparent"}
                            color={i < stars ? "#FFD700" : "rgba(255,255,255,0.2)"}
                            className="star-icon"
                        />
                    ))}
                </div>
            )}

            {/* Node Shape */}
            <div className={nodeContainerClasses} data-testid={`map-node-${node.id}`}>
                {renderIcon()}
            </div>

            {/* Label */}
            <div className={labelClasses}>
                {isCamp
                    ? t('party_camp')
                    : t(`adventures.${adventureId}.nodes.${node.id}.label`, node.label || '') as string
                }
            </div>
        </div>
    );
};
