import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { isBalanced, calculateTotalWeight } from './BalanceEngine';
import { GateVisual } from './components/GateVisual';
import styles from './BalancePuzzle.module.css';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const BalancePuzzle = ({ data, onSolve }: BalancePuzzleProps) => {

    // Initial full sets of weights
    const getInitialWeights = (side: 'left' | 'right') => {
        const initial = side === 'left' ? data.initialLeftWeight : data.initialRightWeight;
        const options = side === 'left' ? data.leftOptions : data.rightOptions;

        let sideOptions: number[] = [];
        if (options) {
            sideOptions = options.map(opt => typeof opt === 'number' ? opt : opt.value);
        } else if (data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            const midpoint = Math.ceil(allOpts.length / 2);
            sideOptions = side === 'left' ? allOpts.slice(0, midpoint) : allOpts.slice(midpoint);
        }

        return [...(initial ? [initial] : []), ...sideOptions];
    };

    // Current state of weights on plates
    const [leftWeights, setLeftWeights] = useState<number[]>(() => getInitialWeights('left'));
    const [rightWeights, setRightWeights] = useState<number[]>(() => getInitialWeights('right'));

    const [isSolved, setIsSolved] = useState(false);

    // Handle data changes - if data prop changes, we should reset state
    const [prevData, setPrevData] = useState(data);
    if (data !== prevData) {
        setPrevData(data);
        setLeftWeights(getInitialWeights('left'));
        setRightWeights(getInitialWeights('right'));
        setIsSolved(false);
    }

    const leftTotal = calculateTotalWeight(leftWeights);
    const rightTotal = calculateTotalWeight(rightWeights);

    const handleRemoveWeight = (index: number, side: 'left' | 'right') => {
        if (isSolved) return;

        let nextLeftWeights = [...leftWeights];
        let nextRightWeights = [...rightWeights];

        if (side === 'left') {
            nextLeftWeights.splice(index, 1);
            setLeftWeights(nextLeftWeights);
        } else {
            nextRightWeights.splice(index, 1);
            setRightWeights(nextRightWeights);
        }

        const nextLeftTotal = calculateTotalWeight(nextLeftWeights);
        const nextRightTotal = calculateTotalWeight(nextRightWeights);

        if (isBalanced(nextLeftTotal, nextRightTotal) && !isSolved) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 1500); // Wait for the gate animation
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftWeights(getInitialWeights('left'));
        setRightWeights(getInitialWeights('right'));
    };

    const { t } = useTranslation();

    return (
        <div className={styles.layout}>
            <div className={styles.gameBoard}>
                <GateVisual
                    leftWeights={leftWeights}
                    rightWeights={rightWeights}
                    leftTotal={leftTotal}
                    rightTotal={rightTotal}
                    isSolved={isSolved}
                    onReset={handleReset}
                    onRemoveWeight={handleRemoveWeight}
                    instruction={t('puzzle.balance.instruction_remove', 'Remove stones to open the gate!')}
                />
            </div>

        </div>
    );
};
