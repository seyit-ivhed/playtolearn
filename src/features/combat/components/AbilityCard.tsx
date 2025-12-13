import { useTranslation } from 'react-i18next';

interface AbilityCardProps {
    templateId: string;
    abilityDescription: string;
}

export const AbilityCard = ({ templateId, abilityDescription }: AbilityCardProps) => {
    const { t } = useTranslation();

    return (
        <div className="ability-card">
            <p className="ability-text">
                {t(`companions.${templateId}.ability_description`, abilityDescription)}
            </p>
        </div>
    );
};
