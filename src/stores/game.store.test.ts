import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './game/store';
import * as progressionUtils from '../utils/progression.utils';

// Mock dependencies
vi.mock('../data/adventures.data', () => ({
    ADVENTURES: [
        {
            id: 'origins_prologue',
            encounters: [
                { id: 'p_1', xpReward: 5 }
            ]
        },
        {
            id: '1',
            encounters: [
                { id: '1_1', xpReward: 10 },
                { id: '1_2', xpReward: 20 },
                { id: '1_3', xpReward: 30 }
            ],
        },
        {
            id: '2',
            encounters: [
                { id: '2_1', xpReward: 110 }
            ],
        }
    ],
    getAdventureById: vi.fn((id) => {
        if (id === '1') return { id: '1', encounters: [{ xpReward: 10 }, { xpReward: 20 }, { xpReward: 30 }] };
        return undefined;
    }),
}));

vi.mock('../data/companions.data', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../data/companions.data')>();
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
        useGameStore.getState().resetAll();
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const state = useGameStore.getState();
        expect(state.unlockedCompanions).toEqual(['c1', 'c2']);
        expect(state.activeParty).toEqual(['c1', 'c2']);
        expect(state.xpPool).toBe(0);
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

        it('should grant XP based on encounter data', () => {
            useGameStore.getState().completeEncounter('1', 1);
            expect(useGameStore.getState().xpPool).toBe(10);

            useGameStore.getState().completeEncounter('1', 2);
            expect(useGameStore.getState().xpPool).toBe(10 + 20);
        });

        it('should NOT grant XP if encounter already completed', () => {
            useGameStore.getState().completeEncounter('1', 1);
            expect(useGameStore.getState().xpPool).toBe(10);

            useGameStore.getState().completeEncounter('1', 1);
            expect(useGameStore.getState().xpPool).toBe(10); // Still 10
        });

        it('should unlock all encounters via debug action', () => {
            useGameStore.getState().debugUnlockAllEncounters();
            const results = useGameStore.getState().encounterResults;
            // Mock has 1 (prologue) + 3 (adv 1) + 1 (adv 2) = 5 total
            expect(Object.keys(results).length).toBe(5);
            expect(results['1_1']).toBeDefined();
            expect(results['2_1']).toBeDefined();
        });
    });

    describe('Party Management', () => {
        it('should add companion to party if valid', () => {
            useGameStore.setState({ activeParty: ['c1'], unlockedCompanions: ['c1', 'c2'] });
            useGameStore.getState().addToParty('c2');
            expect(useGameStore.getState().activeParty).toContain('c2');
            expect(useGameStore.getState().activeParty.length).toBe(2);
        });

        it('should not add if already in party', () => {
            useGameStore.setState({ activeParty: ['c1'], unlockedCompanions: ['c1', 'c2'] });
            useGameStore.getState().addToParty('c1');
            expect(useGameStore.getState().activeParty).toEqual(['c1']);
        });

        it('should remove companion from party', () => {
            useGameStore.setState({ activeParty: ['c1', 'c2'] });
            useGameStore.getState().removeFromParty('c1');
            expect(useGameStore.getState().activeParty).toEqual(['c2']);
        });
    });

    describe('Progression System', () => {
        it('should add xp to pool', () => {
            useGameStore.setState({ xpPool: 0 });
            useGameStore.getState().addXpToPool(100);
            expect(useGameStore.getState().xpPool).toBe(100);
        });

        it('should level up companion and consume XP', () => {
            useGameStore.setState({
                xpPool: 100,
                companionStats: { c1: { level: 1 } }
            });

            vi.spyOn(progressionUtils, 'getXpForNextLevel').mockReturnValue(15);

            useGameStore.getState().levelUpCompanion('c1');

            const state = useGameStore.getState();
            expect(state.xpPool).toBe(85);
            expect(state.companionStats['c1'].level).toBe(2);
        });
    });

    describe('Reset', () => {
        it('should reset all state', () => {
            useGameStore.setState({
                xpPool: 500,
                encounterResults: { 'test': { stars: 3, difficulty: 1, completedAt: 123 } }
            });

            useGameStore.getState().resetAll();

            const state = useGameStore.getState();
            expect(state.xpPool).toBe(0);
            expect(state.encounterResults).toEqual({});
            expect(state.unlockedCompanions).toEqual(['c1', 'c2']);
        });
    });
});
