import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import { MONSTERS } from './monsters.data';

export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        volumeId: 'origins',
        levelRange: [1, 5],
        encounters: [
            {
                id: '1_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 600 },
                enemies: [MONSTERS.SCORPION_1],
            },
            {
                id: '1_2',
                type: EncounterType.BATTLE,
                coordinates: { x: -250, y: 900 },
                enemies: [
                    ...Array.from({ length: 3 }).map(() => MONSTERS.TINY_SCORPION)
                ],
            },
            {
                id: '1_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: -150, y: 1200 },
                puzzleData: {
                    puzzleType: PuzzleType.SUM_TARGET
                },
            },
            {
                id: '1_4',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 1600 },
                enemies: [
                    MONSTERS.DESERT_SCAVENGER,
                    MONSTERS.DESERT_SCAVENGER,
                    MONSTERS.DESERT_SCAVENGER
                ],
            },
            {
                id: '1_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 1800 },
                enemies: [
                    MONSTERS.BANDIT_LEADER,
                    MONSTERS.DESERT_SCAVENGER,
                    MONSTERS.DESERT_SCAVENGER
                ],
            },
            {
                id: '1_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2000 },
                puzzleData: {
                    puzzleType: PuzzleType.BALANCE
                },
            },

            {
                id: '1_7',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 2700 },
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
                coordinates: { x: 0, y: 2950 },
                puzzleData: {
                    puzzleType: PuzzleType.SEQUENCE
                },
            },
            {
                id: '1_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 3200 },
                enemies: [
                    MONSTERS.SAND_SPIRIT_1,
                    MONSTERS.SAND_SPIRIT_1,
                    MONSTERS.SCORPION_1
                ],
            },

            {
                id: '1_10',
                type: EncounterType.BOSS,
                coordinates: { x: -100, y: 3850 },
                enemies: [MONSTERS.SAND_COLOSSUS],
            },
            {
                id: '1_11',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 3850 },
            }
        ]
    },
    {
        id: '2',
        volumeId: 'origins',
        levelRange: [5, 7],
        encounters: [
            {
                id: '2_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -250, y: 800 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
            },
            {
                id: '2_2',
                type: EncounterType.PUZZLE,
                coordinates: { x: 100, y: 900 },
                puzzleData: { puzzleType: PuzzleType.SUM_TARGET },
            },
            {
                id: '2_3',
                type: EncounterType.BATTLE,
                coordinates: { x: 170, y: 1150 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
            },

            {
                id: '2_4',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1950 },
                enemies: [MONSTERS.BANDIT_LEADER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
            },
            {
                id: '2_5',
                type: EncounterType.BATTLE,
                coordinates: { x: -220, y: 1950 },
                enemies: [MONSTERS.STONE_GUARDIAN, MONSTERS.STONE_GUARDIAN],
            },
            {
                id: '2_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: -250, y: 2600 },
                puzzleData: { puzzleType: PuzzleType.BALANCE },
            },

            {
                id: '2_7',
                type: EncounterType.BATTLE,
                coordinates: { x: 180, y: 2800 },
                enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.STONE_GUARDIAN],
            },
            {
                id: '2_8',
                type: EncounterType.PUZZLE,
                coordinates: { x: 350, y: 3000 },
                puzzleData: { puzzleType: PuzzleType.GUARDIAN_TRIBUTE },
            },
            {
                id: '2_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 300, y: 4050 },
                enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.ASSYRIAN_GUARDIAN],
            },

            {
                id: '2_10',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 3700 },
                enemies: [MONSTERS.THE_STONE_EMPEROR],
            },
            {
                id: '2_11',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 4100 },
            }
        ]
    },
    {
        id: '3',
        volumeId: 'origins',
        levelRange: [7, 8],
        encounters: [
            {
                id: '3_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 800 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER],
                unlocksCompanion: 'kenji',
            },
            {
                id: '3_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 150, y: 1000 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER],
            },

            {
                id: '3_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: -250, y: 1600 },
                puzzleData: { puzzleType: PuzzleType.SYMMETRY },
            },
            {
                id: '3_4',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1900 },
                enemies: [MONSTERS.IRON_MINION, MONSTERS.IRON_MINION],
            },
            {
                id: '3_5',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 2200 },
                enemies: [MONSTERS.MIST_STALKER, MONSTERS.MIST_STALKER, MONSTERS.IRON_MINION],
            },

            {
                id: '3_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: 300, y: 2800 },
                puzzleData: { puzzleType: PuzzleType.LATIN_SQUARE },
            },
            {
                id: '3_7',
                type: EncounterType.BATTLE,
                coordinates: { x: -100, y: 3100 },
                enemies: [MONSTERS.IRON_MINION, MONSTERS.IRON_MINION, MONSTERS.IRON_MINION],
            },
            {
                id: '3_8',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 3400 },
                puzzleData: { puzzleType: PuzzleType.SEQUENCE },
            },

            {
                id: '3_9',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 4100 },
                enemies: [MONSTERS.IRON_WARLORD_ENFORCER],
            },
            {
                id: '3_10',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 4400 },
            }
        ]
    },
    {
        id: '4',
        volumeId: 'origins',
        levelRange: [8, 10],
        encounters: [
            {
                id: '4_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 800 },
                enemies: [MONSTERS.CLOCKWORK_SCOUT, MONSTERS.CLOCKWORK_SCOUT],
            },
            {
                id: '4_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 100, y: 1100 },
                enemies: [MONSTERS.CLOCKWORK_SCOUT, MONSTERS.CLOCKWORK_SCOUT, MONSTERS.MECHANICAL_HOUND],
            },
            {
                id: '4_3',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1500 },
                enemies: [MONSTERS.STEAM_VANGUARD, MONSTERS.MECHANICAL_HOUND],
            },
            {
                id: '4_4',
                type: EncounterType.PUZZLE,
                coordinates: { x: -150, y: 1900 },
                puzzleData: { puzzleType: PuzzleType.GEOMETRY },
            },
            {
                id: '4_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 50, y: 2300 },
                enemies: [MONSTERS.IRON_GRENADIER, MONSTERS.STEAM_VANGUARD],
            },
            {
                id: '4_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2700 },
                puzzleData: { puzzleType: PuzzleType.SYMMETRY },
            },
            {
                id: '4_7',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 3100 },
                enemies: [MONSTERS.MECHANICAL_HOUND, MONSTERS.MECHANICAL_HOUND, MONSTERS.MECHANICAL_HOUND],
            },
            {
                id: '4_8',
                type: EncounterType.BATTLE,
                coordinates: { x: 150, y: 3400 },
                enemies: [MONSTERS.IRON_GRENADIER, MONSTERS.IRON_GRENADIER],
            },
            {
                id: '4_9',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 3800 },
                puzzleData: { puzzleType: PuzzleType.GUARDIAN_TRIBUTE },
            },
            {
                id: '4_10',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 4000 },
                enemies: [MONSTERS.STEAM_VANGUARD, MONSTERS.CLOCKWORK_SCOUT, MONSTERS.CLOCKWORK_SCOUT],
            },
            {
                id: '4_11',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 3500 },
                enemies: [MONSTERS.IRON_WARLORD],
            },
            {
                id: '4_12',
                type: EncounterType.ENDING,
                coordinates: { x: 0, y: 3000 },
            }
        ]
    },
    {
        id: '5',
        volumeId: 'origins',
        levelRange: [10, 11],
        encounters: [
            {
                id: '5_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 800 },
                enemies: [MONSTERS.BLAZE_HYENA, MONSTERS.BLAZE_HYENA],
                unlocksCompanion: 'zahara',
            },
            {
                id: '5_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 100, y: 1100 },
                enemies: [MONSTERS.EMBER_LIONESS, MONSTERS.EMBER_LIONESS],
            },
            {
                id: '5_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: 200, y: 1500 },
                puzzleData: { puzzleType: PuzzleType.SUM_TARGET },
            },
            {
                id: '5_4',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 1900 },
                enemies: [MONSTERS.SUN_SCORCHED_RHINO, MONSTERS.BLAZE_HYENA],
            },
            {
                id: '5_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 50, y: 2300 },
                enemies: [MONSTERS.EMBER_LIONESS, MONSTERS.BLAZE_HYENA, MONSTERS.BLAZE_HYENA],
            },
            {
                id: '5_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2700 },
                puzzleData: { puzzleType: PuzzleType.GEOMETRY },
            },
            {
                id: '5_7',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 3100 },
                enemies: [MONSTERS.MIRAGE_SPIRIT, MONSTERS.MIRAGE_SPIRIT],
            },
            {
                id: '5_8',
                type: EncounterType.PUZZLE,
                coordinates: { x: 150, y: 3400 },
                puzzleData: { puzzleType: PuzzleType.SYMMETRY },
            },
            {
                id: '5_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 250, y: 3800 },
                enemies: [MONSTERS.SUN_SCORCHED_RHINO, MONSTERS.MIRAGE_SPIRIT],
            },
            {
                id: '5_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: -150, y: 4000 },
                puzzleData: { puzzleType: PuzzleType.SEQUENCE },
            },
            {
                id: '5_11',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 3500 },
                enemies: [MONSTERS.INFERNO_MANE],
            },
            {
                id: '5_12',
                type: EncounterType.ENDING,
                coordinates: { x: 0, y: 3000 },
            }
        ]
    },
    {
        id: '6',
        volumeId: 'origins',
        levelRange: [11, 12],
        encounters: [
            {
                id: '6_1',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 800 },
                enemies: [MONSTERS.HOLLOW_SHELL, MONSTERS.HOLLOW_SHELL],
            },
            {
                id: '6_2',
                type: EncounterType.BATTLE,
                coordinates: { x: 100, y: 1100 },
                enemies: [MONSTERS.TWISTED_REFLECTION, MONSTERS.HOLLOW_SHELL],
            },
            {
                id: '6_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: 200, y: 1500 },
                puzzleData: { puzzleType: PuzzleType.GEOMETRY },
            },
            {
                id: '6_4',
                type: EncounterType.BATTLE,
                coordinates: { x: -150, y: 1900 },
                enemies: [MONSTERS.DISCORD_SPIRIT, MONSTERS.TWISTED_REFLECTION],
            },
            {
                id: '6_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 50, y: 2300 },
                enemies: [MONSTERS.DISCORD_SPIRIT, MONSTERS.DISCORD_SPIRIT],
            },
            {
                id: '6_6',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2700 },
                puzzleData: { puzzleType: PuzzleType.GUARDIAN_TRIBUTE },
            },
            {
                id: '6_7',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 3100 },
                enemies: [MONSTERS.TWISTED_REFLECTION, MONSTERS.TWISTED_REFLECTION],
            },
            {
                id: '6_8',
                type: EncounterType.PUZZLE,
                coordinates: { x: 150, y: 3400 },
                puzzleData: { puzzleType: PuzzleType.SYMMETRY },
            },
            {
                id: '6_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 250, y: 3800 },
                enemies: [MONSTERS.TWISTED_REFLECTION, MONSTERS.TWISTED_REFLECTION],
            },
            {
                id: '6_10',
                type: EncounterType.BOSS,
                coordinates: { x: 0, y: 4200 },
                enemies: [MONSTERS.SPIRIT_KING],
            },
            {
                id: '6_11',
                type: EncounterType.ENDING,
                coordinates: { x: -300, y: 4400 },
            }
        ]
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
