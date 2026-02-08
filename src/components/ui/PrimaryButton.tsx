import React from 'react';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'gold';
    radiate?: boolean;
    radiateVariant?: 'primary' | 'secondary';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    radiate = false,
    radiateVariant = 'primary',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        variant === 'gold' ? styles.gold : '',
        radiate ? (radiateVariant === 'secondary' ? styles.radiateSecondary : styles.radiate) : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            {...props}
        >
            {children}
        </button>
    );
};
