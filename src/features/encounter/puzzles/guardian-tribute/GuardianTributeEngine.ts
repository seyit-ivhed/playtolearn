import {
    type GuardianTributePuzzleData,
    validateGuardianTributeSolution
} from '../../../../utils/math/puzzles/guardian-tribute';

/**
 * Calculates the total number of gems currently distributed among guardians.
 */
export const calculateTotalDistributed = (guardianValues: number[]): number => {
    return guardianValues.reduce((sum, val) => sum + val, 0);
};

/**
 * Calculates how many gems are left to be distributed.
 */
export const calculateRemainingGems = (guardianValues: number[], totalGems: number): number => {
    return totalGems - calculateTotalDistributed(guardianValues);
};

/**
 * Validates if an adjustment to a guardian's value is allowed.
 * - Value cannot be negative.
 * - Total distributed cannot exceed totalGems.
 */
export const isValidAdjustment = (
    currentValues: number[],
    guardianIndex: number,
    delta: number,
    totalGems: number
): boolean => {
    const newValue = currentValues[guardianIndex] + delta;
    if (newValue < 0) return false;

    const newTotal = currentValues.reduce((sum, val, idx) =>
        idx === guardianIndex ? sum + newValue : sum + val, 0
    );

    return newTotal <= totalGems;
};

/**
 * Proxies the validation logic to the utility function.
 */
export const validateTribute = (
    guardianValues: number[],
    puzzleData: GuardianTributePuzzleData
) => {
    return validateGuardianTributeSolution(guardianValues, puzzleData);
};
