import { useEffect, useState } from 'react';
import styles from './ScreenShake.module.css';


interface ScreenShakeProps {
    children: React.ReactNode;
    intensity?: 'light' | 'medium' | 'heavy';
    trigger?: number; // Timestamp to trigger shake
    className?: string;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
    children,
    intensity = 'medium',
    trigger = 0,
    className = '',
}) => {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (trigger > 0) {
            setIsShaking(true);
            const duration = intensity === 'light' ? 200 : intensity === 'medium' ? 400 : 600;
            const timer = setTimeout(() => setIsShaking(false), duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, intensity]);

    return (
        <div
            className={`${styles.container} ${isShaking ? styles[`shake-${intensity}`] : ''} ${className}`}
        >
            {children}
        </div>
    );
};
