import { useTranslation } from 'react-i18next';

interface HealthBarProps {
    currentHealth: number;
    maxHealth: number;
    isMonster: boolean;
}

export const HealthBar = ({ currentHealth, maxHealth, isMonster }: HealthBarProps) => {
    const { t } = useTranslation();
    const healthPercent = (currentHealth / maxHealth) * 100;

    return (
        <div className="health-bar-container">
            <div
                className={`health-bar-fill ${isMonster ? 'monster' : 'player'}`}
                style={{ width: `${healthPercent}%` }}
            />
            <div className="health-text">
                <span style={{ marginRight: '0.25rem' }}>{t('combat.unit_card.hp', 'HP')}</span> {currentHealth} / {maxHealth}
            </div>
        </div>
    );
};
