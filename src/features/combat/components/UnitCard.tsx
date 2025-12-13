import { type CombatUnit, CombatPhase } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';
import '../../../styles/components/UnitCard.css';
import '../../encounter/styles/animations.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { MathCardFace } from './MathCardFace';
import type { MathProblem } from '../../../types/math.types';
import { FloatingTextOverlay } from './FloatingTextOverlay';
import { UnitNameBadge } from './UnitNameBadge';
import { UnitCardImage } from './UnitCardImage';
import { AbilityCard } from './AbilityCard';
import { HealthBar } from './HealthBar';
// import { UltimateReadyOverlay } from './UltimateReadyOverlay'; // Removed per request

interface UnitCardProps {
    unit: CombatUnit;
    phase: CombatPhase;
    onAct?: () => void;
    isFlipped?: boolean;
    mathProblem?: MathProblem;
    onMathAnswer?: (correct: boolean) => void;
}

export const UnitCard = ({
    unit,
    phase,
    onAct,
    isFlipped = false,
    mathProblem,
    onMathAnswer
}: UnitCardProps) => {
    const { t } = useTranslation();
    const isMonster = !unit.isPlayer;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN;

    // Ultimate Ready State
    const isUltimateReady = !isMonster && !unit.isDead && unit.currentSpirit >= 100;

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
            setAnimationClass('anim-lunge-left');
            setTimeout(() => setAnimationClass(''), 300);
        }
    }, [unit.hasActed, isMonster, unit.isDead]);

    // Interaction Handler
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Prevent interaction with monster cards
        if (isMonster) return;

        if (!canAct) return;

        // Visual distinction for Ultimate?
        if (unit.currentSpirit >= 100) {
            setAnimationClass('anim-pulse-ultimate');
        } else {
            // Normal Attack Animation
            setAnimationClass('anim-lunge-right');
        }
        setTimeout(() => setAnimationClass(''), 500);

        onAct?.();
    };

    // Card Classes Construction
    const getCardClasses = () => {
        const classes = ['unit-card', animationClass];

        if (isUltimateReady) classes.push('ultimate-ready-glow');

        if (isFlipped) classes.push('is-flipped');

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
            <FloatingTextOverlay floatingTexts={floatingTexts} />
            <UnitNameBadge displayName={displayName} />

            <div className="unit-card-front">
                <UnitCardImage
                    isMonster={isMonster}
                    companionData={companionData}
                    image={unit.image}
                    icon={unit.icon}
                    displayName={displayName}
                />

                {/* Top Stats */}
                {/* Shield Indicator Removed (Moved to bottom) */}

                {/* Spacer */}
                <div className="card-spacer" />

                {/* Bottom Info Panel */}
                <div className="unit-info-bottom">
                    {!isMonster && companionData && (
                        <AbilityCard
                            abilityName={
                                isUltimateReady && companionData.specialAbility
                                    ? t(`companions.${unit.templateId}.special_ability_name`, companionData.specialAbility.name)
                                    : t(`companions.${unit.templateId}.ability_name`, companionData.abilityName)
                            }
                            abilityDescription={
                                isUltimateReady && companionData.specialAbility
                                    ? t(`companions.${unit.templateId}.special_ability_description`, companionData.specialAbility.description)
                                    : t(`companions.${unit.templateId}.ability_description`, companionData.abilityDescription)
                            }
                            progress={unit.currentSpirit}
                            isUltimateReady={isUltimateReady}
                        />
                    )}

                    {/* Shield Overlay (Centered on Health Bar) */}


                    <HealthBar
                        currentHealth={unit.currentHealth}
                        maxHealth={unit.maxHealth}
                        isMonster={isMonster}
                    />
                </div>

                {/* Ultimate Ready Overlay Removed */}
                {/* {!isMonster && unit.currentSpirit >= 100 && !unit.isDead && phase === CombatPhase.PLAYER_TURN && (
                    <UltimateReadyOverlay />
                )} */}
            </div>

            {/* Shield Overlay (Moved outside logic for overflow) */}
            {unit.currentShield > 0 && (
                <div className="shield-overlay-container">
                    <div className="shield-icon-bg">
                        <span className="shield-amount-text">{unit.currentShield}</span>
                    </div>
                </div>
            )}

            {/* Back Face (Math Challenge) */}
            {
                mathProblem && onMathAnswer && (
                    <MathCardFace
                        problem={mathProblem}
                        abilityName={companionData?.specialAbility?.name || 'MIGHTY BLOW'}
                        onAnswer={onMathAnswer}
                    />
                )
            }
        </div >
    );
};
