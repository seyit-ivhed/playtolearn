import { describe, it, expect } from 'vitest';
import { generateMultipleChoices } from './choices';

describe('choices utility', () => {
    describe('numeric choices', () => {
        it('should include the correct answer', () => {
            const answer = 10;
            const choices = generateMultipleChoices(answer);
            expect(choices).toContain(answer);
        });

        it('should generate the requested number of choices', () => {
            expect(generateMultipleChoices(10, 4)).toHaveLength(4);
            expect(generateMultipleChoices(10, 6)).toHaveLength(6);
            expect(generateMultipleChoices(10, 3)).toHaveLength(3);
        });

        it('should generate unique choices', () => {
            const choices = generateMultipleChoices(10, 4);
            const unique = new Set(choices);
            expect(unique.size).toBe(4);
        });

        it('should sort choices numerically', () => {
            const choices = generateMultipleChoices(50, 4);
            const sorted = [...choices].sort((a, b) => (a as number) - (b as number));
            expect(choices).toEqual(sorted);
        });

        it('should handle small answers like 0 or 1 gracefully', () => {
            const choices = generateMultipleChoices(0, 4);
            expect(choices).toHaveLength(4);
            expect(new Set(choices).size).toBe(4);
            expect(choices.every(c => (c as number) >= 0)).toBe(true);
        });
    });

    describe('string choices (division with remainders)', () => {
        it('should include the correct answer in "Q R r" format', () => {
            const answer = "5 R 2";
            const choices = generateMultipleChoices(answer);
            expect(choices).toContain(answer);
        });

        it('should generate unique string choices', () => {
            const answer = "3 R 1";
            const choices = generateMultipleChoices(answer, 3);
            const unique = new Set(choices);
            expect(unique.size).toBe(3);
            expect(choices.every(c => typeof c === 'string')).toBe(true);
        });

        it('should generate plausible wrong answers with "R"', () => {
            const answer = "4 R 3";
            const choices = generateMultipleChoices(answer, 4);
            choices.forEach(choice => {
                expect(choice).toMatch(/^\d+ R \d+$/);
            });
        });

        it('should fallback for unexpected string formats', () => {
            const answer = "invalid";
            const choices = generateMultipleChoices(answer, 3);
            expect(choices).toContain(answer);
            expect(choices).toHaveLength(3);
        });
    });
});
