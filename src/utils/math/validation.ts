import { type ValidationResult } from '../../types/math.types';

/**
 * Validates a user's answer
 */
export const validateAnswer = (
    userAnswer: number | string,
    correctAnswer: number | string
): ValidationResult => {
    const numUserAnswer = typeof userAnswer === 'string' ? Number(userAnswer) : userAnswer;
    const numCorrectAnswer = typeof correctAnswer === 'string' ? Number(correctAnswer) : correctAnswer;
    const isCorrect = numUserAnswer === numCorrectAnswer;

    return {
        isCorrect,
        userAnswer: numUserAnswer,
        correctAnswer: numCorrectAnswer,
        feedback: isCorrect ? 'correct' : 'incorrect',
    };
};
