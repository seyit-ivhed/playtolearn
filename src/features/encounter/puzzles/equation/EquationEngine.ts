import { type DifficultyLevel } from '../../../../types/math.types';
import {
    PuzzleType,
    type EquationData,
    type EquationTerm,
    type Equation
} from '../../../../types/adventure.types';
import { getRandomInt, shuffleArray } from '../../../../utils/math/helpers';

export type { EquationData };

const SYMBOLS = ['💎', '🔮', '⭐', '🌙', '🔥', '🍀', '🗝️', '⚡'];

interface DifficultyConfig {
    variableCount: number;
    equationCount: number;
    minValue: number;
    maxValue: number;
    allowSubtraction: boolean;
}

const getDifficultyConfig = (difficulty: DifficultyLevel): DifficultyConfig => {
    if (difficulty === 1) {
        return { variableCount: 2, equationCount: 2, minValue: 1, maxValue: 3, allowSubtraction: false };
    }
    if (difficulty === 2) {
        return { variableCount: 2, equationCount: 2, minValue: 1, maxValue: 5, allowSubtraction: false };
    }
    return { variableCount: 3, equationCount: 3, minValue: 1, maxValue: 5, allowSubtraction: true };
};

const buildEquation = (
    variableCount: number,
    values: number[],
    allowSubtraction: boolean
): Equation => {
    const usedIndices = new Set<number>();
    const termCount = getRandomInt(2, Math.min(3, variableCount + 1));

    const terms: EquationTerm[] = [];
    let result = 0;

    for (let i = 0; i < termCount; i++) {
        let symbolIndex: number;
        if (usedIndices.size < variableCount && i < termCount - 1) {
            do {
                symbolIndex = getRandomInt(0, variableCount - 1);
            } while (usedIndices.has(symbolIndex) && usedIndices.size < variableCount);
        } else {
            symbolIndex = getRandomInt(0, variableCount - 1);
        }
        usedIndices.add(symbolIndex);

        const coefficient = (allowSubtraction && i > 0 && Math.random() < 0.3) ? -1 : 1;
        terms.push({ symbolIndex, coefficient });
        result += coefficient * values[symbolIndex];
    }

    if (result <= 0) {
        terms.forEach(term => { term.coefficient = 1; });
        result = terms.reduce((sum, term) => sum + values[term.symbolIndex], 0);
    }

    return { left: terms, right: result };
};

const isEquationRedundant = (eq: Equation, existing: Equation[]): boolean => {
    return existing.some(other => {
        if (other.left.length !== eq.left.length) {
            return false;
        }
        const eqSorted = [...eq.left].sort((a, b) => a.symbolIndex - b.symbolIndex);
        const otherSorted = [...other.left].sort((a, b) => a.symbolIndex - b.symbolIndex);
        return eqSorted.every((term, i) =>
            term.symbolIndex === otherSorted[i].symbolIndex &&
            term.coefficient === otherSorted[i].coefficient
        ) && eq.right === other.right;
    });
};

const generateDistractionChoices = (correctAnswer: number, count: number): number[] => {
    const choices = new Set<number>([correctAnswer]);

    const offsets = [-3, -2, -1, 1, 2, 3];
    const shuffledOffsets = shuffleArray(offsets);

    for (const offset of shuffledOffsets) {
        if (choices.size >= count) {
            break;
        }
        const candidate = correctAnswer + offset;
        if (candidate > 0) {
            choices.add(candidate);
        }
    }

    while (choices.size < count) {
        const candidate = getRandomInt(1, Math.max(correctAnswer + 5, 10));
        if (candidate !== correctAnswer) {
            choices.add(candidate);
        }
    }

    return shuffleArray([...choices]);
};

export const generateEquationData = (difficulty: DifficultyLevel): EquationData => {
    if (!difficulty || typeof difficulty !== 'number') {
        console.error(`Invalid difficulty level: ${difficulty}`);
        throw new Error('Valid difficulty level is required');
    }

    const config = getDifficultyConfig(difficulty);
    const { variableCount, equationCount, minValue, maxValue, allowSubtraction } = config;

    const values: number[] = [];
    for (let i = 0; i < variableCount; i++) {
        values.push(getRandomInt(minValue, maxValue));
    }

    const selectedSymbols = shuffleArray([...SYMBOLS]).slice(0, variableCount);

    const equations: Equation[] = [];
    const targetSymbolIndex = (difficulty === 1) ? getRandomInt(0, 1) : getRandomInt(0, variableCount - 1);

    if (difficulty === 1) {
        const knownSymbolIndex = 1 - targetSymbolIndex;
        equations.push({
            left: [
                { symbolIndex: 0, coefficient: 1 },
                { symbolIndex: 1, coefficient: 1 }
            ],
            right: values[0] + values[1]
        });
        equations.push({
            left: [{ symbolIndex: knownSymbolIndex, coefficient: 1 }],
            right: values[knownSymbolIndex]
        });
    } else {
        let attempts = 0;
        const maxAttempts = 50;

        while (equations.length < equationCount && attempts < maxAttempts) {
            const eq = buildEquation(variableCount, values, allowSubtraction);
            if (!isEquationRedundant(eq, equations) && eq.right > 0) {
                equations.push(eq);
            }
            attempts++;
        }

        while (equations.length < equationCount) {
            const idx = getRandomInt(0, variableCount - 1);
            const secondIdx = (idx + 1) % variableCount;
            equations.push({
                left: [
                    { symbolIndex: idx, coefficient: 1 },
                    { symbolIndex: secondIdx, coefficient: 1 }
                ],
                right: values[idx] + values[secondIdx]
            });
        }
    }

    const correctAnswer = values[targetSymbolIndex];
    const choices = generateDistractionChoices(correctAnswer, 4);

    return {
        puzzleType: PuzzleType.EQUATION,
        equations,
        symbols: selectedSymbols,
        targetSymbolIndex,
        correctAnswer,
        choices
    };
};

export const validateAnswer = (selectedValue: number, correctAnswer: number): boolean => {
    return selectedValue === correctAnswer;
};
