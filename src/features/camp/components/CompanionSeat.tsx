import React, { useState } from 'react';
import { getCompanionById } from '../../../data/companions.data';
import { getCompanionCampImage } from '../../../data/companion-sprites';
import { getEvolutionAtLevel } from '../../../utils/progression.utils';
import { CompanionTooltip } from './CompanionTooltip';
import styles from './CompanionSeat.module.css';

interface CompanionSeatProps {
    companionId: string;
    stats?: {
        level: number;
    };

    onLevelUp?: (id: string) => void;
}

export const CompanionSeat: React.FC<CompanionSeatProps> = ({
    companionId,
    stats,

    onLevelUp,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const seatClass = styles.companionSeat;

    const data = getCompanionById(companionId);
    if (!data) return null;

    const currentStats = stats || { level: 1 };

    const isEvolution = !!getEvolutionAtLevel(data, currentStats.level + 1);

    const canLevelUp = currentStats.level < 10;

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
                    <img src={getCompanionCampImage(companionId, currentStats.level)} alt={data.name} className={styles.largeAvatar} />
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
                <button
                    className={`${styles.levelUpBtn} ${canLevelUp ? styles.canLevelUp : ''} ${isEvolution && canLevelUp ? styles.evolutionBtn : ''}`}
                    disabled={!canLevelUp}
                    onClick={() => onLevelUp?.(companionId)}
                    data-testid={`level-up-btn-${companionId}`}
                >
                    {isEvolution ? 'EVOLVE!' : 'LEVEL UP'}
                </button>
            </div>
        </div>
    );
};
