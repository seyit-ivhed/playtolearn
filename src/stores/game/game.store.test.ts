import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './store';
import { AdventureStatus } from '../../types/adventure.types';

// Mock dependencies
vi.mock('../data/adventures.data', () => ({
    ADVENTURES: [
        {
            id: '1',
            encounters: [
            ],
        },
        {
            id: '2',
            encounters: [
            ],
        }
    ],
    getAdventureById: vi.fn((id) => {
        if (id === '1') return { id: '1', encounters: [{}, {}, {}] };
        return undefined;
    }),
}));

vi.mock('../data/companions.data', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../data/companions.data')>();
    return {
        ...actual,
        INITIAL_FELLOWSHIP: ['c1', 'c2'],
        COMPANIONS: {
            'c1': { id: 'c1' },
            'c2': { id: 'c2' },
            'c3': { id: 'c3' },
            'c4': { id: 'c4' },
            'c5': { id: 'c5' },
        }
    };
});

describe('useGameStore', () => {
    beforeEach(() => {
        // Manually reset state since resetAll was removed
        useGameStore.setState({
            activeParty: ['c1', 'c2'],
            encounterResults: {},
            activeEncounterDifficulty: 1,
            adventureStatuses: {
                '1': AdventureStatus.AVAILABLE
            },
            companionStats: {
                'c1': { level: 1, experience: 0 },
                'c2': { level: 1, experience: 0 },
                'c3': { level: 1, experience: 0 },
                'c4': { level: 1, experience: 0 },
                'c5': { level: 1, experience: 0 }
            }
        });
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const state = useGameStore.getState();
        expect(state.activeParty).toEqual(['c1', 'c2']);

        expect(state.encounterResults).toEqual({});
    });

    describe('Adventure Flow', () => {
        it('should update encounterResults on completeEncounter', () => {
            useGameStore.setState({ activeEncounterDifficulty: 3 });
            useGameStore.getState().completeEncounter('1', 1);
            const results = useGameStore.getState().encounterResults;
            expect(results['1_1']).toBeDefined();
            expect(results['1_1'].stars).toBe(3);
        });


    });
});
