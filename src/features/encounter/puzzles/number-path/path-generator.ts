export interface Position {
    row: number;
    col: number;
}

export function generateHamiltonianPath(size: number): Position[] {
    const totalCells = size * size;
    const isOdd = totalCells % 2 !== 0;

    // With Warnsdorff's Heuristic, we rarely need many attempts.
    // Reducing to 10 is safer for performance.
    for (let attempt = 0; attempt < 10; attempt++) {
        const startRow = Math.floor(Math.random() * size);
        let startCol = Math.floor(Math.random() * size);

        // Parity check for odd grids: Hamiltonian path must start on a "majority" color cell.
        // On an odd grid, cells where (r + c) is even are the majority (e.g. 0,0).
        if (isOdd && (startRow + startCol) % 2 !== 0) {
            // Move to an adjacent cell which will have the correct parity
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

    // Warnsdorff's Heuristic: Sort moves by the number of available neighbors
    // of the destination cell. We want cells with the FEWEST neighbors first.
    const scoredMoves = moves
        .map(move => {
            const nr = currRow + move.r;
            const nc = currCol + move.c;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
                // Count unvisited neighbors for this potential next cell
                let neighborCount = 0;
                for (const m of moves) {
                    const nnr = nr + m.r;
                    const nnc = nc + m.c;
                    if (nnr >= 0 && nnr < size && nnc >= 0 && nnc < size && !visited[nnr][nnc]) {
                        neighborCount++;
                    }
                }
                return { move, score: neighborCount, valid: true };
            }
            return { move, score: 99, valid: false };
        })
        .filter(m => m.valid)
        .sort((a, b) => {
            if (a.score !== b.score) {
                return a.score - b.score;
            }
            return Math.random() - 0.5; // Randomize ties for variety
        });

    for (const { move } of scoredMoves) {
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
