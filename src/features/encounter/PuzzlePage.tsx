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
import { BalancePuzzle } from './puzzles/balance/BalancePuzzle';
import { SequencePuzzle } from './puzzles/SequencePuzzle';
import { GuardianTributePuzzle } from './puzzles/guardian-tribute/GuardianTributePuzzle';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import styles from './PuzzlePage.module.css';

const PuzzlePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { adventureId, nodeIndex: nodeIndexParam } = useParams<{ adventureId: string; nodeIndex: string }>();
    const nodeIndex = parseInt(nodeIndexParam || '1', 10);
    const { completeEncounter, activeEncounterDifficulty, encounterResults } = useGameStore();
    const { difficulty } = usePlayerStore();

    const [isCompleted, setIsCompleted] = useState(false);

    const adventure = ADVENTURES.find(a => a.id === adventureId);

    // Find encounter by nodeIndex
    const encounter = adventure?.encounters[nodeIndex - 1];

    // Puzzles are generally not locked in the new system if you have the URL
    // but we can still check progress if we want to be strict.
    const isLocked = false;

    // Use XP reward from encounter data
    const xpReward = encounter?.xpReward ?? 0;

    // Check if this is the first time completing this node
    const encounterKey = `${adventureId}_${nodeIndex}`;
    const isFirstTime = !encounterResults[encounterKey];

    // Dynamically generate puzzle values based on difficulty
    const puzzleData = useMemo(() => {
        const pType = encounter?.puzzleData?.puzzleType;
        if (!pType) return null;
        // Prefer explicit encounter difficulty if set, fallback to player preference
        const currentDifficulty = (activeEncounterDifficulty || difficulty) as DifficultyLevel;
        return generatePuzzleData(pType, currentDifficulty);
    }, [encounter, difficulty, activeEncounterDifficulty]);

    if (!encounter || !puzzleData || isLocked) {
        return (
            <div className={styles.errorContainer}>
                <h2>{isLocked ? t('puzzle.locked', 'Puzzle Locked') : t('puzzle.not_found', 'Puzzle Not Found')}</h2>
                <div style={{ margin: '1rem', color: '#666' }}>
                    {isLocked ? t('puzzle.locked_desc', 'You haven\'t reached this part of the journey yet!') : (
                        `Node Index: ${nodeIndex}`
                    )}
                </div>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(`/map/${adventureId}`)}
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
        if (adventureId) {
            completeEncounter(adventureId, nodeIndex);
            navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex + 1 } });
        } else {
            navigate('/chronicle');
        }
    };

    const handleBack = () => {
        navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex } });
    };

    return (
        <div className={styles.puzzlePage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    {t('retreat', 'Retreat')}
                </button>
                <h1 className={styles.title}>
                    {t(`adventures.${adventureId}.nodes.${encounter.id}.label`, encounter.label || '')}
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
