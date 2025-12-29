#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { getAdventureById } from '../../data/adventures.data';
import { EncounterType } from '../../types/adventure.types';
import { DifficultyAnalyzer } from './DifficultyAnalyzer';
import { ConsoleOutputFormatter } from './output/OutputFormatter';
import type { AdventureSimulationConfig, EncounterSimulationResults, SimulationConfigFile } from './simulation.types';

/**
 * CLI for running battle difficulty simulations
 */
class SimulationCLI {
    /**
     * Parse configuration file
     */
    private static parseConfigFile(configPath: string): SimulationConfigFile {
        const fullPath = path.resolve(process.cwd(), configPath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`Configuration file not found: ${fullPath}`);
        }

        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const config = JSON.parse(fileContent) as SimulationConfigFile;

        return config;
    }

    /**
     * Run adventure simulation
     */
    private static runAdventureSimulation(config: AdventureSimulationConfig): void {
        console.log(`\n🎮 Running difficulty simulation for Adventure ${config.adventureId}...\n`);

        const adventure = getAdventureById(config.adventureId);
        if (!adventure) {
            throw new Error(`Adventure ${config.adventureId} not found`);
        }

        const results: EncounterSimulationResults[] = [];

        // Process each configured encounter
        for (const [encounterId, encounterConfig] of Object.entries(config.encounters)) {
            const encounter = adventure.encounters.find(e => e.id === encounterId);

            if (!encounter) {
                console.warn(`⚠️  Encounter ${encounterId} not found in adventure, skipping...`);
                continue;
            }

            // Only simulate battle/boss encounters
            if (encounter.type !== EncounterType.BATTLE && encounter.type !== EncounterType.BOSS) {
                console.log(`⏭️  Skipping ${encounterId} (type: ${encounter.type})`);
                continue;
            }

            console.log(`⚔️  Simulating ${encounterId}...`);

            const result = DifficultyAnalyzer.runEncounterSimulations(
                encounterId,
                encounter,
                encounterConfig.party
            );

            results.push(result);
        }

        // Output results
        const formatter = new ConsoleOutputFormatter();
        formatter.format(results);
    }

    /**
     * Main CLI entry point
     */
    public static main(): void {
        const args = process.argv.slice(2);

        // Parse arguments
        let configPath: string | null = null;

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--config' && args[i + 1]) {
                configPath = args[i + 1];
                i++;
            } else if (args[i] === '--help' || args[i] === '-h') {
                this.printHelp();
                process.exit(0);
            }
        }

        if (!configPath) {
            console.error('❌ Error: --config parameter is required\n');
            this.printHelp();
            process.exit(1);
        }

        try {
            const config = this.parseConfigFile(configPath!);

            if (Array.isArray(config)) {
                console.log(`📋 Found ${config.length} adventures in configuration.`);
                for (const adventureConfig of config) {
                    this.runAdventureSimulation(adventureConfig);
                }
            } else {
                this.runAdventureSimulation(config);
            }
        } catch (error) {
            console.error('\n❌ Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    }

    /**
     * Print help message
     */
    private static printHelp(): void {
        console.log(`
Battle Difficulty Simulation Tool

Usage:
  npm run simulate-difficulty -- --config <path-to-config>

Options:
  --config <path>   Path to the JSON configuration file (required)
  --help, -h        Show this help message

Example:
  npm run simulate-difficulty -- --config configs/difficulty-testing/adventure-1.json
        `);
    }
}

// Run if executed directly
const isMain = import.meta.url.endsWith(process.argv[1]) ||
    (process.argv[1] && import.meta.url.includes(process.argv[1]));
if (isMain) {
    SimulationCLI.main();
}

export { SimulationCLI };
