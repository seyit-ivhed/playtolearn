import type { StateCreator } from 'zustand';
import type { EncounterStore, PlayerActionsSlice } from '../interfaces';
import { EncounterPhase, type EncounterUnit } from '../../../types/encounter.types';
import { CombatEngine, type BattleUnit } from '../../../utils/battle/combat-engine';
import type { SpecialAbility } from '../../../types/companion.types';

export const createPlayerActionsSlice: StateCreator<EncounterStore, [], [], PlayerActionsSlice> = (set, get) => ({
    selectUnit: (unitId) => set({ selectedUnitId: unitId }),

    performAction: (unitId) => {
        const { party, monsters } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];

        if (unit.hasActed) return;

        // consume energy & mark acted
        const newParty = [...party];
        newParty[unitIndex] = { ...unit, hasActed: true };
        set({ party: newParty });

        // Execute Standard Attack via Combat Engine
        // (Assuming performAction is always standard attack for now as per previous logic)
        // Previous logic called performWarriorAction which did damage.

        const allUnits = [...newParty, ...monsters];
        const result = CombatEngine.executeStandardAttack(
            unit as unknown as BattleUnit,
            allUnits as unknown as BattleUnit[]
        );

        // Update State
        const updatedLogs = result.logs.map(l => l.message);
        set(state => ({
            encounterLog: [...state.encounterLog, ...updatedLogs]
        }));

        // Split results back
        const resultUnits = result.updatedTargets as unknown as EncounterUnit[];
        const finalParty = resultUnits.filter(u => u.isPlayer);
        const finalMonsters = resultUnits.filter(u => !u.isPlayer);

        set({
            party: finalParty,
            monsters: finalMonsters
        });

        // Check Victory
        if (finalMonsters.every(m => m.isDead)) {
            setTimeout(() => {
                set({ phase: EncounterPhase.VICTORY, encounterLog: [...get().encounterLog, 'Victory!'] });
            }, 1500);
            return;
        }

        // Check End Turn Condition (All living party members acted)
        // Use latest state
        const currentParty = get().party;
        const allActed = currentParty.every(p => p.isDead || p.hasActed);
        if (allActed) {
            get().endPlayerTurn();
        }
    },

    resolveSpecialAttack: (unitId, success) => {
        const { party, monsters } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        // Construct ability object with fallbacks
        // Note: unit.specialAbilityTarget should be populated now, but we keep fallback logic just in case for older saves/states (though state resets on reload)
        const abilityId = unit.specialAbilityId || 'attack';
        const abilityType = unit.specialAbilityType || 'DAMAGE';
        const abilityValue = unit.specialAbilityValue || 10;
        const abilityTarget = unit.specialAbilityTarget ||
            (unit.templateId === 'amara' && unit.specialAbilityId === 'twin_shadows' ? 'ALL_ENEMIES' : 'SINGLE_ENEMY');

        const inputAbility: SpecialAbility = {
            id: abilityId,
            type: abilityType,
            value: abilityValue,
            target: abilityTarget
        };

        if (success) {
            // EXECUTE ABILITY LOGIC via CombatEngine
            const allUnits = [...party, ...monsters];

            const result = CombatEngine.executeSpecialAbility(
                unit as unknown as BattleUnit,
                allUnits as unknown as BattleUnit[],
                inputAbility,
                abilityValue
            );

            // Map logs
            const updatedLogs = result.logs.map(l => l.message);

            // Update State
            // Note: consume charge & mark acted is handled manually below because CombatEngine is pure 
            // and doesn't know about "consuming charge" mechanic specifically for the UI state flow (Unit state update)
            // ACTUALLY CombatEngine updates unit state if we pass it, but specific "Acted" flag management might be UI specific?
            // CombatEngine result uses the units passed in.
            // We need to ensure the attacker has spirit 0 and hasActed = true.

            let finalUnits = result.updatedUnits as unknown as EncounterUnit[];

            // Force reset spirit and acted for attacker in the result set
            finalUnits = finalUnits.map(u => {
                if (u.id === unitId) {
                    const consumed = CombatEngine.consumeSpiritCost(u as unknown as BattleUnit);
                    return { ...(consumed as unknown as EncounterUnit), hasActed: true };
                }
                return u;
            });

            const finalParty = finalUnits.filter(u => u.isPlayer);
            const finalMonsters = finalUnits.filter(u => !u.isPlayer);

            set(state => ({
                party: finalParty,
                monsters: finalMonsters,
                encounterLog: [...state.encounterLog, ...updatedLogs]
            }));

            // Check Victory
            if (finalMonsters.every(m => m.isDead)) {
                setTimeout(() => {
                    set({ phase: EncounterPhase.VICTORY, encounterLog: [...get().encounterLog, 'Victory!'] });
                }, 1500);
                return;
            }

            // Check End Turn Condition
            if (finalParty.every(p => p.isDead || p.hasActed)) {
                get().endPlayerTurn();
            }

        } else {
            // Fail: Drain meter AND Mark as Acted
            const currentParty = get().party;
            const currentUnitIndex = currentParty.findIndex(u => u.id === unitId);

            if (currentUnitIndex !== -1) {
                const newParty = [...currentParty];
                const consumed = CombatEngine.consumeSpiritCost(newParty[currentUnitIndex] as unknown as BattleUnit);
                newParty[currentUnitIndex] = { ...(consumed as unknown as EncounterUnit), hasActed: true };
                set({
                    party: newParty,
                    encounterLog: [...get().encounterLog, `${unit.name}'s ability FAILED! Charge lost.`]
                });
            }

            // Check End Turn Condition
            if (get().party.every(p => p.isDead || p.hasActed)) {
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
