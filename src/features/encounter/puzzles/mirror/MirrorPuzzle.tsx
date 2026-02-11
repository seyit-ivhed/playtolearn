import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MirrorEngine } from './MirrorEngine';
import styles from './MirrorPuzzle.module.css';
import { type PuzzleProps, type MirrorData, type MirrorGridCell } from '../../../../types/adventure.types';

export const MirrorPuzzle: React.FC<PuzzleProps> = ({ data, onSolve, instruction }) => {
    const { t } = useTranslation();
    const puzzleData = data as MirrorData;
    const gridSize = puzzleData.targetValue;
    const [leftPattern, setLeftPattern] = useState<MirrorGridCell[]>([]);
    const [rightPattern, setRightPattern] = useState<MirrorGridCell[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        setLeftPattern(puzzleData.leftOptions);
        setRightPattern(puzzleData.rightOptions);
    }, [puzzleData]);

    const handleCellClick = (x: number, y: number) => {
        if (isSolved) {
            return;
        }

        const updatedRight = MirrorEngine.toggleCell(rightPattern, x, y);
        setRightPattern(updatedRight);

        if (MirrorEngine.checkSolution(leftPattern, updatedRight, gridSize)) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 1000);
        }
    };

    const renderGrid = (pattern: MirrorGridCell[], isInteractive: boolean) => {
        const cells = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = pattern.find(c => c.x === x && c.y === y);
                cells.push(
                    <div
                        key={`${x}-${y}`}
                        data-testid={`mirror-cell-${isInteractive ? 'right' : 'left'}-${x}-${y}`}
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
                    <h3>{t('puzzle.mirror.pattern_title', 'Pattern')}</h3>
                    {renderGrid(leftPattern, false)}
                </div>
                <div className={styles.divider} />
                <div className={styles.side}>
                    <h3>{t('puzzle.mirror.mirror_title', 'Mirror')}</h3>
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
