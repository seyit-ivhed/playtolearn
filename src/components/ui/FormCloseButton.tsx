import React from 'react';
import { X } from 'lucide-react';
import './FormCloseButton.css';

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
            className={`form-close-button ${className}`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <X size={size} color={color} />
        </button>
    );
};
