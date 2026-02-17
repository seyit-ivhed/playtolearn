import { type Adventure, EncounterType, PuzzleType } from '../../types/adventure.types';
import { MONSTERS } from '../monsters.data';

export const ADVENTURE_4: Adventure = {
    id: '4',
    levelRange: [8, 10],
    encounters: [
        {
            id: '4_1',
            type: EncounterType.BATTLE,
            coordinates: { x: -200, y: 4300 },
            enemies: [MONSTERS.NINJA_SCOUT, MONSTERS.NINJA_SCOUT],
        },
        {
            id: '4_2',
            type: EncounterType.BATTLE,
            coordinates: { x: 200, y: 4050 },
            enemies: [MONSTERS.NINJA_SCOUT, MONSTERS.NINJA_SCOUT, MONSTERS.WAR_HOUND],
        },
        {
            id: '4_3',
            type: EncounterType.BATTLE,
            coordinates: { x: 0, y: 3900 },
            enemies: [MONSTERS.SAMURAI_VANGUARD, MONSTERS.WAR_HOUND],
        },
        {
            id: '4_4',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 3500 },
            puzzleData: { puzzleType: PuzzleType.NUMBER_PATH },
        },
        {
            id: '4_5',
            type: EncounterType.BATTLE,
            coordinates: { x: -100, y: 2900 },
            enemies: [MONSTERS.SAMURAI_ARCHER, MONSTERS.SAMURAI_VANGUARD],
        },
        {
            id: '4_6',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 2450 },
            puzzleData: { puzzleType: PuzzleType.EQUATION },
        },
        {
            id: '4_7',
            type: EncounterType.BATTLE,
            coordinates: { x: 150, y: 1850 },
            enemies: [MONSTERS.WAR_HOUND, MONSTERS.WAR_HOUND, MONSTERS.WAR_HOUND],
        },
        {
            id: '4_8',
            type: EncounterType.BATTLE,
            coordinates: { x: -250, y: 1800 },
            enemies: [MONSTERS.SAMURAI_ARCHER, MONSTERS.SAMURAI_ARCHER],
        },
        {
            id: '4_9',
            type: EncounterType.PUZZLE,
            coordinates: { x: 50, y: 1350 },
            puzzleData: { puzzleType: PuzzleType.LATIN_SQUARE },
        },
        {
            id: '4_10',
            type: EncounterType.BATTLE,
            coordinates: { x: -150, y: 1150 },
            enemies: [MONSTERS.SAMURAI_VANGUARD, MONSTERS.NINJA_SCOUT, MONSTERS.NINJA_SCOUT],
        },
        {
            id: '4_11',
            type: EncounterType.BOSS,
            coordinates: { x: 0, y: 800 },
            enemies: [MONSTERS.EVIL_SHOGUN],
        },
        {
            id: '4_12',
            type: EncounterType.ENDING,
            coordinates: { x: 0, y: 400 },
        }
    ]
};
