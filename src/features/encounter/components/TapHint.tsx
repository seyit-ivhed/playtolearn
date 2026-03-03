import './TapHint.css';

export const TapHint = () => {
    return (
        <div className="tap-hint" data-testid="tap-hint">
            <div className="tap-hint-icon">👆</div>
            <div className="tap-hint-ripple" />
        </div>
    );
};
