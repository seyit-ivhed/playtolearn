export interface Position {
    row: number;
    col: number;
}

const MOVES = [
    { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
] as const;

export function countUnvisitedNeighbors(size: number, visited: boolean[][], row: number, col: number): number {
    let count = 0;
    for (const m of MOVES) {
        const nr = row + m.r;
        const nc = col + m.c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
            count++;
        }
    }
    return count;
}

export function getScoredMoves(
    size: number,
    visited: boolean[][],
    currRow: number,
    currCol: number
): Array<{ r: number; c: number }> {
    return MOVES
        .filter(move => {
            const nr = currRow + move.r;
            const nc = currCol + move.c;
            return nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc];
        })
        .map(move => ({
            move,
            score: countUnvisitedNeighbors(size, visited, currRow + move.r, currCol + move.c),
        }))
        .sort((a, b) => {
            if (a.score !== b.score) {
                return a.score - b.score;
            }
            return Math.random() - 0.5;
        })
        .map(({ move }) => move);
}

export function backtrackPath(
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

    for (const move of getScoredMoves(size, visited, currRow, currCol)) {
        const nextRow = currRow + move.r;
        const nextCol = currCol + move.c;

        visited[nextRow][nextCol] = true;
        path.push({ row: nextRow, col: nextCol });

        if (backtrackPath(size, targetLength, visited, path, nextRow, nextCol)) {
            return true;
        }

        path.pop();
        visited[nextRow][nextCol] = false;
    }

    return false;
}

export function generateHamiltonianPath(size: number): Position[] {
    const totalCells = size * size;
    const isOdd = totalCells % 2 !== 0;

    for (let attempt = 0; attempt < 10; attempt++) {
        const startRow = Math.floor(Math.random() * size);
        let startCol = Math.floor(Math.random() * size);

        // Parity check for odd grids: Hamiltonian path must start on a "majority" color cell.
        // On an odd grid, cells where (r + c) is even are the majority (e.g. 0,0).
        if (isOdd && (startRow + startCol) % 2 !== 0) {
            if (startCol < size - 1) {
                startCol++;
            } else {
                startCol--;
            }
        }

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
