import { useTranslation } from 'react-i18next';
import { type StatusEffect } from '../../../types/encounter.types';
import './UnitCard.css';

interface UnitStatusEffectsProps {
    statusEffects: StatusEffect[];
}

export const UnitStatusEffects = ({ statusEffects }: UnitStatusEffectsProps) => {
    const { t } = useTranslation();

    if (!statusEffects || statusEffects.length === 0) return null;

    return (
        <div className="status-effects-container">
            {statusEffects.map(effect => (
                <div
                    key={effect.id}
                    className={`status-effect-icon effect-${effect.id}`}
                    title={t(`status_effects.${effect.id}`, effect.id)}
                >
                    {effect.id === 'marked' ? '🎯' : effect.id === 'regeneration' ? '🧪' : '✨'}
                    <span className="effect-duration">{effect.duration}</span>
                </div>
            ))}
        </div>
    );
};
