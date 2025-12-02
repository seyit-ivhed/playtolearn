import React, { useEffect, useState } from 'react';
import styles from './EntitySprite.module.css';

interface EntitySpriteProps {
    type: 'player' | 'enemy';
    isHit?: boolean;
    imageSrc?: string; // Optional custom image
    className?: string;
}

export const EntitySprite: React.FC<EntitySpriteProps> = ({
    type,
    isHit = false,
    imageSrc,
    className = ''
}) => {
    const [animating, setAnimating] = useState(false);

    // Reset animation state when isHit changes to true
    useEffect(() => {
        if (isHit) {
            setAnimating(true);
            const timer = setTimeout(() => setAnimating(false), 500); // Match CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [isHit]);

    // Default placeholders if no image provided
    const defaultIcon = type === 'player' ? '🚀' : '👾';

    return (
        <div className={`${styles.container} ${styles[type]} ${animating ? styles.hit : styles.floating} ${className}`}>
            {imageSrc ? (
                <img src={imageSrc} alt={`${type} sprite`} className={styles.sprite} />
            ) : (
                <span className={styles.sprite}>{defaultIcon}</span>
            )}
        </div>
    );
};
