import { describe, it, expect, vi } from 'vitest';
import { buildBattleEncounterData } from './encounter-initializer';

vi.mock('../../../data/adventures.data', () => ({
    ADVENTURES: [
        {
            id: 'test-adventure',
            encounters: [
                {
                    id: 'battle-1',
                    type: 'BATTLE',
                    enemies: [
                        { id: 'goblin', name: 'Goblin', maxHealth: 10, attack: 3 },
                        { id: 'orc', name: 'Orc', maxHealth: 20, attack: 5 }
                    ]
                },
                {
                    id: 'puzzle-1',
                    type: 'PUZZLE',
                },
                {
                    id: 'boss-1',
                    type: 'BOSS',
                    enemies: [
                        { id: 'dragon', maxHealth: 50, attack: 10, isBoss: true }
                    ]
                },
                {
                    id: 'battle-no-enemies',
                    type: 'BATTLE',
                    enemies: []
                }
            ]
        }
    ]
}));

const mockT = (key: string, options?: { defaultValue?: string }) => options?.defaultValue || key;
const defaultParty = ['companion-a', 'companion-b'];
const defaultStats = { 'companion-a': { level: 2 }, 'companion-b': { level: 3 } };

describe('buildBattleEncounterData', () => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
    it('returns localized enemy data for a battle encounter', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 1, defaultParty, defaultStats, 2, mockT
        );

        expect(result).not.toBeNull();
        expect(result!.activeParty).toEqual(defaultParty);
        expect(result!.nodeIndex).toBe(1);
        expect(result!.difficulty).toBe(2);
        expect(result!.companionStats).toEqual(defaultStats);
        expect(result!.localizedEnemies).toHaveLength(2);
        expect(result!.localizedEnemies[0].name).toBe('Goblin');
        expect(result!.localizedEnemies[1].name).toBe('Orc');
    });

    it('returns data for a boss encounter', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 3, defaultParty, defaultStats, 1, mockT
        );

        expect(result).not.toBeNull();
        expect(result!.localizedEnemies).toHaveLength(1);
        expect(result!.localizedEnemies[0].id).toBe('dragon');
    });

    it('returns null for a puzzle encounter', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 2, defaultParty, defaultStats, 1, mockT
        );

        expect(result).toBeNull();
    });

    it('returns null for a non-existent adventure', () => {
        const result = buildBattleEncounterData(
            'unknown-adventure', 1, defaultParty, defaultStats, 1, mockT
        );

        expect(result).toBeNull();
    });

    it('returns null for an out-of-bounds node index', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 99, defaultParty, defaultStats, 1, mockT
        );

        expect(result).toBeNull();
    });

    it('returns null for a battle encounter with no enemies', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 4, defaultParty, defaultStats, 1, mockT
        );

        expect(result).toBeNull();
    });

    it('falls back to enemy id when name is undefined', () => {
        const result = buildBattleEncounterData(
            'test-adventure', 3, defaultParty, defaultStats, 1, mockT
        );

        expect(result).not.toBeNull();
        expect(result!.localizedEnemies[0].name).toBe('dragon');
    });
});
