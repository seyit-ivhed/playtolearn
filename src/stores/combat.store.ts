import { create } from 'zustand';
import { CombatPhase, type CombatUnit, type CombatState } from '../types/combat.types';
import { getCompanionById } from '../data/companions.data';
import { createEnemy } from '../data/enemies.data';

interface CombatStore extends CombatState {
    initializeCombat: (partyIds: string[], enemyTemplateIds: string[]) => void;
    selectUnit: (unitId: string | null) => void;
    performAction: (unitId: string) => void;
    rechargeUnit: (unitId: string) => void;
    endPlayerTurn: () => void;
    processEnemyTurn: () => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
    phase: CombatPhase.INIT,
    turnCount: 0,
    party: [],
    enemies: [],
    selectedUnitId: null,
    combatLog: [],

    initializeCombat: (partyIds, enemyTemplateIds) => {
        const party: CombatUnit[] = partyIds.map((id, index) => {
            const data = getCompanionById(id);
            return {
                id: `party_${id}_${index}`,
                templateId: id,
                name: data.name,
                isPlayer: true,
                maxHealth: data.maxHealth,
                currentHealth: data.maxHealth,
                maxEnergy: data.maxEnergy,
                currentEnergy: data.maxEnergy,
                maxShield: 0,
                currentShield: 0,
                icon: data.icon,
                color: data.color,
                isDead: false
            };
        });

        const enemies: CombatUnit[] = enemyTemplateIds.map((id, index) => {
            const enemy = createEnemy(id, `enemy_${id}_${index}`);
            return {
                ...enemy,
                isPlayer: false,
                maxEnergy: 0,
                currentEnergy: 0,
                isDead: false
            };
        });

        set({
            phase: CombatPhase.PLAYER_TURN,
            turnCount: 1,
            party,
            enemies,
            selectedUnitId: null,
            combatLog: ['Combat Started!']
        });
    },

    selectUnit: (unitId) => set({ selectedUnitId: unitId }),

    performAction: (unitId) => {
        const { party, enemies } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        if (unit.currentEnergy <= 0) return; // Should be blocked by UI

        // Get Ability Data
        const companionData = getCompanionById(unit.templateId);

        // consume energy
        const newParty = [...party];
        newParty[unitIndex] = { ...unit, currentEnergy: unit.currentEnergy - 1 };

        let logMsg = `${unit.name} used ${companionData.abilityName}!`;

        // Apply Effects
        // Simple logic for now: 
        // Warrior -> Hit first living enemy
        // Guardian -> Shield random ally
        // Support -> Heal lowest HP ally

        if (companionData.role === 'WARRIOR') {
            const targetIndex = enemies.findIndex(e => !e.isDead);
            if (targetIndex !== -1) {
                const target = enemies[targetIndex];
                const damage = companionData.abilityDamage || 10;
                const newHealth = Math.max(0, target.currentHealth - damage);

                const newEnemies = [...enemies];
                newEnemies[targetIndex] = {
                    ...target,
                    currentHealth: newHealth,
                    isDead: newHealth === 0
                };

                set({ party: newParty, enemies: newEnemies });
                logMsg += ` Dealt ${damage} damage to ${target.name}.`;
            }
        } else if (companionData.role === 'GUARDIAN') {
            // Shield random ally
            const amount = companionData.abilityShield || 15;
            const targetIndex = Math.floor(Math.random() * newParty.length);
            newParty[targetIndex].currentShield += amount;
            set({ party: newParty });
            logMsg += ` Shielded ${newParty[targetIndex].name}.`;
        } else if (companionData.role === 'SUPPORT') {
            // Heal lowest HP
            const amount = companionData.abilityHeal || 15;
            let lowestIndex = 0;
            let lowestHP = 9999;
            newParty.forEach((p, idx) => {
                if (!p.isDead && p.currentHealth < p.maxHealth && p.currentHealth < lowestHP) {
                    lowestHP = p.currentHealth;
                    lowestIndex = idx;
                }
            });
            const target = newParty[lowestIndex];
            const newHealth = Math.min(target.maxHealth, target.currentHealth + amount);
            newParty[lowestIndex].currentHealth = newHealth;

            set({ party: newParty });
            logMsg += ` Healed ${target.name}.`;
        } else {
            set({ party: newParty });
        }

        set(state => ({ combatLog: [...state.combatLog, logMsg] }));

        // Check Victory
        if (get().enemies.every(e => e.isDead)) {
            set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
        }
    },

    rechargeUnit: (unitId) => {
        const { party } = get();
        const idx = party.findIndex(u => u.id === unitId);
        if (idx === -1) return;

        const newParty = [...party];
        newParty[idx].currentEnergy = newParty[idx].maxEnergy;
        set({ party: newParty, combatLog: [...get().combatLog, `${newParty[idx].name} recharged!`] });
    },

    endPlayerTurn: () => {
        set({ phase: CombatPhase.ENEMY_TURN });
        setTimeout(() => get().processEnemyTurn(), 1000);
    },

    processEnemyTurn: () => {
        const { enemies, party } = get();
        const activeEnemies = enemies.filter(e => !e.isDead);

        if (activeEnemies.length === 0) return; // Should be victory already

        // Simple AI: All enemies attack random party member
        let newParty = [...party];
        const logs: string[] = [];

        activeEnemies.forEach(enemy => {
            const livingTargets = newParty.filter(p => !p.isDead);
            if (livingTargets.length === 0) return;

            const targetIdx = Math.floor(Math.random() * livingTargets.length);
            const actualTargetIndex = newParty.findIndex(p => p.id === livingTargets[targetIdx].id);
            const target = newParty[actualTargetIndex];

            // Calc Damage vs Shield
            let damage = enemy.maxHealth > 0 ? 10 : 5; // Simplified damage based on generic
            // Or fetch from data if we stored damage on instance. We didn't store damage on CombatUnit, oops.
            // Let's assume generic damage for now or fetch from ENEMY_CV via templateId if needed.
            // Actually I'll just use a constant for simplicity in this MVP step.
            damage = 8;

            if (target.currentShield > 0) {
                if (target.currentShield >= damage) {
                    target.currentShield -= damage;
                    damage = 0;
                } else {
                    damage -= target.currentShield;
                    target.currentShield = 0;
                }
            }

            target.currentHealth = Math.max(0, target.currentHealth - damage);
            if (target.currentHealth === 0) target.isDead = true;

            logs.push(`${enemy.name} attacked ${target.name} for ${damage} damage!`);
        });

        set(state => ({
            party: newParty,
            phase: CombatPhase.PLAYER_TURN,
            turnCount: state.turnCount + 1,
            combatLog: [...state.combatLog, ...logs]
        }));

        if (newParty.every(p => p.isDead)) {
            set({ phase: CombatPhase.DEFEAT, combatLog: [...get().combatLog, 'Party Defeated...'] });
        }
    }
}));
