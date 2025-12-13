interface SpiritBarProps {
    currentSpirit: number;
}

export const SpiritBar = ({ currentSpirit }: SpiritBarProps) => {
    return (
        <div className="spirit-bar-container">
            <div
                className="spirit-bar-fill"
                style={{ width: `${currentSpirit}%` }}
            />
        </div>
    );
};
