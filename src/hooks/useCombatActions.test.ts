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
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeModuleEnergy: mockConsumeEnergy,
            rechargeModule: mockFullRecharge, // mapping to same mock function for simplicity
            rechargedModules: [],
        });

        (useCombatStore as any).getState = vi.fn().mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 3, maxEnergy: 3 },
                    defend: { currentEnergy: 2, maxEnergy: 2 },
                    special: { currentEnergy: 2, maxEnergy: 2 },
                }
            }
        });

        (useMathStore as any).mockReturnValue({
            currentProblem: { question: '1+1', answer: 2 },
            generateNewProblem: mockGenerateNewProblem,
            submitAnswer: mockSubmitAnswer,
            reset: mockReset,
        });
    });

    it('should handle ATTACK action with energy', () => {
        // Mock player with full energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeModuleEnergy: mockConsumeEnergy,
            rechargedModules: [],
        });

        (useCombatStore as any).getState.mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 3, maxEnergy: 3 }
                }
            }
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'attack' });
        });

        expect(mockConsumeEnergy).toHaveBeenCalledWith('attack');
        expect(mockPlayerAction).toHaveBeenCalledWith({ type: 'attack', value: 10 });
        expect(mockSetPhase).not.toHaveBeenCalled();
    });

    it('should trigger recharge when energy is 0', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeModuleEnergy: mockConsumeEnergy,
            rechargedModules: [],
        });

        (useCombatStore as any).getState.mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 0, maxEnergy: 3 }
                }
            }
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'attack' });
        });

        expect(mockSetPhase).toHaveBeenCalledWith(CombatPhase.MATH_CHALLENGE);
        expect(result.current.showMathModal).toBe(true);
        expect(mockConsumeEnergy).not.toHaveBeenCalled();
    });

    it('should prevent recharge if already recharged this module', () => {
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            rechargedModules: ['attack'], // Already recharged attack
        });

        (useCombatStore as any).getState.mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 0, maxEnergy: 3 }
                }
            }
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'attack' });
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showMathModal).toBe(false);
    });

    it('should handle correct math answer for recharge', () => {
        // Mock player with 0 energy to trigger recharge first
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            rechargedModules: [],
            rechargeModule: mockFullRecharge,
        });

        (useCombatStore as any).getState.mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 0, maxEnergy: 3 }
                }
            }
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action to trigger recharge state
        act(() => {
            result.current.handleActionSelect({ type: 'attack' });
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: true });

        act(() => {
            result.current.handleMathSubmit(2);
        });

        expect(mockFullRecharge).toHaveBeenCalledWith('attack');
        expect(result.current.showMathModal).toBe(false);
    });

    it('should handle wrong math answer for recharge', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            rechargedModules: [],
            rechargeModule: mockFullRecharge,
        });

        (useCombatStore as any).getState.mockReturnValue({
            player: {
                modules: {
                    attack: { currentEnergy: 0, maxEnergy: 3 }
                }
            }
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action first
        act(() => {
            result.current.handleActionSelect({ type: 'attack' });
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: false });

        act(() => {
            result.current.handleMathSubmit(3);
        });

        expect(mockFullRecharge).not.toHaveBeenCalled();
        expect(result.current.showMathModal).toBe(false);
    });
});
