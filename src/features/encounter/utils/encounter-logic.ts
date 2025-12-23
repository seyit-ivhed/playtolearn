import type { EncounterUnit } from '../../../types/encounter.types';
import { getCompanionById } from '../../../data/companions.data';

/**
 * Determines the VFX type and target ID for a companion's special attack.
 */
export const getVFXDetails = (unitId: string, party: EncounterUnit[], monsters: EncounterUnit[]) => {
    const unit = party.find(u => u.id === unitId);
    if (!unit) return { type: 'Generic', targetId: undefined };

    const companion = getCompanionById(unit.templateId);
    const effectName = companion?.specialAbility?.id || 'Generic';

    let targetId: string | undefined;
    if (effectName === 'jaguar_strike' || companion?.specialAbility?.target === 'SINGLE_ENEMY') {
        const target = monsters.filter(m => !m.isDead)[0];
        if (target) {
            targetId = target.id;
        }
    }

    return { type: effectName, targetId };
};

/**
 * Checks if the encounter is effectively over (all monsters dead).
 */
export const checkIsEncounterOver = (monsters: EncounterUnit[]) => {
    return monsters.every(m => m.isDead);
};
