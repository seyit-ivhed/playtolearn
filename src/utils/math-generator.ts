import {
    MathOperation,
    type MathProblem,
    type DifficultyLevel,
    type ValidationResult,
    type MathEngineConfig
} from '../types/math.types';
import { PuzzleType, type PuzzleData, type PuzzleOption } from '../types/adventure.types';

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
        division: {
            divisorMax: 10,
            divisorMin: 2,
            quotientMin: 5,
            quotientMax: 10,
            allowRemainder: false
        },
    },
    level5: {
        addition: { min: 100, max: 600 },
        subtraction: { min: 100, max: 600 },
        multiplication: { min: 6, max: 12 },
        division: {
            divisorMax: 10,
            divisorMin: 2,
            quotientMin: 3,
            quotientMax: 10,
            allowRemainder: true
        },
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
 * Generates multiple choice options including the correct answer
 * @param correctAnswer The correct answer to include
 * @param count Total number of choices (default 4)
 */
/**
 * Generates multiple choice options including the correct answer
 * @param correctAnswer The correct answer to include
 * @param count Total number of choices (default 4)
 */
export const generateMultipleChoices = (correctAnswer: number | string, count: number = 4): (number | string)[] => {
    if (typeof correctAnswer === 'string') {
        const choices = new Set<string>();
        choices.add(correctAnswer);

        // Expect format "Q R r"
        const match = correctAnswer.match(/^(\d+)\s*R\s*(\d+)$/);
        if (!match) {
            // Fallback for unexpected string format
            while (choices.size < count) {
                choices.add(`${correctAnswer} ${choices.size}`);
            }
            return Array.from(choices);
        }

        const q = parseInt(match[1]);
        const r = parseInt(match[2]);

        while (choices.size < count) {
            // Generate wrong answers by varying Q and R
            const qVar = getRandomInt(-2, 2);
            const rVar = getRandomInt(-2, 2);

            // Skip no-op
            if (qVar === 0 && rVar === 0) continue;

            const newQ = Math.abs(q + qVar);
            const newR = Math.abs(r + rVar); // Keep positive

            const wrongAnswer = `${newQ} R ${newR}`;

            choices.add(wrongAnswer);
        }

        // Sort strings naturally? or just random? 
        // Let's sort to keep UI consistent
        return Array.from(choices).sort();
    }

    const choices = new Set<number>();
    choices.add(correctAnswer as number);

    // Generate plausible wrong answers
    // Strategy: +/- 1, +/- 2, +/- 10, random close numbers
    while (choices.size < count) {
        const variance = getRandomInt(1, 5);
        const direction = Math.random() > 0.5 ? 1 : -1;
        let wrongAnswer = (correctAnswer as number) + (variance * direction);

        // Ensure positive answers for this age group (mostly)
        if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);

        // If we generated the correct answer or a duplicate, try a random offset
        if (choices.has(wrongAnswer)) {
            wrongAnswer = (correctAnswer as number) + getRandomInt(-10, 10);
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
    // Reduce choices count to 3 for string answers (text is long, so we use 1-col layout)
    const choiceCount = typeof problem.correctAnswer === 'string' ? 3 : 4;
    problem.choices = generateMultipleChoices(problem.correctAnswer, choiceCount);

    return problem;
};

/**
 * Validates a user's answer
 */
/**
 * Validates a user's answer
 */
export const validateAnswer = (
    userAnswer: number | string,
    correctAnswer: number | string
): ValidationResult => {
    const isCorrect = userAnswer === correctAnswer;

    return {
        isCorrect,
        userAnswer,
        correctAnswer,
        feedback: isCorrect ? 'correct' : 'incorrect',
    };
};

/**
 * Generates puzzle data based on puzzle type and difficulty
 */
export const generatePuzzleData = (
    puzzleType: PuzzleType,
    difficulty: DifficultyLevel
): PuzzleData => {
    switch (puzzleType) {
        case PuzzleType.SUM_TARGET:
            return generateSumTargetData(difficulty);
        case PuzzleType.BALANCE:
            return generateBalanceData(difficulty);
        case PuzzleType.SEQUENCE:
            return generateSequenceData(difficulty);
        default:
            return {
                puzzleType: PuzzleType.SUM_TARGET,
                targetValue: 10,
                options: [2, 3, 5]
            };
    }
};

const generateSumTargetData = (difficulty: DifficultyLevel): PuzzleData => {
    let targetValue: number;
    let options: (number | PuzzleOption)[];

    switch (difficulty) {
        case 1:
            targetValue = getRandomInt(8, 15);
            options = [getRandomInt(2, 3), getRandomInt(3, 4), getRandomInt(4, 5)];
            break;
        case 2:
            targetValue = getRandomInt(15, 25);
            options = [getRandomInt(3, 5), getRandomInt(5, 7), getRandomInt(7, 9)];
            break;
        case 3:
            targetValue = getRandomInt(25, 50);
            options = [getRandomInt(5, 10), getRandomInt(10, 15), getRandomInt(5, 8), -5];
            break;
        case 4:
            targetValue = getRandomInt(50, 100);
            options = [
                getRandomInt(10, 20),
                getRandomInt(5, 15),
                -10,
                { value: 2, type: 'MULTIPLY', label: 'x2' },
                { value: 2, type: 'DIVIDE', label: '÷2' }
            ];
            break;
        case 5:
            targetValue = getRandomInt(100, 300);
            options = [
                getRandomInt(20, 40),
                getRandomInt(10, 25),
                -20,
                { value: 3, type: 'MULTIPLY', label: 'x3' },
                { value: 2, type: 'MULTIPLY', label: 'x2' },
                { value: 2, type: 'DIVIDE', label: '÷2' }
            ];
            break;
        default:
            targetValue = 10;
            options = [2, 3, 5];
    }

    // Ensure options are unique and non-zero (except for intentional negatives)
    const uniqueOptions = Array.from(new Set(options)).filter(o => o !== 0);

    return {
        puzzleType: PuzzleType.SUM_TARGET,
        targetValue,
        options: uniqueOptions
    };
};

const generateBalanceData = (difficulty: DifficultyLevel): PuzzleData => {
    // Placeholder logic for Balance puzzle (Weighing Rocks)
    const targetValue = 5 * difficulty + getRandomInt(5, 10);
    return {
        puzzleType: PuzzleType.BALANCE,
        targetValue,
        options: [5, 10, 3, 7].map(o => o + (difficulty - 1) * 2)
    };
};

const generateSequenceData = (difficulty: DifficultyLevel): PuzzleData => {
    // Placeholder logic for Sequence puzzle (Star Map)
    const step = difficulty + 1;
    const targetValue = step * 10;
    return {
        puzzleType: PuzzleType.SEQUENCE,
        targetValue,
        options: Array.from({ length: 10 }).map((_, i) => (i + 1) * step),
        rules: [`MULTIPLES_OF_${step}`]
    };
};
