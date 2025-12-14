import { create } from 'zustand';
import {
    type MathProblem,
    type ValidationResult,
    type DifficultyLevel,
    MathOperation
} from '../types/math.types';
import { generateProblem, validateAnswer } from '../utils/math-generator';
import { usePlayerStore } from './player.store';

interface MathState {
    // State
    currentProblem: MathProblem | null;
    lastValidationResult: ValidationResult | null;
    difficulty: DifficultyLevel;
    isGenerating: boolean;
    streak: number;

    // Actions
    setDifficulty: (level: DifficultyLevel) => void;
    generateNewProblem: (operation: MathOperation) => void;
    submitAnswer: (answer: number | string) => ValidationResult;
    reset: () => void;
}

export const useMathStore = create<MathState>((set, get) => ({
    // Initial State
    currentProblem: null,
    lastValidationResult: null,
    difficulty: 1,
    isGenerating: false,
    streak: 0,

    // Actions
    setDifficulty: (level: DifficultyLevel) => {
        set({ difficulty: level });
    },

    generateNewProblem: (operation: MathOperation) => {
        set({ isGenerating: true, lastValidationResult: null });

        // Small delay to simulate "thinking" or allow UI transitions
        // In a real app this might be async, but here it's synchronous logic

        // Use difficulty from Player Store (Persistence Source of Truth)
        // Accessing the store directly via its getState method (zustand pattern)
        const difficulty = usePlayerStore.getState().difficulty;
        const problem = generateProblem(operation, difficulty);

        set({
            currentProblem: problem,
            isGenerating: false
        });
    },

    submitAnswer: (answer: number | string) => {
        const { currentProblem, streak } = get();

        if (!currentProblem) {
            throw new Error('No active problem to answer');
        }

        const result = validateAnswer(answer, currentProblem.correctAnswer);

        set({
            lastValidationResult: result,
            streak: result.isCorrect ? streak + 1 : 0
        });

        return result;
    },

    reset: () => {
        set({
            currentProblem: null,
            lastValidationResult: null,
            streak: 0,
            isGenerating: false
        });
    }
}));
