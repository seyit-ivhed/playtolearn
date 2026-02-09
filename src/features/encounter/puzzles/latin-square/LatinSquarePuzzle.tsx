import React, { useState } from 'react';
import { LatinSquareEngine, type LatinSquareElement } from './LatinSquareEngine';
import styles from './LatinSquarePuzzle.module.css';
import { type PuzzleProps, type LatinSquareData } from '../../../../types/adventure.types';

export const LatinSquarePuzzle: React.FC<PuzzleProps> = ({ data, onSolve, instruction }) => {
    const puzzleData = data as LatinSquareData;
    const [grid, setGrid] = useState<LatinSquareElement[][]>(() => (puzzleData.options as unknown) as LatinSquareElement[][]);
    const [fixedIndices] = useState<{ row: number; col: number }[]>(() => {
        return (puzzleData.rules || []).map(r => {
            const [row, col] = r.split(',').map(Number);
            return { row, col };
        });
    });
    const [isSolved, setIsSolved] = useState(false);

    const handleCellClick = (row: number, col: number) => {
        if (isSolved || fixedIndices.some(idx => idx.row === row && idx.col === col)) {
            return;
        }

        const current = grid[row][col];
        const elements: LatinSquareElement[] = [null, 'FIRE', 'WATER', 'EARTH', 'AIR'];
        const currentIndex = elements.indexOf(current);
        const nextIndex = (currentIndex + 1) % elements.length;
        const next = elements[nextIndex];

        const newGrid = grid.map((r, ri) =>
            ri === row ? r.map((c, ci) => ci === col ? next : c) : r
        );

        setGrid(newGrid);

        if (LatinSquareEngine.checkSolution(newGrid)) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 1000);
        }
    };

    const getElementIcon = (element: LatinSquareElement) => {
        switch (element) {
            case 'FIRE': return '🔥';
            case 'WATER': return '💧';
            case 'EARTH': return '🌱';
            case 'AIR': return '💨';
            default: return '';
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
                            return (
                                <div
                                    key={ci}
                                    className={`${styles.cell} ${isFixed ? styles.fixed : styles.interactive}`}
                                    onClick={() => handleCellClick(ri, ci)}
                                >
                                    {getElementIcon(cell)}
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
