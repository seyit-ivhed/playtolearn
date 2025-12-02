import { type Mission } from '../types/mission.types';

export const MISSIONS: Mission[] = [
    {
        id: '1',
        title: 'Flight Training',
        description: 'Basic combat training against a target drone. Learn the ropes of your ship systems.',
        difficulty: 1,
        enemy: {
            id: 'training_drone',
            name: 'Training Drone',
            sprite: '/src/assets/images/ships/training_drone.png',
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
        title: 'Asteroid Ambush',
        description: 'A Space Pirate scout has been spotted in the asteroid belt. Intercept and drive them off.',
        difficulty: 2,
        enemy: {
            id: 'pirate_scout',
            name: 'Pirate Scout',
            sprite: '/src/assets/images/ships/pirate_scout.png',
            maxHealth: 50,
            attack: 8,
            defense: 2,
            speed: 12
        },
        rewards: {
            unlocksModuleId: 'weapon_missile_1',
            xp: 200,
            currency: 100
        },
        requirements: {
            previousMissionId: '1'
        }
    },
    {
        id: '3',
        title: 'Nebula Patrol',
        description: 'Patrol the nebula sector. Beware of pirates hiding in the gas clouds.',
        difficulty: 3,
        enemy: {
            id: 'pirate_fighter',
            name: 'Pirate Fighter',
            sprite: '/src/assets/images/ships/pirate_fighter.png',
            maxHealth: 80,
            maxShield: 20,
            attack: 12,
            defense: 5,
            speed: 10
        },
        rewards: {
            unlocksModuleId: 'weapon_plasma_1',
            xp: 350,
            currency: 150
        },
        requirements: {
            previousMissionId: '2'
        }
    },
    {
        id: '4',
        title: 'Rescue Signal',
        description: 'We received a distress signal. A transport ship is under attack by a Pirate Ace.',
        difficulty: 4,
        enemy: {
            id: 'pirate_ace',
            name: 'Pirate Ace',
            sprite: '/src/assets/images/ships/pirate_fighter.png',
            maxHealth: 100,
            maxShield: 40,
            attack: 15,
            defense: 8,
            speed: 15
        },
        rewards: {
            unlocksModuleId: 'shield_energy_1',
            xp: 500,
            currency: 200
        },
        requirements: {
            previousMissionId: '3'
        }
    },
    {
        id: '5',
        title: 'Sector Guardian',
        description: 'The Pirate Mothership has arrived. Defeat it to secure the sector!',
        difficulty: 5,
        enemy: {
            id: 'pirate_mothership',
            name: 'Pirate Mothership',
            sprite: '/src/assets/images/ships/pirate_fighter.png',
            maxHealth: 200,
            maxShield: 50,
            attack: 20,
            defense: 10,
            speed: 5
        },
        rewards: {
            unlocksModuleId: 'special_repair_1',
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
