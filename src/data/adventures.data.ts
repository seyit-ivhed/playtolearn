import { type Adventure, EncounterType } from '../types/adventure.types';
import goblinImg from '../assets/images/enemies/goblin.png';
import goblinBossImg from '../assets/images/enemies/goblin_boss.png';

export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        title: 'The Oasis Quest',
        description: 'Venture through the Luminescent Desert to reach the Oasis and uncover its secrets.',
        difficulty: 1,
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                label: 'Desert Dust-up',
                coordinates: { x: 250, y: 150 },
                enemies: [
                    {
                        id: 'scorpion_1',
                        name: 'Dune Scorpion',
                        sprite: goblinImg,
                        maxHealth: 30,
                        attack: 5,
                        defense: 0,
                    },
                    {
                        id: 'scorpion_2',
                        name: 'Dune Scorpion',
                        sprite: goblinImg,
                        maxHealth: 30,
                        attack: 5,
                        defense: 0,
                    }
                ],
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                label: 'Mirages',
                coordinates: { x: 350, y: 300 },
                enemies: [
                    {
                        id: 'sand_spirit_1',
                        name: 'Sand Spirit',
                        sprite: goblinImg,
                        maxHealth: 35,
                        attack: 6,
                        defense: 1,
                    },
                    {
                        id: 'sand_spirit_2',
                        name: 'Sand Spirit',
                        sprite: goblinImg,
                        maxHealth: 35,
                        attack: 6,
                        defense: 1,
                    }
                ],
            },
            {
                id: '1_3',
                type: EncounterType.BATTLE, // Puzzle mocked as Battle
                label: 'Water Flow',
                coordinates: { x: 150, y: 450 },
                enemies: [
                    {
                        id: 'arithmetic_lock',
                        name: 'Arithmetic Lock',
                        sprite: goblinImg,
                        maxHealth: 80,
                        attack: 2,
                        defense: 5,
                    }
                ],
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                label: 'Oasis Shade',
                coordinates: { x: 250, y: 600 },
                storyBeat: {
                    speaker: 'Tariq',
                    text: 'The sun is harsh, but this shade is cool. We should take a moment to reflect on our journey and share what we have learned.'
                }
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                label: 'Sand Raiders',
                coordinates: { x: 350, y: 750 },
                enemies: [
                    {
                        id: 'scorpion_3',
                        name: 'Scorpion Raider',
                        sprite: goblinImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_4',
                        name: 'Scorpion Raider',
                        sprite: goblinImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_5',
                        name: 'Scorpion Raider',
                        sprite: goblinImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    }
                ],
            },
            {
                id: '1_6',
                type: EncounterType.BATTLE, // Puzzle mocked as Battle
                label: 'Weighing Rocks',
                coordinates: { x: 150, y: 900 },
                enemies: [
                    {
                        id: 'subtraction_balance',
                        name: 'Subtraction Balance',
                        sprite: goblinImg,
                        maxHealth: 100,
                        attack: 4,
                        defense: 10,
                    }
                ],
            },
            {
                id: '1_7',
                type: EncounterType.CAMP,
                label: 'Night Camp',
                coordinates: { x: 250, y: 1050 },
                storyBeat: {
                    speaker: 'Amara',
                    text: 'The desert is beautiful at night. I can smell the Oasis nearby. We are getting closer to our goal!'
                }
            },
            {
                id: '1_8',
                type: EncounterType.BATTLE,
                label: 'Swarm Attack',
                coordinates: { x: 350, y: 1200 },
                enemies: [
                    ...Array.from({ length: 4 }).map((_, i) => ({
                        id: `tiny_scorpion_${i}`,
                        name: 'Tiny Scorpion',
                        sprite: goblinImg,
                        maxHealth: 15,
                        attack: 4,
                        defense: 0,
                    }))
                ],
            },
            {
                id: '1_9',
                type: EncounterType.BATTLE, // Puzzle mocked as Battle
                label: 'Star Map',
                coordinates: { x: 150, y: 1350 },
                enemies: [
                    {
                        id: 'multiplication_path',
                        name: 'Multiplication Path',
                        sprite: goblinImg,
                        maxHealth: 120,
                        attack: 5,
                        defense: 5,
                    }
                ],
            },
            {
                id: '1_10',
                type: EncounterType.BOSS,
                label: 'The Sand Colossus',
                coordinates: { x: 250, y: 1500 },
                enemies: [{
                    id: 'sand_colossus',
                    name: 'Sand Colossus',
                    sprite: goblinBossImg,
                    maxHealth: 200,
                    maxShield: 50,
                    attack: 18,
                    defense: 8,
                }],
            }
        ],
        rewards: {
            xp: 500,
            currency: 250
        }
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
