import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import styles from '../../ChronicleBook.module.css';

interface BookLoginProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const BookLogin: React.FC<BookLoginProps> = ({ onBack, onSuccess }) => {
    const { signIn } = useAuth();

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signIn(email, password);
            onSuccess();
        } catch (err: unknown) {
            console.error('Failed to sign in:', err);
            setError(err instanceof Error ? err.message : 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPageContent}>
            <button className={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={16} />
                <span>Back to Cover</span>
            </button>

            <header className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>Member Access</h2>
                <div className={styles.divider} />
            </header>

            <form onSubmit={handleLogInSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">
                        <Mail size={14} />
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">
                        <Lock size={14} />
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    className={`${styles.bookBtn} ${styles.btnPrimary} ${styles.fullWidth}`}
                    disabled={loading}
                >
                    {loading ? <Loader2 className={styles.spinner} /> : 'Open Journal'}
                </button>
            </form>
        </div>
    );
};
