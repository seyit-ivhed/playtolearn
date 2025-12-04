import { describe, it, expect, beforeEach } from 'vitest';
import { useCombatStore } from './combat.store';
import { CombatPhase, type CombatEntity } from '../types/combat.types';

describe('Combat Store', () => {
    const mockPlayer: CombatEntity = {
        id: 'player',
        name: 'Player',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 50,
        currentShield: 50,
        modules: {
            attack: { currentEnergy: 3, maxEnergy: 3 },
            defend: { currentEnergy: 2, maxEnergy: 2 },
            special: { currentEnergy: 2, maxEnergy: 2 },
        },
    };

    const mockEnemy: CombatEntity = {
        id: 'enemy',
        name: 'Enemy',
        maxHealth: 50,
        currentHealth: 50,
        maxShield: 0,
        currentShield: 0,
        modules: {
            attack: { currentEnergy: 0, maxEnergy: 0 },
            defend: { currentEnergy: 0, maxEnergy: 0 },
            special: { currentEnergy: 0, maxEnergy: 0 },
        },
    };

    beforeEach(() => {
        useCombatStore.getState().initializeCombat(mockPlayer, mockEnemy);
    });

    it('should initialize combat correctly', () => {
        const state = useCombatStore.getState();
        expect(state.phase).toBe(CombatPhase.PLAYER_INPUT);
        expect(state.player).toEqual(mockPlayer);
        expect(state.enemy).toEqual(mockEnemy);
        expect(state.turn).toBe(1);
    });

    it('should handle player attack', () => {
        useCombatStore.getState().playerAction({ type: 'attack', value: 20 });
        const state = useCombatStore.getState();

        expect(state.enemy.currentHealth).toBe(30);
        expect(state.phase).toBe(CombatPhase.ENEMY_ACTION);
        expect(state.combatLog).toContain('Player attacks for 20 damage!');
    });

    it('should handle player defend', () => {
        // Reduce shield first to allow boosting
        useCombatStore.setState(state => ({
            player: { ...state.player, currentShield: 30 }
        }));

        useCombatStore.getState().playerAction({ type: 'defend', value: 15 });
        const state = useCombatStore.getState();

        expect(state.player.currentShield).toBe(45);
        expect(state.phase).toBe(CombatPhase.ENEMY_ACTION);
        expect(state.combatLog).toContain('Player defends! Shield increased by 15.');
    });

    it('should handle enemy attack', () => {
        useCombatStore.getState().enemyTurn({ type: 'attack', value: 10 });
        const state = useCombatStore.getState();

        // Player has 50 shield, so damage should go to shield first
        expect(state.player.currentShield).toBe(40);
        expect(state.player.currentHealth).toBe(100);
        expect(state.phase).toBe(CombatPhase.PLAYER_INPUT);
        expect(state.turn).toBe(2);
    });

    it('should detect victory', () => {
        useCombatStore.getState().playerAction({ type: 'attack', value: 50 });
        const state = useCombatStore.getState();

        expect(state.enemy.currentHealth).toBe(0);
        expect(state.phase).toBe(CombatPhase.VICTORY);
    });

    it('should detect defeat', () => {
        // Manually set player health to low
        useCombatStore.setState({
            player: { ...mockPlayer, currentHealth: 5, currentShield: 0 }
        });

        useCombatStore.getState().enemyTurn({ type: 'attack', value: 10 });
        const state = useCombatStore.getState();

        expect(state.player.currentHealth).toBe(0);
        expect(state.phase).toBe(CombatPhase.DEFEAT);
    });

    it('should consume module energy correctly', () => {
        useCombatStore.getState().consumeModuleEnergy('attack');
        expect(useCombatStore.getState().player.modules.attack.currentEnergy).toBe(2);

        useCombatStore.getState().consumeModuleEnergy('attack');
        useCombatStore.getState().consumeModuleEnergy('attack');
        expect(useCombatStore.getState().player.modules.attack.currentEnergy).toBe(0);

        // Should not go below 0
        useCombatStore.getState().consumeModuleEnergy('attack');
        expect(useCombatStore.getState().player.modules.attack.currentEnergy).toBe(0);
    });

    it('should recharge module energy', () => {
        // First consume some energy
        useCombatStore.getState().consumeModuleEnergy('attack');
        expect(useCombatStore.getState().player.modules.attack.currentEnergy).toBe(2);

        useCombatStore.getState().rechargeModule('attack');
        expect(useCombatStore.getState().player.modules.attack.currentEnergy).toBe(3);
    });

    it('should handle recharge flag', () => {
        expect(useCombatStore.getState().rechargedModules).toEqual([]);

        useCombatStore.getState().rechargeModule('attack');
        expect(useCombatStore.getState().rechargedModules).toContain('attack');

        useCombatStore.getState().resetRechargeFlag();
        expect(useCombatStore.getState().rechargedModules).toEqual([]);
    });
});
