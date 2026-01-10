import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../services/supabase.service';


interface AccountCreationStepProps {
    onSuccess: () => void;
}

export const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
    onSuccess
}) => {
    const { t } = useTranslation();
    const { refreshSession } = useAuth();
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !email.includes('@')) {
            setError(t('premium.store.account.errors.invalid_email'));
            return;
        }

        if (email !== confirmEmail) {
            setError(t('premium.store.account.errors.emails_dont_match'));
            return;
        }

        if (password.length < 6) {
            setError(t('premium.store.account.errors.weak_password'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Ensure we have a session and the user is ANONYMOUS
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            let session = currentSession;

            if (!session) {
                console.log('No session found, creating anonymous session first...');
                const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
                if (signInError) throw signInError;
                session = signInData.session;
            }

            if (session?.user && !session.user.is_anonymous) {
                console.warn('User is already authenticated. Skipping conversion.');
                onSuccess();
                return;
            }

            console.log('Converting session for email:', email);

            // 2. Convert to permanent user
            // We use updateUser to add email/password to the existing anonymous session.
            const { error: updateError } = await supabase.auth.updateUser({
                email,
                password
            });

            if (updateError) {
                // If the email is already taken, Supabase returns 422 or specific message
                if (updateError.message.toLowerCase().includes('already registered') ||
                    updateError.message.toLowerCase().includes('already in use') ||
                    updateError.status === 422) {
                    setError(t('premium.store.account.errors.already_exists', 'This email is already registered. Please sign in with your existing account.'));
                } else {
                    throw updateError;
                }
            } else {
                console.log('Account conversion triggered successfully. Finalizing profile...');

                // 3. Ensure a player profile exists and is updated
                // This also ensures the Edge Function can find it immediately
                const userId = session?.user.id;
                if (userId) {
                    console.log('Synchronizing player profile for:', userId);
                    const { data: profile } = await supabase
                        .from('player_profiles')
                        .select('id')
                        .eq('auth_id', userId)
                        .maybeSingle();

                    if (!profile) {
                        console.log('No existing profile found, creating a new one...');
                        await supabase.from('player_profiles').insert({
                            auth_id: userId
                        });
                    } else {
                        console.log('Updating existing profile state...');
                        // Profile exists, no specific update needed for anonymous flag as it's handled by auth
                        console.log('Profile exists, proceeding...');
                    }
                }

                console.log('Refreshing session...');

                // 4. Force a session refresh to get the updated JWT
                await refreshSession();

                // 5. Double check we have a valid session now
                const { data: { session: updatedSession } } = await supabase.auth.getSession();
                console.log('Post-conversion session check:', updatedSession ? 'Valid' : 'Missing');

                if (!updatedSession) {
                    console.error('Session not found after conversion. This might happen if Email Confirmation is enabled.');
                }

                // 6. Slightly longer delay to ensure the session is propagated before proceeding to checkout
                await new Promise(resolve => setTimeout(resolve, 1500));
                onSuccess();
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.error('Account creation error:', error);
            setError(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="account-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
        >
            <div className="account-icon">
                <ShieldCheck size={48} />
            </div>

            <h3 className="account-title">{t('premium.store.account.title')}</h3>
            <p className="account-subtitle">{t('premium.store.account.subtitle')}</p>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="input-group">
                    <label>
                        <Mail size={16} />
                        {t('premium.store.account.email_label')}
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('premium.store.account.email_placeholder')}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <label>
                        <Mail size={16} />
                        {t('premium.store.account.confirm_email_label')}
                    </label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder={t('premium.store.account.email_placeholder')}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <label>
                        <Lock size={16} />
                        {t('premium.store.account.password_label')}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('premium.store.account.password_placeholder')}
                        required
                        disabled={loading}
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="form-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="account-actions single-action">
                    <button
                        type="submit"
                        className="create-btn"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="spinner" /> : t('premium.store.account.continue_btn')}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
