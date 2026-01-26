import { describe, it, expect, vi } from 'vitest';
import type { StoreApi } from 'zustand';
import { createProgressionSlice } from './progression.slice';
import type { GameStore } from '../interfaces';
import * as progressionUtils from '../../../utils/progression.utils';

vi.mock('../../../utils/progression.utils', () => ({
    getXpForNextLevel: vi.fn(() => 100)
}));

const mockGet = (state: Partial<GameStore>) => () => state as GameStore;
const mockSet = vi.fn() as unknown as StoreApi<GameStore>['setState'];

describe('progression.slice', () => {
    const setupSlice = (state: Partial<GameStore> = {}) => {
        const slice = createProgressionSlice(
            mockSet,
            mockGet({
                xpPool: 0,
                companionStats: {},
                activeParty: [],
                ...state
            }),
            {} as StoreApi<GameStore>
        );
        return slice;
    };

    it('should add XP to pool', () => {
        vi.mocked(mockSet).mockClear();
        const slice = setupSlice({ xpPool: 10 });

        slice.addXpToPool(50);

        expect(mockSet).toHaveBeenCalledWith({ xpPool: 60 });
    });

    describe('levelUpCompanion', () => {
        it('should NOT level up if XP pool is insufficient', () => {
            vi.mocked(mockSet).mockClear();
            const slice = setupSlice({ xpPool: 50, companionStats: { 'c1': { level: 1 } } });

            vi.mocked(progressionUtils.getXpForNextLevel).mockReturnValue(100);

            slice.levelUpCompanion('c1');

            expect(mockSet).not.toHaveBeenCalled();
        });

        it('should level up and deduct XP if pool is sufficient', () => {
            vi.mocked(mockSet).mockClear();
            const slice = setupSlice({ xpPool: 150, companionStats: { 'c1': { level: 1 } } });

            vi.mocked(progressionUtils.getXpForNextLevel).mockReturnValue(100);

            slice.levelUpCompanion('c1');

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                xpPool: 50,
                companionStats: expect.objectContaining({
                    'c1': { level: 2 }
                })
            }));
        });
    });

    describe('addCompanionToParty', () => {
        it('should add companion to party if not already present', () => {
            vi.mocked(mockSet).mockClear();
            const slice = setupSlice({ activeParty: ['c1'] });

            slice.addCompanionToParty('c2');

            expect(mockSet).toHaveBeenCalledWith({ activeParty: ['c1', 'c2'] });
        });

        it('should NOT add companion to party if already present', () => {
            vi.mocked(mockSet).mockClear();
            const slice = setupSlice({ activeParty: ['c1'] });

            slice.addCompanionToParty('c1');

            expect(mockSet).not.toHaveBeenCalled();
        });
    });
});
