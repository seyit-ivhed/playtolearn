import { create } from 'zustand';
import { CombatPhase, type CombatUnit, type CombatState } from '../types/combat.types';
import { getCompanionById } from '../data/companions.data';
// import { createMonster } from '../data/monsters.data'; // No longer needed for ID lookup
import type { AdventureMonster } from '../types/adventure.types';

interface CombatStore extends CombatState {
    initializeCombat: (partyIds: string[], enemies: AdventureMonster[]) => void;
    selectUnit: (unitId: string | null) => void;
    performAction: (unitId: string) => void;
    resolveRecharge: (unitId: string, success: boolean) => void;
    resolveSpecialAttack: (success: boolean) => void;
    endPlayerTurn: () => void;
    processMonsterTurn: () => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
    phase: CombatPhase.INIT,
    turnCount: 0,
    party: [],
    monsters: [],
    selectedUnitId: null,
    combatLog: [],
    specialMeter: 0,

    initializeCombat: (partyIds, enemies) => {
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
                isDead: false,
                hasActed: false,
                rechargeFailed: false
            };
        });

        const monsters: CombatUnit[] = enemies.map((enemy, index) => {
            return {
                id: `monster_${enemy.id}_${index}`,
                templateId: enemy.id,
                name: enemy.name,
                isPlayer: false,
                maxHealth: enemy.maxHealth,
                currentHealth: enemy.maxHealth,
                maxEnergy: 0,
                currentEnergy: 0,
                maxShield: enemy.maxShield || 0,
                currentShield: 0,
                // Map 'attack' to 'damage' for now, or ensure types align
                // CombatUnit doesn't strictly have 'damage' in the type definition shown in prompt, 
                // but the createMonster logic used it. 
                // Let's check CombatUnit type if possible, but assuming it has what's needed for UI/Logic.
                // The processMonsterTurn logic uses a hardcoded `let damage = 8`.
                // We should store attack/damage on the unit if we want dynamic damage.
                // For now, I'll add 'attack' to the object if CombatUnit allows, or just use it in logic.
                // Wait, CombatUnit in previous view didn't explicitly show 'damage' or 'attack' fields 
                // but createMonster returned 'damage'.
                // I will assume I can store extra props or I need to add them to CombatUnit type.
                // Let's stick to what createMonster was returning, which included 'damage'.
                damage: enemy.attack,
                icon: enemy.icon || '👾',
                image: enemy.sprite,
                color: '#e74c3c', // Default red for enemies
                isDead: false,
                hasActed: false,
                rechargeFailed: false
            } as any; // Casting to any to avoid type mismatch if CombatUnit is strict
        });

        set({
            phase: CombatPhase.PLAYER_TURN,
            turnCount: 1,
            party,
            monsters,
            selectedUnitId: null,
            combatLog: ['Combat Started!']
        });
    },

    selectUnit: (unitId) => set({ selectedUnitId: unitId }),

    performAction: (unitId) => {
        const { party, monsters } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        if (unit.currentEnergy <= 0) return; // Should be blocked by UI

        // Get Ability Data
        const companionData = getCompanionById(unit.templateId);

        if (unit.hasActed) return;

        // consume energy
        const newParty = [...party];
        newParty[unitIndex] = { ...unit, currentEnergy: unit.currentEnergy - 1, hasActed: true };

        let logMsg = `${unit.name} used ${companionData.abilityName}!`;

        // Apply Effects
        // Simple logic for now: 
        // Warrior -> Hit first living monster
        // Guardian -> Shield random ally
        // Support -> Heal lowest HP ally

        if (companionData.role === 'WARRIOR') {
            const targetIndex = monsters.findIndex(m => !m.isDead);
            if (targetIndex !== -1) {
                const target = monsters[targetIndex];
                const damage = companionData.abilityDamage || 10;
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

        // Increase Special Meter on successful action
        const currentMeter = get().specialMeter;
        const newMeter = Math.min(100, currentMeter + 15); // +15 per action, ~7 actions to full

        set(state => ({
            combatLog: [...state.combatLog, logMsg],
            specialMeter: newMeter
        }));

        // Check Victory
        if (get().monsters.every(m => m.isDead)) {
            set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
            return;
        }

        // Check End Turn Condition (All living party members acted)
        const allActed = get().party.every(p => p.isDead || p.hasActed);
        if (allActed) {
            get().endPlayerTurn();
        }
    },

    resolveRecharge: (unitId, success) => {
        const { party } = get();
        const idx = party.findIndex(u => u.id === unitId);
        if (idx === -1) return;

        const newParty = [...party];
        const unit = newParty[idx];

        if (success) {
            // Success: Full Energy, NO Turn End (per GDD)
            unit.currentEnergy = unit.maxEnergy;
            // Mentioning GDD: "Recharging does not end the player's turn"
            // unit.hasActed remains false (or whatever it was)
            set({
                party: newParty,
                combatLog: [...get().combatLog, `${unit.name} recharged successfully!`]
            });
        } else {
            // Fail: Mark as failed, cannot try again
            unit.rechargeFailed = true;
            // "If recharge fails, players can try it next turn" -> implied they cannot try again THIS turn.
            set({
                party: newParty,
                combatLog: [...get().combatLog, `${unit.name} failed to recharge...`]
            });
        }
    },

    resolveSpecialAttack: (success) => {
        const { monsters } = get();

        if (success) {
            // Deal massive damage to all monsters
            const newMonsters = monsters.map(m => {
                if (m.isDead) return m;
                const damage = 20; // Big damage
                const newHealth = Math.max(0, m.currentHealth - damage);
                return { ...m, currentHealth: newHealth, isDead: newHealth === 0 };
            });

            set({
                monsters: newMonsters,
                specialMeter: 0, // Reset meter
                combatLog: [...get().combatLog, `SPECIAL ATTACK! Dealt 20 damage to all enemies!`]
            });

            // Check Victory
            if (newMonsters.every(m => m.isDead)) {
                set({ phase: CombatPhase.VICTORY, combatLog: [...get().combatLog, 'Victory!'] });
            }

        } else {
            // Fail: Drain meter
            set({
                specialMeter: 0,
                combatLog: [...get().combatLog, `Special Attack fizzled out... Meter drained.`]
            });
        }
    },

    endPlayerTurn: () => {
        set({ phase: CombatPhase.MONSTER_TURN });
        setTimeout(() => get().processMonsterTurn(), 1000);
    },

    processMonsterTurn: () => {
        const { monsters, party } = get();
        const activeMonsters = monsters.filter(m => !m.isDead);
        // Expose store for testing
        if (typeof window !== 'undefined') {
            (window as any).useCombatStore = useCombatStore;
        }

        if (activeMonsters.length === 0) return; // Should be victory already

        // Simple AI: All monsters attack random party member
        let newParty = [...party];
        const logs: string[] = [];

        activeMonsters.forEach(monster => {
            const livingTargets = newParty.filter(p => !p.isDead);
            if (livingTargets.length === 0) return;

            const targetIdx = Math.floor(Math.random() * livingTargets.length);
            const actualTargetIndex = newParty.findIndex(p => p.id === livingTargets[targetIdx].id);
            const target = newParty[actualTargetIndex];

            // Calc Damage vs Shield
            // Using generic damage for now
            let damage = 8;
            // Ideally fetch from monster data using templateId

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

            logs.push(`${monster.name} attacked ${target.name} for ${damage} damage!`);
        });

        // Reset party actions for next turn
        // Also reset rechargeFailed flag
        newParty = newParty.map(u => ({ ...u, hasActed: false, rechargeFailed: false }));

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

// Expose store for testing
if (typeof window !== 'undefined') {
    (window as any).useCombatStore = useCombatStore;
}
