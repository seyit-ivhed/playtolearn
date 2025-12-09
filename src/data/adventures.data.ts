import { type Adventure, EncounterType } from '../types/adventure.types';

export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        title: 'Training Patrol',
        description: 'The village elder has sent you to patrol the outskirts. Keep an eye out for trouble!',
        difficulty: 1,
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                label: 'Scout Sighting',
                coordinates: { x: 250, y: 250 },
                enemy: {
                    id: 'goblin_scout_weak',
                    name: 'Goblin Scout',
                    sprite: '/src/assets/images/enemies/goblin.png',
                    maxHealth: 20, // Reduced for juniors
                    attack: 4,     // Reduced for juniors
                    defense: 0,
                    speed: 5
                }
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                label: 'Ambush!',
                coordinates: { x: 350, y: 450 },
                enemy: {
                    id: 'goblin_scout_normal',
                    name: 'Angry Goblin',
                    sprite: '/src/assets/images/enemies/goblin.png',
                    maxHealth: 25,
                    attack: 5,
                    defense: 0,
                    speed: 6
                }
            },
            {
                id: '1_3',
                type: EncounterType.BOSS,
                label: 'Leader Found',
                coordinates: { x: 250, y: 650 },
                enemy: {
                    id: 'goblin_chief',
                    name: 'Goblin Chief',
                    sprite: '/src/assets/images/enemies/goblin_boss.png', // Placeholder path
                    maxHealth: 40,
                    maxShield: 10,
                    attack: 8,
                    defense: 2,
                    speed: 4
                }
            }
        ],
        rewards: {
            xp: 100,
            currency: 50
        }
    }
    // Future adventures commented out for prototype focus
    /*
    {
        id: '2',
        title: 'Forest Ambush',
        ...
    }
    */
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
