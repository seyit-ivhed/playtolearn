import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import { MONSTERS } from './monsters.data';

export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        title: 'The Hidden Oasis',
        storyHook: "Tariq's homeland is threatened by mysterious scorpions emerging from the ancient oasis. Help him discover the source of the disturbance and restore peace to the desert.",
        completionSummary: "You helped Tariq defeat the Sand Colossus and saved the Hidden Oasis! The desert is safe once more, but new adventures await...",
        illustration: '/assets/illustrations/oasis.webp',
        volumeId: 'origins',
        difficulty: 1,
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 600 },
                enemies: [MONSTERS.SCORPION_1],
                xpReward: 10,
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 900 },
                enemies: [
                    ...Array.from({ length: 3 }).map(() => MONSTERS.TINY_SCORPION)
                ],
                xpReward: 20
            },
            {
                id: '1_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: 0, y: 1200 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                },
                xpReward: 30
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                coordinates: { x: 250, y: 1300 },
                xpReward: 0
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 1600 },
                enemies: [
                    MONSTERS.SCORPION_1,
                    MONSTERS.SCORPION_1,
                    MONSTERS.SCORPION_1
                ],
                xpReward: 50,
            },
            {
                id: '1_6',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1800 },
                enemies: [
                    MONSTERS.SCORPION_RAIDER,
                    MONSTERS.SCORPION_RAIDER,
                    MONSTERS.SCORPION_RAIDER
                ],
                xpReward: 55,
            },
            {
                id: '1_7',
                type: EncounterType.PUZZLE,
                coordinates: { x: 550, y: 2000 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                },
                xpReward: 60
            },
            {
                id: '1_8',
                type: EncounterType.CAMP,
                coordinates: { x: 400, y: 2300 },
                xpReward: 0
            },
            {
                id: '1_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 2700 },
                enemies: [
                    MONSTERS.SAND_SPIRIT_1,
                    MONSTERS.SAND_SPIRIT_1
                ],
                xpReward: 80
            },
            {
                id: '1_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2950 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                },
                xpReward: 90
            },
            {
                id: '1_11',
                type: EncounterType.BATTLE,
                coordinates: { x: 600, y: 3200 },
                enemies: [
                    MONSTERS.SAND_SPIRIT_1,
                    MONSTERS.SAND_SPIRIT_1,
                    MONSTERS.SCORPION_1
                ],
                xpReward: 95
            },
            {
                id: '1_12',
                type: EncounterType.CAMP,
                coordinates: { x: 400, y: 3500 },
                xpReward: 0
            },
            {
                id: '1_13',
                type: EncounterType.BOSS,
                coordinates: { x: -100, y: 3900 },
                enemies: [MONSTERS.SAND_COLOSSUS],
                xpReward: 100
            }
        ]
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
