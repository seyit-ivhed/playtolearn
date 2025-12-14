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
    activeVisualEffect?: string | null;
    disableInteraction?: boolean;
}

export const UnitCard = ({
    unit,
    phase,
    onAct,
    isFlipped = false,
    mathProblem,
    onMathAnswer,
    activeVisualEffect,
    disableInteraction = false
}: UnitCardProps) => {
    const { t } = useTranslation();
    const isMonster = !unit.isPlayer;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN && !disableInteraction;

    // Ultimate Ready State
    const isUltimateReady = !isMonster && !unit.isDead && unit.currentSpirit >= 100;

    // Localized Name
    const displayName = isMonster
        ? t(`monsters.${unit.templateId}.name`, unit.name)
        : t(`companions.${unit.templateId}.name`, companionData?.name || unit.name);

    // Animation States
    const [animationClass, setAnimationClass] = useState('');
    const [shieldAnimClass, setShieldAnimClass] = useState('');
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; type: 'damage' | 'heal' | 'shield-damage' }[]>([]);
    const prevHealth = useRef(unit.currentHealth);
    const prevShield = useRef(unit.currentShield);
    const textIdCounter = useRef(0);

    // Watch for health and shield changes to trigger damage/heal effects
    useEffect(() => {
        // Health Changes
        const healthDiff = unit.currentHealth - prevHealth.current;
        if (healthDiff !== 0) {
            // Trigger Shake if damage
            if (healthDiff < 0) {
                setAnimationClass('anim-shake-damage');
            }

            // Add Floating Text
            const id = textIdCounter.current++;
            const text = healthDiff > 0 ? `+${healthDiff}` : `${healthDiff}`;
            const type = healthDiff > 0 ? 'heal' : 'damage';

            setFloatingTexts(prev => [...prev, { id, text, type }]);

            // Cleanup floating text after animation
            setTimeout(() => {
                setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
            }, 1000);

            // Cleanup shake class
            if (healthDiff < 0) {
                setTimeout(() => setAnimationClass(''), 500);
            }
        }
        prevHealth.current = unit.currentHealth;

        // Shield Changes
        const shieldDiff = unit.currentShield - prevShield.current;
        if (shieldDiff !== 0) {
            // Only show if damage (negative diff) - unless we want to show shield gain too?
            // Request said "if a monster damages the shield"
            if (shieldDiff < 0) {
                const id = textIdCounter.current++;
                const text = `${shieldDiff}`;
                const type = 'shield-damage';

                setFloatingTexts(prev => [...prev, { id, text, type }]);

                // Trigger Shield Absorb Animation
                setShieldAnimClass('shield-absorb-anim');
                setTimeout(() => setShieldAnimClass(''), 500);

                setTimeout(() => {
                    setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
                }, 1000);
            }
        }
        prevShield.current = unit.currentShield;
    }, [unit.currentHealth, unit.currentShield]);

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
                <div className={`shield-overlay-container ${shieldAnimClass}`}>
                    {/* Increased viewBox height to 34 to accommodate stroke and scale without clipping */}
                    <svg className="shield-svg" viewBox="0 0 24 34" preserveAspectRatio="none">
                        {/* 
                           Shield Shape: Wide top with corner points, curved sides to bottom point.
                           Two-tone effect: Left side lighter/darker than right side.
                        */}
                        <g transform="translate(12, 16) scale(1.1) translate(-12, -15)"> {/* Shifted center down slightly */}
                            {/* Full Shield Background (White Border) */}
                            <path
                                d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2.5"
                            />

                            {/* Left Half (Darker Blue) */}
                            <path
                                d="M12,29 Q2,24 2,12 L2,4 Q7,2.5 12,2 Z"
                                fill="#1e3a8a"
                            />

                            {/* Right Half (Lighter Blue) */}
                            <path
                                d="M12,29 Q22,24 22,12 L22,4 Q17,2.5 12,2 Z"
                                fill="#2563eb"
                            />
                        </g>
                    </svg>
                    <span className="shield-amount-text">{unit.currentShield}</span>
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

            {/* Ultimate Visual Effects Overlays */}
            {!isMonster && activeVisualEffect && (activeVisualEffect.includes('Protective Stance') || activeVisualEffect.includes('Village Squire')) && (
                <div className="vfx-large-shield-container">
                    <svg className="vfx-large-shield-svg" viewBox="0 0 24 34" preserveAspectRatio="none">
                        {/* Reuse same geometry but with glowy styles */}
                        <g transform="translate(12, 16) scale(1.1) translate(-12, -15)">
                            <path
                                d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                                fill="none"
                                stroke="#ffd700" /* Gold Stroke */
                                strokeWidth="1"
                            />
                            {/* Holographic Fill */}
                            <path
                                d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                                fill="rgba(30, 144, 255, 0.5)"
                            />
                            {/* Inner Light */}
                            <path
                                d="M12,29 Q2,24 2,12 L2,4 Q7,2.5 12,2 Z"
                                fill="rgba(255, 255, 255, 0.2)"
                            />
                        </g>
                    </svg>
                </div>
            )}
        </div>
    );
};
