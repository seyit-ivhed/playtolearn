import { getRandomInt } from './helpers';

/**
 * Generates multiple choice options including the correct answer
 * @param correctAnswer The correct answer to include
 * @param count Total number of choices (default 4)
 */
export const generateMultipleChoices = (correctAnswer: number | string, count: number = 4): (number | string)[] => {
    if (typeof correctAnswer === 'string') {
        const choices = new Set<string>();
        choices.add(correctAnswer);

        // Expect format "Q R r"
        const match = correctAnswer.match(/^(\d+)\s*R\s*(\d+)$/);
        if (!match) {
            // Fallback for unexpected string format
            while (choices.size < count) {
                choices.add(`${correctAnswer} ${choices.size}`);
            }
            return Array.from(choices);
        }

        const q = parseInt(match[1]);
        const r = parseInt(match[2]);

        while (choices.size < count) {
            // Generate wrong answers by varying Q and R
            const qVar = getRandomInt(-2, 2);
            const rVar = getRandomInt(-2, 2);

            // Skip no-op
            if (qVar === 0 && rVar === 0) continue;

            const newQ = Math.abs(q + qVar);
            const newR = Math.abs(r + rVar); // Keep positive

            const wrongAnswer = `${newQ} R ${newR}`;

            choices.add(wrongAnswer);
        }

        // Sort strings naturally or just random. Let's sort to keep UI consistent
        return Array.from(choices).sort();
    }

    const choices = new Set<number>();
    choices.add(correctAnswer as number);

    // Generate plausible wrong answers
    // Strategy: +/- 1, +/- 2, +/- 10, random close numbers
    while (choices.size < count) {
        const variance = getRandomInt(1, 5);
        const direction = Math.random() > 0.5 ? 1 : -1;
        let wrongAnswer = (correctAnswer as number) + (variance * direction);

        // Ensure positive answers for this age group (mostly)
        if (wrongAnswer < 0) wrongAnswer = Math.abs(wrongAnswer);

        // If we generated the correct answer or a duplicate, try a random offset
        if (choices.has(wrongAnswer)) {
            wrongAnswer = (correctAnswer as number) + getRandomInt(-10, 10);
            if (wrongAnswer < 0) wrongAnswer = 0;
        }

        // Fallback if we're stuck (e.g. answer is 0 or 1)
        if (choices.has(wrongAnswer)) {
            wrongAnswer = getRandomInt(0, 20);
        }

        choices.add(wrongAnswer);
    }

    return Array.from(choices).sort((a, b) => a - b);
};
