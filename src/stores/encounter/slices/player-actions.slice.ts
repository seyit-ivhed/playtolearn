import type { StateCreator } from 'zustand';
import type { EncounterStore, PlayerActionsSlice } from '../interfaces';
import { EncounterPhase, type EncounterUnit } from '../../../types/encounter.types';
import { CombatEngine } from '../../../utils/battle/combat-engine';
import type { BattleUnit } from '../../../types/encounter.types';

export const createPlayerActionsSlice: StateCreator<EncounterStore, [], [], PlayerActionsSlice> = (set, get) => {

    const finalizeActionResult = (updatedUnits: EncounterUnit[]) => {
        const finalParty = updatedUnits.filter(u => u.isPlayer);
        const finalMonsters = updatedUnits.filter(u => !u.isPlayer);

        set(_state => ({
            party: finalParty,
            monsters: finalMonsters
        }));

        // Check Victory
        if (finalMonsters.every(m => m.isDead)) {
            setTimeout(() => {
                set(_state => ({
                    phase: EncounterPhase.VICTORY
                }));
            }, 1500);
            return;
        }

        // Check End Turn Condition (All living party members acted)
        if (finalParty.every(p => p.isDead || p.hasActed)) {
            get().endPlayerTurn();
        }
    };

    return {
        selectUnit: (unitId) => set({ selectedUnitId: unitId }),

        performAction: (unitId) => {
            const { party, monsters } = get();
            const unitIndex = party.findIndex(u => u.id === unitId);
            if (unitIndex === -1) return;

            const unit = party[unitIndex];
            if (unit.hasActed) return;

            // Mark acted and prepare updated set for the engine
            const actingUnit = { ...unit, hasActed: true };
            const updatedParty = [...party];
            updatedParty[unitIndex] = actingUnit;

            const allUnits = [...updatedParty, ...monsters];

            // Execute Standard Attack via Combat Engine
            const result = CombatEngine.executeStandardAttack(
                actingUnit as unknown as BattleUnit,
                allUnits as unknown as BattleUnit[]
            );

            finalizeActionResult(
                result.updatedTargets as unknown as EncounterUnit[]
            );
        },

        resolveSpecialAttack: (unitId, success) => {
            const { party, monsters } = get();
            const unitIndex = party.findIndex(u => u.id === unitId);
            if (unitIndex === -1) return;

            const unit = party[unitIndex];
            const abilityId = unit.specialAbilityId;
            const variables = unit.specialAbilityVariables || {};

            if (!abilityId) return;

            if (success) {
                // EXECUTE ABILITY LOGIC via CombatEngine
                const allUnits = [...party, ...monsters];

                const result = CombatEngine.executeSpecialAbility(
                    unit as unknown as BattleUnit,
                    allUnits as unknown as BattleUnit[],
                    abilityId,
                    variables
                );

                // Force reset spirit and acted for attacker in the result set
                const finalUnits = (result.updatedUnits as unknown as EncounterUnit[]).map(u => {
                    if (u.id === unitId) {
                        const consumed = CombatEngine.consumeSpiritCost(u as unknown as BattleUnit);
                        return { ...(consumed as unknown as EncounterUnit), hasActed: true };
                    }
                    return u;
                });

                finalizeActionResult(finalUnits);

            } else {
                // Fail: Drain meter AND Mark as Acted
                const updatedParty = party.map(u => {
                    if (u.id === unitId) {
                        const consumed = CombatEngine.consumeSpiritCost(u as unknown as BattleUnit);
                        return { ...(consumed as unknown as EncounterUnit), hasActed: true };
                    }
                    return u;
                });

                finalizeActionResult([...updatedParty, ...monsters]);
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
    };
};
