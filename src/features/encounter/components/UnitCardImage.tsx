import type { Companion } from '../../../data/companions.data';

interface UnitCardImageProps {
    isMonster: boolean;
    companionData: Companion | null;
    image?: string;
    displayName: string;
}

export const UnitCardImage = ({
    isMonster,
    companionData,
    image,
    displayName
}: UnitCardImageProps) => {
    return (
        <div className="unit-card-bg">
            {(!isMonster && companionData) || (isMonster && image) ? (
                <img
                    src={!isMonster && companionData ? companionData.image : image}
                    alt={displayName}
                    className="unit-card-image"
                />
            ) : (
                <div className="unit-card-placeholder" />
            )}
            {/* Gradient Overlay */}
            <div className="unit-card-gradient" />
        </div>
    );
};
