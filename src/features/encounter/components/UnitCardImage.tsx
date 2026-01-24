import type { Companion } from '../../../types/companion.types';
import { getCompanionCardImage } from '../../../data/companion-sprites';

interface UnitCardImageProps {
    isMonster: boolean;
    companionData: Companion | null;
    image?: string;
    level?: number;
    displayName: string;
}

export const UnitCardImage = ({
    isMonster,
    companionData,
    image,
    level = 1,
    displayName
}: UnitCardImageProps) => {
    return (
        <div className="unit-card-bg">
            {(!isMonster && (image || companionData)) || (isMonster && image) ? (
                <img
                    src={image || (companionData ? getCompanionCardImage(companionData.id, level) : '')}
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
