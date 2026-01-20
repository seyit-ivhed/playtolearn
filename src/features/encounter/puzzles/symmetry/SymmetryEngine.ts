import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';

export interface SymmetryGridCell {
    x: number;
    y: number;
    isActive: boolean;
}

export interface SymmetryPuzzleData extends PuzzleData {
    gridSize: number;
    leftPattern: SymmetryGridCell[];
    rightPattern: SymmetryGridCell[];
}

export const generateSymmetryData = (difficulty: DifficultyLevel): PuzzleData => {
    const gridSize = difficulty + 2; // e.g. level 1 -> 3x3, level 2 -> 4x4
    const leftPattern: SymmetryGridCell[] = [];
    const rightPattern: SymmetryGridCell[] = [];

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const isActive = Math.random() > 0.6;
            leftPattern.push({ x, y, isActive });
            rightPattern.push({ x, y, isActive: false });
        }
    }

    return {
        puzzleType: PuzzleType.SYMMETRY,
        targetValue: gridSize, // misused as grid size for simplicity in data passing
        options: [],
        leftOptions: leftPattern as any,
        rightOptions: rightPattern as any
    } as PuzzleData;
};

export class SymmetryEngine {

    static checkSolution(leftPattern: SymmetryGridCell[], rightPattern: SymmetryGridCell[], gridSize: number): boolean {
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

    static toggleCell(pattern: SymmetryGridCell[], x: number, y: number): SymmetryGridCell[] {
        return pattern.map(cell =>
            cell.x === x && cell.y === y ? { ...cell, isActive: !cell.isActive } : cell
        );
    }
}
