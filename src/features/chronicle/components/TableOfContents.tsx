import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { Volume, AdventureId, AdventureStatus } from '../../../types/adventure.types';
import './TableOfContents.css';

interface TableOfContentsProps {
    volumes: Volume[];
    adventureStatuses: Record<AdventureId, AdventureStatus>;
    adventureTitles: Record<AdventureId, string>;
    activeAdventureId: AdventureId | null;
    onJumpToChapter: (volumeId: string, adventureId: string) => void;
    onClose: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
    volumes,
    adventureStatuses,
    adventureTitles,
    activeAdventureId,
    onJumpToChapter,
    onClose
}) => {
    const { t } = useTranslation();

    return (
        <div className="toc-overlay" data-testid="toc-overlay">
            <div className="toc-container" data-testid="toc-container">
                <button className="close-toc" onClick={onClose} aria-label="Close Table of Contents" data-testid="close-toc-btn">
                    <X size={32} />
                </button>
                <h1 className="toc-title">{t('chronicle.title')}</h1>
                <h2 className="toc-subtitle">{t('chronicle.subtitle')}</h2>



                <div className="volumes-list">
                    {volumes.map(volume => (
                        <div key={volume.id} className={`volume-section ${volume.isLocked ? 'locked' : ''}`}>
                            <h3 className="volume-title">
                                {volume.title}
                                {volume.isLocked && <span className="lock-tag">🔒 ${volume.price}</span>}
                            </h3>

                            <ul className="chapters-list">
                                {volume.adventureIds.map((adventureId, index) => {
                                    const status = adventureStatuses[adventureId] || 'LOCKED';
                                    const isAvailable = status !== 'LOCKED' && !volume.isLocked;

                                    return (
                                        <li
                                            key={adventureId}
                                            className={`chapter-item ${!isAvailable ? 'disabled' : ''} ${activeAdventureId === adventureId ? 'active' : ''}`}
                                            onClick={() => isAvailable && onJumpToChapter(volume.id, adventureId)}
                                            data-testid={`toc-chapter-item-${adventureId}`}
                                        >
                                            {activeAdventureId === adventureId && <div className="bookmark-ribbon" title="Active Adventure" data-testid="bookmark-ribbon" />}
                                            <span className="chapter-marker">
                                                {status === 'COMPLETED' ? '✓' : index + 1}
                                            </span>
                                            <span className="chapter-link">
                                                {adventureTitles[adventureId] || `Chapter ${adventureId}`}
                                            </span>
                                            {status === 'COMPLETED' && <span className="stars-mini">⭐⭐⭐</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
