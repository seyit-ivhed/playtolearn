import React, { useState } from 'react';
import { generateProblem, validateAnswer } from '../../utils/math-generator';
import { MathOperation, type DifficultyLevel, type MathProblem } from '../../types/math.types';

const MathTestPage: React.FC = () => {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [operation, setOperation] = useState<MathOperation>(MathOperation.ADD);
    const [problem, setProblem] = useState<MathProblem | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    const handleGenerate = () => {
        const newProblem = generateProblem(operation, difficulty);
        setProblem(newProblem);
        setFeedback(''); // Reset feedback
    };

    const handleChoiceClick = (choice: number | string) => {
        if (!problem) return;
        const result = validateAnswer(choice, problem.correctAnswer);
        setFeedback(result.isCorrect ? 'Correct!' : `Incorrect. Expected: ${problem.correctAnswer}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'white', backgroundColor: '#222', minHeight: '100vh' }}>
            <h1>Math Logic Debugger</h1>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Difficulty (1-5):</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value) as DifficultyLevel)}
                        style={{ padding: '5px', borderRadius: '4px' }}
                    >
                        {[1, 2, 3, 4, 5].map(level => (
                            <option key={level} value={level}>Level {level}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Operation:</label>
                    <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value as MathOperation)}
                        style={{ padding: '5px', borderRadius: '4px' }}
                    >
                        {Object.values(MathOperation).map(op => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleGenerate}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        alignSelf: 'flex-end'
                    }}
                >
                    Generate Problem
                </button>
            </div>

            {problem && (
                <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', backgroundColor: '#333' }}>
                    <h2 style={{ fontSize: '2em' }}>
                        {problem.operand1} {problem.operation === MathOperation.MULTIPLY ? '×' :
                            problem.operation === MathOperation.DIVIDE ? '÷' :
                                problem.operation === MathOperation.ADD ? '+' : '-'} {problem.operand2} = ?
                    </h2>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        {problem.choices && problem.choices.map((choice, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleChoiceClick(choice)}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1.2em',
                                    cursor: 'pointer',
                                    backgroundColor: '#555',
                                    color: 'white',
                                    border: '1px solid #666',
                                    borderRadius: '4px'
                                }}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div style={{
                            marginTop: '20px',
                            fontSize: '1.5em',
                            color: feedback.startsWith('Correct') ? '#4CAF50' : '#FF5252'
                        }}>
                            {feedback}
                        </div>
                    )}

                    <div style={{ marginTop: '20px', fontSize: '0.8em', color: '#888' }}>
                        <p>Raw Data:</p>
                        <pre>{JSON.stringify(problem, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MathTestPage;
