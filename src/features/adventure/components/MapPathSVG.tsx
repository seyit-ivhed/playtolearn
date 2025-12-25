import React from 'react';

interface MapPathSVGProps {
    encounters: any[];
}

export const MapPathSVG: React.FC<MapPathSVGProps> = ({ encounters }) => {
    return (
        <svg className="map-svg-path" viewBox="0 0 500 4500" preserveAspectRatio="xMidYMin slice">
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
