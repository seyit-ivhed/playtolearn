interface AbilityCardProps {
    abilityName: string;
    abilityDescription: string;
}

export const AbilityCard = ({ abilityName, abilityDescription }: AbilityCardProps) => {
    return (
        <div className="ability-card">
            <div className="flex flex-col items-center justify-center">
                {abilityName && (
                    <span className="ability-name uppercase text-xs font-bold text-amber-900 mb-1">
                        {abilityName}
                    </span>
                )}
                <p className="ability-text">
                    {abilityDescription}
                </p>
            </div>
        </div>
    );
};
