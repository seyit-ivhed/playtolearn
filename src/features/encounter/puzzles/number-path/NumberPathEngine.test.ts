import { describe, it, expect } from 'vitest';
import {
    findCellPosition,
    areAdjacent,
    calculateSequenceState,
    validateMove,
    generateNumberPathData,
    generateSnakePath,
    type CellData
} from './NumberPathEngine';

describe('NumberPathEngine', () => {
    const createEmptyGrid = (size: number): CellData[][] => {
        return Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({ value: null, isFixed: false }))
        );
    };

    describe('findCellPosition', () => {
        it('should find the position of a value', () => {
            const grid = createEmptyGrid(3);
            grid[1][1] = { value: 5, isFixed: false };
            const pos = findCellPosition(grid, 5);
            expect(pos).toEqual({ row: 1, col: 1 });
        });

        it('should return null if value not found', () => {
            const grid = createEmptyGrid(3);
            expect(findCellPosition(grid, 5)).toBeNull();
        });
    });

    describe('areAdjacent', () => {
        it('should return true for orthogonal neighbors', () => {
            expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 2 })).toBe(true);
            expect(areAdjacent({ row: 1, col: 1 }, { row: 0, col: 1 })).toBe(true);
        });

        it('should return false for diagonal or far cells', () => {
            expect(areAdjacent({ row: 1, col: 1 }, { row: 2, col: 2 })).toBe(false);
            expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 3 })).toBe(false);
            expect(areAdjacent({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(false);
        });
    });

    describe('calculateSequenceState', () => {
        it('should correctly find the current head and next expected value', () => {
            const grid = createEmptyGrid(3);
            grid[0][0] = { value: 1, isFixed: true };
            grid[0][1] = { value: 2, isFixed: false };
            grid[0][2] = { value: 3, isFixed: false };

            const state = calculateSequenceState(grid, 1, 1);
            expect(state.currentHeadValue).toBe(3);
            expect(state.nextExpectedValue).toBe(4);
        });

        it('should handle step values other than 1', () => {
            const grid = createEmptyGrid(3);
            grid[0][0] = { value: 3, isFixed: true };
            grid[0][1] = { value: 6, isFixed: false };

            const state = calculateSequenceState(grid, 3, 3);
            expect(state.currentHeadValue).toBe(6);
            expect(state.nextExpectedValue).toBe(9);
        });
    });

    describe('validateMove', () => {
        it('should allow move next to head', () => {
            const grid = createEmptyGrid(3);
            grid[0][0] = { value: 1, isFixed: true };

            // Move to 0,1 (adjacent to 1)
            const isValid = validateMove(grid, { row: 0, col: 1 }, 1, 2, 1);
            expect(isValid).toBe(true);
        });

        it('should reject move not next to head', () => {
            const grid = createEmptyGrid(3);
            grid[0][0] = { value: 1, isFixed: true };

            // Move to 1,1 (diagonal)
            const isValid = validateMove(grid, { row: 1, col: 1 }, 1, 2, 1);
            expect(isValid).toBe(false);
        });

        it('should ensure adjacency to next fixed number (bridge validation)', () => {
            const grid = createEmptyGrid(3);
            grid[0][0] = { value: 1, isFixed: true };
            grid[0][2] = { value: 3, isFixed: true }; // 3 is fixed

            // Trying to place 2 at 1,1
            // 1,1 is adjacent to head (0,0)
            // BUT 1,1 is NOT adjacent to 0,2 (where 3 is)
            const isValid = validateMove(grid, { row: 1, col: 1 }, 1, 2, 1);
            expect(isValid).toBe(false);

            // Trying to place 2 at 0,1
            // 0,1 is adjacent to head (0,0)
            // AND 0,1 is adjacent to 0,2 (where 3 is)
            const isValidOk = validateMove(grid, { row: 0, col: 1 }, 1, 2, 1);
            expect(isValidOk).toBe(true);
        });
    });

    describe('generateNumberPathData', () => {
        it('should generate valid data for Easy (difficulty 1)', () => {
            const data = generateNumberPathData(1);
            expect(data.gridSize).toBe(3);
            expect(data.stepValue).toBe(1);
            expect(data.preFilledIndices!.length).toBeGreaterThanOrEqual(2);
            // Verify first value is startValue
            expect(data.preFilledIndices!.some(p => p.value === data.startValue)).toBe(true);
        });

        it('should generate valid data for Medium (difficulty 2)', () => {
            const data = generateNumberPathData(2);
            expect(data.gridSize).toBe(4);
            expect(data.stepValue).toBe(1);
        });

        it('should generate valid data for Hard (difficulty 3)', () => {
            const data = generateNumberPathData(3);
            expect(data.gridSize).toBe(5);
            expect([3, 4]).toContain(data.stepValue);
            expect(data.startValue).toBe(data.stepValue);
        });

        it('should generate a full sequence of numbers in preFilledIndices if we fill manually', () => {
            // This is more of an integration check for the Hamiltonian path generator
            // We ensure it returns a valid structure that doesn't crash
            for (let i = 0; i < 5; i++) {
                const data = generateNumberPathData(3);
                expect(data.preFilledIndices!.length).toBeGreaterThan(0);
                data.preFilledIndices!.forEach(p => {
                    expect(p.row).toBeLessThan(data.gridSize!);
                    expect(p.col).toBeLessThan(data.gridSize!);
                });
            }
        });
    });

    describe('generateSnakePath', () => {
        it('should generate a path covering all cells', () => {
            const size = 3;
            const path = generateSnakePath(size);
            expect(path).toHaveLength(size * size);

            // Verify all unique positions are present
            const uniquePos = new Set(path.map(p => `${p.row},${p.col}`));
            expect(uniquePos.size).toBe(size * size);
        });
    });
});
