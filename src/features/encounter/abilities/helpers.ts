import { type BattleUnit, type CombatLog } from '../../../types/encounter.types';
import { applyDamage } from '../../../utils/battle/damage.utils';
import { type EncounterUnit } from '../../../types/encounter.types';

export function applyDamageEffect(
    units: BattleUnit[],
    targetType: 'SINGLE_ENEMY' | 'ALL_ENEMIES',
    value: number
): { updatedUnits: BattleUnit[], logs: CombatLog[] } {
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
            const { unit: updated } = applyDamage(u as unknown as EncounterUnit, value);
            return updated as unknown as BattleUnit;
        }
        return u;
    });

    const logs: CombatLog[] = [];
    updatedUnits.forEach(u => {
        const prev = units.find(p => p.id === u.id);
        if (prev && prev.currentHealth > u.currentHealth && !u.isPlayer) {
            logs.push({
                message: `Dealt ${prev.currentHealth - u.currentHealth} damage to ${u.name}`,
                type: 'ATTACK'
            });
        }
    });

    return { updatedUnits, logs };
}

