import type { StateCreator } from 'zustand';
import type { CombatStore, PlayerActionsSlice } from '../interfaces';
import { CombatPhase } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';

export const createPlayerActionsSlice: StateCreator<CombatStore, [], [], PlayerActionsSlice> = (set, get) => ({
    selectUnit: (unitId) => set({ selectedUnitId: unitId }),

    performAction: (unitId, options = {}) => {
        const { party, monsters } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        const isCritical = options.isCritical || false;

        // Get Ability Data
        const companionData = getCompanionById(unit.templateId);

        if (unit.hasActed) return;

        // consume energy
        const newParty = [...party];
        newParty[unitIndex] = { ...unit, hasActed: true };

        let logMsg = `${unit.name} used ${companionData.abilityName}!`;
        if (isCritical) {
            logMsg = `CRITICAL! ${logMsg}`;
        }

        const multiplier = isCritical ? 2 : 1;

        // Apply Effects
        // Simple logic for now: 
        // Warrior -> Hit first living monster
        // Guardian -> Shield random ally
        // Support -> Heal lowest HP ally

        if (companionData.role === 'WARRIOR') {
            const targetIndex = monsters.findIndex(m => !m.isDead);
            if (targetIndex !== -1) {
                const target = monsters[targetIndex];
                const baseDamage = companionData.abilityDamage || 10;
                const damage = baseDamage * multiplier;

                const newHealth = Math.max(0, target.currentHealth - damage);

                const newMonsters = [...monsters];
                newMonsters[targetIndex] = {
                    ...target,
                    currentHealth: newHealth,
                    isDead: newHealth === 0
                };

                set({ party: newParty, monsters: newMonsters });
                logMsg += ` Dealt ${damage} damage to ${target.name}.`;
            }
        } else if (companionData.role === 'GUARDIAN') {
            // Shield random ally
            const baseAmount = companionData.abilityShield || 15;
            const amount = baseAmount * multiplier;

            const targetIndex = Math.floor(Math.random() * newParty.length);
            newParty[targetIndex].currentShield += amount;
            set({ party: newParty });
            logMsg += ` Shielded ${newParty[targetIndex].name} for ${amount}.`;
        } else if (companionData.role === 'SUPPORT') {
            // Heal lowest HP
            const baseAmount = companionData.abilityHeal || 15;
            const amount = baseAmount * multiplier;

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
            logMsg += ` Healed ${target.name} for ${amount}.`;
        } else {
            set({ party: newParty });
        }

        set(state => ({
            party: newParty,
            combatLog: [...state.combatLog, logMsg]
        }));

        // Check Victory
        if (get().monsters.every(m => m.isDead)) {
            // Delay victory to allow animations to finish
            setTimeout(() => {
                set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
            }, 1500);
            return;
        }

        // Check End Turn Condition (All living party members acted)
        const allActed = get().party.every(p => p.isDead || p.hasActed);
        if (allActed) {
            get().endPlayerTurn();
        }
    },

    resolveSpecialAttack: (unitId, success) => {
        const { monsters, party } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        const companionData = getCompanionById(unit.templateId);
        const ability = companionData.specialAbility;

        let newParty = [...party];
        let newMonsters = [...monsters];
        let logs: string[] = [];

        if (success) {
            logs.push(`${unit.name} cast ${ability.name}!`);

            // EXECUTE ABILITY LOGIC
            if (ability.type === 'DAMAGE') {
                if (ability.target === 'ALL_ENEMIES') {
                    newMonsters = newMonsters.map(m => {
                        if (m.isDead) return m;
                        const newHealth = Math.max(0, m.currentHealth - ability.value);
                        return { ...m, currentHealth: newHealth, isDead: newHealth === 0 };
                    });
                    logs.push(`Dealt ${ability.value} damage to ALL enemies!`);
                } else if (ability.target === 'SINGLE_ENEMY') {
                    // Hit first living
                    const targetIndex = newMonsters.findIndex(m => !m.isDead);
                    if (targetIndex !== -1) {
                        const target = newMonsters[targetIndex];
                        const newHealth = Math.max(0, target.currentHealth - ability.value);
                        newMonsters[targetIndex] = { ...target, currentHealth: newHealth, isDead: newHealth === 0 };
                        logs.push(`Dealt ${ability.value} damage to ${target.name}!`);
                    }
                }
            } else if (ability.type === 'HEAL') {
                if (ability.target === 'ALL_ALLIES') {
                    newParty = newParty.map(p => {
                        if (p.isDead) return p;
                        return { ...p, currentHealth: Math.min(p.maxHealth, p.currentHealth + ability.value) };
                    });
                    logs.push(`Healed party for ${ability.value}!`);
                } else if (ability.target === 'SELF') {
                    // Logic for Squire (Heal Self + Max Shield)
                    const newHealth = Math.min(unit.maxHealth, unit.currentHealth + ability.value);
                    newParty[unitIndex] = {
                        ...newParty[unitIndex],
                        currentHealth: newHealth,
                        currentShield: 999 // Max Shield effectively
                    };
                    logs.push(`Healed self and raised Shield Wall!`);
                }
            } else if (ability.type === 'SHIELD') {
                if (ability.target === 'ALL_ALLIES') {
                    newParty = newParty.map(p => {
                        if (p.isDead) return p;
                        return { ...p, currentShield: p.currentShield + ability.value };
                    });
                    logs.push(`Shielded party for ${ability.value}!`);
                }
            } else if (ability.type === 'MULTI_HIT') {
                let hits = ability.count || 3;
                for (let i = 0; i < hits; i++) {
                    const livingMonsters = newMonsters.filter(m => !m.isDead);
                    if (livingMonsters.length === 0) break;
                    const randomIdx = Math.floor(Math.random() * livingMonsters.length);
                    const targetId = livingMonsters[randomIdx].id;
                    const monsterIdx = newMonsters.findIndex(m => m.id === targetId);

                    if (monsterIdx !== -1) {
                        const m = newMonsters[monsterIdx];
                        const newHealth = Math.max(0, m.currentHealth - ability.value);
                        newMonsters[monsterIdx] = { ...m, currentHealth: newHealth, isDead: newHealth === 0 };
                    }
                }
                logs.push(`Dealt ${ability.value} damage x${hits}!`);
            }

            // Consume Charge (Reset to 0) AND Mark as Acted
            // Ensure spirit is 0 (it might have been reset earlier, but force it here too for consistency)
            newParty[unitIndex] = { ...newParty[unitIndex], currentSpirit: 0, hasActed: true };

            set({
                monsters: newMonsters,
                party: newParty,
                combatLog: [...get().combatLog, ...logs]
            });

            // Check Victory
            if (newMonsters.every(m => m.isDead)) {
                // Delay victory to allow animations to finish
                setTimeout(() => {
                    set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
                }, 1500);
                return;
            }

            // Check End Turn Condition (All living party members acted)
            const allActed = newParty.every(p => p.isDead || p.hasActed);
            if (allActed) {
                get().endPlayerTurn();
            }

        } else {
            // Fail: Drain meter AND Mark as Acted
            newParty[unitIndex] = { ...newParty[unitIndex], currentSpirit: 0, hasActed: true };
            set({
                party: newParty,
                combatLog: [...get().combatLog, `${unit.name}'s ability FAILED! Charge lost.`]
            });

            // Check End Turn Condition (All living party members acted)
            const allActed = newParty.every(p => p.isDead || p.hasActed);
            if (allActed) {
                get().endPlayerTurn();
            }
        }
    },

    consumeSpirit: (unitId) => {
        const { party } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const newParty = [...party];
        newParty[unitIndex] = { ...newParty[unitIndex], currentSpirit: 0 };
        set({ party: newParty });
    }
});
