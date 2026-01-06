import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChapterHeaderProps {
    adventureId: string;
    adventureTitle?: string;
    isPrologue: boolean;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
    adventureId,
    adventureTitle,
    isPrologue
}) => {
    const { t } = useTranslation();

    return (
        <div className="chapter-header">
            <span className="chapter-number">
                {isPrologue ? t('adventures.prologue.prefix') : `${t('chronicle.chapter_prefix')} ${adventureId}`}
            </span>
            <h2 className="chapter-title" data-testid="chapter-title">
                {t(`adventures.${adventureId}.title`, adventureTitle || '???')}
            </h2>
        </div>
    );
};
