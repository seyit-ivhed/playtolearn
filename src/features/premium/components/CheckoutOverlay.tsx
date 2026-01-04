import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentService } from '../../../services/payment.service';
import { CheckoutForm } from './CheckoutForm';
import { useTranslation } from 'react-i18next';

interface CheckoutOverlayProps {
    contentPackId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({
    contentPackId,
    onSuccess,
    onCancel
}) => {
    const { t } = useTranslation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const stripePromise = PaymentService.getStripe();

    useEffect(() => {
        PaymentService.createPaymentIntent(contentPackId)
            .then(data => {
                setClientSecret(data.clientSecret);
            })
            .catch(err => {
                console.error('Failed to create payment intent:', err);
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
                colorPrimary: '#e5c05b',
                colorBackground: '#1a1a2e',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
            rules: {
                '.Input': {
                    backgroundColor: '#2a2a40',
                    border: '1px solid #e5c05b33',
                },
                '.Input:focus': {
                    border: '1px solid #e5c05b',
                    boxShadow: '0 0 0 2px #e5c05b1a',
                }
            }
        },
    };

    return (
        <div className="checkout-overlay-container">
            <Elements key={clientSecret} stripe={stripePromise} options={options}>
                <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
            </Elements>
        </div>
    );
};
