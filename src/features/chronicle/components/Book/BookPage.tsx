import React, { type ReactNode } from 'react';
import styles from '../../ChronicleBook.module.css';

interface BookPageProps {
    children: ReactNode;
    state: 'active' | 'flipped' | 'upcoming' | 'past';
    zIndex: number;
    rotation?: number;
    isCover?: boolean;
}

export const BookPage: React.FC<BookPageProps> = ({
    children,
    state,
    zIndex,
    rotation,
    isCover = false
}) => {
    let transformStyle = {};

    if (rotation !== undefined) {
        transformStyle = { transform: `rotateY(${rotation}deg)` };
    } else {
        if (state === 'active' || state === 'upcoming') {
            transformStyle = { transform: `rotateY(0deg)` };
        } else {
            transformStyle = { transform: `rotateY(-270deg)` };
        }
    }

    const className = `
        ${styles.bookPage} 
        ${styles[state]} 
        ${isCover ? styles.cover : ''}
    `;

    return (
        <div
            className={className.trim()}
            style={{
                zIndex,
                ...transformStyle
            }}
        >
            <div className={styles.pageFront}>
                {children}
            </div>
            <div className={styles.pageBack}>
                {/* Back of the page texture or empty */}
            </div>
        </div>
    );
};
