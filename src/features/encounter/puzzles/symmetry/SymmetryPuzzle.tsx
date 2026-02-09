import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SymmetryEngine } from './SymmetryEngine';
import styles from './SymmetryPuzzle.module.css';
import { type PuzzleProps, type SymmetryData, type SymmetryGridCell } from '../../../../types/adventure.types';

export const SymmetryPuzzle: React.FC<PuzzleProps> = ({ data, onSolve, instruction }) => {
    const { t } = useTranslation();
    const puzzleData = data as SymmetryData;
    const gridSize = puzzleData.targetValue;
    const [leftPattern, setLeftPattern] = useState<SymmetryGridCell[]>([]);
    const [rightPattern, setRightPattern] = useState<SymmetryGridCell[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        setLeftPattern(puzzleData.leftOptions);
        setRightPattern(puzzleData.rightOptions);
    }, [puzzleData]);

    const handleCellClick = (x: number, y: number) => {
        if (isSolved) {
            return;
        }

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
                        data-testid={`symmetry-cell-${isInteractive ? 'right' : 'left'}-${x}-${y}`}
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
                    <h3>{t('puzzle.symmetry.pattern_title', 'Pattern')}</h3>
                    {renderGrid(leftPattern, false)}
                </div>
                <div className={styles.divider} />
                <div className={styles.side}>
                    <h3>{t('puzzle.symmetry.mirror_title', 'Mirror')}</h3>
                    {renderGrid(rightPattern, true)}
                </div>
            </div>
            {instruction && (
                <div className={styles.instructions}>
                    {instruction}
                </div>
            )}
        </div>
    );
};
