import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import duneScorpionImg from '../assets/images/enemies/dune-scorpion.png';
import sandSpiritImg from '../assets/images/enemies/sand-spirit.png';
import scorpionRaiderImg from '../assets/images/enemies/scorpion-raider.jpg';
import tinyScorpionImg from '../assets/images/enemies/tiny-scorpion.jpg';
import sandColossusImg from '../assets/images/enemies/the-sand-colossus.jpg';

export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        difficulty: 1,
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                coordinates: { x: 250, y: 200 },
                enemies: [
                    {
                        id: 'scorpion_1',
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
                coordinates: { x: 350, y: 500 },
                enemies: [
                    ...Array.from({ length: 3 }).map(() => ({
                        id: `tiny_scorpion`,
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
                coordinates: { x: 150, y: 800 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                }
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                coordinates: { x: 250, y: 1100 },
                storyBeat: {}
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 350, y: 1400 },
                enemies: [
                    {
                        id: 'scorpion_raider',
                        sprite: scorpionRaiderImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_raider',
                        sprite: scorpionRaiderImg,
                        maxHealth: 40,
                        attack: 8,
                        defense: 2,
                    },
                    {
                        id: 'scorpion_raider',
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
                coordinates: { x: 150, y: 1700 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                }
            },
            {
                id: '1_7',
                type: EncounterType.CAMP,
                coordinates: { x: 250, y: 2000 },
                storyBeat: {}
            },
            {
                id: '1_8',
                type: EncounterType.BATTLE,
                coordinates: { x: 350, y: 2300 },
                enemies: [
                    {
                        id: 'sand_spirit_1',
                        sprite: sandSpiritImg,
                        maxHealth: 35,
                        attack: 6,
                        defense: 1,
                    },
                    {
                        id: 'sand_spirit_1',
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
                coordinates: { x: 150, y: 2600 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                }
            },
            {
                id: '1_10',
                type: EncounterType.BOSS,
                coordinates: { x: 250, y: 2900 },
                enemies: [{
                    id: 'sand_colossus',
                    sprite: sandColossusImg,
                    maxHealth: 200,
                    maxShield: 50,
                    attack: 18,
                    defense: 8,
                }],
            }
        ],
        rewards: {}
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
