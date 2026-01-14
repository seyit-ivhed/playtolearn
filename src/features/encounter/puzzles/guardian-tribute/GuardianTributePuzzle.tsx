import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../../types/adventure.types';
import {
    type GuardianTributePuzzleData,
    validateGuardianTributeSolution
} from '../../../../utils/math/puzzles/guardian-tribute';
import { GuardianStatue } from './components/GuardianStatue';
import { PuzzleLayout } from '../components/PuzzleLayout';

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
    const totalDistributed = guardianValues.reduce((sum, val) => sum + val, 0);
    const remainingGems = puzzleData.totalGems - totalDistributed;

    // Handle increment/decrement
    const adjustGuardianValue = (guardianIndex: number, delta: number) => {
        if (isSolved) return;

        // Clear feedback when user starts adjusting again
        setShowFeedback(false);

        setGuardianValues(prev => {
            const newValues = [...prev];
            const newValue = Math.max(0, newValues[guardianIndex] + delta);

            // Don't allow going over total gems
            const newTotal = newValues.reduce((sum, val, idx) =>
                idx === guardianIndex ? sum + newValue : sum + val, 0
            );

            if (newTotal > puzzleData.totalGems) return prev;

            newValues[guardianIndex] = newValue;
            return newValues;
        });
    };

    const handleOffer = () => {
        if (isSolved) return;

        const validation = validateGuardianTributeSolution(guardianValues, puzzleData);
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
        <PuzzleLayout
            instruction={t('puzzle.guardian_tribute.desc', "Distribute the gems among the statues")}
            onReset={handleReset}
            isSolved={isSolved}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                width: '100%'
            }}>
                {/* Stats */}
                <div style={{
                    fontSize: '2.5rem',
                    color: totalDistributed === puzzleData.totalGems
                        ? '#22c55e'
                        : (showFeedback && remainingGems > 0 ? '#ef4444' : '#fbbf24'),
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    textShadow: '0 0 20px rgba(0,0,0,0.5)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>💎</span>
                        <span>{totalDistributed} / {puzzleData.totalGems}</span>
                    </div>
                    {showFeedback && !isSolved && remainingGems > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontSize: '1.2rem',
                                color: '#ef4444',
                                fontWeight: '500',
                                position: 'absolute',
                                bottom: '-2rem',
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            {t('encounter.puzzles.guardian_tribute.gems_remaining', 'You still have gems to distribute.')}
                        </motion.div>
                    )}
                </div>

                {/* Guardians Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(puzzleData.guardians.length, 3)}, 1fr)`,
                    gap: '2rem',
                    width: '100%'
                }}>
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
                            style={{
                                marginTop: '1rem',
                                padding: '1rem 3rem',
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                color: totalDistributed === 0 ? '#64748b' : '#fff',
                                background: totalDistributed === 0
                                    ? 'rgba(71, 85, 105, 0.4)'
                                    : 'linear-gradient(to bottom, #d4af37 0%, #926239 100%)',
                                border: '2px solid rgba(212, 175, 55, 0.5)',
                                borderRadius: '12px',
                                cursor: totalDistributed === 0 ? 'not-allowed' : 'pointer',
                                boxShadow: totalDistributed === 0 ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontFamily: 'serif',
                                transition: 'all 0.3s'
                            }}
                        >
                            {t('encounter.puzzles.guardian_tribute.offer', 'Offer Tribute')}
                        </motion.button>
                    )}

                    {isSolved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                fontSize: '1.5rem',
                                color: '#22c55e',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginTop: '1rem'
                            }}
                        >
                            {t('encounter.puzzles.guardian_tribute.success', 'The guardians are satisfied! ✨')}
                        </motion.div>
                    )}
                </div>
            </div>
        </PuzzleLayout>
    );
};
