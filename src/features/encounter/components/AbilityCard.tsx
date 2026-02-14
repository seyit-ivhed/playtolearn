import './AbilityCard.css';

interface AbilityCardProps {
    abilityName: string;
    abilityDescription: string;
    progress?: number; // 0 to 100
    isUltimateReady?: boolean;
    isSimplified?: boolean;
    isMonster?: boolean;
    power?: number;
}

export const AbilityCard = ({
    abilityName,
    abilityDescription,
    progress = 0,
    isUltimateReady = false,
    isSimplified = false,
    isMonster = false,
    power
}: AbilityCardProps) => {
    return (
        <div className={`ability-card ${isUltimateReady ? 'ultimate-ready' : ''} ${isSimplified ? 'simplified' : ''} ${isMonster ? 'is-monster' : ''}`}>
            {/* Content Container */}
            <div className={`ability-content ${isSimplified ? 'simplified' : ''}`}>
                {isSimplified ? (
                    <>
                        <span className="ability-name">{abilityName}</span>
                        {power !== undefined && (
                            <span className="ability-power">{power}</span>
                        )}
                    </>
                ) : (
                    <>
                        {abilityName && (
                            <span className="ability-name">
                                {abilityName}
                            </span>
                        )}
                        <p className="ability-text">
                            {abilityDescription}
                        </p>
                    </>
                )}
            </div>

            {/* Integrated Spirit Progress Bar */}
            {!isMonster && (
                <div className="ability-progress-container">
                    <div
                        className="ability-progress-fill"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                </div>
            )}
        </div>
    );
};
