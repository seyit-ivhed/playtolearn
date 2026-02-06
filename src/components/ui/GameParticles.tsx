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

