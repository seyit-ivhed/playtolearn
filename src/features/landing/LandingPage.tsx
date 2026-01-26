import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import './LandingPage.css';

type ViewMode = 'main' | 'login';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('main');

    // Login Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartNewGame = () => {
        navigate('/chronicle');
    };

    const handleLogInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signIn(email, password);
            navigate('/chronicle');
        } catch (err: unknown) {
            console.error('Failed to sign in:', err);
            setError(err instanceof Error ? err.message : 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-overlay" />

            <div className="landing-content">
                {viewMode === 'main' ? (
                    <>
                        <header className="landing-header">
                            <h1 className="landing-title">Play to Learn</h1>
                            <p className="landing-subtitle">Embark on an epic journey of knowledge and adventure.</p>
                        </header>

                        <main className="landing-actions">
                            <button
                                className="btn-primary landing-btn"
                                onClick={handleStartNewGame}
                                data-testid="start-new-game-btn"
                            >
                                Start New Game
                            </button>

                            <button
                                className="btn-secondary landing-btn"
                                onClick={() => setViewMode('login')}
                                data-testid="log-in-btn"
                            >
                                Log In to Existing Account
                            </button>
                        </main>
                    </>
                ) : (
                    <div className="login-form-container">
                        <button className="back-btn" onClick={() => setViewMode('main')}>
                            <ArrowLeft size={20} />
                            Back
                        </button>

                        <header className="landing-header">
                            <h2 className="landing-title-small">Welcome Back</h2>
                            <p className="landing-subtitle">Sign in to continue your adventure.</p>
                        </header>

                        <form onSubmit={handleLogInSubmit} className="landing-form">
                            <div className="landing-input-group">
                                <label htmlFor="email">
                                    <Mail size={16} />
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

                            <div className="landing-input-group">
                                <label htmlFor="password">
                                    <Lock size={16} />
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
                                <div className="landing-error">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary landing-btn"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="spinner" /> : 'Log In'}
                            </button>
                        </form>
                    </div>
                )}

                <footer className="landing-footer">
                    <p>Begin your chronicle today.</p>
                </footer>
            </div>
        </div>
    );
};
