import React from 'react';
import type { Adventure } from '../../../types/adventure.types';
import { AdventureStatus } from '../../../types/adventure.types';
import { getAdventureIllustration } from '../../../data/adventure-assets';
import { ChapterHeader } from './ChapterHeader';
import { ChapterIllustration } from './ChapterIllustration';
import { ChapterStory } from './ChapterStory';
import { ChapterActions } from './ChapterActions';
import './ChapterPage.css';

interface ChapterPageProps {
    adventure: Adventure;
    status: AdventureStatus;
    stars: number;
    onBegin: (id: string) => void;
    onReplay: (id: string) => void;
    onNext: () => void;
    onPrev: () => void;
    canNext: boolean;
    canPrev: boolean;
    currentPage: number;
    totalPages: number;
    isJustCompleted?: boolean;
    isPremiumLocked?: boolean;
    hasProgress: boolean;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({
    adventure,
    status,
    stars,
    onBegin,
    onReplay,
    onNext,
    onPrev,
    canNext,
    canPrev,

    currentPage,
    totalPages,
    isJustCompleted,
    isPremiumLocked,
    hasProgress
}) => {
    const isPrologue = adventure.id === 'prologue';
    const isProgressionLocked = !isPrologue && status === AdventureStatus.LOCKED;
    const isLocked = isProgressionLocked || isPremiumLocked;
    const isCompleted = status === AdventureStatus.COMPLETED;
    const illustration = getAdventureIllustration(adventure.id);

    return (
        <div className={`chapter-page ${isLocked ? 'locked' : ''}`} data-testid="chapter-page">
            <ChapterHeader
                adventureId={adventure.id}
                adventureTitle={adventure.title}
                isPrologue={isPrologue}
            />

            <div className="chapter-content">
                <ChapterIllustration
                    illustration={illustration}
                    adventureTitle={adventure.title || ''}
                    isLocked={isLocked}
                />

                <ChapterStory
                    adventureId={adventure.id}
                    adventureStoryHook={adventure.storyHook}
                    adventureDescription={adventure.description}
                    isLocked={isLocked}
                    isPrologue={isPrologue}
                    isCompleted={isCompleted}
                    isJustCompleted={isJustCompleted}
                    stars={stars}
                />
            </div>

            <ChapterActions
                adventureId={adventure.id}
                onBegin={onBegin}
                onReplay={onReplay}
                onNext={onNext}
                onPrev={onPrev}
                canNext={canNext}
                canPrev={canPrev}
                isPrologue={isPrologue}
                isLocked={isLocked}
                isPremiumLocked={isPremiumLocked}
                isProgressionLocked={isProgressionLocked}
                isCompleted={isCompleted}
                isJustCompleted={isJustCompleted}
                currentPage={currentPage}
                totalPages={totalPages}
                hasProgress={hasProgress}
            />
        </div>
    );
};
