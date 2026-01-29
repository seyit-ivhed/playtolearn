import { type BattleUnit } from '../../../types/encounter.types';
import { applyDamage } from '../../../utils/battle/damage.utils';
import { type EncounterUnit } from '../../../types/encounter.types';

export function applyDamageEffect(
    units: BattleUnit[],
    targetType: 'SINGLE_ENEMY' | 'ALL_ENEMIES',
    value: number
): { updatedUnits: BattleUnit[] } {
    let targets: BattleUnit[] = [];
    const enemies = units.filter(u => !u.isPlayer && !u.isDead);

    if (targetType === 'SINGLE_ENEMY') {
        const firstEnemy = enemies[0];
        if (firstEnemy) targets = [firstEnemy];
    } else {
        targets = enemies;
    }

    const updatedUnits = units.map(u => {
        const isTarget = targets.some(t => t.id === u.id);
        if (isTarget) {
            const { unit: updated } = applyDamage(u as EncounterUnit, value);
            return updated as BattleUnit;
        }
        return u;
    });

    return { updatedUnits };
}

