import { PLAYER_STORE_KEY } from '../stores/storage-keys';

export const getInitialLanguage = (): string => {
    try {
        // 1. Try to get from persisted player store
        const storageItem = localStorage.getItem(PLAYER_STORE_KEY);
        if (storageItem) {
            const parsed = JSON.parse(storageItem);
            // zustand persist stores data in { state: { ... } }
            const persistedLanguage = parsed?.state?.language;
            if (persistedLanguage && (persistedLanguage === 'en' || persistedLanguage === 'sv')) {
                return persistedLanguage;
            }
        }
    } catch (e) {
        console.warn('Failed to parse player storage for language initialization', e);
    }

    // 2. Fallback to browser language
    if (typeof navigator !== 'undefined' && navigator.language) {
        if (navigator.language.toLowerCase().startsWith('sv')) {
            return 'sv';
        }
    }

    // 3. Default fallback
    return 'en';
};
