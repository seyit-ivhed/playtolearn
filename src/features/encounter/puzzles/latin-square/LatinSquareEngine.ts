import { PuzzleType, type LatinSquareData, type LatinSquareElement } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';
import { RUNE_ASSETS } from '../../../../data/puzzle-assets';

export type { LatinSquareData, LatinSquareElement };

interface LatinSquareDifficultyConfig {
    gridSize: number;
    fixedCount: number;
}

const getDifficultyConfig = (difficulty: DifficultyLevel): LatinSquareDifficultyConfig => {
    switch (difficulty) {
        case 1:
            return { gridSize: 3, fixedCount: 5 };
        case 2:
            return { gridSize: 4, fixedCount: 8 };
        case 3:
            return { gridSize: 4, fixedCount: 6 };
        default:
            return { gridSize: 4, fixedCount: 8 };
    }
};

const getBaseSolution = (size: number): LatinSquareElement[][] => {
    if (size === 3) {
        return [
            [0, 1, 2],
            [2, 0, 1],
            [1, 2, 0]
        ];
    }
    return [
        [0, 1, 2, 3],
        [2, 3, 0, 1],
        [1, 0, 3, 2],
        [3, 2, 1, 0]
    ];
};

export const generateLatinSquareData = (difficulty: DifficultyLevel): LatinSquareData => {
    const config = getDifficultyConfig(difficulty);
    const { gridSize, fixedCount } = config;

    const solution = getBaseSolution(gridSize);
    LatinSquareEngine.shuffle(solution);

    const puzzleGrid: LatinSquareElement[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

    const candidates: { row: number, col: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            candidates.push({ row, col });
        }
    }

    // Shuffle candidates to pick fixed spots
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const fixedIndices = candidates.slice(0, fixedCount);

    fixedIndices.forEach(({ row, col }) => {
        puzzleGrid[row][col] = solution[row][col];
    });

    // Pick random runes for this instance
    const selectedRunes = [...RUNE_ASSETS]
        .sort(() => Math.random() - 0.5)
        .slice(0, gridSize);

    return {
        puzzleType: PuzzleType.LATIN_SQUARE,
        targetValue: gridSize,
        grid: puzzleGrid,
        fixedIndices,
        selectedRunes
    };
};

export class LatinSquareEngine {

    static shuffle(grid: LatinSquareElement[][]) {
        const size = grid.length;
        // Shuffle rows
        for (let i = size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [grid[i], grid[j]] = [grid[j], grid[i]];
        }
        // Shuffle columns
        for (let i = size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            for (let row = 0; row < size; row++) {
                [grid[row][i], grid[row][j]] = [grid[row][j], grid[row][i]];
            }
        }
    }

    static checkSolution(grid: LatinSquareElement[][]): boolean {
        const size = grid.length;
        if (size < 1) {
            return false;
        }

        // Check rows
        for (let r = 0; r < size; r++) {
            const rowSet = new Set(grid[r]);
            if (rowSet.size !== size || rowSet.has(null)) {
                return false;
            }
        }

        // Check columns
        for (let c = 0; c < size; c++) {
            const colValues = [];
            for (let r = 0; r < size; r++) {
                colValues.push(grid[r][c]);
            }
            const colSet = new Set(colValues);
            if (colSet.size !== size || colSet.has(null)) {
                return false;
            }
        }
        return true;
    }
}
