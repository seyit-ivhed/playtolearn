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
    // New fields for energy handling
    rechargedModules: string[]; // Track which modules were recharged this turn
    // Actions
    consumeModuleEnergy: (module: 'attack' | 'defend' | 'special') => void;
    rechargeModule: (module: 'attack' | 'defend' | 'special') => void;
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

    // Energy handling actions
    consumeModuleEnergy: (module) => set(state => {
        const current = state.player.modules[module].currentEnergy;
        return {
            player: {
                ...state.player,
                modules: {
                    ...state.player.modules,
                    [module]: {
                        ...state.player.modules[module],
                        currentEnergy: Math.max(0, current - 1)
                    }
                }
            }
        };
    }),
    rechargeModule: (module) => set(state => ({
        player: {
            ...state.player,
            modules: {
                ...state.player.modules,
                [module]: {
                    ...state.player.modules[module],
                    currentEnergy: state.player.modules[module].maxEnergy
                }
            }
        },
        rechargedModules: [...state.rechargedModules, module]
    })),
    resetRechargeFlag: () => set({ rechargedModules: [] }),

    setPhase: (phase) => set({ phase }),

    playerAction: (action) => {
        const { combatLog } = get();
        let logEntry = '';

        if (action.type === 'attack') {
            const damage = action.value || 10;
            get().resolveDamage('enemy', damage);
            logEntry = `Player attacks for ${damage} damage!`;
        } else if (action.type === 'defend') {
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
        } else if (action.type === 'special') {
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

        if (action.type === 'attack') {
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
