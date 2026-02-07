import React from 'react';
import { X } from 'lucide-react';
import styles from './FormCloseButton.module.css';

interface FormCloseButtonProps {
    onClick: () => void;
    ariaLabel?: string;
    className?: string;
    size?: number;
    color?: string;
}

export const FormCloseButton: React.FC<FormCloseButtonProps> = ({
    onClick,
    ariaLabel = 'Close',
    className = '',
    size = 24,
    color = 'currentColor'
}) => {
    return (
        <button
            className={`${styles.formCloseButton} ${className}`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <X size={size} color={color} />
        </button>
    );
};
