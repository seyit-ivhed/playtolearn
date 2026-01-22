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
                stats: { abilityDamage: 10 },
                specialAbility: { id: 'jaguar_strike', variables: { damage: 20 } }
            };
        }

        if (id === 'guardian_id_revived') {
            return {
                id,
                name: 'Guardian',
                stats: {},
                specialAbility: { id: 'elixir_of_life', variables: { heal: 15 } }
            };
        }

        if (id === 'aoe_dmg_id') {
            return {
                id,
                name: 'Mage',
                stats: { abilityDamage: 10 },
                specialAbility: { id: 'ancestral_storm', variables: { damage: 10 } }
            };
        }

        return {
            id,
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
        it('should deal damage for standard attack', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, currentSpirit: 0, maxSpirit: 100, spiritGain: 10, damage: 10 };
            const monster = { id: 'm1', templateId: 'goblin', name: 'Goblin', currentHealth: 50, maxHealth: 50, isDead: false, isPlayer: false, currentSpirit: 0, maxSpirit: 100, hasActed: false, spiritGain: 10 };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().performAction('u1');

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.party[0].hasActed).toBe(true);
        });


    });

    describe('resolveSpecialAttack', () => {
        const baseUnit = {
            image: '',
            title: '',
            isDead: false,
            hasActed: false,
            currentSpirit: 100,
            maxSpirit: 100,
            spiritGain: 10,
            isPlayer: true
        };

        it('should deal single target damage', async () => {
            const warrior = { ...baseUnit, id: 'u1', templateId: 'warrior_id', name: 'Warrior', maxHealth: 100, currentHealth: 100, specialAbilityId: 'jaguar_strike', specialAbilityVariables: { damage: 20 } };
            const monster = { ...baseUnit, id: 'm1', templateId: 'goblin', name: 'Goblin', currentHealth: 50, maxHealth: 50, isPlayer: false };

            useEncounterStore.setState({ party: [warrior], monsters: [monster] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            // Wait for async update
            await vi.waitFor(() => {
                const state = useEncounterStore.getState();
                if (state.monsters[0].currentHealth !== 30) throw new Error('Not updated yet');
            });

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(30); // 50 - 20
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });

        it('should deal AOE damage', async () => {
            const mage = { ...baseUnit, id: 'u1', templateId: 'aoe_dmg_id', name: 'Mage', maxHealth: 100, currentHealth: 100, specialAbilityId: 'ancestral_storm', specialAbilityVariables: { damage: 10 } };
            const m1 = { ...baseUnit, id: 'm1', templateId: 'g1', name: 'G1', currentHealth: 50, maxHealth: 50, isPlayer: false };
            const m2 = { ...baseUnit, id: 'm2', templateId: 'g2', name: 'G2', currentHealth: 30, maxHealth: 30, isPlayer: false };

            useEncounterStore.setState({ party: [mage], monsters: [m1, m2] });

            useEncounterStore.getState().resolveSpecialAttack('u1', true);

            // Wait for async update
            await vi.waitFor(() => {
                const state = useEncounterStore.getState();
                if (state.monsters[0].currentHealth !== 40) throw new Error('Not updated yet');
            });

            const state = useEncounterStore.getState();
            expect(state.monsters[0].currentHealth).toBe(40); // 50 - 10
            expect(state.monsters[1].currentHealth).toBe(20); // 30 - 10
        });

        it('should handle failure (drain spirit, end turn)', () => {
            const warrior = { id: 'u1', templateId: 'warrior_id', name: 'Warrior', hasActed: false, currentSpirit: 100, maxHealth: 100, currentHealth: 100, isDead: false, isPlayer: true, maxSpirit: 100, spiritGain: 10, specialAbilityId: 'jaguar_strike' };
            useEncounterStore.setState({ party: [warrior], monsters: [] });

            useEncounterStore.getState().resolveSpecialAttack('u1', false);

            const state = useEncounterStore.getState();
            expect(state.party[0].currentSpirit).toBe(0);
            expect(state.party[0].hasActed).toBe(true);
        });
    });
});
