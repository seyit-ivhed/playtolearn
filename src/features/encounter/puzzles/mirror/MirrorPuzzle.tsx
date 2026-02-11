import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MirrorEngine } from '@/features/encounter/puzzles/mirror/MirrorEngine';
import styles from '@/features/encounter/puzzles/mirror/MirrorPuzzle.module.css';
import { type PuzzleProps, type MirrorData, type MirrorGridCell } from '@/types/adventure.types';

export const MirrorPuzzle: React.FC<PuzzleProps> = ({ data, onSolve, instruction }) => {
    const { t } = useTranslation();
    const puzzleData = data as MirrorData;
    const gridSize = puzzleData.targetValue;
    const [leftPattern, setLeftPattern] = useState<MirrorGridCell[]>([]);
    const [rightPattern, setRightPattern] = useState<MirrorGridCell[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const [rotatingCell, setRotatingCell] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        setLeftPattern(puzzleData.leftOptions);
        setRightPattern(puzzleData.rightOptions);
    }, [puzzleData]);

    const handleCellClick = (x: number, y: number) => {
        if (isSolved || rotatingCell) {
            return;
        }

        // Trigger animation
        setRotatingCell({ x, y });

        // Update logic at the midpoint of the animation (300ms of 600ms)
        setTimeout(() => {
            const updatedRight = MirrorEngine.rotateCell(rightPattern, x, y);
            setRightPattern(updatedRight);

            if (MirrorEngine.checkSolution(leftPattern, updatedRight, gridSize)) {
                setIsSolved(true);
                setTimeout(() => onSolve(), 2000);
            }
        }, 300);

        // Reset rotation state after animation duration
        setTimeout(() => setRotatingCell(null), 600);
    };

    const renderGrid = (pattern: MirrorGridCell[], isInteractive: boolean) => {
        const cells = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = pattern.find(c => c.x === x && c.y === y);
                if (!cell) {
                    continue;
                }

                const isCurrentlyRotating = isInteractive && rotatingCell?.x === x && rotatingCell?.y === y;
                const runeSrc = puzzleData.selectedRunes[cell.runeIndex];

                cells.push(
                    <div
                        key={`${x}-${y}`}
                        data-testid={`mirror-cell-${isInteractive ? 'right' : 'left'}-${x}-${y}`}
                        className={`${styles.cell} ${isInteractive ? styles.interactive : ''} ${isCurrentlyRotating ? styles.rotating : ''}`}
                        onClick={isInteractive ? () => handleCellClick(x, y) : undefined}
                    >
                        {runeSrc && (
                            <img
                                src={runeSrc}
                                alt="rune"
                                className={styles.rune}
                                draggable={false}
                            />
                        )}
                    </div>
                );
            }
        }
        return (
            <div className={`${styles.grid} ${isInteractive ? styles.rightSide : styles.leftSide}`} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {cells}
            </div>
        );
    };

    return (
        <div className={`${styles.container} ${isSolved ? styles.solved : ''}`}>
            <div className={`${styles.puzzleBoard} ${isSolved ? styles.solved : ''}`}>
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
        </div>
    );
};
