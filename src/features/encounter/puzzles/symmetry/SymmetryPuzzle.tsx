import React, { useState, useEffect } from 'react';
import { SymmetryEngine, type SymmetryGridCell } from './SymmetryEngine';
import styles from './SymmetryPuzzle.module.css';
import { type PuzzleData } from '../../../../types/adventure.types';

interface SymmetryPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const SymmetryPuzzle: React.FC<SymmetryPuzzleProps> = ({ data, onSolve }) => {
    const gridSize = data.targetValue;
    const [leftPattern, setLeftPattern] = useState<SymmetryGridCell[]>([]);
    const [rightPattern, setRightPattern] = useState<SymmetryGridCell[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        setLeftPattern((data.leftOptions as unknown) as SymmetryGridCell[]);
        setRightPattern((data.rightOptions as unknown) as SymmetryGridCell[]);
    }, [data]);

    const handleCellClick = (x: number, y: number) => {
        if (isSolved) return;

        const updatedRight = SymmetryEngine.toggleCell(rightPattern, x, y);
        setRightPattern(updatedRight);

        if (SymmetryEngine.checkSolution(leftPattern, updatedRight, gridSize)) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 1000);
        }
    };

    const renderGrid = (pattern: SymmetryGridCell[], isInteractive: boolean) => {
        const cells = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = pattern.find(c => c.x === x && c.y === y);
                cells.push(
                    <div
                        key={`${x}-${y}`}
                        className={`${styles.cell} ${cell?.isActive ? styles.active : ''} ${isInteractive ? styles.interactive : ''}`}
                        onClick={isInteractive ? () => handleCellClick(x, y) : undefined}
                    />
                );
            }
        }
        return (
            <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {cells}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.puzzleBoard}>
                <div className={styles.side}>
                    <h3>Pattern</h3>
                    {renderGrid(leftPattern, false)}
                </div>
                <div className={styles.divider} />
                <div className={styles.side}>
                    <h3>Mirror</h3>
                    {renderGrid(rightPattern, true)}
                </div>
            </div>
            <div className={styles.instructions}>
                Mirror the pattern on the right side.
            </div>
        </div>
    );
};
