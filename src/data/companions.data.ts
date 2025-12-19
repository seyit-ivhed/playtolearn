import { CompanionRole } from '../types/companion.types';
import type { Companion } from '../types/companion.types';

export const XP_PER_LEVEL = 100; // Linear curve for now: Level * 100


// Images
import amaraImg from '../assets/images/companions/Amara/Amara-0.png';
import tariqImg from '../assets/images/companions/Tariq/Tariq-0.png';

export const COMPANIONS: Record<string, Companion> = {
    'amara': {
        id: 'amara',
        name: 'Amara',
        title: 'The Jungle Ranger',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 75,
            abilityDamage: 10
        },
        stats: {
            maxHealth: 75,
            abilityDamage: 10
        },
        specialAbility: {
            id: 'jaguar_strike',
            type: 'DAMAGE',
            value: 25,
            target: 'SINGLE_ENEMY'
        },
        image: amaraImg,
        initialSpirit: 65,
        evolutions: [
            {
                atLevel: 10,
                title: 'Jungle Sentinel',
                image: amaraImg, // Placeholder for evolution image
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 5
                }
            }
        ]
    },
    'tariq': {
        id: 'tariq',
        name: 'Tariq',
        title: 'The Desert Alchemist',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 85,
            abilityDamage: 6
        },
        stats: {
            maxHealth: 85,
            abilityDamage: 6
        },
        specialAbility: {
            id: 'elixir_of_life',
            type: 'HEAL',
            value: 15,
            target: 'ALL_ALLIES'
        },
        image: tariqImg,
        initialSpirit: 0,
        evolutions: [
            {
                atLevel: 10,
                title: 'Master Alchemist',
                image: tariqImg, // Placeholder for evolution image
                statsBonus: {
                    maxHealth: 25,
                    abilityDamage: 3
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['amara', 'tariq'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];
