
/**
 * Core engine for the Balance (Weighing Rocks) puzzle.
 * Encapsulates logic for balancing weights on a scale.
 */

/**
 * Calculates whether the scale is balanced.
 * Both sides must have equal weight.
 */
export const isBalanced = (leftWeight: number, rightWeight: number): boolean => {
    return leftWeight === rightWeight && leftWeight > 0;
};

/**
 * Calculates the total weight of a list of weights.
 */
export const calculateTotalWeight = (weights: number[]): number => {
    return weights.reduce((sum, w) => sum + w, 0);
};
