import { getCompanionById } from '../../../data/companions.data';
import { getCompanionSprite } from '../../../data/companion-sprites';
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
    onHover?: (id: string | null, level: number) => void;
}

export const CompanionSeat: React.FC<CompanionSeatProps> = ({
    index,
    companionId,
    stats,
    xpPool,
    onRemove,
    onLevelUp,
    onHover
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

    const canLevelUp = typeof xpPool === 'number' &&
        xpPool >= (getXpForNextLevel(currentStats.level) - currentStats.xp);

    return (
        <div
            className={seatClass}
            data-testid={`party-card-${companionId}`}
            onMouseEnter={() => onHover?.(companionId, currentStats.level)}
            onMouseLeave={() => onHover?.(null, 0)}
        >
            <div className={styles.companionFocus}>
                <img src={getCompanionSprite(companionId)} alt={data.name} className={styles.largeAvatar} />
                <div className={styles.companionBadge}>
                    <div className={styles.miniName}>{data.name}</div>
                    <div className={styles.miniLevel}>Lv {currentStats.level}</div>
                </div>

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

            <div className={styles.companionXpBar}>
                <div className={styles.xpSmallBar}>
                    <div
                        className={styles.xpSmallFill}
                        style={{ width: `${(currentStats.xp / getXpForNextLevel(currentStats.level)) * 100}%` }}
                    />
                </div>
                <button
                    className={`${styles.levelUpBtn} ${canLevelUp ? styles.canLevelUp : ''}`}
                    disabled={!canLevelUp}
                    onClick={() => onLevelUp?.(companionId)}
                    data-testid={`level-up-btn-${companionId}`}
                >
                    LEVEL UP ({getXpForNextLevel(currentStats.level) - currentStats.xp} XP)
                </button>
            </div>
        </div>
    );
};
