
import * as fs from 'fs';
import * as path from 'path';
import { ADVENTURES } from '../src/data/adventures.data';
import { getXpForNextLevel } from '../src/utils/progression.utils';
import { EncounterType } from '../src/types/adventure.types';
import type { AdventureSimulationConfig } from '../src/utils/simulation/simulation.types';

// Types
interface SimCompanion {
    id: string;
    name: string;
    level: number;
    currentXp: number;
}

interface Scenario {
    name: string;
    favoredRatio: number; // Ratio for the favored companion (usually the first one)
}

interface CompanionSnapshot {
    id: string;
    level: number;
    xp: number;
}

interface EncounterState {
    adventureId: string;
    encounterId: string;
    type: EncounterType;
    scenarioStates: {
        scenarioName: string;
        companions: CompanionSnapshot[];
    }[];
}

// Configuration
const SCENARIOS: Scenario[] = [
    { name: 'Equal', favoredRatio: 0 }, // 0 means split equally
    { name: 'Favored (65/35)', favoredRatio: 0.65 },
    { name: 'Exclusive', favoredRatio: 1.0 },
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

export async function runAnalysis() {
    const reportData: EncounterState[] = [];

    // Initialize simulation state for each scenario
    const simulations = SCENARIOS.map(scenario => ({
        scenario,
        party: [
            { id: 'amara', name: 'Amara', level: 1, currentXp: 0 },
            { id: 'tariq', name: 'Tariq', level: 1, currentXp: 0 },
        ] as SimCompanion[],
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
                // Check if Kenji joins (Adventure 3)
                if (adventure.id === '3' && !sim.party.find(c => c.id === 'kenji')) {
                    sim.party.push({ id: 'kenji', name: 'Kenji', level: 1, currentXp: 0 });
                }

                // Add XP to pending pool
                sim.pendingXp += xpReward;

                // Check if distribution happens (CAMP)
                if (encounter.type === EncounterType.CAMP) {
                    const totalDistribute = sim.pendingXp;
                    const numCompanions = sim.party.length;

                    if (sim.scenario.favoredRatio === 0) {
                        // Equal distribution
                        const xpPerComp = Math.floor(totalDistribute / numCompanions);
                        let remainder = totalDistribute % numCompanions;

                        sim.party = sim.party.map(c => {
                            const xpToAdd = xpPerComp + (remainder > 0 ? 1 : 0);
                            if (remainder > 0) remainder--;
                            return addXpToCompanion(c, xpToAdd);
                        });
                    } else {
                        // Favored/Exclusive distribution
                        // First companion is favored
                        const xpFavored = Math.floor(totalDistribute * sim.scenario.favoredRatio);
                        const xpOthersTotal = totalDistribute - xpFavored;

                        if (numCompanions > 1) {
                            const xpPerOther = Math.floor(xpOthersTotal / (numCompanions - 1));
                            let remainder = xpOthersTotal % (numCompanions - 1);

                            sim.party = sim.party.map((c, index) => {
                                if (index === 0) {
                                    return addXpToCompanion(c, xpFavored);
                                } else {
                                    const xpToAdd = xpPerOther + (remainder > 0 ? 1 : 0);
                                    if (remainder > 0) remainder--;
                                    return addXpToCompanion(c, xpToAdd);
                                }
                            });
                        } else {
                            sim.party[0] = addXpToCompanion(sim.party[0], totalDistribute);
                        }
                    }

                    sim.pendingXp = 0;
                }

                // Record state
                stateSnapshot.scenarioStates.push({
                    scenarioName: sim.scenario.name,
                    companions: sim.party.map(c => ({ id: c.id, level: c.level, xp: c.currentXp }))
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
    console.log('| Adventure | Encounter | Type | Equal | Favored 65/35 | Exclusive |');
    console.log('|---|---|---|---|---|---|');

    data.forEach(row => {
        const scenarioCols = row.scenarioStates.map(s =>
            s.companions.map(c => `L${c.level}`).join('/')
        ).join(' | ');

        console.log(`| ${row.adventureId} | ${row.encounterId} | ${row.type} | ${scenarioCols} |`);
    });
}

function generateSimulationConfigs(data: EncounterState[]) {
    const scenarios = ['Equal', 'Favored (65/35)', 'Exclusive'];
    const outputDir = path.resolve(process.cwd(), 'configs/difficulty-testing');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    scenarios.forEach(scenarioName => {
        const adventureConfigs: AdventureSimulationConfig[] = [];
        const adventureIds = Array.from(new Set(data.map(d => d.adventureId)));

        adventureIds.forEach(advId => {
            const advConfig: AdventureSimulationConfig = {
                adventureId: advId,
                encounters: {}
            };

            const encounters = data.filter(d =>
                d.adventureId === advId &&
                (d.type === EncounterType.BATTLE || d.type === EncounterType.BOSS)
            );

            encounters.forEach(enc => {
                const state = enc.scenarioStates.find(s => s.scenarioName === scenarioName);
                if (state) {
                    advConfig.encounters[enc.encounterId] = {
                        party: state.companions.map(c => ({
                            companionId: c.id,
                            level: c.level
                        }))
                    };
                }
            });

            if (Object.keys(advConfig.encounters).length > 0) {
                adventureConfigs.push(advConfig);
            }
        });

        let safeName = 'equal';
        if (scenarioName.includes('Favored')) safeName = 'favored';
        if (scenarioName.includes('Exclusive')) safeName = 'exclusive';

        const filePath = path.join(outputDir, `strategy-${safeName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(adventureConfigs, null, 2));
        console.log(`Generated config: ${filePath}`);
    });
}


runAnalysis();
