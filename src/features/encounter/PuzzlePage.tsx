import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useGameStore } from '../../stores/game/store';
import { usePlayerStore } from '../../stores/player.store';
import { ADVENTURES } from '../../data/adventures.data';
import { PuzzleType } from '../../types/adventure.types';
import { type DifficultyLevel } from '../../types/math.types';
import { generatePuzzleData } from '../../utils/math-generator';
import { SumTargetPuzzle } from './puzzles/SumTargetPuzzle';
import { BalancePuzzle } from './puzzles/BalancePuzzle';
import { SequencePuzzle } from './puzzles/SequencePuzzle';
import { GuardianTributePuzzle } from './puzzles/GuardianTributePuzzle';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import styles from './PuzzlePage.module.css';

const PuzzlePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { nodeId } = useParams<{ nodeId: string }>();
    const { activeAdventureId, currentMapNode, completeEncounter, activeEncounterDifficulty, encounterResults } = useGameStore();
    const { difficulty } = usePlayerStore();

    const [isCompleted, setIsCompleted] = useState(false);

    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

    // Find encounter either by ID from URL or fallback to current node
    const encounter = nodeId
        ? adventure?.encounters.find(e => e.id === nodeId)
        : adventure?.encounters[currentMapNode - 1];

    const encounterIndex = adventure?.encounters.findIndex(e => e.id === encounter?.id) ?? -1;
    const isLocked = encounterIndex + 1 > currentMapNode;

    // Use XP reward from encounter data
    const xpReward = encounter?.xpReward ?? 0;

    // Check if this is the first time completing this node
    const encounterKey = `${activeAdventureId}_${encounterIndex + 1}`;
    const isFirstTime = !encounterResults[encounterKey];

    // Dynamically generate puzzle values based on difficulty
    const puzzleData = useMemo(() => {
        const pType = encounter?.puzzleData?.puzzleType;
        if (!pType) return null;
        // Prefer explicit encounter difficulty if set, fallback to player preference
        const currentDifficulty = (activeEncounterDifficulty || difficulty) as DifficultyLevel;
        return generatePuzzleData(pType, currentDifficulty);
    }, [encounter, difficulty, activeEncounterDifficulty]);

    console.log('[PuzzlePage] Debug Info:', {
        nodeId,
        activeAdventureId,
        currentMapNode,
        encounterIndex,
        isLocked,
        foundEncounter: encounter?.id,
        difficulty,
        hasPuzzleData: !!puzzleData,
        xpReward
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
        setIsCompleted(true);
    };

    const handleCompletionContinue = () => {
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
                    {t(`adventures.${activeAdventureId}.nodes.${encounter.id}.label`, encounter.label || '')}
                </h1>
            </header>

            <main className={styles.puzzleContent}>
                {(puzzleData.puzzleType === PuzzleType.SUM_TARGET || puzzleData.puzzleType === PuzzleType.IRRIGATION) && (
                    <SumTargetPuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {(puzzleData.puzzleType === PuzzleType.BALANCE || puzzleData.puzzleType === PuzzleType.CUNEIFORM) && (
                    <BalancePuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {puzzleData.puzzleType === PuzzleType.SEQUENCE && (
                    <SequencePuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {puzzleData.puzzleType === PuzzleType.GUARDIAN_TRIBUTE && (
                    <GuardianTributePuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}
            </main>

            {/* Completion Modal */}
            {isCompleted && (
                <EncounterCompletionModal
                    result="VICTORY"
                    onContinue={handleCompletionContinue}
                    xpReward={xpReward}
                    difficulty={(activeEncounterDifficulty || difficulty) as number}
                    isFirstTime={isFirstTime}
                />
            )}
        </div>
    );
};

export default PuzzlePage;
