import React from 'react';
import styles from './MissionNode.module.css';
import { MissionStatus } from '../../types/mission.types';

interface MissionNodeProps {
    id: string;
    status: MissionStatus;
    title: string;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const MissionNode: React.FC<MissionNodeProps> = ({
    id,
    status,
    title,
    onClick,
    className = '',
    style,
}) => {
    const isLocked = status === MissionStatus.LOCKED;
    const isCompleted = status === MissionStatus.COMPLETED;

    const handleClick = () => {
        if (!isLocked && onClick) {
            onClick();
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case MissionStatus.LOCKED:
                return styles.locked;
            case MissionStatus.AVAILABLE:
                return styles.available;
            case MissionStatus.COMPLETED:
                return styles.completed;
            default:
                return '';
        }
    };

    const getIcon = () => {
        if (isLocked) return '🔒';
        if (isCompleted) return '⭐';
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
            data-testid={`mission-node-${id}`}
        >
            <span className={styles.icon}>{getIcon()}</span>
            <div className={styles.label}>{title}</div>
        </div>
    );
};
