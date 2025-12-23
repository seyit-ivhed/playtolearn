import { describe, it, expect } from 'vitest';
import { selectRandomTarget, findFirstLivingTarget } from './combat.utils';

describe('combat.utils', () => {
    describe('findFirstLivingTarget', () => {
        it('should return index of first living target', () => {
            const targets = [
                { isDead: false },
                { isDead: false },
                { isDead: false }
            ];

            const index = findFirstLivingTarget(targets);

            expect(index).toBe(0);
        });

        it('should skip dead targets', () => {
            const targets = [
                { isDead: true },
                { isDead: true },
                { isDead: false }
            ];

            const index = findFirstLivingTarget(targets);

            expect(index).toBe(2);
        });

        it('should return -1 when all targets are dead', () => {
            const targets = [
                { isDead: true },
                { isDead: true }
            ];

            const index = findFirstLivingTarget(targets);

            expect(index).toBe(-1);
        });

        it('should return -1 for empty array', () => {
            const targets: { isDead: boolean }[] = [];

            const index = findFirstLivingTarget(targets);

            expect(index).toBe(-1);
        });
    });

    describe('selectRandomTarget', () => {
        it('should return valid index for living targets', () => {
            const targets = [
                { isDead: false },
                { isDead: false },
                { isDead: false }
            ];

            const index = selectRandomTarget(targets);

            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(3);
            expect(targets[index].isDead).toBe(false);
        });

        it('should only select from living targets', () => {
            const targets = [
                { isDead: true },
                { isDead: false },
                { isDead: true }
            ];

            // Run multiple times to ensure consistency
            for (let i = 0; i < 10; i++) {
                const index = selectRandomTarget(targets);
                expect(index).toBe(1);
            }
        });

        it('should return -1 when all targets are dead', () => {
            const targets = [
                { isDead: true },
                { isDead: true }
            ];

            const index = selectRandomTarget(targets);

            expect(index).toBe(-1);
        });

        it('should return -1 for empty array', () => {
            const targets: { isDead: boolean }[] = [];

            const index = selectRandomTarget(targets);

            expect(index).toBe(-1);
        });
    });
});
