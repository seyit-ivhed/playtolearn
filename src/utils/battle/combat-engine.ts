import type { SpecialAbility } from '../../types/companion.types';
import type { EncounterUnit, StatusEffect } from '../../types/encounter.types';
import { applyDamage, getTargetDamageMultiplier } from './damage.utils';
import { executeDamageAbility, executeHealAbility, executeShieldAbility, type HealableUnit, type ShieldableUnit } from './ability.utils';

/**
 * Unified Combat Engine
 * Source of truth for all battle mechanics (Simulation & UI)
 */

export interface CombatLog {
    message: string;
    type: 'ATTACK' | 'ABILITY' | 'EFFECT' | 'INFO';
}

export interface TurnResult {
    updatedUnits: EncounterUnit[];
    logs: CombatLog[];
    victory?: boolean;
    defeat?: boolean;
}

// Generic interface to cover both EncounterUnit and SimulationUnit
export interface BattleUnit extends HealableUnit, ShieldableUnit {
    id: string;
    templateId: string;
    name: string;
    isPlayer: boolean;
    damage?: number;
    maxShield: number;

    // Stats
    maxSpirit: number;
    currentSpirit: number;
    spiritGain: number;

    // State
    hasActed: boolean;
    statusEffects: StatusEffect[]; // Simplified for now
}

export class CombatEngine {

    /**
     * Execute a specific ability from an attacker
     */
    static executeSpecialAbility(
        attacker: BattleUnit,
        allUnits: BattleUnit[],
        ability: SpecialAbility,
        abilityValue: number
    ): { updatedUnits: BattleUnit[], logs: CombatLog[] } {
        const logs: CombatLog[] = [];
        logs.push({ message: `${attacker.name} used ${ability.id}!`, type: 'ABILITY' });

        let updatedUnits = [...allUnits];

        // Filter targets based on ability target type
        const enemies = updatedUnits.filter(u => !u.isPlayer && !u.isDead);
        const allies = updatedUnits.filter(u => u.isPlayer && !u.isDead);

        // We cast to any to satisfy the utility functions which might expect slightly different types
        // but are structurally compatible for the fields they use.
        // In a strict refactor, we would unify the Unit interfaces completely.

        if (ability.type === 'DAMAGE') {
            const targets = enemies as unknown as EncounterUnit[];
            const result = executeDamageAbility(targets, ability, abilityValue);

            // Map results back to updatedUnits
            updatedUnits = updatedUnits.map(u => {
                if (u.isPlayer) return u;
                const updated = result.find(t => t.id === u.id);
                return updated ? (updated as unknown as BattleUnit) : u;
            });

            // Generate logs
            // Ideally executeDamageAbility would return logs, but for now we infer
            updatedUnits.filter(u => !u.isPlayer).forEach(u => {
                const prev = allUnits.find(p => p.id === u.id);
                if (prev && prev.currentHealth > u.currentHealth) {
                    logs.push({
                        message: `Dealt ${prev.currentHealth - u.currentHealth} damage to ${u.name}`,
                        type: 'ATTACK'
                    });
                }
            });

        } else if (ability.type === 'HEAL') {
            const targets = allies;
            const result = executeHealAbility(targets, ability, abilityValue);

            updatedUnits = updatedUnits.map(u => {
                if (!u.isPlayer) return u;
                const updated = result.find(t => t.id === u.id);
                return updated ? (updated as BattleUnit) : u;
            });

            logs.push({ message: `Healed allies for ${abilityValue}`, type: 'EFFECT' });

        } else if (ability.type === 'SHIELD') {
            const targets = allies;
            const result = executeShieldAbility(targets, ability, abilityValue);

            updatedUnits = updatedUnits.map(u => {
                if (!u.isPlayer) return u;
                const updated = result.find(t => t.id === u.id);
                return updated ? (updated as BattleUnit) : u;
            });

            logs.push({ message: `Shielded allies for ${abilityValue}`, type: 'EFFECT' });
        }

        return { updatedUnits, logs };
    }

    /**
     * Execute a standard attack
     */
    static executeStandardAttack(
        attacker: BattleUnit,
        targets: BattleUnit[]
    ): { updatedTargets: BattleUnit[], logs: CombatLog[] } {
        const logs: CombatLog[] = [];

        // Find target (different team, using pure utility)
        const targetIndex = CombatEngine.findFirstValidEnemy(attacker, targets);

        if (targetIndex === -1) return { updatedTargets: targets, logs };

        const target = targets[targetIndex];
        const damage = attacker.damage || 0;
        const multiplier = getTargetDamageMultiplier(target as unknown as EncounterUnit);
        const finalDamage = Math.floor(damage * multiplier);

        const result = applyDamage(target as unknown as EncounterUnit, finalDamage);

        logs.push({
            message: `${attacker.name} attacked ${target.name} for ${result.damageDealt} damage!`,
            type: 'ATTACK'
        });

        const updatedTargets = targets.map(t =>
            t.id === target.id ? (result.unit as unknown as BattleUnit) : t
        );

        return { updatedTargets, logs };
    }

    /**
     * Process a monster's turn
     * - Random target selection
     * - Attack execution
     */
    static processMonsterAction(
        attacker: BattleUnit,
        playerParty: BattleUnit[]
    ): { updatedParty: BattleUnit[], logs: CombatLog[] } {
        const logs: CombatLog[] = [];
        const livingParty = playerParty.filter(p => !p.isDead);

        if (livingParty.length === 0) return { updatedParty: playerParty, logs };

        const targetIdx = CombatEngine.selectRandomTarget(livingParty);
        if (targetIdx === -1) return { updatedParty: playerParty, logs };

        const target = livingParty[targetIdx];
        const damage = attacker.damage || 0;
        const multiplier = getTargetDamageMultiplier(target as unknown as EncounterUnit);
        const finalDamage = Math.floor(damage * multiplier);

        const result = applyDamage(target as unknown as EncounterUnit, finalDamage);

        logs.push({
            message: `${attacker.name} attacked ${target.name} for ${result.damageDealt} damage!`,
            type: 'ATTACK'
        });

        const updatedParty = playerParty.map(p =>
            p.id === target.id ? (result.unit as unknown as BattleUnit) : p
        );

        return { updatedParty, logs };
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
     * Process turn start for units (status effects)
     */
    static processTurnStart(units: BattleUnit[]): BattleUnit[] {
        return units.map(unit => {
            if (unit.isDead || !unit.statusEffects) return unit;

            // Decrement duration and filter expired
            const newEffects = unit.statusEffects
                .map(se => ({ ...se, duration: se.duration - 1 }))
                .filter(se => se.duration > 0);

            return {
                ...unit,
                statusEffects: newEffects
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
     * Get damage multiplier based on unit status effects
     */
    static getTargetDamageMultiplier(unit: EncounterUnit): number {
        return getTargetDamageMultiplier(unit);
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
