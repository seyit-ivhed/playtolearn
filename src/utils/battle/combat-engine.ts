import { applyDamage } from './damage.utils';
import { executeAbility } from '../../features/encounter/abilities/registry';

import type { BattleUnit } from '../../types/encounter.types';

import { processEffectTick } from '../../features/encounter/effects/registry';

export class CombatEngine {

    static tickStatusEffects<T extends BattleUnit>(units: T[]): T[] {
        return units.map(unit => ({
            ...unit,
            statusEffects: processEffectTick(unit.statusEffects)
        } as T));
    }

    static executeSpecialAbility<T extends BattleUnit>(
        attacker: T,
        allUnits: T[],
        abilityId: string,
        variables: Record<string, number> = {}
    ): { updatedUnits: T[] } {
        const result = executeAbility(abilityId, {
            attacker,
            allUnits,
            variables
        });

        return {
            updatedUnits: result.updatedUnits as T[]
        };
    }

    static executeStandardAttack<T extends BattleUnit>(
        attacker: T,
        targets: T[]
    ): { updatedTargets: T[] } {
        // Find target (different team, using pure utility)
        const targetIndex = CombatEngine.findFirstValidEnemy(attacker, targets);

        if (targetIndex === -1) return { updatedTargets: targets };

        const target = targets[targetIndex];
        const damage = attacker.damage || 0;

        const result = applyDamage(target, damage);

        const updatedTargets = targets.map((t, idx) =>
            idx === targetIndex ? result.unit : t
        );

        return { updatedTargets };
    }

    static processMonsterAction<T extends BattleUnit>(
        attacker: T,
        playerParty: T[]
    ): { updatedParty: T[] } {
        const livingParty = playerParty.filter(p => !p.isDead);

        if (livingParty.length === 0) return { updatedParty: playerParty };

        const targetIdx = CombatEngine.selectRandomTarget(livingParty);
        if (targetIdx === -1) return { updatedParty: playerParty };

        const target = livingParty[targetIdx];
        const damage = attacker.damage || 0;

        const result = applyDamage(target, damage);

        const updatedParty = playerParty.map(p =>
            p.id === target.id ? result.unit : p
        );

        return { updatedParty };
    }

    static regenerateSpirit<T extends BattleUnit>(units: T[]): T[] {
        return units.map(unit => {
            if (unit.isDead) return unit;
            return {
                ...unit,
                currentSpirit: Math.min(unit.maxSpirit, unit.currentSpirit + unit.spiritGain)
            } as T;
        });
    }

    static consumeSpiritCost<T extends BattleUnit>(unit: T): T {
        return {
            ...unit,
            currentSpirit: 0
        } as T;
    }

    static selectRandomTarget<T extends { isDead: boolean }>(
        targets: T[]
    ): number {
        const livingTargets = targets
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => !t.isDead);

        if (livingTargets.length === 0) return -1;

        const randomIndex = Math.floor(Math.random() * livingTargets.length);
        return livingTargets[randomIndex].i;
    }

    static findFirstValidEnemy<T extends { id: string, isPlayer: boolean, isDead: boolean }>(
        attacker: { id: string, isPlayer: boolean },
        targets: T[]
    ): number {
        return targets.findIndex(t =>
            !t.isDead &&
            t.id !== attacker.id &&
            t.isPlayer !== attacker.isPlayer
        );
    }
}
