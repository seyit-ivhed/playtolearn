import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../services/supabase.service';
import './Premium.css';

interface CheckoutFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel }) => {
    const { t } = useTranslation();
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // Get current user email for billing details (required because we hide the email field)
            const { data: { user } } = await supabase.auth.getUser();

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/premium-success`,
                    payment_method_data: {
                        billing_details: {
                            email: user?.email || '',
                        }
                    }
                },
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess();
            } else {
                setIsProcessing(false);
            }
        } catch (err: any) {
            console.error('Submission error:', err);
            setErrorMessage(err.message || 'An unexpected error occurred');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <PaymentElement options={{
                layout: 'tabs',
                fields: {
                    billingDetails: {
                        email: 'never'
                    },
                },
                wallets: {
                    applePay: 'never',
                    googlePay: 'never',
                    // This is the most direct way to disable Stripe Link in the UI
                    // even if it's technically enabled in the dashboard.
                    // @ts-ignore - Stripe types sometimes lag for newer beta options
                    link: 'never'
                }
            }} />

            {errorMessage && <div className="payment-error">{errorMessage}</div>}

            <div className="checkout-actions">
                <button
                    type="submit"
                    className="pay-button"
                    disabled={isProcessing || !stripe || !elements}
                >
                    {isProcessing ? t('common.processing', 'Processing...') : t('premium.store.buy_now')}
                </button>
                <button
                    type="button"
                    className="cancel-button-link"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    {t('common.cancel', 'Cancel')}
                </button>
            </div>
        </form>
    );
};
