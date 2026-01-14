import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../../types/adventure.types';
import {
    type GuardianTributePuzzleData
} from '../../../../utils/math/puzzles/guardian-tribute';
import {
    calculateTotalDistributed,
    calculateRemainingGems,
    isValidAdjustment,
    validateTribute
} from './GuardianTributeEngine';
import { GuardianStatue } from './components/GuardianStatue';
import styles from './GuardianTributePuzzle.module.css';

interface GuardianTributePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const GuardianTributePuzzle = ({ data, onSolve }: GuardianTributePuzzleProps) => {
    const { t } = useTranslation();
    const puzzleData = data as GuardianTributePuzzleData;

    // Initialize guardian values to 0
    const [guardianValues, setGuardianValues] = useState<number[]>(
        new Array(puzzleData.guardians.length).fill(0)
    );
    const [isSolved, setIsSolved] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Calculate remaining gems
    const totalDistributed = calculateTotalDistributed(guardianValues);
    const remainingGems = calculateRemainingGems(guardianValues, puzzleData.totalGems);

    // Handle increment/decrement
    const adjustGuardianValue = (guardianIndex: number, delta: number) => {
        if (isSolved) return;

        // Clear feedback when user starts adjusting again
        setShowFeedback(false);

        if (isValidAdjustment(guardianValues, guardianIndex, delta, puzzleData.totalGems)) {
            setGuardianValues(prev => {
                const newValues = [...prev];
                newValues[guardianIndex] += delta;
                return newValues;
            });
        }
    };

    const handleOffer = () => {
        if (isSolved) return;

        const validation = validateTribute(guardianValues, puzzleData);
        setShowFeedback(true);

        if (validation.isValid) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 3500);
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setGuardianValues(new Array(puzzleData.guardians.length).fill(0));
        setShowFeedback(false);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.tributeContainer}>
                {/* Stats */}
                <div
                    className={styles.stats}
                    style={{
                        color: totalDistributed === puzzleData.totalGems
                            ? '#22c55e'
                            : (showFeedback && remainingGems > 0 ? '#ef4444' : '#fbbf24'),
                    }}
                >
                    <div className={styles.statsText}>
                        <span>💎</span>
                        <span>{totalDistributed} / {puzzleData.totalGems}</span>
                    </div>
                    {showFeedback && !isSolved && remainingGems > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.feedbackGems}
                        >
                            {t('encounter.puzzles.guardian_tribute.gems_remaining', 'You still have gems to distribute.')}
                        </motion.div>
                    )}
                </div>

                {/* Guardians Grid */}
                <div
                    className={styles.guardiansGrid}
                    style={{
                        gridTemplateColumns: `repeat(${Math.min(puzzleData.guardians.length, 3)}, 1fr)`,
                    }}
                >
                    {puzzleData.guardians.map((guardian, index) => (
                        <GuardianStatue
                            key={index}
                            index={index}
                            guardian={guardian}
                            value={guardianValues[index]}
                            remainingGems={remainingGems}
                            isSolved={isSolved}
                            showFeedback={showFeedback}
                            onAdjust={(delta) => adjustGuardianValue(index, delta)}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {!isSolved && (
                        <motion.button
                            whileHover={{ scale: totalDistributed > 0 ? 1.05 : 1 }}
                            whileTap={{ scale: totalDistributed > 0 ? 0.95 : 1 }}
                            onClick={handleOffer}
                            disabled={totalDistributed === 0}
                            className={styles.offerBtn}
                        >
                            {t('encounter.puzzles.guardian_tribute.offer', 'Offer Tribute')}
                        </motion.button>
                    )}

                    {isSolved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.successMessage}
                        >
                            {t('encounter.puzzles.guardian_tribute.success', 'The guardians are satisfied! ✨')}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Reset Button */}
            <div className={styles.controls}>
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
