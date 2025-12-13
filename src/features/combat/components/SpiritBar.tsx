interface SpiritBarProps {
    currentSpirit: number;
    specialAbilityName: string;
}

export const SpiritBar = ({ currentSpirit, specialAbilityName }: SpiritBarProps) => {
    return (
        <div className="spirit-bar-container">
            <div
                className="spirit-bar-fill"
                style={{ width: `${currentSpirit}%` }}
            />
            <div className="spirit-bar-label">
                {specialAbilityName}
            </div>
        </div>
    );
};
