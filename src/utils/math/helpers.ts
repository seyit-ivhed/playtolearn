/**
 * Generates a random integer between min and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles an array in place (Fisher-Yates shuffle) and returns it.
 * Note: Returns the same array instance, but for React state updates you might want to spread it.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array]; // Create a copy to avoid mutating original if needed, or to be safe
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
