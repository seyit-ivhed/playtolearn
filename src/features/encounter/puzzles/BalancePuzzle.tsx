
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import { isBalanced, calculateScaleAngle, calculateTotalWeight } from './BalanceEngine';
import styles from './BalancePuzzle.module.css';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const BalancePuzzle = ({ data, onSolve }: BalancePuzzleProps) => {
    const [leftWeights, setLeftWeights] = useState<number[]>([]);
    const [rightWeights, setRightWeights] = useState<number[]>([]);
    const [inventoryWeights, setInventoryWeights] = useState<number[]>([]);
    const [usedInventoryIndices, setUsedInventoryIndices] = useState<number[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    // Initialize inventory and initial weights
    useEffect(() => {
        const initialInventory = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
        setInventoryWeights(initialInventory);

        if (data.initialLeftWeight) {
            setLeftWeights([data.initialLeftWeight]);
        }
        if (data.initialRightWeight) {
            setRightWeights([data.initialRightWeight]);
        }
    }, [data]);

    const leftTotal = calculateTotalWeight(leftWeights);
    const rightTotal = calculateTotalWeight(rightWeights);
    const scaleAngle = calculateScaleAngle(leftTotal, rightTotal);

    useEffect(() => {
        if (isBalanced(leftTotal, rightTotal) && !isSolved) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 2000);
        }
    }, [leftTotal, rightTotal, onSolve, isSolved]);

    const handleAddWeight = (weight: number, index: number, side: 'left' | 'right') => {
        if (isSolved || usedInventoryIndices.includes(index)) return;

        if (side === 'left') {
            setLeftWeights(prev => [...prev, weight]);
        } else {
            setRightWeights(prev => [...prev, weight]);
        }

        setUsedInventoryIndices(prev => [...prev, index]);
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftWeights(data.initialLeftWeight ? [data.initialLeftWeight] : []);
        setRightWeights(data.initialRightWeight ? [data.initialRightWeight] : []);
        setUsedInventoryIndices([]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.gameBoard}>
                {/* Scale Visual */}
                <div className={styles.scaleContainer}>
                    <div className={styles.scaleBase}></div>

                    <motion.div
                        className={styles.scaleBeam}
                        animate={{ rotate: scaleAngle }}
                        transition={{ type: 'spring', damping: 10, stiffness: 60 }}
                    >
                        {/* Left Plate */}
                        <div className={`${styles.plateContainer} ${styles.leftPlateContainer}`}>
                            <div className={styles.chain}></div>
                            <div className={styles.plate}>
                                {leftWeights.map((w, i) => (
                                    <motion.div
                                        key={`left-${i}`}
                                        className={styles.placedWeight}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        {w}
                                    </motion.div>
                                ))}
                                <div className={styles.weightLabel}>{leftTotal}</div>
                            </div>
                        </div>

                        {/* Right Plate */}
                        <div className={`${styles.plateContainer} ${styles.rightPlateContainer}`}>
                            <div className={styles.chain}></div>
                            <div className={styles.plate}>
                                {rightWeights.map((w, i) => (
                                    <motion.div
                                        key={`right-${i}`}
                                        className={styles.placedWeight}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        {w}
                                    </motion.div>
                                ))}
                                <div className={styles.weightLabel}>{rightTotal}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Inventory */}
                <div className={styles.inventory}>
                    <p className={styles.inventoryTitle}>Available Weights (Click to add)</p>
                    <div className={styles.weightsGrid}>
                        {inventoryWeights.map((weight, idx) => {
                            const isUsed = usedInventoryIndices.includes(idx);
                            return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <motion.button
                                        className={`${styles.weightItem} ${isUsed ? styles.used : ''}`}
                                        whileHover={isUsed ? {} : { scale: 1.1 }}
                                        whileTap={isUsed ? {} : { scale: 0.9 }}
                                        onClick={() => handleAddWeight(weight, idx, 'left')}
                                        disabled={isSolved || isUsed}
                                    >
                                        <span className={styles.weightIcon}>⚖️</span>
                                        <span className={styles.weightValue}>{weight} (L)</span>
                                    </motion.button>
                                    <motion.button
                                        className={`${styles.weightItem} ${isUsed ? styles.used : ''}`}
                                        whileHover={isUsed ? {} : { scale: 1.1 }}
                                        whileTap={isUsed ? {} : { scale: 0.9 }}
                                        onClick={() => handleAddWeight(weight, idx, 'right')}
                                        disabled={isSolved || isUsed}
                                        style={{ background: '#3e2723' }}
                                    >
                                        <span className={styles.weightIcon}>⚖️</span>
                                        <span className={styles.weightValue}>{weight} (R)</span>
                                    </motion.button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.controls}>
                    <button className={styles.resetBtn} onClick={handleReset} disabled={isSolved}>
                        Reset Scale
                    </button>
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
                        <h2 className={styles.victoryTitle}>Scale Balanced!</h2>
                        <div className={styles.victorySub}>The stone bridge is stable...</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
