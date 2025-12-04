import type { CombatEntity } from '../../types/combat.types';
import { CombatPhase } from '../../types/combat.types';
import { EntitySprite } from './EntitySprite';
import { HealthGauge } from './HealthGauge';
import styles from '../../pages/CombatPage.module.css';

interface CombatArenaProps {
    player: CombatEntity;
    enemy: CombatEntity;
    phase: CombatPhase;
}

export function CombatArena({ player, enemy, phase }: CombatArenaProps) {
    return (
        <div className={styles.arena}>
            {/* Player */}
            <div className={styles.combatant}>
                <EntitySprite
                    type="player"
                    isHit={phase === CombatPhase.ENEMY_ACTION}
                    imageSrc={player.sprite}
                />
                <HealthGauge
                    current={player.currentHealth}
                    max={player.maxHealth}
                    shield={player.currentShield}
                    maxShield={player.maxShield}
                    label={player.name}
                />
            </div>

            {/* VS */}
            <div className={styles.vsContainer}>
                <span className={styles.vsText}>VS</span>
            </div>

            {/* Enemy */}
            <div className={styles.combatant}>
                <EntitySprite
                    type="enemy"
                    isHit={phase === CombatPhase.PLAYER_ACTION}
                    imageSrc={enemy.sprite}
                />
                <HealthGauge
                    current={enemy.currentHealth}
                    max={enemy.maxHealth}
                    shield={enemy.currentShield}
                    maxShield={enemy.maxShield}
                    label={enemy.name}
                    testId="enemy-name"
                />
            </div>
        </div>
    );
}
