import type { MathProblem } from '../../../types/math.types';
import { useState } from 'react';

interface MathCardFaceProps {
    problem: MathProblem;
    abilityName: string;
    onAnswer: (correct: boolean) => void;
}

export const MathCardFace = ({ problem, abilityName, onAnswer }: MathCardFaceProps) => {
    const [selected, setSelected] = useState<number | null>(null);

    const handleAnswer = (choice: number) => {
        if (selected !== null) return; // Prevent double click
        setSelected(choice);
        const isCorrect = choice === problem.correctAnswer;

        // Small delay to show visual feedback before closing
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 800);
    };

    const getBtnClass = (choice: number) => {
        if (selected === null) return 'math-choice-btn';
        if (choice === problem.correctAnswer) return 'math-choice-btn correct';
        if (choice === selected && choice !== problem.correctAnswer) return 'math-choice-btn wrong';
        return 'math-choice-btn dimmed';
    };

    const operationMap = {
        'ADD': '+',
        'SUBTRACT': '-',
        'MULTIPLY': '×'
    } as const;



    return (
        <div
            className="unit-card-face back"
            onClick={(e) => e.stopPropagation()}
        >
            <h3 className="math-title">{abilityName}</h3>

            <div className="math-problem-display">
                <span className="operand">{problem.operand1}</span>
                <span className="operator">{operationMap[problem.operation]}</span>
                <span className="operand">{problem.operand2}</span>
                <span className="equals">=</span>
                <span className="question-mark">?</span>
            </div>

            <div className="math-choices-grid">
                {problem.choices?.map((choice, idx) => (
                    <button
                        key={`${choice}-${idx}`}
                        className={getBtnClass(choice)}
                        onClick={(e) => { e.stopPropagation(); handleAnswer(choice); }}
                    >
                        {choice}
                    </button>
                ))}
            </div>
        </div>
    );
};
