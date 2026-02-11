import { describe, it, expect } from 'vitest';
import {
    MirrorEngine,
    generateMirrorData,
    type MirrorGridCell
} from './MirrorEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('MirrorEngine', () => {
    const gridSize = 3;
    const createPattern = (activeCoords: { x: number, y: number }[]): MirrorGridCell[] => {
        const pattern: MirrorGridCell[] = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const isActive = activeCoords.some(c => c.x === x && c.y === y);
                pattern.push({ x, y, isActive });
            }
        }
        return pattern;
    };

    describe('checkSolution', () => {
        it('should return true for perfectly mirrored patterns', () => {
            const left = createPattern([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
            // Mirrored across vertical axis: (x, y) -> (gridSize - 1 - x, y)
            // (0, 0) -> (2, 0)
            // (1, 1) -> (1, 1)
            const right = createPattern([{ x: 2, y: 0 }, { x: 1, y: 1 }]);

            expect(MirrorEngine.checkSolution(left, right, gridSize)).toBe(true);
        });

        it('should return false if patterns are not mirrored', () => {
            const left = createPattern([{ x: 0, y: 0 }]);
            const right = createPattern([{ x: 0, y: 0 }]); // This is same, not mirrored (unless center)

            expect(MirrorEngine.checkSolution(left, right, gridSize)).toBe(false);
        });

        it('should return false if a cell is missing in one pattern', () => {
            const left = createPattern([{ x: 0, y: 0 }]);
            const right = createPattern([{ x: 2, y: 0 }]);

            // Remove a cell from right
            const incompleteRight = right.filter(c => !(c.x === 2 && c.y === 0));

            expect(MirrorEngine.checkSolution(left, incompleteRight, gridSize)).toBe(false);
        });
    });

    describe('toggleCell', () => {
        it('should toggle an inactive cell to active', () => {
            const pattern = createPattern([]);
            const result = MirrorEngine.toggleCell(pattern, 0, 0);
            expect(result.find(c => c.x === 0 && c.y === 0)?.isActive).toBe(true);
        });

        it('should toggle an active cell to inactive', () => {
            const pattern = createPattern([{ x: 0, y: 0 }]);
            const result = MirrorEngine.toggleCell(pattern, 0, 0);
            expect(result.find(c => c.x === 0 && c.y === 0)?.isActive).toBe(false);
        });

        it('should not affect other cells', () => {
            const pattern = createPattern([{ x: 1, y: 1 }]);
            const result = MirrorEngine.toggleCell(pattern, 0, 0);
            expect(result.find(c => c.x === 1 && c.y === 1)?.isActive).toBe(true);
        });
    });

    describe('generateMirrorData', () => {
        it('should generate valid puzzle data structure', () => {
            const data = generateMirrorData(1);
            expect(data.puzzleType).toBe(PuzzleType.MIRROR);
            expect(data.targetValue).toBe(3); // gridSize for difficulty 1
            expect(Array.isArray(data.leftOptions)).toBe(true);
            expect(Array.isArray(data.rightOptions)).toBe(true);
        });

        it('should have gridSize x gridSize cells in patterns', () => {
            const data = generateMirrorData(1);
            const size = data.targetValue as number;
            expect(data.leftOptions).toHaveLength(size * size);
            expect(data.rightOptions).toHaveLength(size * size);
        });

        it('should start with all right cells inactive', () => {
            const data = generateMirrorData(2);
            const rightPattern = data.rightOptions as unknown as MirrorGridCell[];
            expect(rightPattern.every(c => !c.isActive)).toBe(true);
        });

        it('should scale grid size with difficulty', () => {
            const data1 = generateMirrorData(1);
            const data2 = generateMirrorData(2);
            expect(data1.targetValue).toBe(3);
            expect(data2.targetValue).toBe(4);
        });
    });
});
