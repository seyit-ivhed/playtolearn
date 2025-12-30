import type { StateCreator } from 'zustand';
import type { EncounterStore, PlayerActionsSlice } from '../interfaces';
import { EncounterPhase } from '../../../types/encounter.types';
import { getCompanionById } from '../../../data/companions.data';

import { performWarriorAction } from '../actions/standard/warrior.action';
// ... (rest of imports)
import { executeDamageAbility } from '../actions/special/damage.ability';
import { executeShieldAbility } from '../actions/special/shield.ability';
import { executeHealAbility } from '../actions/special/heal.ability';

export const createPlayerActionsSlice: StateCreator<EncounterStore, [], [], PlayerActionsSlice> = (set, get) => ({
    selectUnit: (unitId) => set({ selectedUnitId: unitId }),

    performAction: (unitId) => {
        const { party } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];

        // Get Ability Data
        const companionData = getCompanionById(unit.templateId);

        if (unit.hasActed) return;

        // consume energy & mark acted
        const newParty = [...party];
        newParty[unitIndex] = { ...unit, hasActed: true };
        set({ party: newParty }); // Commit early state change for UI responsiveness if needed, but we mostly overwrite later or inside actions

        let actionLog = '';

        // Apply Effects
        if (companionData.role === 'WARRIOR') {
            actionLog = performWarriorAction(get, set, unitIndex, 1);
        }

        if (actionLog) {
            set(state => ({
                encounterLog: [...state.encounterLog, `${unit.name} used Ability!${actionLog}`]
            }));
        }

        // Check Victory
        if (get().monsters.every(m => m.isDead)) {
            setTimeout(() => {
                set({ phase: EncounterPhase.VICTORY, encounterLog: [...get().encounterLog, 'Victory!'] });
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
        const { party } = get();
        const unitIndex = party.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;

        const unit = party[unitIndex];
        const abilityId = unit.specialAbilityId || 'attack';
        const abilityType = unit.specialAbilityType || 'DAMAGE';
        const abilityValue = unit.specialAbilityValue || 10;

        let logs: string[] = [];

        if (success) {
            logs.push(`${unit.name} cast ${abilityId}!`);

            // EXECUTE ABILITY LOGIC
            let abilityLogs: string[] = [];

            // Re-wrap into a SpecialAbility-like object for existing action functions if needed,
            // or update them. For now, we wrap to minimize downstream changes.
            const abilityData = {
                id: abilityId,
                type: abilityType,
                value: abilityValue,
                target: (unit.templateId === 'amara' && unit.specialAbilityId === 'twin_shadows') ? 'ALL_ENEMIES' : 'SINGLE_ENEMY' // Simplified for MVP
            } as any;

            if (abilityType === 'DAMAGE') {
                abilityLogs = executeDamageAbility(get, set, unitId, abilityData);
            } else if (abilityType === 'SHIELD') {
                abilityLogs = executeShieldAbility(get, set, unitId, abilityData);
            } else if (abilityType === 'HEAL') {
                abilityLogs = executeHealAbility(get, set, unitId, abilityData);
            }
            logs = [...logs, ...abilityLogs];

            // Consume Charge (Reset to 0) AND Mark as Acted
            // Need to re-fetch party in case it was modified by ability logic actions
            const currentParty = get().party;
            const currentUnitIndex = currentParty.findIndex(u => u.id === unitId);
            if (currentUnitIndex !== -1) {
                const newParty = [...currentParty];
                newParty[currentUnitIndex] = { ...newParty[currentUnitIndex], currentSpirit: 0, hasActed: true };
                set({ party: newParty });
            }

            set(state => ({
                encounterLog: [...state.encounterLog, ...logs]
            }));

            // Check Victory
            if (get().monsters.every(m => m.isDead)) {
                setTimeout(() => {
                    set({ phase: EncounterPhase.VICTORY, encounterLog: [...get().encounterLog, 'Victory!'] });
                }, 1500);
                return;
            }

            // Check End Turn Condition
            if (get().party.every(p => p.isDead || p.hasActed)) {
                get().endPlayerTurn();
            }

        } else {
            // Fail: Drain meter AND Mark as Acted
            const currentParty = get().party;
            const currentUnitIndex = currentParty.findIndex(u => u.id === unitId);

            if (currentUnitIndex !== -1) {
                const newParty = [...currentParty];
                newParty[currentUnitIndex] = { ...newParty[currentUnitIndex], currentSpirit: 0, hasActed: true };
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
