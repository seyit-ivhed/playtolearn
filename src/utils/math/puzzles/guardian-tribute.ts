import { type DifficultyLevel } from '../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../types/adventure.types';
import { getRandomInt } from '../helpers';

/**
 * Constraint types for Guardian Tribute puzzle
 */
export const GuardianConstraintType = {
    EXACT: 'EXACT',                 // Requires exactly X gems
    MULTIPLIER: 'MULTIPLIER',       // Requires N× as many gems as another guardian
    ADDITION: 'ADDITION',           // Requires X more/less gems than another guardian
    RANGE: 'RANGE',                 // Requires between X and Y gems
    HALVE: 'HALVE',                 // Requires half as many gems as another guardian
    COMPARISON: 'COMPARISON'        // Requires more/less than another guardian
} as const;

export type GuardianConstraintType = typeof GuardianConstraintType[keyof typeof GuardianConstraintType];

export interface GuardianConstraint {
    type: GuardianConstraintType;
    value?: number;                 // For EXACT, ADDITION
    multiplier?: number;            // For MULTIPLIER (2, 3, etc.)
    targetGuardian?: number;        // Index of guardian to compare to (0-based)
    min?: number;                   // For RANGE
    max?: number;                   // For RANGE
    operator?: 'greater' | 'less';  // For COMPARISON
}

export interface GuardianData {
    constraint: GuardianConstraint;
    solution: number;
}

export interface GuardianTributePuzzleData extends PuzzleData {
    guardians: GuardianData[];
    totalGems: number;
}

/**
 * Generates constraint-based Guardian Tribute puzzle data
 */
export const generateGuardianTributeData = (difficulty: DifficultyLevel): GuardianTributePuzzleData => {
    let guardians: GuardianData[] = [];
    let totalGems = 0;

    // Determine number of guardians and constraints based on difficulty
    if (difficulty === 1) {
        // Level 1: Age 6 (Apprentice) - 2 guardians, simple addition/exact
        // Target Sum: 10-15
        const g1Value = getRandomInt(5, 8);
        const additionValue = getRandomInt(1, 3);
        const g2Value = g1Value + additionValue;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.EXACT, value: g1Value },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: additionValue, targetGuardian: 0 },
                solution: g2Value
            }
        ];
        totalGems = g1Value + g2Value;
    } else if (difficulty === 2) {
        // Level 2: Age 7 (Scout) - 3 guardians, exact + multiplier + addition
        // Target Sum: 20-30
        const g1Value = getRandomInt(4, 6);
        const g2Value = g1Value * 2;
        const additionValue = getRandomInt(4, 6);
        const g3Value = g2Value + additionValue;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.EXACT, value: g1Value },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.MULTIPLIER, multiplier: 2, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: additionValue, targetGuardian: 1 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    } else if (difficulty === 3) {
        // Level 3: Age 8 (Adventurer) - 3 guardians, introduce Halve + Addition
        // Target Sum: ~25-45
        const g1Value = getRandomInt(4, 7) * 2; // Must be even
        const g2Value = g1Value / 2;
        const additionValue = getRandomInt(4, 6);
        const g3Value = g1Value + additionValue;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.EXACT, value: g1Value },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.HALVE, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: additionValue, targetGuardian: 0 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    } else if (difficulty === 4) {
        // Level 4: Age 9 (Veteran) - 3 guardians, complex mix
        // Target Sum: ~35-45
        const g1Value = getRandomInt(4, 5);
        const g2Value = g1Value * 3;
        const g3Value = g2Value + getRandomInt(5, 10);

        guardians = [
            {
                constraint: { type: GuardianConstraintType.EXACT, value: g1Value },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.MULTIPLIER, multiplier: 3, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.COMPARISON, operator: 'greater', targetGuardian: 1 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    } else {
        // Level 5: Age 10 (Master) - 3 guardians, complex mix (max 50)
        const g1Min = 10;
        const g1Max = 12;
        const g1Value = getRandomInt(g1Min, g1Max);
        const g2Value = g1Value * 2;
        const g3Value = g2Value / 2;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.RANGE, min: g1Min, max: g1Max },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.MULTIPLIER, multiplier: 2, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.HALVE, targetGuardian: 1 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    }

    return {
        puzzleType: PuzzleType.GUARDIAN_TRIBUTE,
        targetValue: totalGems,
        options: [], // Not used in new constraint-based system
        guardians,
        totalGems
    };
};

/**
 * Validates if a guardian's value satisfies its constraint
 */
export const validateGuardianConstraint = (
    value: number,
    constraint: GuardianConstraint,
    guardianValues: number[]
): boolean => {
    switch (constraint.type) {
        case GuardianConstraintType.EXACT:
            return value === constraint.value;

        case GuardianConstraintType.MULTIPLIER:
            if (constraint.targetGuardian === undefined || constraint.multiplier === undefined) return false;
            const targetValue = guardianValues[constraint.targetGuardian];
            return value === targetValue * constraint.multiplier;

        case GuardianConstraintType.ADDITION:
            if (constraint.targetGuardian === undefined || constraint.value === undefined) return false;
            const baseValue = guardianValues[constraint.targetGuardian];
            return value === baseValue + constraint.value;

        case GuardianConstraintType.RANGE:
            if (constraint.min === undefined || constraint.max === undefined) return false;
            return value >= constraint.min && value <= constraint.max;

        case GuardianConstraintType.HALVE:
            if (constraint.targetGuardian === undefined) return false;
            const sourceValue = guardianValues[constraint.targetGuardian];
            return value === sourceValue / 2;

        case GuardianConstraintType.COMPARISON:
            if (constraint.targetGuardian === undefined || constraint.operator === undefined) return false;
            const compareValue = guardianValues[constraint.targetGuardian];
            return constraint.operator === 'greater' ? value > compareValue : value < compareValue;

        default:
            return false;
    }
};

/**
 * Validates if all constraints are satisfied and all gems are distributed
 */
export const validateGuardianTributeSolution = (
    guardianValues: number[],
    puzzleData: GuardianTributePuzzleData
): { isValid: boolean; allConstraintsSatisfied: boolean; allGemsDistributed: boolean } => {
    // Check if all constraints are satisfied
    const allConstraintsSatisfied = puzzleData.guardians.every((guardian, index) =>
        validateGuardianConstraint(guardianValues[index], guardian.constraint, guardianValues)
    );

    // Check if all gems are distributed
    const totalDistributed = guardianValues.reduce((sum, val) => sum + val, 0);
    const allGemsDistributed = totalDistributed === puzzleData.totalGems;

    // Check no negative values
    const noNegatives = guardianValues.every(val => val >= 0);

    return {
        isValid: allConstraintsSatisfied && allGemsDistributed && noNegatives,
        allConstraintsSatisfied,
        allGemsDistributed
    };
};
