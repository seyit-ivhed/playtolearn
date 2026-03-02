import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BookForgotPassword } from './BookForgotPassword';
import { useAuth } from '../../../../hooks/useAuth';

vi.mock('../../../../hooks/useAuth');
vi.mock('../../../../components/ui/PrimaryButton', () => ({
    PrimaryButton: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
        <button {...props}>{children}</button>
    )
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('BookForgotPassword', () => {
    const mockResetPasswordForEmail = vi.fn();
    const mockOnBack = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            resetPasswordForEmail: mockResetPasswordForEmail,
        });
    });

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <BookForgotPassword onBack={mockOnBack} />
            </MemoryRouter>
        );

    it('renders the forgot password form', () => {
        renderComponent();
        expect(screen.getByTestId('forgot-password-form')).toBeTruthy();
        expect(screen.getByTestId('forgot-password-email-input')).toBeTruthy();
        expect(screen.getByTestId('forgot-password-submit-btn')).toBeTruthy();
    });

    it('calls onBack when back button is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByTestId('forgot-password-back-btn'));
        expect(mockOnBack).toHaveBeenCalledOnce();
    });

    it('calls resetPasswordForEmail with the entered email on submit', async () => {
        mockResetPasswordForEmail.mockResolvedValue(undefined);
        renderComponent();

        fireEvent.change(screen.getByTestId('forgot-password-email-input'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.submit(screen.getByTestId('forgot-password-form'));

        await waitFor(() => {
            expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
                'test@example.com',
                expect.stringContaining('/reset-password')
            );
        });
    });

    it('shows success message after successful submission', async () => {
        mockResetPasswordForEmail.mockResolvedValue(undefined);
        renderComponent();

        fireEvent.change(screen.getByTestId('forgot-password-email-input'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.submit(screen.getByTestId('forgot-password-form'));

        await waitFor(() => {
            expect(screen.getByTestId('forgot-password-success')).toBeTruthy();
        });
    });

    it('shows error message when resetPasswordForEmail throws', async () => {
        mockResetPasswordForEmail.mockRejectedValue(new Error('network error'));
        renderComponent();

        fireEvent.change(screen.getByTestId('forgot-password-email-input'), {
            target: { value: 'bad@example.com' }
        });
        fireEvent.submit(screen.getByTestId('forgot-password-form'));

        await waitFor(() => {
            expect(screen.getByTestId('forgot-password-error-alert')).toBeTruthy();
        });
    });
});
