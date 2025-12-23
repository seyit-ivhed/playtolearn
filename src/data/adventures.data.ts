import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import duneScorpionImg from '../assets/images/enemies/dune-scorpion.png';
import sandSpiritImg from '../assets/images/enemies/sand-spirit.png';
import scorpionRaiderImg from '../assets/images/enemies/scorpion-raider.jpg';
import tinyScorpionImg from '../assets/images/enemies/tiny-scorpion.jpg';
import sandColossusImg from '../assets/images/enemies/the-sand-colossus.jpg';

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
                coordinates: { x: 250, y: 200 },
                enemies: [
                    {
                        id: 'scorpion_1',
                        name: 'Dune Scorpion',
                        sprite: duneScorpionImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 0,
                    }
                ],
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                label: 'Swarm Attack',
                coordinates: { x: 350, y: 500 },
                enemies: [
                    ...Array.from({ length: 3 }).map((_, i) => ({
                        id: `tiny_scorpion_${i}`,
                        name: 'Tiny Scorpion',
                        sprite: tinyScorpionImg,
                        maxHealth: 15,
                        attack: 4,
                        defense: 0,
                    }))
                ]
            },
            {
                id: '1_3',
                type: EncounterType.PUZZLE,
                label: 'Water Flow',
                coordinates: { x: 150, y: 800 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                }
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                label: 'Oasis Shade',
                coordinates: { x: 250, y: 1100 },
                storyBeat: {
                    speaker: 'Tariq',
                    text: 'The sun is harsh, but this shade is cool. We should take a moment to reflect on our journey and share what we have learned.'
                }
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                label: 'Sand Raiders',
                coordinates: { x: 350, y: 1400 },
                enemies: [
                    {
                        id: 'scorpion_3',
                        name: 'Scorpion Raider',
                        sprite: scorpionRaiderImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_4',
                        name: 'Scorpion Raider',
                        sprite: scorpionRaiderImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_5',
                        name: 'Scorpion Raider',
                        sprite: scorpionRaiderImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    }
                ],
            },
            {
                id: '1_6',
                type: EncounterType.PUZZLE,
                label: 'Weighing Rocks',
                coordinates: { x: 150, y: 1700 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                }
            },
            {
                id: '1_7',
                type: EncounterType.CAMP,
                label: 'Night Camp',
                coordinates: { x: 250, y: 2000 },
                storyBeat: {
                    speaker: 'Amara',
                    text: 'The desert is beautiful at night. I can smell the Oasis nearby. We are getting closer to our goal!'
                }
            },
            {
                id: '1_8',
                type: EncounterType.BATTLE,
                label: 'Mirages',
                coordinates: { x: 350, y: 2300 },
                enemies: [
                    {
                        id: 'sand_spirit_1',
                        name: 'Sand Spirit',
                        sprite: sandSpiritImg,
                        maxHealth: 35,
                        attack: 6,
                        defense: 1,
                    },
                    {
                        id: 'sand_spirit_2',
                        name: 'Sand Spirit',
                        sprite: sandSpiritImg,
                        maxHealth: 35,
                        attack: 6,
                        defense: 1,
                    }
                ]
            },
            {
                id: '1_9',
                type: EncounterType.PUZZLE,
                label: 'Star Map',
                coordinates: { x: 150, y: 2600 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                }
            },
            {
                id: '1_10',
                type: EncounterType.BOSS,
                label: 'The Sand Colossus',
                coordinates: { x: 250, y: 2900 },
                enemies: [{
                    id: 'sand_colossus',
                    name: 'Sand Colossus',
                    sprite: sandColossusImg,
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
