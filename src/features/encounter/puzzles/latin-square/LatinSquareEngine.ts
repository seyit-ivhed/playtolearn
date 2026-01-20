import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';

export type LatinSquareElement = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | null;

export interface LatinSquarePuzzleData extends PuzzleData {
    grid: LatinSquareElement[][];
    fixedIndices: { row: number, col: number }[];
    solution: LatinSquareElement[][];
}

export const generateLatinSquareData = (difficulty: DifficultyLevel): PuzzleData => {
    const solution: LatinSquareElement[][] = [
        ['FIRE', 'WATER', 'EARTH', 'AIR'],
        ['EARTH', 'AIR', 'FIRE', 'WATER'],
        ['WATER', 'FIRE', 'AIR', 'EARTH'],
        ['AIR', 'EARTH', 'WATER', 'FIRE']
    ];

    LatinSquareEngine.shuffle(solution);

    const grid: LatinSquareElement[][] = solution.map(row => [...row]);
    const fixedIndices: { row: number, col: number }[] = [];

    const totalToKeep = Math.max(4, 10 - difficulty * 2);
    let kept = 0;

    const puzzleGrid: LatinSquareElement[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

    while (kept < totalToKeep) {
        const row = Math.floor(Math.random() * 4);
        const col = Math.floor(Math.random() * 4);
        if (puzzleGrid[row][col] === null) {
            puzzleGrid[row][col] = grid[row][col];
            fixedIndices.push({ row, col });
            kept++;
        }
    }

    return {
        puzzleType: PuzzleType.LATIN_SQUARE,
        targetValue: 4,
        options: puzzleGrid as any,
        rules: fixedIndices.map(f => `${f.row},${f.col}`)
    } as PuzzleData;
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
            if (rowSet.size !== 4 || rowSet.has(null)) return false;
        }
        for (let c = 0; c < 4; c++) {
            const colValues = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            const colSet = new Set(colValues);
            if (colSet.size !== 4 || colSet.has(null)) return false;
        }
        return true;
    }
}
