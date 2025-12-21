import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DebugConsole } from './DebugConsole';
import { useGameStore } from '../stores/game.store';

// Mock the store
vi.mock('../stores/game.store', () => ({
    useGameStore: vi.fn(),
}));

// Mock ADVENTURES
vi.mock('../data/adventures.data', () => ({
    ADVENTURES: [
        {
            id: '1',
            encounters: Array(10).fill({}),
        }
    ],
}));

describe('DebugConsole', () => {
    const mockOnClose = vi.fn();
    const mockDebugSetMapNode = vi.fn();
    const mockDebugAddXp = vi.fn();
    const mockDebugResetXpPool = vi.fn();
    const mockDebugUnlockAllCompanions = vi.fn();
    const mockSetActiveAdventure = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useGameStore as any).mockReturnValue({
            debugSetMapNode: mockDebugSetMapNode,
            debugAddXp: mockDebugAddXp,
            debugResetXpPool: mockDebugResetXpPool,
            debugUnlockAllCompanions: mockDebugUnlockAllCompanions,
            xpPool: 0,
            companionStats: {},
            activeAdventureId: '1',
            setActiveAdventure: mockSetActiveAdventure,
        });
    });

    const submitCommand = (command: string) => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: command } });
        fireEvent.submit(screen.getByRole('form', { name: /debug command/i }));
    };

    it('should handle goto command correctly', () => {
        render(<DebugConsole onClose={mockOnClose} />);

        // Test valid jump
        submitCommand('goto 5');
        expect(mockDebugSetMapNode).toHaveBeenCalledWith(5);
        expect(screen.getByText('Jumped to encounter 5.')).toBeDefined();

        // Test valid jump to end + 1
        submitCommand('goto 11');
        expect(mockDebugSetMapNode).toHaveBeenCalledWith(11);
        expect(screen.getByText('Jumped to encounter 11.')).toBeDefined();

        // Test invalid jump (too high)
        submitCommand('goto 12');
        expect(screen.getAllByText(/Error: Invalid encounter index/)).toHaveLength(1);

        // Test invalid jump (too low)
        submitCommand('goto 0');
        expect(screen.getAllByText(/Error: Invalid encounter index/)).toHaveLength(2);

        // Test invalid usage
        submitCommand('goto abc');
        expect(screen.getByText('Error: Invalid usage. Usage: goto <index>')).toBeDefined();
    });

    it('should handle help command', () => {
        render(<DebugConsole onClose={mockOnClose} />);
        submitCommand('help');
        expect(screen.getByText(/goto <index>/)).toBeDefined();
    });

    it('should handle unlock command', () => {
        render(<DebugConsole onClose={mockOnClose} />);
        submitCommand('unlock');
        expect(mockDebugSetMapNode).toHaveBeenCalledWith(11);
        expect(screen.getByText('All encounters unlocked.')).toBeDefined();
    });

    it('should handle reset command', () => {
        render(<DebugConsole onClose={mockOnClose} />);
        submitCommand('reset');
        expect(mockDebugSetMapNode).toHaveBeenCalledWith(1);
        expect(mockDebugResetXpPool).toHaveBeenCalled();
        expect(screen.getByText('Adventure progress and XP pool reset to start.')).toBeDefined();
    });
});
