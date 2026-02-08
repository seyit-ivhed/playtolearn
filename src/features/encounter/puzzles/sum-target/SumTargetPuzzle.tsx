import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { type PuzzleData, type PuzzleOption } from '../../../../types/adventure.types';
import { calculateNextSum, formatActionLabel, isPuzzleSolved } from './SumTargetEngine';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
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
    const actionIdCounter = useRef(0);
    const { t } = useTranslation();

    const target = data.targetValue;
    const progress = Math.min(100, Math.max(0, (currentSum / target) * 100));
    const isOverfilled = currentSum > target;

    const handlePipeClick = (option: number | PuzzleOption, index: number) => {
        if (isSolved || usedOptions.includes(index)) return;

        const nextSum = calculateNextSum(currentSum, option);
        const actionLabel = formatActionLabel(option);

        setCurrentSum(nextSum);
        setUsedOptions(prev => [...prev, index]);
        setLastAction({ label: actionLabel, id: actionIdCounter.current++ });

        if (isPuzzleSolved(nextSum, target) && !isSolved) {
            setIsSolved(true);
            onSolve();
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setCurrentSum(0);
        setUsedOptions([]);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.boardContent}>
                {/* Canteen Visual */}
                <div className={styles.canteenWrapper}>
                    {/* Target value on the left, level with the target line */}
                    <div className={styles.targetIndicator}>
                        <div className={styles.targetValue}>{target}</div>
                    </div>

                    <div className={`${styles.canteenContainer} ${isOverfilled ? styles.overfilled : ''}`}>
                        <div className={styles.canteenNeck} />
                        <div className={styles.canteenBody}>
                            <motion.div
                                className={styles.liquid}
                                initial={{ height: 0 }}
                                animate={{ height: `${progress}%` }}
                                transition={{ type: 'spring', damping: 15 }}
                            >
                                <div className={styles.waves}></div>
                            </motion.div>

                            {/* Target line showing where water should reach - at 90% height */}
                            <div className={styles.targetLine}>
                                <div className={styles.targetLineDash}></div>
                            </div>

                            <div className={styles.currentValueOverlay}>
                                {currentSum}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Water Sources (Scoops) */}
                <div className={styles.waterSourceGrid}>
                    {data.options.map((option, idx) => {
                        const isObj = typeof option !== 'number';
                        const puzzleOption = isObj ? (option as PuzzleOption) : null;
                        const label = formatActionLabel(option);

                        // Icons for scoops/cups/jars
                        // Simplification: Use water drops for standard inputs as per user request
                        let icon = '💧';

                        if (puzzleOption) {
                            if (puzzleOption.type === 'MULTIPLY') icon = '🌊'; // Surge/Multiply still distinct
                        } else if (typeof option === 'number') {
                            if (option < 0) icon = '🫗'; // Empty/Pour out
                        }

                        // Override for now with consistent water icons for additions
                        if (!isObj && (option as number) > 0) icon = '💧';

                        const isUsed = usedOptions.includes(idx);

                        return (
                            <motion.button
                                key={`${idx}`}
                                className={`${styles.scoop} ${isUsed ? styles.used : ''}`}
                                whileHover={isUsed ? {} : { scale: 1.05 }}
                                whileTap={isUsed ? {} : { scale: 0.95 }}
                                onClick={() => handlePipeClick(option, idx)}
                                disabled={isSolved || isUsed}
                            >
                                <div className={styles.scoopIcon}>{isUsed ? '✅' : icon}</div>
                                <div className={styles.scoopValue}>{label}</div>
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

            {/* Reset Button */}
            <div className={styles.controls}>
                <PrimaryButton
                    onClick={handleReset}
                    disabled={isSolved}
                >
                    {t('common.start_over', 'Start Over')}
                </PrimaryButton>
            </div>
        </div>
    );
};
