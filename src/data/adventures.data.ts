import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';

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
                        maxHealth: 40,
                        attack: 8,
                    }
                ],
                xpReward: 10,
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 350, y: 500 },
                enemies: [
                    ...Array.from({ length: 3 }).map(() => ({
                        id: `tiny_scorpion`,
                        maxHealth: 15,
                        attack: 4,
                    }))
                ],
                xpReward: 20
            },
            {
                id: '1_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: 150, y: 800 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                },
                xpReward: 30
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                coordinates: { x: 250, y: 1100 },
                storyBeat: {},
                xpReward: 0
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 350, y: 1400 },
                enemies: [
                    {
                        id: 'scorpion_1',
                        maxHealth: 40,
                        attack: 8,
                    },
                    {
                        id: 'scorpion_1',
                        maxHealth: 40,
                        attack: 8,
                    },
                    {
                        id: 'scorpion_1',
                        maxHealth: 40,
                        attack: 8,
                    }
                ],
                xpReward: 50,
            },
            {
                id: '1_6',
                type: EncounterType.BATTLE,
                coordinates: { x: 150, y: 1700 },
                enemies: [
                    {
                        id: 'scorpion_raider',
                        maxHealth: 50,
                        attack: 10,
                    },
                    {
                        id: 'scorpion_raider',
                        maxHealth: 50,
                        attack: 10,
                    },
                    {
                        id: 'scorpion_raider',
                        maxHealth: 50,
                        attack: 10
                    }
                ],
                xpReward: 55,
            },
            {
                id: '1_7',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2000 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                },
                xpReward: 60
            },
            {
                id: '1_8',
                type: EncounterType.CAMP,
                coordinates: { x: 350, y: 2300 },
                storyBeat: {},
                xpReward: 0
            },
            {
                id: '1_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 150, y: 2600 },
                enemies: [
                    {
                        id: 'sand_spirit_1',
                        maxHealth: 60,
                        attack: 15,
                    },
                    {
                        id: 'sand_spirit_1',
                        maxHealth: 60,
                        attack: 15,
                    }
                ],
                xpReward: 80
            },
            {
                id: '1_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2900 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                },
                xpReward: 90
            },
            {
                id: '1_11',
                type: EncounterType.BATTLE,
                coordinates: { x: 350, y: 3200 },
                enemies: [
                    {
                        id: 'sand_spirit_1',
                        maxHealth: 60,
                        attack: 15,
                    },
                    {
                        id: 'sand_spirit_1',
                        maxHealth: 60,
                        attack: 15,
                    },
                    {
                        id: 'scorpion_1',
                        maxHealth: 40,
                        attack: 8,
                    }
                ],
                xpReward: 95
            },
            {
                id: '1_12',
                type: EncounterType.CAMP,
                coordinates: { x: 150, y: 3500 },
                storyBeat: {},
                xpReward: 0
            },
            {
                id: '1_13',
                type: EncounterType.BOSS,
                coordinates: { x: 250, y: 3800 },
                enemies: [{
                    id: 'sand_colossus',
                    maxHealth: 180,
                    attack: 25,
                    isBoss: true,
                }],
                xpReward: 100
            }
        ]
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
