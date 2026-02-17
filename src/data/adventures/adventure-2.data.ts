import { type Adventure, EncounterType, PuzzleType } from '../../types/adventure.types';
import { MONSTERS } from '../monsters.data';

export const ADVENTURE_2: Adventure = {
    id: '2',
    levelRange: [5, 7],
    encounters: [
        {
            id: '2_1',
            type: EncounterType.BATTLE,
            coordinates: { x: -200, y: 700 },
            enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
        },
        {
            id: '2_2',
            type: EncounterType.PUZZLE,
            coordinates: { x: 150, y: 750 },
            puzzleData: { puzzleType: PuzzleType.REFILL_CANTEEN },
        },
        {
            id: '2_3',
            type: EncounterType.BATTLE,
            coordinates: { x: 80, y: 1300 },
            enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
        },

        {
            id: '2_4',
            type: EncounterType.BATTLE,
            coordinates: { x: 0, y: 1700 },
            enemies: [MONSTERS.BANDIT_LEADER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
        },
        {
            id: '2_5',
            type: EncounterType.BATTLE,
            coordinates: { x: 0, y: 2400 },
            enemies: [MONSTERS.STONE_GUARDIAN, MONSTERS.STONE_GUARDIAN],
        },
        {
            id: '2_6',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 2650 },
            puzzleData: { puzzleType: PuzzleType.EQUATION },
        },

        {
            id: '2_7',
            type: EncounterType.BATTLE,
            coordinates: { x: 100, y: 2950 },
            enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.STONE_GUARDIAN],
        },
        {
            id: '2_8',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 3400 },
            puzzleData: { puzzleType: PuzzleType.LATIN_SQUARE },
        },
        {
            id: '2_9',
            type: EncounterType.BATTLE,
            coordinates: { x: 200, y: 4100 },
            enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.ASSYRIAN_GUARDIAN],
        },

        {
            id: '2_10',
            type: EncounterType.BOSS,
            coordinates: { x: -300, y: 4100 },
            enemies: [MONSTERS.THE_STONE_EMPEROR],
        },
        {
            id: '2_11',
            type: EncounterType.ENDING,
            coordinates: { x: 0, y: 4300 },
        }
    ]
};
