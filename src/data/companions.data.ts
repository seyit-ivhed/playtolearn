import { CompanionRole } from '../types/companion.types';
import type { Companion } from '../types/companion.types';

export const XP_PER_LEVEL = 100; // Linear curve for now: Level * 100


// Images
import villageSquireImg from '../assets/images/companions/village_squire.png';
import noviceArcherImg from '../assets/images/companions/novice_archer.png';

export const COMPANIONS: Record<string, Companion> = {
    'village_squire': {
        id: 'village_squire',
        name: 'Garrick',
        title: 'Village Squire',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 90,
            abilityDamage: 8
        },
        stats: {
            maxHealth: 90,
            abilityDamage: 8
        },
        specialAbility: {
            id: 'protective_stance',
            type: 'SHIELD',
            value: 15,
            target: 'ALL_ALLIES'
        },
        image: villageSquireImg,
        initialSpirit: 70,
        evolutions: [
            {
                atLevel: 5,
                title: 'Knight',
                image: villageSquireImg, // Placeholder
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 4
                }
            }
        ]
    },
    'novice_archer': {
        id: 'novice_archer',
        name: 'Elara',
        title: 'Novice Archer',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 80,
            abilityDamage: 6
        },
        stats: {
            maxHealth: 80,
            abilityDamage: 6
        },
        specialAbility: {
            id: 'piercing_shot',
            type: 'DAMAGE',
            value: 20,
            target: 'SINGLE_ENEMY'
        },
        image: noviceArcherImg,
        initialSpirit: 30,
        evolutions: [
            {
                atLevel: 5,
                title: 'Ranger',
                image: noviceArcherImg, // Placeholder
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 5
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['village_squire', 'novice_archer'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];

