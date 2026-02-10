export const PuzzleType = {
    REFILL_CANTEEN: 'REFILL_CANTEEN',
    BALANCE: 'BALANCE',
    SEQUENCE: 'SEQUENCE',
    SYMMETRY: 'SYMMETRY',
    LATIN_SQUARE: 'LATIN_SQUARE',
    NUMBER_PATH: 'NUMBER_PATH',
    EQUATION: 'EQUATION'
} as const;

export type PuzzleType = typeof PuzzleType[keyof typeof PuzzleType];

export interface PuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
    instruction?: string;
}

export interface PuzzleOption {
    value: number;
    type: 'ADD' | 'MULTIPLY';
    label?: string;
}

export interface BasePuzzleConfig {
    puzzleType: PuzzleType;
}

export interface RefillCanteenConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.REFILL_CANTEEN;
    targetValue?: number;
    options?: (number | PuzzleOption)[];
}

export interface BalanceConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.BALANCE;
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
    initialLeftWeight?: number;
    initialRightWeight?: number;
}

export interface SequenceConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.SEQUENCE;
    targetValue?: number;
    options?: (number | PuzzleOption)[];
    rules?: string[];
}

export interface SymmetryConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.SYMMETRY;
    targetValue?: number;
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
}

export interface LatinSquareConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.LATIN_SQUARE;
    options?: (number | PuzzleOption)[];
    rules?: string[];
}

export interface NumberPathConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.NUMBER_PATH;
    gridSize?: number;
    startValue?: number;
    stepValue?: number;
    preFilledIndices?: { row: number; col: number; value: number }[];
}

export interface EquationConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.EQUATION;
}

export type PuzzleConfig =
    | RefillCanteenConfig
    | BalanceConfig
    | SequenceConfig
    | SymmetryConfig
    | LatinSquareConfig
    | NumberPathConfig
    | EquationConfig;

export interface BasePuzzleData {
    puzzleType: PuzzleType;
}

export interface RefillCanteenData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.REFILL_CANTEEN;
    targetValue: number;
    options: (number | PuzzleOption)[];
}

export interface Weight {
    id: string;
    value: number;
    isHeavy: boolean;
}

export interface BalanceData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.BALANCE;
    targetValue: number;
    options: (number | PuzzleOption)[];
    leftStack: Weight[];
    rightStack: Weight[];
    targetBalance: number;
}

export interface SequenceData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.SEQUENCE;
    targetValue: number;
    options: (number | PuzzleOption)[];
    rules: string[];
}

export interface SymmetryGridCell {
    x: number;
    y: number;
    isActive: boolean;
}

export interface SymmetryData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.SYMMETRY;
    targetValue: number;
    options: (number | PuzzleOption)[];
    leftOptions: SymmetryGridCell[];
    rightOptions: SymmetryGridCell[];
}

export type LatinSquareElement = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | null;

export interface LatinSquareData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.LATIN_SQUARE;
    targetValue: number;
    grid: LatinSquareElement[][];
    fixedIndices: { row: number; col: number }[];
}

export interface NumberPathData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.NUMBER_PATH;
    gridSize: number;
    startValue: number;
    stepValue: number;
    preFilledIndices: { row: number; col: number; value: number }[];
    targetValue: number;
}

export interface EquationTerm {
    symbolIndex: number;
    coefficient: number;
}

export interface Equation {
    left: EquationTerm[];
    right: number;
}

export interface EquationData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.EQUATION;
    equations: Equation[];
    symbols: string[];
    targetSymbolIndex: number;
    correctAnswer: number;
    choices: number[];
}

export type PuzzleData =
    | RefillCanteenData
    | BalanceData
    | SequenceData
    | SymmetryData
    | LatinSquareData
    | NumberPathData
    | EquationData;
