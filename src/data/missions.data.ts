import { type Mission } from '../types/mission.types';

export const MISSIONS: Mission[] = [
    {
        id: '1',
        title: 'Village Defense',
        description: 'A Goblin Scout has been spotted near the village. Drive it away to protect the townsfolk!',
        difficulty: 1,
        enemy: {
            id: 'goblin_scout',
            name: 'Goblin Scout',
            sprite: '/src/assets/images/enemies/goblin.png',
            maxHealth: 30,
            attack: 5,
            defense: 0,
            speed: 5
        },
        rewards: {
            xp: 100,
            currency: 50
        }
    },
    {
        id: '2',
        title: 'Forest Ambush',
        description: 'The path through the Whispering Woods is blocked by a Wolf Pack Leader. Clear the way!',
        difficulty: 2,
        enemy: {
            id: 'wolf_leader',
            name: 'Wolf Leader',
            sprite: '/src/assets/images/enemies/wolf.png',
            maxHealth: 50,
            attack: 8,
            defense: 2,
            speed: 12
        },
        rewards: {
            unlocksModuleId: 'companion_shadow_archer',
            xp: 200,
            currency: 100
        },
        requirements: {
            previousMissionId: '1'
        }
    },
    {
        id: '3',
        title: 'Mountain Pass',
        description: 'A Stone Golem blocks the pass to the Crystal Peaks. Your magic might be needed here.',
        difficulty: 3,
        enemy: {
            id: 'stone_golem',
            name: 'Stone Golem',
            sprite: '/src/assets/images/enemies/golem.png',
            maxHealth: 80,
            maxShield: 20,
            attack: 12,
            defense: 5,
            speed: 10
        },
        rewards: {
            unlocksModuleId: 'companion_lightning_mage',
            xp: 350,
            currency: 150
        },
        requirements: {
            previousMissionId: '2'
        }
    },
    {
        id: '4',
        title: 'Ice Cavern',
        description: 'An Ice Drake has made its lair in the caverns. It freezes everything in its path.',
        difficulty: 4,
        enemy: {
            id: 'ice_drake',
            name: 'Ice Drake',
            sprite: '/src/assets/images/enemies/ice_drake.png',
            maxHealth: 100,
            maxShield: 40,
            attack: 15,
            defense: 8,
            speed: 15
        },
        rewards: {
            unlocksModuleId: 'companion_earth_defender',
            xp: 500,
            currency: 200
        },
        requirements: {
            previousMissionId: '3'
        }
    },
    {
        id: '5',
        title: 'Dragon\'s Lair',
        description: 'The Red Dragon threatens the entire realm. Assemble your party and defeat it!',
        difficulty: 5,
        enemy: {
            id: 'red_dragon',
            name: 'Red Dragon',
            sprite: '/src/assets/images/enemies/dragon.png',
            maxHealth: 200,
            maxShield: 50,
            attack: 20,
            defense: 10,
            speed: 5
        },
        rewards: {
            unlocksModuleId: 'companion_light_healer',
            xp: 1000,
            currency: 500
        },
        requirements: {
            previousMissionId: '4'
        }
    }
];

export const getMissionById = (id: string): Mission | undefined => {
    return MISSIONS.find(m => m.id === id);
};
