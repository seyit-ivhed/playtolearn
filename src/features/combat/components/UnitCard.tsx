import { type CombatUnit, CombatPhase } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';
import '../../../styles/components/UnitCard.css';
import { useTranslation } from 'react-i18next';

interface UnitCardProps {
    unit: CombatUnit;
    phase: CombatPhase;
    onAct?: () => void;
}

export const UnitCard = ({ unit, phase, onAct }: UnitCardProps) => {
    const { t } = useTranslation();
    const isMonster = !unit.isPlayer;
    const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN;

    // Localized Name
    const displayName = isMonster
        ? t(`monsters.${unit.templateId}.name`, unit.name)
        : t(`companions.${unit.templateId}.name`, companionData?.name || unit.name);

    // Interaction Handler
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAct) return;

        onAct?.();
    };

    // Card Classes Construction
    const getCardClasses = () => {
        const classes = ['unit-card'];

        // Border Color
        if (isMonster) {
            classes.push('border-red');
        } else {
            classes.push('border-brown');
        }

        // State Classes
        if (unit.isDead) classes.push('is-dead');
        if (unit.hasActed && !unit.isDead) classes.push('has-acted');

        if (!isMonster && !unit.hasActed) {
            if (canAct) {
                classes.push('can-act');
            } else {
                classes.push('cannot-act');
            }
        }



        return classes.join(' ');
    };

    return (
        <div
            className={getCardClasses()}
            onClick={handleCardClick}
            data-testid={`unit-card-${unit.id}`}
        >
            {/* Name Badge */}
            <div className="unit-card-name-badge">
                <h3 className="unit-card-name-text">
                    {displayName}
                </h3>
            </div>

            {/* Background Image */}
            <div className="unit-card-bg">
                {(!isMonster && companionData) || (isMonster && unit.image) ? (
                    <img
                        src={!isMonster && companionData ? companionData.image : unit.image}
                        alt={displayName}
                        className="unit-card-image"
                    />
                ) : (
                    <div className="unit-card-placeholder">
                        {unit.icon}
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="unit-card-gradient" />

                {/* Visual Recharge Warning Overlay */}

            </div>

            {/* Top Stats */}
            <div className="unit-stats-top">
                {/* Energy Pips */}
                {/* Energy Pips Removed */}

                {/* Shield Indicator */}
                {unit.currentShield > 0 && (
                    <div className="shield-badge">
                        🛡️ {unit.currentShield}
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="card-spacer" />

            {/* Bottom Info Panel */}
            <div className="unit-info-bottom">
                {/* Description Box */}
                {!isMonster && companionData && (
                    <div className="ability-card">
                        <div className="ability-tag">
                            {t('combat.unit_card.ability', 'Ability')}
                        </div>
                        <p className="ability-text">
                            {t(`companions.${unit.templateId}.ability_description`, companionData.abilityDescription)}
                        </p>
                    </div>
                )}

                {/* Health Bar */}
                <div className="health-bar-container">
                    <div
                        className={`health-bar-fill ${isMonster ? 'monster' : 'player'}`}
                        style={{ width: `${healthPercent}%` }}
                    />
                    <div className="health-text">
                        <span style={{ marginRight: '0.25rem' }}>{t('combat.unit_card.hp', 'HP')}</span> {unit.currentHealth} / {unit.maxHealth}
                    </div>
                </div>
            </div>
        </div>
    );
};
