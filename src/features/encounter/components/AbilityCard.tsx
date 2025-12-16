interface AbilityCardProps {
    abilityName: string;
    abilityDescription: string;
    progress?: number; // 0 to 100
    isUltimateReady?: boolean;
}

export const AbilityCard = ({
    abilityName,
    abilityDescription,
    progress = 0,
    isUltimateReady = false
}: AbilityCardProps) => {
    return (
        <div className={`ability-card ${isUltimateReady ? 'ultimate-ready' : ''}`}>
            {/* Content Container */}
            <div className="ability-content">
                {abilityName && (
                    <span className="ability-name">
                        {abilityName}
                    </span>
                )}
                <p className="ability-text">
                    {abilityDescription}
                </p>
            </div>

            {/* Integrated Spirit Progress Bar */}
            <div className="ability-progress-container">
                <div
                    className="ability-progress-fill"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
        </div>
    );
};
