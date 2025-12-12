import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const handleChoiceClick = (choice: number) => {
        if (disabled) return;
        setSelectedChoice(choice);
        // Instant submit for better UX in combat
        onSubmit(choice);
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
            {/* Submit button removed for instant interaction */}
        </div>
    );
}
