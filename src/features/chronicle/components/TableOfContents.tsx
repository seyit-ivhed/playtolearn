import { useTranslation } from 'react-i18next';
import { FormCloseButton } from '../../../components/ui/FormCloseButton';
import type { Volume, AdventureId } from '../../../types/adventure.types';
import { AdventureStatus } from '../../../types/adventure.types';
import { resolveVolumeAdventures } from '../utils/chronicle.utils';
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
                <div className="toc-header">
                    <FormCloseButton onClick={onClose} size={32} />
                    <h1 className="toc-title">{t('chronicle.title')}</h1>
                    <h2 className="toc-subtitle">{t('chronicle.subtitle')}</h2>
                </div>

                <div className="volumes-list">
                    {volumes.map(volume => (
                        <div key={volume.id} className={`volume-section ${volume.isLocked ? 'locked' : ''}`}>
                            <h3 className="volume-title">
                                {t(`volumes.${volume.id}.title`, volume.title)}
                                {volume.isLocked && <span className="lock-tag">🔒 ${volume.price}</span>}
                            </h3>

                            <ul className="chapters-list">
                                {resolveVolumeAdventures(volume, t).map((adventure, index) => {
                                    const adventureId = adventure.id;
                                    const status = adventureStatuses[adventureId] || AdventureStatus.LOCKED;
                                    const isAvailable = status !== AdventureStatus.LOCKED && !volume.isLocked;

                                    return (
                                        <li
                                            key={adventureId}
                                            className={`chapter-item ${!isAvailable ? 'disabled' : ''} ${activeAdventureId === adventureId ? 'active' : ''}`}
                                            onClick={() => {
                                                if (isAvailable) {
                                                    onJumpToChapter(volume.id, adventureId);
                                                }
                                            }}
                                            data-testid={`toc-chapter-item-${adventureId}`}
                                        >
                                            {activeAdventureId === adventureId && (
                                                <div className="bookmark-ribbon" title="Active Adventure" data-testid="bookmark-ribbon" />
                                            )}
                                            <span className="chapter-marker">
                                                {status === AdventureStatus.COMPLETED ? '✓' : index + 1}
                                            </span>
                                            <span className="chapter-link">
                                                {adventureTitles[adventureId] || `Chapter ${adventureId}`}
                                            </span>
                                            {status === AdventureStatus.COMPLETED && <span className="stars-mini">⭐⭐⭐</span>}
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
