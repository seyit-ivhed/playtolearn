import { type Adventure, EncounterType } from '../types/adventure.types';
import goblinImg from '../assets/images/enemies/goblin.png';
import goblinBossImg from '../assets/images/enemies/goblin_boss.png';

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
                enemies: [{
                    id: 'goblin_scout_weak',
                    name: 'Goblin Scout',
                    sprite: goblinImg,
                    maxHealth: 40, // Doubled for extended encounters
                    attack: 4,     // Reduced for juniors
                    defense: 0,
                    speed: 5
                }]
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                label: 'Ambush!',
                coordinates: { x: 350, y: 450 },
                enemies: [
                    {
                        id: 'goblin_scout_normal_1',
                        name: 'Angry Goblin',
                        sprite: goblinImg,
                        maxHealth: 50,
                        attack: 5,
                        defense: 0,
                        speed: 6
                    },
                    {
                        id: 'goblin_scout_normal_2',
                        name: 'Sneaky Goblin',
                        sprite: goblinImg,
                        maxHealth: 40,
                        attack: 4,
                        defense: 0,
                        speed: 7
                    }
                ]
            },
            {
                id: '1_3',
                type: EncounterType.BOSS,
                label: 'Leader Found',
                coordinates: { x: 250, y: 650 },
                enemies: [{
                    id: 'goblin_chief',
                    name: 'Goblin Chief',
                    sprite: goblinBossImg, // Placeholder path
                    maxHealth: 80,
                    maxShield: 10,
                    attack: 8,
                    defense: 2,
                    speed: 4
                }]
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                label: 'Rest Site',
                coordinates: { x: 250, y: 850 }
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
