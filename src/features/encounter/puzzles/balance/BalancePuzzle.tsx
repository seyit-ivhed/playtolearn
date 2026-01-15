import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleData } from '../../../../types/adventure.types';
import {
    type BalancePuzzleData,
    type Weight,
    calculateTotalWeight,
    validateBalance
} from './BalanceEngine';
import styles from './BalancePuzzle.module.css';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const BalancePuzzle = ({ data, onSolve }: BalancePuzzleProps) => {
    const { t } = useTranslation();
    const initialPuzzleData = data as BalancePuzzleData;

    // State for stacks
    const [leftStack, setLeftStack] = useState<Weight[]>([]);
    const [rightStack, setRightStack] = useState<Weight[]>([]);
    const [isSolved, setIsSolved] = useState(false);

    // Initialize state from props
    useEffect(() => {
        setLeftStack(initialPuzzleData.leftStack);
        setRightStack(initialPuzzleData.rightStack);
        setIsSolved(false);
    }, [initialPuzzleData]);

    const handleRemoveWeight = (stackSide: 'left' | 'right', weightId: string) => {
        if (isSolved) return;

        const updateStack = (stack: Weight[]) =>
            stack.filter(w => w.id !== weightId);

        if (stackSide === 'left') {
            const newStack = updateStack(leftStack);
            setLeftStack(newStack);
            checkSolution(newStack, rightStack);
        } else {
            const newStack = updateStack(rightStack);
            setRightStack(newStack);
            checkSolution(leftStack, newStack);
        }
    };

    const checkSolution = (currentLeft: Weight[], currentRight: Weight[]) => {
        if (validateBalance(currentLeft, currentRight)) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 2000); // Delay to show success state before closing
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftStack(initialPuzzleData.leftStack);
        setRightStack(initialPuzzleData.rightStack);
    };

    const leftTotal = calculateTotalWeight(leftStack);
    const rightTotal = calculateTotalWeight(rightStack);

    return (
        <div className={styles.layout}>
            <div className={styles.instructions}>
                {t('encounter.puzzles.balance.instructions', 'Remove weights to balance the scales. The heavy weights (base) cannot be moved.')}
            </div>

            <div className={styles.puzzleContainer}>
                {/* Left Scale */}
                <div className={styles.scaleSide}>
                    <div className={styles.weightStack}>
                        <AnimatePresence>
                            {leftStack.map((weight) => (
                                <WeightItem
                                    key={weight.id}
                                    weight={weight}
                                    side="left"
                                    onRemove={handleRemoveWeight}
                                    disabled={isSolved}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className={styles.pressurePlate}>
                        <span className={styles.plateTotal}>{leftTotal}</span>
                    </div>
                </div>

                {/* Right Scale */}
                <div className={styles.scaleSide}>
                    <div className={styles.weightStack}>
                        <AnimatePresence>
                            {rightStack.map((weight) => (
                                <WeightItem
                                    key={weight.id}
                                    weight={weight}
                                    side="right"
                                    onRemove={handleRemoveWeight}
                                    disabled={isSolved}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className={styles.pressurePlate}>
                        <span className={styles.plateTotal}>{rightTotal}</span>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.feedback}>
                    <AnimatePresence>
                        {isSolved && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={styles.successMessage}
                            >
                                {t('encounter.puzzles.balance.success', 'Balanced! The gate opens...')}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    className={styles.resetBtn}
                    onClick={handleReset}
                    disabled={isSolved}
                >
                    {t('common.start_over', 'Start Over')}
                </button>
            </div>
        </div>
    );
};

interface WeightItemProps {
    weight: Weight;
    side: 'left' | 'right';
    onRemove: (side: 'left' | 'right', id: string) => void;
    disabled: boolean;
}

const WeightItem = ({ weight, side, onRemove, disabled }: WeightItemProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
            className={`${styles.weight} ${weight.isHeavy ? styles.heavyWeight : ''}`}
            onClick={() => !weight.isHeavy && !disabled && onRemove(side, weight.id)}
            whileHover={!weight.isHeavy && !disabled ? { scale: 1.05 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {weight.value}
        </motion.div>
    );
};
