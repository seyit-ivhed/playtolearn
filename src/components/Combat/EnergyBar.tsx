import React from 'react';
import styles from './EnergyBar.module.css';

interface EnergyBarProps {
    current: number;
    max: number;
    className?: string;
}

export const EnergyBar: React.FC<EnergyBarProps> = ({ current, max, className = '' }) => {
    // Create array of stars based on max energy
    const stars = Array.from({ length: max }, (_, index) => {
        const isFilled = index < current;
        return (
            <span
                key={index}
                className={`${styles.star} ${isFilled ? styles.filled : styles.empty}`}
                data-testid={`energy-star-${index}`}
            >
                {isFilled ? '★' : '☆'}
            </span>
        );
    });

    return (
        <div className={`${styles.container} ${className}`} data-testid="energy-bar">
            {stars}
        </div>
    );
};
