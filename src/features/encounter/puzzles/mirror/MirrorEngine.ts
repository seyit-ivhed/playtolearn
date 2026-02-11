import { PuzzleType, type MirrorData, type MirrorGridCell } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';

export type { MirrorGridCell, MirrorData };

export const generateMirrorData = (difficulty: DifficultyLevel): MirrorData => {
    const gridSize = difficulty + 2; // e.g. level 1 -> 3x3, level 2 -> 4x4
    const leftPattern: MirrorGridCell[] = [];
    const rightPattern: MirrorGridCell[] = [];

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const isActive = Math.random() > 0.6;
            leftPattern.push({ x, y, isActive });
            rightPattern.push({ x, y, isActive: false });
        }
    }

    return {
        puzzleType: PuzzleType.MIRROR,
        targetValue: gridSize,
        options: [],
        leftOptions: leftPattern,
        rightOptions: rightPattern
    };
};

export class MirrorEngine {

    static checkSolution(leftPattern: MirrorGridCell[], rightPattern: MirrorGridCell[], gridSize: number): boolean {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const leftCell = leftPattern.find(c => c.x === x && c.y === y);
                const mirroredX = gridSize - 1 - x;
                const rightCell = rightPattern.find(c => c.x === mirroredX && c.y === y);

                if (leftCell?.isActive !== rightCell?.isActive) {
                    return false;
                }
            }
        }
        return true;
    }

    static toggleCell(pattern: MirrorGridCell[], x: number, y: number): MirrorGridCell[] {
        return pattern.map(cell => {
            if (cell.x === x && cell.y === y) {
                return { ...cell, isActive: !cell.isActive };
            }
            return cell;
        });
    }
}
