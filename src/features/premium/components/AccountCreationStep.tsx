import { Mail, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../services/supabase.service';
import './Premium.css';

interface AccountCreationStepProps {
    onSuccess: () => void;
}

export const AccountCreationStep: React.FC<AccountCreationStepProps> = ({
    onSuccess
}) => {
    const { t } = useTranslation();
    const { user, signInAnonymously } = useAuth();
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
            // 1. Ensure we have an anonymous session first if none exists
            if (!user) {
                console.log('No guest session found, creating one before conversion...');
                await signInAnonymously();
            }

            // 2. Convert anonymous user to permanent user
            const { error: updateError } = await supabase.auth.updateUser({
                email,
                password
            });

            if (updateError) {
                if (updateError.message.includes('already registered')) {
                    setError(t('premium.store.account.errors.already_exists'));
                } else {
                    throw updateError;
                }
            } else {
                onSuccess();
            }
        } catch (err: any) {
            console.error('Account creation error:', err);
            setError(err.message || 'Failed to create account');
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
