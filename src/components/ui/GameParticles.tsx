import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, ISourceOptions } from '@tsparticles/engine';

interface GameParticlesProps {
    id?: string;
    options?: ISourceOptions;
    className?: string;
}

export const GameParticles = ({ id = "tsparticles", options, className }: GameParticlesProps) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (_container?: Container): Promise<void> => {
        // console.log(container);
    };

    if (init) {
        return (
            <Particles
                id={id}
                particlesLoaded={particlesLoaded}
                options={options}
                className={className}
            />
        );
    }

    return null;
};

// --- Presets ---

export const CONFETTI_OPTIONS: ISourceOptions = {
    fullScreen: {
        enable: false,
        zIndex: 0
    },
    particles: {
        number: {
            value: 100
        },
        color: {
            value: ["#00FFFC", "#FC00FF", "#ffb100"]
        },
        shape: {
            type: ["circle", "square"],
            options: {}
        },
        opacity: {
            value: {
                min: 0,
                max: 1
            },
            animation: {
                enable: true,
                speed: 2,
                sync: false,
                startValue: "max",
                destroy: "min"
            }
        },
        size: {
            value: {
                min: 3,
                max: 7
            }
        },
        move: {
            enable: true,
            gravity: {
                enable: true,
                acceleration: 9.81
            },
            speed: {
                min: 10,
                max: 20
            },
            decay: 0.1,
            direction: "top",
            random: false,
            straight: false,
            outModes: {
                default: "destroy",
                top: "none"
            }
        }
    },
    background: {
        color: {
            value: "transparent"
        }
    }
};

