import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import type { DifficultyLevel } from '../../../../types/math.types';

export interface Position {
    row: number;
    col: number;
}

export interface CellData {
    value: number | null;
    isFixed: boolean;
}

export const findCellPosition = (grid: CellData[][], targetValue: number): Position | null => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].value === targetValue) {
                return { row, col };
            }
        }
    }
    return null;
};

export const areAdjacent = (p1: Position, p2: Position): boolean => {
    const dr = Math.abs(p1.row - p2.row);
    const dc = Math.abs(p1.col - p2.col);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
};

export const calculateSequenceState = (
    grid: CellData[][],
    startValue: number,
    stepValue: number
): { currentHeadValue: number; nextExpectedValue: number } => {
    let maxVal = startValue;

    while (true) {
        const nextVal = maxVal + stepValue;
        if (findCellPosition(grid, nextVal)) {
            maxVal = nextVal;
        } else {
            break;
        }
    }

    return {
        currentHeadValue: maxVal,
        nextExpectedValue: maxVal + stepValue
    };
};

export const validateMove = (
    grid: CellData[][],
    pos: Position,
    currentHeadValue: number,
    nextExpectedValue: number,
    stepValue: number
): boolean => {
    const headPos = findCellPosition(grid, currentHeadValue);
    if (headPos && !areAdjacent(pos, headPos)) {
        return false;
    }

    const bridgeTargetVal = nextExpectedValue + stepValue;
    const bridgeTargetPos = findCellPosition(grid, bridgeTargetVal);

    if (bridgeTargetPos && !areAdjacent(pos, bridgeTargetPos)) {
        return false;
    }

    return true;
};

export const generateNumberPathData = (difficulty: DifficultyLevel): PuzzleData => {
    let gridSize = 3;
    let stepValue = 1;
    let startValue = 1;

    if (difficulty === 1) {
        gridSize = 3;
    } else if (difficulty === 2) {
        gridSize = 4;
    } else {
        gridSize = 5;
        stepValue = Math.random() < 0.5 ? 3 : 4;
        startValue = stepValue;
    }

    const path = generateHamiltonianPath(gridSize);
    const preFilledIndices: { row: number; col: number; value: number }[] = [];
    const totalCells = gridSize * gridSize;

    // Always fill the first number
    preFilledIndices.push({
        row: path[0].row,
        col: path[0].col,
        value: startValue
    });

    // Always fill the last number to show the destination
    preFilledIndices.push({
        row: path[totalCells - 1].row,
        col: path[totalCells - 1].col,
        value: startValue + (totalCells - 1) * stepValue
    });

    // For Easy/Medium, fill the second number too to give a direction
    if (difficulty <= 2) {
        preFilledIndices.push({
            row: path[1].row,
            col: path[1].col,
            value: startValue + stepValue
        });
    }

    // Increase fixed count to roughly 40-50% for better guidance
    const desiredFixedCount = Math.floor(totalCells * 0.45);

    // Potential candidates (excluding already filled ones)
    const existingIndices = new Set(preFilledIndices.map(p => path.findIndex(pos => pos.row === p.row && pos.col === p.col)));
    const candidates = Array.from({ length: totalCells }, (_, i) => i)
        .filter(i => !existingIndices.has(i));

    // Shuffle candidates
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    let filledCount = preFilledIndices.length;
    for (const index of candidates) {
        if (filledCount >= desiredFixedCount) {
            break;
        }

        preFilledIndices.push({
            row: path[index].row,
            col: path[index].col,
            value: startValue + (index * stepValue)
        });
        filledCount++;
    }

    return {
        puzzleType: PuzzleType.NUMBER_PATH,
        targetValue: totalCells,
        options: [],
        gridSize,
        startValue,
        stepValue,
        preFilledIndices,
    };
};

function generateHamiltonianPath(size: number): Position[] {
    const totalCells = size * size;

    for (let attempt = 0; attempt < 20; attempt++) {
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const path: Position[] = [];

        visited[startRow][startCol] = true;
        path.push({ row: startRow, col: startCol });

        if (backtrackPath(size, totalCells, visited, path, startRow, startCol)) {
            return path;
        }
    }

    return generateSnakePath(size);
}

function backtrackPath(
    size: number,
    targetLength: number,
    visited: boolean[][],
    path: Position[],
    currRow: number,
    currCol: number
): boolean {
    if (path.length === targetLength) {
        return true;
    }

    const moves = [
        { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
    ];

    // Shuffle moves
    for (let i = moves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [moves[i], moves[j]] = [moves[j], moves[i]];
    }

    for (const move of moves) {
        const nextRow = currRow + move.r;
        const nextCol = currCol + move.c;

        if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size && !visited[nextRow][nextCol]) {
            visited[nextRow][nextCol] = true;
            path.push({ row: nextRow, col: nextCol });

            if (backtrackPath(size, targetLength, visited, path, nextRow, nextCol)) {
                return true;
            }

            path.pop();
            visited[nextRow][nextCol] = false;
        }
    }

    return false;
}

export function generateSnakePath(size: number): Position[] {
    const path: Position[] = [];
    for (let r = 0; r < size; r++) {
        if (r % 2 === 0) {
            for (let c = 0; c < size; c++) {
                path.push({ row: r, col: c });
            }
        } else {
            for (let c = size - 1; c >= 0; c--) {
                path.push({ row: r, col: c });
            }
        }
    }
    return path;
}
