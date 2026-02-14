import { type Adventure, EncounterType, PuzzleType } from '../../types/adventure.types';
import { MONSTERS } from '../monsters.data';

export const ADVENTURE_1: Adventure = {
    id: '1',
    volumeId: 'origins',
    levelRange: [1, 5],
    encounters: [
        {
            id: '1_1',
            type: EncounterType.BATTLE,
            coordinates: { x: 300, y: 4300 },
            enemies: [MONSTERS.SCORPION_1],
        },
        {
            id: '1_2',
            type: EncounterType.BATTLE,
            coordinates: { x: 250, y: 3900 },
            enemies: [
                ...Array.from({ length: 3 }).map(() => MONSTERS.TINY_SCORPION)
            ],
        },
        {
            id: '1_3',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 3800 },
            puzzleData: {
                puzzleType: PuzzleType.REFILL_CANTEEN
            },
        },
        {
            id: '1_4',
            type: EncounterType.BATTLE,
            coordinates: { x: -250, y: 3500 },
            enemies: [
                MONSTERS.DESERT_SCAVENGER,
                MONSTERS.DESERT_SCAVENGER,
                MONSTERS.DESERT_SCAVENGER
            ],
        },
        {
            id: '1_5',
            type: EncounterType.BATTLE,
            coordinates: { x: 0, y: 3400 },
            enemies: [
                MONSTERS.BANDIT_LEADER,
                MONSTERS.DESERT_SCAVENGER,
                MONSTERS.TINY_SCORPION
            ],
        },
        {
            id: '1_6',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 2900 },
            puzzleData: {
                puzzleType: PuzzleType.BALANCE
            },
        },

        {
            id: '1_7',
            type: EncounterType.BATTLE,
            coordinates: { x: -200, y: 2000 },
            enemies: [
                MONSTERS.SCORPION_1,
                MONSTERS.SCORPION_1,
                MONSTERS.SCORPION_1,
                MONSTERS.SAND_SPIRIT_1
            ],
        },
        {
            id: '1_8',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 1600 },
            puzzleData: {
                puzzleType: PuzzleType.SEQUENCE
            },
        },
        {
            id: '1_9',
            type: EncounterType.BATTLE,
            coordinates: { x: 200, y: 1250 },
            enemies: [
                MONSTERS.SAND_SPIRIT_1,
                MONSTERS.SAND_SPIRIT_1,
                MONSTERS.SCORPION_1
            ],
        },

        {
            id: '1_10',
            type: EncounterType.BOSS,
            coordinates: { x: 0, y: 1000 },
            enemies: [MONSTERS.SAND_COLOSSUS],
        },
        {
            id: '1_11',
            type: EncounterType.ENDING,
            coordinates: { x: 20, y: 420 },
        }
    ]
};
