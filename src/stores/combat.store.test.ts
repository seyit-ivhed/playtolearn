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
        equippedModules: [
            {
                moduleId: 'weapon_laser_1',
                slotId: 'slot_weapon_1',
                currentEnergy: 3,
                maxEnergy: 3,
                combatAction: 'ATTACK'
            },
            {
                moduleId: 'shield_basic_1',
                slotId: 'slot_support_1',
                currentEnergy: 2,
                maxEnergy: 2,
                combatAction: 'DEFEND'
            }
        ],
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
        equippedModules: [],
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
        useCombatStore.getState().playerAction({ moduleId: 'weapon_laser_1', behavior: 'ATTACK', value: 20 });
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

        useCombatStore.getState().playerAction({ moduleId: 'shield_basic_1', behavior: 'DEFEND', value: 15 });
        const state = useCombatStore.getState();

        expect(state.player.currentShield).toBe(45);
        expect(state.phase).toBe(CombatPhase.ENEMY_ACTION);
        expect(state.combatLog).toContain('Player defends! Shield increased by 15.');
    });

    it('should handle enemy attack', () => {
        useCombatStore.getState().enemyTurn({ moduleId: 'enemy_weapon', behavior: 'ATTACK', value: 10 });
        const state = useCombatStore.getState();

        // Player has 50 shield, so damage should go to shield first
        expect(state.player.currentShield).toBe(40);
        expect(state.player.currentHealth).toBe(100);
        expect(state.phase).toBe(CombatPhase.PLAYER_INPUT);
        expect(state.turn).toBe(2);
    });

    it('should detect victory', () => {
        useCombatStore.getState().playerAction({ moduleId: 'weapon_laser_1', behavior: 'ATTACK', value: 50 });
        const state = useCombatStore.getState();

        expect(state.enemy.currentHealth).toBe(0);
        expect(state.phase).toBe(CombatPhase.VICTORY);
    });

    it('should detect defeat', () => {
        // Manually set player health to low
        useCombatStore.setState({
            player: { ...mockPlayer, currentHealth: 5, currentShield: 0 }
        });

        useCombatStore.getState().enemyTurn({ moduleId: 'enemy_weapon', behavior: 'ATTACK', value: 10 });
        const state = useCombatStore.getState();

        expect(state.player.currentHealth).toBe(0);
        expect(state.phase).toBe(CombatPhase.DEFEAT);
    });

    it('should consume module energy correctly', () => {
        useCombatStore.getState().consumeModuleEnergy('weapon_laser_1');
        expect(useCombatStore.getState().player.equippedModules[0].currentEnergy).toBe(2);

        useCombatStore.getState().consumeModuleEnergy('weapon_laser_1');
        useCombatStore.getState().consumeModuleEnergy('weapon_laser_1');
        expect(useCombatStore.getState().player.equippedModules[0].currentEnergy).toBe(0);

        // Should not go below 0
        useCombatStore.getState().consumeModuleEnergy('weapon_laser_1');
        expect(useCombatStore.getState().player.equippedModules[0].currentEnergy).toBe(0);
    });

    it('should recharge module energy', () => {
        // First consume some energy
        useCombatStore.getState().consumeModuleEnergy('weapon_laser_1');
        expect(useCombatStore.getState().player.equippedModules[0].currentEnergy).toBe(2);

        useCombatStore.getState().rechargeModule('weapon_laser_1');
        expect(useCombatStore.getState().player.equippedModules[0].currentEnergy).toBe(3);
    });

    it('should handle recharge flag', () => {
        expect(useCombatStore.getState().rechargedModules).toEqual([]);

        useCombatStore.getState().rechargeModule('weapon_laser_1');
        expect(useCombatStore.getState().rechargedModules).toContain('weapon_laser_1');

        useCombatStore.getState().resetRechargeFlag();
        expect(useCombatStore.getState().rechargedModules).toEqual([]);
    });
});
