import { type CombatUnit, CombatPhase } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';
import '../../../styles/components/UnitCard.css';

interface UnitCardProps {
    unit: CombatUnit;
    phase: CombatPhase;
    onAct?: () => void;
    onRecharge?: () => void;
}

export const UnitCard = ({ unit, phase, onAct, onRecharge }: UnitCardProps) => {
    const isMonster = !unit.isPlayer;
    const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN;

    // Interaction Handler
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAct) return;

        if (unit.rechargeFailed) return;

        if (unit.currentEnergy > 0) {
            onAct?.();
        } else {
            onRecharge?.();
        }
    };

    // Card Classes Construction
    const getCardClasses = () => {
        const classes = ['unit-card'];

        // Border Color
        if (unit.currentEnergy === 0 && !isMonster && !unit.hasActed) {
            classes.push('border-yellow');
        } else if (isMonster) {
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

        if (unit.currentEnergy === 0 && !unit.rechargeFailed && !unit.hasActed && !isMonster) {
            classes.push('needs-recharge');
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
                    {unit.name}
                </h3>
            </div>

            {/* Background Image */}
            <div className="unit-card-bg">
                {(!isMonster && companionData) || (isMonster && unit.image) ? (
                    <img
                        src={!isMonster && companionData ? companionData.image : unit.image}
                        alt={unit.name}
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
                {unit.currentEnergy === 0 && !unit.hasActed && !isMonster && (
                    <div className="recharge-warning">
                        <div className="recharge-icon-container">
                            <span className="recharge-icon">⚡️</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Stats */}
            <div className="unit-stats-top">
                {/* Energy Pips */}
                {!isMonster && (
                    <div className="energy-pips-container">
                        {Array(unit.maxEnergy).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={`energy-pip ${i < unit.currentEnergy ? 'active' : 'inactive'}`}
                            />
                        ))}
                    </div>
                )}

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
                            Ability
                        </div>
                        <p className="ability-text">
                            {companionData.abilityDescription}
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
                        <span style={{ marginRight: '0.25rem' }}>HP</span> {unit.currentHealth} / {unit.maxHealth}
                    </div>
                </div>
            </div>
        </div>
    );
};
