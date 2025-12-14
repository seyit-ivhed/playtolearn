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
/**
 * Configuration for math problem generation ranges
 * Values based on common curriculum standards for ages 6-10
 */
const CONFIG: MathEngineConfig = {
    level1: {
        addition: { min: 0, max: 10 },
        subtraction: { min: 0, max: 0 }, // Disabled effectively
        multiplication: { min: 0, max: 0 }, // Disabled effectively
        division: { divisorMax: 0 }, // Disabled
    },
    level2: {
        addition: { min: 5, max: 20 },
        subtraction: { min: 1, max: 20 },
        multiplication: { min: 0, max: 4 },
        division: { divisorMax: 0 }, // Disabled
    },
    level3: {
        addition: { min: 10, max: 40 },
        subtraction: { min: 5, max: 40 },
        multiplication: { min: 3, max: 10 },
        division: { divisorMax: 3 },
    },
    level4: {
        addition: { min: 50, max: 100 },
        subtraction: { min: 20, max: 100 },
        multiplication: { min: 4, max: 10 },
        division: { divisorMax: 5 },
    },
    level5: {
        addition: { min: 100, max: 600 },
        subtraction: { min: 100, max: 600 },
        multiplication: { min: 6, max: 12 },
        division: { divisorMax: 6 },
    },
};

/**
 * Generates a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getSettings = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
        case 1: return CONFIG.level1;
        case 2: return CONFIG.level2;
        case 3: return CONFIG.level3;
        case 4: return CONFIG.level4;
        case 5: return CONFIG.level5;
        default: return CONFIG.level1;
    }
}

/**
 * Generates an addition problem
 */
const generateAdditionProblem = (difficulty: DifficultyLevel): MathProblem => {
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
const generateSubtractionProblem = (difficulty: DifficultyLevel): MathProblem => {
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
const generateMultiplicationProblem = (difficulty: DifficultyLevel): MathProblem => {
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
const generateDivisionProblem = (difficulty: DifficultyLevel): MathProblem => {
    const settings = getSettings(difficulty).division;

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
