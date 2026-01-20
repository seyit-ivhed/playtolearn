import React, { useState, useEffect } from 'react';
import { LatinSquareEngine, type LatinSquareElement } from './LatinSquareEngine';
import styles from './LatinSquarePuzzle.module.css';
import { type PuzzleData } from '../../../../types/adventure.types';

interface LatinSquarePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const LatinSquarePuzzle: React.FC<LatinSquarePuzzleProps> = ({ data, onSolve }) => {
    const [grid, setGrid] = useState<LatinSquareElement[][]>([]);
    const [fixedIndices, setFixedIndices] = useState<{ row: number, col: number }[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        const initialGrid = (data.options as unknown) as LatinSquareElement[][];
        const fixed = (data.rules || []).map(r => {
            const [row, col] = r.split(',').map(Number);
            return { row, col };
        });
        setGrid(initialGrid);
        setFixedIndices(fixed);
    }, [data]);

    const handleCellClick = (row: number, col: number) => {
        if (isSolved || fixedIndices.some(idx => idx.row === row && idx.col === col)) return;

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

    if (grid.length === 0) return null;

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
            <div className={styles.instructions}>
                Place elemental runes so each appears exactly once in every row and column.
            </div>
        </div>
    );
};
