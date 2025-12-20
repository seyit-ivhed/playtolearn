import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './game.store';
import * as progressionUtils from '../utils/progression.utils';

// Mock dependencies
vi.mock('../data/adventures.data', () => ({
    ADVENTURES: [
        {
            id: '1',
            encounters: [{}, {}, {}], // 3 encounters
            rewards: { xp: 100, currency: 50 },
        },
        {
            id: '2',
            encounters: [{}],
            rewards: { xp: 50, currency: 25 },
        }
    ],
    getAdventureById: vi.fn(),
}));

// Mock INITIAL_FELLOWSHIP if needed, but imported one is fine as it is constant data
// Mock COMPANIONS keys for Object.keys usage in store
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
        useGameStore.setState({
            currentMapNode: 1,
            activeAdventureId: '1',
            unlockedCompanions: ['c1', 'c2'],
            activeParty: ['c1', 'c2'],
            xpPool: 0,
            companionStats: {
                c1: { level: 1, xp: 0 },
                c2: { level: 1, xp: 0 },
                c3: { level: 1, xp: 0 },
                c4: { level: 1, xp: 0 },
                c5: { level: 1, xp: 0 },
            },
            restedCompanions: [],
        });
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        // We set state in beforeEach, but testing "initial" requires resetting purely
        // Because persist middleware might interfere, explicit reset is safer for unit tests usually
        // But here we rely on the beforeEach reset.
        const state = useGameStore.getState();
        expect(state.currentMapNode).toBe(1);
        expect(state.activeAdventureId).toBe('1');
        expect(state.unlockedCompanions).toEqual(['c1', 'c2']);
        expect(state.activeParty).toEqual(['c1', 'c2']);
        expect(state.xpPool).toBe(0);
    });

    describe('Adventure Flow', () => {
        it('should advance map node on completeEncounter', () => {
            useGameStore.setState({ currentMapNode: 1, activeAdventureId: '1' });
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().currentMapNode).toBe(2);
        });

        it('should loop back to 1 when adventure finishes (prototype behavior)', () => {
            // Adventure 1 has 3 encounters.
            // Node 1 -> complete -> 2
            // Node 2 -> complete -> 3
            // Node 3 -> complete -> 1 (Loop)

            useGameStore.setState({ currentMapNode: 3, activeAdventureId: '1' });
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().currentMapNode).toBe(1);
        });

        it('should do nothing if adventure not found', () => {
            useGameStore.setState({ activeAdventureId: 'non-existent' });
            const currentNode = useGameStore.getState().currentMapNode;
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().currentMapNode).toBe(currentNode);
        });

        it('should set active adventure and reset map', () => {
            useGameStore.getState().setActiveAdventure('2');
            expect(useGameStore.getState().activeAdventureId).toBe('2');
            expect(useGameStore.getState().currentMapNode).toBe(1);
        });

        it('should reset map manually', () => {
            useGameStore.setState({ currentMapNode: 5 });
            useGameStore.getState().resetMap();
            expect(useGameStore.getState().currentMapNode).toBe(1);
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

        it('should not add if not unlocked', () => {
            useGameStore.setState({ activeParty: ['c1'], unlockedCompanions: ['c1'] });
            useGameStore.getState().addToParty('c3'); // c3 not unlocked
            expect(useGameStore.getState().activeParty).toEqual(['c1']);
        });

        it('should not add if party is full (max 4)', () => {
            const fullParty = ['c1', 'c2', 'c3', 'c4'];
            useGameStore.setState({
                activeParty: fullParty,
                unlockedCompanions: [...fullParty, 'c5']
            });
            useGameStore.getState().addToParty('c5');
            expect(useGameStore.getState().activeParty).toEqual(fullParty);
        });

        it('should remove companion from party', () => {
            useGameStore.setState({ activeParty: ['c1', 'c2'] });
            useGameStore.getState().removeFromParty('c1');
            expect(useGameStore.getState().activeParty).toEqual(['c2']);
        });
    });

    describe('Companion Unlocking', () => {
        it('should unlock companion and set level to max of current party', () => {
            useGameStore.setState({
                unlockedCompanions: ['c1'],
                companionStats: {
                    c1: { level: 5, xp: 0 },
                    c2: { level: 1, xp: 0 } // default initialization mock
                }
            });

            useGameStore.getState().unlockCompanion('c2');

            const state = useGameStore.getState();
            expect(state.unlockedCompanions).toContain('c2');
            // Catch up logic: max level is 5
            expect(state.companionStats['c2'].level).toBe(5);
        });

        it('should ignore if already unlocked', () => {
            useGameStore.setState({ unlockedCompanions: ['c1'] });
            useGameStore.getState().unlockCompanion('c1');
            const state = useGameStore.getState();
            expect(state.unlockedCompanions.length).toBe(1);
        });
    });

    describe('Progression System', () => {
        it('should add xp to pool', () => {
            useGameStore.setState({ xpPool: 0 });
            useGameStore.getState().addXpToPool(100);
            expect(useGameStore.getState().xpPool).toBe(100);
        });

        it('should grant dynamic XP based on global encounter index', () => {
            // Adventure 1, Encounter 1 -> (0 * 10 + 1) * 10 = 10 XP
            useGameStore.setState({ currentMapNode: 1, activeAdventureId: '1', xpPool: 0 });
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().xpPool).toBe(10);

            // Adventure 1, Encounter 2 -> (0 * 10 + 2) * 10 = 20 XP
            // currentMapNode is now 2 after previous call
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().xpPool).toBe(10 + 20);

            // Adventure 2, Encounter 1 -> (1 * 10 + 1) * 10 = 110 XP
            useGameStore.setState({ currentMapNode: 1, activeAdventureId: '2', xpPool: 0 });
            useGameStore.getState().completeEncounter();
            expect(useGameStore.getState().xpPool).toBe(110);
        });

        it('should assign xp to companion and level up', () => {
            useGameStore.setState({
                xpPool: 200,
                companionStats: {
                    c1: { level: 1, xp: 0 }
                }
            });

            // Mock utils
            // Level 1 -> next need 100
            // Level 2 -> next need 200
            vi.spyOn(progressionUtils, 'getXpForNextLevel')
                .mockReturnValueOnce(100) // needed for lvl 2
                .mockReturnValueOnce(200); // needed for lvl 3

            useGameStore.getState().assignXpToCompanion('c1', 150);

            const state = useGameStore.getState();
            expect(state.xpPool).toBe(50); // 200 - 150
            // Started 0 xp. Add 150.
            // 150 >= 100 (Level 2 cost). New XP = 50. Level becomes 2.
            // 50 < 200 (Level 3 cost). Stop.

            expect(state.companionStats['c1'].level).toBe(2);
            expect(state.companionStats['c1'].xp).toBe(50);
        });

        it('should not assign xp if pool is insufficient', () => {
            useGameStore.setState({ xpPool: 50 });
            useGameStore.getState().assignXpToCompanion('c1', 100);

            const state = useGameStore.getState();
            expect(state.xpPool).toBe(50);
            expect(state.companionStats['c1'].xp).toBe(0);
        });
    });

    describe('Rested System', () => {
        it('should mark inactive companions as rested', () => {
            useGameStore.setState({
                unlockedCompanions: ['c1', 'c2', 'c3'],
                activeParty: ['c1'],
                restedCompanions: []
            });

            useGameStore.getState().markRestedCompanions();

            expect(useGameStore.getState().restedCompanions).toEqual(['c2', 'c3']);
        });

        it('should consume rested bonus', () => {
            useGameStore.setState({ restedCompanions: ['c2', 'c3'] });
            useGameStore.getState().consumeRestedBonus('c2');

            expect(useGameStore.getState().restedCompanions).toEqual(['c3']);
        });
    });

    describe('Reset', () => {
        it('should reset all state', () => {
            useGameStore.setState({
                currentMapNode: 5,
                activeAdventureId: '2',
                unlockedCompanions: ['c1', 'c2', 'c3'],
                xpPool: 500,
            });

            useGameStore.getState().resetAll();

            const state = useGameStore.getState();
            expect(state.currentMapNode).toBe(1);
            expect(state.activeAdventureId).toBe('1');
            expect(state.unlockedCompanions).toEqual(['c1', 'c2']); // Reset to initial fellowship mock
            expect(state.xpPool).toBe(0);
        });
    });
});
