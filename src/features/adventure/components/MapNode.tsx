import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swords, Tent, Puzzle } from 'lucide-react';
import { EncounterType } from '../../../types/adventure.types';

interface MapNodeProps {
    node: any; // Using any for now to match the local type from ADVENTURES
    index: number;
    currentNode: number;
    adventureId: string;
    onNodeClick: (node: any) => void;
    nodeRef?: React.Ref<HTMLDivElement>;
}

export const MapNode: React.FC<MapNodeProps> = ({
    node,
    index,
    currentNode,
    adventureId,
    onNodeClick,
    nodeRef
}) => {
    const { t } = useTranslation();
    const nodeStep = index + 1;
    const isCompleted = nodeStep < currentNode;
    const isCurrent = nodeStep === currentNode;
    const isLocked = nodeStep > currentNode;
    const isCamp = node.type === EncounterType.CAMP;
    const isBoss = node.type === EncounterType.BOSS;
    const isPuzzle = node.type === EncounterType.PUZZLE;

    // Use coordinates from data or fallback
    const leftPos = node.coordinates ? `${(node.coordinates.x / 500) * 100}%` : '50%';
    const topPos = node.coordinates ? node.coordinates.y : 250 + (index * 200);

    // CSS Classes Construction
    const nodeContainerClasses = [
        'node-container',
        isCamp ? 'camp' : 'default',
        isBoss ? 'boss' : '',
        isPuzzle ? 'puzzle' : '',
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
        return <Swords {...iconProps} />;
    };

    return (
        <div
            ref={nodeRef}
            className="node-wrapper"
            style={{ left: leftPos, top: topPos }}
            onClick={() => !isLocked && onNodeClick(node)}
        >
            {/* Node Shape */}
            <div className={nodeContainerClasses} data-testid={`map-node-${node.id}`}>
                {renderIcon()}
            </div>

            {/* Label */}
            <div className={labelClasses}>
                {isCamp && <span className="mr-2">✨</span>}
                {isCamp
                    ? t('party_camp')
                    : t(`adventures.${adventureId}.nodes.${node.id}.label`, node.label || '') as string
                }
                {isCamp && <span className="ml-2">✨</span>}
            </div>
        </div>
    );
};
