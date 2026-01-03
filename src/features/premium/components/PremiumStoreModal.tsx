import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, Sparkles, Map, Users } from 'lucide-react';
import { CheckoutOverlay } from './CheckoutOverlay';
import { usePremiumStore } from '../../../stores/premium.store';
import './Premium.css';

interface PremiumStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PremiumStoreModal: React.FC<PremiumStoreModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [showCheckout, setShowCheckout] = useState(false);
    const { initialize: refreshPremium } = usePremiumStore();

    if (!isOpen) return null;

    const handleSuccess = async () => {
        // Refresh local entitlement state
        await refreshPremium();
        // Force state update by refreshing the page or showing success UI
        setShowCheckout(false);
        // We can show a success message here or just close
        onClose();
    };

    return (
        <div className="premium-modal-overlay">
            <div className="premium-modal-content">
                <button className="premium-close-button" onClick={onClose} aria-label="Close">
                    <X size={24} />
                </button>

                {!showCheckout ? (
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
                                onClick={() => setShowCheckout(true)}
                            >
                                {t('premium.store.buy_now')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="premium-checkout">
                        <h2 className="premium-title">{t('premium.store.buy_now')}</h2>
                        <CheckoutOverlay
                            contentPackId="premium_base"
                            onSuccess={handleSuccess}
                            onCancel={() => setShowCheckout(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
