import React from 'react';
import { useTranslation } from 'react-i18next';
import './PageNavigation.css';

interface PageNavigationProps {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
    currentPage,
    totalPages,
    onPrev,
    onNext,
    canPrev,
    canNext
}) => {
    const { t } = useTranslation();

    return (
        <div className="page-navigation" data-testid="page-navigation">
            <button
                className="nav-btn prev-btn"
                onClick={onPrev}
                disabled={!canPrev}
                aria-label={t('chronicle.prev')}
                data-testid="prev-page-btn"
            >
                {t('chronicle.prev')}
            </button>

            <div className="page-indicator" data-testid="page-indicator">
                {t('chronicle.page_x_of_y', { current: currentPage, total: totalPages })}
            </div>

            <button
                className="nav-btn next-btn"
                onClick={onNext}
                disabled={!canNext}
                aria-label={t('chronicle.next')}
                data-testid="next-page-btn"
            >
                {t('chronicle.next')}
            </button>
        </div>
    );
};
