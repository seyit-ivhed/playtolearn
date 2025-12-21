import React from 'react';
import { useTranslation } from 'react-i18next';

interface AdventureHeaderProps {
    adventureId: string;
    adventureTitle: string;
}

export const AdventureHeader: React.FC<AdventureHeaderProps> = ({ adventureId, adventureTitle }) => {
    const { t } = useTranslation();

    return (
        <div className="map-header">
            <h1 className="map-title" data-testid="map-title">
                {t(`adventures.${adventureId}.title`, adventureTitle)}
            </h1>
        </div>
    );
};
