import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import { MONSTERS } from './monsters.data';


export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        volumeId: 'origins',
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 600 },
                enemies: [MONSTERS.SCORPION_1],
                xpReward: 10,
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                coordinates: { x: -250, y: 900 },
                enemies: [
                    ...Array.from({ length: 3 }).map(() => MONSTERS.TINY_SCORPION)
                ],
                xpReward: 20
            },
            {
                id: '1_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: -150, y: 1200 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                },
                xpReward: 30
            },
            {
                id: '1_4',
                type: EncounterType.CAMP,
                coordinates: { x: 50, y: 1300 },
                xpReward: 0
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 1600 },
                enemies: [
                    MONSTERS.DESERT_SCAVENGER,
                    MONSTERS.DESERT_SCAVENGER,
                    MONSTERS.DESERT_SCAVENGER
                ],
                xpReward: 50,
            },
            {
                id: '1_6',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 1800 },
                enemies: [
                    MONSTERS.BANDIT_LEADER,
                    MONSTERS.DESERT_SCAVENGER
                ],
                xpReward: 60,
            },
            {
                id: '1_7',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2000 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                },
                xpReward: 70
            },
            {
                id: '1_8',
                type: EncounterType.CAMP,
                coordinates: { x: 50, y: 2300 },
                xpReward: 0
            },
            {
                id: '1_9',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 2700 },
                enemies: [
                    MONSTERS.SCORPION_1,
                    MONSTERS.SCORPION_1,
                    MONSTERS.SAND_SPIRIT_1
                ],
                xpReward: 80
            },
            {
                id: '1_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 0, y: 2950 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                },
                xpReward: 90
            },
            {
                id: '1_11',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 3200 },
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
                coordinates: { x: 80, y: 3450 },
                xpReward: 0
            },
            {
                id: '1_13',
                type: EncounterType.BOSS,
                coordinates: { x: -100, y: 3850 },
                enemies: [MONSTERS.SAND_COLOSSUS],
                xpReward: 100
            },
            {
                id: '1_14',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 3850 },
                xpReward: 0,
                label: 'To the Ruins'
            }
        ]
    },
    {
        id: '2',
        volumeId: 'origins',
        encounters: [
            {
                id: '2_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -250, y: 800 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
                xpReward: 100
            },
            {
                id: '2_2',
                type: EncounterType.PUZZLE,
                coordinates: { x: 100, y: 900 },
                puzzleData: { puzzleType: PuzzleType.SUM_TARGET },
                xpReward: 110
            },
            {
                id: '2_3',
                type: EncounterType.BATTLE,
                coordinates: { x: 170, y: 1150 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
                xpReward: 120
            },
            {
                id: '2_4',
                type: EncounterType.CAMP,
                coordinates: { x: -80, y: 1520 },
                xpReward: 0
            },
            {
                id: '2_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1950 },
                enemies: [MONSTERS.BANDIT_LEADER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
                xpReward: 130
            },
            {
                id: '2_6',
                type: EncounterType.BATTLE,
                coordinates: { x: -220, y: 1950 },
                enemies: [MONSTERS.STONE_GUARDIAN, MONSTERS.STONE_GUARDIAN],
                xpReward: 140
            },
            {
                id: '2_7',
                type: EncounterType.PUZZLE,
                coordinates: { x: -250, y: 2600 },
                puzzleData: { puzzleType: PuzzleType.BALANCE },
                xpReward: 150
            },
            {
                id: '2_8',
                type: EncounterType.CAMP,
                coordinates: { x: -150, y: 2950 },
                xpReward: 0
            },
            {
                id: '2_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 180, y: 2800 },
                enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.STONE_GUARDIAN],
                xpReward: 160
            },
            {
                id: '2_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 350, y: 3000 },
                puzzleData: { puzzleType: PuzzleType.GUARDIAN_TRIBUTE },
                xpReward: 170
            },
            {
                id: '2_11',
                type: EncounterType.BATTLE,
                coordinates: { x: 300, y: 4050 },
                enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.ASSYRIAN_GUARDIAN],
                xpReward: 180
            },
            {
                id: '2_12',
                type: EncounterType.CAMP,
                coordinates: { x: 0, y: 4300 },
                xpReward: 0
            },
            {
                id: '2_13',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 3700 },
                enemies: [MONSTERS.THE_STONE_EMPEROR],
                xpReward: 200
            },
            {
                id: '2_14',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 4100 },
                xpReward: 0,
                label: 'Journey Onward'
            }
        ]
    },
    {
        id: '3',
        volumeId: 'origins',
        encounters: [
            {
                id: '3_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 800 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER],
                xpReward: 150,
                label: 'First Contact'
            },
            {
                id: '3_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 150, y: 1000 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER],
                xpReward: 160,
                label: 'The Mist Thickens'
            },
            {
                id: '3_3',
                type: EncounterType.CAMP,
                coordinates: { x: -50, y: 1300 },
                xpReward: 0,
                label: 'Resting Place'
            },
            {
                id: '3_4',
                type: EncounterType.PUZZLE,
                coordinates: { x: -250, y: 1600 },
                puzzleData: { puzzleType: PuzzleType.SYMMETRY },
                xpReward: 180,
                label: 'The Mirror Mist'
            },
            {
                id: '3_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1900 },
                enemies: [MONSTERS.IRON_MINION],
                xpReward: 200,
                label: 'Stone Guardian'
            },
            {
                id: '3_6',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 2200 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER, MONSTERS.IRON_MINION],
                xpReward: 220,
                label: 'Ambuscade'
            },
            {
                id: '3_7',
                type: EncounterType.CAMP,
                coordinates: { x: 50, y: 2500 },
                xpReward: 0,
                label: 'Foothold'
            },
            {
                id: '3_8',
                type: EncounterType.PUZZLE,
                coordinates: { x: 300, y: 2800 },
                puzzleData: { puzzleType: PuzzleType.LATIN_SQUARE },
                xpReward: 250,
                label: 'The Keystone Cipher'
            },
            {
                id: '3_9',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 3100 },
                enemies: [MONSTERS.IRON_MINION, MONSTERS.IRON_MINION],
                xpReward: 270,
                label: 'Heavy Resistance'
            },
            {
                id: '3_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 3400 },
                puzzleData: { puzzleType: PuzzleType.SEQUENCE },
                xpReward: 280,
                label: 'The Star Path'
            },
            {
                id: '3_11',
                type: EncounterType.CAMP,
                coordinates: { x: 0, y: 3700 },
                xpReward: 0,
                label: 'Last Stand Prep'
            },
            {
                id: '3_12',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 4100 },
                enemies: [MONSTERS.IRON_WARLORD_ENFORCER],
                xpReward: 500,
                label: 'The Iron Warlord Enforcer'
            },
            {
                id: '3_13',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 4400 },
                xpReward: 0,
                label: 'To the Jade Peaks'
            }
        ]
    },
    {
        id: '4',
        volumeId: 'origins',
        encounters: [] // To be implemented: Rise of the Iron Warlord (Premium) - Journey to fortress, Defeat the Iron Warlord
    },
    {
        id: '5',
        volumeId: 'origins',
        encounters: [] // To be implemented: The Scorched Plains (Free) - Intro to Savannah, meet Zahara
    },
    {
        id: '6',
        volumeId: 'origins',
        encounters: [] // To be implemented: Harmony Restored (Premium) - Calming Spirit King
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
