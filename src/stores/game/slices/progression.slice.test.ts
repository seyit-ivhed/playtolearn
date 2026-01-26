import { describe, it, expect, vi } from 'vitest';
import type { StoreApi } from 'zustand';
import { createProgressionSlice } from './progression.slice';
import type { GameStore } from '../interfaces';

const mockGet = (state: Partial<GameStore>) => () => state as GameStore;
const mockSet = vi.fn() as unknown as StoreApi<GameStore>['setState'];

describe('progression.slice', () => {
    const setupSlice = (state: Partial<GameStore> = {}) => {
        const slice = createProgressionSlice(
            mockSet,
            mockGet({
                companionStats: {},
                activeParty: [],
                ...state
            }),
            {} as StoreApi<GameStore>
        );
        return slice;
    };

    describe('levelUpCompanion', () => {
        it('should level up companion', () => {
            vi.mocked(mockSet).mockClear();
            const slice = setupSlice({ companionStats: { 'c1': { level: 1 } } });

            slice.levelUpCompanion('c1');

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
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
