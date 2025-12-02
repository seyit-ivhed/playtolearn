import { useState } from 'react';
import styles from './MultipleChoice.module.css';

interface MultipleChoiceProps {
    choices: number[];
    onSubmit: (answer: number) => void;
    disabled?: boolean;
}

export default function MultipleChoice({
    choices,
    onSubmit,
    disabled = false
}: MultipleChoiceProps) {
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const handleChoiceClick = (choice: number) => {
        if (disabled) return;
        setSelectedChoice(choice);
    };

    const handleSubmit = () => {
        if (disabled || selectedChoice === null) return;
        onSubmit(selectedChoice);
        setSelectedChoice(null);
    };

    return (
        <div className={styles.multipleChoiceContainer}>
            <div className={styles.choiceGrid}>
                {choices.map((choice, index) => (
                    <button
                        key={index}
                        className={`${styles.choiceButton} ${selectedChoice === choice ? styles.selected : ''
                            }`}
                        onClick={() => handleChoiceClick(choice)}
                        disabled={disabled}
                    >
                        <span className={styles.choiceLabel}>
                            {String.fromCharCode(65 + index)}
                        </span>
                        <span className={styles.choiceValue}>{choice}</span>
                    </button>
                ))}
            </div>

            <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={disabled || selectedChoice === null}
            >
                Submit Answer
            </button>
        </div>
    );
}
