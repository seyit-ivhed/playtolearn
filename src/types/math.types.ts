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
} as const;

export type MathOperation = typeof MathOperation[keyof typeof MathOperation];

/**
 * Difficulty levels corresponds to Age 6-8
 * - Level 1: Age 6 (Apprentice)
 * - Level 2: Age 7 (Scout)
 * - Level 3: Age 8 (Adventurer)
 */
export type DifficultyLevel = 1 | 2 | 3;

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
    /** Configuration for Age 6 (Apprentice) */
    level1: LevelConfig;
    /** Configuration for Age 7 (Scout) */
    level2: LevelConfig;
    /** Configuration for Age 8 (Adventurer) */
    level3: LevelConfig;
}

interface Range {
    min: number;
    max: number;
}

interface OperationConfig {
    enabled: boolean;
    left: Range;
    right: Range;
}

interface LevelConfig {
    addition: OperationConfig;
    subtraction: OperationConfig;
    multiplication: OperationConfig;
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
