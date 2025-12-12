import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CombatPhase } from '../../../types/combat.types';
import styles from './TurnAnnouncer.module.css';

interface TurnAnnouncerProps {
    phase: CombatPhase;
}

export const TurnAnnouncer = ({ phase }: TurnAnnouncerProps) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<string | null>(null);
    const [key, setKey] = useState(0); // Force re-render for animation

    useEffect(() => {
        if (phase === CombatPhase.PLAYER_TURN) {
            setMessage(t('combat.turn.player', 'Your Turn'));
            setKey(prev => prev + 1);
        } else if (phase === CombatPhase.MONSTER_TURN) {
            setMessage(t('combat.turn.enemy', 'Enemy Turn'));
            setKey(prev => prev + 1);
        } else {
            // Victory/Defeat or other phases - don't show turn banner
            // or maybe we want to keep it empty so it unmounts naturally if we handled that
            setMessage(null);
        }
    }, [phase, t]);

    if (!message) return null;

    return (
        <div key={key} className={styles.container}>
            <div className={`${styles.banner} ${phase === CombatPhase.PLAYER_TURN ? styles.playerTurn : styles.enemyTurn}`}>
                <h2 className={styles.text}>{message}</h2>
            </div>
        </div>
    );
};
