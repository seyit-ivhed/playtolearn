
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import { isBalanced, calculateScaleAngle, calculateTotalWeight } from './BalanceEngine';
import styles from './BalancePuzzle.module.css';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const BalancePuzzle = ({ data, onSolve }: BalancePuzzleProps) => {
    // Current state of weights on plates
    const [leftWeights, setLeftWeights] = useState<number[]>(() =>
        data.initialLeftWeight ? [data.initialLeftWeight] : []
    );
    const [rightWeights, setRightWeights] = useState<number[]>(() =>
        data.initialRightWeight ? [data.initialRightWeight] : []
    );

    // Inventory state (Left vs Right specific inventories)
    const [leftInventory, setLeftInventory] = useState<number[]>(() => {
        if (data.leftOptions) return data.leftOptions.map(opt => typeof opt === 'number' ? opt : opt.value);
        if (!data.leftOptions && !data.rightOptions && data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            const midpoint = Math.ceil(allOpts.length / 2);
            return allOpts.slice(0, midpoint);
        }
        return [];
    });
    const [rightInventory, setRightInventory] = useState<number[]>(() => {
        if (data.rightOptions) return data.rightOptions.map(opt => typeof opt === 'number' ? opt : opt.value);
        if (!data.leftOptions && !data.rightOptions && data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            const midpoint = Math.ceil(allOpts.length / 2);
            return allOpts.slice(midpoint);
        }
        return [];
    });

    // Track used indices to disable buttons
    const [usedLeftIndices, setUsedLeftIndices] = useState<number[]>([]);
    const [usedRightIndices, setUsedRightIndices] = useState<number[]>([]);

    const [isSolved, setIsSolved] = useState(false);

    // Handle data changes - if data prop changes, we should reset state
    // We use a simple key on the parent or handle it here if needed.
    // For now, let's keep it simple as puzzles don't usually change mid-session.
    // But to be safe, we can reset if data changed.
    const [prevData, setPrevData] = useState(data);
    if (data !== prevData) {
        setPrevData(data);
        setLeftWeights(data.initialLeftWeight ? [data.initialLeftWeight] : []);
        setRightWeights(data.initialRightWeight ? [data.initialRightWeight] : []);
        setLeftInventory(data.leftOptions
            ? data.leftOptions.map(opt => typeof opt === 'number' ? opt : opt.value)
            : (data.options ? data.options.slice(0, Math.ceil(data.options.length / 2)).map(opt => typeof opt === 'number' ? opt : opt.value) : [])
        );
        setRightInventory(data.rightOptions
            ? data.rightOptions.map(opt => typeof opt === 'number' ? opt : opt.value)
            : (data.options ? data.options.slice(Math.ceil(data.options.length / 2)).map(opt => typeof opt === 'number' ? opt : opt.value) : [])
        );
        setUsedLeftIndices([]);
        setUsedRightIndices([]);
        setIsSolved(false);
    }

    const leftTotal = calculateTotalWeight(leftWeights);
    const rightTotal = calculateTotalWeight(rightWeights);
    const scaleAngle = calculateScaleAngle(leftTotal, rightTotal);

    const handleAddWeight = (weight: number, index: number, side: 'left' | 'right') => {
        if (isSolved) return;

        let nextLeftTotal = leftTotal;
        let nextRightTotal = rightTotal;

        if (side === 'left') {
            if (usedLeftIndices.includes(index)) return;
            setLeftWeights(prev => [...prev, weight]);
            setUsedLeftIndices(prev => [...prev, index]);
            nextLeftTotal += weight;
        } else {
            if (usedRightIndices.includes(index)) return;
            setRightWeights(prev => [...prev, weight]);
            setUsedRightIndices(prev => [...prev, index]);
            nextRightTotal += weight;
        }

        if (isBalanced(nextLeftTotal, nextRightTotal) && !isSolved) {
            setIsSolved(true);
            onSolve();
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
        </div>
    );
};
