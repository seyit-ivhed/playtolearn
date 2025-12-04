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
    rechargedThisTurn: boolean;
    // Actions
    consumeEnergy: (amount: number) => void;
    fullRecharge: () => void;
    resetRechargeFlag: () => void;
    setRechargedThisTurn: (value: boolean) => void;
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
        maxEnergy: 100,
        currentEnergy: 100,
    },
    enemy: {
        id: 'enemy',
        name: 'Enemy',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        maxEnergy: 0,
        currentEnergy: 0,
    },
    combatLog: [],
    lastDamageEvent: null,
    // New state flag
    rechargedThisTurn: false,

    initializeCombat: (player, enemy) => set({
        phase: CombatPhase.PLAYER_INPUT,
        turn: 1,
        player,
        enemy,
        combatLog: [`Combat started vs ${enemy.name}!`],
        rechargedThisTurn: false,
    }),

    setPhase: (phase) => set({ phase }),

    // Energy handling actions
    consumeEnergy: (amount) => set(state => ({
        player: { ...state.player, currentEnergy: Math.max(0, state.player.currentEnergy - amount) }
    })),
    fullRecharge: () => set(state => ({
        player: { ...state.player, currentEnergy: state.player.maxEnergy }
    })),
    resetRechargeFlag: () => set({ rechargedThisTurn: false }),
    setRechargedThisTurn: (value) => set({ rechargedThisTurn: value }),

    playerAction: (action) => {
        const { combatLog } = get();
        let logEntry = '';

        if (action.type === 'ATTACK') {
            const damage = action.value || 10;
            get().resolveDamage('enemy', damage);
            logEntry = `Player attacks for ${damage} damage!`;
        } else if (action.type === 'DEFEND') {
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
        } else if (action.type === 'REPAIR') {
            // Implement repair logic
            logEntry = `Player repairs!`;
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

        if (action.type === 'ATTACK') {
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
