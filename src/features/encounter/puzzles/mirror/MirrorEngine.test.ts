import { describe, it, expect } from 'vitest';
import {
    MirrorEngine,
    generateMirrorData,
    type MirrorGridCell
} from './MirrorEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('MirrorEngine', () => {
    const gridSize = 3;
    const createPattern = (runeIndices: { x: number, y: number, runeIndex: number }[]): MirrorGridCell[] => {
        const pattern: MirrorGridCell[] = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const match = runeIndices.find(c => c.x === x && c.y === y);
                pattern.push({ x, y, runeIndex: match ? match.runeIndex : 0 });
            }
        }
        return pattern;
    };

    describe('checkSolution', () => {
        it('should return true for perfectly mirrored runes', () => {
            const left = createPattern([
                { x: 0, y: 0, runeIndex: 1 },
                { x: 1, y: 1, runeIndex: 1 }
            ]);
            // Mirrored across vertical axis: (x, y) -> (gridSize - 1 - x, y)
            // (0, 0) -> (2, 0)
            // (1, 1) -> (1, 1)
            const right = createPattern([
                { x: 2, y: 0, runeIndex: 1 },
                { x: 1, y: 1, runeIndex: 1 }
            ]);

            expect(MirrorEngine.checkSolution(left, right, gridSize)).toBe(true);
        });

        it('should return false if rune types are not mirrored', () => {
            const left = createPattern([{ x: 0, y: 0, runeIndex: 1 }]);
            const right = createPattern([{ x: 0, y: 0, runeIndex: 1 }]); // Centered position would be (2, 0)

            expect(MirrorEngine.checkSolution(left, right, gridSize)).toBe(false);
        });
    });

    describe('rotateCell', () => {
        it('should cycle through rune indices', () => {
            const pattern = createPattern([]);
            let result = MirrorEngine.rotateCell(pattern, 0, 0);
            expect(result.find(c => c.x === 0 && c.y === 0)?.runeIndex).toBe(1);

            result = MirrorEngine.rotateCell(result, 0, 0);
            expect(result.find(c => c.x === 0 && c.y === 0)?.runeIndex).toBe(0);
        });

        it('should not affect other cells', () => {
            const pattern = createPattern([{ x: 1, y: 1, runeIndex: 1 }]);
            const result = MirrorEngine.rotateCell(pattern, 0, 0);
            expect(result.find(c => c.x === 1 && c.y === 1)?.runeIndex).toBe(1);
        });
    });

    describe('generateMirrorData', () => {
        it('should generate valid puzzle data structure', () => {
            const data = generateMirrorData(1);
            expect(data.puzzleType).toBe(PuzzleType.MIRROR);
            expect(data.targetValue).toBe(3); // D1 -> 3
            expect(data.selectedRunes).toHaveLength(2);
        });

        it('should start with all right cells at index 0 (initial state)', () => {
            const data = generateMirrorData(2);
            expect(data.targetValue).toBe(4); // D2 -> 4
            expect(data.rightOptions.every(c => c.runeIndex === 0)).toBe(true);
        });
    });

    describe('Parameter Validation', () => {
        it('generateMirrorData should throw on invalid difficulty', () => {
            expect(() => generateMirrorData('invalid')).toThrow();
        });

        it('checkSolution should return false on missing patterns', () => {
            // @ts-expect-error Testing runtime check
            expect(MirrorEngine.checkSolution(null, [], 3)).toBe(false);
            // @ts-expect-error Testing runtime check
            expect(MirrorEngine.checkSolution([], null, 3)).toBe(false);
        });

        it('rotateCell should handle invalid inputs safely', () => {
            // @ts-expect-error Testing runtime check
            expect(MirrorEngine.rotateCell(null, 0, 0)).toEqual([]);
            // @ts-expect-error Testing runtime check
            expect(MirrorEngine.rotateCell([], 'x', 0)).toEqual([]);
        });
    });
});
