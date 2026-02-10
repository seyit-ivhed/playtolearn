import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import { useGameStore } from '../../stores/game/store';
import { usePremiumStore } from '../../stores/premium.store';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { ADVENTURES } from '../../data/adventures.data';
import { PuzzleType, type PuzzleProps } from '../../types/adventure.types';
import { type DifficultyLevel } from '../../types/math.types';
import { generatePuzzleData } from '../../utils/math-generator';
import { RefillCanteenPuzzle } from './puzzles/refill-canteen/RefillCanteenPuzzle';
import { BalancePuzzle } from './puzzles/balance/BalancePuzzle';
import { SequencePuzzle } from './puzzles/sequence/SequencePuzzle';
import { SymmetryPuzzle } from './puzzles/symmetry/SymmetryPuzzle';
import { LatinSquarePuzzle } from './puzzles/latin-square/LatinSquarePuzzle';
import { NumberPathPuzzle } from './puzzles/number-path/NumberPathPuzzle';
import { EquationPuzzle } from './puzzles/equation/EquationPuzzle';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import styles from './PuzzlePage.module.css';

interface PuzzleDefinition {
    instructionKey: string;
    Component: React.ComponentType<PuzzleProps>;
    hideStandardInstruction?: boolean;
}

const PUZZLE_DEFINITIONS: Record<PuzzleType, PuzzleDefinition> = {
    [PuzzleType.REFILL_CANTEEN]: {
        instructionKey: 'puzzle.refill_canteen.instruction',
        Component: RefillCanteenPuzzle
    },
    [PuzzleType.BALANCE]: {
        instructionKey: 'puzzle.balance.instruction',
        Component: BalancePuzzle,
        hideStandardInstruction: true
    },
    [PuzzleType.SEQUENCE]: {
        instructionKey: 'puzzle.sequence.instruction',
        Component: SequencePuzzle
    },
    [PuzzleType.SYMMETRY]: {
        instructionKey: 'puzzle.symmetry.instruction',
        Component: SymmetryPuzzle
    },
    [PuzzleType.LATIN_SQUARE]: {
        instructionKey: 'puzzle.latin_square.instruction',
        Component: LatinSquarePuzzle
    },
    [PuzzleType.NUMBER_PATH]: {
        instructionKey: 'puzzle.number_path.instruction',
        Component: NumberPathPuzzle
    },
    [PuzzleType.EQUATION]: {
        instructionKey: 'puzzle.equation.instruction',
        Component: EquationPuzzle
    }
};

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

    const puzzleDef = puzzleData ? PUZZLE_DEFINITIONS[puzzleData.puzzleType] : null;

    const instruction = useMemo(() => {
        if (!puzzleDef) {
            return '';
        }
        return t(puzzleDef.instructionKey);
    }, [puzzleDef, t]);

    const isDarkBackgroundPuzzle = puzzleData?.puzzleType === PuzzleType.BALANCE;

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

    if (!encounter || !puzzleData || !puzzleDef || isLocked) {
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

    const { Component: PuzzleComponent } = puzzleDef;

    return (
        <div className={`${styles.puzzlePage} ${isDarkBackgroundPuzzle ? styles.blackBg : ''}`}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    {t('retreat', 'Retreat')}
                </button>
            </header>

            {instruction && !puzzleDef.hideStandardInstruction && (
                <div className={styles.instructionContainer}>
                    <p className={styles.instructionText}>{instruction}</p>
                </div>
            )}

            <main className={styles.puzzleContent}>
                <PuzzleComponent
                    key={`${puzzleData.puzzleType}-${adventureId}-${nodeIndex}-${activeEncounterDifficulty}`}
                    data={puzzleData}
                    onSolve={handleSolve}
                    instruction={instruction}
                />
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
