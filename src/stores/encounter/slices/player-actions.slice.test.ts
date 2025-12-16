import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEncounterStore } from '../store';
import { initialEncounterState } from '../initial-state';
import { EncounterPhase } from '../../../types/encounter.types';

// Mock getCompanionById
vi.mock('../../../data/companions.data', () => ({
    getCompanionById: (id: string) => {
        if (id === 'warrior_id') {
            return {
                id,
                name: 'Warrior',
                role: 'WARRIOR',
                stats: { abilityDamage: 10 },
                specialAbility: { id: 'special_dmg', type: 'DAMAGE', value: 20, target: 'SINGLE_ENEMY' }
            };
        }
        if (id === 'guardian_id') {
            return {
                id,
                name: 'Guardian',
                role: 'GUARDIAN',
                stats: { abilityShield: 15 },
                specialAbility: { id: 'special_shield', type: 'SHIELD', value: 15, target: 'ALL_ALLIES' }
            };
        }
        if (id === 'support_id') {
            return {
                id,
                name: 'Support',
                role: 'SUPPORT',
                stats: { abilityHeal: 15 },
                specialAbility: { id: 'special_heal', type: 'HEAL', value: 20, target: 'ALL_ALLIES' }
            };
        }
        if (id === 'aoe_dmg_id') {
            return {
                id,
                name: 'Mage',
                role: 'WARRIOR', // Just reusing warrior logic for base
                stats: { abilityDamage: 10 },
                specialAbility: { id: 'meteor', type: 'DAMAGE', value: 10, target: 'ALL_ENEMIES' }
            };
        }
        if (id === 'multi_hit_id') {
            return {
                id,
                name: 'Rogue',
                role: 'WARRIOR',
                stats: { abilityDamage: 10 },
                specialAbility: { id: 'flurry', type: 'MULTI_HIT', value: 5, count: 3, target: 'RANDOM_ENEMY' }
            };
        }
        return {
            id,
            role: 'WARRIOR',
            stats: {}
        };
    }
}));

describe('Player Actions Slice', () => {
    beforeEach(() => {
        useEncounterStore.setState(initialEncounterState);
        useEncounterStore.setState({
            party: [],
            monsters: [],
            encounterLog: []
        });
        vi.useFakeTimers();
    });

    describe('performAction', () => {
        it('should deal damage for WARRIOR role', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, maxHealth: 100, currentHealth: 100, isDead: false };
            const monster = { id: 'm1', name: 'Goblin', currentHealth: 50, maxHealth: 50, isDead: false };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().performAction('u1');

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.party[0].hasActed).toBe(true);
        });

        it('should shield random ally for GUARDIAN role', () => {
            const guardian = { id: 'u1', templateId: 'guardian_id', name: 'Guardian', hasActed: false, currentShield: 0, maxHealth: 100, currentHealth: 100, isDead: false };
            // Needs a target ally (self or other)
            useEncounterStore.setState({ party: [guardian], monsters: [] });

            // Mock Math.random to always return 0 (target self)
            vi.spyOn(Math, 'random').mockReturnValue(0);

            useEncounterStore.getState().performAction('u1');

            const state = useEncounterStore.getState();
            expect(state.party[0].currentShield).toBe(15);
            expect(state.party[0].hasActed).toBe(true);
        });

        it('should heal lowest HP ally for SUPPORT role', () => {
            const support = { id: 'u1', templateId: 'support_id', name: 'Support', hasActed: false, maxHealth: 100, currentHealth: 100, isDead: false };
            const injured = { id: 'u2', templateId: 'warrior_id', name: 'Injured', hasActed: false, maxHealth: 100, currentHealth: 50, isDead: false };

            useEncounterStore.setState({ party: [support, injured], monsters: [] });

            useEncounterStore.getState().performAction('u1');

            const state = useEncounterStore.getState();
            expect(state.party[1].currentHealth).toBe(65); // 50 + 15
            expect(state.party[0].hasActed).toBe(true);
        });
    });

    describe('resolveSpecialAttack', () => {
        it('should deal single target damage', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false };
            const monster = { id: 'm1', name: 'Goblin', currentHealth: 50, maxHealth: 50, isDead: false };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(30); // 50 - 20
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });

        it('should deal AOE damage', () => {
            const mage = { id: 'u1', templateId: 'aoe_dmg_id', name: 'Mage', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false };
            const m1 = { id: 'm1', name: 'G1', currentHealth: 50, maxHealth: 50, isDead: false };
            const m2 = { id: 'm2', name: 'G2', currentHealth: 30, maxHealth: 30, isDead: false };

            useEncounterStore.setState({ party: [mage], monsters: [m1, m2] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.monsters[1].currentHealth).toBe(20); // 30 - 10
        });

        it('should apply AOE shield', () => {
            const guardian = { id: 'u1', templateId: 'guardian_id', name: 'Guardian', hasActed: false, currentShield: 0, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false };
            const ally = { id: 'u2', templateId: 'warrior_id', name: 'Ally', hasActed: false, currentShield: 10, maxHealth: 100, currentHealth: 100, isDead: false };

            useEncounterStore.setState({ party: [guardian, ally], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentShield).toBe(15);
            expect(state.party[1].currentShield).toBe(25); // 10 + 15
        });

        it('should apply AOE heal', () => {
            const support = { id: 'u1', templateId: 'support_id', name: 'Support', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 50, isDead: false };
            const ally = { id: 'u2', templateId: 'warrior_id', name: 'Ally', hasActed: false, maxHealth: 100, currentHealth: 50, isDead: false };

            useEncounterStore.setState({ party: [support, ally], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentHealth).toBe(70); // 50 + 20
            expect(state.party[1].currentHealth).toBe(70); // 50 + 20
        });

        it('should perform multi-hit attack', () => {
            const rogue = { id: 'u1', templateId: 'multi_hit_id', name: 'Rogue', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false };
            const m1 = { id: 'm1', name: 'G1', currentHealth: 100, maxHealth: 100, isDead: false };

            useEncounterStore.setState({ party: [rogue], monsters: [m1] });

            // Mock random to always hit m1
            vi.spyOn(Math, 'random').mockReturnValue(0);

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            // 3 hits of 5 damage = 15 damage
            expect(state.monsters[0].currentHealth).toBe(85);
        });

        it('should handle failure (drain spirit, end turn)', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false };
            useEncounterStore.setState({ party: [warrior], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', false);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });
    });
});
