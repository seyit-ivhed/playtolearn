import { useRef, useEffect } from 'react';
import { AdventureHeader } from './AdventureHeader';
import { MapPathSVG } from './MapPathSVG';
import { MapNode } from './MapNode';
import type { Adventure, Encounter } from '../../../types/adventure.types';

interface FantasyMapProps {
    adventure: Adventure;
    currentNode: number;
    onNodeClick: (node: Encounter) => void;
}

export const FantasyMap: React.FC<FantasyMapProps> = ({ adventure, currentNode, onNodeClick }) => {
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

    const { encounters } = adventure;

    return (
        <>
            <AdventureHeader adventureId={adventure.id} adventureTitle={adventure.title || 'Adventure'} />

            <div className="map-container">
                {/* Background decoration */}
                <div className="map-bg-pattern"></div>

                <svg className="map-svg-full">
                    {/* Spacer for SVG layers if needed */}
                </svg>

                <div className="map-center-col">
                    <div className="map-col-inner">
                        <MapPathSVG encounters={encounters} />

                        {encounters.map((node, index) => (
                            <MapNode
                                key={node.id}
                                node={node}
                                index={index}
                                currentNode={currentNode}
                                adventureId={adventure.id}
                                onNodeClick={onNodeClick}
                                nodeRef={(index + 1) === currentNode ? currentNodeRef : null}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
