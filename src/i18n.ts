import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json' with { type: 'json' };
import sv from './locales/sv.json' with { type: 'json' };

import { getInitialLanguage } from './utils/i18n.utils';

i18n
    .use(initReactI18next)
    .init({
        lng: getInitialLanguage(), // Set initial language directly
        resources: {
            en: {
                translation: en,
            },
            sv: {
                translation: sv,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
