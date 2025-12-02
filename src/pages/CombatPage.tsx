import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { useMissionStore } from '../stores/mission.store';
import { useInventoryStore } from '../stores/inventory.store';
import { CombatPhase } from '../types/combat.types';
import { CombatActionMenu, type CombatActionType } from '../components/Combat/CombatActionMenu';
import { CombatLog } from '../components/Combat/CombatLog';
import { RewardSummary } from '../components/Mission/RewardSummary';
import { CombatArena } from '../components/Combat/CombatArena';
import { MathChallengeModal } from '../components/Combat/MathChallengeModal';
import { VictoryScreen } from '../components/Combat/VictoryScreen';
import { DefeatScreen } from '../components/Combat/DefeatScreen';
import { ScreenShake } from '../components/Combat/ScreenShake';
import { ParticleEffect } from '../components/Combat/ParticleEffect';
import { FloatingDamage } from '../components/Combat/FloatingDamage';
import { AudioSettings } from '../components/common/AudioSettings';
import { decideEnemyAction } from '../utils/enemy-ai';
import { getMissionById } from '../data/missions.data';
import { useMissionNavigation } from '../hooks/useMissionNavigation';
import { useCombatEntitySetup } from '../hooks/useCombatEntitySetup';
import { useCombatActions } from '../hooks/useCombatActions';
import { soundManager, SoundType } from '../utils/sound-manager';
import styles from './CombatPage.module.css';

