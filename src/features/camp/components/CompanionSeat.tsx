import React, { useState } from 'react';
import { getCompanionById } from '../../../data/companions.data';
import { getCompanionSprite } from '../../../data/companion-sprites';
import { getXpForNextLevel, getEvolutionAtLevel } from '../../../utils/progression.utils';
import { CompanionTooltip } from './CompanionTooltip';
import styles from './CompanionSeat.module.css';

interface CompanionSeatProps {
    companionId: string;
    stats?: {
        level: number;
        xp: number;
    };
    xpPool: number;
    onRemove?: (id: string) => void;
    onLevelUp?: (id: string) => void;
}

export const CompanionSeat: React.FC<CompanionSeatProps> = ({
    companionId,
    stats,
    xpPool,
    onRemove,
    onLevelUp,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const seatClass = styles.companionSeat;

    const data = getCompanionById(companionId);
    if (!data) return null;

    const currentStats = stats || { level: 1, xp: 0 };

    const isEvolution = !!getEvolutionAtLevel(data, currentStats.level + 1);

    const canLevelUp = typeof xpPool === 'number' &&
        xpPool >= (getXpForNextLevel(currentStats.level) - currentStats.xp);

    return (
        <div
            className={seatClass}
            data-testid={`party-card-${companionId}`}
        >
            <div
                className={styles.companionFocus}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={styles.miniLevel}>Lv {currentStats.level}</div>
                <div className={styles.avatarWrapper}>
                    <img src={getCompanionSprite(companionId, currentStats.level)} alt={data.name} className={styles.largeAvatar} />
                    {onRemove && (
                        <button
                            className={styles.leaveButton}
                            onClick={() => onRemove(companionId)}
                            data-testid={`remove-companion-${companionId}`}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className={styles.miniName}>{data.name}</div>
            </div>

            {isHovered && (
                <CompanionTooltip
                    companionId={companionId}
                    level={currentStats.level}
                />
            )}

            <div className={styles.companionXpBar}>
                <div className={styles.xpSmallBar}>
                    <div
                        className={styles.xpSmallFill}
                        style={{ width: `${(currentStats.xp / getXpForNextLevel(currentStats.level)) * 100}%` }}
                    />
                </div>
                <button
                    className={`${styles.levelUpBtn} ${canLevelUp ? styles.canLevelUp : ''} ${isEvolution && canLevelUp ? styles.evolutionBtn : ''}`}
                    disabled={!canLevelUp}
                    onClick={() => onLevelUp?.(companionId)}
                    data-testid={`level-up-btn-${companionId}`}
                >
                    {isEvolution ? 'EVOLVE!' : 'LEVEL UP'} ({getXpForNextLevel(currentStats.level) - currentStats.xp} XP)
                </button>
            </div>
        </div>
    );
};
