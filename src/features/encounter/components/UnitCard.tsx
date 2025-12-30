import { type EncounterUnit, EncounterPhase } from '../../../types/encounter.types';
import { getCompanionById } from '../../../data/companions.data';
import './UnitCard.css';
import '../encounter-animations.css';
import { useTranslation } from 'react-i18next';
import { MathCardFace } from './MathCardFace';
import type { MathProblem } from '../../../types/math.types';
import { FloatingTextOverlay } from './FloatingTextOverlay';
import { UnitNameBadge } from './UnitNameBadge';
import { UnitCardImage } from './UnitCardImage';
import { AbilityCard } from './AbilityCard';
import { HealthBar } from './HealthBar';
import { useGameStore } from '../../../stores/game/store';
import { UnitCardShield } from './UnitCardShield';
import { UnitCardVFX } from './UnitCardVFX';
import { UnitLevelBadge } from './UnitLevelBadge';
import { useUnitCardAnimations } from '../hooks/useUnitCardAnimations';

interface UnitCardProps {
    unit: EncounterUnit;
    phase: EncounterPhase;
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

    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === EncounterPhase.PLAYER_TURN && !disableInteraction;
    const isUltimateReady = !isMonster && !unit.isDead && unit.currentSpirit >= 100;

    const displayName = isMonster
        ? t(`monsters.${unit.templateId}.name`, unit.name)
        : t(`companions.${unit.templateId}.name`, unit.name);

    const {
        animationClass,
        setAnimationClass,
        shieldAnimClass,
        floatingTexts
    } = useUnitCardAnimations(unit, isMonster);

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isMonster || disableInteraction || isFlipped || !!mathProblem) return;
        if (!canAct) return;

        if (unit.currentSpirit >= 100) {
            setAnimationClass('anim-pulse-ultimate');
        } else {
            setAnimationClass('anim-lunge-right');
        }
        setTimeout(() => setAnimationClass(''), 500);

        onAct?.();
    };

    const getCardClasses = () => {
        const classes = ['unit-card', animationClass];

        if (unit.isBoss) classes.push('is-boss');
        if (isUltimateReady) classes.push('ultimate-ready-glow');
        if (isFlipped) classes.push('is-flipped');

        if (isMonster) {
            if (unit.isBoss) {
                classes.push('border-boss');
            } else {
                classes.push('border-red');
            }
        } else {
            classes.push('border-brown');
        }

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

    const activeCompanionStats = useGameStore(state =>
        !isMonster ? state.companionStats[unit.templateId] : null
    );

    const level = activeCompanionStats?.level || companionData?.level || 1;

    return (
        <div
            className={getCardClasses()}
            onClick={handleCardClick}
            data-testid={`unit-card-${unit.id}`}
            data-unit-id={unit.id}
        >
            <FloatingTextOverlay floatingTexts={floatingTexts} />
            <UnitNameBadge displayName={displayName} />

            {!isMonster && !isFlipped && <UnitLevelBadge level={level} />}

            <div className="unit-card-front">
                <UnitCardImage
                    isMonster={isMonster}
                    companionData={companionData}
                    image={unit.image}
                    displayName={displayName}
                />

                <div className="card-spacer" />

                <div className="unit-info-bottom">
                    {(companionData || isMonster) && (
                        <AbilityCard
                            abilityName={
                                isUltimateReady && unit.specialAbilityId
                                    ? t(`abilities.${unit.specialAbilityId}.name`)
                                    : t('companions.stats.attack')
                            }
                            abilityDescription={
                                isUltimateReady && unit.specialAbilityId
                                    ? t(`abilities.${unit.specialAbilityId}.description`, { value: unit.specialAbilityValue })
                                    : ''
                            }
                            progress={unit.currentSpirit}
                            isUltimateReady={isUltimateReady}
                            isSimplified={isMonster || !isUltimateReady}
                            isMonster={isMonster}
                            power={unit.damage || 10}
                        />
                    )}

                    <HealthBar
                        currentHealth={unit.currentHealth}
                        maxHealth={unit.maxHealth}
                        isMonster={isMonster}
                    />
                </div>
            </div>

            <UnitCardShield
                currentShield={unit.currentShield}
                animationClass={shieldAnimClass}
            />

            {
                mathProblem && onMathAnswer && (
                    <MathCardFace
                        problem={mathProblem}
                        abilityName={companionData?.specialAbility ? t(`companions.${unit.templateId}.special_ability_name`) : t('companions.stats.attack')}
                        onAnswer={onMathAnswer}
                    />
                )
            }

            <UnitCardVFX activeVisualEffect={activeVisualEffect} />

            {/* Sleeping/Resting State Indicator */}
            {unit.hasActed && !unit.isDead && !isMonster && (
                <div className="zzz-container">
                    <div className="zzz-icon zzz-1">Z</div>
                    <div className="zzz-icon zzz-2">Z</div>
                    <div className="zzz-icon zzz-3">Z</div>
                </div>
            )}

        </div>
    );
};
