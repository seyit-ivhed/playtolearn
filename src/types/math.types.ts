/**
 * Math Engine Type Definitions
 * 
 * Defines the core types for the math problem generation and validation system.
 */

/**
 * Supported mathematical operations
 */
export const MathOperation = {
    ADD: 'ADD',
    SUBTRACT: 'SUBTRACT',
    MULTIPLY: 'MULTIPLY',
    DIVIDE: 'DIVIDE',
} as const;

export type MathOperation = typeof MathOperation[keyof typeof MathOperation];

/**
 * Difficulty levels for the prototype (targeting ages 6-10)
 * - Level 1: Ages 6-8, Grades 1-2
 * - Level 2: Ages 8-10, Grades 3-4
 */
export type DifficultyLevel = 1 | 2;

/**
 * Feedback state for answer validation
 */
export type FeedbackState = 'pending' | 'correct' | 'incorrect';

/**
 * Represents a single math problem
 */
export interface MathProblem {
    /** First operand */
    operand1: number;

    /** Second operand */
    operand2: number;

    /** Mathematical operation to perform */
    operation: MathOperation;

    /** The correct answer */
    correctAnswer: number;

    /** Optional multiple choice answers (includes correct answer) */
    choices?: number[];

    /** Difficulty level of this problem */
    difficulty: DifficultyLevel;

    /** Unique identifier for tracking */
    id?: string;

    /** Timestamp when problem was generated */
    createdAt?: Date;
}

/**
 * Configuration for math problem generation ranges
 */
export interface MathEngineConfig {
    /** Configuration for difficulty level 1 */
    level1: {
        addition: { min: number; max: number };
        subtraction: { min: number; max: number };
        multiplication: { min: number; max: number };
        division: { divisorMax: number };
    };

    /** Configuration for difficulty level 2 */
    level2: {
        addition: { min: number; max: number };
        subtraction: { min: number; max: number };
        multiplication: { min: number; max: number };
        division: { divisorMax: number };
    };
}

/**
 * Result of answer validation
 */
export interface ValidationResult {
    /** Whether the answer is correct */
    isCorrect: boolean;

    /** The user's submitted answer */
    userAnswer: number;

    /** The correct answer */
    correctAnswer: number;

    /** Feedback state */
    feedback: FeedbackState;
}
