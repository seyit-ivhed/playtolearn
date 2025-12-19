import React from 'react';
import styles from './CampHeader.module.css';

interface CampHeaderProps {
    title: string;
    storyBeat?: {
        speaker: string;
        text: string;
    };
}

export const CampHeader: React.FC<CampHeaderProps> = ({ title, storyBeat }) => {
    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 data-testid="camp-title">🔥 {title}</h1>
                <p className={styles.subtitle}>A moment of peace under the stars</p>
            </div>
            {storyBeat && (
                <div className={styles.storyBox}>
                    <div className={styles.speakerName}>{storyBeat.speaker}</div>
                    <p className={styles.storyText}>"{storyBeat.text}"</p>
                </div>
            )}
        </header>
    );
};
