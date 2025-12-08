import { useState } from 'react';
import { createPortal } from 'react-dom';
import MathInput from './MathInput/MathInput';
import { type MathProblem } from '../types/math.types';
import { validateAnswer } from '../utils/math-generator';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-black text-[var(--color-brand-primary)] mb-2 uppercase tracking-wide">
                        {title}
                    </h2>
                    <p className="text-gray-600 font-medium">
                        {description}
                    </p>
                </div>

                {/* Math Content */}
                <div className={`
                    rounded-xl p-4 transition-colors duration-300
                    ${result === 'success' ? 'bg-green-100 ring-4 ring-green-400' : ''}
                    ${result === 'failure' ? 'bg-red-100 ring-4 ring-red-400' : ''}
                    ${!result ? 'bg-gray-50' : ''}
                `}>
                    <MathInput
                        problem={problem}
                        onSubmit={handleSubmit}
                        inputMode="multiple-choice"
                        disabled={result !== null}
                    />

                    {/* Result Feedback */}
                    {result === 'success' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-6xl animate-bounce">✨</span>
                        </div>
                    )}
                    {result === 'failure' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-8xl text-red-500 font-black opacity-50 animate-pulse">❌</span>
                        </div>
                    )}
                </div>

                {/* Cancel Button */}
                {!result && (
                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-2 text-gray-400 font-bold hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
