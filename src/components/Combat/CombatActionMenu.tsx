import React from 'react';
import { soundManager, SoundType } from '../../utils/sound-manager';
import styles from './CombatActionMenu.module.css';
import { useCombatStore } from '../../stores/combat.store';
import { EnergyBar } from './EnergyBar';
import { InlineRecharge } from './InlineRecharge';
import type { MathProblem } from '../../types/math.types';
import { getModuleById } from '../../data/modules.data';

interface CombatActionMenuProps {
    onAction: (moduleId: string) => void;
    disabled?: boolean;
    className?: string;
    // Inline recharge props
    showInlineRecharge?: boolean;
    rechargeProblem?: MathProblem | null;
    rechargeModuleId?: string | null;
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
    rechargeModuleId = null,
    onRechargeSubmit
}) => {
    const { player } = useCombatStore();

    const equippedModules = player.equippedModules;

    // Show inline recharge if needed
    if (showInlineRecharge && rechargeProblem && rechargeModuleId && onRechargeSubmit) {
        return (
            <div className={`${styles.container} ${className}`}>
                <InlineRecharge
                    problem={rechargeProblem}
                    onSubmit={onRechargeSubmit}
                    moduleId={rechargeModuleId}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className}`}>
            {equippedModules.map((moduleInstance) => {
                const module = getModuleById(moduleInstance.moduleId);
                if (!module) return null;

                const icon = BEHAVIOR_ICONS[moduleInstance.combatAction] || '❓';
                const sound = BEHAVIOR_SOUNDS[moduleInstance.combatAction] || SoundType.BUTTON_CLICK;
                const behaviorClass = `behavior${moduleInstance.combatAction}`;

                return (
                    <button
                        key={moduleInstance.moduleId}
                        data-testid={`module-btn-${moduleInstance.moduleId}`}
                        data-behavior={moduleInstance.combatAction}
                        className={`${styles.actionBtn} ${styles[behaviorClass] || ''}`}
                        onClick={() => {
                            soundManager.playSound(sound);
                            onAction(moduleInstance.moduleId);
                        }}
                        disabled={disabled}
                        title={module.description}
                    >
                        <span className={styles.icon}>{icon}</span>
                        <span className={styles.label}>{module.name}</span>
                        <EnergyBar
                            current={moduleInstance.currentEnergy}
                            max={moduleInstance.maxEnergy}
                        />
                    </button>
                );
            })}
        </div>
    );
};
