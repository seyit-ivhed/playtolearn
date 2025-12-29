import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Swords, Star } from 'lucide-react';
import { getCompanionById } from '../../../data/companions.data';
import { getStatsForLevel } from '../../../utils/progression.utils';
import styles from './CompanionTooltip.module.css';

interface CompanionTooltipProps {
    companionId: string;
    level: number;
}

export const CompanionTooltip: React.FC<CompanionTooltipProps> = ({ companionId, level }) => {
    const { t } = useTranslation();
    const data = getCompanionById(companionId);
    if (!data) return null;

    const calculatedStats = getStatsForLevel(data, level);

    return (
        <div className={styles.statsTooltip}>
            <div className={styles.tooltipHeader}>
                <div className={styles.heroName}>{data.name}</div>
                <div className={styles.heroTitle}>{data.title}</div>
            </div>

            <div className={styles.statGrid}>
                <div className={styles.statItem}>
                    <Heart size={18} className={styles.iconHp} />
                    <span>{calculatedStats.maxHealth} {t('companions.stats.hp')}</span>
                </div>
                <div className={styles.statItem}>
                    <Swords size={18} className={styles.iconAtk} />
                    <span>{calculatedStats.abilityDamage} {t('companions.stats.attack')}</span>
                </div>
            </div>

            <div className={styles.abilitySection}>
                <div className={styles.abilityHeader}>
                    <Star size={16} className={styles.iconUltimate} />
                    <span>{t(`companions.${companionId}.special_ability_name`)}</span>
                </div>
                <p className={styles.abilityText}>
                    {t(`companions.${companionId}.special_ability_description`, { value: calculatedStats.specialAbilityValue || data.specialAbility.value })}
                </p>
            </div>
        </div>
    );
};
