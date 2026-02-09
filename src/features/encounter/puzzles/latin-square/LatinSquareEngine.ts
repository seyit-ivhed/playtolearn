import { PuzzleType, type LatinSquareData, type LatinSquareElement } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';

export type { LatinSquareData, LatinSquareElement };

export const generateLatinSquareData = (difficulty: DifficultyLevel): LatinSquareData => {
    const solution: LatinSquareElement[][] = [
        ['FIRE', 'WATER', 'EARTH', 'AIR'],
        ['EARTH', 'AIR', 'FIRE', 'WATER'],
        ['WATER', 'FIRE', 'AIR', 'EARTH'],
        ['AIR', 'EARTH', 'WATER', 'FIRE']
    ];

    LatinSquareEngine.shuffle(solution);

    const puzzleGrid: LatinSquareElement[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

    const candidates: { row: number, col: number }[] = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            candidates.push({ row, col });
        }
    }

    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const totalToKeep = Math.min(16, Math.max(4, 10 - difficulty * 2));
    const fixedIndices = candidates.slice(0, totalToKeep);

    fixedIndices.forEach(({ row, col }) => {
        puzzleGrid[row][col] = solution[row][col];
    });

    return {
        puzzleType: PuzzleType.LATIN_SQUARE,
        targetValue: 4,
        grid: puzzleGrid,
        fixedIndices
    };
};

export class LatinSquareEngine {

    static shuffle(grid: LatinSquareElement[][]) {
        for (let i = 3; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [grid[i], grid[j]] = [grid[j], grid[i]];
        }
        for (let i = 3; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            for (let row = 0; row < 4; row++) {
                [grid[row][i], grid[row][j]] = [grid[row][j], grid[row][i]];
            }
        }
    }

    static checkSolution(grid: LatinSquareElement[][]): boolean {
        for (let r = 0; r < 4; r++) {
            const rowSet = new Set(grid[r]);
            if (rowSet.size !== 4 || rowSet.has(null)) {
                return false;
            }
        }
        for (let c = 0; c < 4; c++) {
            const colValues = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            const colSet = new Set(colValues);
            if (colSet.size !== 4 || colSet.has(null)) {
                return false;
            }
        }
        return true;
    }
}
