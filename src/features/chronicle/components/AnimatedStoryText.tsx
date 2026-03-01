import React, { useMemo, useRef, useEffect } from 'react';
import styles from './AnimatedStoryText.module.css';

interface AnimatedStoryTextProps {
    text: string;
    isSkipped: boolean;
    onComplete: () => void;
    wordDelayMs?: number;
}

export const AnimatedStoryText: React.FC<AnimatedStoryTextProps> = ({
    text,
    isSkipped,
    onComplete,
    wordDelayMs = 450
}) => {
    const words = useMemo(() => text.split(' '), [text]);

    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (isSkipped) {
            onCompleteRef.current();
            return;
        }

        const totalTime = words.length * wordDelayMs + 500;
        const timer = setTimeout(() => {
            onCompleteRef.current();
        }, totalTime);

        return () => {
            clearTimeout(timer);
        };
    }, [words.length, wordDelayMs, isSkipped]);

    return (
        <span className={styles.container}>
            {words.map((word, index) => {
                const delay = (index * wordDelayMs) / 1000;
                return (
                    <span
                        key={index}
                        className={`${styles.word} ${isSkipped ? styles.skipped : ''}`}
                        style={{
                            animationDelay: `${delay}s`,
                            animationDuration: '0.4s'
                        }}
                    >
                        {word}{' '}
                    </span>
                );
            })}
        </span>
    );
};
