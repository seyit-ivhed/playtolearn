import {
    MathOperation,
    type MathProblem,
    type DifficultyLevel,
} from '../../types/math.types';
import { getRandomInt } from './helpers';
import { getSettings } from './config';
import { generateMultipleChoices } from './choices';

/**
 * Generates an addition problem
 */
export const generateAdditionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).addition;
    const operand1 = getRandomInt(settings.min, settings.max);
    const operand2 = getRandomInt(settings.min, settings.max);

    return {
        operand1,
        operand2,
        operation: MathOperation.ADD,
        correctAnswer: operand1 + operand2,
        difficulty,
        createdAt: new Date(),
    };
};

/**
 * Generates a subtraction problem (ensures non-negative result)
 */
export const generateSubtractionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).subtraction;

    // For subtraction, we want the first number to be larger or equal to ensure positive result
    const operand2 = getRandomInt(settings.min, settings.max);
    const answer = getRandomInt(0, settings.max); // Can be 0
    const operand1 = operand2 + answer;

    return {
        operand1,
        operand2,
        operation: MathOperation.SUBTRACT,
        correctAnswer: answer,
        difficulty,
        createdAt: new Date(),
    };
};

/**
 * Generates a multiplication problem
 */
export const generateMultiplicationProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).multiplication;
    const operand1 = getRandomInt(settings.min, settings.max);
    const operand2 = getRandomInt(settings.min, settings.max);

    return {
        operand1,
        operand2,
        operation: MathOperation.MULTIPLY,
        correctAnswer: operand1 * operand2,
        difficulty,
        createdAt: new Date(),
    };
};

/**
 * Generates a division problem (ensures whole number result)
 */
export const generateDivisionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).division;

    // Special handling for Division with Remainder if enabled
    if (settings.allowRemainder) {
        // Quotient: Anything between 3 to 10 (configurable)
        const qMin = settings.quotientMin ?? 3;
        const qMax = settings.quotientMax ?? 10;
        const quotient = getRandomInt(qMin, qMax);

        // Divisor: Anything between 2 to 10 (configurable)
        const dMin = settings.divisorMin ?? 2;
        const dMax = settings.divisorMax; // utilizing existing divisorMax as max
        const divisor = getRandomInt(dMin, dMax);

        // Remainder: Must be between 1 and divisor - 1
        // If divisor is 2, remainder can only be 1.
        // We ensure remainder is non-zero for these "remainder" specific problems.
        const maxRemainder = divisor - 1;

        // Safety check, though dMin=2 guarantees maxRemainder >= 1
        let remainder = 1;
        if (maxRemainder >= 1) {
            remainder = getRandomInt(1, maxRemainder);
        }

        // Dividend: Derived
        const dividend = (quotient * divisor) + remainder;

        return {
            operand1: dividend,
            operand2: divisor,
            operation: MathOperation.DIVIDE,
            correctAnswer: `${quotient} R ${remainder}`,
            difficulty,
            createdAt: new Date(),
        };
    }

    // To ensure whole number division, we generate a multiplication problem in reverse
    const divisor = getRandomInt(2, settings.divisorMax); // Avoid division by 1 as it's too easy
    const quotient = getRandomInt(2, settings.divisorMax); // The answer
    const dividend = divisor * quotient;

    return {
        operand1: dividend,
        operand2: divisor,
        operation: MathOperation.DIVIDE,
        correctAnswer: quotient,
        difficulty,
        createdAt: new Date(),
    };
};

/**
 * Returns a list of allowed operations for a given difficulty level
 */
export const getAllowedOperations = (difficulty: DifficultyLevel): MathOperation[] => {
    const settings = getSettings(difficulty);
    const ops: MathOperation[] = [];

    if (settings.addition.max > 0 || settings.addition.min > 0) {
        ops.push(MathOperation.ADD);
    }
    if (settings.subtraction.max > 0) {
        ops.push(MathOperation.SUBTRACT);
    }
    if (settings.multiplication.max > 0) {
        ops.push(MathOperation.MULTIPLY);
    }
    if (settings.division.divisorMax > 0) {
        ops.push(MathOperation.DIVIDE);
    }

    // Default to ADD if no operations are found (safety fallback)
    return ops.length > 0 ? ops : [MathOperation.ADD];
};

/**
 * Main function to generate a math problem
 */
export const generateProblem = (
    operation: MathOperation,
    difficulty: DifficultyLevel
): MathProblem => {
    let problem: MathProblem;

    switch (operation) {
        case MathOperation.ADD:
            problem = generateAdditionProblem(difficulty);
            break;
        case MathOperation.SUBTRACT:
            problem = generateSubtractionProblem(difficulty);
            break;
        case MathOperation.MULTIPLY:
            problem = generateMultiplicationProblem(difficulty);
            break;
        case MathOperation.DIVIDE:
            problem = generateDivisionProblem(difficulty);
            break;
        default:
            // Fallback to addition if something goes wrong
            problem = generateAdditionProblem(difficulty);
    }

    // Add multiple choices
    // Reduce choices count to 3 for string answers (text is long, so we use 1-col layout)
    const choiceCount = typeof problem.correctAnswer === 'string' ? 3 : 4;
    problem.choices = generateMultipleChoices(problem.correctAnswer, choiceCount);

    return problem;
};
