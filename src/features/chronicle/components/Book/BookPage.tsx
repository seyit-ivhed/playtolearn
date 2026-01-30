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
    // Calculate rotation and transform logic


    let transformStyle = {};

    if (rotation !== undefined) {
        transformStyle = { transform: `rotateY(${rotation}deg)` };
    } else {
        // Magazine "Roll Behind" Logic
        // Active: Flat (0deg)
        // Flipped: Rotated -180deg (facing back) AND translated to sit behind the active page.
        // For covers in flipped state, rotate further to -270deg to create a "fold backwards" effect.
        // Since rotating -180deg around 'left' puts page on the left side,
        // we need to translate it purely to the right to overlap the active stack.
        // In the rotated coordinate system (flipped X axis), +X points LEFT.
        // So to move RIGHT, we need negative X translation.

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
