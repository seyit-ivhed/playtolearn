import { describe, it, expect, vi } from 'vitest';
import type { StoreApi } from 'zustand';
import { createDebugSlice } from './debug.slice';
import type { GameStore } from '../interfaces';
import { COMPANIONS } from '../../../data/companions.data';

const mockGet = (state: Partial<GameStore>) => () => state as GameStore;
const mockSet = vi.fn() as unknown as StoreApi<GameStore>['setState'];

describe('debug.slice', () => {
    const setupSlice = (state: Partial<GameStore> = {}) => {
        const slice = createDebugSlice(
            mockSet,
            mockGet(state),
            {} as StoreApi<GameStore>
        );
        return slice;
    };



    it('should reset companions to level 1 via debugResetCompanions', () => {
        vi.mocked(mockSet).mockClear();
        const slice = setupSlice();

        slice.debugResetCompanions();

        const expectedCompanionStats = Object.keys(COMPANIONS).reduce((acc, id) => {
            acc[id] = { level: 1 };
            return acc;
        }, {} as Record<string, { level: number }>);

        expect(mockSet).toHaveBeenCalledWith({ companionStats: expectedCompanionStats });
    });

    it('should reset encounter results via debugResetEncounterResults', () => {
        vi.mocked(mockSet).mockClear();
        const slice = setupSlice();

        slice.debugResetEncounterResults();

        expect(mockSet).toHaveBeenCalledWith({ encounterResults: {} });
    });

    it('should set companion level via debugSetCompanionLevel', () => {
        vi.mocked(mockSet).mockClear();
        const slice = setupSlice({ companionStats: { 'c1': { level: 1 } } });

        slice.debugSetCompanionLevel('c1', 5);

        expect(mockSet).toHaveBeenCalledWith({
            companionStats: expect.objectContaining({
                'c1': { level: 5 }
            })
        });
    });

    it('should set encounter stars via debugSetEncounterStars', () => {
        vi.mocked(mockSet).mockClear();
        const slice = setupSlice({ encounterResults: {} });

        slice.debugSetEncounterStars('1', 1, 3);

        expect(mockSet).toHaveBeenCalledWith({
            encounterResults: expect.objectContaining({
                '1_1': expect.objectContaining({ stars: 3 })
            })
        });
    });
});