export default function CombatPage() {
    const [searchParams] = useSearchParams();
    const missionId = searchParams.get('missionId');
    const { navigateToMissionSelect } = useMissionNavigation();

    const { phase, player, enemy, combatLog, lastDamageEvent, initializeCombat, enemyTurn } = useCombatStore();
    const { currentProblem } = useMathStore();
    const { completeMission } = useMissionStore();
    const { unlockModule } = useInventoryStore();
    const { createCombatEntities } = useCombatEntitySetup();
    const { handleActionSelect, handleMathSubmit, showMathModal } = useCombatActions();

    const currentMission = getMissionById(missionId || '1');
    const [showRewards, setShowRewards] = useState(false);
    const [shakeTrigger, setShakeTrigger] = useState(0);
    const [particleTrigger, setParticleTrigger] = useState<{ x: number; y: number; type: 'explosion' | 'hit'; timestamp: number } | null>(null);

    // Initialize combat on mount
    useEffect(() => {
        // If no mission ID or invalid, redirect to mission select
        if (!missionId || !currentMission) {
            navigateToMissionSelect();
            return;
        }

        const { playerStats, enemyStats } = createCombatEntities(currentMission);
        initializeCombat(playerStats, enemyStats);
    }, [missionId]);

    // Handle enemy turn automatically
    useEffect(() => {
        if (phase === CombatPhase.ENEMY_ACTION) {
            setTimeout(() => {
                const action = decideEnemyAction(enemy, player);
                soundManager.playSound(SoundType.LASER);
                enemyTurn(action);
            }, 1500);
        }
    }, [phase, enemyTurn]);

    // Handle visual effects on damage
    useEffect(() => {
        if (lastDamageEvent && lastDamageEvent.timestamp > 0) {
            // Trigger screen shake
            setShakeTrigger(lastDamageEvent.timestamp);

            // Play sound effect
            if (lastDamageEvent.target === 'enemy') {
                soundManager.playSound(SoundType.HIT);
            } else {
                soundManager.playSound(SoundType.HIT);
            }

            // Trigger particle effect at entity position
            const x = lastDamageEvent.target === 'enemy' ? 600 : 200;
            const y = 300;
            setParticleTrigger({
                x,
                y,
                type: lastDamageEvent.amount > 15 ? 'explosion' : 'hit',
                timestamp: lastDamageEvent.timestamp,
            });
        }
    }, [lastDamageEvent]);

    // Play victory/defeat sounds
    useEffect(() => {
        if (phase === CombatPhase.VICTORY) {
            soundManager.playSound(SoundType.VICTORY);
        } else if (phase === CombatPhase.DEFEAT) {
            soundManager.playSound(SoundType.DEFEAT);
        }
    }, [phase]);

    const handleRetry = () => {
        if (!currentMission) return;

        const { playerStats, enemyStats } = createCombatEntities(currentMission);
        initializeCombat(playerStats, enemyStats);
        setShowRewards(false);
    };

    const handleCollectRewards = () => {
        if (!currentMission) return;

        completeMission(currentMission.id);
        if (currentMission.rewards.unlocksModuleId) {
            unlockModule(currentMission.rewards.unlocksModuleId);
        }
        setShowRewards(true);
    };

    const getBackgroundClass = () => {
        if (!currentMission) return styles.trainingBackground;
        // Missions 1-2 use training background, 3+ use deep space
        return currentMission.difficulty <= 2 ? styles.trainingBackground : styles.deepSpaceBackground;
    };

    return (
        <div className={`${styles.container} ${getBackgroundClass()}`} data-testid="combat-page">
            <div className={styles.header}>
                <h2 data-testid="combat-title">Combat Simulation</h2>
                <div className={styles.headerControls}>
                    <AudioSettings />
                    <Link to="/mission-select" className={styles.abortLink}>Abort Mission</Link>
                </div>
            </div>

            {/* Screen Shake Wrapper */}
            <ScreenShake intensity="medium" trigger={shakeTrigger}>
                {/* Combat Arena */}
                <CombatArena player={player} enemy={enemy} phase={phase} />

                {/* Particle Effects */}
                {particleTrigger && (
                    <ParticleEffect
                        x={particleTrigger.x}
                        y={particleTrigger.y}
                        type={particleTrigger.type}
                        trigger={particleTrigger.timestamp}
                    />
                )}

                {/* Floating Damage Numbers */}
                {lastDamageEvent && (
                    <FloatingDamage
                        trigger={{
                            value: lastDamageEvent.amount,
                            type: 'damage',
                            x: lastDamageEvent.target === 'enemy' ? 600 : 200,
                            y: 300,
                            timestamp: lastDamageEvent.timestamp,
                        }}
                    />
                )}
            </ScreenShake>

            {/* Combat Log */}
            <CombatLog logs={combatLog} />

            {/* Action Menu */}
            {phase === CombatPhase.PLAYER_INPUT && (
                <CombatActionMenu
                    onAction={(actionType: CombatActionType) => {
                        if (actionType === 'attack') {
                            handleActionSelect({ type: 'ATTACK', value: 10 });
                        } else if (actionType === 'defend') {
                            handleActionSelect({ type: 'DEFEND', value: 10 });
                        }
                    }}
                    currentEnergy={player.currentEnergy}
                />
            )}

            {/* Math Challenge Modal */}
            <MathChallengeModal
                isOpen={showMathModal}
                problem={currentProblem}
                onSubmit={handleMathSubmit}
            />

            {/* Victory Screen */}
            {phase === CombatPhase.VICTORY && !showRewards && (
                <VictoryScreen
                    enemyName={enemy.name}
                    onCollectRewards={handleCollectRewards}
                />
            )}

            {/* Reward Summary */}
            {phase === CombatPhase.VICTORY && showRewards && currentMission && (
                <div className={styles.endScreen}>
                    <div className={styles.endScreenContent}>
                        <RewardSummary
                            rewards={currentMission.rewards}
                            onNext={navigateToMissionSelect}
                            onReturn={navigateToMissionSelect}
                        />
                    </div>
                </div>
            )}

            {/* Defeat Screen */}
            {phase === CombatPhase.DEFEAT && (
                <DefeatScreen
                    onRetry={handleRetry}
                    onReturn={navigateToMissionSelect}
                />
            )}
        </div>
    );
}
