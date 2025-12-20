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
                        sprite: goblinImg, // Placeholder
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
                        sprite: goblinImg, // Placeholder
                        maxHealth: 30,
                        attack: 6,
                        defense: 1,
                    },
                    {
                        id: 'sand_spirit_2',
                        name: 'Sand Spirit',
                        sprite: goblinImg, // Placeholder
                        maxHealth: 30,
                        attack: 6,
                        defense: 1,
                    }
                ],
            },
            {
                id: '1_3',
                type: EncounterType.BATTLE, // Mocking Puzzle for now as requested
                label: 'Water Flow',
                coordinates: { x: 250, y: 450 },
                enemies: [
                    {
                        id: 'puzzle_mock_1',
                        name: 'Arithmetic Lock',
                        sprite: goblinImg, // Placeholder
                        maxHealth: 100,
                        attack: 2,
                        defense: 5,
                    }
                ],
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                label: 'Oasis Shade',
                coordinates: { x: 450, y: 600 },
                storyBeat: {
                    speaker: 'Tariq',
                    text: 'The sun is harsh, but this shade is cool. We should take a moment to reflect on our journey and share what we have learned.'
                }
            },
            {
                id: '1_10',
                type: EncounterType.BOSS,
                label: 'The Sand Colossus',
                coordinates: { x: 250, y: 900 },
                enemies: [{
                    id: 'sand_colossus',
                    name: 'Sand Colossus',
                    sprite: goblinBossImg,
                    maxHealth: 120,
                    maxShield: 50,
                    attack: 15,
                    defense: 5,
                }],
            }
        ],
        rewards: {
            xp: 150, // Reduced since we give per-encounter XP now
            currency: 100
        }
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
