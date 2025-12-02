import { useEffect, useState } from 'react';
import styles from './ParticleEffect.module.css';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: 'explosion' | 'hit' | 'sparkle';
}

interface ParticleEffectProps {
    x: number; // Position in pixels
    y: number;
    type: 'explosion' | 'hit' | 'sparkle';
    trigger?: number; // Timestamp to trigger effect
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
    x,
    y,
    type,
    trigger = 0,
}) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (trigger > 0) {
            spawnParticles();
        }
    }, [trigger]);

    const spawnParticles = () => {
        const particleCount = type === 'explosion' ? 12 : type === 'hit' ? 8 : 6;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = type === 'explosion' ? 3 : type === 'hit' ? 2 : 1.5;

            newParticles.push({
                id: Date.now() + i,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                type,
            });
        }

        setParticles(newParticles);

        // Clear particles after animation
        setTimeout(() => {
            setParticles([]);
        }, 1000);
    };

    if (particles.length === 0) return null;

    return (
        <div className={styles.container}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`${styles.particle} ${styles[particle.type]}`}
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        '--vx': particle.vx,
                        '--vy': particle.vy,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};
