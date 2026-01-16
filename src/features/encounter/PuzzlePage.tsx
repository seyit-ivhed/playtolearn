import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { useGameStore } from '../../stores/game/store';
import { usePremiumStore } from '../../stores/premium.store';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { ADVENTURES } from '../../data/adventures.data';
import { PuzzleType } from '../../types/adventure.types';
import { type DifficultyLevel } from '../../types/math.types';
import { generatePuzzleData } from '../../utils/math-generator';
import { motion } from 'framer-motion';
import { SumTargetPuzzle } from './puzzles/sum-target/SumTargetPuzzle';
import { BalancePuzzle } from './puzzles/balance/BalancePuzzle';
import { SequencePuzzle } from './puzzles/sequence/SequencePuzzle';
import { GuardianTributePuzzle } from './puzzles/guardian-tribute/GuardianTributePuzzle';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import styles from './PuzzlePage.module.css';

const PuzzlePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { adventureId, nodeIndex: nodeIndexParam } = useParams<{ adventureId: string; nodeIndex: string }>();
    const nodeIndex = parseInt(nodeIndexParam || '1', 10);
    const { completeEncounter, activeEncounterDifficulty, encounterResults } = useGameStore();
    const isProgressionUnlocked = useGameStore(state => state.isAdventureUnlocked);
    const {
        isAdventureUnlocked: isPremiumUnlocked,
        initialized: premiumInitialized
    } = usePremiumStore();


    const [isCompleted, setIsCompleted] = useState(false);

    const adventure = ADVENTURES.find(a => a.id === adventureId);

    // Find encounter by nodeIndex
    const encounter = adventure?.encounters[nodeIndex - 1];

    // Progression and premium gates are handled above
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
        const currentDifficulty = activeEncounterDifficulty as DifficultyLevel;
        return generatePuzzleData(pType, currentDifficulty);
    }, [encounter, activeEncounterDifficulty]);

    const instruction = useMemo(() => {
        if (!puzzleData) return '';
        switch (puzzleData.puzzleType) {
            case PuzzleType.SUM_TARGET:
                return t('puzzle.flask.target', { target: puzzleData.targetValue });
            case PuzzleType.BALANCE:
            case PuzzleType.CUNEIFORM:
                return t('puzzle.balance.instruction', 'Remove stones until both piles are of equal height!');
            case PuzzleType.SEQUENCE:
                return t('puzzle.sequence.instruction', 'Connect the stars in order!');
            case PuzzleType.GUARDIAN_TRIBUTE:
                return t('puzzle.guardian_tribute.instruction', 'Distribute the gems among the statues');
            default:
                return '';
        }
    }, [puzzleData, t]);

    const isBalancePuzzle = puzzleData?.puzzleType === PuzzleType.BALANCE || puzzleData?.puzzleType === PuzzleType.CUNEIFORM;

    useEffect(() => {
        if (premiumInitialized && adventureId) {
            const access = checkNavigationAccess({
                adventureId,
                nodeIndex,
                isPremiumUnlocked,
                isProgressionUnlocked,
                encounterResults
            });

            if (!access.allowed) {
                navigate('/chronicle', { replace: true });
            }
        }
    }, [premiumInitialized, adventureId, nodeIndex, isPremiumUnlocked, isProgressionUnlocked, encounterResults, navigate]);

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

    return (
        <div className={`${styles.puzzlePage} ${isBalancePuzzle ? styles.blackBg : ''}`}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    {t('retreat', 'Retreat')}
                </button>
            </header>

            <main className={styles.puzzleContent}>
                {puzzleData.puzzleType === PuzzleType.SUM_TARGET && (
                    <SumTargetPuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {(puzzleData.puzzleType === PuzzleType.BALANCE || puzzleData.puzzleType === PuzzleType.CUNEIFORM) && (
                    <BalancePuzzle
                        key={`balance-${adventureId}-${nodeIndex}-${activeEncounterDifficulty}`}
                        data={puzzleData}
                        onSolve={handleSolve}
                        instruction={instruction}
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
                    difficulty={activeEncounterDifficulty as number}
                    isFirstTime={isFirstTime}
                />
            )}
        </div>
    );
};

export default PuzzlePage;
