import React from 'react';
import { getDifficultyExamples } from '../../utils/math/difficulty-examples';
import styles from './DifficultyExamples.module.css';

interface DifficultyExamplesProps {
    level: number;
    limit?: number;
}

export const DifficultyExamples: React.FC<DifficultyExamplesProps> = ({ level, limit = 3 }) => {
    const examples = getDifficultyExamples(level).slice(0, limit);

    return (
        <div className={styles.examplesContainer} data-testid={`difficulty-examples-${level}`}>
            {examples.map((example, i) => (
                <span key={i} className={styles.exampleTag}>
                    {example}
                </span>
            ))}
        </div>
    );
};
