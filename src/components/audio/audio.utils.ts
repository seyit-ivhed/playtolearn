import { type Adventure } from '../../types/adventure.types';

export const getTargetMusicTrack = (pathname: string, adventures: Adventure[]): string | null => {
    if (pathname === '/' || pathname.startsWith('/chronicle')) {
        return 'chronicles.mp3';
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
        return null;
    }

    const [type, adventureId, nodeIndex] = segments;
    const adventure = adventures.find(a => a.id === adventureId);

    if (!adventure) {
        return null;
    }

    if (type === 'map') {
        return adventure.mapMusic || null;
    }

    if (type === 'encounter' && nodeIndex) {
        const index = parseInt(nodeIndex, 10) - 1;
        const encounter = adventure.encounters[index];
        return encounter?.battleMusic || null;
    }

    return null;
};
