import type { Companion, CompanionStats } from '../types/companion.types';
import { EXPERIENCE_CONFIG } from '../data/experience.data';
import { EncounterType, type Encounter } from '../types/adventure.types';
import type { EncounterResult } from '../stores/game/interfaces';

export const getStatsForLevel = (companion: Companion, level: number): CompanionStats => {
    if (!companion) {
        console.error('Companion is missing in getStatsForLevel');
        throw new Error('Companion is required');
    }
    if (typeof level !== 'number') {
        console.error(`Invalid level type: ${typeof level} in getStatsForLevel`);
        throw new Error('Level must be a number');
    }

    const scalingFactor = 1 + (level - 1) * EXPERIENCE_CONFIG.STAT_SCALING_FACTOR;

    const evolutionBonus: Partial<CompanionStats> = {
        maxHealth: 0,
        abilityDamage: 0
    };

    const currentEvolution = companion.evolutions
        .filter(evo => level >= evo.atLevel)
        .sort((a, b) => b.atLevel - a.atLevel)[0];

    if (currentEvolution && currentEvolution.statsBonus) {
        evolutionBonus.maxHealth = currentEvolution.statsBonus.maxHealth || 0;
        evolutionBonus.abilityDamage = currentEvolution.statsBonus.abilityDamage || 0;
    }

    let evolvedAbility = companion.specialAbility;
    companion.evolutions.forEach(evo => {
        if (level >= evo.atLevel && evo.newSpecialAbility) {
            evolvedAbility = evo.newSpecialAbility;
        }
    });

    const scaledVariables: Record<string, number> = {};
    if (evolvedAbility.variables) {
        Object.entries(evolvedAbility.variables).forEach(([key, value]) => {
            if (key === 'duration' || key === 'reduction') {
                scaledVariables[key] = value;
            } else {
                scaledVariables[key] = Math.floor(value * scalingFactor);
            }
        });
    }

    return {
        maxHealth: Math.floor(companion.baseStats.maxHealth * scalingFactor) + (evolutionBonus.maxHealth || 0),
        title: currentEvolution ? currentEvolution.title : companion.title,
        abilityDamage: companion.baseStats.abilityDamage ? Math.floor(companion.baseStats.abilityDamage * scalingFactor) + (evolutionBonus.abilityDamage || 0) : undefined,
        attackSound: companion.baseStats.attackSound,
        specialAbilityId: evolvedAbility.id,
        specialAbilityVariables: scaledVariables,
        specialAbilitySound: evolvedAbility.soundEffect,
        evolutionIndex: currentEvolution ? currentEvolution.evolutionIndex : companion.baseStats.evolutionIndex
    };
};


export const getEvolutionAtLevel = (companion: Companion, level: number) => {
    return companion.evolutions.find(e => e.atLevel === level);
};

export const calculateAdventureStars = (
    adventureId: string,
    encounters: Encounter[],
    encounterResults: Record<string, EncounterResult>
): number => {
    if (!adventureId) {
        console.error('adventureId is missing in calculateAdventureStars');
        return 0;
    }
    if (!encounters) {
        console.error('encounters missing in calculateAdventureStars');
        return 0;
    }
    if (!encounterResults) {
        console.error('encounterResults missing in calculateAdventureStars');
        return 0;
    }

    let minStars = 3;
    let hasScorableEncounters = false;

    encounters.forEach((encounter, index) => {
        if (encounter.type === EncounterType.BATTLE ||
            encounter.type === EncounterType.BOSS ||
            encounter.type === EncounterType.PUZZLE) {

            hasScorableEncounters = true;
            const encounterKey = `${adventureId}_${index + 1}`;
            const result = encounterResults[encounterKey];

            const stars = result ? result.stars : 0;
            if (stars < minStars) {
                minStars = stars;
            }
        }
    });

    return hasScorableEncounters ? minStars : 0;
};

export const canEarnExperience = (currentLevel: number, adventureMaxLevel: number): boolean => {
    return currentLevel < adventureMaxLevel;
};
