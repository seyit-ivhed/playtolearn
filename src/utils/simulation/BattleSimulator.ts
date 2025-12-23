import type { AdventureMonster } from '../../types/adventure.types';
import type { SpecialAbility } from '../../types/companion.types';
import { getCompanionById } from '../../data/companions.data';
import { getStatsForLevel } from '../progression.utils';
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
                    maxShield: 0,
                    currentShield: 0,
                    damage: stats.abilityDamage || 10,
                    specialAbilityValue: stats.specialAbilityValue || undefined,
                    isDead: false,
                    hasActed: false,
                    currentSpirit: companionData.initialSpirit || 0,
                    maxSpirit: 100
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
            maxShield: enemy.maxShield || 0,
            currentShield: 0,
            damage: enemy.attack,
            isDead: false,
            hasActed: false,
            currentSpirit: 0,
            maxSpirit: 100
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
        // Regenerate spirit at start of player turn
        this.regenerateSpirit();

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

        // Increment turn counter
        this.state.turnCount++;

        // Reset acted flags for next turn
        this.state.party = this.state.party.map(u => ({ ...u, hasActed: false }));
        this.state.monsters = this.state.monsters.map(u => ({ ...u, hasActed: false }));
    }

    /**
     * Regenerate spirit for all living party members
     */
    private regenerateSpirit(): void {
        this.state.party = this.state.party.map(unit => {
            if (unit.isDead) return unit;
            return {
                ...unit,
                currentSpirit: Math.min(unit.maxSpirit, unit.currentSpirit + 35)
            };
        });
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
        const targetIndex = this.state.monsters.findIndex(m => !m.isDead);
        if (targetIndex === -1) return;

        const target = this.state.monsters[targetIndex];
        const damage = attacker.damage;

        this.applyDamage(target, damage);
        this.state.monsters[targetIndex] = target;
    }

    /**
     * Execute ultimate ability
     */
    private executeUltimate(attacker: SimulationUnit, success: boolean): void {
        const companionData = getCompanionById(attacker.templateId);
        if (!companionData) return;

        const ability = companionData.specialAbility;

        if (success) {
            this.executeAbility(attacker, ability);
        }

        // Reset spirit regardless of success/failure
        const partyIndex = this.state.party.findIndex(p => p.id === attacker.id);
        if (partyIndex !== -1) {
            this.state.party[partyIndex] = {
                ...this.state.party[partyIndex],
                currentSpirit: 0
            };
        }
    }

    /**
     * Execute special ability based on type
     */
    private executeAbility(attacker: SimulationUnit, ability: SpecialAbility): void {
        const actualValue = attacker.specialAbilityValue || ability.value;

        switch (ability.type) {
            case 'DAMAGE':
                this.executeDamageAbility(ability.target, actualValue);
                break;
            case 'HEAL':
                this.executeHealAbility(ability.target, actualValue);
                break;
            case 'SHIELD':
                this.executeShieldAbility(ability.target, actualValue);
                break;
        }
    }

    /**
     * Execute damage ability
     */
    private executeDamageAbility(target: string, value: number): void {
        if (target === 'ALL_ENEMIES') {
            this.state.monsters = this.state.monsters.map(m => {
                if (m.isDead) return m;
                this.applyDamage(m, value);
                return m;
            });
        } else if (target === 'SINGLE_ENEMY') {
            const targetIndex = this.state.monsters.findIndex(m => !m.isDead);
            if (targetIndex !== -1) {
                const monster = this.state.monsters[targetIndex];
                this.applyDamage(monster, value);
                this.state.monsters[targetIndex] = monster;
            }
        }
    }

    /**
     * Execute heal ability
     */
    private executeHealAbility(target: string, value: number): void {
        if (target === 'ALL_ALLIES') {
            this.state.party = this.state.party.map(p => {
                if (p.isDead) return p;
                return {
                    ...p,
                    currentHealth: Math.min(p.maxHealth, p.currentHealth + value)
                };
            });
        } else if (target === 'SINGLE_ALLY') {
            // Heal lowest health ally
            const lowestHealthIndex = this.state.party
                .map((p, i) => ({ p, i }))
                .filter(({ p }) => !p.isDead)
                .sort((a, b) => a.p.currentHealth - b.p.currentHealth)[0]?.i;

            if (lowestHealthIndex !== undefined) {
                const ally = this.state.party[lowestHealthIndex];
                this.state.party[lowestHealthIndex] = {
                    ...ally,
                    currentHealth: Math.min(ally.maxHealth, ally.currentHealth + value)
                };
            }
        }
    }

    /**
     * Execute shield ability
     */
    private executeShieldAbility(target: string, value: number): void {
        if (target === 'ALL_ALLIES') {
            this.state.party = this.state.party.map(p => {
                if (p.isDead) return p;
                return {
                    ...p,
                    currentShield: p.currentShield + value
                };
            });
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
            // Random target selection
            const targetIdx = Math.floor(Math.random() * livingParty.length);
            const targetId = livingParty[targetIdx].id;
            const actualTargetIndex = this.state.party.findIndex(p => p.id === targetId);

            if (actualTargetIndex !== -1) {
                const target = this.state.party[actualTargetIndex];
                this.applyDamage(target, monster.damage);
                this.state.party[actualTargetIndex] = target;
            }

            // Check defeat after each attack
            if (this.isDefeat()) {
                return;
            }
        }
    }

    /**
     * Apply damage to a unit (handles shield)
     */
    private applyDamage(target: SimulationUnit, damageAmount: number): void {
        let remainingDamage = damageAmount;

        // First reduce shield
        if (target.currentShield > 0) {
            if (target.currentShield >= remainingDamage) {
                target.currentShield -= remainingDamage;
                remainingDamage = 0;
            } else {
                remainingDamage -= target.currentShield;
                target.currentShield = 0;
            }
        }

        // Then reduce health
        target.currentHealth = Math.max(0, target.currentHealth - remainingDamage);
        if (target.currentHealth === 0) {
            target.isDead = true;
        }
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
