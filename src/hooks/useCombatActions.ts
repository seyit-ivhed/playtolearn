import { useState } from 'react';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase, type CombatAction } from '../types/combat.types';
import { MathOperation } from '../types/math.types';
import { soundManager, SoundType } from '../utils/sound-manager';

export function useCombatActions() {
    const { phase, setPhase, playerAction } = useCombatStore();
    const { currentProblem, generateNewProblem, submitAnswer, reset } = useMathStore();

    const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);
    const [showMathModal, setShowMathModal] = useState(false);

    const handleActionSelect = (action: CombatAction) => {
        if (phase !== CombatPhase.PLAYER_INPUT) return;

        setSelectedAction(action);

        if (action.type === 'ATTACK') {
            // Trigger math challenge
            setPhase(CombatPhase.MATH_CHALLENGE);
            generateNewProblem(MathOperation.ADD);
            setShowMathModal(true);
        } else {
            // Execute other actions directly
            playerAction(action);
        }
    };

    const handleMathSubmit = (answer: number) => {
        if (!currentProblem || !selectedAction) return;

        const result = submitAnswer(answer);

        if (result.isCorrect) {
            // Play correct answer sound
            soundManager.playSound(SoundType.CORRECT_ANSWER);
            // Bonus damage for correct answer
            playerAction({ ...selectedAction, value: 15 });
            // Play laser sound for attack
            soundManager.playSound(SoundType.LASER);
        } else {
            // Play wrong answer sound
            soundManager.playSound(SoundType.WRONG_ANSWER);
            // Reduced damage for incorrect answer
            playerAction({ ...selectedAction, value: 5 });
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
