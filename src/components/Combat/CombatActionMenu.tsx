import React from 'react';
import { useTranslation } from 'react-i18next';
import { soundManager, SoundType } from '../../utils/sound-manager';
import styles from './CombatActionMenu.module.css';
import { useCombatStore } from '../../stores/combat.store';
import { EnergyBar } from './EnergyBar';

export type CombatActionType = 'attack' | 'defend' | 'special' | 'recharge';

interface CombatActionMenuProps {
    onAction: (action: CombatActionType) => void;
    currentEnergy: number;
    disabled?: boolean;
    className?: string;
}

export const CombatActionMenu: React.FC<CombatActionMenuProps> = ({
    onAction,
    currentEnergy,
    disabled = false,
    className = ''
}) => {
    const { rechargedThisTurn } = useCombatStore();
    const { t } = useTranslation();

    // Mock costs for now
    const COSTS = {
        attack: 2,
        defend: 1,
        special: 5,
        recharge: 0 // recharge does not cost energy
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.energyDisplay}>
                <span className={styles.energyLabel}>{t('combat.stats.energy')}:</span>
                <EnergyBar current={currentEnergy} max={3} />
            </div>

            <button
                data-testid="attack-btn"
                className={`${styles.actionBtn} ${styles.attackBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('attack');
                }}
                disabled={disabled || currentEnergy < COSTS.attack}
                title={t('combat.action.attack_tooltip', { cost: COSTS.attack })}
            >
                <span className={styles.icon}>⚔️</span>
                <span className={styles.label}>{t('combat.action.attack')}</span>
                <span className={styles.cost}>{t('combat.action.energy_cost', { cost: COSTS.attack })}</span>
            </button>

            <button
                data-testid="defend-btn"
                className={`${styles.actionBtn} ${styles.defendBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.SHIELD);
                    onAction('defend');
                }}
                disabled={disabled || currentEnergy < COSTS.defend}
                title={t('combat.action.defend_tooltip', { cost: COSTS.defend })}
            >
                <span className={styles.icon}>🛡️</span>
                <span className={styles.label}>{t('combat.action.defend')}</span>
                <span className={styles.cost}>{t('combat.action.energy_cost', { cost: COSTS.defend })}</span>
            </button>

            <button
                data-testid="special-btn"
                className={`${styles.actionBtn} ${styles.specialBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('special');
                }}
                disabled={disabled || currentEnergy < COSTS.special}
                title={t('combat.action.special_tooltip', { cost: COSTS.special })}
            >
                <span className={styles.icon}>✨</span>
                <span className={styles.label}>{t('combat.action.special')}</span>
                <span className={styles.cost}>{t('combat.action.energy_cost', { cost: COSTS.special })}</span>
            </button>

            <button
                data-testid="recharge-btn"
                className={`${styles.actionBtn} ${styles.rechargeBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('recharge');
                }}
                disabled={disabled || currentEnergy > 0 || rechargedThisTurn}
                title={t('combat.action.recharge_tooltip')}
            >
                <span className={styles.icon}>🔋</span>
                <span className={styles.label}>{t('combat.action.recharge')}</span>
                <span className={styles.cost}>0</span>
            </button>
        </div>
    );
};

