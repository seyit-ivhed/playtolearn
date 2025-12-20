import React from 'react';
import { getCompanionById } from '../../../data/companions.data';
import { getXpForNextLevel } from '../../../utils/progression.utils';
import styles from './CompanionSeat.module.css';

interface CompanionSeatProps {
    index: number;
    companionId: string | null;
    stats?: {
        level: number;
        xp: number;
    };
    xpPool: number;
    onRemove?: (id: string) => void;
    onLevelUp?: (id: string) => void;
}

export const CompanionSeat: React.FC<CompanionSeatProps> = ({
    index,
    companionId,
    stats,
    xpPool,
    onRemove,
    onLevelUp
}) => {
    const seatClass = `${styles.companionSeat} ${styles[`pos${index}`]}`;

    if (!companionId) {
        return (
            <div
                className={seatClass}
                data-testid="empty-slot"
            >
                <div className={styles.emptyAvatar}>?</div>
            </div>
        );
    }

    const data = getCompanionById(companionId);
    if (!data) return null;

    const currentStats = stats || { level: 1, xp: 0 };

    return (
        <div
            className={seatClass}
            data-testid={`party-card-${companionId}`}
        >
            <div className={styles.companionFocus}>
                <img src={data.image} alt={data.name} className={styles.largeAvatar} />
                <div className={styles.companionBadge}>
                    <div className={styles.miniName}>{data.name}</div>
                    <div className={styles.miniLevel}>Lv {currentStats.level}</div>
                </div>
                {onRemove && (
                    <button
                        className={styles.leaveButton}
                        onClick={() => onRemove(companionId)}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className={styles.companionXpBar}>
                <div className={styles.xpSmallBar}>
                    <div
                        className={styles.xpSmallFill}
                        style={{ width: `${(currentStats.xp / getXpForNextLevel(currentStats.level)) * 100}%` }}
                    />
                </div>
                <button
                    className={styles.levelUpBtn}
                    disabled={xpPool < (getXpForNextLevel(currentStats.level) - currentStats.xp) || currentStats.level >= 10}
                    onClick={() => onLevelUp?.(companionId)}
                >
                    {currentStats.level >= 10 ? 'MAX LVL' : `LEVEL UP (+${getXpForNextLevel(currentStats.level) - currentStats.xp} XP)`}
                </button>
            </div>
        </div>
    );
};
