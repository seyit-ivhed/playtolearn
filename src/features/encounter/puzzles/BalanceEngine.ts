
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
 * Calculates the target weight if one isn't explicitly provided.
 * In a balance puzzle, the target is usually to make both sides equal.
 */
export const getTargetWeight = (leftWeight: number, rightWeight: number): number => {
    return Math.max(leftWeight, rightWeight);
};

/**
 * Calculates the tilt angle of the scale based on the weight difference.
 * Returns an angle in degrees (e.g., -15 to 15).
 */
export const calculateScaleAngle = (leftWeight: number, rightWeight: number): number => {
    if (leftWeight === rightWeight) return 0;

    const difference = rightWeight - leftWeight;
    const maxAngle = 15;
    const sensitivity = 5; // How much angle per weight unit

    // Clamp the angle
    let angle = difference * sensitivity;
    if (angle > maxAngle) angle = maxAngle;
    if (angle < -maxAngle) angle = -maxAngle;

    return angle;
};

/**
 * Calculates the total weight of a list of weights.
 */
export const calculateTotalWeight = (weights: number[]): number => {
    return weights.reduce((sum, w) => sum + w, 0);
};
