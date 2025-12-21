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
    let current = 0;
    const solutionPipes: (number | PuzzleOption)[] = [];
    const decoyPipes: (number | PuzzleOption)[] = [];

    // 1. Choose number of solution steps based on difficulty
    let steps = 2;
    if (difficulty === 2) steps = getRandomInt(2, 3);
    else if (difficulty === 3) steps = 3;
    else if (difficulty === 4) steps = getRandomInt(3, 4);
    else if (difficulty === 5) steps = getRandomInt(4, 5);

    // 2. Build the solution path
    // Initial step: Always addition to get a base value
    const firstVal = (difficulty <= 2) ? getRandomInt(5, 10) : getRandomInt(10, 25);
    current = firstVal;
    solutionPipes.push(firstVal);

    for (let i = 1; i < steps; i++) {
        const pool: ('ADD' | 'SUB' | 'MUL' | 'DIV')[] = ['ADD'];
        if (difficulty >= 2) pool.push('SUB');
        if (difficulty >= 4) {
            pool.push('MUL');
            if (current > 1 && current % 2 === 0) pool.push('DIV');
        }

        const opType = pool[getRandomInt(0, pool.length - 1)];

        if (opType === 'ADD') {
            const val = (difficulty <= 2) ? getRandomInt(2, 5) : getRandomInt(5, 20);
            current += val;
            solutionPipes.push(val);
        } else if (opType === 'SUB') {
            const val = (difficulty <= 2) ? getRandomInt(1, 3) : getRandomInt(5, 15);
            // Non-destructive check to keep target positive and interesting
            if (current - val >= 2) {
                current -= val;
                solutionPipes.push(-val);
            } else {
                const fallback = getRandomInt(2, 5);
                current += fallback;
                solutionPipes.push(fallback);
            }
        } else if (opType === 'MUL') {
            const factor = difficulty === 4 ? 2 : getRandomInt(2, 3);
            if (current * factor <= 300) {
                current *= factor;
                solutionPipes.push({ value: factor, type: 'MULTIPLY', label: `x${factor}` });
            } else {
                const subFallback = 10;
                current -= subFallback;
                solutionPipes.push(-subFallback);
            }
        } else if (opType === 'DIV') {
            const divisor = 2;
            if (current > 0 && current % divisor === 0) {
                current /= divisor;
                solutionPipes.push({ value: divisor, type: 'DIVIDE', label: `÷${divisor}` });
            } else {
                const addFallback = 4;
                current += addFallback;
                solutionPipes.push(addFallback);
            }
        }
    }

    // 3. Add decoy pipes to increase challenge
    const decoyCount = difficulty <= 2 ? 1 : 2;
    for (let i = 0; i < decoyCount; i++) {
        if (difficulty <= 2) {
            decoyPipes.push(getRandomInt(1, 5));
        } else {
            const isObj = Math.random() > 0.7;
            if (!isObj) {
                decoyPipes.push(Math.random() > 0.5 ? getRandomInt(1, 10) : -getRandomInt(1, 5));
            } else {
                decoyPipes.push({ value: 2, type: 'MULTIPLY', label: 'x2' });
            }
        }
    }

    const allOptions = [...solutionPipes, ...decoyPipes];

    // 4. Shuffle all options (Fisher-Yates)
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    return {
        puzzleType: PuzzleType.SUM_TARGET,
        targetValue: current,
        options: allOptions.filter(o => typeof o === 'number' ? o !== 0 : o.value !== 0)
    };
};

const generateBalanceData = (difficulty: DifficultyLevel): PuzzleData => {
    // For Balance puzzle, we want one side to have some weights and the other to be empty or less
    // The player needs to add weights to make them equal.

    const baseValue = difficulty * 5 + getRandomInt(5, 10);
    const initialRightWeight = baseValue;
    const initialLeftWeight = 0;

    // Generate valid weights that sum to baseValue
    const validWeights: number[] = [];
    let remaining = baseValue;

    // Create 2-3 weights that sum to baseValue
    const numCorrectWeights = difficulty <= 2 ? 2 : 3;
    for (let i = 0; i < numCorrectWeights - 1; i++) {
        const w = getRandomInt(Math.floor(remaining / 3), Math.floor(remaining / 2));
        if (w > 0) {
            validWeights.push(w);
            remaining -= w;
        }
    }
    if (remaining > 0) validWeights.push(remaining);

    // Generate some decoy weights
    const decoyWeights: number[] = [];
    const numDecoys = difficulty <= 2 ? 2 : 3;
    for (let i = 0; i < numDecoys; i++) {
        decoyWeights.push(getRandomInt(1, 10) + (difficulty - 1) * 2);
    }

    // Distribute weights between Left and Right inventories
    // Since we start with 0 on Left and target on Right, 
    // ALL the valid weights MUST be available to put on the LEFT side to balance it.
    // So validWeights go to leftOptions.

    const leftOptions: number[] = [...validWeights];
    const rightOptions: number[] = [];

    // Distribute decoys
    decoyWeights.forEach(w => {
        if (Math.random() > 0.5) leftOptions.push(w);
        else rightOptions.push(w);
    });

    // Shuffle both
    const shuffle = (arr: number[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    };

    shuffle(leftOptions);
    shuffle(rightOptions);

    return {
        puzzleType: PuzzleType.BALANCE,
        targetValue: baseValue,
        options: [], // Legacy / unused
        initialRightWeight,
        initialLeftWeight,
        leftOptions,
        rightOptions
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
