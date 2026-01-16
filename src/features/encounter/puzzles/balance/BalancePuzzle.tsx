import { useState } from 'react';
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
    const initialData = data as BalancePuzzleData;

    const [leftStack, setLeftStack] = useState<Weight[]>(initialData.leftStack);
    const [rightStack, setRightStack] = useState<Weight[]>(initialData.rightStack);
    const [isSolved, setIsSolved] = useState(false);

    const handleRemoveWeight = (side: 'left' | 'right', weightId: string) => {
        if (isSolved) return;

        if (side === 'left') {
            const next = leftStack.filter(w => w.id !== weightId);
            setLeftStack(next);
            checkSolution(next, rightStack);
        } else {
            const next = rightStack.filter(w => w.id !== weightId);
            setRightStack(next);
            checkSolution(leftStack, next);
        }
    };

    const checkSolution = (l: Weight[], r: Weight[]) => {
        if (validateBalance(l, r)) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 3000);
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftStack(initialData.leftStack);
        setRightStack(initialData.rightStack);
    };

    const leftTotal = calculateTotalWeight(leftStack);
    const rightTotal = calculateTotalWeight(rightStack);

    return (
        <div className={styles.layout}>
            <div className={styles.puzzleWrapper}>
                {/* Immersive Background */}
                <div className={styles.backgroundContainer} />
                <div className={styles.vignette} />

                {/* Puzzle Content */}
                <div className={styles.puzzleContent}>
                    <div className={styles.platesContainer}>
                        {/* Left Plate Area */}
                        <div className={styles.stackSection}>
                            <div className={styles.weightStack}>
                                <AnimatePresence>
                                    {leftStack.map((weight) => (
                                        <WeightComponent
                                            key={weight.id}
                                            weight={weight}
                                            side="left"
                                            onRemove={handleRemoveWeight}
                                            disabled={isSolved}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className={styles.plateInfo}>
                                {leftTotal}
                            </div>
                        </div>

                        {/* Controls/Status in between */}
                        <div className={styles.controls}>
                            <div className={styles.feedback}>
                                <AnimatePresence>
                                    {isSolved && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={styles.successMsg}
                                        >
                                            {t('encounter.puzzles.balance.success', 'Balanced!')}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Plate Area */}
                        <div className={styles.stackSection}>
                            <div className={styles.weightStack}>
                                <AnimatePresence>
                                    {rightStack.map((weight) => (
                                        <WeightComponent
                                            key={weight.id}
                                            weight={weight}
                                            side="right"
                                            onRemove={handleRemoveWeight}
                                            disabled={isSolved}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className={styles.plateInfo}>
                                {rightTotal}
                            </div>
                        </div>
                    </div>

                    <button
                        className={styles.resetBtn}
                        onClick={handleReset}
                        disabled={isSolved}
                        data-testid="puzzle-reset-button"
                    >
                        {t('common.start_over', 'Start Over')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface WeightComponentProps {
    weight: Weight;
    side: 'left' | 'right';
    onRemove: (side: 'left' | 'right', id: string) => void;
    disabled: boolean;
}

const WeightComponent = ({ weight, side, onRemove, disabled }: WeightComponentProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: 'tween', ease: 'easeIn', duration: 0.2 }}
            className={`${styles.weight} ${weight.isHeavy ? styles.heavyWeight : ''}`}
            onClick={() => !weight.isHeavy && !disabled && onRemove(side, weight.id)}
        >
            {weight.value}
        </motion.div>
    );
};
