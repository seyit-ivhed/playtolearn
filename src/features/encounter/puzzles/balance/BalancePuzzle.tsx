import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { isBalanced, calculateTotalWeight } from './BalanceEngine';
import { GateVisual } from './components/GateVisual';
import { WeightInventory } from './components/WeightInventory';
import styles from './BalancePuzzle.module.css';
import { PuzzleLayout } from '../components/PuzzleLayout';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const BalancePuzzle = ({ data, onSolve }: BalancePuzzleProps) => {

    // Current state of weights on plates
    const [leftWeights, setLeftWeights] = useState<number[]>(() =>
        data.initialLeftWeight ? [data.initialLeftWeight] : []
    );
    const [rightWeights, setRightWeights] = useState<number[]>(() =>
        data.initialRightWeight ? [data.initialRightWeight] : []
    );

    // Inventory state (Left vs Right specific inventories)
    const [leftInventory] = useState<number[]>(() => {
        if (data.leftOptions) return data.leftOptions.map(opt => typeof opt === 'number' ? opt : opt.value);
        if (!data.leftOptions && !data.rightOptions && data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            const midpoint = Math.ceil(allOpts.length / 2);
            return allOpts.slice(0, midpoint);
        }
        return [];
    });
    const [rightInventory] = useState<number[]>(() => {
        if (data.rightOptions) return data.rightOptions.map(opt => typeof opt === 'number' ? opt : opt.value);
        if (!data.leftOptions && !data.rightOptions && data.options) {
            const allOpts = data.options.map(opt => typeof opt === 'number' ? opt : opt.value);
            const midpoint = Math.ceil(allOpts.length / 2);
            return allOpts.slice(midpoint);
        }
        return [];
    });

    // Track used indices to disable buttons
    const [usedLeftIndices, setUsedLeftIndices] = useState<number[]>([]);
    const [usedRightIndices, setUsedRightIndices] = useState<number[]>([]);

    const [isSolved, setIsSolved] = useState(false);

    // Handle data changes - if data prop changes, we should reset state
    const [prevData, setPrevData] = useState(data);
    if (data !== prevData) {
        setPrevData(data);
        setLeftWeights(data.initialLeftWeight ? [data.initialLeftWeight] : []);
        setRightWeights(data.initialRightWeight ? [data.initialRightWeight] : []);
        setUsedLeftIndices([]);
        setUsedRightIndices([]);
        setIsSolved(false);
    }

    const leftTotal = calculateTotalWeight(leftWeights);
    const rightTotal = calculateTotalWeight(rightWeights);

    const handleAddWeight = (weight: number, index: number, side: 'left' | 'right') => {
        if (isSolved) return;

        let nextLeftTotal = leftTotal;
        let nextRightTotal = rightTotal;

        if (side === 'left') {
            if (usedLeftIndices.includes(index)) return;
            setLeftWeights(prev => [...prev, weight]);
            setUsedLeftIndices(prev => [...prev, index]);
            nextLeftTotal += weight;
        } else {
            if (usedRightIndices.includes(index)) return;
            setRightWeights(prev => [...prev, weight]);
            setUsedRightIndices(prev => [...prev, index]);
            nextRightTotal += weight;
        }

        if (isBalanced(nextLeftTotal, nextRightTotal) && !isSolved) {
            setIsSolved(true);
            onSolve();
        }
    };

    const handleReset = () => {
        if (isSolved) return;
        setLeftWeights(data.initialLeftWeight ? [data.initialLeftWeight] : []);
        setRightWeights(data.initialRightWeight ? [data.initialRightWeight] : []);
        setUsedLeftIndices([]);
        setUsedRightIndices([]);
    };

    const { t } = useTranslation();

    return (
        <PuzzleLayout
            instruction={t('puzzle.balance.instruction', 'Place stones to open the gate!')}
            onReset={handleReset}
            isSolved={isSolved}
        >
            <div className={styles.gameBoard}>
                <GateVisual
                    leftWeights={leftWeights}
                    rightWeights={rightWeights}
                    leftTotal={leftTotal}
                    rightTotal={rightTotal}
                    isSolved={isSolved}
                />

                <div className={styles.splitInventoryContainer}>
                    <WeightInventory
                        title="Left Pile"
                        side="left"
                        inventory={leftInventory}
                        usedIndices={usedLeftIndices}
                        onAddWeight={handleAddWeight}
                        isSolved={isSolved}
                    />
                    <WeightInventory
                        title="Right Pile"
                        side="right"
                        inventory={rightInventory}
                        usedIndices={usedRightIndices}
                        onAddWeight={handleAddWeight}
                        isSolved={isSolved}
                    />
                </div>
            </div>
        </PuzzleLayout>
    );
};
