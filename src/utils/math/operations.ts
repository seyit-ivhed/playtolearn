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
    const operand1 = getRandomInt(settings.left.min, settings.left.max);
    const operand2 = getRandomInt(settings.right.min, settings.right.max);

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

    let operand1 = getRandomInt(settings.left.min, settings.left.max);
    let operand2 = getRandomInt(settings.right.min, settings.right.max);

    // Ensure non-negative result for child-friendly math
    // If operand1 < operand2, we try to Swap them if it makes sense, 
    // or just regenerate/adjust within ranges.
    // For now, we'll swap if they overlap and result is negative.
    if (operand1 < operand2) {
        [operand1, operand2] = [operand2, operand1];
    }

    return {
        operand1,
        operand2,
        operation: MathOperation.SUBTRACT,
        correctAnswer: operand1 - operand2,
        difficulty,
        createdAt: new Date(),
    };
};

/**
 * Generates a multiplication problem
 */
const generateMultiplicationProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).multiplication;
    const operand1 = getRandomInt(settings.left.min, settings.left.max);
    const operand2 = getRandomInt(settings.right.min, settings.right.max);

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
 * Generates a division problem (ensures whole number result or remainder as per settings)
 */
export const generateDivisionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).division;

    // Force Remainder logic
    if (settings.forceRemainder) {
        let divisor = getRandomInt(settings.right.min, settings.right.max) || 1;
        if (divisor === 1 && settings.right.max > 1) {
            divisor = getRandomInt(2, settings.right.max);
        }

        // Pick a dividend within the left range
        let dividend = getRandomInt(settings.left.min, settings.left.max);

        // Ensure remainder is non-zero
        // If dividend % divisor === 0, we adjust dividend by adding/subtracting 1
        // as long as it stays within ranges.
        if (dividend % divisor === 0) {
            if (dividend + 1 <= settings.left.max) {
                dividend += 1;
            } else if (dividend - 1 >= settings.left.min) {
                dividend -= 1;
            } else if (divisor > 2) {
                // If we can't change dividend, try shifting divisor
                divisor -= 1;
            }
        }

        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;

        // If even after adjustments it's still 0 (very rare with good config), 
        // fallback to a very simple remainder problem
        if (remainder === 0) {
            const fallbackDivisor = 3;
            const fallbackDividend = 7;
            return {
                operand1: fallbackDividend,
                operand2: fallbackDivisor,
                operation: MathOperation.DIVIDE,
                correctAnswer: `2 R 1`,
                difficulty,
                createdAt: new Date(),
            };
        }

        return {
            operand1: dividend,
            operand2: divisor,
            operation: MathOperation.DIVIDE,
            correctAnswer: `${quotient} R ${remainder}`,
            difficulty,
            createdAt: new Date(),
        };
    }

    // To ensure whole number division, we pick a divisor and a quotient
    // and check if the resulting dividend is in the left range.
    const divisor = getRandomInt(settings.right.min, settings.right.max) || 1;

    // We want divisor * quotient to be within settings.left.min and settings.left.max
    const minQuotient = Math.ceil(settings.left.min / divisor);
    const maxQuotient = Math.floor(settings.left.max / divisor);

    let quotient: number;
    if (maxQuotient >= minQuotient) {
        quotient = getRandomInt(minQuotient, maxQuotient);
    } else {
        // Fallback if ranges are impossible: just pick a small quotient
        quotient = getRandomInt(2, 10);
    }

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

    if (settings.addition.enabled) {
        ops.push(MathOperation.ADD);
    }
    if (settings.subtraction.enabled) {
        ops.push(MathOperation.SUBTRACT);
    }
    if (settings.multiplication.enabled) {
        ops.push(MathOperation.MULTIPLY);
    }
    if (settings.division.enabled) {
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
