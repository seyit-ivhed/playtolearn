import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={() => changeLanguage('en')}
                style={{
                    fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                    padding: '0.5rem',
                    cursor: 'pointer'
                }}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage('sv')}
                style={{
                    fontWeight: i18n.language === 'sv' ? 'bold' : 'normal',
                    padding: '0.5rem',
                    cursor: 'pointer'
                }}
            >
                Svenska
            </button>
        </div>
    );
}
