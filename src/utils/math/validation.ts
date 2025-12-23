import { type ValidationResult } from '../../types/math.types';

/**
 * Validates a user's answer
 */
export const validateAnswer = (
    userAnswer: number | string,
    correctAnswer: number | string
): ValidationResult => {
    const isCorrect = userAnswer === correctAnswer;

    return {
        isCorrect,
        userAnswer,
        correctAnswer,
        feedback: isCorrect ? 'correct' : 'incorrect',
    };
};
