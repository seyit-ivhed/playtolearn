import { motion } from 'framer-motion';
import { ConstraintDisplay } from './ConstraintDisplay';
import { GuardianSymbolBadge } from './GuardianSymbolBadge';
import { GUARDIAN_SYMBOLS } from '../constants';
import guardianImage from '../../../../../assets/images/puzzles/guardian-statue.png';
import type { GuardianData } from '../GuardianTributeEngine';

interface GuardianStatueProps {
    index: number;
    guardian: GuardianData;
    value: number;
    remainingGems: number;
    isSolved: boolean;
    showFeedback: boolean;
    onAdjust: (delta: number) => void;
}

export const GuardianStatue = ({
    index,
    guardian,
    value,
    remainingGems,
    isSolved,
    showFeedback,
    onAdjust
}: GuardianStatueProps) => {
    const isCorrect = value === guardian.solution;
    const displayFeedback = showFeedback || isSolved;

    return (
        <motion.div
            animate={isSolved && isCorrect ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
            transition={{ repeat: isSolved ? Infinity : 0, duration: 1.5 }}
            style={{
                position: 'relative',
                background: `url(${guardianImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: `3px solid ${displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(212, 175, 55, 0.3)'}`,
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '400px',
                boxShadow: displayFeedback && isCorrect ? '0 0 30px rgba(34, 197, 94, 0.4)' : '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'all 0.3s'
            }}
        >
            {/* Overlay for Readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 1
            }} />

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                padding: '1.5rem',
                textAlign: 'center'
            }}>
                <GuardianSymbolBadge
                    symbol={GUARDIAN_SYMBOLS[index]}
                    style={{ marginTop: '-1rem' }}
                />

                <div style={{ width: '100%' }}>
                    {/* Constraint Description */}
                    <div style={{
                        fontSize: '1.4rem',
                        color: '#fff',
                        fontWeight: '500',
                        marginBottom: '1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,1)',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        borderLeft: `4px solid ${displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : '#d4af37'}`
                    }}>
                        <ConstraintDisplay constraint={guardian.constraint} />
                    </div>

                    {/* Value Display */}
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        textShadow: '0 0 20px rgba(0,0,0,0.9)',
                        marginBottom: '1rem'
                    }}>
                        <span>💎</span>
                        {value}
                        {displayFeedback && isCorrect && <span style={{ fontSize: '2rem' }}>✓</span>}
                    </div>

                    {/* Controls */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={() => onAdjust(-1)}
                            disabled={isSolved || value === 0}
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '1.5rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: '#d4af37',
                                cursor: value === 0 || isSolved ? 'not-allowed' : 'pointer',
                                opacity: value === 0 || isSolved ? 0.5 : 1,
                                transition: 'all 0.2s',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            -1
                        </button>
                        <button
                            onClick={() => onAdjust(1)}
                            disabled={isSolved || remainingGems === 0}
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '1.5rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: '#d4af37',
                                cursor: (remainingGems === 0 || isSolved) ? 'not-allowed' : 'pointer',
                                opacity: (remainingGems === 0 || isSolved) ? 0.5 : 1,
                                transition: 'all 0.2s',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            +1
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
