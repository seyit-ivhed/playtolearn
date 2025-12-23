import type { EncounterUnit, EncounterPhase } from '../../../types/encounter.types';
import { UnitCard } from './UnitCard';
import type { MathProblem } from '../../../types/math.types';
import styles from '../EncounterPage.module.css';

interface SpecialChallengeOverlayProps {
    challenge: {
        type: 'SPECIAL';
        unitId: string;
        problem: MathProblem;
        spotlightOpen: boolean;
        isFlipped: boolean;
    };
    party: EncounterUnit[];
    phase: EncounterPhase;
    isVFXActive: boolean;
    onComplete: (success: boolean) => void;
}

export const SpecialChallengeOverlay = ({
    challenge,
    party,
    phase,
    isVFXActive,
    onComplete
}: SpecialChallengeOverlayProps) => {
    if (!challenge.spotlightOpen || isVFXActive) return null;

    const unit = party.find(u => u.id === challenge.unitId);
    if (!unit) return null;

    return (
        <div className={styles.spotlightContainer}>
            <div className={styles.spotlightCardWrapper}>
                <UnitCard
                    unit={unit}
                    phase={phase}
                    isFlipped={challenge.isFlipped}
                    mathProblem={challenge.problem}
                    onMathAnswer={onComplete}
                />
            </div>
        </div>
    );
};
