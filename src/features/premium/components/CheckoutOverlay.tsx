import React, { useEffect, useState, useRef } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentService } from '../../../services/payment.service';
import { CheckoutForm } from './CheckoutForm';
import { FormCloseButton } from '../../../components/ui/FormCloseButton';
import { useTranslation } from 'react-i18next';

interface CheckoutOverlayProps {
    contentPackId: string;
    onSuccess: () => void;
    onCancel: () => void;
    price: string;
}

export const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({
    contentPackId,
    onSuccess,
    onCancel,
    price
}) => {
    const { t } = useTranslation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const lastFetchedIdRef = useRef<string | null>(null);
    const stripePromise = PaymentService.getStripe();

    useEffect(() => {
        // Prevent duplicate fetches for the same content pack
        // This is especially important in React 18 StrictMode (Dev) which runs effects twice
        if (lastFetchedIdRef.current === contentPackId) return;

        lastFetchedIdRef.current = contentPackId;
        PaymentService.createPaymentIntent(contentPackId)
            .then(data => {
                setClientSecret(data.clientSecret);
            })
            .catch(err => {
                console.error('Failed to create payment intent:', err);
                lastFetchedIdRef.current = null; // Reset on error to allow retry
                setError(t('premium.store.error_loading_payment', 'Failed to initialize payment. Please try again.'));
            });
    }, [contentPackId, t]);

    if (error) {
        return (
            <div className="checkout-error-state">
                <p>{error}</p>
                <button onClick={onCancel}>{t('common.back', 'Back')}</button>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="checkout-loading-state">
                <div className="spinner"></div>
                <p>{t('premium.store.loading_payment', 'Securing payment portal...')}</p>
            </div>
        );
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#FFD700',
                colorBackground: '#000000',
                colorText: '#ffffff',
                colorDanger: '#ff4757',
                fontFamily: 'Fredoka, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '12px',
            },
            rules: {
                '.Input': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                },
                '.Input:focus': {
                    border: '1px solid #FFD700',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
                },
                '.Tab': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                },
                '.Tab:hover': {
                    border: '1px solid #FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                },
                '.Tab--selected': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderColor: '#FFD700',
                }
            }
        },
    };

    return (
        <div className="checkout-overlay-container">
            <FormCloseButton onClick={onCancel} />
            <Elements key={clientSecret} stripe={stripePromise} options={options}>
                <CheckoutForm contentPackId={contentPackId} onSuccess={onSuccess} onCancel={onCancel} price={price} />
            </Elements>
        </div>
    );
};
