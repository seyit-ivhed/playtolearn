import type { AdventureMonster } from '../../types/adventure.types';
import { getCompanionById } from '../../data/companions.data';
import { getStatsForLevel } from '../progression.utils';
import { CombatEngine } from '../battle/combat-engine';
import type { BattleUnit } from '../../types/encounter.types';
import type {
    SimulationUnit,
    BattleState,
    UltimateStrategy,
    SimulationResult,
    PartyMemberConfig
} from './simulation.types';

/**
 * BattleSimulator - Pure TypeScript battle engine without UI dependencies
 * Replicates the logic from encounter store but optimized for headless simulation
 */
export class BattleSimulator {
    private state: BattleState;
    private ultimateStrategy: UltimateStrategy;

    constructor(
        partyConfigs: PartyMemberConfig[],
        enemies: AdventureMonster[],
        ultimateStrategy: UltimateStrategy
    ) {
        this.ultimateStrategy = ultimateStrategy;
        this.state = this.initializeBattle(partyConfigs, enemies);
    }

    private initializeBattle(
        partyConfigs: PartyMemberConfig[],
        enemies: AdventureMonster[]
    ): BattleState {
        // Initialize party from configs
        const party: SimulationUnit[] = partyConfigs
            .map((config, index) => {
                const companionData = getCompanionById(config.companionId);
                if (!companionData) {
                    console.warn(`Companion "${config.companionId}" not found, skipping...`);
                    return null;
                }

                const stats = getStatsForLevel(companionData, config.level);

                return {
                    id: `party_${config.companionId}_${index}`,
                    templateId: config.companionId,
                    name: companionData.name,
                    isPlayer: true,
                    maxHealth: stats.maxHealth,
                    currentHealth: stats.maxHealth,
                    damage: stats.abilityDamage || 10,

                    // Evolution details
                    specialAbilityId: stats.specialAbilityId,
                    specialAbilityVariables: stats.specialAbilityVariables,

                    isDead: false,
                    hasActed: false,
                    currentSpirit: companionData.initialSpirit || 0,
                    maxSpirit: 100,
                    spiritGain: stats.spiritGain || 0
                };
            })
            .filter((unit) => unit !== null) as SimulationUnit[];

        // Initialize monsters
        const monsters: SimulationUnit[] = enemies.map((enemy, index) => ({
            id: `monster_${enemy.id}_${index}`,
            templateId: enemy.id,
            name: enemy.name || enemy.id,
            isPlayer: false,
            maxHealth: enemy.maxHealth,
            currentHealth: enemy.maxHealth,
            damage: enemy.attack,
            isDead: false,
            hasActed: false,
            currentSpirit: 0,
            maxSpirit: 100,
            spiritGain: 0
        }));

        return {
            turnCount: 1,
            party,
            monsters,
            isVictory: false,
            isDefeat: false
        };
    }

    /**
     * Run complete battle until victory or defeat
     */
    public runBattle(): SimulationResult {
        while (!this.isVictory() && !this.isDefeat()) {
            this.simulateTurn();
        }

        return {
            victory: this.isVictory(),
            turnCount: this.state.turnCount,
            finalPartyHealth: this.getTotalHealth(this.state.party),
            finalMonsterHealth: this.getTotalHealth(this.state.monsters)
        };
    }

    /**
     * Simulate one complete turn (player actions + monster actions)
     */
    private simulateTurn(): void {
        const units = this.state.party as unknown as BattleUnit[];
        this.state.party = CombatEngine.regenerateSpirit(units) as unknown as SimulationUnit[];

        // Player turn
        this.executePlayerTurn();

        // Check victory after player turn
        if (this.isVictory()) {
            return;
        }

        // Monster turn
        this.executeMonsterTurn();

        // Check defeat after monster turn
        if (this.isDefeat()) {
            return;
        }

        // Tick Status Effects
        this.state.party = CombatEngine.tickStatusEffects(this.state.party as unknown as BattleUnit[]) as unknown as SimulationUnit[];
        this.state.monsters = CombatEngine.tickStatusEffects(this.state.monsters as unknown as BattleUnit[]) as unknown as SimulationUnit[];

        // Increment turn counter
        this.state.turnCount++;

        // Reset acted flags for next turn
        this.state.party = this.state.party.map(u => ({ ...u, hasActed: false }));
        this.state.monsters = this.state.monsters.map(u => ({ ...u, hasActed: false }));
    }

