import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMathStore } from '../stores/math.store';
import MathInput, { type InputMode } from '../components/MathInput/MathInput';
import FeedbackIndicator, { type FeedbackState } from '../components/Feedback/FeedbackIndicator';
import { MathOperation, type DifficultyLevel } from '../types/math.types';
import styles from './MathSandboxPage.module.css';

export default function MathSandboxPage() {
    const [selectedOperation, setSelectedOperation] = useState<MathOperation>(MathOperation.ADD);
    const [inputMode, setInputMode] = useState<InputMode>('multiple-choice');

    const {
        currentProblem,
        lastValidationResult,
        difficulty,
        streak,
        setDifficulty,
        generateNewProblem,
        submitAnswer,
        reset
    } = useMathStore();

    // Generate first problem on mount
    useEffect(() => {
        generateNewProblem(selectedOperation);
        return () => reset(); // Cleanup on unmount
    }, []);

    const handleOperationChange = (op: MathOperation) => {
        setSelectedOperation(op);
        generateNewProblem(op);
    };

    const handleDifficultyChange = (level: DifficultyLevel) => {
        setDifficulty(level);
        generateNewProblem(selectedOperation);
    };

    const handleNextProblem = () => {
        generateNewProblem(selectedOperation);
    };

    const getFeedbackState = (): FeedbackState => {
        if (!lastValidationResult) return 'neutral';
        return lastValidationResult.isCorrect ? 'correct' : 'incorrect';
    };

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.backButton}>← Back to Home</Link>

            <header className={styles.header}>
                <h1 className={styles.title}>Math Sandbox</h1>
                <p className={styles.subtitle}>Test your skills in the training simulation</p>
            </header>

            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <label className={styles.label}>Operation</label>
                    <select
                        className={styles.select}
                        value={selectedOperation}
                        onChange={(e) => handleOperationChange(e.target.value as MathOperation)}
                    >
                        <option value={MathOperation.ADD}>Addition (+)</option>
                        <option value={MathOperation.SUBTRACT}>Subtraction (-)</option>
                        <option value={MathOperation.MULTIPLY}>Multiplication (×)</option>
                        <option value={MathOperation.DIVIDE}>Division (÷)</option>
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label}>Difficulty</label>
                    <select
                        className={styles.select}
                        value={difficulty}
                        onChange={(e) => handleDifficultyChange(Number(e.target.value) as DifficultyLevel)}
                    >
                        <option value={1}>Level 1 (Cadet)</option>
                        <option value={2}>Level 2 (Pilot)</option>
                    </select>
                </div>

                <div className={styles.controlGroup}>
                    <label className={styles.label}>Input Mode</label>
                    <select
                        className={styles.select}
                        value={inputMode}
                        onChange={(e) => setInputMode(e.target.value as InputMode)}
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="numpad">Numpad</option>
                    </select>
                </div>
            </div>

            <div className={styles.gameArea}>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Streak</span>
                        <span>🔥 {streak}</span>
                    </div>
                </div>

                {currentProblem && (
                    <MathInput
                        problem={currentProblem}
                        onSubmit={submitAnswer}
                        inputMode={inputMode}
                        disabled={!!lastValidationResult?.isCorrect}
                    />
                )}

                <FeedbackIndicator
                    state={getFeedbackState()}
                />

                {lastValidationResult?.isCorrect && (
                    <button className={styles.nextButton} onClick={handleNextProblem}>
                        Next Problem ➜
                    </button>
                )}
            </div>
        </div>
    );
}
