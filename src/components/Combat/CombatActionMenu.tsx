import React from 'react';
import { useTranslation } from 'react-i18next';
import { soundManager, SoundType } from '../../utils/sound-manager';
import styles from './CombatActionMenu.module.css';
import { useCombatStore } from '../../stores/combat.store';
import { EnergyBar } from './EnergyBar';
import { InlineRecharge } from './InlineRecharge';
import type { MathProblem } from '../../types/math.types';

export type CombatActionType = 'attack' | 'defend' | 'special';

interface CombatActionMenuProps {
    onAction: (action: CombatActionType) => void;
    disabled?: boolean;
    className?: string;
    // Inline recharge props
    showInlineRecharge?: boolean;
    rechargeProblem?: MathProblem | null;
    rechargeModule?: CombatActionType | null;
    onRechargeSubmit?: (answer: number) => void;
}

export const CombatActionMenu: React.FC<CombatActionMenuProps> = ({
    onAction,
    disabled = false,
    className = '',
    showInlineRecharge = false,
    rechargeProblem = null,
    rechargeModule = null,
    onRechargeSubmit
}) => {
    const { player } = useCombatStore();
    const { t } = useTranslation();

    const modules = player.modules;

    // Show inline recharge if needed
    if (showInlineRecharge && rechargeProblem && rechargeModule && onRechargeSubmit) {
        return (
            <div className={`${styles.container} ${className}`}>
                <InlineRecharge
                    problem={rechargeProblem}
                    onSubmit={onRechargeSubmit}
                    moduleType={rechargeModule}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className}`}>
            <button
                data-testid="attack-btn"
                className={`${styles.actionBtn} ${styles.attackBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('attack');
                }}
                disabled={disabled}
                title={t('combat.action.attack_tooltip')}
            >
                <span className={styles.icon}>⚔️</span>
                <span className={styles.label}>{t('combat.action.attack')}</span>
                <EnergyBar current={modules.attack.currentEnergy} max={modules.attack.maxEnergy} />
            </button>

            <button
                data-testid="defend-btn"
                className={`${styles.actionBtn} ${styles.defendBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.SHIELD);
                    onAction('defend');
                }}
                disabled={disabled}
                title={t('combat.action.defend_tooltip')}
            >
                <span className={styles.icon}>🛡️</span>
                <span className={styles.label}>{t('combat.action.defend')}</span>
                <EnergyBar current={modules.defend.currentEnergy} max={modules.defend.maxEnergy} />
            </button>

            <button
                data-testid="special-btn"
                className={`${styles.actionBtn} ${styles.specialBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('special');
                }}
                disabled={disabled}
                title={t('combat.action.special_tooltip')}
            >
                <span className={styles.icon}>✨</span>
                <span className={styles.label}>{t('combat.action.special')}</span>
                <EnergyBar current={modules.special.currentEnergy} max={modules.special.maxEnergy} />
            </button>
        </div>
    );
};

