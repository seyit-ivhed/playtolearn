import React from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
    error?: string | null;
    onRetry?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, onRetry }) => {
    return (
        <div className="loading-screen" id="global-loading-screen">
            <div className="loading-content">
                {!error ? (
                    <>
                        <div className="loading-orb"></div>
                        <div className="loading-text">
                            INITIALIZING ADVENTURE
                            <span className="loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="error-container">
                        <h2 className="error-title">Connection Error</h2>
                        <p className="error-message">
                            {error || 'We encountered a problem connecting to the server. Please check your internet connection and try again.'}
                        </p>
                        <button className="retry-button" onClick={onRetry}>
                            RETRY CONNECTION
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
