import React, { useState } from 'react';
import { LatinSquareEngine } from './LatinSquareEngine';
import styles from './LatinSquarePuzzle.module.css';
import { type PuzzleProps, type LatinSquareData, type LatinSquareElement } from '../../../../types/adventure.types';
import { RUNE_ASSETS } from '../../../../data/puzzle-assets';

const ANIMATION_DURATION_MS = 600;
const ROTATION_MIDPOINT_MS = 300;

export const LatinSquarePuzzle: React.FC<PuzzleProps> = ({ data, onSolve, instruction }) => {
    const puzzleData = data as LatinSquareData;
    const [grid, setGrid] = useState<LatinSquareElement[][]>(() => puzzleData.grid);
    const fixedIndices = puzzleData.fixedIndices;
    const [isSolved, setIsSolved] = useState(false);
    const [rotatingCell, setRotatingCell] = useState<{ row: number, col: number } | null>(null);

    const handleCellClick = (row: number, col: number) => {
        if (isSolved || rotatingCell || fixedIndices.some(idx => idx.row === row && idx.col === col)) {
            return;
        }

        const current = grid[row][col];
        const elements: LatinSquareElement[] = [null, 'FIRE', 'WATER', 'EARTH', 'AIR'];
        const currentIndex = elements.indexOf(current);
        const nextIndex = (currentIndex + 1) % elements.length;
        const next = elements[nextIndex];

        const updateGrid = (nextValue: LatinSquareElement) => {
            const newGrid = grid.map((r, ri) =>
                ri === row ? r.map((c, ci) => ci === col ? nextValue : c) : r
            );

            setGrid(newGrid);

            if (LatinSquareEngine.checkSolution(newGrid)) {
                setIsSolved(true);
                setTimeout(() => onSolve(), 1000);
            }
        };

        if (current === null) {
            updateGrid(next);
        } else {
            setRotatingCell({ row, col });

            setTimeout(() => {
                updateGrid(next);
            }, ROTATION_MIDPOINT_MS);

            setTimeout(() => setRotatingCell(null), ANIMATION_DURATION_MS);
        }
    };

    const getElementRune = (element: LatinSquareElement) => {
        switch (element) {
            case 'FIRE': return RUNE_ASSETS[0];
            case 'WATER': return RUNE_ASSETS[1];
            case 'EARTH': return RUNE_ASSETS[2];
            case 'AIR': return RUNE_ASSETS[3];
            default: return null;
        }
    };

    if (grid.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.puzzleBoard}>
                {grid.map((row, ri) => (
                    <div key={ri} className={styles.row}>
                        {row.map((cell, ci) => {
                            const isFixed = fixedIndices.some(idx => idx.row === ri && idx.col === ci);
                            const isCurrentlyRotating = rotatingCell?.row === ri && rotatingCell?.col === ci;
                            return (
                                <div
                                    key={ci}
                                    data-testid={`latin-cell-${ri}-${ci}`}
                                    className={`${styles.cell} ${isFixed ? styles.fixed : styles.interactive} ${isCurrentlyRotating ? styles.rotating : ''}`}
                                    onClick={() => handleCellClick(ri, ci)}
                                >
                                    {(() => {
                                        const runeSrc = getElementRune(cell);
                                        return runeSrc ? (
                                            <img
                                                src={runeSrc}
                                                alt={cell || 'rune'}
                                                className={styles.rune}
                                                draggable={false}
                                            />
                                        ) : null;
                                    })()}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {instruction && (
                <div className={styles.instructions}>
                    {instruction}
                </div>
            )}
        </div>
    );
};