    /**
     * Execute all player actions for this turn
     */
    private executePlayerTurn(): void {
        const livingParty = this.state.party.filter(u => !u.isDead);

        for (const unit of livingParty) {
            // Check if unit has full spirit for ultimate
            if (unit.currentSpirit >= 100) {
                const success = this.shouldUltimateSucceed();
                this.executeUltimate(unit, success);
            } else {
                // Standard attack
                this.executeStandardAttack(unit);
            }

            // Check victory after each action
            if (this.isVictory()) {
                return;
            }
        }
    }

    /**
     * Determine if ultimate should succeed based on strategy
     */
    private shouldUltimateSucceed(): boolean {
        switch (this.ultimateStrategy) {
            case 'ALL_SUCCESS':
                return true;
            case 'ALL_FAIL':
                return false;
            case 'RANDOM':
                return Math.random() >= 0.5; // 50% chance
            default:
                return false;
        }
    }

    /**
     * Execute standard attack
     */
    private executeStandardAttack(attacker: SimulationUnit): void {
        const allUnits = [...this.state.party, ...this.state.monsters] as unknown as BattleUnit[];
        const result = CombatEngine.executeStandardAttack(attacker as unknown as BattleUnit, allUnits);

        this.updateStateFromCombatResult(result.updatedTargets);
    }

    /**
     * Execute ultimate ability
     */
    private executeUltimate(attacker: SimulationUnit, success: boolean): void {
        if (!success) {
            // Reset spirit on failure
            const partyIndex = this.state.party.findIndex(p => p.id === attacker.id);
            if (partyIndex !== -1) {
                const updatedUnit = CombatEngine.consumeSpiritCost(this.state.party[partyIndex] as unknown as BattleUnit);
                this.state.party[partyIndex] = updatedUnit as unknown as SimulationUnit;
            }
            return;
        }

        // Construct ability object from Unit state (evolved data)
        const abilityId = attacker.specialAbilityId;
        const variables = attacker.specialAbilityVariables || {};

        if (!abilityId) {
            // Fallback to companion data if for some reason missing (shouldn't happen with new init)
            const companionData = getCompanionById(attacker.templateId);
            if (companionData) {
                const companionStats = getStatsForLevel(companionData, 1); // Simple fallback
                this.runAbilityExecution(attacker, companionStats.specialAbilityId!, companionStats.specialAbilityVariables || {});
            }
        } else {
            this.runAbilityExecution(attacker, abilityId, variables);
        }
    }

    private runAbilityExecution(attacker: SimulationUnit, abilityId: string, variables: Record<string, number>): void {
        const allUnits = [...this.state.party, ...this.state.monsters] as unknown as BattleUnit[];
        const result = CombatEngine.executeSpecialAbility(
            attacker as unknown as BattleUnit,
            allUnits,
            abilityId,
            variables
        );

        this.updateStateFromCombatResult(result.updatedUnits);

        // Reset spirit after success
        const partyIndex = this.state.party.findIndex(p => p.id === attacker.id);
        if (partyIndex !== -1) {
            const updatedUnit = CombatEngine.consumeSpiritCost(this.state.party[partyIndex] as unknown as BattleUnit);
            this.state.party[partyIndex] = updatedUnit as unknown as SimulationUnit;
        }
    }

    /**
     * Execute monster turn
     */
    private executeMonsterTurn(): void {
        const activeMonsters = this.state.monsters.filter(m => !m.isDead);
        const livingParty = this.state.party.filter(p => !p.isDead);

        if (livingParty.length === 0) return;

        for (const monster of activeMonsters) {
            const result = CombatEngine.processMonsterAction(
                monster as unknown as BattleUnit,
                this.state.party as unknown as BattleUnit[]
            );

            // Updates party state
            // We need to match back to SimulationUnit
            this.state.party = result.updatedParty as unknown as SimulationUnit[];

            // Check defeat after each attack
            if (this.isDefeat()) {
                return;
            }
        }
    }

    private updateStateFromCombatResult(units: BattleUnit[]) {
        // Split back into party and monsters
        this.state.party = units.filter(u => u.isPlayer) as unknown as SimulationUnit[];
        this.state.monsters = units.filter(u => !u.isPlayer) as unknown as SimulationUnit[];
    }

    /**
     * Check for victory condition
     */
    public isVictory(): boolean {
        return this.state.monsters.every(m => m.isDead);
    }

    /**
     * Check for defeat condition
     */
    public isDefeat(): boolean {
        return this.state.party.every(p => p.isDead);
    }

    /**
     * Get total health of units
     */
    private getTotalHealth(units: SimulationUnit[]): number {
        return units.reduce((sum, u) => sum + u.currentHealth, 0);
    }
}
