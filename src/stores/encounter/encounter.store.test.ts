import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEncounterStore } from './store';
import { EncounterPhase } from '../../types/encounter.types';
import { initialEncounterState } from './initial-state';
import type { AdventureMonster } from '../../types/adventure.types';

// Mock getCompanionById
vi.mock('../../data/companions.data', () => ({
    getCompanionById: (id: string) => ({
        id,
        name: 'Test Companion',
        role: 'WARRIOR',
        maxHealth: 100,
        icon: 'test-icon',
        color: 'red',
        stats: {
            maxHealth: 100
        },
        baseStats: {
            maxHealth: 100,
            abilityDamage: 10
        },
        evolutions: [],
        // Adding properties to satisfy the slice usage, even if not in interface yet
        abilityName: 'Test Attack',
        abilityDamage: 10,
        specialAbility: {
            id: 'test_ability',
            type: 'DAMAGE',
            value: 20,
            target: 'SINGLE_ENEMY',
            name: 'Test Ability' // Mocking it here for test, but need to fix source
        }
    })
}));

describe('EncounterStore', () => {
    beforeEach(() => {
        useEncounterStore.setState(initialEncounterState);
        vi.useFakeTimers();
    });

    it('should initialize encounter correctly', () => {
        const partyIds = ['warrior_1', 'guardian_1'];
        const enemies: AdventureMonster[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5, sprite: 'goblin.png' }];

        useEncounterStore.getState().initializeEncounter(partyIds, enemies, 0, 0, 0, {});
        const state = useEncounterStore.getState();

        expect(state.phase).toBe(EncounterPhase.PLAYER_TURN);
        expect(state.party).toHaveLength(2);
        expect(state.monsters).toHaveLength(1);
        expect(state.party[0].name).toBe('Test Companion');
    });

    it('should perform warrior attack correctly', () => {
        const partyIds = ['warrior_1'];
        const enemies: AdventureMonster[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5, sprite: 'goblin.png' }];
        useEncounterStore.getState().initializeEncounter(partyIds, enemies, 0, 0, 0, {});

        const warriorId = useEncounterStore.getState().party[0].id;

        // Act
        useEncounterStore.getState().performAction(warriorId);

        const state = useEncounterStore.getState();
        // Warrior deals 10 dmg (base 10)
        expect(state.monsters[0].currentHealth).toBe(40);
        expect(state.party[0].hasActed).toBe(true);
        expect(state.encounterLog).toContainEqual(expect.stringContaining('attacked Goblin for 10 damage'));
    });

    it('should end player turn when all units acted', () => {
        const partyIds = ['warrior_1'];
        const enemies: AdventureMonster[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5, sprite: '' }];
        useEncounterStore.getState().initializeEncounter(partyIds, enemies, 0, 0, 0, {});
        const warriorId = useEncounterStore.getState().party[0].id;

        useEncounterStore.getState().performAction(warriorId);

        const state = useEncounterStore.getState();
        // Should have transitioned to monster turn (via endPlayerTurn)
        expect(state.phase).toBe(EncounterPhase.MONSTER_TURN);
    });
});
