import { describe, it, expect, vi } from 'vitest';
import {
    LatinSquareEngine,
    generateLatinSquareData,
    type LatinSquareElement
} from './LatinSquareEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('LatinSquareEngine', () => {
    const validGrid: LatinSquareElement[][] = [
        ['FIRE', 'WATER', 'EARTH', 'AIR'],
        ['EARTH', 'AIR', 'FIRE', 'WATER'],
        ['WATER', 'FIRE', 'AIR', 'EARTH'],
        ['AIR', 'EARTH', 'WATER', 'FIRE']
    ];

    describe('checkSolution', () => {
        it('should return true for a valid Latin Square', () => {
            expect(LatinSquareEngine.checkSolution(validGrid)).toBe(true);
        });

        it('should return false if a row has duplicates', () => {
            const invalidGrid: LatinSquareElement[][] = [
                ['FIRE', 'FIRE', 'EARTH', 'AIR'], // Duplicate FIRE
                ['EARTH', 'AIR', 'FIRE', 'WATER'],
                ['WATER', 'WATER', 'AIR', 'EARTH'], // Duplicate WATER (though one per row is enough to fail)
                ['AIR', 'EARTH', 'WATER', 'FIRE']
            ];
            expect(LatinSquareEngine.checkSolution(invalidGrid)).toBe(false);
        });

        it('should return false if a column has duplicates', () => {
            const invalidGrid: LatinSquareElement[][] = [
                ['FIRE', 'WATER', 'EARTH', 'AIR'],
                ['FIRE', 'AIR', 'WATER', 'EARTH'], // FIRE duplicate in col 0
                ['WATER', 'FIRE', 'AIR', 'EARTH'],
                ['AIR', 'EARTH', 'WATER', 'FIRE']
            ];
            expect(LatinSquareEngine.checkSolution(invalidGrid)).toBe(false);
        });

        it('should return false if there are null values', () => {
            const incompleteGrid: LatinSquareElement[][] = [
                ['FIRE', 'WATER', 'EARTH', 'AIR'],
                ['EARTH', null, 'FIRE', 'WATER'],
                ['WATER', 'FIRE', 'AIR', 'EARTH'],
                ['AIR', 'EARTH', 'WATER', 'FIRE']
            ];
            expect(LatinSquareEngine.checkSolution(incompleteGrid)).toBe(false);
        });

        it('should return false if row size is wrong', () => {
            const smallGrid: LatinSquareElement[][] = [
                ['FIRE', 'WATER', 'EARTH'],
                ['EARTH', 'AIR', 'FIRE'],
                ['WATER', 'FIRE', 'AIR']
            ] as any;
            expect(LatinSquareEngine.checkSolution(smallGrid)).toBe(false);
        });
    });

    describe('shuffle', () => {
        it('should maintain Latin Square properties after shuffle', () => {
            const grid = validGrid.map(row => [...row]);
            LatinSquareEngine.shuffle(grid);

            // It should still be a valid Latin Square
            expect(LatinSquareEngine.checkSolution(grid)).toBe(true);
        });

        it('should actually change the grid (statistically likely)', () => {
            const grid = validGrid.map(row => [...row]);
            const original = JSON.stringify(grid);

            // Mock random to return a value that guaranteed a swap for indices
            // e.g. when i=3, j = floor(0.1 * 4) = 0. Swaps index 3 and 0.
            vi.spyOn(Math, 'random').mockReturnValue(0.1);

            LatinSquareEngine.shuffle(grid);

            expect(JSON.stringify(grid)).not.toBe(original);
        });
    });

    describe('generateLatinSquareData', () => {
        // Ensure mocks are cleaned up between tests even if an expectation fails
        afterEach(() => {
            vi.restoreAllMocks();
        });
        it('should generate valid puzzle data structure', () => {
            const data = generateLatinSquareData(1);
            expect(data.puzzleType).toBe(PuzzleType.LATIN_SQUARE);
            expect(data.targetValue).toBe(4);
            expect(Array.isArray(data.options)).toBe(true);
            expect(data.options).toHaveLength(4); // 4 rows
            expect((data.options as any)[0]).toHaveLength(4); // 4 cols
        });

        it('should have correct number of fixed elements based on difficulty', () => {
            // difficulty 1: totalToKeep = max(4, 10 - 1*2) = 8
            const dataEasy = generateLatinSquareData(1);
            expect(dataEasy.rules).toHaveLength(8);

            // difficulty 3: totalToKeep = max(4, 10 - 3*2) = 4
            const dataHard = generateLatinSquareData(3);
            expect(dataHard.rules).toHaveLength(4);
        });

        it('should respect the rules format "row,col"', () => {
            const data = generateLatinSquareData(1);
            data.rules?.forEach(rule => {
                expect(rule).toMatch(/^\d,\d$/);
            });
        });

        it('should populate options grid with fixed elements at specified indices', () => {
            const data = generateLatinSquareData(1);
            const grid = data.options as unknown as LatinSquareElement[][];
            const fixedIndices = data.rules?.map(r => {
                const [row, col] = r.split(',').map(Number);
                return { row, col };
            }) || [];

            fixedIndices.forEach(({ row, col }) => {
                expect(grid[row][col]).not.toBeNull();
            });

            // Count non-nulls
            let nonNullCount = 0;
            grid.forEach(row => row.forEach(cell => {
                if (cell !== null) nonNullCount++;
            }));

            expect(nonNullCount).toBe(data.rules?.length);
        });
    });
});
