
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
    // Current state of weights on plates
    const [leftWeights, setLeftWeights] = useState<number[]>([]);
    const [rightWeights, setRightWeights] = useState<number[]>([]);

    // Inventory state (Left vs Right specific inventories)
    const [leftInventory, setLeftInventory] = useState<number[]>([]);
    const [rightInventory, setRightInventory] = useState<number[]>([]);

    // Track used indices to disable buttons
    const [usedLeftIndices, setUsedLeftIndices] = useState<number[]>([]);
    const [usedRightIndices, setUsedRightIndices] = useState<number[]>([]);

    const [isSolved, setIsSolved] = useState(false);

    // Initialize inventory and initial weights
    useEffect(() => {
        // Handle new data structure (leftOptions/rightOptions)
        if (data.leftOptions) {
            setLeftInventory(data.leftOptions.map(opt => typeof opt === 'number' ? opt : opt.value));
        }
        if (data.rightOptions) {
            setRightInventory(data.rightOptions.map(opt => typeof opt === 'number' ? opt : opt.value));
        }

        // Fallback for legacy behavior or manual data
        if (!data.leftOptions && !data.rightOptions && data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            // If no split is defined, put everything in RIGHT inventory for now? 
            // Or maybe split them evenly?
            // Let's put everything in "Shared" mode? 
            // To simplify, if legacy, we put 50/50.
            const midpoint = Math.ceil(allOpts.length / 2);
            setLeftInventory(allOpts.slice(0, midpoint));
            setRightInventory(allOpts.slice(midpoint));
        }

        // Set initial placed weights (usually one side has the target)
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
        if (isSolved) return;

        if (side === 'left') {
            if (usedLeftIndices.includes(index)) return;
            setLeftWeights(prev => [...prev, weight]);
            setUsedLeftIndices(prev => [...prev, index]);
        } else {
            if (usedRightIndices.includes(index)) return;
            setRightWeights(prev => [...prev, weight]);
            setUsedRightIndices(prev => [...prev, index]);
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftWeights(data.initialLeftWeight ? [data.initialLeftWeight] : []);
        setRightWeights(data.initialRightWeight ? [data.initialRightWeight] : []);
        setUsedLeftIndices([]);
        setUsedRightIndices([]);
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

                {/* Split Inventory System */}
                <div className={styles.splitInventoryContainer}>
                    {/* Left Inventory */}
                    <div className={styles.inventoryColumn}>
                        <p className={styles.inventoryTitle}>Left Pile</p>
                        <div className={styles.weightsGrid}>
                            {leftInventory.map((weight, idx) => {
                                const isUsed = usedLeftIndices.includes(idx);
                                return (
                                    <motion.button
                                        key={`left-inv-${idx}`}
                                        className={`${styles.weightItem} ${isUsed ? styles.used : ''}`}
                                        whileHover={isUsed ? {} : { scale: 1.1 }}
                                        whileTap={isUsed ? {} : { scale: 0.9 }}
                                        onClick={() => handleAddWeight(weight, idx, 'left')}
                                        disabled={isSolved || isUsed}
                                    >
                                        <span className={styles.weightIcon}>🪨</span>
                                        <span className={styles.weightValue}>{weight}</span>
                                    </motion.button>
                                );
                            })}
                            {leftInventory.length === 0 && <div className={styles.emptySlot}>Empty</div>}
                        </div>
                    </div>

                    {/* Right Inventory */}
                    <div className={styles.inventoryColumn}>
                        <p className={styles.inventoryTitle}>Right Pile</p>
                        <div className={styles.weightsGrid}>
                            {rightInventory.map((weight, idx) => {
                                const isUsed = usedRightIndices.includes(idx);
                                return (
                                    <motion.button
                                        key={`right-inv-${idx}`}
                                        className={`${styles.weightItem} ${isUsed ? styles.used : ''}`}
                                        whileHover={isUsed ? {} : { scale: 1.1 }}
                                        whileTap={isUsed ? {} : { scale: 0.9 }}
                                        onClick={() => handleAddWeight(weight, idx, 'right')}
                                        disabled={isSolved || isUsed}
                                        style={{ background: '#3e2723', borderColor: '#5d4037' }}
                                    >
                                        <span className={styles.weightIcon}>🪨</span>
                                        <span className={styles.weightValue}>{weight}</span>
                                    </motion.button>
                                );
                            })}
                            {rightInventory.length === 0 && <div className={styles.emptySlot}>Empty</div>}
                        </div>
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
