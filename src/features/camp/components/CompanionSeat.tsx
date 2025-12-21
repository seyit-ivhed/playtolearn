import { useTranslation } from 'react-i18next';
import { Heart, Swords, Zap, Star } from 'lucide-react';
import { getCompanionById } from '../../../data/companions.data';
import { getXpForNextLevel, getStatsForLevel } from '../../../utils/progression.utils';
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
    const { t } = useTranslation();
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
    const calculatedStats = getStatsForLevel(data, currentStats.level);

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

                {/* Stats Tooltip */}
                <div className={styles.statsTooltip}>
                    <div className={styles.tooltipHeader}>
                        <div className={styles.heroName}>{data.name}</div>
                        <div className={styles.heroTitle}>{data.title}</div>
                    </div>

                    <div className={styles.statGrid}>
                        <div className={styles.statItem}>
                            <Heart size={16} className={styles.iconHp} />
                            <span>{calculatedStats.maxHealth}</span>
                        </div>
                        <div className={styles.statItem}>
                            <Swords size={16} className={styles.iconAtk} />
                            <span>{calculatedStats.abilityDamage}</span>
                        </div>
                    </div>

                    <div className={styles.abilitySection}>
                        <div className={styles.abilityHeader}>
                            <Zap size={14} className={styles.iconAbility} />
                            <span>{t(`companions.${companionId}.ability_name`)}</span>
                        </div>
                        <p className={styles.abilityText}>
                            {t(`companions.${companionId}.ability_description`, { damage: calculatedStats.abilityDamage })}
                        </p>
                    </div>

                    <div className={styles.abilitySection}>
                        <div className={styles.abilityHeader}>
                            <Star size={14} className={styles.iconUltimate} />
                            <span>{t(`companions.${companionId}.special_ability_name`)}</span>
                        </div>
                        <p className={styles.abilityText}>
                            {t(`companions.${companionId}.special_ability_description`, { value: data.specialAbility.value })}
                        </p>
                    </div>
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
                    disabled={
                        typeof xpPool !== 'number' ||
                        xpPool < (getXpForNextLevel(currentStats.level) - currentStats.xp) ||
                        currentStats.level >= 10
                    }
                    onClick={() => onLevelUp?.(companionId)}
                >
                    {currentStats.level >= 10 ? 'MAX LVL' : `LEVEL UP (+${getXpForNextLevel(currentStats.level) - currentStats.xp} XP)`}
                </button>
            </div>
        </div>
    );
};
