import React, { type ReactNode } from 'react';
import styles from '../../ChronicleBook.module.css';

interface BookLayoutProps {
    children: ReactNode;
}

export const BookLayout: React.FC<BookLayoutProps> = ({ children }) => {
    return (
        <div className={styles.chronicleWrapper}>
            <div className={styles.bookScene}>
                <div className={styles.bookContainer}>
                    {children}
                </div>
            </div>
        </div>
    );
};
