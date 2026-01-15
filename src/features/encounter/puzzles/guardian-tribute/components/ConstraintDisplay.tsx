import { useTranslation } from 'react-i18next';
import {
    type GuardianConstraint,
    GuardianConstraintType
} from '../GuardianTributeEngine';
import { GUARDIAN_SYMBOLS } from '../constants';
import { GuardianSymbolBadge } from './GuardianSymbolBadge';

interface ConstraintDisplayProps {
    constraint: GuardianConstraint;
}

export const ConstraintDisplay = ({ constraint }: ConstraintDisplayProps) => {
    const { t } = useTranslation();

    const targetSymbol = GUARDIAN_SYMBOLS[constraint.targetGuardian ?? 0];
    const Badge = (
        <GuardianSymbolBadge
            symbol={targetSymbol}
            boxSize="40px"
            size="1.5rem"
            style={{ verticalAlign: 'middle', margin: '0 0.25rem' }}
        />
    );

    switch (constraint.type) {
        case GuardianConstraintType.EXACT:
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{constraint.value}</span>
                </div>
            );

        case GuardianConstraintType.MULTIPLIER:
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {Badge}
                    <span style={{ fontSize: '1.5rem' }}>× {constraint.multiplier}</span>
                </div>
            );

        case GuardianConstraintType.ADDITION: {
            const sign = (constraint.value ?? 0) >= 0 ? '+' : '';
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {Badge}
                    <span style={{ fontSize: '1.5rem' }}>{sign}{constraint.value}</span>
                </div>
            );
        }

        case GuardianConstraintType.RANGE:
            return (
                <>
                    {t('encounter.puzzles.guardian_tribute.constraint.range', { min: constraint.min, max: constraint.max })}
                </>
            );
        case GuardianConstraintType.HALVE:
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold' }}>½</span>
                    {Badge}
                </div>
            );
        case GuardianConstraintType.COMPARISON: {
            const op = constraint.operator === 'greater' ? '>' : '<';
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{op}</span>
                    {Badge}
                </div>
            );
        }

        default:
            return null;
    }
};
