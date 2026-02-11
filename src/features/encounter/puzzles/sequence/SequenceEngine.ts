import { type DifficultyLevel } from '../../../../types/math.types';
import { PuzzleType, type SequenceData } from '../../../../types/adventure.types';
import { getRandomInt } from '../../../../utils/math/helpers';

export type { SequenceData };

interface StarPosition {
    x: number;
    y: number;
}

interface SequenceRule {
    readonly name: string;
    getNext(lastValue: number): number;
    isValid(lastValue: number, nextValue: number): boolean;
}

export class AdditionRule implements SequenceRule {
    readonly step: number;

    constructor(step: number) {
        if (typeof step !== 'number' || Number.isNaN(step)) {
            console.error('Invalid step for AdditionRule');
            this.step = 0;
            return;
        }
        this.step = step;
    }

    get name() { return `ADD_${this.step}`; }
    getNext(lastValue: number) { return lastValue + this.step; }
    isValid(lastValue: number, nextValue: number) { return nextValue === lastValue + this.step; }
}

export class MultiplicationRule implements SequenceRule {
    readonly factor: number;

    constructor(factor: number) {
        if (typeof factor !== 'number' || Number.isNaN(factor)) {
            console.error('Invalid factor for MultiplicationRule');
            this.factor = 1;
            return;
        }
        this.factor = factor;
    }

    get name() { return `MULTIPLY_${this.factor}`; }
    getNext(lastValue: number) { return lastValue * this.factor; }
    isValid(lastValue: number, nextValue: number) { return nextValue === lastValue * this.factor; }
}

export const SequenceRuleFactory = {
    getRule(ruleName: string): SequenceRule | null {
        if (!ruleName) {
            console.error('Sequence rule name is required');
            return null;
        }

        if (ruleName.startsWith('ADD_')) {
            const step = parseInt(ruleName.replace('ADD_', ''), 10);
            return new AdditionRule(step);
        }
        if (ruleName.startsWith('MULTIPLY_')) {
            const factor = parseInt(ruleName.replace('MULTIPLY_', ''), 10);
            return new MultiplicationRule(factor);
        }

        console.error(`Unknown sequence rule: ${ruleName}`);
        return null;
    }
};

export const validateNextStep = (
    currentValues: number[],
    nextValue: number,
    rules: string[] = []
): boolean => {
    if (!currentValues || !Array.isArray(currentValues)) {
        console.error('currentValues must be an array');
        return false;
    }

    if (currentValues.length === 0) {
        return true;
    }

    if (!rules || rules.length === 0) {
        console.error('Rules are required for sequence validation');
        return false;
    }

    const rule = SequenceRuleFactory.getRule(rules[0]);
    if (!rule) {
        return false;
    }

    const lastValue = currentValues[currentValues.length - 1];
    return rule.isValid(lastValue, nextValue);
};

export const isSequenceComplete = (
    currentValues: number[],
    targetValue: number
): boolean => {
    if (!currentValues || !Array.isArray(currentValues)) {
        console.error('currentValues must be an array');
        return false;
    }
    if (currentValues.length === 0) {
        return false;
    }
    return currentValues[currentValues.length - 1] >= targetValue;
};

export const generateStarPositions = (
    count: number,
    safeMargin: number = 10
): StarPosition[] => {
    if (typeof count !== 'number') {
        console.error('Count must be a number');
        return [];
    }

    const positions: StarPosition[] = [];
    const maxAttempts = 50;

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let valid = false;
        let pos = { x: 0, y: 0 };

        while (!valid && attempts < maxAttempts) {
            attempts++;
            pos = {
                x: Math.floor(Math.random() * 80) + 10,
                y: Math.floor(Math.random() * 80) + 10
            };

            valid = positions.every(existing => {
                const dx = existing.x - pos.x;
                const dy = existing.y - pos.y;
                return Math.sqrt(dx * dx + dy * dy) >= safeMargin;
            });
        }
        positions.push(pos);
    }
    return positions;
};

const getLevelConfig = (difficulty: DifficultyLevel) => {
    if (difficulty === 1) {
        return {
            rule: new AdditionRule(getRandomInt(1, 2)),
            startValue: getRandomInt(1, 5),
            count: 8
        };
    }
    if (difficulty === 2) {
        const step = getRandomInt(3, 10);
        return {
            rule: new AdditionRule(step),
            startValue: getRandomInt(1, 10),
            count: 12
        };
    }
    const factor = getRandomInt(2, 5);
    return {
        rule: new MultiplicationRule(factor),
        startValue: factor,
        count: 6
    };
};

export const generateSequenceData = (difficulty: DifficultyLevel): SequenceData => {
    if (typeof difficulty !== 'number') {
        console.error('Difficulty must be a number');
        // Return dummy data since we can't just 'return' from a function that expects PuzzleData
        return {
            puzzleType: PuzzleType.SEQUENCE,
            targetValue: 0,
            options: [],
            rules: []
        };
    }

    const config = getLevelConfig(difficulty);
    const { rule, startValue, count } = config;

    const validSequence: number[] = [];
    let current = startValue;

    for (let i = 0; i < count; i++) {
        validSequence.push(current);
        current = rule.getNext(current);
    }

    return {
        puzzleType: PuzzleType.SEQUENCE,
        targetValue: validSequence[validSequence.length - 1],
        options: validSequence,
        rules: [rule.name]
    };
};
