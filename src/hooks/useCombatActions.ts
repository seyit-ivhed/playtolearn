import { useState } from 'react';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase, type CombatAction } from '../types/combat.types';
import { MathOperation } from '../types/math.types';
import { soundManager, SoundType } from '../utils/sound-manager';
import { getCompanionById } from '../data/companions.data';

export function useCombatActions() {
    const { phase, player, playerAction, consumeCompanionEnergy, rechargeCompanion, rechargedCompanions } = useCombatStore();
    const { currentProblem, generateNewProblem, submitAnswer, reset } = useMathStore();

    const [pendingRechargeCompanion, setPendingRechargeCompanion] = useState<string | null>(null);
    const [showInlineRecharge, setShowInlineRecharge] = useState(false);

    const handleActionSelect = (companionId: string) => {
        if (phase !== CombatPhase.PLAYER_INPUT) return;

        // Find the companion instance
        const companionInstance = player.equippedCompanions.find(c => c.companionId === companionId);
        if (!companionInstance) return;

        // Check if companion needs recharge
        if (companionInstance.currentEnergy <= 0) {
            // Check if already recharged this companion this turn
            if (rechargedCompanions.includes(companionId)) {
                // Already recharged this companion this turn; ignore
                return;
            }

            // Trigger inline recharge
            setPendingRechargeCompanion(companionId);
            generateNewProblem(MathOperation.ADD);
            setShowInlineRecharge(true);
            return;
        }

        // Get companion definition for action details
        const companion = getCompanionById(companionId);
        if (!companion || !companion.combatAction) return;

        // Execute action if energy is available
        consumeCompanionEnergy(companionId);

        const action: CombatAction = {
            companionId,
            behavior: companion.combatAction,
            value: companion.stats.attack || companion.stats.defense || companion.stats.health || 10
        };

        playerAction(action);
    };

    const handleMathSubmit = (answer: number) => {
        if (!currentProblem || !pendingRechargeCompanion) return;

        const result = submitAnswer(answer);

        if (result.isCorrect) {
            // Correct answer fully recharges specific companion
            rechargeCompanion(pendingRechargeCompanion);
            soundManager.playSound(SoundType.CORRECT_ANSWER);
        } else {
            // Wrong answer – no recharge
            soundManager.playSound(SoundType.WRONG_ANSWER);
        }

        setShowInlineRecharge(false);
        reset();
        setPendingRechargeCompanion(null);
    };

    return {
        handleActionSelect,
        handleMathSubmit,
        showInlineRecharge,
        pendingRechargeCompanion,
    };
}
