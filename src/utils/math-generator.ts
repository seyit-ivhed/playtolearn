import {
    MathOperation,
    type MathProblem,
    type DifficultyLevel,
    type ValidationResult,
    type MathEngineConfig
} from '../types/math.types';

/**
 * Configuration for math problem generation ranges
 */
const CONFIG: MathEngineConfig = {
    level1: {
        addition: { min: 1, max: 10 },
        subtraction: { min: 1, max: 10 },
        multiplication: { min: 1, max: 5 },
        division: { divisorMax: 5 }, // Dividends will be result of multiplication
    },
    level2: {
        addition: { min: 10, max: 50 },
        subtraction: { min: 10, max: 50 },
        multiplication: { min: 1, max: 10 },
        division: { divisorMax: 10 },
    },
};

/**
 * Generates a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates an addition problem
 */
const generateAdditionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = difficulty === 1 ? CONFIG.level1.addition : CONFIG.level2.addition;
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
const generateSubtractionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = difficulty === 1 ? CONFIG.level1.subtraction : CONFIG.level2.subtraction;

    // For subtraction, we want the first number to be larger or equal to ensure positive result
    // We'll generate the answer and the second operand, then add them to get the first operand
    // This ensures the numbers stay within reasonable bounds

    const operand2 = getRandomInt(settings.min, settings.max);
    const answer = getRandomInt(1, settings.max); // Ensure answer is at least 1
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
const generateMultiplicationProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = difficulty === 1 ? CONFIG.level1.multiplication : CONFIG.level2.multiplication;
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
const generateDivisionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = difficulty === 1 ? CONFIG.level1.division : CONFIG.level2.division;

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
 * Generates multiple choice options including the correct answer
 * @param correctAnswer The correct answer to include
 * @param count Total number of choices (default 4)
 */
export const generateMultipleChoices = (correctAnswer: number, count: number = 4): number[] => {
    const choices = new Set<number>();
    choices.add(correctAnswer);

    // Generate plausible wrong answers
    // Strategy: +/- 1, +/- 2, +/- 10, random close numbers
    while (choices.size < count) {
        const variance = getRandomInt(1, 5);
        const direction = Math.random() > 0.5 ? 1 : -1;
        let wrongAnswer = correctAnswer + (variance * direction);

        // Ensure positive answers for this age group (mostly)
        if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);

        // If we generated the correct answer or a duplicate, try a random offset
        if (choices.has(wrongAnswer)) {
            wrongAnswer = correctAnswer + getRandomInt(-10, 10);
            if (wrongAnswer < 0) wrongAnswer = 0;
        }

        // Fallback if we're stuck (e.g. answer is 0 or 1)
        if (choices.has(wrongAnswer)) {
            wrongAnswer = getRandomInt(0, 20);
        }

        choices.add(wrongAnswer);
    }

    return Array.from(choices).sort((a, b) => a - b);
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
    problem.choices = generateMultipleChoices(problem.correctAnswer);

    return problem;
};

/**
 * Validates a user's answer
 */
export const validateAnswer = (
    userAnswer: number,
    correctAnswer: number
): ValidationResult => {
    const isCorrect = userAnswer === correctAnswer;

    return {
        isCorrect,
        userAnswer,
        correctAnswer,
        feedback: isCorrect ? 'correct' : 'incorrect',
    };
};
