import { create } from 'zustand';
import type { CombatState, CombatAction, CombatEntity } from '../types/combat.types';
import { CombatPhase } from '../types/combat.types';

interface DamageEvent {
    target: 'player' | 'enemy';
    amount: number;
    timestamp: number;
}

interface CombatStore extends CombatState {
    lastDamageEvent: DamageEvent | null;
    initializeCombat: (player: CombatEntity, enemy: CombatEntity) => void;
    setPhase: (phase: CombatPhase) => void;
    playerAction: (action: CombatAction) => void;
    enemyTurn: (action: CombatAction) => void;
    resolveDamage: (target: 'player' | 'enemy', amount: number) => void;
    nextTurn: () => void;
    // Energy handling for dynamic modules
    rechargedModules: string[]; // Track which module IDs were recharged this turn
    // Actions
    consumeModuleEnergy: (moduleId: string) => void;
    rechargeModule: (moduleId: string) => void;
    getModuleInstance: (moduleId: string) => any | null;
    resetRechargeFlag: () => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
    phase: CombatPhase.PLAYER_INPUT,
    turn: 1,
    player: {
        id: 'player',
        name: 'Player',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 50,
        currentShield: 50,
        equippedModules: [], // Will be populated on combat init
        modules: {
            attack: { currentEnergy: 3, maxEnergy: 3 },
            defend: { currentEnergy: 2, maxEnergy: 2 },
            special: { currentEnergy: 2, maxEnergy: 2 },
        },
    },
    enemy: {
        id: 'enemy',
        name: 'Enemy',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        equippedModules: [], // Will be populated on combat init
        modules: {
            attack: { currentEnergy: 0, maxEnergy: 0 },
            defend: { currentEnergy: 0, maxEnergy: 0 },
            special: { currentEnergy: 0, maxEnergy: 0 },
        },
    },
    combatLog: [],
    lastDamageEvent: null,
    // New state flag
    rechargedModules: [],

    initializeCombat: (player, enemy) => set({
        phase: CombatPhase.PLAYER_INPUT,
        turn: 1,
        player,
        enemy,
        combatLog: [`Combat started vs ${enemy.name}!`],
        rechargedModules: [],
    }),

    // Helper to get module instance by ID
    getModuleInstance: (moduleId) => {
        const state = get();
        return state.player.equippedModules.find(m => m.moduleId === moduleId) || null;
    },

    // Energy handling actions - now works with module IDs
    consumeModuleEnergy: (moduleId) => set(state => {
        const moduleIndex = state.player.equippedModules.findIndex(m => m.moduleId === moduleId);
        if (moduleIndex === -1) return state;

        const updatedModules = [...state.player.equippedModules];
        updatedModules[moduleIndex] = {
            ...updatedModules[moduleIndex],
            currentEnergy: Math.max(0, updatedModules[moduleIndex].currentEnergy - 1)
        };

        return {
            player: {
                ...state.player,
                equippedModules: updatedModules
            }
        };
    }),

    rechargeModule: (moduleId) => set(state => {
        const moduleIndex = state.player.equippedModules.findIndex(m => m.moduleId === moduleId);
        if (moduleIndex === -1) return state;

        const updatedModules = [...state.player.equippedModules];
        updatedModules[moduleIndex] = {
            ...updatedModules[moduleIndex],
            currentEnergy: updatedModules[moduleIndex].maxEnergy
        };

        return {
            player: {
                ...state.player,
                equippedModules: updatedModules
            },
            rechargedModules: [...state.rechargedModules, moduleId]
        };
    }),

    resetRechargeFlag: () => set({ rechargedModules: [] }),

    setPhase: (phase) => set({ phase }),

    playerAction: (action) => {
        const { combatLog } = get();
        let logEntry = '';

        if (action.behavior === 'ATTACK') {
            const damage = action.value || 10;
            get().resolveDamage('enemy', damage);
            logEntry = `Player attacks for ${damage} damage!`;
        } else if (action.behavior === 'DEFEND') {
            const shieldBoost = action.value || 15;
            const { player } = get();
            const newShield = Math.min(player.maxShield, player.currentShield + shieldBoost);

            set((state) => ({
                player: {
                    ...state.player,
                    currentShield: newShield
                }
            }));

            logEntry = `Player defends! Shield increased by ${newShield - player.currentShield}.`;
        } else if (action.behavior === 'HEAL') {
            const healAmount = action.value || 20;
            const { player } = get();
            const newHealth = Math.min(player.maxHealth, player.currentHealth + healAmount);

            set((state) => ({
                player: {
                    ...state.player,
                    currentHealth: newHealth
                }
            }));

            logEntry = `Player heals for ${newHealth - player.currentHealth} HP!`;
        } else if (action.behavior === 'SPECIAL') {
            // Implement special logic (placeholder)
            logEntry = `Player uses special!`;
        }

        set({
            phase: CombatPhase.ENEMY_ACTION,
            combatLog: [...combatLog, logEntry],
        });

        // Reset recharge flag at end of player's turn
        get().resetRechargeFlag();

        // Check win condition
        if (get().enemy.currentHealth <= 0) {
            set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
        }
    },

    enemyTurn: (action) => {
        const { combatLog } = get();
        let logEntry = '';

        if (action.behavior === 'ATTACK') {
            const damage = action.value || 5;
            get().resolveDamage('player', damage);
            logEntry = `Enemy attacks for ${damage} damage!`;
        }

        set({
            phase: CombatPhase.PLAYER_INPUT,
            turn: get().turn + 1,
            combatLog: [...combatLog, logEntry],
        });

        // Reset recharge flag at start of new player turn
        get().resetRechargeFlag();

        // Check loss condition
        if (get().player.currentHealth <= 0) {
            set({ phase: CombatPhase.DEFEAT, combatLog: [...get().combatLog, 'Defeat!'] });
        }
    },

    resolveDamage: (target, amount) => {
        set((state) => {
            const entity = target === 'player' ? state.player : state.enemy;
            let damage = amount;
            let newShield = entity.currentShield;

            if (newShield > 0) {
                if (newShield >= damage) {
                    newShield -= damage;
                    damage = 0;
                } else {
                    damage -= newShield;
                    newShield = 0;
                }
            }

            const newHealth = Math.max(0, entity.currentHealth - damage);

            return {
                [target]: {
                    ...entity,
                    currentShield: newShield,
                    currentHealth: newHealth,
                },
                lastDamageEvent: {
                    target,
                    amount,
                    timestamp: Date.now(),
                },
            };
        });
    },

    nextTurn: () => set((state) => ({ turn: state.turn + 1 })),
}));

// Expose store for testing
if (typeof window !== 'undefined') {
    (window as any).__COMBAT_STORE__ = useCombatStore;
}
