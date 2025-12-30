import type { Companion, CompanionStats } from '../types/companion.types';
import { EncounterType, type Encounter } from '../types/adventure.types';
import type { EncounterResult } from '../stores/game/interfaces';

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
    const evolutionBonus: CompanionStats = {
        maxHealth: 0,
        abilityDamage: 0
    };

    // Keep track of the latest evolution milestone reached
    let currentEvolution = companion.evolutions
        .filter(evo => level >= evo.atLevel)
        .sort((a, b) => b.atLevel - a.atLevel)[0];

    // Build the evolved ability (checking all steps)
    let evolvedAbility = companion.specialAbility;
    companion.evolutions.forEach(evo => {
        if (level >= evo.atLevel && evo.newSpecialAbility) {
            evolvedAbility = evo.newSpecialAbility;
        }
    });

    const baseAbilityValue = evolvedAbility.value;

    return {
        maxHealth: Math.floor(companion.baseStats.maxHealth * scalingFactor) + (evolutionBonus.maxHealth || 0),
        title: currentEvolution ? currentEvolution.title : companion.title,
        abilityDamage: companion.baseStats.abilityDamage ? Math.floor(companion.baseStats.abilityDamage * scalingFactor) + (evolutionBonus.abilityDamage || 0) : undefined,
        specialAbilityId: evolvedAbility.id,
        specialAbilityType: evolvedAbility.type,
        specialAbilityValue: baseAbilityValue ? Math.floor(baseAbilityValue * scalingFactor) : undefined,
        spiritGain: companion.baseStats.spiritGain,
    };
};

// XP Formula Constants
const BASE_XP_REQUIREMENT = 30;
const XP_SCALING_EXPONENT = 1.5;

export const getXpForNextLevel = (currentLevel: number): number => {
    return Math.floor(BASE_XP_REQUIREMENT * Math.pow(currentLevel, XP_SCALING_EXPONENT));
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

/**
 * Calculates the overall star rating for an adventure based on its scorable encounters.
 * The chapter stars are designated by the encounter with the least stars.
 */
export const calculateAdventureStars = (
    adventureId: string,
    encounters: Encounter[],
    encounterResults: Record<string, EncounterResult>
): number => {
    let minStars = 5;
    let hasScorableEncounters = false;

    encounters.forEach((encounter, index) => {
        // Only count Battle, Boss, and Puzzle encounters
        if (encounter.type === EncounterType.BATTLE ||
            encounter.type === EncounterType.BOSS ||
            encounter.type === EncounterType.PUZZLE) {

            hasScorableEncounters = true;
            const encounterKey = `${adventureId}_${index + 1}`;
            const result = encounterResults[encounterKey];

            // If any encounter is not completed or has 0 stars, the chapter stars will be low
            const stars = result ? result.stars : 0;
            if (stars < minStars) {
                minStars = stars;
            }
        }
    });

    return hasScorableEncounters ? minStars : 0;
};