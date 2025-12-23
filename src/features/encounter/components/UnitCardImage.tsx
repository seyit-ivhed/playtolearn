import type { Companion } from '../../../types/companion.types';
import { getCompanionSprite } from '../../../data/companion-sprites';

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
                    src={!isMonster && companionData ? getCompanionSprite(companionData.id) : image}
                    alt={displayName}
                    className="unit-card-image"
                    draggable={false}
                />
            ) : (
                <div className="unit-card-placeholder" />
            )}
            {/* Gradient Overlay */}
            <div className="unit-card-gradient" />
        </div>
    );
};
