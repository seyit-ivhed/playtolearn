import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import styles from './HomePage.module.css';

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <div className={`container ${styles.pageContainer}`}>
            <LanguageSwitcher />
            <h1>{t('app_title')}</h1>
            <p className={styles.subtitle}>
                {t('subtitle')}
            </p>

            <div className={styles.buttonGroup}>
                <Link to="/mission-select">
                    <button data-testid="start-mission-btn">{t('start_mission')}</button>
                </Link>
                <Link to="/ship-bay">
                    <button data-testid="ship-bay-btn" className={styles.secondaryButton}>
                        {t('ship_bay')}
                    </button>
                </Link>

            </div>
        </div>
    );
}
