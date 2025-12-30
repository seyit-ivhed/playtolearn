import type { SpecialAbility } from '../../types/companion.types';
import type { EncounterUnit } from '../../types/encounter.types';
import { applyDamage } from './damage.utils';
import { executeDamageAbility, executeHealAbility, executeShieldAbility, type HealableUnit, type ShieldableUnit } from './ability.utils';
import { findFirstLivingTarget, selectRandomTarget } from './combat.utils';

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

    // Stats
    maxSpirit: number;
    currentSpirit: number;
    spiritGain: number;

    // State
    hasActed: boolean;
    statusEffects?: any[]; // Simplified for now
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
            const targets = enemies as any as EncounterUnit[];
            const result = executeDamageAbility(targets, ability, abilityValue);

            // Map results back to updatedUnits
            updatedUnits = updatedUnits.map(u => {
                if (u.isPlayer) return u;
                const updated = result.find(t => t.id === u.id);
                return updated ? (updated as any as BattleUnit) : u;
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

        // Find target
        const livingTargets = targets.filter(t => !t.isDead);
        if (livingTargets.length === 0) return { updatedTargets: targets, logs };

        // Simple targeting: First living target
        // (Encounters might want random, this is default logic mostly for Player vs Monster 1st slot)
        // For monsters attacking players, we usually use random.
        // Let's standardise: if multiple, pick first (usually tank/frontline concept) or provide target selection logic?
        // UI currently uses `findFirstLivingTarget` for players.

        const targetIndex = livingTargets.findIndex(t => !t.isDead); // First living
        if (targetIndex === -1) return { updatedTargets: targets, logs };

        const target = livingTargets[targetIndex];
        const damage = attacker.damage || 0;

        const result = applyDamage(target as any as EncounterUnit, damage);

        logs.push({
            message: `${attacker.name} attacked ${target.name} for ${result.damageDealt}`,
            type: 'ATTACK'
        });

        const updatedTargets = targets.map(t =>
            t.id === target.id ? (result.unit as any as BattleUnit) : t
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

        const targetIdx = selectRandomTarget(livingParty);
        if (targetIdx === -1) return { updatedParty: playerParty, logs };

        const target = livingParty[targetIdx];
        const damage = attacker.damage || 0;

        const result = applyDamage(target as any as EncounterUnit, damage);

        logs.push({
            message: `${attacker.name} attacked ${target.name} for ${result.damageDealt}!`,
            type: 'ATTACK'
        });

        const updatedParty = playerParty.map(p =>
            p.id === target.id ? (result.unit as any as BattleUnit) : p
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
                .map((se: any) => ({ ...se, duration: se.duration - 1 }))
                .filter((se: any) => se.duration > 0);

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
}
