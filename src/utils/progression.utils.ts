import type { Companion, CompanionStats } from '../types/companion.types';

/**
 * Calculates the stats for a companion at a specific level.
 * @param companion The companion to calculate stats for
 * @param level The target level
 * @returns Calculated CompanionStats
 */
export const getStatsForLevel = (companion: Companion, level: number): CompanionStats => {
    // Basic linear scaling for now: 10% increase per level from base
    const scalingFactor = 1 + (level - 1) * 0.1;

    // Check for evolutions up to this level
    let evolutionBonus: CompanionStats = {
        maxHealth: 0,
        abilityDamage: 0
    };

    companion.evolutions.forEach(evo => {
        if (level >= evo.atLevel && evo.statsBonus) {
            if (evo.statsBonus.maxHealth) evolutionBonus.maxHealth = (evolutionBonus.maxHealth || 0) + evo.statsBonus.maxHealth;
            if (evo.statsBonus.abilityDamage) evolutionBonus.abilityDamage = (evolutionBonus.abilityDamage || 0) + evo.statsBonus.abilityDamage;
        }
    });

    return {
        maxHealth: Math.floor(companion.baseStats.maxHealth * scalingFactor) + (evolutionBonus.maxHealth || 0),
        abilityDamage: companion.baseStats.abilityDamage ? Math.floor(companion.baseStats.abilityDamage * scalingFactor) + (evolutionBonus.abilityDamage || 0) : undefined,
        specialAbilityValue: companion.specialAbility.value ? Math.floor(companion.specialAbility.value * scalingFactor) : undefined,
    };
};

export const getXpForNextLevel = (currentLevel: number): number => {
    // New curve: starts fast, takes longer over time
    // Level 1 -> 2: 15 XP
    // Level 9 -> 10: 235 XP
    // Total for Level 10: ~1053 XP
    return Math.floor(15 * Math.pow(currentLevel, 1.25));
};

export const getEvolutionAtLevel = (companion: Companion, level: number) => {
    // Find the highest evolution milestone passed
    // But usually we just want to know if there is a NEW evolution at this specific level
    return companion.evolutions.find(e => e.atLevel === level);
};

export const getCurrentEvolution = (companion: Companion, level: number) => {
    // Get the latest applied evolution
    const sortedEvos = [...companion.evolutions].sort((a, b) => b.atLevel - a.atLevel);
    return sortedEvos.find(e => level >= e.atLevel);
};



