import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useCombatStore } from './store';
import { CombatPhase } from '../../types/combat.types';
import { initialCombatState } from './initial-state';

// Mock companion data to ensure test stability
vi.mock('../../data/companions.data', () => ({
    getCompanionById: (id: string) => {
        const mocks: any = {
            'warrior_1': {
                name: 'Warrior',
                role: 'WARRIOR',
                maxHealth: 100,
                abilityName: 'Slash',
                abilityDamage: 10,
                specialAbility: { name: 'Big Slash', type: 'DAMAGE', target: 'SINGLE_ENEMY', value: 50 },
                color: 'red', icon: 'W'
            },
            'guardian_1': {
                name: 'Guardian',
                role: 'GUARDIAN',
                maxHealth: 120,
                abilityName: 'Shield Bash',
                abilityShield: 15,
                specialAbility: { name: 'Mass Shield', type: 'SHIELD', target: 'ALL_ALLIES', value: 30 },
                color: 'blue', icon: 'G'
            },
            'support_1': {
                name: 'Support',
                role: 'SUPPORT',
                maxHealth: 80,
                abilityName: 'Heal',
                abilityHeal: 15,
                specialAbility: { name: 'Mass Heal', type: 'HEAL', target: 'ALL_ALLIES', value: 40 },
                color: 'green', icon: 'S'
            }
        };
        return mocks[id] || mocks['warrior_1'];
    }
}));

describe('CombatStore', () => {
    beforeEach(() => {
        useCombatStore.setState(initialCombatState);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize combat correctly', () => {
        const partyIds = ['warrior_1', 'guardian_1'];
        const enemies: any[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5, sprite: 'goblin.png' }];

        useCombatStore.getState().initializeCombat(partyIds, enemies);
        const state = useCombatStore.getState();

        expect(state.phase).toBe(CombatPhase.PLAYER_TURN);
        expect(state.party).toHaveLength(2);
        expect(state.monsters).toHaveLength(1);
        expect(state.party[0].name).toBe('warrior_1');
        expect(state.monsters[0].currentHealth).toBe(50);
    });

    it('should perform warrior attack correctly', () => {
        const partyIds = ['warrior_1'];
        const enemies: any[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5, sprite: 'goblin.png' }];
        useCombatStore.getState().initializeCombat(partyIds, enemies);

        const warriorId = useCombatStore.getState().party[0].id;

        // Act
        useCombatStore.getState().performAction(warriorId);

        const state = useCombatStore.getState();
        // Warrior deals 10 dmg (base 10)
        expect(state.monsters[0].currentHealth).toBe(40);
        expect(state.party[0].hasActed).toBe(true);
        expect(state.combatLog).toContainEqual(expect.stringContaining('Dealt 10 damage'));
    });

    it('should perform guardian shield correctly', () => {
        const partyIds = ['guardian_1'];
        const enemies: any[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 5 }];
        useCombatStore.getState().initializeCombat(partyIds, enemies);

        const guardian = useCombatStore.getState().party[0];

        // Act
        useCombatStore.getState().performAction(guardian.id);

        const state = useCombatStore.getState();
        // Guardian shields random ally (self in this case) for 15
        expect(state.party[0].currentShield).toBe(15);
        expect(state.party[0].hasActed).toBe(true);
    });

    it('should handle monster turn logic', () => {
        const partyIds = ['warrior_1'];
        const enemies: any[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 50, attack: 8 }];
        useCombatStore.getState().initializeCombat(partyIds, enemies);

        // End player turn
        useCombatStore.getState().endPlayerTurn();

        expect(useCombatStore.getState().phase).toBe(CombatPhase.MONSTER_TURN);

        // Fast-forward timers to trigger processMonsterTurn
        vi.runAllTimers();

        const state = useCombatStore.getState();
        // Phase should be back to PLAYER_TURN
        expect(state.phase).toBe(CombatPhase.PLAYER_TURN);
        // Turn count incremented
        expect(state.turnCount).toBe(2);
        // Player took damage (8 dmg vs 0 shield -> 100 - 8 = 92)
        expect(state.party[0].currentHealth).toBe(92);
    });

    it('should process special attack success (AoE Damage)', () => {
        const partyIds = ['warrior_1'];
        const enemies: any[] = [
            { id: 'goblin1', name: 'G1', maxHealth: 50, attack: 5 },
            { id: 'goblin2', name: 'G2', maxHealth: 50, attack: 5 }
        ];
        useCombatStore.getState().initializeCombat(partyIds, enemies);

        const warriorId = useCombatStore.getState().party[0].id;
        // Mock ability: Big Slash, 50 dmg, Single Enemy. 
        // Wait, 'warrior_1' mock has target: 'SINGLE_ENEMY'.
        // Let's rely on that.

        useCombatStore.getState().resolveSpecialAttack(warriorId, true);

        const state = useCombatStore.getState();
        // Should hit first living monster for 50
        expect(state.monsters[0].currentHealth).toBe(0);
        expect(state.monsters[0].isDead).toBe(true);
        // Second monster untouched
        expect(state.monsters[1].currentHealth).toBe(50);
        // Charge reset
        expect(state.party[0].currentSpirit).toBe(0);
    });

    it('should complete turn after special attack', () => {
        const partyIds = ['warrior_1', 'guardian_1'];
        const enemies: any[] = [{ id: 'goblin', name: 'Goblin', maxHealth: 100, attack: 5 }];
        useCombatStore.getState().initializeCombat(partyIds, enemies);

        const warriorId = useCombatStore.getState().party[0].id;
        const guardianId = useCombatStore.getState().party[1].id;

        // Warrior uses Special Ability
        useCombatStore.getState().resolveSpecialAttack(warriorId, true);

        let state = useCombatStore.getState();
        expect(state.party[0].hasActed).toBe(true);
        expect(state.phase).toBe(CombatPhase.PLAYER_TURN); // Still player turn as Guardian hasn't acted

        // Guardian uses Special Ability
        useCombatStore.getState().resolveSpecialAttack(guardianId, true);

        state = useCombatStore.getState();
        expect(state.party[1].hasActed).toBe(true);
        // Should have triggered endPlayerTurn, switching phase to MONSTER_TURN
        expect(state.phase).toBe(CombatPhase.MONSTER_TURN);
    });
});

