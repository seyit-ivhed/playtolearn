import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EncounterPhase } from '../../../types/encounter.types';
import styles from './TurnAnnouncer.module.css';

interface TurnAnnouncerProps {
    phase: EncounterPhase;
    onVisibilityChange?: (isVisible: boolean) => void;
}

export const TurnAnnouncer = ({ phase, onVisibilityChange }: TurnAnnouncerProps) => {
    const { t } = useTranslation();

    // Side effects for visibility
    useEffect(() => {
        if (phase === EncounterPhase.PLAYER_TURN || phase === EncounterPhase.MONSTER_TURN) {
            onVisibilityChange?.(true);
            const timer = setTimeout(() => {
                onVisibilityChange?.(false);
            }, 1600);
            return () => clearTimeout(timer);
        } else {
            onVisibilityChange?.(false);
        }
    }, [phase, onVisibilityChange]);

    const message = phase === EncounterPhase.PLAYER_TURN
        ? t('combat.turn.player', 'Your Turn')
        : phase === EncounterPhase.MONSTER_TURN
            ? t('combat.turn.enemy', 'Enemy Turn')
            : null;

    if (!message) return null;

    return (
        <div key={phase} className={styles.container}>
            <div className={`${styles.banner} ${phase === EncounterPhase.PLAYER_TURN ? styles.playerTurn : styles.enemyTurn}`}>
                <h2 className={styles.text}>{message}</h2>
            </div>
        </div>
    );
};
