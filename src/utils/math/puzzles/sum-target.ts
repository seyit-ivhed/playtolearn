import { type DifficultyLevel } from '../../../types/math.types';
import { PuzzleType, type PuzzleData, type PuzzleOption } from '../../../types/adventure.types';
import { getRandomInt } from '../helpers';

export const generateSumTargetData = (difficulty: DifficultyLevel): PuzzleData => {
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
