import { type DifficultyLevel } from '../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../types/adventure.types';
import { getRandomInt } from '../helpers';

/**
 * Generates data for the Guardian Tribute puzzle (Division/Distribution)
 * Players must divide a total amount among a number of guardians.
 */
export const generateGuardianTributeData = (difficulty: DifficultyLevel): PuzzleData => {
    const divisor = 3; // Default to 3 guardians for the theme
    let quotient = 0;

    // Choose quotient based on difficulty
    if (difficulty === 1) quotient = getRandomInt(2, 5);
    else if (difficulty === 2) quotient = getRandomInt(5, 10);
    else if (difficulty === 3) quotient = getRandomInt(10, 15);
    else if (difficulty === 4) quotient = getRandomInt(12, 20);
    else quotient = getRandomInt(15, 30);

    const targetValue = divisor * quotient;

    // Generate options including the correct answer and decoys
    const options: number[] = [quotient];

    const decoyCount = 3;
    while (options.length <= decoyCount) {
        const decoy = quotient + getRandomInt(-5, 5);
        if (decoy > 0 && !options.includes(decoy)) {
            options.push(decoy);
        }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
        puzzleType: PuzzleType.GUARDIAN_TRIBUTE,
        targetValue: targetValue,
        options: options
    };
};
