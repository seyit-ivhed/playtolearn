import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';
import { AccountCreationStep } from './AccountCreationStep';
import { CheckoutOverlay } from './CheckoutOverlay';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './Premium.css';

export const CheckoutPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);

    const isAnonymous = user?.is_anonymous ?? true;

    const handleBackToGame = () => {
        window.location.href = '/';
    };

    const handleSuccess = () => {
        setShowSuccess(true);
        // After 3 seconds, automatically redirect back to game
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    };

    if (authLoading) {
        return (
            <div className="checkout-page-loading">
                <div className="spinner"></div>
                <p>{t('common.loading', 'Loading...')}</p>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <header className="checkout-header">
                <button className="back-btn" onClick={handleBackToGame}>
                    <ArrowLeft size={20} />
                    {t('common.back_to_game', 'Back to Game')}
                </button>
                <h1 className="checkout-title">{t('premium.store.title', 'Premium Access')}</h1>
            </header>

            <main className="checkout-main">
                {showSuccess ? (
                    <div className="success-screen">
                        <div className="success-icon-container">
                            <CheckCircle2 size={80} />
                        </div>
                        <h2 className="premium-title">{t('premium.store.success_title')}</h2>
                        <p className="success-description">
                            {t('premium.store.success_message')}
                        </p>
                        <p className="redirect-notice">
                            {t('premium.store.redirecting', 'Redirecting you back to your adventure...')}
                        </p>
                        <button className="back-to-journey-btn" onClick={handleBackToGame}>
                            {t('adventure.back', 'Back to Journey')}
                        </button>
                    </div>
                ) : isAnonymous ? (
                    <div className="account-creation-container">
                        <AccountCreationStep
                            onSuccess={() => {/* useAuth state change will trigger re-render */ }}
                        />
                    </div>
                ) : (
                    <div className="premium-checkout">
                        <h2 className="premium-title">{t('premium.store.buy_now', 'Finalize Purchase')}</h2>
                        <CheckoutOverlay
                            contentPackId="premium_base"
                            onSuccess={handleSuccess}
                            onCancel={handleBackToGame}
                            price={t('premium.store.price', '89 SEK')}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};
