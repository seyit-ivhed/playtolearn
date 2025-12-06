import { useState } from 'react';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase, type CombatAction } from '../types/combat.types';
import { MathOperation } from '../types/math.types';
import { soundManager, SoundType } from '../utils/sound-manager';
import { getModuleById } from '../data/modules.data';

export function useCombatActions() {
    const { phase, player, playerAction, consumeModuleEnergy, rechargeModule, rechargedModules } = useCombatStore();
    const { currentProblem, generateNewProblem, submitAnswer, reset } = useMathStore();

    const [pendingRechargeModule, setPendingRechargeModule] = useState<string | null>(null);
    const [showInlineRecharge, setShowInlineRecharge] = useState(false);

    const handleActionSelect = (moduleId: string) => {
        if (phase !== CombatPhase.PLAYER_INPUT) return;

        // Find the module instance
        const moduleInstance = player.equippedModules.find(m => m.moduleId === moduleId);
        if (!moduleInstance) return;

        // Check if module needs recharge
        if (moduleInstance.currentEnergy <= 0) {
            // Check if already recharged this module this turn
            if (rechargedModules.includes(moduleId)) {
                // Already recharged this module this turn; ignore
                return;
            }

            // Trigger inline recharge
            setPendingRechargeModule(moduleId);
            generateNewProblem(MathOperation.ADD);
            setShowInlineRecharge(true);
            return;
        }

        // Get module definition for action details
        const module = getModuleById(moduleId);
        if (!module || !module.combatAction) return;

        // Execute action if energy is available
        consumeModuleEnergy(moduleId);

        const action: CombatAction = {
            moduleId,
            behavior: module.combatAction,
            value: module.stats.attack || module.stats.defense || module.stats.health || 10
        };

        playerAction(action);
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

        setShowInlineRecharge(false);
        reset();
        setPendingRechargeModule(null);
    };

    return {
        handleActionSelect,
        handleMathSubmit,
        showInlineRecharge,
        pendingRechargeModule,
    };
}
