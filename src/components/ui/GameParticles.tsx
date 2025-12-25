import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { ISourceOptions } from '@tsparticles/engine';

interface GameParticlesProps {
    id?: string;
    options?: ISourceOptions;
    className?: string;
}

export const GameParticles = ({ id = "tsparticles", options, className }: GameParticlesProps) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (): Promise<void> => {
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
            value: 0
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
        life: {
            duration: {
                sync: true,
                value: 5
            },
            count: 1
        },
        move: {
            enable: true,
            gravity: {
                enable: true,
                acceleration: 15
            },
            speed: {
                min: 15,
                max: 35
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
    },
    emitters: {
        direction: "top",
        rate: {
            quantity: 10,
            delay: 0.1
        },
        size: {
            width: 100,
            height: 100
        },
        position: {
            y: 50,
            x: 50
        },
        life: {
            count: 0,
            duration: 0.1,
            delay: 0.1
        }
    }
};

