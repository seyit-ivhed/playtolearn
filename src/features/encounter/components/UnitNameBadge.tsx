import './UnitNameBadge.css';

interface UnitNameBadgeProps {
    displayName: string;
}

export const UnitNameBadge = ({ displayName }: UnitNameBadgeProps) => {
    return (
        <div className="unit-card-name-badge">
            <h3 className="unit-card-name-text">
                {displayName}
            </h3>
        </div>
    );
};
