import React from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Users, Puzzle, BookOpen } from 'lucide-react';

const FEATURES = [
    {
        icon: <Map size={28} />,
        titleKey: 'landing.feature_adventures_title',
        titleDefault: 'Six Epic Adventures',
        descKey: 'landing.feature_adventures_desc',
        descDefault: 'Six magical worlds with hundreds of challenges designed for ages 6–8.',
    },
    {
        icon: <Users size={28} />,
        titleKey: 'landing.feature_companions_title',
        titleDefault: 'Grow Your Companions',
        descKey: 'landing.feature_companions_desc',
        descDefault: 'Level up Amara, Tariq, and their friends by solving math puzzles.',
    },
    {
        icon: <Puzzle size={28} />,
        titleKey: 'landing.feature_puzzles_title',
        titleDefault: 'Real Math Practice',
        descKey: 'landing.feature_puzzles_desc',
        descDefault: 'Addition, subtraction, multiplication, and division — disguised as magic.',
    },
    {
        icon: <BookOpen size={28} />,
        titleKey: 'landing.feature_progress_title',
        titleDefault: 'Save Your Journey',
        descKey: 'landing.feature_progress_desc',
        descDefault: 'Create a free account to save progress and play across any device.',
    },
] as const;

export const LandingFeatures: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="landing-features">
            <h2 className="landing-features-heading">
                {t('landing.features_heading', 'Why Math with Magic?')}
            </h2>
            <div className="landing-features-grid">
                {FEATURES.map((feature) => (
                    <div key={feature.titleKey} className="landing-feature-card">
                        <span className="landing-feature-icon" aria-hidden="true">
                            {feature.icon}
                        </span>
                        <p className="landing-feature-title">
                            {t(feature.titleKey, feature.titleDefault)}
                        </p>
                        <p className="landing-feature-desc">
                            {t(feature.descKey, feature.descDefault)}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
