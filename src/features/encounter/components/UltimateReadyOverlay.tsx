import { useTranslation } from 'react-i18next';

export const UltimateReadyOverlay = () => {
    const { t } = useTranslation();

    return (
        <div
            className="ultimate-ready-overlay"
            style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                pointerEvents: 'none'
            }}
        >
            <div
                className="ultimate-text"
                style={{
                    color: '#fff',
                    textShadow: '0 0 10px #00f2fe',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    animation: 'pulse 1s infinite'
                }}
            >
                ✨ {t('combat.unit_card.ultimate_ready', 'ULTIMATE READY!')} ✨
            </div>
        </div>
    );
};
