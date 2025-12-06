import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCombatActions } from './useCombatActions';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase } from '../types/combat.types';

// Mock stores
vi.mock('../stores/combat.store');
vi.mock('../stores/math.store');
vi.mock('../utils/sound-manager');
vi.mock('../data/modules.data', () => ({
    getModuleById: vi.fn((id) => {
        if (id === 'weapon_laser_1') {
            return {
                id: 'weapon_laser_1',
                name: 'Basic Laser',
                combatAction: 'ATTACK',
                stats: { attack: 10, maxEnergy: 3 }
            };
        }
        return null;
    })
}));

describe('useCombatActions', () => {
    const mockPlayerAction = vi.fn();
    const mockSetPhase = vi.fn();
    const mockConsumeEnergy = vi.fn();
    const mockFullRecharge = vi.fn();

    const mockGenerateNewProblem = vi.fn();
    const mockSubmitAnswer = vi.fn();
    const mockReset = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default store mocks
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedModules: [
                    {
                        moduleId: 'weapon_laser_1',
                        slotId: 'slot_weapon_1',
                        currentEnergy: 3,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeModuleEnergy: mockConsumeEnergy,
            rechargeModule: mockFullRecharge,
            rechargedModules: [],
        });

        (useMathStore as any).mockReturnValue({
            currentProblem: { question: '1+1', answer: 2 },
            generateNewProblem: mockGenerateNewProblem,
            submitAnswer: mockSubmitAnswer,
            reset: mockReset,
        });
    });

    it('should handle ATTACK action with energy', () => {
        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('weapon_laser_1');
        });

        expect(mockConsumeEnergy).toHaveBeenCalledWith('weapon_laser_1');
        expect(mockPlayerAction).toHaveBeenCalledWith({
            moduleId: 'weapon_laser_1',
            behavior: 'ATTACK',
            value: 10
        });
        expect(mockSetPhase).not.toHaveBeenCalled();
    });

    it('should trigger recharge when energy is 0', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedModules: [
                    {
                        moduleId: 'weapon_laser_1',
                        slotId: 'slot_weapon_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeModuleEnergy: mockConsumeEnergy,
            rechargedModules: [],
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('weapon_laser_1');
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(true);
        expect(result.current.pendingRechargeModule).toBe('weapon_laser_1');
        expect(mockConsumeEnergy).not.toHaveBeenCalled();
    });

    it('should prevent recharge if already recharged this module', () => {
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedModules: [
                    {
                        moduleId: 'weapon_laser_1',
                        slotId: 'slot_weapon_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedModules: ['weapon_laser_1'], // Already recharged
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('weapon_laser_1');
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeModule).toBe(null);
    });

    it('should handle correct math answer for recharge', () => {
        // Mock player with 0 energy to trigger recharge first
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedModules: [
                    {
                        moduleId: 'weapon_laser_1',
                        slotId: 'slot_weapon_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedModules: [],
            rechargeModule: mockFullRecharge,
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action to trigger recharge state
        act(() => {
            result.current.handleActionSelect('weapon_laser_1');
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: true });

        act(() => {
            result.current.handleMathSubmit(2);
        });

        expect(mockFullRecharge).toHaveBeenCalledWith('weapon_laser_1');
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeModule).toBe(null);
    });

    it('should handle wrong math answer for recharge', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedModules: [
                    {
                        moduleId: 'weapon_laser_1',
                        slotId: 'slot_weapon_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedModules: [],
            rechargeModule: mockFullRecharge,
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action first
        act(() => {
            result.current.handleActionSelect('weapon_laser_1');
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: false });

        act(() => {
            result.current.handleMathSubmit(3);
        });

        expect(mockFullRecharge).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeModule).toBe(null);
    });
});
