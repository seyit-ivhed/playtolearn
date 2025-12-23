import type { EncounterSimulationResults } from '../simulation.types';

/**
 * Output formatter interface for modular output system
 */
export interface IOutputFormatter {
    format(results: EncounterSimulationResults[]): void;
}

/**
 * Console output formatter with colored tables
 */
export class ConsoleOutputFormatter implements IOutputFormatter {
    format(results: EncounterSimulationResults[]): void {
        console.log('\n' + '='.repeat(80));
        console.log('BATTLE DIFFICULTY SIMULATION RESULTS');
        console.log('='.repeat(80) + '\n');

        for (const result of results) {
            this.formatEncounter(result);
        }

        console.log('='.repeat(80) + '\n');
    }

    private formatEncounter(result: EncounterSimulationResults): void {
        console.log(`📍 Encounter: ${result.encounterId}`);
        console.log('─'.repeat(80));

        // Win rates table
        console.log('\n  WIN RATES:');
        console.log(`    All Ultimates Succeed: ${this.formatWinRate(result.winRateAllSuccess)}`);
        console.log(`    All Ultimates Fail:    ${this.formatWinRate(result.winRateAllFail)}`);
        console.log(`    Random Ultimate:       ${this.formatWinRate(result.winRateRandom)}`);

        // Detailed stats
        console.log('\n  DETAILED STATISTICS:');
        console.log(`    All Success: ${result.allSuccessDetails.wins}/${result.allSuccessDetails.total} wins, avg ${result.allSuccessDetails.averageTurns} turns`);
        console.log(`    All Fail:    ${result.allFailDetails.wins}/${result.allFailDetails.total} wins, avg ${result.allFailDetails.averageTurns} turns`);
        console.log(`    Random:      ${result.randomDetails.wins}/${result.randomDetails.total} wins, avg ${result.randomDetails.averageTurns} turns`);

        // Difficulty assessment
        console.log('\n  DIFFICULTY ASSESSMENT:');
        console.log(`    ${this.getDifficultyAssessment(result)}`);

        console.log('\n');
    }

    private formatWinRate(rate: number): string {
        const percentage = `${rate}%`.padEnd(4);
        const bar = this.createProgressBar(rate);

        // Color based on win rate
        let color = '\x1b[31m'; // Red for low
        if (rate >= 70) color = '\x1b[32m'; // Green for high
        else if (rate >= 40) color = '\x1b[33m'; // Yellow for medium

        return `${color}${percentage}\x1b[0m ${bar}`;
    }

    private createProgressBar(percentage: number, width: number = 40): string {
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        return `[${'█'.repeat(filled)}${' '.repeat(empty)}]`;
    }

    private getDifficultyAssessment(result: EncounterSimulationResults): string {
        const randomWinRate = result.winRateRandom;

        if (randomWinRate >= 80) {
            return '✅ EASY - Players should consistently win';
        } else if (randomWinRate >= 60) {
            return '🟢 MODERATE - Balanced challenge with good win rate';
        } else if (randomWinRate >= 40) {
            return '🟡 CHALLENGING - Players will need skill and strategy';
        } else if (randomWinRate >= 20) {
            return '🟠 DIFFICULT - Most players will struggle';
        } else {
            return '🔴 VERY HARD - Winning requires perfect execution';
        }
    }
}
