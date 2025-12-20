import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useGameStore } from '../../stores/game.store';
import { usePlayerStore } from '../../stores/player.store';
import { ADVENTURES } from '../../data/adventures.data';
import { PuzzleType } from '../../types/adventure.types';
import { generatePuzzleData } from '../../utils/math-generator';
import { SumTargetPuzzle } from './puzzles/SumTargetPuzzle';
import styles from './PuzzlePage.module.css';

const PuzzlePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { nodeId } = useParams<{ nodeId: string }>();
    const { activeAdventureId, currentMapNode, completeEncounter } = useGameStore();
    const { difficulty } = usePlayerStore();

    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    // Find encounter either by ID from URL or fallback to current node
    const encounter = nodeId
        ? adventure?.encounters.find(e => e.id === nodeId)
        : adventure?.encounters[currentMapNode - 1];

    const encounterIndex = adventure?.encounters.findIndex(e => e.id === encounter?.id) ?? -1;
    const isLocked = encounterIndex + 1 > currentMapNode;

    // Dynamically generate puzzle values based on difficulty
    const puzzleData = useMemo(() => {
        if (!encounter?.puzzleData) return null;
        return generatePuzzleData(encounter.puzzleData.puzzleType, difficulty);
    }, [encounter?.puzzleData?.puzzleType, difficulty]);

    console.log('[PuzzlePage] Debug Info:', {
        nodeId,
        activeAdventureId,
        currentMapNode,
        encounterIndex,
        isLocked,
        foundEncounter: encounter?.id,
        difficulty,
        hasPuzzleData: !!puzzleData
    });

    if (!encounter || !puzzleData || isLocked) {
        return (
            <div className={styles.errorContainer}>
                <h2>{isLocked ? t('puzzle.locked', 'Puzzle Locked') : t('puzzle.not_found', 'Puzzle Not Found')}</h2>
                <div style={{ margin: '1rem', color: '#666' }}>
                    {isLocked ? t('puzzle.locked_desc', 'You haven\'t reached this part of the journey yet!') : (
                        `Node ID: ${nodeId || 'none'} | Index: ${currentMapNode}`
                    )}
                </div>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/map')}
                >
                    {t('back_to_map', 'Back to Map')}
                </button>
            </div>
        );
    }


    const handleSolve = () => {
        completeEncounter(encounterIndex + 1);
        navigate('/map');
    };

    const handleBack = () => {
        navigate('/map');
    };

    return (
        <div className={styles.puzzlePage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    {t('retreat', 'Retreat')}
                </button>
                <h1 className={styles.title}>
                    {t(`adventures.${activeAdventureId}.nodes.${encounter.id}.label`, encounter.label)}
                </h1>
            </header>

            <main className={styles.puzzleContent}>
                {puzzleData.puzzleType === PuzzleType.SUM_TARGET && (
                    <SumTargetPuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {puzzleData.puzzleType === PuzzleType.BALANCE && (
                    <div className={styles.placeholder}>
                        <h3>{t('puzzle.coming_soon', 'Balance Puzzle Coming Soon!')}</h3>
                        <button onClick={handleSolve}>[Debug: Win Puzzle]</button>
                    </div>
                )}

                {puzzleData.puzzleType === PuzzleType.SEQUENCE && (
                    <div className={styles.placeholder}>
                        <h3>{t('puzzle.coming_soon', 'Sequence Puzzle Coming Soon!')}</h3>
                        <button onClick={handleSolve}>[Debug: Win Puzzle]</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PuzzlePage;
