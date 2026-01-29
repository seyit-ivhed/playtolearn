import { EXPERIENCE_CONFIG, getRequiredXpForNextLevel } from '../src/data/experience.data';

/**
 * Script to calculate how many encounters it takes to reach the maximum level 
 * based on the current configuration in experience.data.ts.
 */
function calculateEncountersToMaxLevel() {
    let level = 1;
    let currentXp = 0;
    let totalEncounters = 0;
    let totalXpEarned = 0;

    console.log('# Progression Calculation to Max Level');
    console.log(`- Base XP: ${EXPERIENCE_CONFIG.XP_BASE}`);
    console.log(`- XP Coefficient: ${EXPERIENCE_CONFIG.XP_COEFFICIENT}`);
    console.log(`- Max Level: ${EXPERIENCE_CONFIG.MAX_LEVEL}`);
    console.log(`- Reward per Encounter: ${EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD} XP\n`);

    console.log('| Level Reached | Total Encounters | Total XP Earned | Surplus XP |');
    console.log('|---------------|------------------|-----------------|------------|');

    while (level < EXPERIENCE_CONFIG.MAX_LEVEL) {
        totalEncounters++;
        totalXpEarned += EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD;
        currentXp += EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD;

        let nextLevelCost = getRequiredXpForNextLevel(level);

        let leveledUpThisStep = false;
        while (nextLevelCost > 0 && currentXp >= nextLevelCost) {
            currentXp -= nextLevelCost;
            level++;
            nextLevelCost = getRequiredXpForNextLevel(level);
            leveledUpThisStep = true;
        }

        if (leveledUpThisStep || level === EXPERIENCE_CONFIG.MAX_LEVEL) {
            console.log(`| ${level.toString().padEnd(13)} | ${totalEncounters.toString().padEnd(16)} | ${totalXpEarned.toString().padEnd(15)} | ${currentXp.toString().padEnd(10)} |`);
        }
    }

    console.log(`\nFinal Result: It takes **${totalEncounters}** encounters to reach level **${EXPERIENCE_CONFIG.MAX_LEVEL}**.`);
}

calculateEncountersToMaxLevel();
