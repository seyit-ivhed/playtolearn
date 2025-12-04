import { useState } from 'react';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase, type CombatAction } from '../types/combat.types';
import { MathOperation } from '../types/math.types';
import { soundManager, SoundType } from '../utils/sound-manager';

export function useCombatActions() {
    const { phase, setPhase, playerAction, consumeModuleEnergy, rechargeModule, rechargedModules } = useCombatStore();
    const { currentProblem, generateNewProblem, submitAnswer, reset } = useMathStore();

    const [pendingRechargeModule, setPendingRechargeModule] = useState<'attack' | 'defend' | 'special' | null>(null);
    const [showMathModal, setShowMathModal] = useState(false);

    const handleActionSelect = (action: CombatAction) => {
        if (phase !== CombatPhase.PLAYER_INPUT) return;

        const moduleType = action.type;
        const player = useCombatStore.getState().player;
        const currentEnergy = player.modules[moduleType].currentEnergy;

        // Check if module needs recharge
        if (currentEnergy <= 0) {
            // Check if already recharged this module this turn
            if (rechargedModules.includes(moduleType)) {
                // Already recharged this module this turn; ignore
                return;
            }

            // Trigger recharge
            setPendingRechargeModule(moduleType);
            setPhase(CombatPhase.MATH_CHALLENGE);
            generateNewProblem(MathOperation.ADD);
            setShowMathModal(true);
            return;
        }

        // Execute action if energy is available
        consumeModuleEnergy(moduleType);

        if (action.type === 'attack') {
            // Direct attack without math challenge
            playerAction({ ...action, value: 10 });
        } else {
            playerAction(action);
        }
    };

    const handleMathSubmit = (answer: number) => {
        if (!currentProblem || !pendingRechargeModule) return;

        const result = submitAnswer(answer);

        if (result.isCorrect) {
            // Correct answer fully recharges specific module
            rechargeModule(pendingRechargeModule);
            soundManager.playSound(SoundType.CORRECT_ANSWER);
        } else {
            // Wrong answer – no recharge
            soundManager.playSound(SoundType.WRONG_ANSWER);
        }

        setShowMathModal(false);
        reset();
        setPendingRechargeModule(null);
    };

    return {
        handleActionSelect,
        handleMathSubmit,
        showMathModal,
    };
}
