import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles, Map, Users } from 'lucide-react';
import { FormCloseButton } from '../../../components/ui/FormCloseButton';
import './Premium.css';

interface PremiumStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PremiumStoreModal: React.FC<PremiumStoreModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleUnlock = () => {
        // Redirect to the separate checkout page
        window.location.href = '/checkout.html';
    };

    return (
        <div className="premium-modal-overlay">
            <FormCloseButton onClick={onClose} />

            <div className="premium-upsell">
                <div className="premium-header">
                    <h2 className="premium-title">{t('premium.store.title')}</h2>
                    <p className="premium-subtitle">{t('premium.store.description')}</p>
                </div>

                <div className="premium-features-grid">
                    <div className="feature-item">
                        <Map className="feature-icon" size={32} />
                        <h3>{t('premium.store.features.adventures')}</h3>
                    </div>
                    <div className="feature-item">
                        <Sparkles className="feature-icon" size={32} />
                        <h3>{t('premium.store.features.evolutions')}</h3>
                    </div>
                    <div className="feature-item">
                        <Users className="feature-icon" size={32} />
                        <h3>{t('premium.store.features.realms')}</h3>
                    </div>
                    <div className="feature-item">
                        <ShieldCheck className="feature-icon" size={32} />
                        <h3>{t('premium.store.features.support')}</h3>
                    </div>
                </div>

                <div className="premium-footer">
                    <div className="price-tag">{t('premium.store.price')}</div>
                    <button
                        className="unlock-button"
                        onClick={handleUnlock}
                    >
                        {t('premium.store.buy_now')}
                    </button>
                </div>
            </div>
        </div>
    );
};
