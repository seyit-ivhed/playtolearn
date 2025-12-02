import React from 'react';
import { soundManager, SoundType } from '../../utils/sound-manager';
import styles from './CombatActionMenu.module.css';

export type CombatActionType = 'attack' | 'defend' | 'special';

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
    // Mock costs for now
    const COSTS = {
        attack: 2,
        defend: 1,
        special: 5
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <button
                data-testid="attack-btn"
                className={`${styles.actionBtn} ${styles.attackBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('attack');
                }}
                disabled={disabled || currentEnergy < COSTS.attack}
                title={`Attack (Cost: ${COSTS.attack})`}
            >
                <span className={styles.icon}>⚔️</span>
                <span className={styles.label}>Attack</span>
                <span className={styles.cost}>{COSTS.attack} Energy</span>
            </button>

            <button
                data-testid="defend-btn"
                className={`${styles.actionBtn} ${styles.defendBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.SHIELD);
                    onAction('defend');
                }}
                disabled={disabled || currentEnergy < COSTS.defend}
                title={`Defend (Cost: ${COSTS.defend})`}
            >
                <span className={styles.icon}>🛡️</span>
                <span className={styles.label}>Defend</span>
                <span className={styles.cost}>{COSTS.defend} Energy</span>
            </button>

            <button
                data-testid="special-btn"
                className={`${styles.actionBtn} ${styles.specialBtn}`}
                onClick={() => {
                    soundManager.playSound(SoundType.BUTTON_CLICK);
                    onAction('special');
                }}
                disabled={disabled || currentEnergy < COSTS.special}
                title={`Special (Cost: ${COSTS.special})`}
            >
                <span className={styles.icon}>✨</span>
                <span className={styles.label}>Special</span>
                <span className={styles.cost}>{COSTS.special} Energy</span>
            </button>
        </div>
    );
};
