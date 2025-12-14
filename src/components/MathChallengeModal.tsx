import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MathInput from './MathInput/MathInput';
import { type MathProblem } from '../types/math.types';
import { validateAnswer } from '../utils/math-generator';
import '../styles/components/MathChallengeModal.css';

interface MathChallengeModalProps {
    problem: MathProblem;
    title: string;
    description: string;
    onComplete: (success: boolean) => void;
    onClose: () => void;
}

export default function MathChallengeModal({
    problem,
    title,
    description,
    onComplete,
    onClose
}: MathChallengeModalProps) {
    const [result, setResult] = useState<'success' | 'failure' | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    // Initial Animation Trigger
    useEffect(() => {
        // Delay flip slightly to allow "Move to Center" feeling (simulated via CSS transition on mount)
        const timer = setTimeout(() => setIsFlipped(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (userAnswer: number | string) => {
        const validation = validateAnswer(userAnswer, problem.correctAnswer);
        if (validation.isCorrect) {
            setResult('success');
            setTimeout(() => {
                // Flip back before closing
                setIsFlipped(false);
                setTimeout(() => onComplete(true), 600); // Wait for flip back
            }, 1000);
        } else {
            setResult('failure');
            setTimeout(() => {
                setIsFlipped(false);
                setTimeout(() => onComplete(false), 600);
            }, 1500);
        }
    };

    return createPortal(
        <div className="math-modal-overlay">
            {/* 3D Scene Container */}
            <div className={`spotlight-card-scene ${isFlipped ? 'flipped' : ''} ${result || ''}`}>
                <div className="spotlight-card">
                    {/* Front Face (Hero Portrait / Generic Back) */}
                    <div className="spotlight-card-face spotlight-card-front">
                        <div className="card-back-pattern">
                            <span className="card-symbol">⚔️</span>
                        </div>
                    </div>

                    {/* Back Face (Math Problem) */}
                    <div className="spotlight-card-face spotlight-card-back">
                        <div className="math-content-container">
                            <h2 className="spotlight-title">{title}</h2>
                            <p className="spotlight-desc">{description}</p>

                            <div className="spotlight-math-body">
                                <MathInput
                                    problem={problem}
                                    onSubmit={handleSubmit}
                                    inputMode="multiple-choice"
                                    disabled={result !== null}
                                />
                            </div>

                            {/* Result Feedback */}
                            {result === 'success' && (
                                <div className="feedback-overlay">
                                    <span className="feedback-icon-success">✨</span>
                                </div>
                            )}
                            {result === 'failure' && (
                                <div className="feedback-overlay">
                                    <span className="feedback-icon-failure">❌</span>
                                </div>
                            )}

                            {/* Cancel Button */}
                            {!result && (
                                <button
                                    onClick={onClose}
                                    className="spotlight-cancel-btn"
                                    data-testid="modal-cancel-btn"
                                >
                                    Retreat
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
