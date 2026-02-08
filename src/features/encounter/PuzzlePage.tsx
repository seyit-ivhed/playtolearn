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
import { RefillCanteenPuzzle } from './puzzles/refill-canteen/RefillCanteenPuzzle';
import { BalancePuzzle } from './puzzles/balance/BalancePuzzle';
import { SequencePuzzle } from './puzzles/sequence/SequencePuzzle';
import { GuardianTributePuzzle } from './puzzles/guardian-tribute/GuardianTributePuzzle';
import { SymmetryPuzzle } from './puzzles/symmetry/SymmetryPuzzle';
import { LatinSquarePuzzle } from './puzzles/latin-square/LatinSquarePuzzle';
import { NumberPathPuzzle } from './puzzles/number-path/NumberPathPuzzle';
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
    const encounter = adventure?.encounters[nodeIndex - 1];
    const isLocked = false;

    // Dynamically generate puzzle values based on difficulty
    const puzzleData = useMemo(() => {
        const pType = encounter?.puzzleData?.puzzleType;
        if (!pType) {
            return null;
        }
        // Prefer explicit encounter difficulty if set, fallback to player preference
        const currentDifficulty = activeEncounterDifficulty as DifficultyLevel;
        return generatePuzzleData(pType, currentDifficulty);
    }, [encounter, activeEncounterDifficulty]);

    const instruction = useMemo(() => {
        if (!puzzleData) {
            return '';
        }
        switch (puzzleData.puzzleType) {
            case PuzzleType.REFILL_CANTEEN:
                return t('puzzle.refill_canteen.instruction');
            case PuzzleType.BALANCE:
                return t('puzzle.balance.instruction');
            case PuzzleType.SEQUENCE:
                return t('puzzle.sequence.instruction');
            case PuzzleType.GUARDIAN_TRIBUTE:
                return t('puzzle.guardian_tribute.instruction');
            case PuzzleType.SYMMETRY:
                return t('puzzle.symmetry.instruction');
            case PuzzleType.LATIN_SQUARE:
                return t('puzzle.latin_square.instruction');
            case PuzzleType.NUMBER_PATH:
                return t('puzzle.number_path.instruction');
            default:
                return '';
        }
    }, [puzzleData, t]);

    const isBalancePuzzle = puzzleData?.puzzleType === PuzzleType.BALANCE;

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

            {instruction && puzzleData.puzzleType !== PuzzleType.BALANCE && (
                <div className={styles.instructionContainer}>
                    <p className={styles.instructionText}>{instruction}</p>
                </div>
            )}

            <main className={styles.puzzleContent}>
                {puzzleData.puzzleType === PuzzleType.REFILL_CANTEEN && (
                    <RefillCanteenPuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {(puzzleData.puzzleType === PuzzleType.BALANCE) && (
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

                {puzzleData.puzzleType === PuzzleType.SYMMETRY && (
                    <SymmetryPuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {(puzzleData.puzzleType === PuzzleType.LATIN_SQUARE) && (
                    <LatinSquarePuzzle
                        data={puzzleData}
                        onSolve={handleSolve}
                    />
                )}

                {(puzzleData.puzzleType === PuzzleType.NUMBER_PATH) && (
                    <NumberPathPuzzle
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

                    difficulty={activeEncounterDifficulty as number}

                />
            )}
        </div>
    );
};

export default PuzzlePage;
