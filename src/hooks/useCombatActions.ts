import { useState } from 'react';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase, type CombatAction } from '../types/combat.types';
import { MathOperation } from '../types/math.types';
import { soundManager, SoundType } from '../utils/sound-manager';

export function useCombatActions() {
    const { phase, setPhase, playerAction, consumeEnergy, fullRecharge, rechargedThisTurn, setRechargedThisTurn } = useCombatStore();
    const { currentProblem, generateNewProblem, submitAnswer, reset } = useMathStore();

    const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);
    const [showMathModal, setShowMathModal] = useState(false);

    const handleActionSelect = (action: CombatAction) => {
        if (phase !== CombatPhase.PLAYER_INPUT) return;

        setSelectedAction(action);

        if (action.type === 'ATTACK') {
            // Consume energy for attack (cost 10)
            consumeEnergy(10);
            // Direct attack without math challenge
            playerAction({ ...action, value: 10 });
        } else if (action.type === 'RECHARGE') {
            // Open math challenge for recharge if not already recharged this turn
            if (rechargedThisTurn) {
                // Already recharged this turn; ignore further attempts
                return;
            }
            setPhase(CombatPhase.MATH_CHALLENGE);
            generateNewProblem(MathOperation.ADD);
            setShowMathModal(true);
        } else {
            // Other actions consume energy based on type
            const energyCostMap: Record<string, number> = {
                'DEFEND': 5,
                'REPAIR': 8,
                'SPECIAL': 12,
            };
            const cost = energyCostMap[action.type] ?? 0;
            if (cost > 0) {
                consumeEnergy(cost);
            }
            playerAction(action);
        }
    };

    const handleMathSubmit = (answer: number) => {
        if (!currentProblem || !selectedAction) return;

        const result = submitAnswer(answer);

        if (result.isCorrect) {
            // Correct answer fully recharges energy
            fullRecharge();
            // Mark that recharge has occurred this turn
            setRechargedThisTurn(true);
            soundManager.playSound(SoundType.CORRECT_ANSWER);
        } else {
            // Wrong answer – no recharge, show encouragement
            soundManager.playSound(SoundType.WRONG_ANSWER);
        }

        setShowMathModal(false);
        reset();
        setSelectedAction(null);
    };

    return {
        handleActionSelect,
        handleMathSubmit,
        selectedAction,
        showMathModal,
    };
}
