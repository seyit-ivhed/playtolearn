export const CompanionRole = {
    WARRIOR: 'WARRIOR',

} as const;

export type CompanionRole = typeof CompanionRole[keyof typeof CompanionRole];

export interface SpecialAbility {
    id: string; // Used for translation key and VFX lookup
    type: 'DAMAGE' | 'SHIELD' | 'HEAL';
    value: number;
    target: 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF' | 'RANDOM_ENEMY';

}

export interface CompanionStats {
    maxHealth: number;
    abilityDamage?: number;
    specialAbilityValue?: number;
}

export interface CompanionEvolution {
    atLevel: number;
    title: string;
    image: string;
    statsBonus?: Partial<CompanionStats>;
    newSpecialAbility?: SpecialAbility;
}

export interface Companion {
    id: string;
    // Identity
    name: string;
    title: string;
    role: CompanionRole;

    // Progression
    level: number;
    xp: number;

    // Stats
    baseStats: CompanionStats;
    stats: CompanionStats; // Current calculated stats


    // Special Ability
    specialAbility: SpecialAbility;

    // Visuals
    image: string;

    // Configuration
    initialSpirit: number;

    evolutions: CompanionEvolution[];
}
