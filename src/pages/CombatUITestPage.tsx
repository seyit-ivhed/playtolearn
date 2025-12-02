import React, { useState } from 'react';
import { HealthGauge } from '../components/combat/HealthGauge';
import { CombatActionMenu, type CombatActionType } from '../components/combat/CombatActionMenu';
import { CombatLog } from '../components/combat/CombatLog';
import { EntitySprite } from '../components/combat/EntitySprite';
import styles from './CombatUITestPage.module.css';

export const CombatUITestPage: React.FC = () => {
    // Mock State
    const [playerHealth, setPlayerHealth] = useState(100);
    const [playerShield, setPlayerShield] = useState(50);
    const [playerEnergy, setPlayerEnergy] = useState(10);
    const [enemyHealth, setEnemyHealth] = useState(200);

    const [playerHit, setPlayerHit] = useState(false);
    const [enemyHit, setEnemyHit] = useState(false);

    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, msg]);
    };

    const handleAction = (action: CombatActionType) => {
        addLog(`Player chose: ${action.toUpperCase()}`);

        if (action === 'attack') {
            setEnemyHit(true);
            setEnemyHealth(h => Math.max(0, h - 20));
            setPlayerEnergy(e => e - 2);
            addLog('Player attacks for 20 damage!');
            setTimeout(() => setEnemyHit(false), 500);
        } else if (action === 'defend') {
            setPlayerShield(s => Math.min(100, s + 20));
            setPlayerEnergy(e => e - 1);
            addLog('Player reinforces shields!');
        } else if (action === 'special') {
            setPlayerHealth(h => Math.min(100, h + 30));
            setPlayerEnergy(e => e - 5);
            addLog('Player repairs hull!');
        }
    };

    const handleEnemyAttack = () => {
        setPlayerHit(true);
        const damage = 15;

        if (playerShield > 0) {
            const shieldDmg = Math.min(playerShield, damage);
            const hullDmg = damage - shieldDmg;
            setPlayerShield(s => s - shieldDmg);
            setPlayerHealth(h => h - hullDmg);
            addLog(`Enemy hits shield for ${shieldDmg} and hull for ${hullDmg}!`);
        } else {
            setPlayerHealth(h => h - damage);
            addLog(`Enemy hits hull for ${damage}!`);
        }

        setTimeout(() => setPlayerHit(false), 500);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Combat UI Test Lab</h1>
                <p>Testing individual components in isolation</p>
            </header>

            <div className={styles.battlefield}>
                {/* Player Side */}
                <div className={styles.entityColumn}>
                    <HealthGauge
                        current={playerHealth}
                        max={100}
                        shield={playerShield}
                        maxShield={100}
                        label="Player Ship"
                    />
                    <EntitySprite type="player" isHit={playerHit} />
                    <div>Energy: {playerEnergy}</div>
                </div>

                {/* Enemy Side */}
                <div className={styles.entityColumn}>
                    <HealthGauge
                        current={enemyHealth}
                        max={200}
                        label="Space Pirate"
                    />
                    <EntitySprite type="enemy" isHit={enemyHit} />
                </div>
            </div>

            <div className={styles.controls}>
                <CombatActionMenu
                    onAction={handleAction}
                    currentEnergy={playerEnergy}
                />

                <CombatLog logs={logs} />

                <div className={styles.debugControls}>
                    <button className={styles.debugBtn} onClick={handleEnemyAttack}>
                        Simulate Enemy Attack
                    </button>
                    <button className={styles.debugBtn} onClick={() => setPlayerEnergy(e => Math.min(10, e + 2))}>
                        Add Energy
                    </button>
                    <button className={styles.debugBtn} onClick={() => setLogs([])}>
                        Clear Log
                    </button>
                </div>
            </div>
        </div>
    );
};
