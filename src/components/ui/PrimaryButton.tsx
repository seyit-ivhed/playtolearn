import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
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
    whileHover,
    whileTap,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        variant === 'gold' ? styles.gold : '',
        radiate ? (radiateVariant === 'secondary' ? styles['radiate-secondary'] : styles.radiate) : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <motion.button
            className={buttonClasses}
            whileHover={whileHover || { scale: 1.05, boxShadow: "0 0 20px rgba(74, 55, 33, 0.4)" }}
            whileTap={whileTap || { scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};
