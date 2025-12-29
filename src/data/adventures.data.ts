import { type Adventure, EncounterType, PuzzleType } from '../types/adventure.types';
import { MONSTERS } from './monsters.data';


export const ADVENTURES: Adventure[] = [
    {
        id: '1',
        title: 'The Hidden Entrance',
        storyHook: "Tariq's homeland is plagued by strange sightings near the great stone archway in the southwest. An ancient cave entrance, long buried by sand, has been revealed.",
        completionSummary: "The Sand Colossus is defeated at the mouth of the massive cave. As the dust settles, the dark tunnel beckons you forward. Scavengers are already slipping into the shadows ahead.",
        volumeId: 'origins',
        difficulty: 1,
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
                coordinates: { x: -150, y: 3900 },
                enemies: [MONSTERS.SAND_COLOSSUS],
                xpReward: 100
            }
        ]
    },
    {
        id: '2',
        title: 'The Ruins of Ashur',
        storyHook: "Leaving the desert sun behind, you descend into the cool depths of the canyon cave. The tunnel opens into a vast subterranean city—Ashur. But scavengers have turned the ruins into a bandit camp, and the stones themselves are starting to move.",
        completionSummary: "With the Stone Emperor silenced, the heart of Ashur is yours. But the inscriptions on the canyon walls speak of a 'High King' in the distant mountains who still holds the keys to the world's origins...",
        volumeId: 'origins',
        difficulty: 2,
        encounters: [
            {
                id: '2_1',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 600 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
                xpReward: 100
            },
            {
                id: '2_2',
                type: EncounterType.BATTLE,
                coordinates: { x: -200, y: 900 },
                enemies: [MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER, MONSTERS.BANDIT_RAIDER],
                xpReward: 110
            },
            {
                id: '2_3',
                type: EncounterType.PUZZLE,
                coordinates: { x: 0, y: 1200 },
                puzzleData: { puzzleType: PuzzleType.IRRIGATION },
                xpReward: 120
            },
            {
                id: '2_4',
                type: EncounterType.CAMP,
                coordinates: { x: 250, y: 1300 },
                xpReward: 0
            },
            {
                id: '2_5',
                type: EncounterType.BATTLE,
                coordinates: { x: 0, y: 1600 },
                enemies: [MONSTERS.BANDIT_RAIDER],
                xpReward: 130
            },
            {
                id: '2_6',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 1800 },
                enemies: [MONSTERS.STONE_GUARDIAN],
                xpReward: 140
            },
            {
                id: '2_7',
                type: EncounterType.PUZZLE,
                coordinates: { x: 0, y: 2000 },
                puzzleData: { puzzleType: PuzzleType.CUNEIFORM },
                xpReward: 150
            },
            {
                id: '2_8',
                type: EncounterType.CAMP,
                coordinates: { x: -200, y: 2300 },
                xpReward: 0
            },
            {
                id: '2_9',
                type: EncounterType.BATTLE,
                coordinates: { x: 200, y: 2700 },
                enemies: [MONSTERS.STONE_GUARDIAN, MONSTERS.STONE_GUARDIAN],
                xpReward: 160
            },
            {
                id: '2_10',
                type: EncounterType.PUZZLE,
                coordinates: { x: 250, y: 2950 },
                puzzleData: { puzzleType: PuzzleType.GUARDIAN_TRIBUTE },
                xpReward: 170
            },
            {
                id: '2_11',
                type: EncounterType.BATTLE,
                coordinates: { x: 600, y: 3200 },
                enemies: [MONSTERS.ASSYRIAN_GUARDIAN, MONSTERS.STONE_GUARDIAN],
                xpReward: 180
            },
            {
                id: '2_12',
                type: EncounterType.CAMP,
                coordinates: { x: 400, y: 3500 },
                xpReward: 0
            },
            {
                id: '2_13',
                type: EncounterType.BOSS,
                coordinates: { x: -100, y: 3900 },
                enemies: [MONSTERS.THE_STONE_EMPEROR],
                xpReward: 200
            }
        ]
    }
];

export const getAdventureById = (id: string): Adventure | undefined => {
    return ADVENTURES.find(m => m.id === id);
};
