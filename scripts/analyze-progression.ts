
import * as fs from 'fs';
import * as path from 'path';
import { ADVENTURES } from '../src/data/adventures.data';
import { getXpForNextLevel } from '../src/utils/progression.utils';
import { EncounterType } from '../src/types/adventure.types';
import type { AdventureSimulationConfig } from '../src/utils/simulation/simulation.types';

// Types
interface SimCompanion {
    name: string;
    level: number;
    currentXp: number;
}

interface Scenario {
    name: string;
    ratioA: number; // Ratio for Companion A (0-1)
}

interface EncounterState {
    adventureId: string;
    encounterId: string;
    type: EncounterType;
    scenarioStates: {
        scenarioName: string;
        compA: { level: number; xp: number };
        compB: { level: number; xp: number };
    }[];
}

// Configuration
const SCENARIOS: Scenario[] = [
    { name: 'Equal', ratioA: 0.5 },
    { name: 'Favored (65/35)', ratioA: 0.65 },
    { name: 'Exclusive', ratioA: 1.0 },
];

/**
 * Simulates leveling up a companion based on gained XP.
 * Returns the updated companion state.
 */
function addXpToCompanion(companion: SimCompanion, amount: number): SimCompanion {
    let { level, currentXp } = companion;
    currentXp += amount;

    let nextLevelCost = getXpForNextLevel(level);

    // Level up loop
    while (currentXp >= nextLevelCost) {
        currentXp -= nextLevelCost;
        level++;
        nextLevelCost = getXpForNextLevel(level);
    }

    return { ...companion, level, currentXp };
}

async function runAnalysis() {
    const reportData: EncounterState[] = [];

    // Pre-calculate all encounters linear list for easier iteration if needed, 
    // but nested is fine since we just want to track state.

    // Initialize simulation state for each scenario
    const simulations = SCENARIOS.map(scenario => ({
        scenario,
        compA: { name: 'Comp A', level: 1, currentXp: 0 } as SimCompanion,
        compB: { name: 'Comp B', level: 1, currentXp: 0 } as SimCompanion,
        pendingXp: 0
    }));

    for (const adventure of ADVENTURES) {
        for (const encounter of adventure.encounters) {
            const xpReward = encounter.xpReward || 0;

            const stateSnapshot: EncounterState = {
                adventureId: adventure.id,
                encounterId: encounter.id,
                type: encounter.type,
                scenarioStates: []
            };

            for (const sim of simulations) {
                // Add XP to pending pool
                sim.pendingXp += xpReward;

                // Check if distribution happens (CAMP)
                if (encounter.type === EncounterType.CAMP) {
                    const totalDistribute = sim.pendingXp;
                    const xpA = Math.floor(totalDistribute * sim.scenario.ratioA);
                    const xpB = totalDistribute - xpA; // Ensure no XP loss due to rounding

                    sim.compA = addXpToCompanion(sim.compA, xpA);
                    sim.compB = addXpToCompanion(sim.compB, xpB);

                    sim.pendingXp = 0;
                }

                // Record state
                stateSnapshot.scenarioStates.push({
                    scenarioName: sim.scenario.name,
                    compA: { level: sim.compA.level, xp: sim.compA.currentXp },
                    compB: { level: sim.compB.level, xp: sim.compB.currentXp }
                });
            }
            reportData.push(stateSnapshot);
        }
    }

    generateMarkdownReport(reportData);
    generateSimulationConfigs(reportData);
}

function generateMarkdownReport(data: EncounterState[]) {
    console.log('# Companion Progression Analysis Report\n');
    console.log('| Adventure | Encounter | Type | Equal (A/B) | Favored 65/35 (A/B) | Exclusive (A/B) |');
    console.log('|---|---|---|---|---|---|');

    data.forEach(row => {
        const scenarioCols = row.scenarioStates.map(s =>
            `Lvl ${s.compA.level} / Lvl ${s.compB.level}`
        ).join(' | ');

        console.log(`| ${row.adventureId} | ${row.encounterId} | ${row.type} | ${scenarioCols} |`);
    });
}

function generateSimulationConfigs(data: EncounterState[]) {
    // Group by Scenario -> Adventure
    const scenarios = ['Equal', 'Favored (65/35)', 'Exclusive'];
    const outputDir = path.resolve(process.cwd(), 'configs/difficulty-testing');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    scenarios.forEach(scenarioName => {
        const adventureConfigs: AdventureSimulationConfig[] = [];

        // Find all adventures
        const adventureIds = Array.from(new Set(data.map(d => d.adventureId)));

        adventureIds.forEach(advId => {
            const advConfig: AdventureSimulationConfig = {
                adventureId: advId,
                encounters: {}
            };

            // Get all encounters for this adventure where we have data
            const encounters = data.filter(d => d.adventureId === advId && (d.type === EncounterType.BATTLE || d.type === EncounterType.BOSS));

            encounters.forEach(enc => {
                const state = enc.scenarioStates.find(s => s.scenarioName === scenarioName);
                if (state) {
                    advConfig.encounters[enc.encounterId] = {
                        party: [
                            { companionId: 'amara', level: state.compA.level },
                            { companionId: 'tariq', level: state.compB.level }
                        ]
                    };
                }
            });

            if (Object.keys(advConfig.encounters).length > 0) {
                adventureConfigs.push(advConfig);
            }
        });

        // Determine filename safe scenario name
        let safeName = 'equal';
        if (scenarioName.includes('Favored')) safeName = 'favored';
        if (scenarioName.includes('Exclusive')) safeName = 'exclusive';

        const filePath = path.join(outputDir, `strategy-${safeName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(adventureConfigs, null, 2));
        console.log(`Generated config: ${filePath}`);
    });
}

runAnalysis();
