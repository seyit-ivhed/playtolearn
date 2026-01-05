/**
 * Monkey-patches document.cookie to block ALL cookie set operations.
 * This ensures that neither 1st party nor 3rd party scripts can create cookies on this domain.
 */
export const initCookieGuard = () => {
    // Only run in browser
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
        const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
        if (!originalDescriptor || !originalDescriptor.set) {
            console.warn('Cookie Shield: Could not intercept document.cookie setter');
            return;
        }

        Object.defineProperty(document, 'cookie', {
            set: function (value: string) {
                // Log the attempt for transparency
                console.warn('Cookie Shield: Blocked attempt to set cookie:', value.split('=')[0]);
                // Simply return without calling the original setter
                return;
            },
            get: function () {
                // Return empty string as if no cookies exist
                return '';
            },
            configurable: true
        });

        console.log('Cookie Shield: Initialized (All cookies blocked)');
    } catch (e) {
        console.error('Cookie Shield: Failed to initialize:', e);
    }
};
