import type { CombatEntity } from '../../types/combat.types';
import { CombatPhase } from '../../types/combat.types';
import { EntitySprite } from './EntitySprite';
import { HealthGauge } from './HealthGauge';
import { getCompanionById } from '../../data/companions.data';
import styles from '../../pages/CombatPage.module.css';

interface CombatArenaProps {
    player: CombatEntity;
    enemy: CombatEntity;
    phase: CombatPhase;
}


export function CombatArena({ player, enemy, phase }: CombatArenaProps) {
    return (
        <>
            {/* Player Zone - Party Members */}
            <div className={styles.playerZone}>
                <div style={{ width: '100%', marginBottom: '1rem' }}>
                    <HealthGauge
                        current={player.currentHealth}
                        max={player.maxHealth}
                        shield={player.currentShield}
                        maxShield={player.maxShield}
                        label="Party Health"
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                    {player.equippedCompanions.length > 0 ? (
                        player.equippedCompanions.map((compInstance) => {
                            const compData = getCompanionById(compInstance.companionId);
                            return (
                                <div key={compInstance.companionId} className={styles.combatant} style={{ flexDirection: 'row', gap: '1rem', justifyContent: 'flex-start' }}>
                                    <EntitySprite
                                        type="player"
                                        isHit={phase === CombatPhase.ENEMY_ACTION} // Simplification: whole party flashes on hit for now
                                        imageSrc={compData?.icon} // Use icon if available
                                        className={styles.partyMemberSprite}
                                    />
                                    <div style={{ color: 'white', textShadow: '0 2px 4px black' }}>
                                        <div style={{ fontWeight: 'bold' }}>{compData?.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Energy: {compInstance.currentEnergy}/{compInstance.maxEnergy}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // Fallback if no companions equipped (shouldn't happen in normal flow but good for safety)
                        <div className={styles.combatant}>
                            <EntitySprite
                                type="player"
                                isHit={phase === CombatPhase.ENEMY_ACTION}
                                imageSrc={player.sprite}
                            />
                            <div>Commander</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Zone - Action/Effects Area */}
            <div className={styles.centerZone}>
                {/* Could place current action text or VS logo here if desired */}
            </div>

            {/* Enemy Zone */}
            <div className={styles.enemyZone}>
                <div className={styles.combatant}>
                    <HealthGauge
                        current={enemy.currentHealth}
                        max={enemy.maxHealth}
                        shield={enemy.currentShield}
                        maxShield={enemy.maxShield}
                        label={enemy.name}
                        testId="enemy-name"
                    />
                    <EntitySprite
                        type="enemy"
                        isHit={phase === CombatPhase.PLAYER_ACTION}
                        imageSrc={enemy.sprite}
                        className={styles.enemyShip}
                    />
                </div>
            </div>
        </>
    );
}
