export interface SpecialAbility {
    id: string; // Used for translation key and VFX lookup
    type: 'DAMAGE' | 'HEAL' | 'SHIELD';
    value: number;
    target: 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF' | 'RANDOM_ENEMY';

}

export interface CompanionStats {
    maxHealth: number;
    title?: string;
    abilityDamage?: number;
    specialAbilityId?: string;
    specialAbilityType?: 'DAMAGE' | 'HEAL' | 'SHIELD';
    specialAbilityValue?: number;
    specialAbilityTarget?: 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF' | 'RANDOM_ENEMY';
    spiritGain?: number;
}

export interface CompanionEvolution {
    atLevel: number;
    title: string;
    image?: string;
    statsBonus?: Partial<CompanionStats>;
    newSpecialAbility?: SpecialAbility;
}

export interface Companion {
    id: string;
    // Identity
    name: string;
    title: string;

    // Progression
    level: number;

    // Stats
    baseStats: CompanionStats;
    stats: CompanionStats; // Current calculated stats

    // Special Ability
    specialAbility: SpecialAbility;

    // Visuals
    image?: string;

    // Configuration
    initialSpirit: number;

    evolutions: CompanionEvolution[];
}
