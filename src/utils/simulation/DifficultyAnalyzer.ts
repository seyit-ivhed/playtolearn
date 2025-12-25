import type { Encounter } from '../../types/adventure.types';
import { BattleSimulator } from './BattleSimulator';
import type {
    EncounterSimulationResults,
    PartyMemberConfig,
    SimulationResult
} from './simulation.types';

/**
 * DifficultyAnalyzer - Orchestrates multiple battle simulations and aggregates results
 */
export class DifficultyAnalyzer {
    /**
     * Run simulations for a single encounter
     */
    public static runEncounterSimulations(
        encounterId: string,
        encounter: Encounter,
        partyConfig: PartyMemberConfig[]
    ): EncounterSimulationResults {
        if (!encounter.enemies || encounter.enemies.length === 0) {
            throw new Error(`Encounter ${encounterId} has no enemies defined`);
        }

        // Run simulations with all ultimates succeeding (5 times)
        const allSuccessResults = this.runBatchSimulations(
            partyConfig,
            encounter.enemies,
            'ALL_SUCCESS',
            10
        );

        // Run simulations with all ultimates failing (5 times)
        const allFailResults = this.runBatchSimulations(
            partyConfig,
            encounter.enemies,
            'ALL_FAIL',
            20
        );

        // Run simulations with random ultimate success (20 times)
        const randomResults = this.runBatchSimulations(
            partyConfig,
            encounter.enemies,
            'RANDOM',
            200
        );

        return {
            encounterId,
            winRateAllSuccess: this.calculateWinRate(allSuccessResults),
            winRateAllFail: this.calculateWinRate(allFailResults),
            winRateRandom: this.calculateWinRate(randomResults),
            allSuccessDetails: {
                wins: allSuccessResults.filter(r => r.victory).length,
                total: allSuccessResults.length,
                averageTurns: this.calculateAverageTurns(allSuccessResults.filter(r => r.victory))
            },
            allFailDetails: {
                wins: allFailResults.filter(r => r.victory).length,
                total: allFailResults.length,
                averageTurns: this.calculateAverageTurns(allFailResults.filter(r => r.victory))
            },
            randomDetails: {
                wins: randomResults.filter(r => r.victory).length,
                total: randomResults.length,
                averageTurns: this.calculateAverageTurns(randomResults.filter(r => r.victory))
            }
        };
    }

    /**
     * Run multiple simulations with the same configuration
     */
    private static runBatchSimulations(
        partyConfig: PartyMemberConfig[],
        enemies: any[],
        strategy: 'ALL_SUCCESS' | 'ALL_FAIL' | 'RANDOM',
        count: number
    ): SimulationResult[] {
        const results: SimulationResult[] = [];

        for (let i = 0; i < count; i++) {
            const simulator = new BattleSimulator(partyConfig, enemies, strategy);
            const result = simulator.runBattle();
            results.push(result);
        }

        return results;
    }

    /**
     * Calculate win rate from results
     */
    private static calculateWinRate(results: SimulationResult[]): number {
        if (results.length === 0) return 0;
        const wins = results.filter(r => r.victory).length;
        return Math.round((wins / results.length) * 100);
    }

    /**
     * Calculate average turns for victories
     */
    private static calculateAverageTurns(victoryResults: SimulationResult[]): number {
        if (victoryResults.length === 0) return 0;
        const totalTurns = victoryResults.reduce((sum, r) => sum + r.turnCount, 0);
        return Math.round(totalTurns / victoryResults.length);
    }
}
