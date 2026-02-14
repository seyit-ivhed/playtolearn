import { type Adventure, EncounterType, PuzzleType } from '../../types/adventure.types';
import { MONSTERS } from '../monsters.data';

export const ADVENTURE_3: Adventure = {
    id: '3',
    volumeId: 'origins',
    levelRange: [7, 8],
    encounters: [
        {
            id: '3_1',
            type: EncounterType.BATTLE,
            coordinates: { x: 0, y: 4300 },
            enemies: [MONSTERS.MIST_RONIN, MONSTERS.MIST_RONIN],
            unlocksCompanion: 'kenji',
        },
        {
            id: '3_2',
            type: EncounterType.BATTLE,
            coordinates: { x: 300, y: 3800 },
            enemies: [MONSTERS.MIST_RONIN, MONSTERS.MIST_RONIN, MONSTERS.MIST_RONIN],
        },

        {
            id: '3_3',
            type: EncounterType.PUZZLE,
            coordinates: { x: 0, y: 3600 },
            puzzleData: { puzzleType: PuzzleType.MIRROR },
        },
        {
            id: '3_4',
            type: EncounterType.BATTLE,
            coordinates: { x: -150, y: 3100 },
            enemies: [MONSTERS.SAMURAI_SOLDIER, MONSTERS.SAMURAI_SOLDIER, MONSTERS.MIST_RONIN],
        },
        {
            id: '3_5',
            type: EncounterType.BATTLE,
            coordinates: { x: -60, y: 2500 },
            enemies: [MONSTERS.MIST_RONIN, MONSTERS.MIST_RONIN, MONSTERS.SAMURAI_SOLDIER],
        },

        {
            id: '3_6',
            type: EncounterType.PUZZLE,
            coordinates: { x: 150, y: 2000 },
            puzzleData: { puzzleType: PuzzleType.NUMBER_PATH },
        },
        {
            id: '3_7',
            type: EncounterType.BATTLE,
            coordinates: { x: 250, y: 1600 },
            enemies: [MONSTERS.SAMURAI_SOLDIER, MONSTERS.SAMURAI_SOLDIER, MONSTERS.SAMURAI_SOLDIER],
        },
        {
            id: '3_8',
            type: EncounterType.PUZZLE,
            coordinates: { x: 200, y: 1300 },
            puzzleData: { puzzleType: PuzzleType.SEQUENCE },
        },

        {
            id: '3_9',
            type: EncounterType.BOSS,
            coordinates: { x: -50, y: 800 },
            enemies: [MONSTERS.SAMURAI_COMMANDER],
        },
        {
            id: '3_10',
            type: EncounterType.ENDING,
            coordinates: { x: -300, y: 400 },
        }
    ]
};
