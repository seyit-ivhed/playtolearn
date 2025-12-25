import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEncounterStore } from '../store';
import { initialEncounterState } from '../initial-state';


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





        if (id === 'guardian_id_revived') {
            return {
                id,
                name: 'Guardian',
                role: 'WARRIOR',
                stats: {},
                specialAbility: { id: 'special_shield', type: 'SHIELD', value: 15, target: 'ALL_ALLIES' }
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
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, currentShield: 0, currentSpirit: 0, maxSpirit: 100, spiritGain: 10 };
            const monster = { id: 'm1', templateId: 'goblin', name: 'Goblin', currentHealth: 50, maxHealth: 50, isDead: false, isPlayer: false, maxShield: 0, currentShield: 0, currentSpirit: 0, maxSpirit: 100, hasActed: false, spiritGain: 10 };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().performAction('u1');

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.party[0].hasActed).toBe(true);
        });


    });

    describe('resolveSpecialAttack', () => {
        it('should deal single target damage', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, currentShield: 0, maxSpirit: 100, spiritGain: 10 };
            const monster = { id: 'm1', templateId: 'goblin', name: 'Goblin', currentHealth: 50, maxHealth: 50, isDead: false, isPlayer: false, maxShield: 0, currentShield: 0, currentSpirit: 0, maxSpirit: 100, hasActed: false, spiritGain: 10 };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(30); // 50 - 20
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });

        it('should deal AOE damage', () => {
            const mage = { id: 'u1', templateId: 'aoe_dmg_id', name: 'Mage', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, currentShield: 0, maxSpirit: 100, spiritGain: 10 };
            const m1 = { id: 'm1', templateId: 'g1', name: 'G1', currentHealth: 50, maxHealth: 50, isDead: false, isPlayer: false, maxShield: 0, currentShield: 0, currentSpirit: 0, maxSpirit: 100, hasActed: false, spiritGain: 10 };
            const m2 = { id: 'm2', templateId: 'g2', name: 'G2', currentHealth: 30, maxHealth: 30, isDead: false, isPlayer: false, maxShield: 0, currentShield: 0, currentSpirit: 0, maxSpirit: 100, hasActed: false, spiritGain: 10 };

            useEncounterStore.setState({ party: [mage], monsters: [m1, m2] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.monsters[1].currentHealth).toBe(20); // 30 - 10
        });

        it('should apply AOE shield', () => {
            const guardian = { id: 'u1', templateId: 'guardian_id_revived', name: 'Guardian', hasActed: false, currentShield: 0, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, maxSpirit: 100, spiritGain: 10 };
            const ally = { id: 'u2', templateId: 'warrior_id', name: 'Ally', hasActed: false, currentShield: 10, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, currentSpirit: 0, maxSpirit: 100, spiritGain: 10 };

            useEncounterStore.setState({ party: [guardian, ally], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentShield).toBe(15);
            expect(state.party[1].currentShield).toBe(25); // 10 + 15
        });





        it('should handle failure (drain spirit, end turn)', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxShield: 0, currentShield: 0, maxSpirit: 100, spiritGain: 10 };
            useEncounterStore.setState({ party: [warrior], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', false);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });
    });
});
