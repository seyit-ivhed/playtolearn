import React from 'react';
import { useTranslation } from 'react-i18next';

interface AdventureHeaderProps {
    adventureId: string;
    adventureTitle: string;
    onBack: () => void;
}

export const AdventureHeader: React.FC<AdventureHeaderProps> = ({ adventureId, adventureTitle, onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="map-header">
            <button className="header-back-button" onClick={onBack} title="Back to Chronicle">
                📖
            </button>
            <h1 className="map-title" data-testid="map-title">
                {t(`adventures.${adventureId}.title`, adventureTitle)}
            </h1>
            <div className="header-right-spacer" />
        </div>
    );
};
