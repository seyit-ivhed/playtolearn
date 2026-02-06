import React, { useState, useMemo, useEffect } from 'react';
import { type PuzzleData } from '../../../../types/adventure.types';
import styles from './NumberPathPuzzle.module.css';
import {
    type CellData,
    type Position,
    findCellPosition,
    calculateSequenceState,
    validateMove
} from './NumberPathEngine';

interface NumberPathPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const NumberPathPuzzle: React.FC<NumberPathPuzzleProps> = ({ data, onSolve }) => {
    const { gridSize = 3, startValue = 1, stepValue = 1, preFilledIndices = [] } = data;

    const [grid, setGrid] = useState<CellData[][]>(() => {
        const initialGrid: CellData[][] = Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () => ({ value: null, isFixed: false }))
        );

        preFilledIndices.forEach(({ row, col, value }) => {
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                initialGrid[row][col] = { value, isFixed: true };
            }
        });
        return initialGrid;
    });

    const [isCompleted, setIsCompleted] = useState(false);
    const [shakeCell, setShakeCell] = useState<Position | null>(null);

    const { currentHeadValue, nextExpectedValue } = useMemo(() => {
        return calculateSequenceState(grid, startValue, stepValue);
    }, [grid, startValue, stepValue]);

    useEffect(() => {
        const totalCells = gridSize * gridSize;
        const filledCells = grid.flat().filter(cell => cell.value !== null).length;

        if (filledCells === totalCells && !isCompleted) {
            setIsCompleted(true);
            setTimeout(onSolve, 1000);
        }
    }, [grid, gridSize, isCompleted, onSolve]);

    const triggerShake = (position: Position) => {
        setShakeCell(position);
        setTimeout(() => setShakeCell(null), 300);
    };

    const handleUndo = (clickedValue: number) => {
        setGrid(prev => prev.map(row =>
            row.map(cell => {
                if (cell.value !== null && !cell.isFixed && cell.value >= clickedValue) {
                    return { ...cell, value: null };
                }
                return cell;
            })
        ));
    };

    const handleCellClick = (row: number, col: number) => {
        if (isCompleted) {
            return;
        }

        const cell = grid[row][col];
        if (cell.isFixed) {
            return;
        }

        if (cell.value !== null) {
            handleUndo(cell.value);
            return;
        }

        const isValid = validateMove(
            grid,
            { row, col },
            currentHeadValue,
            nextExpectedValue,
            stepValue
        );

        if (!isValid) {
            triggerShake({ row, col });
            return;
        }

        setGrid(prev => prev.map((r, ri) =>
            ri === row ? r.map((c, ci) => ci === col ? { ...c, value: nextExpectedValue } : c) : r
        ));
    };

    const svgPathPoints = useMemo(() => {
        const points: string[] = [];
        let currentVal = startValue;

        while (true) {
            const pos = findCellPosition(grid, currentVal);
            if (!pos) {
                break;
            }

            const cellSize = 64;
            const gap = 12;
            const x = pos.col * (cellSize + gap) + (cellSize / 2);
            const y = pos.row * (cellSize + gap) + (cellSize / 2);
            points.push(`${x},${y}`);

            currentVal += stepValue;
        }
        return points.join(' ');
    }, [grid, startValue, stepValue]);

    return (
        <div className={styles.container}>
            <div className={styles.puzzleWrapper}>
                <div
                    className={styles.grid}
                    style={{ gridTemplateColumns: `repeat(${gridSize}, auto)` }}
                >
                    {grid.map((row, ri) => (
                        <React.Fragment key={ri}>
                            {row.map((cell, ci) => (
                                <div
                                    key={`${ri}-${ci}`}
                                    className={`
                                        ${styles.cell} 
                                        ${cell.value !== null ? styles.filled : ''}
                                        ${cell.isFixed ? styles.fixed : ''}
                                        ${cell.value === currentHeadValue && !isCompleted ? styles.lastPlaced : ''}
                                        ${shakeCell?.row === ri && shakeCell?.col === ci ? styles.invalid : ''}
                                    `}
                                    onClick={() => handleCellClick(ri, ci)}
                                >
                                    {cell.value}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                <svg className={styles.svgOverlay}>
                    <polyline
                        points={svgPathPoints}
                        fill="none"
                        className={`${styles.svgLine} ${isCompleted ? styles.active : ''}`}
                    />
                </svg>
            </div>
            <div className={styles.instruction} />
        </div>
    );
};
