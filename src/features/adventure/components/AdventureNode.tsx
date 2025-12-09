import React from 'react';
import styles from './AdventureNode.module.css';
import { AdventureStatus } from '../../../types/adventure.types';

interface AdventureNodeProps {
    id: string;
    status: AdventureStatus;
    title: string;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const AdventureNode: React.FC<AdventureNodeProps> = ({
    id,
    status,
    title,
    onClick,
    className = '',
    style,
}) => {
    const isLocked = status === AdventureStatus.LOCKED;
    const isCompleted = status === AdventureStatus.COMPLETED;

    const handleClick = () => {
        if (!isLocked && onClick) {
            onClick();
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case AdventureStatus.LOCKED:
                return styles.locked;
            case AdventureStatus.AVAILABLE:
                return styles.available;
            case AdventureStatus.COMPLETED:
                return styles.completed;
            default:
                return '';
        }
    };

    const getIcon = () => {
        if (isLocked) return '🔒';
        if (isCompleted) return '✓';
        return '⚔️';
    };

    return (
        <div
            className={`${styles.node} ${getStatusClass()} ${className}`}
            onClick={handleClick}
            style={style}
            role="button"
            aria-label={`${title} - ${status}`}
            aria-disabled={isLocked}
            data-testid={`adventure-node-${id}`}
        >
            <div className={styles.ring}></div>
            <div className={styles.nodeContent}>
                <span className={styles.icon}>{getIcon()}</span>
            </div>
            <div className={styles.label}>{title}</div>
        </div>
    );
};
