import React from 'react';
import type { Encounter } from '../../../types/adventure.types';

interface MapPathSVGProps {
    encounters: Encounter[];
    referenceHeight: number;
}

export const MapPathSVG: React.FC<MapPathSVGProps> = ({ encounters, referenceHeight }) => {
    return (
        <svg className="map-svg-path" viewBox={`-500 0 1500 ${referenceHeight}`} preserveAspectRatio="none">
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
    );
};
