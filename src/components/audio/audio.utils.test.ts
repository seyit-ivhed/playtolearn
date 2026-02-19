import { describe, it, expect, vi } from 'vitest';
import { getTargetMusicTrack } from './audio.utils';
import { type Adventure } from '../../types/adventure.types';

// Mock react-router-dom matchPath
vi.mock('react-router-dom', () => ({
    matchPath: (pattern: string, pathname: string) => {
        if (pattern === '/map/:adventureId' && pathname.startsWith('/map/')) {
            return { params: { adventureId: pathname.split('/')[2] } };
        }
        if (pattern === '/puzzle/:adventureId/:nodeIndex' && pathname.startsWith('/puzzle/')) {
            const parts = pathname.split('/');
            return { params: { adventureId: parts[2], nodeIndex: parts[3] } };
        }
        if (pattern === '/encounter/:adventureId/:nodeIndex' && pathname.startsWith('/encounter/')) {
            const parts = pathname.split('/');
            return { params: { adventureId: parts[2], nodeIndex: parts[3] } };
        }
        return null;
    },
}));

const mockAdventures: Adventure[] = [
    {
        id: '1',
        mapMusic: 'desert-map.mp3',
        combatMusic: 'desert-combat.mp3',
        encounters: [],
    },
    {
        id: '2',
        encounters: [],
    }
];

describe('getTargetMusicTrack', () => {
    it('returns chronicles.mp3 for home path', () => {
        expect(getTargetMusicTrack('/', mockAdventures)).toBe('chronicles.mp3');
    });

    it('returns chronicles.mp3 for chronicle paths', () => {
        expect(getTargetMusicTrack('/chronicle', mockAdventures)).toBe('chronicles.mp3');
        expect(getTargetMusicTrack('/chronicle/page-1', mockAdventures)).toBe('chronicles.mp3');
    });

    it('returns adventure map music for map paths', () => {
        expect(getTargetMusicTrack('/map/1', mockAdventures)).toBe('desert-map.mp3');
    });

    it('returns adventure map music for puzzle paths', () => {
        expect(getTargetMusicTrack('/puzzle/1/5', mockAdventures)).toBe('desert-map.mp3');
    });

    it('returns adventure combat music for encounter paths', () => {
        expect(getTargetMusicTrack('/encounter/1/1', mockAdventures)).toBe('desert-combat.mp3');
    });

    it('returns encounter-specific combat music if provided', () => {
        const customAdventures = [
            {
                id: '1',
                combatMusic: 'default-combat.mp3',
                encounters: [
                    { id: '1_1', type: 'BATTLE' as any, combatMusic: 'special-combat.mp3' }
                ]
            }
        ];
        expect(getTargetMusicTrack('/encounter/1/1', customAdventures as any)).toBe('special-combat.mp3');
    });

    it('returns null if adventure has no music configured', () => {
        expect(getTargetMusicTrack('/map/2', mockAdventures)).toBeNull();
    });

    it('returns null for unknown paths', () => {
        expect(getTargetMusicTrack('/unknown', mockAdventures)).toBeNull();
    });
});
