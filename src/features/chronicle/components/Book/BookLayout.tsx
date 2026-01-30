import React, { type ReactNode } from 'react';
import styles from '../../ChronicleBook.module.css';

interface BookLayoutProps {
    children: ReactNode;
    isOpen?: boolean;
}

export const BookLayout: React.FC<BookLayoutProps> = ({ children, isOpen = false }) => {
    return (
        <div className={styles.chronicleWrapper}>
            <div className={`${styles.bookScene} ${isOpen ? styles.isOpen : ''}`}>
                <div className={styles.bookContainer}>
                    {children}
                </div>
            </div>
        </div>
    );
};
