import { PuzzleType, type MirrorData, type MirrorGridCell } from '@/types/adventure.types';
import { type DifficultyLevel } from '@/types/math.types';

export type { MirrorGridCell, MirrorData };

const AVAILABLE_RUNES = [
    '/assets/images/runes/rune-1.png',
    '/assets/images/runes/rune-2.png',
    '/assets/images/runes/rune-3.png',
    '/assets/images/runes/rune-4.png',
    '/assets/images/runes/rune-5.png',
    '/assets/images/runes/rune-6.png',
    '/assets/images/runes/rune-7.png',
];

export const generateMirrorData = (difficulty: DifficultyLevel): MirrorData => {
    const gridSize = Math.floor(difficulty / 2) + 3; // D1 -> 3x3, D2 -> 4x4, D3 -> 4x4, D4 -> 5x5
    const leftPattern: MirrorGridCell[] = [];
    const rightPattern: MirrorGridCell[] = [];

    // Pick 2 random runes
    const shuffledRunes = [...AVAILABLE_RUNES].sort(() => Math.random() - 0.5);
    const selectedRunes = shuffledRunes.slice(0, 2);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const runeIndex = Math.random() > 0.5 ? 1 : 0;
            leftPattern.push({ x, y, runeIndex });

            // Initial right side is all runeIndex 0 or randomized but not mirrored
            rightPattern.push({ x, y, runeIndex: 0 });
        }
    }

    return {
        puzzleType: PuzzleType.MIRROR,
        targetValue: gridSize,
        options: [],
        leftOptions: leftPattern,
        rightOptions: rightPattern,
        selectedRunes
    };
};

export class MirrorEngine {

    static checkSolution(leftPattern: MirrorGridCell[], rightPattern: MirrorGridCell[], gridSize: number): boolean {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const leftCell = leftPattern.find(c => c.x === x && c.y === y);
                const mirroredX = gridSize - 1 - x;
                const rightCell = rightPattern.find(c => c.x === mirroredX && c.y === y);

                if (leftCell?.runeIndex !== rightCell?.runeIndex) {
                    return false;
                }
            }
        }
        return true;
    }

    static rotateCell(pattern: MirrorGridCell[], x: number, y: number): MirrorGridCell[] {
        return pattern.map(cell => {
            if (cell.x === x && cell.y === y) {
                // Toggles between index 0 and 1
                return { ...cell, runeIndex: (cell.runeIndex + 1) % 2 };
            }
            return cell;
        });
    }
}
