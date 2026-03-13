import React, { useEffect } from 'react';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingFooter } from './LandingFooter';
import { analyticsService } from '../../services/analytics.service';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
    useEffect(() => {
        analyticsService.trackEvent('landing_viewed');
    }, []);

    return (
        <div className={styles.landingPage}>
            <LandingHero />
            <LandingFeatures />
            <LandingFooter />
        </div>
    );
};
