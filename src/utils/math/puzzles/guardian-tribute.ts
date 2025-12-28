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
        // Difficulty 1: 2 guardians, simple constraints
        const g1Value = getRandomInt(5, 10);
        const additionValue = getRandomInt(3, 5);
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
        // Difficulty 2: 3 guardians, exact + multiplier + addition
        const g1Value = getRandomInt(4, 8); // Reduced from 6-10
        const g2Value = g1Value * 2;
        const additionValue = getRandomInt(3, 6); // Reduced from 5-8
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
        // Difficulty 3: 3 guardians, multiplier + addition + comparison
        const g1Value = getRandomInt(5, 10); // Reduced from 10-15
        const g2Value = g1Value * 2;
        const g3Value = Math.max(2, g2Value - 5);

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
                constraint: { type: GuardianConstraintType.COMPARISON, operator: 'less', targetGuardian: 1 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    } else if (difficulty === 4) {
        // Difficulty 4: 3 guardians, complex chained relationships
        const g1Value = getRandomInt(3, 6); // Reduced further
        const g2Value = g1Value + 8; // Reduced from 10
        const g3Value = g2Value * 2;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.EXACT, value: g1Value },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: 8, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.MULTIPLIER, multiplier: 2, targetGuardian: 1 },
                solution: g3Value
            }
        ];
        totalGems = g1Value + g2Value + g3Value;
    } else {
        // Difficulty 5: 3 guardians, most complex constraints with range
        const g1Min = 10;
        const g1Max = 15;
        const g1Value = getRandomInt(g1Min, g1Max);
        const g2Value = g1Value + 5;
        const additionValue = getRandomInt(5, 10);
        const g3Value = g2Value + additionValue;

        guardians = [
            {
                constraint: { type: GuardianConstraintType.RANGE, min: g1Min, max: g1Max },
                solution: g1Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: 5, targetGuardian: 0 },
                solution: g2Value
            },
            {
                constraint: { type: GuardianConstraintType.ADDITION, value: additionValue, targetGuardian: 1 },
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
