import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { StoreApi } from 'zustand';
import { createProgressionSlice } from './progression.slice';
import type { GameStore } from '../interfaces';
import { EXPERIENCE_CONFIG, getRequiredXpForNextLevel } from '../../../data/experience.data';

const mockGet = (state: Partial<GameStore>) => () => state as GameStore;
const mockSet = vi.fn() as unknown as StoreApi<GameStore>['setState'];

// Mock dependencies
vi.mock('../../../services/persistence.service', () => ({
    PersistenceService: {
        sync: vi.fn(),
    },
}));

vi.mock('../../../data/companions.data', () => ({
    getCompanionById: vi.fn((id) => id === 'valid_companion' ? { id: 'valid_companion' } : undefined),
    COMPANIONS: { 'valid_companion': { id: 'valid_companion' } }
}));

describe('progression.slice', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

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

    describe('addCompanionExperience', () => {
        it('should add experience to existing companion', () => {
            const slice = setupSlice({ companionStats: { 'valid_companion': { level: 1, experience: 0 } } });

            slice.addCompanionExperience('valid_companion', 50);

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                companionStats: expect.objectContaining({
                    'valid_companion': expect.objectContaining({
                        experience: 50,
                        level: 1
                    })
                })
            }));
        });

        it('should initialize companion stats if not present', () => {
            const slice = setupSlice({ companionStats: {} });

            slice.addCompanionExperience('valid_companion', 50);

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                companionStats: expect.objectContaining({
                    'valid_companion': expect.objectContaining({
                        experience: 50,
                        level: 1
                    })
                })
            }));
        });

        it('should log error and do nothing if companion id is invalid', () => {
            const slice = setupSlice();

            slice.addCompanionExperience('invalid_id', 50);

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(mockSet).not.toHaveBeenCalled();
        });

        it('should not level up automatically even if XP exceeds requirement', () => {
            const slice = setupSlice({ companionStats: { 'valid_companion': { level: 1, experience: 0 } } });
            const requiredXp = getRequiredXpForNextLevel(1);

            slice.addCompanionExperience('valid_companion', requiredXp + 10);

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                companionStats: expect.objectContaining({
                    'valid_companion': expect.objectContaining({
                        experience: requiredXp + 10,
                        level: 1
                    })
                })
            }));
        });

        it('should not add experience if companion is at max level', () => {
            const slice = setupSlice({
                companionStats: {
                    'valid_companion': { level: EXPERIENCE_CONFIG.MAX_LEVEL, experience: 0 }
                }
            });

            slice.addCompanionExperience('valid_companion', 50);

            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe('levelUpCompanion', () => {
        it('should level up companion if XP is sufficient', () => {
            const requiredXp = getRequiredXpForNextLevel(1);
            const slice = setupSlice({
                companionStats: {
                    'valid_companion': { level: 1, experience: requiredXp + 10 }
                }
            });

            slice.levelUpCompanion('valid_companion');

            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                companionStats: expect.objectContaining({
                    'valid_companion': { level: 2, experience: 10 }
                })
            }));
        });

        it('should NOT level up companion if XP is insufficient', () => {
            const requiredXp = getRequiredXpForNextLevel(1);
            const slice = setupSlice({
                companionStats: {
                    'valid_companion': { level: 1, experience: requiredXp - 1 }
                }
            });

            slice.levelUpCompanion('valid_companion');

            expect(mockSet).not.toHaveBeenCalled();
        });

        it('should NOT level up companion if at max level', () => {
            const slice = setupSlice({
                companionStats: {
                    'valid_companion': { level: EXPERIENCE_CONFIG.MAX_LEVEL, experience: 1000 }
                }
            });

            slice.levelUpCompanion('valid_companion');

            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe('addCompanionToParty', () => {
        it('should add companion to party if not already present', () => {
            const slice = setupSlice({ activeParty: ['c1'] });

            slice.addCompanionToParty('c2');

            expect(mockSet).toHaveBeenCalledWith({ activeParty: ['c1', 'c2'] });
        });

        it('should NOT add companion to party if already present', () => {
            const slice = setupSlice({ activeParty: ['c1'] });

            slice.addCompanionToParty('c1');

            expect(mockSet).not.toHaveBeenCalled();
        });
    });
});
