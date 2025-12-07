import React from 'react';
import { soundManager, SoundType } from '../../utils/sound-manager';
import styles from './CombatActionMenu.module.css';
import { useCombatStore } from '../../stores/combat.store';
import { EnergyBar } from './EnergyBar';
import { InlineRecharge } from './InlineRecharge';
import type { MathProblem } from '../../types/math.types';
import { getCompanionById } from '../../data/companions.data';

interface CombatActionMenuProps {
    onAction: (companionId: string) => void;
    disabled?: boolean;
    className?: string;
    // Inline recharge props
    showInlineRecharge?: boolean;
    rechargeProblem?: MathProblem | null;
    rechargeCompanionId?: string | null;
    onRechargeSubmit?: (answer: number) => void;
}

// Map combat behaviors to icons
const BEHAVIOR_ICONS: Record<string, string> = {
    'ATTACK': '⚔️',
    'DEFEND': '🛡️',
    'HEAL': '❤️',
    'SPECIAL': '✨'
};

// Map combat behaviors to sound effects
const BEHAVIOR_SOUNDS: Record<string, any> = {
    'ATTACK': SoundType.BUTTON_CLICK,
    'DEFEND': SoundType.SHIELD,
    'HEAL': SoundType.BUTTON_CLICK,
    'SPECIAL': SoundType.BUTTON_CLICK
};

export const CombatActionMenu: React.FC<CombatActionMenuProps> = ({
    onAction,
    disabled = false,
    className = '',
    showInlineRecharge = false,
    rechargeProblem = null,
    rechargeCompanionId = null,
    onRechargeSubmit
}) => {
    const { player } = useCombatStore();

    const equippedCompanions = player.equippedCompanions;

    // Show inline recharge if needed
    if (showInlineRecharge && rechargeProblem && rechargeCompanionId && onRechargeSubmit) {
        return (
            <div className={`${styles.container} ${className}`}>
                <InlineRecharge
                    problem={rechargeProblem}
                    onSubmit={onRechargeSubmit}
                    companionId={rechargeCompanionId}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className}`}>
            {equippedCompanions.map((companionInstance) => {
                const companion = getCompanionById(companionInstance.companionId);
                if (!companion) return null;

                const icon = BEHAVIOR_ICONS[companionInstance.combatAction] || '❓';
                const sound = BEHAVIOR_SOUNDS[companionInstance.combatAction] || SoundType.BUTTON_CLICK;
                const behaviorClass = `behavior${companionInstance.combatAction}`;

                return (
                    <button
                        key={companionInstance.companionId}
                        data-testid={`companion-btn-${companionInstance.companionId}`}
                        data-behavior={companionInstance.combatAction}
                        className={`${styles.actionBtn} ${styles[behaviorClass] || ''}`}
                        onClick={() => {
                            soundManager.playSound(sound);
                            onAction(companionInstance.companionId);
                        }}
                        disabled={disabled}
                        title={companion.description}
                    >
                        <span className={styles.icon}>{icon}</span>
                        <span className={styles.label}>{companion.name}</span>
                        <EnergyBar
                            current={companionInstance.currentEnergy}
                            max={companionInstance.maxEnergy}
                        />
                    </button>
                );
            })}
        </div>
    );
};
