
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import { calculateNextSum, formatActionLabel, isPuzzleSolved } from './SumTargetEngine';
import styles from './SumTargetPuzzle.module.css';

interface SumTargetPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const SumTargetPuzzle = ({ data, onSolve }: SumTargetPuzzleProps) => {
    const [currentSum, setCurrentSum] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [usedOptions, setUsedOptions] = useState<number[]>([]); // Track indices of used options
    const [lastAction, setLastAction] = useState<{ label: string; id: number } | null>(null);

    const target = data.targetValue;
    const progress = Math.min(100, Math.max(0, (currentSum / target) * 100));

    useEffect(() => {
        if (isPuzzleSolved(currentSum, target) && !isSolved) {
            setIsSolved(true);
            onSolve();
        }
    }, [currentSum, target, onSolve, isSolved]);

    const handlePipeClick = (option: number | any, index: number) => {
        if (isSolved || usedOptions.includes(index)) return;

        const nextSum = calculateNextSum(currentSum, option);
        const actionLabel = formatActionLabel(option);

        setCurrentSum(nextSum);
        setUsedOptions(prev => [...prev, index]);
        setLastAction({ label: actionLabel, id: Date.now() });
    };

    const handleReset = () => {
        if (isSolved) return;
        setCurrentSum(0);
        setUsedOptions([]);
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
                    {data.options.map((option, idx) => {
                        const isObj = typeof option !== 'number';
                        const label = isObj ? (option as any).label : (option > 0 ? `+${option}` : option);
                        const icon = isObj ? ((option as any).type === 'MULTIPLY' ? '⚡' : '❄️') : '💧';

                        const isUsed = usedOptions.includes(idx);

                        return (
                            <motion.button
                                key={`${idx}`}
                                className={`${styles.pipe} ${isUsed ? styles.used : ''}`}
                                whileHover={isUsed ? {} : { scale: 1.05 }}
                                whileTap={isUsed ? {} : { scale: 0.95 }}
                                onClick={() => handlePipeClick(option, idx)}
                                disabled={isSolved || isUsed}
                            >
                                <div className={styles.pipeIcon}>{isUsed ? '✅' : icon}</div>
                                <div className={styles.pipeValue}>{label}</div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

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
                        {lastAction.label}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
