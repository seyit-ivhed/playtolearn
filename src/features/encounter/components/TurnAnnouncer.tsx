import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EncounterPhase } from '../../../types/encounter.types';
import styles from './TurnAnnouncer.module.css';

interface TurnAnnouncerProps {
    phase: EncounterPhase;
    onVisibilityChange?: (isVisible: boolean) => void;
}

export const TurnAnnouncer = ({ phase, onVisibilityChange }: TurnAnnouncerProps) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<string | null>(null);
    const [key, setKey] = useState(0); // Force re-render for animation

    useEffect(() => {
        if (phase === EncounterPhase.PLAYER_TURN) {
            setMessage(t('encounter.turn.player', 'Your Turn'));
            setKey(prev => prev + 1);
            onVisibilityChange?.(true);

            // Hide after 2 seconds (animation duration)
            setTimeout(() => {
                onVisibilityChange?.(false);
            }, 2000);
        } else if (phase === EncounterPhase.MONSTER_TURN) {
            setMessage(t('encounter.turn.enemy', 'Enemy Turn'));
            setKey(prev => prev + 1);
            onVisibilityChange?.(true);

            // Hide after 2 seconds (animation duration)
            setTimeout(() => {
                onVisibilityChange?.(false);
            }, 2000);
        } else {
            // Victory/Defeat or other phases - don't show turn banner
            setMessage(null);
            onVisibilityChange?.(false);
        }
    }, [phase, t, onVisibilityChange]);

    if (!message) return null;

    return (
        <div key={key} className={styles.container}>
            <div className={`${styles.banner} ${phase === EncounterPhase.PLAYER_TURN ? styles.playerTurn : styles.enemyTurn}`}>
                <h2 className={styles.text}>{message}</h2>
            </div>
        </div>
    );
};
