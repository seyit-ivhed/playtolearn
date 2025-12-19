import './UnitLevelBadge.css';

interface UnitLevelBadgeProps {
    level: number;
}

export const UnitLevelBadge: React.FC<UnitLevelBadgeProps> = ({ level }) => {
    return (
        <div className="unit-level-badge-container" data-testid="unit-level-badge">
            <svg className="gem-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <radialGradient id="gemGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                        <stop offset="0%" stopColor="#2ecc71" />
                        <stop offset="60%" stopColor="#27ae60" />
                        <stop offset="100%" stopColor="#145a32" />
                    </radialGradient>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f1c40f" />
                        <stop offset="30%" stopColor="#f39c12" />
                        <stop offset="70%" stopColor="#f1c40f" />
                        <stop offset="100%" stopColor="#d35400" />
                    </linearGradient>
                    <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                        <stop offset="50%" stopColor="rgba(255, 255, 255, 0)" />
                    </linearGradient>
                </defs>
                {/* Hexagon Shape */}
                <polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    className="gem-shape"
                />
                {/* Shine Overlay */}
                <polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    fill="url(#shineGradient)"
                    style={{ pointerEvents: 'none' }}
                />
            </svg>
            <span className="level-text">{level}</span>
        </div>
    );
};
