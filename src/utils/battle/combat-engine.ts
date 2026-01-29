import type { EncounterUnit } from '../../types/encounter.types';
import { applyDamage } from './damage.utils';
import { executeAbility } from '../../features/encounter/abilities/registry';

/**
 * Unified Combat Engine
 * Source of truth for all battle mechanics (Simulation & UI)
 */

import type { BattleUnit } from '../../types/encounter.types';

import { processEffectTick } from '../../features/encounter/effects/registry';

export class CombatEngine {

    /**
     * Ticks status effects for all units in the array
     */
    static tickStatusEffects(units: BattleUnit[]): BattleUnit[] {
        return units.map(unit => ({
            ...unit,
            statusEffects: processEffectTick(unit.statusEffects)
        }));
    }

    /**
     * Execute a specific ability from an attacker
     */
    static executeSpecialAbility(
        attacker: BattleUnit,
        allUnits: BattleUnit[],
        abilityId: string,
        variables: Record<string, number> = {}
    ): { updatedUnits: BattleUnit[] } {
        const result = executeAbility(abilityId, {
            attacker,
            allUnits,
            variables
        });

        return {
            updatedUnits: result.updatedUnits
        };
    }

    /**
     * Execute a standard attack
     */
    static executeStandardAttack(
        attacker: BattleUnit,
        targets: BattleUnit[]
    ): { updatedTargets: BattleUnit[] } {
        // Find target (different team, using pure utility)
        const targetIndex = CombatEngine.findFirstValidEnemy(attacker, targets);

        if (targetIndex === -1) return { updatedTargets: targets };

        const target = targets[targetIndex];
        const damage = attacker.damage || 0;

        const result = applyDamage(target as EncounterUnit, damage);

        const updatedTargets = targets.map(t =>
            t.id === target.id ? (result.unit as BattleUnit) : t
        );

        return { updatedTargets };
    }

    /**
     * Process a monster's turn
     * - Random target selection
     * - Attack execution
     */
    static processMonsterAction(
        attacker: BattleUnit,
        playerParty: BattleUnit[]
    ): { updatedParty: BattleUnit[] } {
        const livingParty = playerParty.filter(p => !p.isDead);

        if (livingParty.length === 0) return { updatedParty: playerParty };

        const targetIdx = CombatEngine.selectRandomTarget(livingParty);
        if (targetIdx === -1) return { updatedParty: playerParty };

        const target = livingParty[targetIdx];
        const damage = attacker.damage || 0;

        const result = applyDamage(target as EncounterUnit, damage);

        const updatedParty = playerParty.map(p =>
            p.id === target.id ? (result.unit as BattleUnit) : p
        );

        return { updatedParty };
    }

    /**
     * Regenerate spirit for units
     */
    static regenerateSpirit(units: BattleUnit[]): BattleUnit[] {
        return units.map(unit => {
            if (unit.isDead) return unit;
            return {
                ...unit,
                currentSpirit: Math.min(unit.maxSpirit, unit.currentSpirit + unit.spiritGain)
            };
        });
    }

    /**
     * Consume ability cost (spirit)
     */
    static consumeSpiritCost(unit: BattleUnit): BattleUnit {
        return {
            ...unit,
            currentSpirit: 0
        };
    }

    /**
     * Select random living target from array
     */
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

    /**
     * Find first valid enemy target (alive, different team, not self)
     */
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
