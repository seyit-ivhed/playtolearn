import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChapterStoryProps {
    adventureId: string;
    adventureStoryHook?: string;
    isLocked: boolean | undefined;
}

export const ChapterStory: React.FC<ChapterStoryProps> = ({
    adventureId,
    adventureStoryHook,
    isLocked
}) => {
    const { t } = useTranslation();

    return (
        <div className="chapter-details" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="story-scroll-container">
                <p className="story-hook">
                    {isLocked
                        ? t('chronicle.mystery_path')
                        : t(`adventures.${adventureId}.story_hook`, adventureStoryHook || '')
                    }
                </p>
            </div>
        </div>
    );
};
