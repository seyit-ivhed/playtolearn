import { type CombatUnit, CombatPhase } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';
import '../../../styles/components/UnitCard.css';
import '../../encounter/styles/animations.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';

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

    // Animation States
    const [animationClass, setAnimationClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; type: 'damage' | 'heal' }[]>([]);
    const prevHealth = useRef(unit.currentHealth);
    const textIdCounter = useRef(0);

    // Watch for health changes to trigger damage/heal effects
    useEffect(() => {
        const diff = unit.currentHealth - prevHealth.current;
        if (diff !== 0) {
            // Trigger Shake if damage
            if (diff < 0) {
                setAnimationClass('anim-shake-damage');
            }

            // Add Floating Text
            const id = textIdCounter.current++;
            const text = diff > 0 ? `+${diff}` : `${diff}`;
            const type = diff > 0 ? 'heal' : 'damage';

            setFloatingTexts((prev: { id: number; text: string; type: 'damage' | 'heal' }[]) => [...prev, { id, text, type }]);

            // Cleanup floating text after animation
            setTimeout(() => {
                setFloatingTexts((prev: { id: number; text: string; type: 'damage' | 'heal' }[]) => prev.filter((ft: { id: number }) => ft.id !== id));
            }, 1000);

            // Cleanup shake class
            if (diff < 0) {
                setTimeout(() => setAnimationClass(''), 500);
            }
        }
        prevHealth.current = unit.currentHealth;
    }, [unit.currentHealth]);

    // Watch for action to trigger attack animation (Monsters)
    useEffect(() => {
        if (isMonster && unit.hasActed && !unit.isDead) {
            // We only want to trigger this on the transition, but unit.hasActed is state.
            // Since this component re-renders, checking just true might re-trigger if other props change?
            // Actually, usually store updates trigger re-render.
            // A ref to track 'prevHasActed' would be safer to ensure we only trigger on transition.
            setAnimationClass('anim-lunge-left');
            setTimeout(() => setAnimationClass(''), 300);
        }
    }, [unit.hasActed, isMonster, unit.isDead]);

    // Interaction Handler
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAct) return;

        // Trigger Attack Animation Lunge
        setAnimationClass('anim-lunge-right');
        setTimeout(() => setAnimationClass(''), 300);

        onAct?.();
    };

    // Card Classes Construction
    const getCardClasses = () => {
        const classes = ['unit-card', animationClass];

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
            {/* Floating Text Overlay */}
            <div className="floating-text-container">
                {floatingTexts.map(ft => (
                    <div
                        key={ft.id}
                        className={`floating-number ${ft.type}`}
                    >
                        {ft.text}
                    </div>
                ))}
            </div>
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
