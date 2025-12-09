import { useState } from 'react';
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

    const handleSubmit = (userAnswer: number) => {
        const validation = validateAnswer(userAnswer, problem.correctAnswer);
        if (validation.isCorrect) {
            setResult('success');
            setTimeout(() => {
                onComplete(true);
            }, 1000);
        } else {
            setResult('failure');
            // Allow 1 second to see the "X" or error state before closing
            setTimeout(() => {
                onComplete(false);
            }, 1500);
        }
    };

    return createPortal(
        <div className="math-modal-overlay">
            <div className="math-modal-content">
                {/* Header */}
                <div className="math-modal-header">
                    <h2 className="math-modal-title">
                        {title}
                    </h2>
                    <p className="math-modal-description">
                        {description}
                    </p>
                </div>

                {/* Math Content */}
                <div className={`math-modal-body ${result || ''}`}>
                    <MathInput
                        problem={problem}
                        onSubmit={handleSubmit}
                        inputMode="multiple-choice"
                        disabled={result !== null}
                    />

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
                </div>

                {/* Cancel Button */}
                {!result && (
                    <button
                        onClick={onClose}
                        className="modal-cancel-btn"
                        data-testid="modal-cancel-btn"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
}
