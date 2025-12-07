import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { useMissionStore } from '../stores/mission.store';
import { useInventoryStore } from '../stores/inventory.store';
import { CombatPhase } from '../types/combat.types';
import { CombatActionMenu } from '../components/Combat/CombatActionMenu';
import { CombatLog } from '../components/Combat/CombatLog';
import { RewardSummary } from '../components/Mission/RewardSummary';
import { CombatArena } from '../components/Combat/CombatArena';
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
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const missionId = searchParams.get('missionId');
    const { navigateToMissionSelect } = useMissionNavigation();

    const { phase, player, enemy, combatLog, lastDamageEvent, initializeCombat, enemyTurn } = useCombatStore();
    const { currentProblem } = useMathStore();
    const { completeMission } = useMissionStore();
    const { unlockCompanion } = useInventoryStore();
    const { createCombatEntities } = useCombatEntitySetup();
    const { handleActionSelect, handleMathSubmit, showInlineRecharge, pendingRechargeCompanion } = useCombatActions();

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
        console.log('CombatPage phase:', phase);
        if (phase === CombatPhase.ENEMY_ACTION) {
            setTimeout(() => {
                console.log('Executing enemy turn');
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
            // Approximate positions for new wide layout
            const x = lastDamageEvent.target === 'enemy' ? 1200 : 300;
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
            unlockCompanion(currentMission.rewards.unlocksModuleId);
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
                <h2 data-testid="combat-title">{t('combat_simulation')}</h2>
                <div className={styles.headerControls}>
                    <AudioSettings />
                    <Link to="/mission-select" className={styles.abortLink}>{t('abort_mission')}</Link>
                </div>
            </div>

            {/* Main Combat Area with Shake Effect */}
            <ScreenShake intensity="medium" trigger={shakeTrigger} className={styles.combatBody}>
                {/* Combat Arena (Grid Items: Player, Center, Enemy) */}
                <CombatArena player={player} enemy={enemy} phase={phase} />

                {/* Visual Effects Layer (Absolute or Overlay) */}
                {/* We map effects to the grid or use coordinates relative to this container? 
                    Particle/FloatingDamage use absolute positioning based on pixels currently (200/600).
                    We might need to update those coordinates later as layout is now fluid. 
                    For now, they are children of restricted positioned elements? No, ScreenShake is relative.
                    So X/Y need to match the new positions. 
                    TODO: Update effect coordinates in logic later or rely on current approximation.
                */}
                {particleTrigger && (
                    <ParticleEffect
                        x={particleTrigger.x}
                        y={particleTrigger.y}
                        type={particleTrigger.type}
                        trigger={particleTrigger.timestamp}
                    />
                )}
                {lastDamageEvent && (
                    <FloatingDamage
                        trigger={{
                            value: lastDamageEvent.amount,
                            type: 'damage',
                            x: lastDamageEvent.target === 'enemy' ? 1200 : 300, // Aligned with new layout
                            y: 300,
                            timestamp: lastDamageEvent.timestamp,
                        }}
                    />
                )}
            </ScreenShake>

            {/* Bottom/Overlay UI Layer */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 10 }}>
                <CombatLog logs={combatLog} />
            </div>

            {/* Action Menu (Centered Bottom) */}
            {phase === CombatPhase.PLAYER_INPUT && (
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                    <CombatActionMenu
                        onAction={(companionId: string) => {
                            handleActionSelect(companionId);
                        }}
                        showInlineRecharge={showInlineRecharge}
                        rechargeProblem={currentProblem}
                        rechargeCompanionId={pendingRechargeCompanion}
                        onRechargeSubmit={handleMathSubmit}
                    />
                </div>
            )}

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
