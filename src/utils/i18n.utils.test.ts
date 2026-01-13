import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInitialLanguage } from './i18n.utils';

describe('getInitialLanguage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Suppress console warnings during tests to keep terminal output clean
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        // Default navigator.language to something neutral if not overridden
        Object.defineProperty(window, 'navigator', {
            value: { language: 'fr' },
            writable: true
        });
    });

    it('should return persisted language if valid (en)', () => {
        localStorage.setItem('space-math-player-storage', JSON.stringify({
            state: { language: 'en' }
        }));
        expect(getInitialLanguage()).toBe('en');
    });

    it('should return persisted language if valid (sv)', () => {
        localStorage.setItem('space-math-player-storage', JSON.stringify({
            state: { language: 'sv' }
        }));
        expect(getInitialLanguage()).toBe('sv');
    });

    it('should ignore invalid persisted language', () => {
        localStorage.setItem('space-math-player-storage', JSON.stringify({
            state: { language: 'de' }
        }));
        expect(getInitialLanguage()).toBe('en'); // Default fallback since navigator is 'fr'
    });

    it('should use navigator language (sv) if no persistence', () => {
        Object.defineProperty(window, 'navigator', {
            value: { language: 'sv-SE' },
            writable: true
        });
        expect(getInitialLanguage()).toBe('sv');
    });

    it('should default to en if navigator is not sv and no persistence', () => {
        Object.defineProperty(window, 'navigator', {
            value: { language: 'es-ES' },
            writable: true
        });
        expect(getInitialLanguage()).toBe('en');
    });

    it('should prioritize persistence over navigator', () => {
        localStorage.setItem('space-math-player-storage', JSON.stringify({
            state: { language: 'en' }
        }));
        Object.defineProperty(window, 'navigator', {
            value: { language: 'sv-SE' },
            writable: true
        });
        expect(getInitialLanguage()).toBe('en');
    });
    
    it('should handle malformed json in local storage', () => {
        localStorage.setItem('space-math-player-storage', '{ invalid json ');
        // Should fallback to navigator (fr -> en)
        expect(getInitialLanguage()).toBe('en');
    });
});
