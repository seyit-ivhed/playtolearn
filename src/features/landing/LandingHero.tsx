import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import adventure2 from '../../assets/images/maps/adventure-2.jpg';
import adventure3 from '../../assets/images/maps/adventure-3.jpg';
import adventure4 from '../../assets/images/maps/adventure-4.jpg';
import adventure5 from '../../assets/images/maps/adventure-5.jpg';
import adventure6 from '../../assets/images/maps/adventure-6.jpg';
import kenjiCard from '../../assets/images/companions/Kenji/unit-card/kenji-2.jpg';
import zaharaCard from '../../assets/images/companions/Zahara/unit-card/zahara-2.jpg';
import amaraEvo3 from '../../assets/images/companions/Amara/unit-card/amara-3.jpg';
import tariqEvo4 from '../../assets/images/companions/Tariq/unit-card/tariq-3.jpg';
import shadowMaster from '../../assets/images/enemies/the-evil-shogun.jpg';
import spiritKing from '../../assets/images/enemies/spirit-king.jpg';

export const LandingHero: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handlePlayNow = () => {
        navigate('/chronicle');
    };

    return (
        <section className="landing-hero">
            <div className="landing-hero-content">
                <h1 className="landing-hero-headline">
                    {t('landing.hero_headline', 'Math meets adventure.')}
                </h1>
                <p className="landing-hero-tagline">
                    {t('landing.hero_tagline', 'Solve puzzles, grow magical companions, and conquer six epic worlds — all while mastering math.')}
                </p>
                <div className="landing-cta-group">
                    <button
                        className="landing-cta-button"
                        onClick={handlePlayNow}
                        data-testid="landing-play-now-btn"
                    >
                        {t('landing.hero_cta', 'Start Your Adventure')}
                    </button>
                    <p className="landing-cta-note">
                        {t('landing.hero_cta_free', 'Free to play — no account needed')}
                    </p>
                </div>
            </div>

            <div className="landing-collage-pane">
                <div className="evolution-glow" />

                <img src={adventure6} className="collage-item adv-card-5" alt="" />
                <img src={adventure2} className="collage-item adv-card-1" alt="" />
                <img src={adventure3} className="collage-item adv-card-2" alt="" />
                <img src={adventure4} className="collage-item adv-card-3" alt="" />
                <img src={adventure5} className="collage-item adv-card-4" alt="" />

                <img src={shadowMaster} className="collage-item opp-card-1" alt="" />
                <img src={spiritKing} className="collage-item opp-card-2" alt="" />

                <img src={kenjiCard} className="collage-item comp-card-1" alt="Kenji" />
                <img src={zaharaCard} className="collage-item comp-card-2" alt="Zahara" />

                <img src={amaraEvo3} className="collage-item puz-card-1" alt="Amara" />
                <img src={tariqEvo4} className="collage-item puz-card-2" alt="Tariq" />
            </div>
        </section>
    );
};
