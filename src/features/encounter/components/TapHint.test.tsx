import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TapHint } from './TapHint';

describe('TapHint', () => {
    it('renders with tap-hint test id', () => {
        render(<TapHint />);
        expect(screen.getByTestId('tap-hint')).toBeTruthy();
    });

    it('renders the finger emoji icon', () => {
        render(<TapHint />);
        const icon = document.querySelector('.tap-hint-icon');
        expect(icon).toBeTruthy();
        expect(icon?.textContent).toBe('👆');
    });

    it('renders a ripple element', () => {
        render(<TapHint />);
        const ripple = document.querySelector('.tap-hint-ripple');
        expect(ripple).toBeTruthy();
    });
});
