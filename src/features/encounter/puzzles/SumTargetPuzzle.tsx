
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import styles from './SumTargetPuzzle.module.css';

interface SumTargetPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const SumTargetPuzzle = ({ data, onSolve }: SumTargetPuzzleProps) => {
    const [currentSum, setCurrentSum] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [lastAction, setLastAction] = useState<{ value: number; id: number } | null>(null);

    const target = data.targetValue;
    const progress = Math.min(100, Math.max(0, (currentSum / target) * 100));

    useEffect(() => {
        if (currentSum === target && !isSolved) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 2000);
        }
    }, [currentSum, target, onSolve, isSolved]);

    const handlePipeClick = (value: number) => {
        if (isSolved) return;
        setCurrentSum(prev => prev + value);
        setLastAction({ value, id: Date.now() });
    };

    const handleReset = () => {
        if (isSolved) return;
        setCurrentSum(0);
    };

    return (
        <div className={styles.container}>
            <div className={styles.gameBoard}>
                {/* Reservoir Visual */}
                <div className={styles.reservoirContainer}>
                    <div className={styles.targetMarker} style={{ bottom: '100%' }}>
                        <span className={styles.targetLabel}>Target: {target}</span>
                    </div>

                    <div className={styles.reservoir}>
                        <motion.div
                            className={styles.liquid}
                            initial={{ height: 0 }}
                            animate={{ height: `${progress}%` }}
                            transition={{ type: 'spring', damping: 15 }}
                        >
                            <div className={styles.waves}></div>
                        </motion.div>

                        <div className={styles.currentValueOverlay}>
                            {currentSum}
                        </div>
                    </div>

                    <button className={styles.resetBtn} onClick={handleReset} disabled={isSolved}>
                        Reset
                    </button>
                </div>

                {/* Pipes (Inputs) */}
                <div className={styles.pipesGrid}>
                    {data.options.map((val, idx) => (
                        <motion.button
                            key={`${val}-${idx}`}
                            className={styles.pipe}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePipeClick(val)}
                            disabled={isSolved}
                        >
                            <div className={styles.pipeIcon}>💧</div>
                            <div className={styles.pipeValue}>{val > 0 ? `+${val}` : val}</div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Win Message */}
            <AnimatePresence>
                {isSolved && (
                    <motion.div
                        className={styles.victoryOverlay}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className={styles.victoryTitle}>Reservoir Filled!</h2>
                        <div className={styles.victorySub}>The path is open...</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Animations */}
            <AnimatePresence>
                {lastAction && (
                    <motion.div
                        key={lastAction.id}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -100 }}
                        exit={{ opacity: 0 }}
                        className={styles.floatText}
                        style={{ left: '50%' }}
                    >
                        {lastAction.value > 0 ? `+${lastAction.value}` : lastAction.value}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
