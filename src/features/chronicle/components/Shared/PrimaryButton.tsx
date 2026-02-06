import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className = '',
    whileHover,
    whileTap,
    ...props
}) => {
    return (
        <motion.button
            className={`${styles.button} ${className}`}
            whileHover={whileHover || { scale: 1.05, boxShadow: "0 0 20px rgba(74, 55, 33, 0.4)" }}
            whileTap={whileTap || { scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};
