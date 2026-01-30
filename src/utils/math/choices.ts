import { getRandomInt } from './helpers';

/**
 * Generates multiple choice options including the correct answer
 * @param correctAnswer The correct answer to include
 * @param count Total number of choices (default 4)
 */
export const generateMultipleChoices = (correctAnswer: number, count: number = 4): number[] => {
    const choices = new Set<number>();
    choices.add(correctAnswer);

    // Generate plausible wrong answers
    // Strategy: +/- 1, +/- 2, +/- 10, random close numbers
    while (choices.size < count) {
        const variance = getRandomInt(1, 5);
        const direction = Math.random() > 0.5 ? 1 : -1;
        let wrongAnswer = (correctAnswer as number) + (variance * direction);

        // Ensure positive answers for this age group (mostly)
        if (wrongAnswer < 0) {
            wrongAnswer = Math.abs(wrongAnswer);
        }

        // If we generated the correct answer or a duplicate, try a random offset
        if (choices.has(wrongAnswer)) {
            wrongAnswer = (correctAnswer as number) + getRandomInt(-10, 10);
            if (wrongAnswer < 0) {
                wrongAnswer = 0;
            }
        }

        // Fallback if we're stuck (e.g. answer is 0 or 1)
        if (choices.has(wrongAnswer)) {
            wrongAnswer = getRandomInt(0, 20);
        }

        choices.add(wrongAnswer);
    }

    return Array.from(choices).sort((a, b) => a - b);
};
