import { matchPath } from 'react-router-dom';
import { type Adventure } from '../../types/adventure.types';

/**
 * Determines which background music track should play based on the current pathname.
 */
export const getTargetMusicTrack = (pathname: string, adventures: Adventure[]): string | null => {
    // 1. Chronicles (Home/Menu)
    if (pathname === '/' || pathname.startsWith('/chronicle')) {
        return 'chronicles.mp3';
    }

    // 2. Adventure Map & Puzzles -> Map Music
    const mapMatch = matchPath('/map/:adventureId', pathname);
    const puzzleMatch = matchPath('/puzzle/:adventureId/:nodeIndex', pathname);

    if (mapMatch || puzzleMatch) {
        const adventureId = mapMatch?.params.adventureId || puzzleMatch?.params.adventureId;
        const adventure = adventures.find(a => a.id === adventureId);
        return adventure?.mapMusic || null;
    }

    // 3. Combat -> Combat Music
    const combatMatch = matchPath('/encounter/:adventureId/:nodeIndex', pathname);
    if (combatMatch) {
        const adventureId = combatMatch.params.adventureId;
        const adventure = adventures.find(a => a.id === adventureId);
        return adventure?.combatMusic || null;
    }

    return null;
};
