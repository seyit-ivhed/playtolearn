import * as fs from 'fs';
import * as path from 'path';
import { ADVENTURES } from '../src/data/adventures.data';
import { getRequiredXpForNextLevel, EXPERIENCE_CONFIG } from '../src/data/experience.data';
import { EncounterType } from '../src/types/adventure.types';
import { canEarnExperience } from '../src/utils/progression.utils';
import type { AdventureSimulationConfig } from '../src/utils/simulation/simulation.types';

// Types
interface SimCompanion {
    id: string;
    level: number;
    currentXp: number;
}

/**
 * Simulates leveling up a companion based on gained XP.
 * Returns the updated companion state.
 */
function addXpToCompanion(companion: SimCompanion, amount: number): SimCompanion {
    let { level, currentXp } = companion;
    currentXp += amount;

    let nextLevelCost = getRequiredXpForNextLevel(level);

    // Level up loop
    while (nextLevelCost > 0 && currentXp >= nextLevelCost) {
        currentXp -= nextLevelCost;
        level++;
        nextLevelCost = getRequiredXpForNextLevel(level);
    }

    return { ...companion, level, currentXp };
}

export async function runAnalysis() {
    const party: SimCompanion[] = [
        { id: 'amara', level: 1, currentXp: 0 },
        { id: 'tariq', level: 1, currentXp: 0 },
    ];

    const adventureConfigs: AdventureSimulationConfig[] = [];

    console.log('# Companion Progression Analysis\n');
    console.log('| Adventure | Encounter | Type | Max Lvl | Party Levels | XP Blocked |');
    console.log('|---|---|---|---|---|---|');

    for (const adventure of ADVENTURES) {
        const advConfig: AdventureSimulationConfig = {
            adventureId: adventure.id,
            encounters: {}
        };

        for (const encounter of adventure.encounters) {
            if (encounter.unlocksCompanion && !party.find(c => c.id === encounter.unlocksCompanion)) {
                party.push({ id: encounter.unlocksCompanion, level: 1, currentXp: 0 });
            }

            const isXpGranting = encounter.type === EncounterType.BATTLE ||
                encounter.type === EncounterType.BOSS;

            const isScorable = isXpGranting || encounter.type === EncounterType.PUZZLE;

            if (isScorable) {
                const xpReward = isXpGranting ? EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD : 0;
                const maxLevel = adventure.levelRange?.[1] || EXPERIENCE_CONFIG.MAX_LEVEL;

                // Track which companions are blocked
                const blockedCompanions: string[] = [];

                // Record level BEFORE XP distribution
                const partyBefore = party.map(c => ({
                    companionId: c.id,
                    level: c.level
                }));

                // Distribute XP to all eligible companions
                for (let i = 0; i < party.length; i++) {
                    if (canEarnExperience(party[i].level, maxLevel)) {
                        party[i] = addXpToCompanion(party[i], xpReward);
                    } else {
                        blockedCompanions.push(party[i].id);
                    }
                }

                // If it's a battle or boss, record it for the simulation config
                if (encounter.type === EncounterType.BATTLE || encounter.type === EncounterType.BOSS) {
                    advConfig.encounters[encounter.id] = {
                        party: partyBefore.map(pBefore => {
                            const companionAfter = party.find(c => c.id === pBefore.companionId)!;
                            return {
                                companionId: pBefore.companionId,
                                levelBefore: pBefore.level,
                                levelAfter: companionAfter.level
                            };
                        })
                    };
                }

                const partyStatus = partyBefore.map(pb => {
                    const companionAfter = party.find(c => c.id === pb.companionId)!;
                    return `${pb.companionId}: L${pb.level} -> L${companionAfter.level}`;
                }).join(', ');
                const blockedStatus = blockedCompanions.length > 0
                    ? blockedCompanions.join(', ')
                    : '-';
                console.log(`| ${adventure.id} | ${encounter.id} | ${encounter.type} | ${maxLevel} | ${partyStatus} | ${blockedStatus} |`);
            }
        }

        if (Object.keys(advConfig.encounters).length > 0) {
            adventureConfigs.push(advConfig);
        }
    }

    // Save JSON config
    const outputDir = path.resolve(process.cwd(), 'configs/difficulty-testing');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, 'progression-analysis.json');
    fs.writeFileSync(filePath, JSON.stringify(adventureConfigs, null, 2));

    console.log(`\n✅ Generated simulation config: ${filePath}`);
}

runAnalysis();
