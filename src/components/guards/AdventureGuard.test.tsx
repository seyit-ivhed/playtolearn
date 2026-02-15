
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdventureGuard } from './AdventureGuard';
import { useGameStore } from '../../stores/game/store';
import { usePremiumStore } from '../../stores/premium.store';

// Mock dependencies
vi.mock('../../stores/game/store');
vi.mock('../../stores/premium.store');
vi.mock('../../utils/navigation-security.utils', () => ({
    checkNavigationAccess: vi.fn()
}));

// Import the mocked function to assert on it
import { checkNavigationAccess } from '../../utils/navigation-security.utils';

describe('AdventureGuard', () => {
    const mockCheckNavigationAccess = checkNavigationAccess as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // Default store mocks
        (useGameStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            encounterResults: {},
            isAdventureUnlocked: vi.fn().mockReturnValue(true)
        });

        (usePremiumStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            isAdventureUnlocked: vi.fn().mockReturnValue(true),
            initialized: true
        });

        mockCheckNavigationAccess.mockReturnValue({ allowed: true });
    });

    const TestComponent = () => <div>Protected Content</div>;

    const renderGuard = (adventureId: string) => {
        return render(
            <MemoryRouter initialEntries={[`/map/${adventureId}`]}>
                <Routes>
                    <Route
                        path="/map/:adventureId"
                        element={
                            <AdventureGuard>
                                <TestComponent />
                            </AdventureGuard>
                        }
                    />
                    <Route path="/chronicle" element={<div>Chronicle Page</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders loading screen when premium is not initialized for non-free adventure', () => {
        (usePremiumStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            initialized: false
        });

        const { container } = renderGuard('2');

        // Check for loading screen class instead of text to avoid splitting issues
        const loadingElement = container.querySelector('.loading-screen');
        expect(loadingElement).toBeTruthy();

        expect(screen.queryByText('Protected Content')).toBeNull();
    });

    it('allows IMMEDIATE access to Adventure 1 even if premium is NOT initialized (Free Tier Optimization)', () => {
        (usePremiumStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            initialized: false
        });

        const { container } = renderGuard('1');

        // Should NOT show loading
        const loadingElement = container.querySelector('.loading-screen');
        expect(loadingElement).toBeNull();

        // Should show content
        expect(screen.getByText('Protected Content')).toBeTruthy();

        // Verify checkNavigationAccess was called with correct ID
        expect(mockCheckNavigationAccess).toHaveBeenCalledWith(expect.objectContaining({
            adventureId: '1'
        }));
    });

    it('redirects to chronicle if access is denied', () => {
        mockCheckNavigationAccess.mockReturnValue({ allowed: false, reason: 'LOCKED' });

        renderGuard('2');

        expect(screen.getByText('Chronicle Page')).toBeTruthy();
        expect(screen.queryByText('Protected Content')).toBeNull();
    });

    it('renders children if access is granted', () => {
        renderGuard('2');
        expect(screen.getByText('Protected Content')).toBeTruthy();
    });
});
